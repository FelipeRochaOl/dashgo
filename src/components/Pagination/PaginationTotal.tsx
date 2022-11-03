import { Box } from "@chakra-ui/react";

interface PaginationTotalProps {
  begin: number;
  end: number;
  total: number;
}

const PaginationTotal = ({ begin, end, total }: PaginationTotalProps) => {
  return (
    <Box>
      <strong>{begin}</strong> - <strong>{end}</strong> of <strong>{total}</strong>
    </Box>
  )
}
export default PaginationTotal;