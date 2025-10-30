import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  Plus, 
  Trash2, 
  Building2, 
  Briefcase, 
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react'

const CreatePost = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [rounds, setRounds] = useState([
    { roundName: '', description: '', duration: '', questions: [''], tips: [''] }
  ])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm()

  const addRound = () => {
    setRounds([...rounds, { roundName: '', description: '', duration: '', questions: [''], tips: [''] }])
  }

  const removeRound = (index) => {
    if (rounds.length > 1) {
      setRounds(rounds.filter((_, i) => i !== index))
    }
  }

  const updateRound = (index, field, value) => {
    const updatedRounds = [...rounds]
    updatedRounds[index][field] = value
    setRounds(updatedRounds)
  }

  const addQuestion = (roundIndex) => {
    const updatedRounds = [...rounds]
    updatedRounds[roundIndex].questions.push('')
    setRounds(updatedRounds)
  }

  const removeQuestion = (roundIndex, questionIndex) => {
    const updatedRounds = [...rounds]
    updatedRounds[roundIndex].questions = updatedRounds[roundIndex].questions.filter(
      (_, i) => i !== questionIndex
    )
    setRounds(updatedRounds)
  }

  const updateQuestion = (roundIndex, questionIndex, value) => {
    const updatedRounds = [...rounds]
    updatedRounds[roundIndex].questions[questionIndex] = value
    setRounds(updatedRounds)
  }

  const addTip = (roundIndex) => {
    const updatedRounds = [...rounds]
    updatedRounds[roundIndex].tips.push('')
    setRounds(updatedRounds)
  }

  const removeTip = (roundIndex, tipIndex) => {
    const updatedRounds = [...rounds]
    updatedRounds[roundIndex].tips = updatedRounds[roundIndex].tips.filter(
      (_, i) => i !== tipIndex
    )
    setRounds(updatedRounds)
  }

  const updateTip = (roundIndex, tipIndex, value) => {
    const updatedRounds = [...rounds]
    updatedRounds[roundIndex].tips[tipIndex] = value
    setRounds(updatedRounds)
  }

  const onSubmit = async (data) => {
    // Validate rounds
    const validRounds = rounds.filter(round => 
      round.roundName.trim() && round.description.trim()
    )

    if (validRounds.length === 0) {
      toast.error('Please add at least one interview round')
      return
    }

    setLoading(true)

    try {
      const postData = {
        ...data,
        rounds: validRounds.map(round => ({
          ...round,
          questions: round.questions.filter(q => q.trim()),
          tips: round.tips.filter(t => t.trim())
        }))
      }

      const response = await axios.post('/posts', postData)
      toast.success('Post created successfully!')
      navigate(`/post/${response.data.post._id}`)
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error(error.response?.data?.message || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Share Your Interview Experience</h1>
        <p className="text-gray-600">Help fellow students by sharing your real interview experience</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Title *
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., Software Engineer Interview at Google"
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building2 size={16} className="inline mr-1" />
                Company *
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., Google, Microsoft, Amazon"
                {...register('company', { required: 'Company name is required' })}
              />
              {errors.company && (
                <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase size={16} className="inline mr-1" />
                Position Applied For *
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., Software Engineer, Product Manager"
                {...register('position', { required: 'Position is required' })}
              />
              {errors.position && (
                <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-1" />
                Location
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., Bangalore, Remote"
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
                <option value="">Select type</option>
                <option value="internship">Internship</option>
                <option value="full-time">Full-time</option>
                <option value="contract">Contract</option>
                <option value="other">Other</option>
              </select>
              {errors.experienceType && (
                <p className="mt-1 text-sm text-red-600">{errors.experienceType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level *
              </label>
              <select
                className="input-field"
                {...register('difficulty', { required: 'Difficulty level is required' })}
              >
                <option value="">Select difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              {errors.difficulty && (
                <p className="mt-1 text-sm text-red-600">{errors.difficulty.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Outcome *
              </label>
              <select
                className="input-field"
                {...register('outcome', { required: 'Outcome is required' })}
              >
                <option value="">Select outcome</option>
                <option value="selected">Selected</option>
                <option value="rejected">Rejected</option>
                <option value="pending">Pending</option>
                <option value="didnt-attend">Didn't Attend</option>
              </select>
              {errors.outcome && (
                <p className="mt-1 text-sm text-red-600">{errors.outcome.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign size={16} className="inline mr-1" />
                Salary/Stipend (Optional)
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., 15 LPA, ₹50,000/month"
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
              placeholder="Share your complete interview experience, including preparation, process, and learnings..."
              {...register('content', { required: 'Content is required' })}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>
        </div>

        {/* Interview Rounds */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Interview Rounds</h2>
            <button
              type="button"
              onClick={addRound}
              className="btn-outline flex items-center gap-2"
            >
              <Plus size={16} />
              Add Round
            </button>
          </div>

          {rounds.map((round, roundIndex) => (
            <div key={roundIndex} className="border border-gray-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Round {roundIndex + 1}</h3>
                {rounds.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRound(roundIndex)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Round Name *
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., Technical Round, HR Round"
                    value={round.roundName}
                    onChange={(e) => updateRound(roundIndex, 'roundName', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., 1 hour, 45 minutes"
                    value={round.duration}
                    onChange={(e) => updateRound(roundIndex, 'duration', e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Round Description *
                </label>
                <textarea
                  rows={3}
                  className="input-field"
                  placeholder="Describe what happened in this round..."
                  value={round.description}
                  onChange={(e) => updateRound(roundIndex, 'description', e.target.value)}
                />
              </div>

              {/* Questions */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Questions Asked
                  </label>
                  <button
                    type="button"
                    onClick={() => addQuestion(roundIndex)}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    + Add Question
                  </button>
                </div>
                {round.questions.map((question, questionIndex) => (
                  <div key={questionIndex} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      className="input-field flex-1"
                      placeholder="Enter the question..."
                      value={question}
                      onChange={(e) => updateQuestion(roundIndex, questionIndex, e.target.value)}
                    />
                    {round.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(roundIndex, questionIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Tips */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tips for Future Candidates
                  </label>
                  <button
                    type="button"
                    onClick={() => addTip(roundIndex)}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    + Add Tip
                  </button>
                </div>
                {round.tips.map((tip, tipIndex) => (
                  <div key={tipIndex} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      className="input-field flex-1"
                      placeholder="Share a helpful tip..."
                      value={tip}
                      onChange={(e) => updateTip(roundIndex, tipIndex, e.target.value)}
                    />
                    {round.tips.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTip(roundIndex, tipIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-outline"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Plus size={20} />
                Create Post
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePost








