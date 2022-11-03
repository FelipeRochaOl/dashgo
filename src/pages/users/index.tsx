import { Box, Flex, Heading, HStack, Text } from "@chakra-ui/layout";
import { Button, Checkbox, Icon, Spinner, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useBreakpointValue } from "@chakra-ui/react";
import Link from "next/link";
import { RiAddLine, RiDeleteBinLine, RiPencilLine } from 'react-icons/ri';
import { useQuery } from "react-query";

import { Header } from "../../components/Header";
import Pagination from "../../components/Pagination";
import Sidebar from "../../components/Sidebar";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface UserData {
  users: User[]
}

export default function UserList() {
  const { data, isLoading, error } = useQuery('users', async () => {
    const response = await fetch('http://localhost:3000/api/users')
    const data: UserData = await response.json();
    const users = data.users.map(user => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: new Date(user.createdAt).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })
      }
    });
    return users;
  });
  const isWideVersion = useBreakpointValue({ base: false, lg: true });

  return (
    <Box>
      <Header />
      <Flex w="100%" my={6} maxWidth={1480} mx="auto" px={[4, 6]}>
        <Sidebar />
        <Box flex={1} borderRadius={8} bgColor="gray.800" p={[2, 4, 8]}>
          <Flex mb={8} justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">Users</Heading>
            <Link href='/users/create' passHref>
              <Button 
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="pink"
                leftIcon={<Icon as={RiAddLine} />}
              >
                Add new
              </Button>
            </Link>
          </Flex>
          {isLoading ? (
            <Flex justify="center">
              <Spinner />
            </Flex>
          ) : error ? (
            <Flex justify="center">
              <Text>Fail get users data</Text>
            </Flex>
          ) : (
            <TableContainer w="100%">
              <Table colorScheme="whiteAlpha" variant='striped'>
                <Thead>
                  <Tr>
                    <Th px={[4, 4, 6]} color="gray.300" width={[4, 8]}>
                      <Checkbox colorScheme="pink" fontSize={20} />
                    </Th>
                    <Th>
                      User
                    </Th>
                    {isWideVersion && (
                      <>
                        <Th>
                          Created At
                        </Th>
                        <Th>
                          Actions
                        </Th>
                      </>
                    )}
                  </Tr>
                </Thead>
                <Tbody>
                  {data?.map(user => {
                    return (
                      <Tr key={user.id}>
                        <Td px={[4, 4, 6]}>
                          <Checkbox colorScheme="pink" />
                        </Td>
                        <Td>
                          <Box>
                            <Text fontWeight="bold">{user.name}</Text>
                            <Text fontSize="sm" color="gray.300">{user.email}</Text>
                          </Box>
                        </Td>
                        {isWideVersion && (
                          <>
                            <Td>{user.createdAt}</Td>
                            <Td>
                              <HStack spacing={2}>
                                <Button 
                                  as="a"
                                  size="sm"
                                  fontSize="sm"
                                  colorScheme="purple"
                                  leftIcon={<Icon as={RiPencilLine} fontSize={16} />}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  as="a"
                                  size="sm"
                                  fontSize="sm"
                                  colorScheme="red"
                                  leftIcon={<Icon as={RiDeleteBinLine} fontSize={16} />}
                                >
                                  Delete
                                </Button>
                              </HStack>
                            </Td>
                          </>
                        )}
                      </Tr>
                    )
                  })}
                </Tbody>
              </Table>
              <Pagination />
            </TableContainer>
          )}
        </Box>
      </Flex>
    </Box>
  )
}