import { async } from "@firebase/util"
import { doc, getDoc, getDocs } from "firebase/firestore"
import { GetServerSideProps } from "next"
import Head from "next/head"
import { useAuthState } from "react-firebase-hooks/auth"
import styled from "styled-components"
import ConversationScreen from "../../components/ConversationScreen"
import SideBar from "../../components/SideBar"
import { auth, db } from "../../config/firebase"
import { Conversation, IMessage } from "../../types"
import { generateQueryGetMessages, transformMessage } from "../../utils/getMessagesInConversation"
import { getRecipientEmail } from "../../utils/getRecipientEmail"

const StyledContainer = styled.div`
    display: flex;
`

const StyledConversationContainer = styled.div`
    flex-grow: 1;
    overflow: scroll;
    height: 100vh;

    /* Hide scrollbar for Chrome, Safari and Opera */
    ::-webkit-scrollbar {
        display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
`

interface Props {
    conversation: Conversation
    messages: IMessage[]
}

const Conversation = ({conversation, messages}: Props) => {
    const [loggedInUser, _loading, _error] = useAuthState(auth)

    return (
        <StyledContainer>
            {/* USE SEVER SIDE RENDERING */}
            <Head>
                <title>Conversation With {getRecipientEmail(conversation.users, loggedInUser)}</title>
            </Head>

            <SideBar/>

            <StyledConversationContainer>
                <ConversationScreen conversation={conversation} messages={messages}/>
            </StyledConversationContainer>
{/* 
            {
                messages && messages.map((message, index) => <p key={index}>{JSON.stringify(message)}</p>)
            } */}
        </StyledContainer>
    )
}

export default Conversation

// get data from server side and put it to client
export const getServerSideProps: GetServerSideProps<Props, {id: string}> = async (context) => {
    const conversationId = context.params?.id
    
    // get conversation to know we are chatting with
    const conversationRef = doc(db, "conversations", conversationId as string) // find by id and return a reference
    const conversationSnapshot = await getDoc(conversationRef) // same as useCollection of react-hooks-firebase, but it's gonna send query to server

   // get all messages between logged in user and recipient user
   const queryMessages = generateQueryGetMessages(conversationId) 
   const messagesSnapshot = await getDocs(queryMessages)

   const messages = messagesSnapshot.docs.map(messageDoc => transformMessage(messageDoc))
   
    // image this block code as server, we will return data for frontend through props
    return {
        props: {
            conversation: conversationSnapshot.data() as Conversation,
            messages
        },
    }
}

// SSR: data has already at this page, so it don't need to reload
