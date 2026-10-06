import {withAuth} from "next-auth/middleware"
import { NextResponse } from "next/server";

export default withAuth(
     function middleware(req) {
        const url = req.nextUrl.pathname;
        const token = req.nextauth.token;

        if(!token){
            if(url.startsWith("/dashboard/admin")){
                return NextResponse.redirect(new URL("/admin-login", req.url));
            }
            if(url.startsWith("/dashboard/doctor")){
                return NextResponse.redirect(new URL("/doctor-auth/login", req.url));
            }
            if(url.startsWith("/book-appointment")){
                const loginUrl = new URL("/login", req.url);
                loginUrl.searchParams.set("callbackUrl", url);
                return NextResponse.redirect(loginUrl);
            }
            return NextResponse.redirect(new URL("/login", req.url));
        }

        const userType = token.userType;
        
        // Handling /book-appointment logic for logged in users
        if (url.startsWith("/book-appointment")) {
            if (userType !== "patient") {
                // Doctors and Admins cannot book appointments. Kick them to patient login.
                const loginUrl = new URL("/login", req.url);
                loginUrl.searchParams.set("callbackUrl", url);
                return NextResponse.redirect(loginUrl);
            }
            return NextResponse.next();
        }

        // Dashboard Route Guarding
        if(url.startsWith("/dashboard/admin") && userType !== "admin"){
            return NextResponse.redirect(new URL(`/dashboard/${userType}?alert=unauthorized`, req.url));
        }
        if(url.startsWith("/dashboard/doctor") && userType !== "doctor"){
            return NextResponse.redirect(new URL(userType === "admin" ? "/dashboard/admin" : "/dashboard/patient?alert=wrong_portal", req.url));
        }
        if(url.startsWith("/dashboard/patient") && userType !== "patient"){
            return NextResponse.redirect(new URL(userType === "admin" ? "/dashboard/admin" : "/dashboard/doctor?alert=wrong_portal", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks:{
            authorized: ()=> true,
        }
    }
)

export const config={
    matcher:[
        `/dashboard/:path*`,
        `/book-appointment/:path*`
    ]
}