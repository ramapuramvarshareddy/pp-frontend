import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  User, 
  LogOut, 
  Plus, 
  Search, 
  Menu, 
  X,
  Home,
  BarChart3
} from 'lucide-react'

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsProfileOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const NavLink = ({ to, children, icon: Icon, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
        isActive(to)
          ? 'bg-primary-100 text-primary-700'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </Link>
  )

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PP</span>
            </div>
            <span className="text-xl font-bold text-gradient">Placement Pulse</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" icon={Home}>Home</NavLink>
            <NavLink to="/search" icon={Search}>Search</NavLink>
            
            {isAuthenticated ? (
              <>
                <NavLink to="/create-post" icon={Plus}>Create Post</NavLink>
                <NavLink to="/dashboard" icon={BarChart3}>Dashboard</NavLink>
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <span className="text-gray-700">{user?.name}</span>
                  </button>
                  
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <Link
                        to={`/profile/${user?.id}`}
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        View Profile
                      </Link>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-2">
              <NavLink to="/" icon={Home} onClick={() => setIsMenuOpen(false)}>
                Home
              </NavLink>
              <NavLink to="/search" icon={Search} onClick={() => setIsMenuOpen(false)}>
                Search
              </NavLink>
              
              {isAuthenticated ? (
                <>
                  <NavLink to="/create-post" icon={Plus} onClick={() => setIsMenuOpen(false)}>
                    Create Post
                  </NavLink>
                  <NavLink to="/dashboard" icon={BarChart3} onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </NavLink>
                  <Link
                    to={`/profile/${user?.id}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    <User size={18} />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-gray-100"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn-primary text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar







