const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 9876;

const WINDOW_SIZE = 10;
const TIMEOUT = 500;

app.use(cors());
app.use(express.json());

const numberStore = {
    numbers: [],
    windowSize: WINDOW_SIZE
};

const API_ENDPOINTS = {
    'p': 'http://20.244.56.144/evaluation-service/primes',
    'f': 'http://20.244.56.144/evaluation-service/fibo',
    'e': 'http://20.244.56.144/evaluation-service/even',
    'r': 'http://20.244.56.144/evaluation-service/rand'
};

// Replace 'YOUR_TOKEN_HERE' with the actual API key/token
const axiosConfig = {
    timeout: TIMEOUT,
    headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
};

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

app.get('/numbers/:type', async (req, res) => {
    const type = req.params.type;
    
    if (!API_ENDPOINTS[type]) {
        return res.status(400).json({ error: 'Invalid number type' });
    }

    const windowPrevState = [...numberStore.numbers];

    try {
        const response = await axios.get(API_ENDPOINTS[type], axiosConfig);
        const newNumbers = response.data.numbers;

        newNumbers.forEach(num => {
            if (!numberStore.numbers.includes(num)) {
                numberStore.numbers.push(num);
                if (numberStore.numbers.length > WINDOW_SIZE) {
                    numberStore.numbers.shift();
                }
            }
        });

        const avg = numberStore.numbers.reduce((sum, num) => sum + num, 0) / numberStore.numbers.length;

        res.json({
            windowPrevState,
            windowCurrState: numberStore.numbers,
            numbers: newNumbers,
            avg: parseFloat(avg.toFixed(2))
        });
    } catch (error) {
        console.error('Error fetching numbers:', error.message);
        res.status(500).json({ error: 'Failed to fetch numbers' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Available endpoints:');
    console.log('- /numbers/p (Prime Numbers)');
    console.log('- /numbers/f (Fibonacci Numbers)');
    console.log('- /numbers/e (Even Numbers)');
    console.log('- /numbers/r (Random Numbers)');
}); 