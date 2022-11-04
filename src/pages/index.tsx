import { Button, Flex, Stack } from "@chakra-ui/react";
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';

import Input from "../components/Form/Input";

type SignInFormData = {
  email: string;
  password:  string;
}

const signInFormSchema = yup.object().shape({
  email: yup.string().required('E-mail is required').email('E-mail is invalid'),
  password: yup.string().required('Password is required')
})

export default function SignIn() {
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm<SignInFormData>({
    resolver: yupResolver(signInFormSchema)
  });
  const handleSignIn: SubmitHandler<SignInFormData> = (data, event) => {
    event?.preventDefault();
    router.push('/dashboard');
  }
  return (
    <Flex 
      w="100vw" 
      h="100vh" 
      align="center" 
      justify="center"
    >
      <Flex
        as="form"
        w="100%"
        maxW={360}
        bg="gray.800"
        p="8"
        borderRadius={0}
        flexDir="column"
        onSubmit={handleSubmit(handleSignIn)}
      >
        <Stack spacing="4">
          <Input
            label="E-mail"
            type="email"
            error={formState.errors.email}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            error={formState.errors.password}
            {...register('password')}
          />
        </Stack>

        <Button 
          type="submit"
          mt={6}
          colorScheme="pink"
          size="lg"
          isLoading={formState.isSubmitting}
        >
          Sign in
        </Button>
      </Flex>
    </Flex>
  )
}
