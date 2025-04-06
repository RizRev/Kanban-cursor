'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Modal from './Modal'

const CreateBoardButton = () => {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description.trim() ? description : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const board = await response.json()

      setIsModalOpen(false)
      setTitle('')
      setDescription('')

      // Navigate to the new board
      router.push(`/boards/${board.id}`)
      router.refresh()
    } catch (error) {
      console.error('Error creating board:', error)
      setError('Failed to create board')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
        Create Board
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setTitle('')
          setDescription('')
          setError('')
        }}
        title="Create New Board"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="label">
              <span className="label-text">Board Title</span>
            </label>
            <input
              type="text"
              placeholder="Enter board title"
              className={`input input-bordered w-full ${
                error ? 'input-error' : ''
              }`}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (e.target.value.trim()) setError('')
              }}
              autoFocus
            />
            {error && <p className="text-error text-xs mt-1">{error}</p>}
          </div>

          <div>
            <label className="label">
              <span className="label-text">Description (optional)</span>
            </label>
            <textarea
              placeholder="Enter board description"
              className="textarea textarea-bordered w-full h-24"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Board'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default CreateBoardButton
