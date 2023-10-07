import { Session } from "next-auth";

export function AuthCheck(session: any, admin: boolean) {
    if (session.user) {
        if (admin && session.user.admin) {
            return true
        } else if (!admin && (session.user.staff || session.user.admin)) {
            return true
        }
    }
    return false;
}