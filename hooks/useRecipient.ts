import { collection, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../config/firebase";
import { AppUser, Conversation } from "../types";
import { getRecipientEmail } from "../utils/getRecipientEmail";

export const useRecipient = (conversationsUsers: Conversation['users']) => {
    const [loggedInUser, _loading, _error] = useAuthState(auth)

    // get recipientEmail
    const recipientEmail = getRecipientEmail(conversationsUsers, loggedInUser)

    // get listConversations that contains email of currentUser
    const queryGetRecipient = query(
        collection(db, "users"),
        where("users", "==", recipientEmail)
    );

    // get recipient Avatar
    const [recipientsSnapshot, __loading, __error] = useCollection(queryGetRecipient);

    // recipientSnapshot?.docs could be an empty array, and "?" will be return undefined if in this case
    const recipient = recipientsSnapshot?.docs[0]?.data() as AppUser | undefined

    return {
        recipient,
        recipientEmail
    }
}