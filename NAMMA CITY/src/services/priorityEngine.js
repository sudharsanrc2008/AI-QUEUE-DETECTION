/**
 * Evaluates priority based on base severity, issue category, and proximity to sensitive infrastructure
 */
export const calculatePriority = (baseSeverity = 'medium', category, sensitiveFactors = {}) => {
  // If base severity is explicitly emergency, it stays emergency
  if (baseSeverity === 'emergency') {
    return 'emergency';
  }

  // Count sensitive impact multipliers
  const { nearSchool, nearHospital, mainRoad, publicSafety } = sensitiveFactors;
  const sensitiveScore = (nearSchool ? 1 : 0) +
                         (nearHospital ? 2 : 0) +
                         (mainRoad ? 1 : 0) +
                         (publicSafety ? 2 : 0);

  // High hazard categories
  const highHazardCategories = ['water_leakage', 'drainage', 'environmental'];

  if (sensitiveScore >= 3 || (sensitiveScore >= 2 && highHazardCategories.includes(category))) {
    return 'emergency';
  }

  if (sensitiveScore >= 1 || baseSeverity === 'high' || highHazardCategories.includes(category)) {
    return 'high';
  }

  if (baseSeverity === 'medium') {
    return 'medium';
  }

  return 'low';
};
