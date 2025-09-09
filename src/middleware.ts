// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

async function streamingMiddleware(request: NextRequest) {
    if (request.nextUrl.pathname === '/amethyst/controls/logs') {
        const targetUrl = new URL('http://localhost:8888/controls/logs');

        const response = await fetch(targetUrl, {
            method: request.method,
            headers: {
                'Accept': request.headers.get('Accept') || 'text/event-stream',
                'User-Agent': request.headers.get('User-Agent') || '',
            },
        });

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    }
    return null; // Continue to next middleware
}

async function authMiddleware(request: NextRequest) {
    // Get session and handle auth logic
    const session = await auth();

    if (!session && request.nextUrl.pathname.startsWith('/protected')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return null; // Continue
}

export default async function middleware(request: NextRequest) {
    // Run streaming middleware first
    const streamingResult = await streamingMiddleware(request);
    if (streamingResult) return streamingResult;

    // Then run auth middleware
    const authResult = await authMiddleware(request);
    if (authResult) return authResult;

    // Continue to the next handler
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
        '/amethyst/controls/logs'
    ],
};
