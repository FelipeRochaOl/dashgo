import { HStack, Stack } from "@chakra-ui/layout";
import PaginationItem from "./PaginationItem";
import PaginationTotal from "./PaginationTotal";

const Pagination = () => {
  return (
    <Stack
      direction={['column', 'row']}
      mt={8}
      justify="space-between"
      align="center"
    >
      <PaginationTotal begin={1} end={4} total={100}/>
      <HStack spacing={2}>
        <PaginationItem isCurrent number={1} />
        <PaginationItem number={2} />
        <PaginationItem number={3} />
        <PaginationItem number={4} />
      </HStack>
    </Stack>
  )
}

export default Pagination;