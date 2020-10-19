import React, { useEffect, useState } from 'react';
import InfoBox from './infoBox';
import Map from './map'
import './App.css';
import {
  MenuItem,
  FormControl,
  Select
} from "@material-ui/core";

function App() {

  const [countries, setcountries] = useState([]);
  const [country, setCountry] = useState('worldwide');

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

  const onCountryChange = async (event)=> {
    const countryCode = event.target.value;
    console.log("Yooo",countryCode);
    setCountry(countryCode);
  }

  

  return (
    <div className="app">
    <div className='app_left'>
        <div className="app_header">
          <h1>Covid-19 Tracker</h1>
            <FormControl className="app__dropdown">
              <Select variant='outlined' onChange={onCountryChange} value={country}>
                <MenuItem value='worldwide'>Worldwide</MenuItem>
                {
                  countries.map(country => (
                    <MenuItem value={country.value}>{country.name}</MenuItem>
                  ))
                }

              </Select>
            </FormControl> 
            
        </div>
        <div className="app__stats">
          <InfoBox title='Corona Cases' total={3000}  cases={1234}/>
          <InfoBox title='Recovered' total={2000} cases={1234}/>
          <InfoBox title='Deaths' total={7000} cases={1234}/>
        
        </div>

        <Map/>
        <h2>{country}</h2>

      </div>
    </div>
      
  );
}

export default App;
