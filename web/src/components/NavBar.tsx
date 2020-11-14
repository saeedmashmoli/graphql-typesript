import { Box, Button, Flex, Heading, Link } from '@chakra-ui/core';
import React from 'react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utilis/isServer';
import { useApolloClient } from '@apollo/client';


interface NavBarProps {}

export const NavBar:React.FC<NavBarProps> = ({}) => {
 
    const {data , loading } = useMeQuery({
        skip : isServer()
    });
    const apolloClient = useApolloClient();
    const [logout,{loading : logoutFetching}] = useLogoutMutation()
    let body = null;
    if(loading){

    }else if(!data?.me){
        body = (
            <Box ml="auto" color="white">
                <NextLink href="/login">
                    <Link ml={3} >ورود</Link>
                </NextLink>
                <NextLink href="/register">
                    <Link ml={4}>ثبت نام</Link>
                </NextLink>
            </Box>
        );
    }else {
        body = (
            <Flex  align="center" color="white">
                <Button 
                    isLoading={logoutFetching}
                    onClick={async () => {
                        await logout()
                        await apolloClient.resetStore();
                        }
                    } 
                    ml={6} 
                    variant="link"
                >خروج</Button>
                <Box ml={4} >{data.me.name ? data.me.name  : data.me.mobile }</Box>
            </Flex>
        )
    }
    return (
        <Flex zIndex={1} position="sticky" top={0} bg="tan" p={4} style={{direction: "rtl"}}>
            <Flex flex={1} m="auto" align="center" maxW={800}>
                <NextLink href="/">
                    <Link>
                        <Heading>Main</Heading>
                    </Link>
                </NextLink>
                <NextLink href="/create-post">
                    <Button mr={4} as={Link}>
                        افزودن پست
                    </Button>
                </NextLink>
                <NextLink href="/chat">
                    <Button mr={4} as={Link}>
                        چت
                    </Button>
                </NextLink>
                <Flex mr={"auto"}>{body}</Flex>
            </Flex>
        </Flex>
    );
}