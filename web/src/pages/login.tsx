import React from 'react';
import { Formik , Form } from 'formik';
import { Button, Box , Link , Flex } from '@chakra-ui/core';
import NextLink from 'next/link';
import { MeDocument, MeQuery, useLoginMutation} from '../generated/graphql'
import { InputField } from '../components/InputField';
import { toErrorMap } from '../utilis/toErrorMap';
import { useRouter } from 'next/router'
import { Layout } from '../components/Layout';
import { withApollo } from '../utilis/withApollo';

interface loginProps {

}

const Login:React.FC<loginProps> = ({}) => {
    const router = useRouter()
    const [login] = useLoginMutation()
    return (
        <Layout variant="small">
            <Box border="0.5px solid #eee" d="block" style={{padding : "2% 5%", borderRadius: "5%" , background:"#ebecec"}}>
                <Formik 
                    initialValues={{username: "" , password: ""}}
                    onSubmit={async (values , {setErrors} ) => {
                        const response = await login({
                            variables : values,
                            update: (cache, { data }) => {
                                cache.writeQuery<MeQuery>({
                                  query: MeDocument,
                                  data: {
                                    __typename: "Query",
                                    me: data?.login.user,
                                  },
                                });
                                cache.evict({ fieldName: "posts:{}" });
                              },
                        });
                        if(response.data?.login.errors){
                            setErrors(toErrorMap(response.data.login.errors));
                        }else if(response.data?.login.user){
                            // worked 
                            if(typeof router.query.next === "string"){
                                router.push(router.query.next)
                            }else {
                                router.push("/")
                            }
                            
                        }
                    }}
                    >
                    {({isSubmitting}) => (
                        <Form >
                            <InputField 
                                name="username" 
                                placeholder="موبایل یا ایمیل..."
                                label="موبایل یا ایمیل"
                            />
                            <InputField 
                                name="password"
                                placeholder="رمز عبور..." 
                                label="رمز عبور"
                                type="password"
                            />
                            <Flex float="right" mt={4}>
                                <NextLink href="/forget-password">
                                    <Link>فراموشی رمز عبور؟</Link>
                                </NextLink>
                                <NextLink href="/register" >
                                    <Link mr={5}>ثبت نام</Link>
                                </NextLink>
                            </Flex>
                            <Box mt={4} mb={4} style={{direction:"ltr" }}>
                                <Button  
                                    variantColor="teal" 
                                    type="submit"
                                    isLoading={isSubmitting}
                                >ورود</Button>
                            </Box>
                       
                        </Form>
                    )}
                </Formik>
            </Box>
        </Layout>
    );
}

export default Login;