import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE_URL = 'http://localhost:9876';

const AverageCalculator = () => {
  const [numberType, setNumberType] = useState('e');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requestCount, setRequestCount] = useState(0);
  const [windowSize] = useState(10);

  const getApiEndpoint = (type) => {
    return `${API_BASE_URL}/numbers/${type}`;
  };

  const fetchNumbers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(getApiEndpoint(numberType));
      setResult(response.data);
      setRequestCount(prev => prev + 1);
    } catch (err) {
      setError('Error fetching numbers. Please try again.');
      console.error('Error:', err);
    }
    setLoading(false);
  };

  const formatNumbers = (numbers) => {
    if (!Array.isArray(numbers)) return '[]';
    return `[${numbers.join(', ')}]`;
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Average Calculator</h2>
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <select 
              className="form-select"
              value={numberType}
              onChange={(e) => setNumberType(e.target.value)}
            >
              <option value="e">Even Numbers</option>
              <option value="p">Prime Numbers</option>
              <option value="f">Fibonacci Numbers</option>
              <option value="r">Random Numbers</option>
            </select>
            <button 
              className="btn btn-primary"
              onClick={fetchNumbers}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Fetch Numbers'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {result && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Response #{requestCount}</h5>
            <div className="row">
              <div className="col-md-6">
                <h6>Previous Window State:</h6>
                <p className="number-list">{formatNumbers(result.windowPrevState)}</p>
              </div>
              <div className="col-md-6">
                <h6>Current Window State:</h6>
                <p className="number-list">{formatNumbers(result.windowCurrState)}</p>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-6">
                <h6>Numbers Received:</h6>
                <p className="number-list">{formatNumbers(result.numbers)}</p>
              </div>
              <div className="col-md-6">
                <h6>Average:</h6>
                <p className="average">{result.avg.toFixed(2)}</p>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-12">
                <h6>Window Size:</h6>
                <p>{result.windowCurrState.length} numbers (max: {windowSize})</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AverageCalculator; 