import cron from "node-cron"
import Adv_Guest_Session from "../models/guest_sessions.js";
import { deleteGuestSessions } from "../utils/deleteGuestSessions.js";

cron.schedule("* * * * *", async () => {
    console.log("Revisando sesiones expiradas...")

    const expiredSessions = await Adv_Guest_Session.find({
        expires_at: { $lte: new Date() }
    })

    for (const session of expiredSessions) { 
        console.log("Eliminando Sesiones")

        await deleteGuestSessions(session._id)
    }
})