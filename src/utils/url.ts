export function withBase(
  path: string,
  base: string = import.meta.env?.BASE_URL ?? '/'
): string {
  const normalizedBase = base === '/' ? '' : base.replace(/\/+$/, '');
  if (!path || path === '/') {
    return normalizedBase ? `${normalizedBase}/` : '/';
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}
