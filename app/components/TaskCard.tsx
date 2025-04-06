'use client'

import { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { SafeTask } from '@/types'
import TaskDetailModal from './TaskDetailModal'

interface TaskCardProps {
  task: SafeTask
  index: number
}

const TaskCard = ({ task, index }: TaskCardProps) => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`p-3 mb-2 bg-base-100 rounded-md shadow-sm cursor-pointer hover:shadow-md transition-shadow ${
              snapshot.isDragging ? 'task-dragging' : ''
            }`}
            onClick={() => setIsDetailModalOpen(true)}
          >
            <h3 className="font-medium text-sm mb-1">{task.title}</h3>
            {task.description && (
              <p className="text-xs text-gray-500 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        )}
      </Draggable>

      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        task={task}
      />
    </>
  )
}

export default TaskCard
