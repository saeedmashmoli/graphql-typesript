import { Box, FormControl, FormErrorMessage, FormLabel, Input, Textarea } from '@chakra-ui/core';
import { useField } from 'formik';
import React , { InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    name: string;
    label?: string;
    textarea?: boolean;
}

export const InputField:React.FC<InputFieldProps> = ({label ,size:_,textarea, ...props}) => {
    let InputOrTextarea = Input;
    if (textarea) {
        InputOrTextarea = Textarea;
    }
    const [field , {error}] = useField(props)
    return (
        <Box mt={4}>
            <FormControl isInvalid={!!error}>
                {label ? <FormLabel htmlFor={field.name}>{label}</FormLabel> : null}
                <InputOrTextarea {...field} {...props} id={field.name} />
                {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
            </FormControl>
        </Box>
    );
}