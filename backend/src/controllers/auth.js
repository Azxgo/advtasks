import User from "../models/users.js"
import Adv_Device from "../models/devices.js"
import Adv_Guest_Session from "../models/guest_sessions.js"
import Task from "../models/tasks.js"
import Automation from "../models/automations.js"
import DailyStat from "../models/dailyStats.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { deleteGuestSessions } from "../utils/deleteGuestSessions.js"

export const register = async (req, res) => {
    try {
        const { email, name, password } = req.body

        if (!email || !name || !password) {
            return res.status(400).json({
                message: "Todos los campos son obligatorios"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ message: "Usuario ya existente" })
        }

        const user = await User.create({
            email,
            name,
            password: hashedPassword
        })

        const accessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        // token de refresh
        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "1d" }
        )

        // bycript
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10)

        // guardado en base de datos
        user.refreshToken = hashedRefreshToken
        await user.save()

        res.json({
            accessToken,
            refreshToken,
        })
    } catch {
        return res.status(204).json({ message: "Error al registrar" });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "Usuario no encontrado" })
        }
        // bycript
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: "Credenciales Incorrectas" })
        }

        // token de acceso
        const accessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            //CAMBIAR EN 15m
            { expiresIn: "1h" }
        )

        // token de refresh
        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        )

        // bycript
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10)

        // guardado en base de datos
        user.refreshToken = hashedRefreshToken
        await user.save()

        res.json({
            accessToken,
            refreshToken,
        })
    } catch {
        return res.status(204).json({ message: "Error al registrar" });
    }
}

export const logout = async (req, res) => {
    // toma el token del localstorage
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(204).json({ message: "No hay usuario iniciado" })
    }

    try {
        // verifica el token
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

        const user = await User.findById(payload.id)

        if (!user || !user.refreshToken) {
            return res.status(204).json({ message: "No existe ese usuario" })
        }

        // compara el bcrypt
        const isValid = await bcrypt.compare(
            refreshToken,
            user.refreshToken
        )

        if (!isValid) {
            return res.status(204).json({ message: "No coindiden" })
        }

        // Saca el refresh token de la base de datos
        user.refreshToken = null;
        await user.save();

        return res.status(204).json({ message: "Logout con exito" });
    } catch {
        return res.status(204).json({ message: "Error en el Logout" });
    }
}

export const refresh = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(204)
    }

    const user = await User.findOne({ refreshToken })

    if (!user) return res.sendStatus(403)

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403);

        const accessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        )

        res.json({ accessToken, refreshToken })
    })
}

export const checkUser = async (req, res) => {
    // saca el token de authorization del apiclient
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token denegado", valid: false });
    }

    try {
        // detecta si el token esta expirado
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return res.status(200).json({ valid: true });

    } catch (err) {
        // pone el refresh token en null en la base de datos
        if (err.name === "TokenExpiredError") {
            const decoded = jwt.decode(token);

            const user = await User.findById(decoded.id);

            if (user) {
                user.refreshToken = null;
                await user.save();
            }
        }

        return res.status(401).json({ valid: false });
    }
};

export const guest = async (req, res) => {
    const deviceId = req.headers["x-device-id"]

    if (!deviceId) {
        return res.status(204).json({ message: "Dispositivo no encontrado" })
    }

    let device = await Adv_Device.findOne({ _id: deviceId })

    if (!device) {
        device = await Adv_Device.create({
            _id: deviceId,
            created_at: new Date(),
            request_remaining: 100
        })
    }

    let existing_session = await Adv_Guest_Session.findOne(
        {
            device_id: device._id,
            expires_at: {
                "$gt": new Date()
            }
        }
    )

    if (!existing_session) {

        const expires = new Date(Date.now() + 60 * 60 * 1000)

        existing_session = await Adv_Guest_Session.create({
            device_id: device._id,
            created_at: new Date(),
            expires_at: expires
        })
    }

    return res.status(200).json({
        session_id: existing_session._id.toString(),
        expires_at: existing_session.expires_at.getTime()
    })
}

export const quitGuest = async (req, res) => {
    const { session_id } = req.body;

    if (!session_id) {
        return res.status(204).json({ message: "Sesion no encontrada" })
    }

    const session = await Adv_Guest_Session.findById(session_id)

    if (!session) {
        return res.status(204).json({ message: "Sesion no encontrada" })
    }

    await deleteGuestSessions(session_id)

    return res.status(200).json({ message: "Sesion terminada" })
}

export const check = async (req, res) => {
    const { session_id } = req.body

    if (!session_id) {
        return res.status(204).json({ message: "Sesion no encontrada" })
    }
    const session = await Adv_Guest_Session.findById(session_id)

    if (!session) {
        return res.status(204).json({ message: "Sesion no encontrada" })
    }

    if (session.expires_at <= new Date()) {
        await deleteGuestSessions(session._id);

        return res.status(401).json({ valid: false });
    }

    return res.status(200).json({ valid: true, expires_at: session.expires_at.getTime() });
}
