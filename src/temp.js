import React, { useState, useEffect } from 'react'
import './bikeApp.css'
import ReactMapGL, { Marker, Popup} from 'react-map-gl'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function BikeApp() {
  
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

  useEffect(() => {
    // Fetches data with information on the stations and saves it in stationInformation
    fetch('http://gbfs.urbansharing.com/oslobysykkel.no/station_information.json')
    .then(response => response.json()).then(result => setStationInformation(result.data.stations))

    // Fetches data with information on the station statuses and saves it in stationStatus
    fetch('http://gbfs.urbansharing.com/oslobysykkel.no/station_status.json')
    .then(response => response.json()).then(result => setStationStatus(result.data.stations))
  },[]);

  useEffect(() => {
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
  
  return (
    <div>
      <Tabs defaultActiveKey="available-bicycles" id="tabs" className="mb-3">
        <Tab eventKey="available-bicycles" title="Available Bicycles">
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
                  className={station.num_bikes_available === 0 ? "grey-marker-btn" : "red-marker-btn"} 
                  onClick={e => {
                    e.preventDefault();
                    setSelectedStation(station)
                  }}
                >
                  {station.num_bikes_available}
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
        </Tab>

        <Tab eventKey="available-docks" title="Available Docks">
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
                    className={station.num_docks_available === 0 ? "grey-marker-btn" : "red-marker-btn"} 
                    onClick={e => {
                      e.preventDefault();
                      setSelectedStation(station)
                    }}
                  >
                    {station.num_docks_available}
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
        </Tab>
      </Tabs>

    </div>
  )
}
