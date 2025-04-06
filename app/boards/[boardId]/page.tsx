import { notFound } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import Board from '@/app/components/Board'
import Navbar from '@/app/components/Navbar'
import { SafeBoard } from '@/types'

const prisma = new PrismaClient()

interface BoardPageProps {
  params: {
    boardId: string
  }
}

export default async function BoardPage({ params }: BoardPageProps) {
  const board = await prisma.board.findUnique({
    where: { id: params.boardId },
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
    notFound()
  }

  // Convert dates to strings for serialization
  const safeBoard: SafeBoard = {
    ...board,
    createdAt: board.createdAt.toISOString(),
    updatedAt: board.updatedAt.toISOString(),
    columns: board.columns.map((column) => ({
      ...column,
      createdAt: column.createdAt.toISOString(),
      updatedAt: column.updatedAt.toISOString(),
      tasks: column.tasks.map((task) => ({
        ...task,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      })),
    })),
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow overflow-hidden">
        <Board initialBoard={safeBoard} />
      </div>
    </div>
  )
}
