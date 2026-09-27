export const SHIPPING_THRESHOLD = 5000;
export const STANDARD_SHIPPING_FEE = 99;

/**
 * Calculates the shipping fee based on the order subtotal.
 * Free shipping for orders above SHIPPING_THRESHOLD (5000), otherwise STANDARD_SHIPPING_FEE (99).
 * @param {number} subtotal 
 * @returns {number}
 */
export function calculateShippingFee(subtotal) {
  if (subtotal >= SHIPPING_THRESHOLD || subtotal === 0) {
    return 0;
  }
  return STANDARD_SHIPPING_FEE;
}

/**
 * Calculates the total order amount (subtotal + shipping).
 * @param {number} subtotal 
 * @returns {number}
 */
export function calculateOrderTotal(subtotal) {
  return subtotal + calculateShippingFee(subtotal);
}

/**
 * Calculates progress toward free shipping.
 * @param {number} subtotal
 * @returns {{ remaining: number, percentage: number, isFree: boolean, threshold: number }}
 */
export function getFreeShippingProgress(subtotal) {
  const remaining = Math.max(0, SHIPPING_THRESHOLD - Number(subtotal || 0));
  const percentage = Math.min(100, Math.max(0, Math.round(((Number(subtotal) || 0) / SHIPPING_THRESHOLD) * 100)));
  const isFree = Number(subtotal || 0) >= SHIPPING_THRESHOLD;
  return { remaining, percentage, isFree, threshold: SHIPPING_THRESHOLD };
}

