import { HStack, Stack, Text } from "@chakra-ui/layout";
import PaginationItem from "./PaginationItem";
import PaginationTotal from "./PaginationTotal";

interface PaginationProps {
  totalCountOfRegisters: number;
  registersPerPage?: number;
  currentPag?: number;
  onPageChange: (page: number) => void;
}
const siblingsCount = 1;
function generatePagesArray(from: number, to: number) {
  return [...new Array(to - from)]
  .map((_, index) => {
    return from + index + 1;
  })
  .filter(page => page > 0)
}
const Pagination = ({
  totalCountOfRegisters,
  registersPerPage = 10,
  currentPag = 1,
  onPageChange,
}: PaginationProps) => {
  const lastPage = Math.floor(totalCountOfRegisters / registersPerPage);
  const previousPages = currentPag > 1
    ? generatePagesArray(currentPag - 1 - siblingsCount, currentPag - 1)
    : [];
  const nextPages = currentPag < lastPage
    ? generatePagesArray(currentPag, Math.min(currentPag + siblingsCount, lastPage))
    : []

  return (
    <Stack
      direction={['column', 'row']}
      mt={8}
      justify="space-between"
      align="center"
    >
      <PaginationTotal begin={1} end={4} total={100}/>
      <HStack spacing={2}>
        {currentPag > (1 + siblingsCount) && (
          <>
            <PaginationItem onPageChange={onPageChange} number={1} />
            {currentPag > (2 + siblingsCount) && (
              <Text color="gray.300" width={8} textAlign="center">...</Text>
            )}
          </>
        )}

        {previousPages.length > 0 && previousPages.map(page => {
          return <PaginationItem onPageChange={onPageChange} key={page} number={page} />
        })}

        <PaginationItem onPageChange={onPageChange} isCurrent number={currentPag} />

        {nextPages.length > 0 && nextPages.map(page => {
          return <PaginationItem onPageChange={onPageChange} key={page} number={page} />
        })}

        {(currentPag + siblingsCount) < lastPage && (
          <>
            {(currentPag + 1 + siblingsCount) < lastPage && (
              <Text color="gray.300" width={8} textAlign="center">...</Text>
            )}
            <PaginationItem onPageChange={onPageChange} number={lastPage} />
          </>
        )}
      </HStack>
    </Stack>
  )
}

export default Pagination;