export const loginUser = async ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => {
    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
  
      return await response.json()
    } catch (err) {
      console.error("Gagal fetch ke /api/user/login:", err)
      return null
    }
  }
  