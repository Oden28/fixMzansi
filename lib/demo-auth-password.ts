/** Seeded accounts without password_hash use this shared secret (override in env). */
export function getDemoAuthPassword(): string {
  return process.env.DEMO_AUTH_PASSWORD ?? 'demo-pass-123';
}
