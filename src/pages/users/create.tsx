import { Button } from "@chakra-ui/button";
import { Box, Divider, Flex, Heading, HStack, SimpleGrid, VStack } from "@chakra-ui/layout";
import { yupResolver } from '@hookform/resolvers/yup';
import Link from "next/link";
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';

import Input from "../../components/Form/Input";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

type createUserFormData = {
  email: string;
  name: string;
  password:  string;
  password_confirmation: string
}

const createUserFormSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(3, 'Min of the letters is 3'),
  email: yup.string().required('E-mail is required').email('E-mail is invalid'),
  password: yup.string().required('Password is required').min(6, 'Min of the letters is 6'),
  password_confirmation: yup.string().oneOf([null, yup.ref('password')], 'Password confirmation is diferent')
})

const UserCreate = () => {
  const { register, handleSubmit, formState } = useForm<createUserFormData>({
    resolver: yupResolver(createUserFormSchema)
  });
  const handleCreateUser: SubmitHandler<createUserFormData> = (data, event) => {
    event?.preventDefault();
  }

  return (
    <Box>
      <Header />
      <Flex w="100%" my={6} maxWidth={1480} mx="auto" px={6}>
        <Sidebar />
        <Box
          as="form"
          flex={1}
          borderRadius={8}
          bgColor="gray.800"
          p={[6,8]}
          onSubmit={handleSubmit(handleCreateUser)}
        >

         <Heading size="lg" fontWeight="normal">Add users</Heading>
          <Divider my={6} borderColor="gray.700" />
          <VStack spacing={8}>
            <SimpleGrid minChildWidth="240px" spacing={[6, 8]} w="100%">
              <Input
                label="Full name"
                {...register('name')}
                error={formState.errors.name}
              />
              <Input
                label="E-mail"
                type="email"
                {...register('email')}
                error={formState.errors.email}
              />
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing={[6, 8]} w="100%">
              <Input
                label="Password"
                type="password"
                {...register('password')}
                error={formState.errors.password}
              />
              <Input
                label="Confirm Password"
                type="password"
                {...register('password_confirmation')}
                error={formState.errors.password_confirmation}
              />
            </SimpleGrid>
          </VStack>
          <Flex mt={8} justify="flex-end">
            <HStack spacing={4}>
              <Link href='/users' passHref>
                <Button colorScheme="whiteAlpha">Cancel</Button>
              </Link>
              <Button
                type="submit"
                isLoading={formState.isSubmitting}
                colorScheme="pink"
              >
                Save
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}
export default UserCreate;