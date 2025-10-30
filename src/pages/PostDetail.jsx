import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  ThumbsUp, 
  MessageCircle, 
  Eye, 
  Star,
  Edit,
  Trash2,
  Building2,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

const PostDetail = () => {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [commentsCount, setCommentsCount] = useState(0)
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/posts/${id}`)
        const postData = response.data.post
        setPost(postData)
        setLikesCount(postData.likesCount)
        setCommentsCount(postData.commentsCount)
        
        if (isAuthenticated) {
          const userLike = postData.likes.find(like => like.user._id === user.id)
          setIsLiked(!!userLike)
        }
      } catch (error) {
        console.error('Error fetching post:', error)
        toast.error('Failed to load post')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id, isAuthenticated, user?.id])

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like posts')
      return
    }

    try {
      const response = await axios.post(`/api/posts/${id}/like`)
      setIsLiked(response.data.isLiked)
      setLikesCount(response.data.likesCount)
    } catch (error) {
      console.error('Error liking post:', error)
      toast.error('Failed to like post')
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please login to comment')
      return
    }

    if (!comment.trim()) {
      toast.error('Please enter a comment')
      return
    }

    setSubmittingComment(true)

    try {
      const response = await axios.post(`/api/posts/${id}/comments`, {
        content: comment
      })
      
      setComment('')
      setCommentsCount(prev => prev + 1)
      
      // Add the new comment to the post
      setPost(prev => ({
        ...prev,
        comments: [...prev.comments, response.data.comment]
      }))
      
      toast.success('Comment added successfully')
    } catch (error) {
      console.error('Error adding comment:', error)
      toast.error('Failed to add comment')
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await axios.delete(`/api/posts/${id}/comments/${commentId}`)
        setCommentsCount(prev => prev - 1)
        setPost(prev => ({
          ...prev,
          comments: prev.comments.filter(comment => comment._id !== commentId)
        }))
        toast.success('Comment deleted successfully')
      } catch (error) {
        console.error('Error deleting comment:', error)
        toast.error('Failed to delete comment')
      }
    }
  }

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`/api/posts/${id}`)
        toast.success('Post deleted successfully')
        window.history.back()
      } catch (error) {
        console.error('Error deleting post:', error)
        toast.error('Failed to delete post')
      }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getOutcomeIcon = (outcome) => {
    switch (outcome) {
      case 'selected':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getOutcomeText = (outcome) => {
    switch (outcome) {
      case 'selected':
        return 'Selected'
      case 'rejected':
        return 'Rejected'
      case 'pending':
        return 'Pending'
      case 'didnt-attend':
        return "Didn't Attend"
      default:
        return outcome
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'hard':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Post not found.</p>
      </div>
    )
  }

  const isAuthor = isAuthenticated && user?.id === post.author._id

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Post Header */}
      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              {post.isHighlighted && (
                <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 rounded-full">
                  <Star className="w-4 h-4 text-yellow-600 fill-current" />
                  <span className="text-sm font-medium text-yellow-700">Featured</span>
                </div>
              )}
              <div className={`px-2 py-1 rounded-full text-sm font-medium ${getDifficultyColor(post.difficulty)}`}>
                {post.difficulty}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                {getOutcomeIcon(post.outcome)}
                {getOutcomeText(post.outcome)}
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 size={18} />
                <span>{post.company}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Briefcase size={18} />
                <span>{post.position}</span>
              </div>
              {post.location && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={18} />
                  <span>{post.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={18} />
                <span>{post.experienceType}</span>
              </div>
            </div>
          </div>

          {isAuthor && (
            <div className="flex items-center gap-2">
              <Link
                to={`/edit-post/${post._id}`}
                className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
              >
                <Edit size={20} />
              </Link>
              <button
                onClick={handleDeletePost}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <Eye size={16} />
              {post.views} views
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp size={16} />
              {likesCount} likes
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle size={16} />
              {commentsCount} comments
            </span>
            <span className="flex items-center gap-1">
              <Clock size={16} />
              {formatDate(post.createdAt)}
            </span>
          </div>
          <Link
            to={`/profile/${post.author._id}`}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
          >
            <User size={16} />
            {post.author.name}
          </Link>
        </div>

        {post.aiScore > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-medium text-gray-900">AI Quality Score: {post.aiScore}/100</span>
            </div>
            {post.aiFeedback && (
              <p className="text-sm text-gray-600">{post.aiFeedback}</p>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Experience Description</h2>
        <div className="prose prose-gray max-w-none">
          <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{post.content}</p>
        </div>
      </div>

      {/* Interview Rounds */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Interview Rounds</h2>
        <div className="space-y-6">
          {post.rounds.map((round, index) => (
            <div key={index} className="border-l-4 border-primary-200 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{round.roundName}</h3>
              {round.duration && (
                <p className="text-sm text-gray-600 mb-3">Duration: {round.duration}</p>
              )}
              <p className="text-gray-700 mb-4">{round.description}</p>

              {round.questions && round.questions.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Questions Asked:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {round.questions.map((question, qIndex) => (
                      <li key={qIndex} className="text-gray-700">{question}</li>
                    ))}
                  </ul>
                </div>
              )}

              {round.tips && round.tips.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Tips:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {round.tips.map((tip, tIndex) => (
                      <li key={tIndex} className="text-gray-700">{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Salary Information */}
      {post.salary && (
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Compensation</h2>
          </div>
          <p className="text-gray-700">{post.salary}</p>
        </div>
      )}

      {/* Engagement Section */}
      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isLiked 
                ? 'bg-primary-100 text-primary-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ThumbsUp size={20} />
            {isLiked ? 'Liked' : 'Like'} ({likesCount})
          </button>
        </div>

        {/* Comments */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Comments ({commentsCount})
          </h3>

          {/* Comment Form */}
          {isAuthenticated && (
            <form onSubmit={handleComment} className="mb-6">
              <textarea
                rows={3}
                className="input-field mb-3"
                placeholder="Share your thoughts..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingComment || !comment.trim()}
                  className="btn-primary"
                >
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <div key={comment._id} className="flex gap-3">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{comment.user.name}</span>
                    <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-700 mb-2">{comment.content}</p>
                  {isAuthenticated && (user?.id === comment.user._id || isAuthor) && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {post.comments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No comments yet. Be the first to comment!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PostDetail








