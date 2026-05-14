import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // টার্মিনালে চেক করার জন্য এই লগটা দিলাম
  console.log("🛡️ Middleware checking path:", path); 

  if (path.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value;
    console.log("🔑 Current Token:", token);
    
    if (!token || token !== 'authenticated') {
      console.log("🚫 Access Denied! Redirecting to login...");
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

// ম্যাচারটা আরও স্পেসিফিক করে দিলাম
export const config = {
  matcher: ['/admin', '/admin/:path*'],
};