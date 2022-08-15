import { User } from "firebase/auth";
import { Conversation } from "../types";

// utils contains functions was used many times
export const getRecipientEmail = (
  conversationsUsers: Conversation["users"],
  loggedInUser?: User | null
) => conversationsUsers.find((userEmail) => userEmail !== loggedInUser?.email);
