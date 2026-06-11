import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const publicRoutes = ['/login', '/register', '/products'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ambil token dari cookie
  const token = request.cookies.get('access_token')?.value;

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route)) || pathname === '/';

  // JIKA TIDAK ADA TOKEN
  if (!token) {
    if (!isPublicRoute) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // JIKA ADA TOKEN, DECODE UNTUK CEK ROLE
  try {
    // Pastikan process.env.JWT_SECRET sudah diset di Vercel Frontend!
    const secretKey = process.env.JWT_SECRET || 'supersecretkey';
    const secret = new TextEncoder().encode(secretKey);
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role as string;

    // Route /admin/* hanya untuk admin
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/products', request.url));
    }

    // Jika sudah login dan akses /login atau /register → bypass langsung
    if (pathname === '/login' || pathname === '/register') {
      const homePath = role === 'admin' ? '/admin' : '/products';
      return NextResponse.redirect(new URL(homePath, request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // JIKA TOKEN INVALID / FAIL DECRYPT (Misal karena JWT_SECRET belum diset di Vercel)
    console.error("Middleware JWT Verify Error:", error);

    // Agar tidak STUCK / INFINITE REDIRECT di halaman login:
    // Jika user sudah berada di /login, jangan diredirect ke /login lagi!
    if (pathname === '/login') {
      return NextResponse.next();
    }

    // Hapus cookie rusak/invalid agar tidak membingungkan browser
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('access_token');
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};