import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/boards/[boardId] - Get a board by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { boardId: string } }
) {
  try {
    const { boardId } = params

    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        columns: {
          orderBy: { order: 'asc' },
          include: {
            tasks: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    })

    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 })
    }

    return NextResponse.json(board)
  } catch (error) {
    console.error('Error fetching board:', error)
    return NextResponse.json(
      { error: 'Failed to fetch board' },
      { status: 500 }
    )
  }
}

// PATCH /api/boards/[boardId] - Update a board
export async function PATCH(
  req: NextRequest,
  { params }: { params: { boardId: string } }
) {
  try {
    const { boardId } = params

    const board = await prisma.board.findUnique({
      where: { id: boardId },
    })

    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 })
    }

    const { title, description } = await req.json()

    const updatedBoard = await prisma.board.update({
      where: { id: boardId },
      data: {
        title: title !== undefined ? title : board.title,
        description:
          description !== undefined ? description : board.description,
      },
    })

    return NextResponse.json(updatedBoard)
  } catch (error) {
    console.error('Error updating board:', error)
    return NextResponse.json(
      { error: 'Failed to update board' },
      { status: 500 }
    )
  }
}

// DELETE /api/boards/[boardId] - Delete a board
export async function DELETE(
  req: NextRequest,
  { params }: { params: { boardId: string } }
) {
  try {
    const { boardId } = params

    const board = await prisma.board.findUnique({
      where: { id: boardId },
    })

    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 })
    }

    await prisma.board.delete({
      where: { id: boardId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting board:', error)
    return NextResponse.json(
      { error: 'Failed to delete board' },
      { status: 500 }
    )
  }
}
