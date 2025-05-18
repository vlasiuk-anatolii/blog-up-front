'use client';

import { useRouter } from 'next/navigation';
import { Button, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export const SearchButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/search');
  };

  return (
    <Box
      sx={{
        marginY: 2,
        display: 'inline-block',
        cursor: 'pointer',
      }}
    >
      <Button
        variant="contained"
        color="primary"
        startIcon={<SearchIcon />}
        onClick={handleClick}
      >
        Search
      </Button>
    </Box>
  );
};
