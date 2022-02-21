import axios from "axios"
import Link from "next/link"

export default function Home({ todos, pageTitle }) {
  return (
    <div>
      <h1>Batata {pageTitle}</h1>
      
      {todos.map(todo => (
        <Link href={`/todos/${todo.id}`} key={todo.id} passHref>
          <a style={{ display: "block" }}>{todo.title}</a>
        </Link>
      ))}
    </div>
  )
}

export async function getServerSideProps() {
  const res = await axios.get('https://jsonplaceholder.typicode.com/todos')
  const todos = res.data

  return {
    props: {
      todos,
      pageTitle: "Todos"
    }
  }
}