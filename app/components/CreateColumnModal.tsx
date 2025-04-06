'use client'

import { useState } from 'react'
import Modal from './Modal'

interface CreateColumnModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (title: string) => Promise<void>
}

const CreateColumnModal = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateColumnModalProps) => {
  const [title, setTitle] = useState('')
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
      await onSubmit(title)
      setTitle('')
      setError('')
    } catch (error) {
      console.error('Error creating column:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setTitle('')
    setError('')
    setIsLoading(false)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Column">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="label">
            <span className="label-text">Column Title</span>
          </label>
          <input
            type="text"
            placeholder="Enter column title"
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
              'Create Column'
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateColumnModal
