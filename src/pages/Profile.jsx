import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { 
  User, 
  Building2, 
  GraduationCap, 
  Calendar,
  BarChart3,
  ThumbsUp,
  MessageCircle,
  Eye,
  Mail
} from 'lucide-react'

const Profile = () => {
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userResponse, postsResponse] = await Promise.all([
          axios.get(`/api/users/profile/${userId}`),
          axios.get(`/api/users/${userId}/posts`)
        ])

        setUser(userResponse.data.user)
        setPosts(postsResponse.data.posts)
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">User not found.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                {user.bio && (
                  <p className="text-gray-600 mt-2">{user.bio}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.college && (
                <div className="flex items-center gap-2 text-gray-600">
                  <GraduationCap size={18} />
                  <span>{user.college}</span>
                </div>
              )}
              
              {user.branch && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 size={18} />
                  <span>{user.branch}</span>
                </div>
              )}
              
              {user.graduationYear && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={18} />
                  <span>Class of {user.graduationYear}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900">{user.postsCount}</span>
            </div>
            <div className="text-sm text-gray-600">Posts</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ThumbsUp className="w-5 h-5 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">{user.likesReceived}</span>
            </div>
            <div className="text-sm text-gray-600">Likes Received</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">{user.commentsCount}</span>
            </div>
            <div className="text-sm text-gray-600">Comments Received</div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Posts ({posts.length})</h2>
        
        {posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post._id} className="card-hover">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  <Link to={`/post/${post._id}`} className="hover:text-primary-600 transition-colors">
                    {post.title}
                  </Link>
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span>{post.company}</span>
                  <span>•</span>
                  <span>{post.position}</span>
                  <span>•</span>
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>
                
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <ThumbsUp size={14} />
                    {post.likesCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={14} />
                    {post.commentsCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={14} />
                    {post.views}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="text-gray-400 mb-4">
              <BarChart3 size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600">This user hasn't shared any interview experiences yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile







