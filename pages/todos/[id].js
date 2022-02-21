import axios from "axios"

export default function SingleTodo({ todo }) {
  return <h1>{todo.title}</h1>
}

export async function getStaticPaths() {
  const res = await axios.get('https://jsonplaceholder.typicode.com/todos')
  const todos = res.data

  const paths = todos.map(todo => ({
    params: { id: todo.id.toString() }
  }))

  return {
    paths,
    fallback: "blocking"
  }
}

export async function getStaticProps(ctx) {
  const { id } = ctx.params

  const res = await axios.get(`https://jsonplaceholder.typicode.com/todos/${id}`)
  const todo = res.data

  return {
    props: {
      todo
    },
    revalidate: 60
  }
}