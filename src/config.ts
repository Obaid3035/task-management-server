export const config = () => ({
  supaBaseUrl: process.env.SUPABASE_URL,
  supaBaseKey: process.env.SUPABASE_KEY,
  jwtSecret: process.env.JWT_SECRET
})
