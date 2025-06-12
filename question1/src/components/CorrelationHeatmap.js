import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Tooltip
} from '@mui/material';
import axios from 'axios';

const API_BASE_URL = 'http://20.244.56.144/evaluation-service';

function CorrelationHeatmap() {
  const [stocks, setStocks] = useState({});
  const [timeFrame, setTimeFrame] = useState(30);
  const [correlationMatrix, setCorrelationMatrix] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stockStats, setStockStats] = useState({});

  useEffect(() => {
    fetchStocks();
  }, []);

  useEffect(() => {
    if (Object.keys(stocks).length > 0) {
      calculateCorrelations();
    }
  }, [stocks, timeFrame]);

  const fetchStocks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stocks`);
      setStocks(response.data.stocks);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  const calculateCorrelations = async () => {
    setLoading(true);
    try {
      const stockData = {};
      const tickers = Object.values(stocks);

      // Fetch data for all stocks
      for (const ticker of tickers) {
        const response = await axios.get(
          `${API_BASE_URL}/stocks/${ticker}?minutes=${timeFrame}`
        );
        stockData[ticker] = response.data;
      }

      // Calculate statistics for each stock
      const stats = {};
      for (const ticker of tickers) {
        const prices = stockData[ticker].map(d => d.price);
        const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
        const variance = prices.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (prices.length - 1);
        const stdDev = Math.sqrt(variance);
        stats[ticker] = { mean, stdDev };
      }
      setStockStats(stats);

      // Calculate correlation matrix
      const matrix = [];
      for (const ticker1 of tickers) {
        const row = [];
        for (const ticker2 of tickers) {
          const correlation = calculateCorrelation(
            stockData[ticker1],
            stockData[ticker2]
          );
          row.push(correlation);
        }
        matrix.push(row);
      }
      setCorrelationMatrix(matrix);
    } catch (error) {
      console.error('Error calculating correlations:', error);
    }
    setLoading(false);
  };

  const calculateCorrelation = (data1, data2) => {
    const prices1 = data1.map(d => d.price);
    const prices2 = data2.map(d => d.price);
    
    const mean1 = prices1.reduce((a, b) => a + b, 0) / prices1.length;
    const mean2 = prices2.reduce((a, b) => a + b, 0) / prices2.length;
    
    const covariance = prices1.reduce((acc, price1, i) => {
      return acc + (price1 - mean1) * (prices2[i] - mean2);
    }, 0) / (prices1.length - 1);
    
    const stdDev1 = Math.sqrt(
      prices1.reduce((acc, price) => acc + Math.pow(price - mean1, 2), 0) / (prices1.length - 1)
    );
    const stdDev2 = Math.sqrt(
      prices2.reduce((acc, price) => acc + Math.pow(price - mean2, 2), 0) / (prices2.length - 1)
    );
    
    return covariance / (stdDev1 * stdDev2);
  };

  const getColor = (correlation) => {
    const intensity = Math.abs(correlation);
    const hue = correlation > 0 ? 200 : 0; // Blue for positive, Red for negative
    return `hsl(${hue}, 100%, ${100 - intensity * 50}%)`;
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Stock Correlation Heatmap
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Time Frame (minutes)</InputLabel>
          <Select
            value={timeFrame}
            label="Time Frame (minutes)"
            onChange={(e) => setTimeFrame(e.target.value)}
          >
            <MenuItem value={15}>15 minutes</MenuItem>
            <MenuItem value={30}>30 minutes</MenuItem>
            <MenuItem value={60}>1 hour</MenuItem>
            <MenuItem value={120}>2 hours</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 2 }}>
            {/* Y-axis labels */}
            <Box sx={{ display: 'grid', gridTemplateRows: 'repeat(auto-fill, 40px)' }}>
              {Object.entries(stocks).map(([name, ticker]) => (
                <Tooltip
                  key={ticker}
                  title={`${name} (${ticker})
                    Mean: $${stockStats[ticker]?.mean.toFixed(2)}
                    Std Dev: $${stockStats[ticker]?.stdDev.toFixed(2)}`}
                >
                  <Typography
                    sx={{
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      pr: 1,
                      fontSize: '0.8rem'
                    }}
                  >
                    {ticker}
                  </Typography>
                </Tooltip>
              ))}
            </Box>

            {/* Heatmap grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 40px)' }}>
              {correlationMatrix.map((row, i) =>
                row.map((correlation, j) => (
                  <Tooltip
                    key={`${i}-${j}`}
                    title={`Correlation: ${correlation.toFixed(2)}`}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: getColor(correlation),
                        border: '1px solid #ccc'
                      }}
                    />
                  </Tooltip>
                ))
              )}
            </Box>

            {/* X-axis labels */}
            <Box sx={{ gridColumn: '2', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 40px)' }}>
              {Object.entries(stocks).map(([name, ticker]) => (
                <Tooltip
                  key={ticker}
                  title={`${name} (${ticker})
                    Mean: $${stockStats[ticker]?.mean.toFixed(2)}
                    Std Dev: $${stockStats[ticker]?.stdDev.toFixed(2)}`}
                >
                  <Typography
                    sx={{
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      transform: 'rotate(-45deg)',
                      transformOrigin: 'top left'
                    }}
                  >
                    {ticker}
                  </Typography>
                </Tooltip>
              ))}
            </Box>
          </Box>
        </Box>
      )}

      {/* Color legend */}
      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="subtitle2">Correlation:</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 20, height: 20, backgroundColor: 'hsl(0, 100%, 50%)' }} />
          <Typography variant="caption">Strong Negative</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 20, height: 20, backgroundColor: 'hsl(0, 100%, 100%)' }} />
          <Typography variant="caption">No Correlation</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 20, height: 20, backgroundColor: 'hsl(200, 100%, 50%)' }} />
          <Typography variant="caption">Strong Positive</Typography>
        </Box>
      </Box>
    </Paper>
  );
}

export default CorrelationHeatmap; 