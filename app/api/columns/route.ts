import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST /api/columns - Create a new column
export async function POST(req: NextRequest) {
  try {
    const { title, boardId, order } = await req.json()

    if (!title || !boardId) {
      return NextResponse.json(
        { error: 'Title and boardId are required' },
        { status: 400 }
      )
    }

    const board = await prisma.board.findUnique({
      where: { id: boardId },
    })

    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 })
    }

    const column = await prisma.column.create({
      data: {
        title,
        order: order || 0,
        boardId,
      },
    })

    return NextResponse.json(column, { status: 201 })
  } catch (error) {
    console.error('Error creating column:', error)
    return NextResponse.json(
      { error: 'Failed to create column' },
      { status: 500 }
    )
  }
}
