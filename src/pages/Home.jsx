import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Star,
  Building2,
  Briefcase,
  Clock,
  ThumbsUp,
  Target,
  Award
} from 'lucide-react'
import { formatNumberWithCommas, formatPercentage } from '../utils/formatters'

const Home = () => {
  const [featuredPosts, setFeaturedPosts] = useState([])
  const [recentPosts, setRecentPosts] = useState([])
  const [stats, setStats] = useState({})
  const [overviewStats, setOverviewStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredResponse, recentResponse, statsResponse, overviewResponse] = await Promise.all([
          axios.get('/api/posts/featured'),
          axios.get('/api/posts?limit=6'),
          axios.get('/api/stats/trending'),
          axios.get('/api/stats/overview')
        ])

        setFeaturedPosts(featuredResponse.data.posts || [])
        setRecentPosts(recentResponse.data.posts || [])
        setStats(statsResponse.data)
        setOverviewStats(overviewResponse.data.stats || {})
      } catch (error) {
        console.error('Error fetching home data:', error)
        // Set default values in case of error
        setOverviewStats({
          totalUsers: 0,
          totalExperiences: 0,
          successRate: 0,
          uniqueCompanies: 0
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const PostCard = ({ post, featured = false }) => (
    <div className={`card-hover ${featured ? 'ring-2 ring-primary-200' : ''}`}>
      {featured && (
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm font-medium text-yellow-600">Featured</span>
        </div>
      )}
      
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
            <Link to={`/post/${post._id}`} className="hover:text-primary-600 transition-colors">
              {post.title}
            </Link>
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            <span className="flex items-center gap-1">
              <Building2 size={14} />
              {post.company}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase size={14} />
              {post.position}
            </span>
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {post.content}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <ThumbsUp size={14} />
            {post.likesCount}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle size={14} />
            {post.commentsCount}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {formatDate(post.createdAt)}
          </span>
        </div>
        <Link
          to={`/profile/${post.author._id}`}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          {post.author.name}
        </Link>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading placement statistics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Share Your Interview Experience
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
          Help fellow students prepare for placements by sharing your real interview experiences from top companies
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/create-post" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
            Share Experience
          </Link>
          <Link to="/search" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
            Explore Experiences
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <Building2 className="w-8 h-8 text-primary-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900">
            {loading ? '...' : formatNumberWithCommas(overviewStats.uniqueCompanies || 0)}
          </div>
          <div className="text-gray-600">Active Companies</div>
        </div>
        <div className="card text-center">
          <Users className="w-8 h-8 text-primary-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900">
            {loading ? '...' : formatNumberWithCommas(overviewStats.totalUsers || 0)}
          </div>
          <div className="text-gray-600">Students</div>
        </div>
        <div className="card text-center">
          <MessageCircle className="w-8 h-8 text-primary-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900">
            {loading ? '...' : formatNumberWithCommas(overviewStats.totalExperiences || 0)}
          </div>
          <div className="text-gray-600">Experiences</div>
        </div>
        <div className="card text-center">
          <Target className="w-8 h-8 text-primary-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900">
            {loading ? '...' : formatPercentage(overviewStats.successRate || 0)}
          </div>
          <div className="text-gray-600">Success Rate</div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Star className="w-6 h-6 text-yellow-500 fill-current" />
            <h2 className="text-2xl font-bold text-gray-900">Featured Experiences</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <PostCard key={post._id} post={post} featured />
            ))}
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Latest Experiences</h2>
          <Link to="/search" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </section>

      {/* Trending Companies */}
      {stats.trendingCompanies?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Trending Companies</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {stats.trendingCompanies.slice(0, 10).map((company, index) => (
              <div key={index} className="card text-center">
                <div className="font-semibold text-gray-900">{company._id}</div>
                <div className="text-sm text-gray-600">{company.count} posts</div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatPercentage(company.successRate || 0)} success rate
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Home


