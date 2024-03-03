import Auth from '../utils/auth';
import { useState } from 'react';
import { Navigate, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Avatar,
  Menu,
  Toolbar,
  Container,
  IconButton,
  Typography,
  Tooltip,
  MenuItem,
  Link
} from '@mui/material';

const getTitle = (path) => {
  let location = path?.split('/')[1];
  switch (location) {
  case '':
    return 'Just Another Financial App';
  case 'login':
    return 'Login';
  case 'signup':
    return 'Signup';
  case 'logout':
    return 'Logging Out...';
  case 'profile':
    return Auth.loggedIn() ? (
      `Viewing ${Auth.getProfile().data.username}'s Profile`
    ) : (
      <Navigate to="/login" />
    );
  case 'account':
    return `Viewing Your Account`;
  default:
    return 'Error';
  }
};

String.prototype.toRoute = function () {
  return this.toLowerCase().split(' ').join('');
};

export default function Header() {
  const { pathname } = useLocation();
  const title = getTitle(pathname);

  // Set Menu State and Navigation Elements for User
  const userSettings = ['Profile', 'Logout'];
  const [anchorElUser, setAnchorElUser] = useState(null);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" style={{ boxShadow: 'none' }}>
      <Container maxWidth="lg" sx={{ padding: '1em' }}>
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Page Title and 'Header' */}
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to={Auth.loggedIn() ? '/profile' : '/'}
            sx={{
              textDecoration: 'none',
              color: 'white'
            }}
          >
            {title}
          </Typography>

          {/* User Menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip
              title={
                Auth.loggedIn()
                  ? `${Auth.getProfile().data.username}'s settings`
                  : 'Login'
              }
            >
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt={Auth.loggedIn() ? Auth.getProfile().data.username : 'Login'}
                  src="/static/images/avatar/2.jpg"
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {Auth.loggedIn() ? (
                userSettings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Link
                      component={RouterLink}
                      to={`/${setting.toRoute()}`}
                      textAlign="center"
                      underline="none"
                    >
                      {setting}
                    </Link>
                  </MenuItem>
                ))
              ) : (
                <MenuItem onClick={handleCloseUserMenu}>
                  <Link
                    component={RouterLink}
                    to={`/login`}
                    textAlign="center"
                    underline="none"
                  >
                    Login
                  </Link>
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
