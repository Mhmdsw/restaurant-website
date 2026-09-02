import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Get the current authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Protect admin dashboard
  if (!user && pathname.startsWith("/admin/dashboard")) {
    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }

  // If already logged in, don't allow access to login page
  if (user && pathname === "/admin/login") {
    return NextResponse.redirect(
      new URL("/admin/dashboard", request.url)
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/login",
  ],
};