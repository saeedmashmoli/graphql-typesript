import { Box, Button } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useForgetPasswordMutation } from '../generated/graphql';

const ForgetPassword:React.FC<{}> = ({}) => {
    const [complete , setComplete] = useState(false)
    const [forgetPassword] = useForgetPasswordMutation()
        return (
            <Wrapper variant="small">
                <Box border="0.5px solid #eee" d="block" style={{padding : "2% 5%", borderRadius: "5%" , background:"#ebecec"}}>
                    <Formik 
                        initialValues={{email: ""}}
                        onSubmit={async (values ) => {
                            await forgetPassword({
                                variables : values
                            });
                            setComplete(true);
                        }}
                        >
                        {({isSubmitting}) => complete 
                            ? <Box>ایمیل بازیابی رمز عبور برای شما ارسال شد</Box>
                            : (
                                <Form >
                                    <InputField 
                                        name="email" 
                                        placeholder="ایمیل..."
                                        label="ایمیل"
                                        type="email"
                                    />
                                    <Box mt={4} mb={4} style={{direction:"ltr" }}>
                                        <Button  
                                            variantColor="teal" 
                                            type="submit"
                                            isLoading={isSubmitting}
                                        >ارسال درخواست</Button>
                                    </Box>
                            
                                </Form>
                            )}
                    </Formik>
                </Box>
            </Wrapper>
        );
}
export default ForgetPassword;