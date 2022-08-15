import { useRouter } from "next/router"
import { useState } from "react"
import styled from "styled-components"
import { useRecipient } from "../hooks/useRecipient"
import { Conversation } from "../types"
import RecipientAvatar from "./RecipientAvatar"

const StyledCOntainer = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break: break-all;

    :hover {
        background-color: #e9eaeb;
    }
`

const ConversationSelect = ({id, conversationsUsers}: {id: string, conversationsUsers: Conversation['users']}) => {
    const {recipient, recipientEmail} = useRecipient(conversationsUsers) 

    const router = useRouter()
    
    const OnSelectConversation = () => {
        router.push(`/conversations/${id}`)
    }

    return (
        <StyledCOntainer onClick={OnSelectConversation}>
            <RecipientAvatar recipient={recipient} recipientEmail={recipientEmail}/>
            <span>{recipientEmail}</span>

           
        </StyledCOntainer>
    )
}

export default ConversationSelect