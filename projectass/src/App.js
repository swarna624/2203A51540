import React from 'react';
import './App.css';
import AverageCalculator from './components/AverageCalculator';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Average Calculator Microservice</h1>
      </header>
      <main>
        <AverageCalculator />
      </main>
    </div>
  );
}

export default App;
