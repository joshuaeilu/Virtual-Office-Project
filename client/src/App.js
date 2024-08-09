import React, { useState, useEffect } from 'react';

import GameLoop from './components/GameLoop';
import Office from './components/Office';
import VideoCalls from './components/VideoCalls';


import './App.css';
import { io } from 'socket.io-client';

const WEBRTC_SOCKET = io('http://localhost:8080');

function App() {
  const [socketConnected, setSocketConnected] = useState(false);
  WEBRTC_SOCKET.on('connect', () => {
    setSocketConnected(true);
  });

    // Logging out the offer signal received from the server
    WEBRTC_SOCKET.on('receiveOffer', ({ callFromUserSocketId, offerSignal }) => {
      console.log('Offer signal received from ', callFromUserSocketId, ' with signal: ', offerSignal);
    });

  return (
    <>
        <header>        
        </header>
        {socketConnected &&
          <main class="content">
              <GameLoop>
                <Office webrtcSocket={WEBRTC_SOCKET}/>
              </GameLoop>

              
              <VideoCalls webrtcSocket={WEBRTC_SOCKET}/>
              
          </main>
        }
        <footer>
        </footer>
    </>
  );
}

export default App;