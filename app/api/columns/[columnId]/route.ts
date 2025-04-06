import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper function to find column
async function findColumn(columnId: string) {
  const column = await prisma.column.findUnique({
    where: { id: columnId },
    include: { board: true },
  })

  if (!column) {
    return { error: 'Column not found', status: 404 }
  }

  return { column }
}

// PATCH /api/columns/[columnId] - Update a column
export async function PATCH(
  req: NextRequest,
  { params }: { params: { columnId: string } }
) {
  try {
    const { columnId } = params

    const result = await findColumn(columnId)

    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      )
    }

    const { title, order } = await req.json()

    const updatedColumn = await prisma.column.update({
      where: { id: columnId },
      data: {
        title: title !== undefined ? title : result.column.title,
        order: order !== undefined ? order : result.column.order,
      },
    })

    return NextResponse.json(updatedColumn)
  } catch (error) {
    console.error('Error updating column:', error)
    return NextResponse.json(
      { error: 'Failed to update column' },
      { status: 500 }
    )
  }
}

// DELETE /api/columns/[columnId] - Delete a column
export async function DELETE(
  req: NextRequest,
  { params }: { params: { columnId: string } }
) {
  try {
    const { columnId } = params

    const result = await findColumn(columnId)

    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      )
    }

    await prisma.column.delete({
      where: { id: columnId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting column:', error)
    return NextResponse.json(
      { error: 'Failed to delete column' },
      { status: 500 }
    )
  }
}
