import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
let theme = createTheme({
  palette: {
    primary: {
      main: '#31343d',
      light: '#48a9a6ff',
      dark: '#31343d',
      contrastText: '#48a9a6ff',
      lightBack: '#ededf7',
      hover: '#434753'
    },
    secondary: {
      main: '#48a9a6ff',
      light: '#ededf7',
      dark: '#ededf7',
      contrastText: '#ededf7'
    },
    error: {
      main: red.A400
    }
  }
});

theme = createTheme(theme, {
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.primary.hover,
          color: theme.palette.primary.light
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: theme.palette.primary.lightBack
          }
        }
      }
    },
    MuiImageListItemBar: {
      styleOverrides: {
        title: {
          color: theme.palette.primary.contrastText,
          fontSizeAdjust: '0.6'
        }
      }
    }
  }
});

export default theme;
