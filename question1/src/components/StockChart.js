import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const API_BASE_URL = 'http://20.244.56.144/evaluation-service';

function StockChart() {
  const [stocks, setStocks] = useState({});
  const [selectedStock, setSelectedStock] = useState('');
  const [timeFrame, setTimeFrame] = useState(30);
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStocks();
  }, []);

  useEffect(() => {
    if (selectedStock) {
      fetchStockData();
    }
  }, [selectedStock, timeFrame]);

  const fetchStocks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stocks`);
      setStocks(response.data.stocks);
      // Set the first stock as default
      const firstStock = Object.values(response.data.stocks)[0];
      setSelectedStock(firstStock);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  const fetchStockData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/stocks/${selectedStock}?minutes=${timeFrame}`
      );
      setStockData(response.data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
    setLoading(false);
  };

  const calculateAverage = (data) => {
    if (!data.length) return 0;
    const sum = data.reduce((acc, curr) => acc + curr.price, 0);
    return sum / data.length;
  };

  const average = calculateAverage(stockData);

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Stock Price Chart
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Select Stock</InputLabel>
            <Select
              value={selectedStock}
              label="Select Stock"
              onChange={(e) => setSelectedStock(e.target.value)}
            >
              {Object.entries(stocks).map(([name, ticker]) => (
                <MenuItem key={ticker} value={ticker}>
                  {name} ({ticker})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="lastUpdatedAt"
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleString()}
                formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#1976d2"
                name="Stock Price"
              />
              <Line
                type="monotone"
                dataKey={() => average}
                stroke="#dc004e"
                strokeDasharray="5 5"
                name="Average Price"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
}

export default StockChart; 