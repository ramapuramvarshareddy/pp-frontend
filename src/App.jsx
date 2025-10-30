import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import  ProtectedRoute  from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreatePost from './pages/CreatePost'
import PostDetail from './pages/PostDetail'
import EditPost from './pages/EditPost'
import Profile from './pages/Profile'
import Search from './pages/Search'
import './index.css';


function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<Search />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/profile/:userId" element={<Profile />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/create-post" element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            } />
            <Route path="/edit-post/:id" element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App








