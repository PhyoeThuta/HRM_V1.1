/**
 * Utility helper to extract Proof of Delivery (POD) photo URLs and delivery spot photos.
 */
export function getProofOfDeliveryPhoto(orderOrGroup) {
  if (!orderOrGroup) return null;

  // Direct column on order
  if (orderOrGroup.proof_of_delivery_url) return orderOrGroup.proof_of_delivery_url;
  
  // Check inside orders list if group object
  if (Array.isArray(orderOrGroup.orders)) {
    for (const o of orderOrGroup.orders) {
      if (o.proof_of_delivery_url) return o.proof_of_delivery_url;
    }
  }

  // Check customer object if attached
  const cust = orderOrGroup.customer || orderOrGroup;
  if (cust?.delivery_spot_photo_url) return cust.delivery_spot_photo_url;

  // Check notes string matching POD or Photo
  const notes = orderOrGroup.delivery_notes || cust?.delivery_notes || '';
  const podMatch = notes.match(/📸 (?:POD|Photo):\s*([^\s|]+)/i);
  if (podMatch && podMatch[1]) return podMatch[1];

  return null;
}
