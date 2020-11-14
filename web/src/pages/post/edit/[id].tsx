import { Box, Button } from "@chakra-ui/core"
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import React  from "react";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import {  useUpdatePostMutation } from "../../../generated/graphql";
import { useGetPostFromUrl } from "../../../utilis/useGetPostFromUrl";
import { withApollo } from "../../../utilis/withApollo";




const EditPost = () => {
    const router = useRouter();
    const {data , loading} = useGetPostFromUrl()
    const [updatePost] = useUpdatePostMutation()
    if(loading){
        return(
            <Layout><div>در حال بارگذاری...</div></Layout>
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
        <Layout variant="small">
            <Box border="0.5px solid #eee" d="block" style={{padding : "2% 5%", borderRadius: "5%" , background:"#ebecec"}}>
                <Formik 
                    initialValues={{title: data.post.title , body : data.post.body , id : data.post.id}}
                    onSubmit={async (values) => {
                        const {errors} = await updatePost({
                            variables :{
                                ...values
                            }
                        });
                        if(!errors){
                            router.back()
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
                                >ویرایش</Button>
                            </Box>
                       
                        </Form>
                    )}
                </Formik>
            </Box>
        </Layout>
    );
}

export default EditPost;