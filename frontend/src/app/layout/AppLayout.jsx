import { useLocation } from 'react-router'
import { Footer } from './Footer'
import { Header } from './Header'

const authRoutes = ['/login', '/register', '/forgot-password']

export const AppLayout = ({ children }) => {
  const { pathname } = useLocation()
  const isAuthPage = authRoutes.includes(pathname)
  const isAdminPage = pathname.startsWith('/admin')
  const isHomePage = pathname === '/'

  if (isAuthPage) {
    return (
      <div className="grid min-h-screen w-full overflow-x-hidden bg-base px-4 py-8 font-sans text-primary sm:px-6 lg:px-8">
        <div className="m-auto w-full min-w-0">{children}</div>
      </div>
    )
  }

  if (isAdminPage) {
    return <div className="min-h-screen bg-base font-sans text-primary">{children}</div>
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-base font-sans text-primary">
      <Header />
      <div className={`mx-auto min-h-screen w-full min-w-0 ${isHomePage ? '' : 'pt-[72px] sm:pt-[92px]'}`}>
        <div className="min-w-0">{children}</div>
      </div>
      <Footer />
    </div>
  )
}
