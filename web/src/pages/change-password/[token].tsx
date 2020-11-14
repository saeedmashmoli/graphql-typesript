import { Box, Button, Flex , Link } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import {NextPage} from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { MeDocument, MeQuery, useChangePasswordMutation } from '../../generated/graphql';
import { toErrorMap } from '../../utilis/toErrorMap';
import { withApollo } from '../../utilis/withApollo';



const ChangePassword: NextPage = () => {
    const router = useRouter()
    const [changePassword] = useChangePasswordMutation()
    const [tokenError, setTokenError] = useState("")
        return (
            <Wrapper variant="small">
            <Box border="0.5px solid #eee" d="block" style={{padding : "2% 5%", borderRadius: "5%" , background:"#ebecec"}}>
                <Formik 
                    initialValues={{newPassword : "" , confirmPassword: ""}}
                    onSubmit={async (values , {setErrors} ) => {
                        const response = await changePassword({
                            variables :{
                                ...values,
                                token : typeof router.query.token === "string" ? router.query.token : ""
                            },
                            update: (cache, { data }) => {
                              cache.writeQuery<MeQuery>({
                                query: MeDocument,
                                data: {
                                  __typename: "Query",
                                  me: data?.changePassword.user,
                                },
                              });
                            },
                        })
                        if(response.data?.changePassword.errors){
                            const errorMap = toErrorMap(response.data?.changePassword.errors)
                            if('token' in errorMap){
                                setTokenError(errorMap.token)
                            }
                            setErrors(errorMap);
                            
                        }else if(response.data?.changePassword.user){
                            // worked 
                            router.push("/")
                        }
                    }}
                    >
                    {({isSubmitting}) => (
                        <Form >
                            <InputField 
                                name="newPassword" 
                                placeholder="رمز عبور جدید..."
                                label="رمز عبور جدید"
                                type="password"
                            />
                            <InputField 
                                name="confirmPassword" 
                                placeholder="تایید رمز عبور..."
                                label="تکرار رمز عبور"
                                type="password"
                            />
                            { tokenError ? (
                                    <Flex>
                                        <Box style={{color:"red"}}>{tokenError}</Box>
                                        <NextLink href="/forget-password">
                                            <Link>درخواست جدید</Link>
                                        </NextLink>
                                    </Flex>
                                    
                                )
                                : null
                            }
                            <Box mt={4} mb={4} style={{direction:"ltr" }}>
                                <Button  
                                    variantColor="teal" 
                                    type="submit"
                                    isLoading={isSubmitting}
                                >تایید</Button>
                            </Box>
                            
                        </Form>
                    )}
                </Formik>
            </Box>
        </Wrapper>
        );
};

export default  withApollo({ ssr: false })(ChangePassword);