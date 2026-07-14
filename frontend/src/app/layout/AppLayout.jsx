import { useLocation } from 'react-router'
import { Footer } from './Footer'
import { Header } from './Header'

const authRoutes = ['/login', '/register']

export const AppLayout = ({ children }) => {
  const { pathname } = useLocation()
  const isAuthPage = authRoutes.includes(pathname)

  if (isAuthPage) {
    return (
      <div className="grid min-h-screen bg-[linear-gradient(135deg,#F49006_0%,#EB960E_100%)] px-4 py-8 text-[#121212] sm:px-6 lg:px-8">
        <div className="m-auto w-full">{children}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-[#121212]">
      <Header />
      <div className="mx-auto min-h-screen w-full max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="pb-14">{children}</div>
        <Footer />
      </div>
    </div>
  )
}
