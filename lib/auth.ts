export function checkAdminPassword(password: string): boolean {
  return password === process.env.ADMIN_PASSWORD
}