export { default } from "next-auth/middleware";

// Apply next-auth to ALL routes except specific exclusions
// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:ico|png|svg|jpg|jpeg|gif|webp)$).*)"],
// };

export const config = { matcher: ["/:path*"] }