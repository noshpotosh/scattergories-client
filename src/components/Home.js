import React from 'react';

import CreateButton from './CreateButton.js';
import JoinButton from './JoinButton.js';

import '../style/Home.css';

function Home() {

  return (
    <div className="home">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=0" />
      <div className="home-body">
        <div className="title-wrapper">
          <img className="title-logo" src="https://play-lh.googleusercontent.com/fdg7CSbIxPIFbL9SHfgJpmZgVHXtPZFhidOCvHwIJYzzHJc19xY93FXQzW6wdwGyLpc"></img>
          <h6 className="title-header">THE GAME OF</h6>
          <h1 className="title">Scattergories</h1>
        </div>
        <CreateButton></CreateButton>
        <h5 className="join-seperator">OR</h5>
        <JoinButton></JoinButton>
      </div>
    </div>
  );
}

export default Home;