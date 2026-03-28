import {withAuth} from "next-auth/middleware"
import { NextResponse } from "next/server";
export default withAuth(
     function middleware(req) {
        const url= req.nextUrl.pathname;
        const token= req.nextauth.token;
        if(!token){
            if(url.startsWith("/dashboard/doctor")){
                return NextResponse.redirect(new URL("/doctor-auth/login", req.url));
            }
            return NextResponse.redirect(
              new URL("/login", req.url),
            );
        }
        const userType=token.userType;
        if(url.startsWith("/dashboard/doctor") && userType!=="doctor"){
            return NextResponse.redirect(new URL("/dashboard/patient?alert=wrong_portal",req.url));
        }
        if(url.startsWith("/dashboard/patient") && userType!=="patient"){
            return NextResponse.redirect(new URL("/dashboard/doctor?alert=wrong_portal",req.url));
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
        `/dashboard/:path*`
    ]
}