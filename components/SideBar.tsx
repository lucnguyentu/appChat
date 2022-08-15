import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import styled from "styled-components";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVerticalIcon from "@mui/icons-material/MoreVert";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ConversationSelect from "./ConversationSelect";

import { signOut } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import * as EmailValidator from "email-validator";
import { addDoc, collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { Conversation } from "../types";

const StyledContainer = styled.div`
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: auto;
  border-right: 1px solid whitesmoke;

  /* Hide scrollbar for Chrome, Safari and Opera */
  ::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;

  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 1;
`;

const StyledUserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const StyledSearch = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 2px;
`;

const StyledSearchInput = styled.input`
  outline: none;
  border: none;
  flex: 1;
`;

const StyledSideBarButton = styled(Button)`
  width: 100%;
  border-top: 1px solid whitesmoke;
`;

const SideBar = () => {
  const [loggedInUser, _loading, _error] = useAuthState(auth);
  const [open, setOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");

  const toggleNewConversationDialog = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) setRecipientEmail("");
  };

  const closeNewConversationDialog = () => {
    toggleNewConversationDialog(false);
  };

  // get listConversations that contains email of currentUser
  const queryGetConversationsForCurrentUser = query(
    collection(db, "conversations"),
    where("users", "array-contains", loggedInUser?.email)
  );
  // useCollection will be send above query
  const [conversationsSnapshot, __loading, __error] = useCollection(
    queryGetConversationsForCurrentUser
  );

  // .docs will get all thing that was returned
  const isConversationAlreadyExists = (recipientEmail: string) =>
    conversationsSnapshot?.docs.find((conversation) =>
      (conversation.data() as Conversation).users.includes(recipientEmail)
    );

  const isInvitingSeft = recipientEmail === loggedInUser?.email;

  const createConversation = async () => {
    if (!recipientEmail) return;

    if (
      // if it is a email, return true, and else
      EmailValidator.validate(recipientEmail) &&
      !isInvitingSeft &&
      !isConversationAlreadyExists(recipientEmail)
    ) {
      // Add conversation user to db "conversations" collection
      // A conversation is between the currently logged in user and the user invited.
      await addDoc(collection(db, "conversations"), {
        users: [loggedInUser?.email, recipientEmail],
      });
    } else {
      alert("something went wrong");
    }

    closeNewConversationDialog();
  };

  const Logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log("Error Logout");
    }
  };

  return (
    <StyledContainer>
      <StyledHeader>
        {/* as string because it can be undefined */}
        <Tooltip title={loggedInUser?.email as string} placement="right">
          <StyledUserAvatar
            src={loggedInUser?.photoURL || "not found avatar"}
          />
        </Tooltip>

        <div>
          <IconButton>
            <ChatIcon></ChatIcon>
          </IconButton>
          <IconButton>
            <MoreVerticalIcon></MoreVerticalIcon>
          </IconButton>
          <IconButton onClick={Logout}>
            <LogoutIcon></LogoutIcon>
          </IconButton>
        </div>
      </StyledHeader>

      <StyledSearch>
        <SearchIcon />
        <StyledSearchInput placeholder="Search in conversation" />
      </StyledSearch>

      <StyledSideBarButton onClick={() => toggleNewConversationDialog(true)}>
        Star a new conversation
      </StyledSideBarButton>

      {/* List of conversations */}
      {conversationsSnapshot?.docs.map((conversation) => (
        <ConversationSelect
          key={conversation.id}
          id={conversation.id}
          conversationsUsers={(conversation.data() as Conversation).users}
        />
      ))}

      {
        <Dialog open={open} onClose={closeNewConversationDialog}>
          <DialogTitle>New Conversation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a Google email address for the users you wish to chat
              with
            </DialogContentText>
            <TextField
              autoFocus
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeNewConversationDialog}>Cancel</Button>
            <Button disabled={!recipientEmail} onClick={createConversation}>
              Subscribe
            </Button>
          </DialogActions>
        </Dialog>
      }
    </StyledContainer>
  );
};

export default SideBar;
