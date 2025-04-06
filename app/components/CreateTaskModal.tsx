'use client'

import { useState } from 'react'
import Modal from './Modal'

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { title: string; description?: string }) => Promise<void>
}

const CreateTaskModal = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateTaskModalProps) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    setIsLoading(true)

    try {
      await onSubmit({
        title,
        description: description.trim() ? description : undefined,
      })

      setTitle('')
      setDescription('')
      setError('')
    } catch (error) {
      console.error('Error creating task:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setTitle('')
    setDescription('')
    setError('')
    setIsLoading(false)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Task">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="label">
            <span className="label-text">Task Title</span>
          </label>
          <input
            type="text"
            placeholder="Enter task title"
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
            placeholder="Enter task description"
            className="textarea textarea-bordered w-full h-24"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Creating...
              </>
            ) : (
              'Create Task'
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateTaskModal
