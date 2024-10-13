import { redirect } from '@remix-run/react'
import invariant from 'tiny-invariant'

import { ClientActionFunctionArgs } from '@remix-run/react'
import { deleteContact } from '../data'

export const clientAction = async ({ params }: ClientActionFunctionArgs) => {
  invariant(params.contactId, 'Missing contactId param')
  await deleteContact(params.contactId)
  return redirect("/")
}