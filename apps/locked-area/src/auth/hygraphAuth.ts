// Temporary password-based auth (no Hygraph token required)
// Change this password to something strong before launch
const VALID_PASSWORD = import.meta.env.VITE_AUTH_PASSWORD || "";

export async function loginWithPassword(password: string): Promise<boolean> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  return password === VALID_PASSWORD
}