import jwt from "jsonwebtoken"
import Adv_Guest_Session from "../models/guest_sessions.js"

const JWT_SECRET = "EPICPAPUS"

export const verifyAccessToken = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (authHeader) {
        const token = authHeader.split(" ")[1]

        if (!token) return res.sendStatus(401)

        try {
            const decoded = jwt.verify(token, JWT_SECRET)

            req.user = decoded
            return next()
        } catch {
            return res.sendStatus(403)
        }
    }

    const session_id = req.headers["x-guest-session"];

    if (session_id) {
        const session = await Adv_Guest_Session.findById(session_id)

        if (!session) {
            return res.sendStatus(403);
        }

        req.guestSession = session;
        return next();
    }

    return res.sendStatus(401);
}