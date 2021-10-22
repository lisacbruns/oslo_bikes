import React, { useState, useRef, useEffect } from 'react';
import ToggleTabs from './Components/ToggleTabs/ToggleTabs';
import SearchField from './Components/SearchField/SearchField';
import Logo from './Components/Logo/Logo';
import Email from './Components/Email/Email';
import './app.css'

function App() {
  return (
    <>
      <div id="top-of-page">
        <div id="logo-container">
          <Logo />
        </div>
        <h1 id="main-heading">Oslo City Bikes</h1>
      </div>
      <ToggleTabs />
      <SearchField />
      <Email />
    </>
  );
}

export default App;
