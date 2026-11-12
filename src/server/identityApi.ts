/**
 * Identity API & Profile Merging helpers
 * Enforces security boundaries for user migration and profile merges.
 */

export function mergeProfile(
  existingProfile: Record<string, any>,
  incomingData: Record<string, any>,
  isOwnerOrAdmin: boolean = false
): Record<string, any> {
  const merged = { ...existingProfile, ...incomingData };

  // Keep hasPremiumLearning / premiumLearningExpiresAt only if the current (real-UID) profile already has them
  // or the user is verified owner/admin; otherwise delete them from the merged result.
  const alreadyHas = Boolean(existingProfile?.hasPremiumLearning);
  if (!alreadyHas && !isOwnerOrAdmin) {
    delete merged.hasPremiumLearning;
    delete merged.premiumLearningExpiresAt;
    delete merged.premiumLearningPlan;
    delete merged.premiumLearningGateway;
  }

  return merged;
}
