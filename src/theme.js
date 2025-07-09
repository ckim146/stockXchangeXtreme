// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#2e2e2e', // matte dark gray base
      paper: '#1f1f1f',   // slightly darker gray for paper
    },
    text: {
      primary: '#f5f5f5', // soft white text
      secondary: '#cccccc'
    },
    success: {
      main: '#4caf50',
    },
    error: {
      main: '#f44336',
    },
    // You can add custom blue if needed:
    blue: {
      main: '#2196f3',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1f1f1f',
          color: '#f5f5f5',
          boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.6)', // elevation-like shadow
          borderRadius: '8px',
        },
      },
    },
  },
});
export default theme;
