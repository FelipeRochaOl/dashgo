import { Box, Flex, Heading, HStack, Link, Text } from "@chakra-ui/layout";
import { Button, Checkbox, Icon, Spinner, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useBreakpointValue } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import NextLink from "next/link";
import { useState } from "react";
import { RiAddLine, RiDeleteBinLine, RiLoaderLine, RiPencilLine } from 'react-icons/ri';

import Header from "../../components/Header";
import Pagination from "../../components/Pagination";
import Sidebar from "../../components/Sidebar";
import { getUsers, GetUsersResponse, useUsers } from "../../hooks/useUsers";
import { api } from "../../services/api";
import { fakeResponse } from "../../services/mirage";
import { queryClient } from "../../services/queryClient";

export default function UserList({ users, totalCount }: GetUsersResponse) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, refetch, error } = useUsers(page, {
    initialData: { users, totalCount }, // react-query with SSR
  });
  const isWideVersion = useBreakpointValue({ base: false, lg: true });

  async function handlePrefetchUser(userId: string) {
    await queryClient.prefetchQuery(['user', userId], async () => {
      try {
        const response = await api.get(`users/${userId}`);
        console.log('page users');
        console.log(response);
        return response.data;
      } catch (error) {
        console.error(error);
        return fakeResponse
      }
    }, {
      staleTime: 1000 * 60 * 10 // 10 minutes
    })
  }

  return (
    <Box>
      <Header />
      <Flex w="100%" my={6} maxWidth={1480} mx="auto" px={[4, 6]}>
        <Sidebar />
        <Box flex={1} borderRadius={8} bgColor="gray.800" p={[2, 4, 8]}>
          <Flex mb={8} justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Users
              {!isLoading && isFetching && 
                <Spinner size="sm" color="gray.500" ml={4} />
              }
            </Heading>
            <HStack>
              <Button 
                size="sm"
                fontSize="sm"
                colorScheme="blue"
                leftIcon={<Icon as={RiLoaderLine} />}
                onClick={() => refetch()}
                >
                Reload
                {isFetching && 
                  <Spinner size="sm" color="gray.500" ml={4} />
                }
              </Button>
              <NextLink href='/users/create' passHref>
                <Button 
                  as="a"
                  size="sm"
                  fontSize="sm"
                  colorScheme="pink"
                  leftIcon={<Icon as={RiAddLine} />}
                >
                  Add new
                </Button>
              </NextLink>
            </HStack>
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
                  {data && data.users && data.users.map(user => {
                    return (
                      <Tr key={user.id}>
                        <Td px={[4, 4, 6]}>
                          <Checkbox colorScheme="pink" />
                        </Td>
                        <Td>
                          <Box>
                            <Link color="purple.400" onMouseEnter={() => handlePrefetchUser(user.id)}>
                              <Text fontWeight="bold">{user.name}</Text>
                            </Link>
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
              <Pagination 
                totalCountOfRegisters={data?.totalCount || 1}
                currentPag={page}
                onPageChange={setPage}
              />
            </TableContainer>
          )}
        </Box>
      </Flex>
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { users, totalCount } = await getUsers(1);
  return {
    props: {
      users,
      totalCount
    },
  }
}