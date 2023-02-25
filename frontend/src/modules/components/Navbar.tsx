import React, { FC, ReactElement } from 'react';
import {
  Box,
  Link,
  Toolbar,
} from '@mui/material';
import AppBar from './AppBar';

const Navbar: FC = (): ReactElement => {
  const rightLink = {
    fontSize: 16,
    color: 'common.white',
    ml: 3,
  };

  return (
    <Box>
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Link
              color="inherit"
              variant="h6"
              underline="none"
              href="/signin"
              sx={rightLink}
            >
              {'Sign In'}
            </Link>
            <Link
              variant="h6"
              underline="none"
              href="/"
              sx={{ ...rightLink, color: 'secondary.main' }}
            >
              {'Sign Up'}
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Box>
  );
};

export default Navbar;