import React, { useEffect, useState } from 'react';
import './App.css';
import {
  MenuItem,
  FormControl,
  Select
} from "@material-ui/core";

function App() {

  const [countries, setcountries] = useState([])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries").then((response) => response.json()).then((data) => {
      const countries = data.map((country) => (
        {
          name: country.country,
          value: country.countryInfo.iso2
        }
      ));

      setcountries(countries);

      })
    }

      getCountriesData();

  }, []);
  return (
    <div className="app">
      <div className="app_header">
        <h1>Covid-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select>
              {
                countries.map(country => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }

            </Select>
          </FormControl> 
      </div>
    </div>
      
  );
}

export default App;
