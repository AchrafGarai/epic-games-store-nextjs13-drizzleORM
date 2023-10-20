import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { CreateUser } from "@/db/user/schema";
import { createUser, deleteUser, updateUser } from "@/utils";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  const CREATE_EVENT = "user.create";

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new SVIX instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  // console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
  // console.log('Webhook body:', body)

  switch (eventType) {
    case "user.created":
      const userDto: CreateUser = {
        authId: id,
        profilePictureUrl: evt.data.image_url,
        email: evt.data.email_addresses[0].email_address,
        username: evt.data.username,
        firstName: evt.data.first_name,
        LastName: evt.data.last_name,
        createdAt: new Date(evt.data.created_at),
      };
      await createUser(userDto);
      break;
    case "user.updated":
      if (evt.data.id) {
        const userDto: CreateUser = {
          authId: id,
          profilePictureUrl: evt.data.image_url,
          email: evt.data.email_addresses[0].email_address,
          username: evt.data.username,
          firstName: evt.data.first_name,
          LastName: evt.data.last_name,
        };
        await updateUser(userDto);
      }
      break;
    case "user.deleted":
      if (evt.data.id) {
        await deleteUser(evt.data.id);
      }
      break;
  }

  return new Response("", { status: 201 });
}
