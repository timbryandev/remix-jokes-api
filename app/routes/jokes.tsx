import type { LinksFunction, LoaderFunction } from '@remix-run/node'
import type { Joke } from '@prisma/client'
import { json } from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'

import { db } from '~/utils/db.server'
import { getUser } from '~/utils/session.server'
import stylesUrl from '~/styles/jokes.css'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }]
}

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>
  jokeListItems: Array<{ id: Joke['id']; name: Joke['name'] }>
}

export const loader: LoaderFunction = async ({ request }) => {
  const jokeListItems = await db.joke.findMany({
    take: 100, // TODO: Need to add some pagination
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true },
  })

  const user = await getUser(request)

  const data: LoaderData = {
    jokeListItems,
    user,
  }

  return json(data)
}

export default function JokesRoute() {
  const data = useLoaderData<LoaderData>()

  function renderJokesList() {
    return data.jokeListItems.map(joke => (
      <li key={joke.id}>
        <Link to={joke.id}>{joke.name}</Link>
      </li>
    ))
  }

  return (
    <div className='jokes-layout'>
      <header className='jokes-header'>
        <div className='container'>
          <h1 className='home-link'>
            <Link to='/' title='Remix Jokes' aria-label='Remix Jokes'>
              <span className='logo'>🤪</span>
              <span className='logo-medium'>J🤪KES</span>
            </Link>
          </h1>
          {data.user ? (
            <div className='user-info'>
              <span>{`Hi ${data.user.username}`}</span>
              <form action='/logout' method='post'>
                <button type='submit' className='button'>
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <Link to='/login'>Login</Link>
          )}
        </div>
      </header>
      <main className='jokes-main'>
        <div className='container'>
          <article className='jokes-list'>
            <p>
              <Link to='.'>Get a random joke</Link>
            </p>
            <p>
              <Link to='new' className='button'>
                Add your own
              </Link>
            </p>
            <p>
              <input type='checkbox' name='' id='' /> Include{' '}
              <abbr title='Not Safe For Work'>NSFW</abbr>
            </p>
            <p>Here are a few more jokes to check out:</p>
            <ul>{renderJokesList()}</ul>
          </article>
          <article className='jokes-outlet'>
            <Outlet />
          </article>
        </div>
      </main>
      <footer className='jokes-footer'>
        <div className='container'>
          <p>
            Not 100% satisfied? Maybe try the infinitely superior{' '}
            <a href='https://icanhazdadjoke.com/'>icanhazdadjoke.com</a>!
          </p>
          <p>
            Developed by <a href='https://timbryan.dev'>Tim Bryan.dev</a>.
          </p>
        </div>
      </footer>
    </div>
  )
}
