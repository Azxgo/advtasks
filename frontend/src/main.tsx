
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import { StatsProvider } from './context/StatsContext.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { TasksProvider } from './context/TasksContext.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <TasksProvider>
          <StatsProvider>

            <App />

          </StatsProvider>
        </TasksProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
)
