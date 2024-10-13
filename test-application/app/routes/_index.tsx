import type { MetaFunction } from "@remix-run/node";
import { ClientActionFunctionArgs, ClientLoaderFunctionArgs, Form, Link, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import { createEmptyContact, getContacts } from "~/data";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const clientLoader = async (request: ClientLoaderFunctionArgs) => {
  const contacts = await getContacts();
  
  return { contacts };
}


export const clientAction = async ({
  request,
}: ClientActionFunctionArgs) => {
  const contact  = await createEmptyContact();
  return { contact };
}

export const Index = () => {
  // const { contacts } = useLoaderData() as { contacts: ContactRecord[] };
  const { contacts } = useLoaderData<typeof clientLoader>();

  return (
    <>
    <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            <Form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search contacts"
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
                      )}{" "}
                      {contact.favorite ? (
                        <span>★</span>
                      ) : null}
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

export default Index;