import Adv_Guest_Session from "../models/guest_sessions.js"
import Task from "../models/tasks.js"
import Automation from "../models/automations.js"
import DailyStat from "../models/dailyStats.js"

export async function deleteGuestSessions(sessionId) {
    await Task.deleteMany({ userId: sessionId });
    await Automation.deleteMany({ userId: sessionId });
    await DailyStat.deleteMany({ userId: sessionId });

    await Adv_Guest_Session.findByIdAndDelete(sessionId)
}