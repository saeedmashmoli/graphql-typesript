import { Layout } from '../components/Layout';
import NextLink from 'next/link'

import { usePostsQuery  } from '../generated/graphql';
import React from 'react';
import { Box, Button, Flex, Heading, Link, Stack , Text } from '@chakra-ui/core';

import { UpdootSection } from '../components/UpdootSection';
import { EditDeletePostButtons } from '../components/EditDeletePostButtons';
import { withApollo } from '../utilis/withApollo';


const Index = () => {
  // const [ variables , setVariables ] = useState()
  const {data , loading , fetchMore , variables} = usePostsQuery({
    variables : {limit : 10 , cursor : null as null | string},
    notifyOnNetworkStatusChange: true
  });

  if(loading && !data){
    return <div>پستی برای نمایش وجود ندارد</div>
  }
  
  return (
      <Layout variant="regular"> 
          {loading && !data 
            ? (<div>Loading...</div>) 
            : (
              <Stack spacing={8} >
                {data?.posts.posts.map(( p ,index) => 
                  !p ? null : (
                    <Flex key={index} shadow="md" borderWidth="1px" p={5} >
                      <UpdootSection post={p} />
                      <Box flex={1}>
                        <NextLink href="/post/[postId]" as={`/post/${p.id}`}>
                          <Link>
                            <Heading fontSize="xl">{p.title}</Heading>
                          </Link>
                        </NextLink>
                        
                        <Text>پست توسط: {p.creator.name}</Text>
                        <Flex>
                          <Text mt={4} flex={1}>{p.bodySnippet}</Text>
                         <Box ml="auto">
                            <EditDeletePostButtons id={p.id} creatorId={p.creator.id} />
                         </Box>
                        </Flex>
                        
                      </Box>
                    </Flex>
                ))}
              </Stack>
            )
          }
          {data && data.posts.hasMore ? (
              <Flex>
                <Button onClick={() => {
                  fetchMore({
                    variables : {
                      limit : variables?.limit,
                      cursor: data!.posts.posts[data!.posts.posts.length - 1].createdAt
                    },
                  });
                  
                }
              } 
                isLoading={loading}
                m="auto" 
                my={8}

                >موارد بیشتر...</Button>
              </Flex>)
            : null}
      </Layout>
  )
}
export default withApollo({ ssr: true })(Index);
