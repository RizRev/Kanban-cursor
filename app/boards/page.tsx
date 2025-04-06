import BoardsList from '@/app/components/BoardsList'
import CreateBoardButton from '@/app/components/CreateBoardButton'
import Navbar from '@/app/components/Navbar'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function BoardsPage() {
  const boards = await prisma.board.findMany({
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Boards</h1>
          <CreateBoardButton />
        </div>

        {boards.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-lg mb-2">No boards yet</h3>
            <p className="text-gray-500 mb-6">
              Create your first board to get started
            </p>
            <CreateBoardButton />
          </div>
        ) : (
          <BoardsList boards={boards} />
        )}
      </div>
    </div>
  )
}
