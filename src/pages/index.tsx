import axios from "axios"
import Link from "next/link"

import { GetServerSideProps } from "next"
import { useState } from "react"
import { ITodo, ITodoResponse } from "./todos/[id]"
import { api } from "../services/api"

type IHomePageProps = {
  todos: ITodo[]
  pageTitle: string
}

type IHandleCreateTodoDTO = {
  title: string
  completed: boolean
}

export default function Home({ todos, pageTitle }: IHomePageProps) {
  const [todoList, setTodoList] = useState<ITodo[]>(todos)
  const [titleInput, setTitleInput] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const data = await handleCreateTodo({
      title: titleInput,
      completed: false
    })

    setTodoList([...todoList, data])
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleInput(e.target.value)
  }

  const handleCreateTodo = async (data: IHandleCreateTodoDTO): Promise<ITodo> => {
    const res = await api.post<ITodoResponse>('/todos', data)
    const todo = res.data

    return {
      _id: todo.id.toString(),
      name: todo.title,
      done: todo.completed
    }
  }

  return (
    <div>
      <h1>{pageTitle}</h1>

      <form onSubmit={handleSubmit}>
        <input type="text" name="title" id="title" onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
      
      {todoList.map(todo => (
        <Link href={`/todos/${todo._id}`} key={todo._id} passHref>
          <a style={{ display: "block" }}>{todo.name}</a>
        </Link>
      ))}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<IHomePageProps> = async (ctx) => {
  const res = await api.get<ITodoResponse[]>('/todos')
  const todos = res.data

  return {
    props: {
      todos: todos.map(todo => {
        return {
          _id: todo.id.toString(),
          name: todo.title,
          done: todo.completed
        }
      }),
      pageTitle: "Todos"
    }
  }
}