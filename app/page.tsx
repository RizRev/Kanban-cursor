import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Kanban Board</h1>
        <p className="text-lg mb-8">
          A Trello-like kanban board with drag and drop functionality
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/boards" className="btn btn-primary">
            Get Started
          </Link>
          <Link href="/boards" className="btn btn-outline">
            View Boards
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Create Boards</h2>
              <p>Organize your work with multiple customizable boards</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Manage Tasks</h2>
              <p>
                Create, edit, and organize tasks within customizable columns
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Drag & Drop</h2>
              <p>
                Easily reorganize your tasks and columns with drag and drop
                functionality
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
