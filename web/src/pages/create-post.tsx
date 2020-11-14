import { Box, Button } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../components/InputField';
import { Layout } from '../components/Layout';
import { useCreatePostMutation } from '../generated/graphql';
import { useIsAuth } from '../utilis/useIsAuth';
import { useApolloClient } from '@apollo/client';
interface createPostProps {

}

const CreatePost:React.FC<createPostProps> = ({}) => {
    const router = useRouter()
    useIsAuth()
    const [createPost] = useCreatePostMutation()
    const apolloClient = useApolloClient()
    return (
        <Layout variant="small">
            <Box border="0.5px solid #eee" d="block" style={{padding : "2% 5%", borderRadius: "5%" , background:"#ebecec"}}>
                <Formik 
                    initialValues={{title: "" , body : ""}}
                    onSubmit={async (values) => {
                        const {errors} = await createPost({
                            variables : { input : values},
                            update: (cache) => {
                                cache.evict({ fieldName: "posts:{}" });
                            },
                        });
                        if(!errors){
                            router.push("/")
                            await apolloClient.resetStore()
                        }
                    }}
                    >
                    {({isSubmitting}) => (
                        <Form >
                            <InputField 
                                name="title" 
                                placeholder="موضوع..."
                                label="موضوع"
                            />
                            <InputField 
                                name="body"
                                placeholder="متن پست را بنویسید..." 
                                label="متن"
                                textarea
                            />
                            <Box mt={4} mb={4} style={{direction:"ltr" }}>
                                <Button  
                                    variantColor="teal" 
                                    type="submit"
                                    isLoading={isSubmitting}
                                >ذخیره</Button>
                            </Box>
                       
                        </Form>
                    )}
                </Formik>
            </Box>
        </Layout>
    );
}
export default CreatePost;