import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import authenticated from "./app/auth/actions/authenticated";
import { unauthenticatedRoutes } from "./app/common/constants/routes";

export async function middleware(request: NextRequest) {
  try {
    const isAuthenticated = await authenticated();
    
    if (
      !isAuthenticated &&
      !unauthenticatedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route.path)
      )
    ) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  } catch (error) {
    console.error("Authentication check failed:", error);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};