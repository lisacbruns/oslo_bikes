import React from 'react'
import BikeApp from '../BikeApp/BikeApp'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import 'bootstrap/dist/css/bootstrap.min.css';
import './toggleTabs.css'
import Logo from '../Logo/Logo.js'

export default function ToggleTabs() {
  return (
    <div id="tabs">
      <Tabs defaultActiveKey="available-bicycles" id="tabs" className="mb-3">
        <Tab eventKey="available-bicycles" title="Available Bicycles">
          <BikeApp availableBikes={true}/>
        </Tab>
        <Tab eventKey="available-docks" title="Available Docks">
          <BikeApp availableBikes={false}/>
        </Tab>
      </Tabs>
    </div>
  )
}
