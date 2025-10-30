import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import toast from 'react-hot-toast'

const EditPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/posts/${id}`)
        const postData = response.data.post
        setPost(postData)

        // Set form values
        setValue('title', postData.title)
        setValue('content', postData.content)
        setValue('company', postData.company)
        setValue('position', postData.position)
        setValue('location', postData.location)
        setValue('experienceType', postData.experienceType)
        setValue('difficulty', postData.difficulty)
        setValue('outcome', postData.outcome)
        setValue('salary', postData.salary)
      } catch (error) {
        console.error('Error fetching post:', error)
        toast.error('Failed to load post')
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id, navigate, setValue])

  const onSubmit = async (data) => {
    try {
      await axios.put(`/posts/${id}`, data)
      toast.success('Post updated successfully!')
      navigate(`/post/${id}`)
    } catch (error) {
      console.error('Error updating post:', error)
      toast.error(error.response?.data?.message || 'Failed to update post')
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Post</h1>
        <p className="text-gray-600">Update your interview experience</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Title *
              </label>
              <input
                type="text"
                className="input-field"
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company *
              </label>
              <input
                type="text"
                className="input-field"
                {...register('company', { required: 'Company name is required' })}
              />
              {errors.company && (
                <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position *
              </label>
              <input
                type="text"
                className="input-field"
                {...register('position', { required: 'Position is required' })}
              />
              {errors.position && (
                <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                className="input-field"
                {...register('location')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Type *
              </label>
              <select
                className="input-field"
                {...register('experienceType', { required: 'Experience type is required' })}
              >
                <option value="internship">Internship</option>
                <option value="full-time">Full-time</option>
                <option value="contract">Contract</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty *
              </label>
              <select
                className="input-field"
                {...register('difficulty', { required: 'Difficulty is required' })}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Outcome *
              </label>
              <select
                className="input-field"
                {...register('outcome', { required: 'Outcome is required' })}
              >
                <option value="selected">Selected</option>
                <option value="rejected">Rejected</option>
                <option value="pending">Pending</option>
                <option value="didnt-attend">Didn't Attend</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salary/Stipend
              </label>
              <input
                type="text"
                className="input-field"
                {...register('salary')}
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Description *
            </label>
            <textarea
              rows={6}
              className="input-field"
              {...register('content', { required: 'Content is required' })}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(`/post/${id}`)}
            className="btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            Update Post
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditPost








