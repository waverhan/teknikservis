import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback-secret-for-dev-only'
);

export async function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const hostname = request.headers.get('host') || 'localhost:3000';
    const rootDomain = process.env.ROOT_DOMAIN || 'localhost:3000';

    // 1. Tenant Detection
    let slug: string | null = null;
    let isCustomDomain = false;

    if (hostname !== rootDomain && !hostname.endsWith(`.${rootDomain}`)) {
        isCustomDomain = true;
    } else if (hostname.endsWith(`.${rootDomain}`)) {
        slug = hostname.replace(`.${rootDomain}`, '');
    }

    // Reserved Subdomains
    const reservedSubdomains = ['www', 'app', 'admin', 'api'];
    if (slug && reservedSubdomains.includes(slug.toLowerCase())) {
        slug = null;
    }

    // 2. Authentication Logic for Dashboard
    const { pathname } = url;
    let token = request.cookies.get('token')?.value;

    if (!token) {
        const authHeader = request.headers.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    }

    // Handle Authentication for Protected Routes
    if (pathname.startsWith('/dashboard')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        try {
            await jwtVerify(token, secret);
        } catch (error) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // 3. Multi-Tenant Routing
    if (!pathname.startsWith('/api') && !pathname.startsWith('/_next') && !pathname.includes('.')) {
        if (slug) {
            return NextResponse.rewrite(new URL(`/t/${slug}${pathname}`, request.url));
        }
        if (isCustomDomain) {
            // Rewrite to a domain handler that logic in Step 3/Step 8 handles via lib
            return NextResponse.rewrite(new URL(`/d/${hostname}${pathname}`, request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
