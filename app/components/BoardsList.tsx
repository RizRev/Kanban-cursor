'use client'

import Link from 'next/link'
import { Board } from '@prisma/client'
import { useState } from 'react'

interface BoardsListProps {
  boards: Board[]
}

const BoardsList = ({ boards }: BoardsListProps) => {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBoards = boards.filter((board) =>
    board.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search boards..."
          className="input input-bordered w-full max-w-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBoards.map((board) => (
          <Link
            key={board.id}
            href={`/boards/${board.id}`}
            className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="card-body">
              <h2 className="card-title">{board.title}</h2>
              {board.description && (
                <p className="text-sm text-gray-500 line-clamp-2">
                  {board.description}
                </p>
              )}
              <div className="card-actions justify-end mt-4">
                <span className="text-xs text-gray-500">
                  Last updated: {new Date(board.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredBoards.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No boards found</p>
        </div>
      )}
    </div>
  )
}

export default BoardsList
