
import { Layout } from '../components/Layout';
import {  useNewMessageSubscription, useMessagesQuery } from '../generated/graphql';
import React, { useState } from 'react';
import { Box, ColorModeProvider, IconButton} from '@chakra-ui/core';

import { useEffect } from 'react';
import Head from 'next/head';
import { SendMessage } from '../components/SendMessage';
import { Messages } from '../components/Messages';


const Chat = () => {
    
    const [bg , setBg] =useState(true)
    const {data , loading} = useMessagesQuery();
    const [messages , setMessages] = useState([])
    const {data : newMassage} = useNewMessageSubscription()
    const bgHandler = () => {
        setBg(!bg)
    }
    useEffect(() => {
        if(data?.messages){
            setMessages(data.messages)
        }
        if(newMassage?.newMessage){
            setMessages([...messages , newMassage?.newMessage])
        }
    }, [data?.messages , newMassage?.newMessage])



    if(loading && !data){
        return <div>چتی برای نمایش وجود ندارد</div>
    }

    return (
        <Layout variant="regular"> 
            <Head>
                <title>صفحه چت</title>
                <link rel="shortcut icon" href="/chat.ico" />
                <meta property="og:title" content="صفحه چت" key="title" />
            </Head>
            <Box borderRadius="8px" background="#38b2ac" p={2} mr={2} ml={2}>
                <IconButton bg="red.200" onClick={bgHandler} icon={bg ? "moon" : "sun"} aria-label="تغییر پس زمینه"></IconButton>

            </Box>
            <Box mr={2} ml={2} background={bg ? "light" : "gray"}>
                {loading && !data
                    ? (<div>Loading...</div>) 
                    : (<Messages messages={messages}  />)
                }
                <SendMessage />  
            </Box>
        </Layout>
    )
}

export default Chat;
