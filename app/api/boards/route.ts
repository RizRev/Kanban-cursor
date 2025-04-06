import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/boards - Get all boards
export async function GET(req: NextRequest) {
  try {
    const boards = await prisma.board.findMany({
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
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json(boards)
  } catch (error) {
    console.error('Error fetching boards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch boards' },
      { status: 500 }
    )
  }
}

// POST /api/boards - Create a new board
export async function POST(req: NextRequest) {
  try {
    const { title, description } = await req.json()

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Find or create a default guest user
    let defaultUser = await prisma.user.findFirst({
      where: { email: 'guest@example.com' },
    })

    if (!defaultUser) {
      defaultUser = await prisma.user.create({
        data: {
          email: 'guest@example.com',
          name: 'Guest User',
        },
      })
    }

    const board = await prisma.board.create({
      data: {
        title,
        description,
        userId: defaultUser.id,
      },
    })

    return NextResponse.json(board, { status: 201 })
  } catch (error) {
    console.error('Error creating board:', error)
    return NextResponse.json(
      { error: 'Failed to create board' },
      { status: 500 }
    )
  }
}
