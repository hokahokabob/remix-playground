import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  Form,
  Link,
  useFetcher,
  useLoaderData,
} from '@remix-run/react'
import type { FunctionComponent } from 'react'

import invariant from 'tiny-invariant'
import { getContact, updateContact, type ContactRecord } from '../data'

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  invariant(params.contactId, 'Missing contactId param')
  const contact = await getContact(params.contactId)
  if (!contact) {
    console.error(`Contact not found for id: ${params.contactId}`)
    throw new Response('Not found', { status: 404 })
  }
  return { contact }
}

export const clientAction = async ({
  params,
  request,
}: ClientActionFunctionArgs) => {
  invariant(params.contactId, 'Missing contactId param')
  const formData = await request.formData()

  return updateContact(params.contactId, {
    favorite: formData.get('favorite') === 'true',
  })
}

export default function Contact() {
  const { contact } = useLoaderData<typeof clientLoader>()
  if (!contact) return null

  return (
    <div id="contact">
      <div>
        <img
          alt={`${contact.first} ${contact.last} avatar`}
          key={contact.avatar}
          src={contact.avatar}
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{' '}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter ? (
          <p>
            <Link to={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </Link>
          </p>
        ) : null}

        {contact.notes ? <p>{contact.notes}</p> : null}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          {/* The <Form action="destroy"> matches the new route at "contacts.$contactId.destroy" and sends it the request */}
          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                'Please confirm you want to delete this record.'
              )
              if (!response) {
                event.preventDefault()
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  )
}

const Favorite: FunctionComponent<{
  contact: Pick<ContactRecord, 'favorite'>
}> = ({ contact }) => {
  const fetcher = useFetcher()
  // Optimistic UI: we assume the mutation will succeed and update the UI immediately
  // If the mutation fails, the UI will be out of sync with the server
  const favorite = fetcher.formData
    ? fetcher.formData.get('favorite') === 'true'
    : contact.favorite

  return (
    <fetcher.Form method="post">
      {/* form that can cause mutation without page navigation */}
      <button
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        name="favorite"
        value={favorite ? 'false' : 'true'}
      >
        {favorite ? '★' : '☆'}
      </button>
    </fetcher.Form>
  )
}
