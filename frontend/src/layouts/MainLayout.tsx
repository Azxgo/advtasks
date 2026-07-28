import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";

export function MainLayout() {

    return (
        <div className="transition-colors duration-300">
            <Header />
            <div className='mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 
            bg-gray-200/10 dark:bg-zinc-800 transition-colors duration-300'>
                <div className=' p-5'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}