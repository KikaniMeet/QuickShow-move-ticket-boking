import User from "../models/User.js"; 
import { Inngest } from "inngest";

export const inngest = new Inngest({ id: "movie-ticket-booking" });  // Fixed typo

const syncUserCreation = inngest.createFunction(
  { id: 'sync-user-creation' },  // Unique ID
  { event: 'clerk/user.created' },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,  // Fixed property
      name: `${first_name} ${last_name}`.trim(),
      image: image_url
    };
    await User.create(userData);  // Fixed space
  }
);

const syncUserDeletion = inngest.createFunction(
  { id: 'sync-user-deletion' },  // Unique ID
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    const { id } = event.data;
    await User.findByIdAndDelete(id);
  }
);

const syncUserUpdation = inngest.createFunction(
  { id: 'sync-user-updation' },  // Unique ID
  { event: 'clerk/user.updated' },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      email: email_addresses[0].email_address,  // Fixed property
      name: `${first_name} ${last_name}`.trim(),
      image: image_url
    };
    await User.findByIdAndUpdate(  // Fixed method name
      id, 
      userData,
      { new: true }  // Returns updated document
    );
  }
);

export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation];