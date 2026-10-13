/**
 * Utility helper to extract drop-off spot photo URL and clean delivery notes text.
 * Handles http/https links, base64 data URLs (data:image/...), and relative paths.
 */
export function parseDeliverySpotPhotoAndNotes(customer) {
  if (!customer) return { photoUrl: null, cleanNotes: '' };

  let photoUrl = customer.delivery_spot_photo_url || customer.spot_photo || customer.delivery_spot_photo || null;
  let rawNotes = customer.delivery_notes || '';

  // Match photo in notes (matches http, https, data:image, or any string up to pipe or space)
  const photoMatch = rawNotes.match(/📸 Photo:\s*([^\s|]+)/i);
  if (photoMatch && photoMatch[1]) {
    if (!photoUrl) {
      photoUrl = photoMatch[1];
    }
  }

  // Strip out `| 📸 Photo: ...` or `📸 Photo: ...` from notes text
  let cleanNotes = rawNotes
    .replace(/\|\s*📸 Photo:\s*[^\s|]+/gi, '')
    .replace(/📸 Photo:\s*[^\s|]+/gi, '')
    .trim();

  cleanNotes = cleanNotes.replace(/^\|\s*/, '').replace(/\s*\|\s*$/, '').trim();

  return { photoUrl, cleanNotes };
}
