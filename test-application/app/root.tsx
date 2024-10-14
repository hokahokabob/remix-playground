import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  Form,
  Links,
  Meta,
  NavLink,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useSubmit,
} from '@remix-run/react'

import { LinksFunction } from '@remix-run/node'
import { useEffect, useState } from 'react'
import appStylesHref from './app.css?url'
import { createEmptyContact, getContacts } from './data'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: appStylesHref },
]

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  const url = new URL(request.url)
  const query = url.searchParams.get('q')
  const contacts = await getContacts(query)

  return { contacts, query }
}

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const contact = await createEmptyContact()
  return redirect(`/contacts/${contact.id}/edit`)
  // return { contact }
}

export const App = () => {
  const { contacts, query } = useLoaderData<typeof clientLoader>()
  const navigation = useNavigation()
  const submit = useSubmit()
  const [queryState, setQueryState] = useState<string>(query || '')

  useEffect(() => {
    setQueryState(query || '')
  }, [query])

  return (
    <>
      <div id="sidebar">
        <h1>Remix Contacts</h1>
        <div>
          <Form id="search-form" role="search"
            onChange={
              (event) => {
                submit(event.currentTarget)
              }
            }>
            <input
              id="q"
              aria-label="Search conPtacts"
              placeholder="Search"
              type="search"
              name="q"
              onChange={(event) => setQueryState(event.currentTarget.value)}
              value={queryState}
            />
            <div id="search-spinner" aria-hidden hidden={true} />
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    className={({ isActive, isPending }) =>
                      isActive ? 'active' : isPending ? 'pending' : ''
                    }
                    to={`contacts/${contact.id}`}
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{' '}
                    {contact.favorite ? <span>★</span> : null}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        className={navigation.state === 'loading' ? 'loading' : ''}
        id="detail"
      >
        <Outlet />
      </div>

      <ScrollRestoration />
      <Scripts />
    </>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export function HydrateFallback() {
  return <p>Loading...</p>
}

export default App
