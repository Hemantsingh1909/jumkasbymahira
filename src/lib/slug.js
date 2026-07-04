/**
 * Helper to generate a URL-safe slug with the product ID appended at the end.
 * Example: "Gold Jhumka" (ID: 1) -> "/product/gold-jhumka-1"
 */
export function getProductUrl(product) {
  if (!product) return '#';
  const name = product.name || 'product';
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  return `/product/${slug}-${product.id}`;
}

/**
 * Extracts the product ID from the end of a slug string.
 * Example: "gold-jhumka-1" -> 1
 */
export function parseProductId(slugId) {
  if (!slugId) return null;
  const parts = String(slugId).split('-');
  const idPart = parts.pop();
  
  // Try parsing integer (since database IDs are serial integers), fallback to original (e.g. UUID)
  const parsed = parseInt(idPart, 10);
  return isNaN(parsed) ? idPart : parsed;
}
