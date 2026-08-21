import { Routes, Route } from 'react-router-dom'
import './App.css'
import { MainLayout } from './layouts/MainLayout'
//import Index from './pages/Index'
//import Shelf from './pages/Shelf'
import ToDo from './pages/ToDo'
import Start from './pages/Start'
import { ProtectRoutes } from './pages/protect/ProtectRoutes'
import NotFound from './pages/NotFound'
import { PublicRoutes } from './pages/protect/PublicRoutes'

function App() {
  return (
    <div className='m-0 p-0 min-h-screen bg-white dark:bg-zinc-800 transition-colors duration-300'>
      <Routes >
        <Route element={<ProtectRoutes />}>
          <Route element={<MainLayout />}>
            {/*<Route path='/' element={<Index />} /> */}
            {/* <Route path='/shelf' element={<Shelf />} />*/}
            <Route path='/' element={<ToDo />} />
            <Route path='*' element={<NotFound />} />
          </Route>
        </Route>
        <Route element={<PublicRoutes />}>
          <Route path='/start' element={<Start />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
