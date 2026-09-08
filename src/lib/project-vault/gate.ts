/** Soft client-side gate for engineering capsule detail (paths / DNA). */

export const PROJECT_VAULT_GATE_STORAGE_KEY = "proektmap.project-vault.unlocked";

/** Soft password — intentional; override via NEXT_PUBLIC_PROJECT_VAULT_PASS at build time. */
export function getProjectVaultPassword(): string {
  const fromEnv = process.env.NEXT_PUBLIC_PROJECT_VAULT_PASS?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : "123456";
}

export function isVaultUnlockedInSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(PROJECT_VAULT_GATE_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setVaultUnlockedInSession(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(PROJECT_VAULT_GATE_STORAGE_KEY, "1");
  } catch {
    /* ignore quota / private mode */
  }
}
