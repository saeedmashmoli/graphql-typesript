
import { Stack, Box, Flex, Avatar , Text} from '@chakra-ui/core';
import React from 'react';
import { MessagesQueryVariables, useMeQuery } from '../generated/graphql';
import { isServer } from '../utilis/isServer';

interface MessagesProps {
    messages : MessagesQueryVariables;
}

export const Messages: React.FC<MessagesProps> = ({messages}) => {
    const {data:me  } = useMeQuery({
        skip : isServer()
    });
    return (
        <Stack spacing={8} >
        <Box shadow="md" borderWidth="1px" p={5}> 
            {messages.map( ( message ,index) => 
            !message ? null : (
                <Box key={index} mb={2}>
                    <Flex style={{direction : me?.me?.id === message.sender.id ? "rtl" : "ltr"}}>
                        <Avatar 
                            size="sm" name={message.sender.name} 
                            bg={me?.me?.id === message.sender.id ? "blue.200" : "red.200"} 
                            src="/avatar.png"
                        />
                        <Text 
                        fontFamily="Vazir"
                        mr={me?.me?.id === message.sender.id ? "1%" : "0%"}
                        ml={me?.me?.id === message.sender.id ? "0%" : "1%"}
                        p={2} 
                        mt={2} 
                        borderRadius="8px" 
                        fontSize={15} 
                        bg={me?.me?.id === message.sender.id ? "red.100" : "green.200"}
                        >{message.text}</Text>
                    </Flex>
                </Box>
            ))}
        </Box>
        </Stack>
    )

}

 