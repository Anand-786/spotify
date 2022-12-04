import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    //token will exist if the user has logged in
    const token = await getToken({ req, secret: process.env.JWT_SECRET });

    const { pathname } = req.nextUrl

    //Allow the request if the following is true
    //1-if its a request for login
    //2-if the token exists
    if(pathname.includes('/api/auth') || token) {
        return NextResponse.next();
    }
    if (pathname.startsWith("/_next")) return NextResponse.next();
    const url = req.nextUrl.clone();
    //redirect to login if they dont have a token and are trying to request a protected route
    if(!token && !pathname.startsWith('/login')) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }
}