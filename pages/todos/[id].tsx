import axios from "axios"
import { GetStaticPaths, GetStaticProps } from "next"
import { api } from "../services/api"

export type ITodoResponse = {
  id: number
  title: string
  completed: boolean
}

export type ITodo = {
  _id: string
  name: string
  done: boolean
}

type ITodoPageProps = {
  todo: ITodo,
  pageTitle: string
}

export default function SingleTodo({ todo, pageTitle }: ITodoPageProps) {
  return (
    <main>
      <h1>{pageTitle}</h1>
      <div>
        <small>{todo._id}</small>
        <h1>{todo.name}</h1>
        <p>{todo.done ? "Completed" : "Not completed"}</p>
      </div>
    </main>
    
  )
}

export const getStaticPaths:GetStaticPaths = async () => {
  const res = await api.get<ITodoResponse[]>('/todos')
  const todos = res.data

  const paths = todos.map(todo => {
    return {
      params: { id: todo.id.toString() }
    }
  })

  return {
    paths,
    fallback: "blocking"
  }
}

export const getStaticProps:GetStaticProps<ITodoPageProps> = async (ctx) => {
  try {
    const { id } = ctx.params

    const res = await axios.get(`http://localhost:3333/todos/${id}`)
    const todoResponse = res.data

    return {
      props: {
        todo: {
          _id: todoResponse.id.toString(),
          name: todoResponse.title,
          done: todoResponse.completed
        },
        pageTitle: "Meu todo"
      },
      revalidate: 60
    }
  } catch (error) {
    return {
      notFound: true
    }
  }
}