'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import Column from './Column'
import CreateColumnModal from './CreateColumnModal'
import { SafeBoard, SafeColumn, SafeTask } from '@/types'

interface BoardProps {
  initialBoard: SafeBoard
}

const Board = ({ initialBoard }: BoardProps) => {
  const [board, setBoard] = useState<SafeBoard>(initialBoard)
  const [columns, setColumns] = useState<SafeColumn[]>(
    initialBoard.columns || []
  )
  const [isCreateColumnModalOpen, setIsCreateColumnModalOpen] = useState(false)
  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')

  useEffect(() => {
    setColumns(initialBoard.columns || [])
  }, [initialBoard])

  const onDragEnd = async (result: any) => {
    const { destination, source, type } = result

    setIsDragging(true)

    // Drop outside the list
    if (!destination) {
      setIsDragging(false)
      return
    }

    // No movement
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      setIsDragging(false)
      return
    }

    // Column reordering
    if (type === 'column') {
      setLoadingMessage('Updating column order...')
      const reorderedColumns = [...columns]
      const [removed] = reorderedColumns.splice(source.index, 1)
      reorderedColumns.splice(destination.index, 0, removed)

      // Update the order property
      const updatedColumns = reorderedColumns.map((col, idx) => ({
        ...col,
        order: idx,
      }))

      setColumns(updatedColumns)

      // Save to database
      try {
        // API call to update column order
        await Promise.all(
          updatedColumns.map((column) =>
            fetch(`/api/columns/${column.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ order: column.order }),
            })
          )
        )
      } catch (error) {
        console.error('Failed to update column order:', error)
      } finally {
        setIsDragging(false)
        setLoadingMessage('')
      }
      return
    }

    // Task reordering
    const sourceColIndex = columns.findIndex(
      (col) => col.id === source.droppableId
    )
    const destColIndex = columns.findIndex(
      (col) => col.id === destination.droppableId
    )

    if (sourceColIndex === -1 || destColIndex === -1) {
      setIsDragging(false)
      return
    }

    const sourceTasks = [...(columns[sourceColIndex].tasks || [])]
    const destTasks =
      sourceColIndex === destColIndex
        ? sourceTasks
        : [...(columns[destColIndex].tasks || [])]

    // Remove the task from source
    const [removed] = sourceTasks.splice(source.index, 1)

    // Same column task reordering
    if (sourceColIndex === destColIndex) {
      setLoadingMessage('Updating task order...')
      sourceTasks.splice(destination.index, 0, removed)

      const newColumns = [...columns]
      newColumns[sourceColIndex] = {
        ...newColumns[sourceColIndex],
        tasks: sourceTasks.map((task, idx) => ({ ...task, order: idx })),
      }

      setColumns(newColumns)

      // Update task order in the database
      try {
        await Promise.all(
          sourceTasks.map((task) =>
            fetch(`/api/tasks/${task.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ order: task.order }),
            })
          )
        )
      } catch (error) {
        console.error('Failed to update task order:', error)
      } finally {
        setIsDragging(false)
        setLoadingMessage('')
      }
    } else {
      // Moving task between columns
      setLoadingMessage('Moving task to another column...')
      // Add the task to destination column
      const movedTask = {
        ...removed,
        columnId: destination.droppableId,
      }
      destTasks.splice(destination.index, 0, movedTask)

      const newColumns = [...columns]
      newColumns[sourceColIndex] = {
        ...newColumns[sourceColIndex],
        tasks: sourceTasks.map((task, idx) => ({ ...task, order: idx })),
      }
      newColumns[destColIndex] = {
        ...newColumns[destColIndex],
        tasks: destTasks.map((task, idx) => ({ ...task, order: idx })),
      }

      setColumns(newColumns)

      // Update tasks in the database
      try {
        // Update moved task (change column and order)
        await fetch(`/api/tasks/${movedTask.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            columnId: movedTask.columnId,
            order: destTasks.findIndex((t) => t.id === movedTask.id),
          }),
        })

        // Update order of tasks in source column
        await Promise.all(
          sourceTasks.map((task) =>
            fetch(`/api/tasks/${task.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ order: task.order }),
            })
          )
        )

        // Update order of tasks in destination column
        await Promise.all(
          destTasks.map((task) =>
            fetch(`/api/tasks/${task.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ order: task.order }),
            })
          )
        )
      } catch (error) {
        console.error('Failed to update tasks:', error)
      } finally {
        setIsDragging(false)
        setLoadingMessage('')
      }
    }
  }

  const handleCreateColumn = async (title: string): Promise<void> => {
    try {
      setIsAddingColumn(true)
      const response = await fetch('/api/columns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          boardId: board.id,
          order: columns.length,
        }),
      })

      if (!response.ok) throw new Error('Failed to create column')

      const newColumn = await response.json()
      setColumns([...columns, { ...newColumn, tasks: [] }])
      setIsCreateColumnModalOpen(false)
    } catch (error) {
      console.error('Error creating column:', error)
      throw error
    } finally {
      setIsAddingColumn(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 px-4">
        <div>
          <h1 className="text-2xl font-bold">{board.title}</h1>
          <p className="text-sm text-gray-500">{board.description}</p>
        </div>
        <button
          onClick={() => setIsCreateColumnModalOpen(true)}
          className="btn btn-primary btn-sm"
          disabled={isAddingColumn}
        >
          {isAddingColumn ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Adding...
            </>
          ) : (
            'Add Column'
          )}
        </button>
      </div>

      {isDragging && (
        <div className="fixed top-0 left-0 w-full h-full bg-base-200 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-4 rounded-lg shadow-lg flex flex-col items-center">
            <span className="loading loading-spinner loading-lg mb-2"></span>
            <p>{loadingMessage}</p>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex gap-4 overflow-x-auto p-4 h-full"
            >
              {columns
                .sort((a, b) => a.order - b.order)
                .map((column, index) => (
                  <Column
                    key={column.id}
                    column={column}
                    index={index}
                    boardId={board.id}
                  />
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <CreateColumnModal
        isOpen={isCreateColumnModalOpen}
        onClose={() => setIsCreateColumnModalOpen(false)}
        onSubmit={handleCreateColumn}
      />
    </div>
  )
}

export default Board
