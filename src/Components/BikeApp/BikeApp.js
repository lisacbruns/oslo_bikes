import React, { useState, useEffect } from 'react'
import './bikeApp.css'
import ReactMapGL, { Marker, Popup} from 'react-map-gl'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

export default function BikeApp(props) {
  
  // Token with map from MapBox
  const token = 'pk.eyJ1IjoibGlzYWNiciIsImEiOiJja3V6dGJxeWsxaGJjMnhyZm1vcnBnNHNqIn0.VBQ-tNKOywtIf4Qy4sYVJQ'

  const [stationInformation, setStationInformation] = useState(null)
  const [stationStatus, setStationStatus] = useState(null)
  const [viewport, setViewport] = useState({
    latitude: 59.9133301,
    longitude: 10.7389701,
    width: '100vw',
    height: '100vh',
    zoom: 11.5
  })
  const [selectedStation, setSelectedStation] = useState(null)
  const [stationInformationAndStatus, setStationInformationAndStatus] = useState(null)
  const [availableBikes, setAvailableBikes] = useState(props.availableBikes)
  const [startStation, setStartStation] = useState(null)
  const [finalStation, setFinalStation] = useState(null)
  const [showTrip, setShowTrip] = useState(false)
  const [distanceAndDuration, setDistanceAndDuration] = useState(null)

  useEffect(() => {
    if (startStation && finalStation) {
      fetch('https://maps.googleapis.com/maps/api/distancematrix/json?destinations=' 
      + parseFloat(startStation.lat) + '%2C' + parseFloat(startStation.lon) + '&origins=' 
      + parseFloat(finalStation.lat) + '%2C' + parseFloat(finalStation.lon) + 
      '&key=AIzaSyBEwrmAYSevbe3OUdfMY3EtFKKhNr1nYTE').then(response => 
        response.json()).then(result => setDistanceAndDuration(result.rows[0].elements[0]))
    } 
    
  }, [startStation, finalStation])

  useEffect(() => {
    // Fetches data with information on the stations and saves it in stationInformation
    fetch('http://gbfs.urbansharing.com/oslobysykkel.no/station_information.json')
    .then(response => response.json()).then(result => setStationInformation(result.data.stations))

    // Fetches data with information on the station statuses and saves it in stationStatus
    fetch('http://gbfs.urbansharing.com/oslobysykkel.no/station_status.json')
    .then(response => response.json()).then(result => setStationStatus(result.data.stations))
  },[]);

  useEffect(() => {
    window.scrollTo(0,0)
    const listener = e => {
      if (e.key === "Escape") {
        setSelectedStation(null);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener)
    }
  }, []);

  useEffect(() => {
    // The placement of the different stations is identical in both lists
    // The two dictionaries are merged together to gather all the data in one dictionary called stationInformationAndStatus
    const stations = []
    if (stationInformation && stationStatus) {
      for (let station = 0; station < stationInformation.length; station++) {
        stations.push(Object.assign({}, stationInformation[station], stationStatus[station]));
      }
      setStationInformationAndStatus(stations)
    }
  },[stationInformation, stationStatus]);

  const handleStartOnSelect = (item) => {
    // the item selected
    console.log(item)
    setStartStation(item)
  }
  const handleFinalOnSelect = (item) => {
    // the item selected
    console.log(item)
    setFinalStation(item)
  }
  
  function getShowerDuration(distance) {
		// Returns length of shower in hours
		const fuelUsage = 6.7 // Liters fuel per 100 km
		const energyPerLiter = 4.5 // kWh per liter
		const energyUsageShower = 0.5 // Energy in kWh per minute
		const totalShowerDuration = Math.round(distance / 1000 / 100 * fuelUsage * 365 * energyPerLiter / energyUsageShower / 60)
		return totalShowerDuration
	}

  return (
    <div>
      <ReactMapGL 
        {...viewport} 
        mapboxApiAccessToken={token}
        mapStyle="mapbox://styles/mapbox/streets-v10"
        onViewportChange={viewport => {
          setViewport(viewport);
        }}
      >
        {stationInformationAndStatus ? (stationInformationAndStatus.map(station => (
          <Marker 
            key={station.station_id} 
            latitude={station.lat} 
            longitude={station.lon}
          >
            <button
              className={(availableBikes ? station.num_bikes_available : station.num_docks_available) === 0 ? "grey-marker-btn" : "marker-btn"} 
              onClick={e => {
                e.preventDefault();
                setSelectedStation(station)
              }}
            >
              {(availableBikes ? station.num_bikes_available : station.num_docks_available)}
            </button>
          </Marker>
        ))) : null }

        {selectedStation ? (
          <Popup 
            latitude={selectedStation.lat} 
            longitude={selectedStation.lon}
            onClose={() => {
              setSelectedStation(null);
            }}
          >
            <div>
              <h2 className="popup-text">{selectedStation.name}</h2>
              <p className="popup-text">Bikes available: {selectedStation.num_bikes_available}</p>
              <p className="popup-text">Docks available: {selectedStation.num_docks_available}</p>
            </div>
          </Popup>
        ) : null }
      </ReactMapGL> 
      <h1 class="heading">Where do you want to travel?</h1>
      <div id="search-boxes">
        <div class="search-field">
          <p class="under-heading">Start station:</p>
          {stationInformationAndStatus ? (
            <ReactSearchAutocomplete
            items={stationInformationAndStatus}
            onSelect={handleStartOnSelect}
            autoFocus
          />
          ) : null}
        </div>
        <div class="search-field">
          <p class="under-heading">Final station:</p>
          {stationInformationAndStatus ? (
            <ReactSearchAutocomplete
            items={stationInformationAndStatus}
            onSelect={handleFinalOnSelect}
            autoFocus
          />
          ) : null}
        </div>
      </div>
      <button class="btn btn-primary" onClick={() => {
        startStation && finalStation ? setShowTrip(true) : setShowTrip(false)
      }}>Search</button>
      {showTrip ? <div id="environment-info">
        Estimated travel time between {startStation.name} and {finalStation.name} is {distanceAndDuration.duration.text} <br />
				When you bike you make the world a better place!
				If you bike this distance every day for a year instead of driving, 
        this will correspond to taking a {getShowerDuration(distanceAndDuration.distance.value)} hour long, warm shower.
      </div> : null}
    </div>
  )
}
