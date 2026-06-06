export type AuthRoutingDecision =
  | { type: 'allow' }
  | { type: 'redirect'; destination: '/dashboard' }
  | { type: 'api-unauthorized' }
  | { type: 'login-required' }

const PUBLIC_PATHS = ['/', '/login', '/register', '/api/auth', '/offline'] as const

export function isPublicPath(pathname: string): boolean {
  return (
    pathname === '/' ||
    PUBLIC_PATHS.some((path) => path !== '/' && pathname.startsWith(path))
  )
}

export function resolveAuthRouting(
  pathname: string,
  isAuthenticated: boolean,
): AuthRoutingDecision {
  const isPublic = isPublicPath(pathname)

  if (!isAuthenticated && !isPublic) {
    if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth')) {
      return { type: 'api-unauthorized' }
    }
    return { type: 'login-required' }
  }

  if (isAuthenticated && pathname === '/') {
    return { type: 'redirect', destination: '/dashboard' }
  }

  if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
    return { type: 'redirect', destination: '/dashboard' }
  }

  return { type: 'allow' }
}
