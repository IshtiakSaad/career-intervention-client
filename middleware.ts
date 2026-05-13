import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // 1. Skip middleware for public assets
    if (
        pathname.startsWith('/_next') || 
        pathname.startsWith('/api') || 
        pathname.startsWith('/favicon.ico') ||
        pathname.includes('.') // Files like .png, .jpg
    ) {
        return NextResponse.next();
    }

    // 2. Define public routes
    const isPublicRoute = 
        pathname === '/' || 
        pathname === '/login' || 
        pathname === '/register' || 
        pathname === '/about' ||
        pathname === '/consultation' ||
        pathname === '/items';


    const isProtectedRoute = !isPublicRoute;
    
    // 3. Check for tokens
    const accessToken = request.cookies.get("accessToken")?.value;
    const firebaseSession = request.cookies.get("firebase-session")?.value;

    // 4. Bypass if Firebase session exists
    if (firebaseSession || accessToken === "firebase-dummy-token") {
        return NextResponse.next();
    }

    // 5. Redirect if protected and no token
    if (isProtectedRoute && !accessToken) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
