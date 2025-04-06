import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST /api/tasks - Create a new task
export async function POST(req: NextRequest) {
  try {
    const { title, description, columnId, order } = await req.json()

    if (!title || !columnId) {
      return NextResponse.json(
        { error: 'Title and columnId are required' },
        { status: 400 }
      )
    }

    const column = await prisma.column.findUnique({
      where: { id: columnId },
      include: { board: true },
    })

    if (!column) {
      return NextResponse.json({ error: 'Column not found' }, { status: 404 })
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        order: order || 0,
        columnId,
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}
