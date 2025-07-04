import { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/client';

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  // Ambil data dari form
  const email = formData.get('email') as string;
  const nama = formData.get('fullName') as string;
  const noIdentitas = formData.get('idNumber') as string;
  const nomorTelepon = formData.get('phoneNumber') as string;
  const jenisKelamin = formData.get('gender') as string;
  const tempatLahir = formData.get('birthPlace') as string;
  const tanggalLahir = formData.get('birthDate') as string;
  const isCompanion = formData.get('isCompanion') === 'true';

  // File upload
  const fileKtp = formData.get('idCardFile') as File | null;
  const fileSuratSehat = formData.get('healthCertificateFile') as File | null;

  const supabase = createClient();

  // Get user session (if using authentication)
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  // Uncomment this if you require authentication
  // if (userError || !user) {
  //   return Response.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  // Upload file ke Supabase Storage
  let fileKtpUrl = null;
  let fileSuratSehatUrl = null;
  
  if (fileKtp) {
    const { data: uploadData, error } = await supabase.storage
      .from('ktp')
      .upload(`ktp-${Date.now()}.pdf`, fileKtp, { 
        contentType: 'application/pdf',
        upsert: false 
      });
    if (error) {
      console.error('KTP upload error:', error);
      return Response.json({ error: `Failed to upload KTP: ${error.message}` }, { status: 400 });
    }
    fileKtpUrl = uploadData?.path;
  }
  
  if (fileSuratSehat) {
    const { data: uploadData, error } = await supabase.storage
      .from('surat-sehat')
      .upload(`surat-sehat-${Date.now()}.pdf`, fileSuratSehat, { 
        contentType: 'application/pdf',
        upsert: false 
      });
    if (error) {
      console.error('Health certificate upload error:', error);
      return Response.json({ error: `Failed to upload health certificate: ${error.message}` }, { status: 400 });
    }
    fileSuratSehatUrl = uploadData?.path;
  }

  // Prepare insert data
  const insertData = {
    email,
    nama,
    noIdentitas,
    nomorTelepon,
    jenisKelamin,
    tempatLahir,
    tanggalLahir,
    fileKtp: fileKtpUrl,
    fileSuratSehat: fileSuratSehatUrl,
    isCompanion,
    // Add user_id if using user-specific RLS policies
    // user_id: user?.id,
  };

  // Insert ke tabel
  const { data, error: insertError } = await supabase
    .from('AnggotaPemesanan')
    .insert([insertData])
    .select();

  if (insertError) {
    console.error('Insert error:', insertError);
    return Response.json({ 
      error: `Failed to save data: ${insertError.message}`,
      details: insertError 
    }, { status: 400 });
  }

  return Response.json({ success: true, data }, { status: 200 });
}