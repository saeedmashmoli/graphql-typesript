import { Box, Heading } from "@chakra-ui/core";
import React from "react";
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";
import { Layout } from "../../components/Layout";
import { useGetPostFromUrl } from "../../utilis/useGetPostFromUrl";
import { withApollo } from "../../utilis/withApollo";


const Post = ( ) => {
    const {data ,error , loading} = useGetPostFromUrl()
    if(loading){
        return(
            <Layout><div>در حال بارگذاری...</div></Layout>
        )
    }
    if(error){
        return(
            <div>{error}</div>
        )
    }
    if(!data?.post){
        return (
            <Layout>
                <Box>پست مورد نظر یافت نشد</Box>
            </Layout>
        )
    }
    return (
        <Layout>
            <Heading mb={4}>{data.post.title}</Heading>
            <Box mb={4}>{data.post.body}</Box>
            <Box>
                <EditDeletePostButtons id={data.post.id} creatorId={data.post.creator.id} />
            </Box>
        </Layout>
    );
}

export default Post;