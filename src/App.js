import React , { useState, useEffect } from 'react'
import numeral from "numeral";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import './App.css';
import "leaflet/dist/leaflet.css";
import InfoBox from "./components/InfoBox";
import LineGraph from "./components/LineGraph";
import Table from "./components/Table";
import { sortData, prettyPrintStat } from "./util";
import Map from "./components/Map";

function App() {
  //USESTATE HOOKS==================================================
  const [country, setInputCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState('cases');
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 })
  const [mapZoom, setMapZoom] = useState(3);

  //USEEFFECT HOOKS===================================================
  //1.GET THE CASES DATA ABOUT COUNTRIES FROM API
   useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  //2. USING API TO GET MORE DETAILS OF COUNTRIES LIKE NAMES AND COUNTRYCODE
  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
        });
    };

    getCountriesData();
  }, []);

  //WHAT HAPPENS WHEN WE CHANGE THE COUNTRY FROM THE DROPDOWN
  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    //IF THE COUNTRYCODE IS WORLDWIDE THEN IT WILL FETCH FROM FIRST API LINK
    //IF NOT THEN IT WILL FETCH FROM THE COUNTRY SPECIFIC LINK CREATED WITH THE COUNTRYCODE
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    //FETCH THE DATA FROM RESPECTED API LINK OF THE PARTICULAR COUNTRY AND UPDATE THE HOOKS
    //TO SHOW DIFFERENT RESULT ON THE INFOBOX     
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  //THIS IS SUPPOSED TO BE RENDERED ON THE BROWSER(JSX)
  return (<div>
    <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem className='dropdown_text' value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem className='dropdown_text' value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
    <div className="app">
      
      <div className="app__left">
        
        <div className="app__stats">
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            className="boxes"
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            className="boxes"
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            className="boxes"
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div>
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
        <div>
          <Card className='credits'>
              <CardContent>
                <h2>Created by Adarsh Verma</h2>
                <p>Source Code available at <a href="https://github.com/adarshhverma/covid-19_tracker" target="_blank">github</a></p>
              </CardContent>
          </Card>
        </div>
      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3>Worldwide new {casesType}</h3>
            <LineGraph casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  )
}

export default App;
