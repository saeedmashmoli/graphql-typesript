import { InputGroup, Input, InputLeftElement, IconButton } from "@chakra-ui/core";
import React from "react";
import { useState } from "react";
import { useCreateMessageMutation } from "../generated/graphql";


interface SendMessageProps {

}

export const SendMessage: React.FC<SendMessageProps> = () => {
    const [text , setText] = useState('')
    const [createMessage] = useCreateMessageMutation()
    const sendMessage = () => {
        createMessage({variables : {text}})
        setText('')
    }
    return (
        <>
            <InputGroup size="md">
                <Input
                    value={text}
                    style={{border:"1px solid #bbb"}}
                    bg="#eee"
                    onKeyUp={(e) => {
                            if(e.keyCode === 13){
                                sendMessage()
                            }
                        }
                    }
                    onChange={ (e) => {
                        setText(e.target.value)
                    }} 
                    pl="0"
                    pr="1rem"
                    type="text"
                    placeholder="پیامی را بنویسید..."
                />
                <InputLeftElement>
                    <IconButton
                        variantColor="teal"
                        icon="chat"
                        aria-label="ارسال"
                        onClick={sendMessage}
                    >
                    </IconButton> 
                </InputLeftElement>
            </InputGroup>
        </>
    )
};