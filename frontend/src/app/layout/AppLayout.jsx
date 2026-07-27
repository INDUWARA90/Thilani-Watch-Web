import { useLocation } from 'react-router'
import { Footer } from './Footer'
import { Header } from './Header'

const authRoutes = ['/login', '/register', '/forgot-password']

export const AppLayout = ({ children }) => {
  const { pathname } = useLocation()
  const isAuthPage = authRoutes.includes(pathname)
  const isAdminPage = pathname.startsWith('/admin')

  if (isAuthPage) {
    return (
      <div className="grid min-h-screen w-full overflow-x-hidden bg-base px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="glow-beam fixed left-1/2 top-20 h-px w-[min(760px,80vw)] -translate-x-1/2 bg-white/70 shadow-glow" />
        <div className="m-auto w-full min-w-0">{children}</div>
      </div>
    )
  }

  if (isAdminPage) {
    return <div className="min-h-screen bg-base text-white">{children}</div>
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-base text-white">
      <Header />
      <div className="mx-auto min-h-screen w-full min-w-0">
        <div className="min-w-0">{children}</div>
      </div>
      <Footer />
    </div>
  )
}
