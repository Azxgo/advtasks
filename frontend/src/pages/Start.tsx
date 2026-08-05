import { useState } from "react"
import { useAuthContext } from "../context/AuthContext"
import { useLocation, useNavigate } from "react-router-dom"

export default function Start() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const { register, login, guest } = useAuthContext()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [mode, setMode] = useState<"login" | "register">("login")

    const navigate = useNavigate()
    const location = useLocation()

    const from = (location.state as any)?.from?.pathname || "/";


    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            await login(email, password)

            navigate(from, { replace: true });


        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            if (!email) {
                setError("El Email es obligatorio")
                return
            }

            if (password.length < 6) {
                setError("La contraseña debe tener al menos 6 caracteres")
                return
            }

            await register(name, email, password)

            navigate(from, { replace: true });


        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const handleGuest = async () => {
        const result = await guest()
        if (!result) {
            setError("Credenciales incorrectas")
        } else {
            navigate(from, { replace: true });
        }
    }


    return (
        <div className="flex flex-col w-full justify-center items-center min-h-screen dark:text-white">
            <form
                onSubmit={mode === "login" ? handleLogin : handleRegister}
                className="flex flex-col p-4 w-full justify-center dark:bg-zinc-600/10 items-center border border-gray-300 dark:border-zinc-600 max-w-[400px]
                rounded-lg shadow-lg bg-white dark:bg-zinc-800">
                <div className="flex flex-col gap-5">
                    <h1 className="font-karnivore text-3xl mb-3">AdvTasks</h1>
                </div>

                {error && (
                    <p className="text-center text-base sm:text-lg text-red-500 font-semibold mb-2">
                        {error}
                    </p>
                )}

                {loading && (
                    <>
                        <div className="animate-spin border-2 border-zinc-400 border-t-transparent rounded-full w-4 h-4 mb-2"  />

                    </>

                )}

                <div className="flex flex-col w-full items-center gap-2">
                    {mode == "register" && (
                        <>
                            <input
                                value={name}
                                type="text"
                                placeholder="Nombre"
                                onChange={(e) => setName(e.target.value)}
                                className="border border-gray-400 dark:border-zinc-600 rounded-lg px-2 py-2
                    focus:outline-none focus:border-zinc-500 w-full"
                            />
                        </>
                    )}
                    <input
                        value={email}
                        type="text"
                        placeholder={mode === "login" ? "Correo" : "Correo"}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-gray-400 dark:border-zinc-600 rounded-lg px-2 py-2
                    focus:outline-none focus:border-zinc-500 w-full"
                    />
                    <input
                        value={password}
                        type="text"
                        placeholder="Contraseña"
                        onChange={(e) => setPassword(e.target.value)}
                        className=" w-full border border-gray-400 dark:border-zinc-600 rounded-lg px-2 py-2
                    focus:outline-none focus:border-zinc-500"
                    />
                </div>
                <button
                    type="submit"
                    className="flex w-full m-2 items-center justify-center gap-2 py-2  text-sm sm:text-base 
                    bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-100  font-semibold rounded-lg
                    transition-all duration-200 cursor-pointer
                    hover:bg-gray-100 dark:hover:bg-zinc-600 disabled:opacity-50"
                //disabled={loading}
                >
                    {mode === "login" ? "Iniciar" : "Registrar"}
                </button>
                <div className="border-t border-gray-200 dark:border-zinc-600 my-2 w-full"></div>

                <div className="flex w-full items-center gap-2 ">
                    {mode === "login" ? (
                        <button
                            type="button"
                            className="flex w-full items-center justify-center gap-2 py-2  text-sm sm:text-base 
                    bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-100  font-semibold rounded-lg
                    transition-all duration-200 cursor-pointer
                    hover:bg-gray-100 dark:hover:bg-zinc-600 disabled:opacity-50"
                            onClick={() => setMode("register")}
                        >
                            Registrarse
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="flex w-full items-center justify-center gap-2 py-2  text-sm sm:text-base 
                    bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-100  font-semibold rounded-lg
                    transition-all duration-200 cursor-pointer
                    hover:bg-gray-100 dark:hover:bg-zinc-600 disabled:opacity-50"
                            onClick={() => setMode("login")}
                        >
                            Iniciar
                        </button>
                    )}

                    <button
                        type="button"
                        className="flex w-full items-center justify-center gap-2 py-2  text-sm sm:text-base 
                    bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-100  font-semibold rounded-lg
                    transition-all duration-200 cursor-pointer
                    hover:bg-gray-100 dark:hover:bg-zinc-600 disabled:opacity-50"
                        onClick={handleGuest}
                    >
                        Entrar como invitado
                    </button>
                </div>
            </form>

        </div>
    )
}