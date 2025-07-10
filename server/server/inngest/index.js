import User from "../models/User.js"; 
import { Inngest } from "inngest";

export const inngest = new Inngest({ id: "movie_ticket_booking" });

const syncUserCreation = inngest.createFunction(
  { id: "sync_user_creation" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`.trim(),
      image: image_url
    };
    await User.create(userData);
  }
);

const syncUserDeletion = inngest.createFunction(
  { id: "sync_user_deletion" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await User.findByIdAndDelete(id);
  }
);

const syncUserUpdation = inngest.createFunction(
  { id: "sync_user_updation" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`.trim(),
      image: image_url
    };
    await User.findByIdAndUpdate(id, userData, { new: true });
  }
);

export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation];
