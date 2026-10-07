// Rounds up, ignoring floating-point noise: 30 * 1.1 = 33.000000000000004 → 33, not 34.
export const roundUp = (value) => Math.ceil(value - 1e-9);
