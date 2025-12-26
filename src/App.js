import './App.css';

// Component
import LoginForm from './Components/LoginForm';
import Home from './Components/Home';

import {
  Box,
  AppBar,
} from '@mui/material';

import { useSelector } from 'react-redux';
import { selectUser } from './Features/userSlice';

function App() {

  const user = useSelector(selectUser);

  return (
    <>
      <Box>
        <AppBar sx={{ backgroundColor: "#dee2e6" }} position="static">
        </AppBar>
      </Box>

      {
        user ? (
          <Home />
        ) : (
          <LoginForm />
        )
      }
    </>
  );
}

export default App;
