import { NextResponse } from 'next/server';

export function middleware(request) {
    // Current student portal middleware allows all routes
    // authentication can be added here if needed for student routes
    return NextResponse.next();
}

export const config = {
    matcher: [], // No routes matched for now, or add specific student routes to protect
};
