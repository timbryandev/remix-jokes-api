import { Link } from '@remix-run/react'

type JokeProps = {
  content: string
  id: string
  jokester?: string
  name: string
}

export default function Joke({ content, id, jokester, name }: JokeProps) {
  return (
    <section>
      <header>
        <h2>{name}</h2>
      </header>
      <p>{content}</p>
      {typeof jokester === 'string' && <p>Credit: {jokester}</p>}
      <Link to={id}>Permalink for "{name}"</Link>
    </section>
  )
}
