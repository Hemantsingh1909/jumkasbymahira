export const SHIPPING_THRESHOLD = 5000;
export const STANDARD_SHIPPING_FEE = 99;

/**
 * Calculates the shipping fee based on the order subtotal.
 * Free shipping above SHIPPING_THRESHOLD (5000), otherwise STANDARD_SHIPPING_FEE (99).
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
