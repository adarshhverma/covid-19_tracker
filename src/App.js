import React from 'react';
import './App.css';
import {
  MenuItem,
  FormControl,
  Select
} from "@material-ui/core";

function App() {
  return (
    <div className="app">
      <h1>Covid-19 Tracker</h1>
        <FormControl className="app__dropdown">
          <Select>
            <MenuItem value="worldwide">WorldWide</MenuItem>
            <MenuItem value="worldwide">WorldWide</MenuItem>
            <MenuItem value="worldwide">WorldWide</MenuItem>
            <MenuItem value="worldwide">WorldWide</MenuItem>
          </Select>
        </FormControl>
    </div>
      
  );
}

export default App;
