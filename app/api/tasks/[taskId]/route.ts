import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper function for task lookups - removed authorization checks
async function findTask(taskId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      column: {
        include: {
          board: true,
        },
      },
    },
  })

  if (!task) {
    return { error: 'Task not found', status: 404 }
  }

  return { task }
}

// PATCH /api/tasks/[taskId] - Update a task
export async function PATCH(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const { taskId } = params

    // Removed authentication check

    const result = await findTask(taskId)

    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      )
    }

    const { title, description, columnId, order } = await req.json()

    // If changing columns, check the column exists
    if (columnId && columnId !== result.task.columnId) {
      const column = await prisma.column.findUnique({
        where: { id: columnId },
        include: { board: true },
      })

      if (!column) {
        return NextResponse.json({ error: 'Column not found' }, { status: 404 })
      }

      // Removed authorization check
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: title !== undefined ? title : result.task.title,
        description:
          description !== undefined ? description : result.task.description,
        columnId: columnId || result.task.columnId,
        order: order !== undefined ? order : result.task.order,
      },
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

// DELETE /api/tasks/[taskId] - Delete a task
export async function DELETE(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const { taskId } = params

    // Removed authentication check

    const result = await findTask(taskId)

    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      )
    }

    await prisma.task.delete({
      where: { id: taskId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}
