const PUBLIC_PATHS = ['/login', '/forbidden'];

export const isPublicPath = (pathname) => PUBLIC_PATHS.some(
  (path) => pathname === path || pathname.startsWith(`${path}/`),
);
