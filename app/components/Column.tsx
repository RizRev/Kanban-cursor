'use client'

import { useState } from 'react'
import { Draggable, Droppable } from '@hello-pangea/dnd'
import TaskCard from './TaskCard'
import CreateTaskModal from './CreateTaskModal'
import { SafeColumn, SafeTask } from '@/types'

interface ColumnProps {
  column: SafeColumn
  index: number
  boardId: string
}

const Column = ({ column, index, boardId }: ColumnProps) => {
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [title, setTitle] = useState(column.title)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSavingTitle, setIsSavingTitle] = useState(false)
  const [isAddingTask, setIsAddingTask] = useState(false)

  const handleCreateTask = async (taskData: {
    title: string
    description?: string
  }): Promise<void> => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskData,
          columnId: column.id,
          order: column.tasks?.length || 0,
        }),
      })

      if (!response.ok) throw new Error('Failed to create task')

      // Refresh the page to get updated data
      window.location.reload()
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }

  const handleTitleChange = async () => {
    if (title === column.title) {
      setIsEditMode(false)
      return
    }

    setIsSavingTitle(true)

    try {
      const response = await fetch(`/api/columns/${column.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })

      if (!response.ok) throw new Error('Failed to update column title')

      // Successful update
      setIsEditMode(false)
    } catch (error) {
      console.error('Error updating column title:', error)
      // Reset to original title on error
      setTitle(column.title)
      setIsEditMode(false)
    } finally {
      setIsSavingTitle(false)
    }
  }

  const handleDeleteColumn = async () => {
    if (
      !confirm(
        'Are you sure you want to delete this column? All tasks will be deleted.'
      )
    ) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/columns/${column.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete column')

      // Refresh the page to get updated data
      window.location.reload()
    } catch (error) {
      console.error('Error deleting column:', error)
      setIsDeleting(false)
    }
  }

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`w-72 flex-shrink-0 bg-base-200 rounded-lg shadow ${
            snapshot.isDragging ? 'column-dragging' : ''
          }`}
        >
          <div
            {...provided.dragHandleProps}
            className="p-3 font-semibold bg-base-300 rounded-t-lg flex justify-between items-center"
          >
            {isEditMode ? (
              <div className="w-full flex items-center">
                <input
                  type="text"
                  className="input input-sm flex-grow"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleChange}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleTitleChange()
                    if (e.key === 'Escape') {
                      setTitle(column.title)
                      setIsEditMode(false)
                    }
                  }}
                  disabled={isSavingTitle}
                />
                {isSavingTitle && (
                  <span className="loading loading-spinner loading-sm ml-2"></span>
                )}
              </div>
            ) : (
              <div
                className="cursor-pointer"
                onClick={() => setIsEditMode(true)}
              >
                {column.title}
              </div>
            )}
            <div className="flex gap-1">
              <button
                className="btn btn-xs btn-ghost"
                onClick={() => setIsCreateTaskModalOpen(true)}
              >
                +
              </button>
              <button
                className="btn btn-xs btn-ghost btn-error"
                onClick={handleDeleteColumn}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  '×'
                )}
              </button>
            </div>
          </div>

          <Droppable droppableId={column.id} type="task">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="p-2 min-h-[100px] max-h-[calc(100vh-200px)] overflow-y-auto"
              >
                {column.tasks
                  ?.sort((a, b) => a.order - b.order)
                  .map((task, index) => (
                    <TaskCard key={task.id} task={task} index={index} />
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="p-2 border-t border-base-300">
            <button
              onClick={() => setIsCreateTaskModalOpen(true)}
              className="btn btn-ghost btn-sm w-full text-left justify-start"
              disabled={isAddingTask}
            >
              {isAddingTask ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-1"></span>
                  Adding task...
                </>
              ) : (
                '+ Add a task'
              )}
            </button>
          </div>

          <CreateTaskModal
            isOpen={isCreateTaskModalOpen}
            onClose={() => setIsCreateTaskModalOpen(false)}
            onSubmit={async (data) => {
              setIsAddingTask(true)
              try {
                await handleCreateTask(data)
              } finally {
                setIsAddingTask(false)
              }
            }}
          />
        </div>
      )}
    </Draggable>
  )
}

export default Column
