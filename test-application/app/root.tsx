import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  Form,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'

import { LinksFunction } from '@remix-run/node'
import appStylesHref from './app.css?url'
import { createEmptyContact, getContacts } from './data'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: appStylesHref },
]

export const clientLoader = async (request: ClientLoaderFunctionArgs) => {
  const contacts = await getContacts()

  return { contacts }
}

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const contact = await createEmptyContact()
  return { contact }
}

export const App = () => {
  const { contacts } = useLoaderData<typeof clientLoader>()
  return (
    <>
      <div id="sidebar">
        <h1>Remix Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search conPtacts"
              placeholder="Search"
              type="search"
              name="q"
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
                  <Link to={`contacts/${contact.id}`}>
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{' '}
                    {contact.favorite ? <span>★</span> : null}
                  </Link>
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
      <div id="detail">
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
