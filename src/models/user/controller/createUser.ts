export const createUser = async ({
  namaLengkap,
  email,
  password,
}: {
  namaLengkap: string
  email: string
  password: string
}) => {
  try {
    const response = await fetch("/api/user/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ namaLengkap, email, password }),
    })

    return await response.json()
  } catch (err) {
    console.error("Gagal fetch ke /api/create-user:", err)
    return null
  }
}
