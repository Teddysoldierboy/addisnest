/**
 * Normalizes internal app paths so they always start with `/`.
 * Prevents protocol-relative URLs like `//listings` → `https://listings/`.
 */
export function toAppPath(path: string): string {
  if (!path) return '/';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('mailto:') ||
    path.startsWith('tel:')
  ) {
    return path;
  }
  if (path.startsWith('/#') || path.startsWith('#')) {
    return path.startsWith('#') ? `/${path}` : path;
  }
  if (path.startsWith('/')) return path;
  return `/${path.replace(/^\/+/, '')}`;
}

/** Property detail page path */
export function propertyPath(id: string): string {
  return `/property/${encodeURIComponent(id)}`;
}

/** Admin edit path for a listing */
export function adminListingEditPath(id: string): string {
  return `/admin/listings/${encodeURIComponent(id)}/edit`;
}
