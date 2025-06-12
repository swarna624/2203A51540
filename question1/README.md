# 📈 Stock Price Aggregation Frontend Web Application

A responsive React application that delivers real-time analytical insights using stock price data from a stock exchange platform. This project was developed as part of a frontend evaluation test.

## 🚀 Features

- 📊 **Stock Page**  
  - Interactive chart with real-time stock price visualization
  - Time interval selection to view the last **m** minutes
  - Displays average price, tooltip insights, and key stock details on hover

- 🔥 **Correlation Heatmap**  
  - Dynamic heatmap showing price correlation between different stocks
  - Shows average and standard deviation on hover
  - Includes color legend for correlation strength (positive to negative)

## ⚙️ Tech Stack

- React.js
- Material UI
- Charting library: Recharts / Chart.js
- Axios for API requests
- Native JS functions for Pearson correlation, covariance, and standard deviation

## 🌐 Run Locally

Ensure you have Node.js and npm installed.

```bash
git clone https://github.com/<your-username>/stock-aggregation-app.git
cd stock-aggregation-app
npm install
npm start 
```
Visit: http://localhost:3000

##🔌 API Usage
Get All Stocks
GET http://20.244.56.144/evaluation-service/stocks

Get Specific Stock (Latest)
GET http://20.244.56.144/evaluation-service/stocks/:ticker

Get Stock Price History
GET http://20.244.56.144/evaluation-service/stocks/:ticker?minutes=m

⚠️ Note: API calls have a cost. The app optimizes the number of requests while ensuring real-time accuracy.

##📱 UI Guidelines

-Responsive design using Material UI

-Color-coded insights for quick analysis

-Hoverable data points with key information

##⚖️ License
This project is intended for evaluation purposes only and should not be used for production without modification.
