import { redirect } from "next/navigation"

export default function AdminPage() {
  // In a real app, check if user is authenticated and is admin
  redirect("/admin/login")
}