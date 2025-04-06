'use client'

import { useState } from 'react'
import Modal from './Modal'
import { SafeTask } from '@/types'

interface TaskDetailModalProps {
  isOpen: boolean
  onClose: () => void
  task: SafeTask
}

const TaskDetailModal = ({
  isOpen,
  onClose,
  task: initialTask,
}: TaskDetailModalProps) => {
  const [isEditMode, setIsEditMode] = useState(false)
  const [title, setTitle] = useState(initialTask.title)
  const [description, setDescription] = useState(initialTask.description || '')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch(`/api/tasks/${initialTask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description.trim() ? description : null,
        }),
      })

      if (!response.ok) throw new Error('Failed to update task')

      setIsEditMode(false)
      // Refresh the page to get updated data
      window.location.reload()
    } catch (error) {
      console.error('Error updating task:', error)
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/tasks/${initialTask.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete task')

      onClose()
      // Refresh the page to get updated data
      window.location.reload()
    } catch (error) {
      console.error('Error deleting task:', error)
      setIsDeleting(false)
    }
  }

  const cancelEdit = () => {
    setTitle(initialTask.title)
    setDescription(initialTask.description || '')
    setError('')
    setIsEditMode(false)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={isEditMode ? cancelEdit : onClose}
      title={isEditMode ? 'Edit Task' : 'Task Details'}
    >
      {isEditMode ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="label">
              <span className="label-text">Task Title</span>
            </label>
            <input
              type="text"
              className={`input input-bordered w-full ${
                error ? 'input-error' : ''
              }`}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (e.target.value.trim()) setError('')
              }}
              autoFocus
              disabled={isSaving}
            />
            {error && <p className="text-error text-xs mt-1">{error}</p>}
          </div>

          <div>
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full h-32"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSaving}
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              className="btn btn-error btn-sm"
              onClick={handleDelete}
              disabled={isSaving || isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Deleting...
                </>
              ) : (
                'Delete Task'
              )}
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={cancelEdit}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div>
          <h3 className="text-lg font-medium">{initialTask.title}</h3>

          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-500">Description</h4>
            <p className="mt-1 whitespace-pre-wrap">
              {initialTask.description || (
                <span className="text-gray-400 italic">
                  No description provided
                </span>
              )}
            </p>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>Created: {new Date(initialTask.createdAt).toLocaleString()}</p>
            <p>
              Last Updated: {new Date(initialTask.updatedAt).toLocaleString()}
            </p>
          </div>

          <div className="flex justify-between mt-6">
            <button
              className="btn btn-error btn-sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Deleting...
                </>
              ) : (
                'Delete Task'
              )}
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setIsEditMode(true)}
            >
              Edit Task
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default TaskDetailModal
