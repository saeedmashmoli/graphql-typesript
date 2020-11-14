import React from 'react';
import { Formik , Form } from 'formik';
import { Button, Box } from '@chakra-ui/core';
import { InputField } from '../components/InputField';
import { MeDocument, MeQuery, useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utilis/toErrorMap';
import { useRouter } from 'next/router'
import { Layout } from '../components/Layout';
import { withApollo } from '../utilis/withApollo';

interface registerProps {

}

const Register:React.FC<registerProps> = ({}) => {
    const router = useRouter()
    const [register] = useRegisterMutation()
    return (
        <Layout variant="small">
            <Box border="0.5px solid #eee" d="block" style={{padding : "2% 5%", borderRadius: "5%" , background:"#ebecec"}}>
                <Formik 
                    initialValues={{mobile: "" ,name:"", email:"", password: ""}}
                    onSubmit={async (values , {setErrors} ) => {
                        const response = await register({
                            variables : values,
                            update: (cache, { data }) => {
                                cache.writeQuery<MeQuery>({
                                  query: MeDocument,
                                  data: {
                                    __typename: "Query",
                                    me: data?.register.user,
                                  },
                                });
                              },
                        });
                        if(response.data?.register.errors){
                            setErrors(toErrorMap(response.data.register.errors));
                        }else if(response.data?.register.user){
                            // worked 
                            router.push("/")
                        }
                    }}
                    >
                    {({isSubmitting}) => (
                        <Form >
                            <InputField 
                                name="name" 
                                placeholder="نام..."
                                label="نام و نام خانوادگی"
                            />
                            <InputField 
                                name="mobile" 
                                placeholder="موبایل..."
                                label="موبایل"
                            />
                            <InputField 
                                name="email" 
                                placeholder="ایمیل..."
                                label="ایمیل"
                            />
                            <InputField 
                                name="password"
                                placeholder="رمز عبور..." 
                                label="رمز عبور"
                                type="password"
                            />
                            <Box mt={4} mb={4} style={{direction:"ltr" }}>
                                <Button  
                                    variantColor="teal" 
                                    type="submit"
                                    isLoading={isSubmitting}
                                >ثبت نام</Button>
                            </Box>
                            
                        </Form>
                    )}
                </Formik>
            </Box>
        </Layout>
    );
}
export default Register;