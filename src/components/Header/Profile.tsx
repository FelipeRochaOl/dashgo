import { Avatar, Box, Flex, Text } from "@chakra-ui/react";

interface ProfileProps {
  showProfileData?: boolean;
}

const Profile = ({showProfileData = true }: ProfileProps) => {
  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr={4} textAlign="right">
            <Text>Felipe Rocha</Text>
            <Text color="gray.300" fontSize="small">
              feliperochaoliveira@gmail.com
            </Text>
        </Box>
      )}
      <Avatar size="md" name="Felipe Rocha" src="https://github.com/FelipeRochaOl.png"/>
    </Flex>
  )
}
export default Profile;