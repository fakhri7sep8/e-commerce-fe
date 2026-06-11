import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const publicRoutes = ['/login', '/register', '/products'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ambil token dari cookie
  const token = request.cookies.get('access_token')?.value;

  // Jika tidak ada token dan route bukan public → redirect ke /login
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route)) || pathname === '/';

  if (!token) {
    if (!isPublicRoute) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Jika ada token, decode untuk cek role
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'supersecretkey');
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role as string;

    // Route /admin/* hanya untuk admin
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/products', request.url));
    }

    // Jika sudah login dan akses /login atau /register → redirect ke halaman sesuai role
    if (pathname === '/login' || pathname === '/register') {
      const homePath = role === 'admin' ? '/admin' : '/products';
      return NextResponse.redirect(new URL(homePath, request.url));
    }

    return NextResponse.next();
  } catch {
    // Token tidak valid (expired/diubah) → redirect ke /login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

// Konfigurasi route mana saja yang diproses middleware
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};