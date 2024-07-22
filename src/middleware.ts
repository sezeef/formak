import { chain } from "@/middlewares/chain";
import { withI18nMiddleware } from "@/middlewares/i18n-middleware";
import { withAuthMiddleware } from "@/middlewares/auth-middleware";

export default chain([withI18nMiddleware, withAuthMiddleware]);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"]
};
