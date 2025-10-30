import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { 
  Search as SearchIcon, 
  Filter,
  Building2,
  Briefcase,
  ThumbsUp,
  MessageCircle,
  Eye,
  Clock
} from 'lucide-react'

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({})
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    company: searchParams.get('company') || '',
    position: searchParams.get('position') || '',
    difficulty: searchParams.get('difficulty') || '',
    experienceType: searchParams.get('experienceType') || '',
    outcome: searchParams.get('outcome') || '',
    page: 1
  })

  useEffect(() => {
    fetchPosts()
  }, [filters])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      // Use dedicated search endpoint if there's a text query
      const endpoint = filters.q && filters.q.trim() 
        ? `/posts/search?${params.toString()}`
        : `/posts?${params.toString()}`


      const response = await axios.get(endpoint)
      setPosts(response.data.posts)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Error fetching posts:', error)
      setPosts([])
      setPagination({})
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setFilters(prev => ({ ...prev, page: 1 }))
    updateURL()
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
    updateURL()
  }

  const updateURL = () => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== 'page') params.append(key, value)
    })
    setSearchParams(params)
  }

  const clearFilters = () => {
    setFilters({
      q: '',
      company: '',
      position: '',
      difficulty: '',
      experienceType: '',
      outcome: '',
      page: 1
    })
    setSearchParams({})
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Interview Experiences</h1>
        <p className="text-gray-600">Find experiences from companies and positions you're interested in</p>
      </div>

      {/* Search Form */}
      <div className="card">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Search by title, content, or keywords..."
              value={filters.q}
              onChange={(e) => handleFilterChange('q', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., Google"
                value={filters.company}
                onChange={(e) => handleFilterChange('company', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., Software Engineer"
                value={filters.position}
                onChange={(e) => handleFilterChange('position', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                className="input-field"
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              >
                <option value="">All</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                className="input-field"
                value={filters.experienceType}
                onChange={(e) => handleFilterChange('experienceType', e.target.value)}
              >
                <option value="">All</option>
                <option value="internship">Internship</option>
                <option value="full-time">Full-time</option>
                <option value="contract">Contract</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Outcome
              </label>
              <select
                className="input-field"
                value={filters.outcome}
                onChange={(e) => handleFilterChange('outcome', e.target.value)}
              >
                <option value="">All</option>
                <option value="selected">Selected</option>
                <option value="rejected">Rejected</option>
                <option value="pending">Pending</option>
                <option value="didnt-attend">Didn't Attend</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear all filters
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center gap-2"
            >
              <SearchIcon size={18} />
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {loading ? 'Searching...' : `${pagination.total || 0} results found`}
          </h2>
          {pagination.total > 0 && (
            <div className="text-sm text-gray-600">
              Page {pagination.current} of {pagination.pages}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post._id} className="card-hover">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
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
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>

                <div className="flex items-center justify-between">
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
                  <Link
                    to={`/profile/${post.author._id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    by {post.author.name}
                  </Link>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={!pagination.hasPrev}
                  className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={!pagination.hasNext}
                  className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="text-gray-400 mb-4">
              <SearchIcon size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters.</p>
            <button
              onClick={clearFilters}
              className="btn-outline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search


