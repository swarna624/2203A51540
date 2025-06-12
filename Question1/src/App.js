import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  CssBaseline, 
  ThemeProvider, 
  createTheme,
  Button,
  Box
} from '@mui/material';
import StockChart from './components/StockChart';
import CorrelationHeatmap from './components/CorrelationHeatmap';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Stock Price Aggregation
              </Typography>
              <Button color="inherit" component={Link} to="/">
                Stock Chart
              </Button>
              <Button color="inherit" component={Link} to="/correlation">
                Correlation Heatmap
              </Button>
            </Toolbar>
          </AppBar>
          
          <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Routes>
              <Route path="/" element={<StockChart />} />
              <Route path="/correlation" element={<CorrelationHeatmap />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
