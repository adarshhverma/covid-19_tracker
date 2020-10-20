import React, { useEffect, useState } from 'react';
import InfoBox from './infoBox';
import Map from './Map';
import Table from './Table';
import 'leaflet/dist/leaflet.css';
import {sortData} from './util';
import './App.css';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent
} from "@material-ui/core";



function App() {

  const [countries, setcountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, SetTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 26.5570505, lng: 11.9008317 });
  const [mapZoom, setMapZoom] = useState(2.2);
  const [mapCountries, setMapCountries] = useState([]);

                                                                                      
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all").then(response => response.json()).then(data => {
      setCountryInfo(data);
    })
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries").then((response) => response.json()).then((data) => {
      const countries = data.map((country) => (
        {
          name: country.country,
          value: country.countryInfo.iso2
        }
      ));
      
      const sortedData = sortData(data);
      SetTableData(sortedData);
      setMapCountries(data);
      setcountries(countries);

      

      })
    }

      getCountriesData();

  }, []);

  const onCountryChange = async (event)=> {
    const countryCode = event.target.value;
    

    const url = countryCode === 'worldwide' ?
     'https://disease.sh/v3/covid-19/all' :
     `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url).then(response => response.json())
    .then(data =>{
      setCountry(countryCode);
      setCountryInfo(data);

      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);

    })

  };

  console.log(countryInfo);

  

  return (
    <div className="app">
      <div className='app_left'>
        <div className="app_header">
          <h1 className='app_title'>Covid-19 Tracker</h1>
            <FormControl className="app__dropdown">
              <Select className='select_dropdwn' variant='outlined' onChange={onCountryChange} value={country}>
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
          <InfoBox title='Corona Cases' total={countryInfo.cases}  cases={countryInfo.todayCases}/>
          <InfoBox title='Recovered' total={countryInfo.recovered} cases={countryInfo.todayRecovered}/>
          <InfoBox title='Deaths' total={countryInfo.deaths} cases={countryInfo.todayDeaths}/>
        
        </div>

        <Map
          center = {mapCenter}
          zoom = {mapZoom}
          countries={mapCountries}
        />
        

      </div>
          <Card className="app_right">
            <CardContent>
               <h3>this is list</h3>
               <Table countries = {tableData}/>
               
              
            </CardContent>
          </Card>
    
      </div>
      
  );
}

export default App;
