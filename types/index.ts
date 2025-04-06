import { User, Board, Column, Task } from '@prisma/client'

export type SafeUser = Omit<User, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

export type SafeBoard = Omit<Board, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
  columns?: SafeColumn[]
}

export type SafeColumn = Omit<Column, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
  tasks?: SafeTask[]
}

export type SafeTask = Omit<Task, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}
