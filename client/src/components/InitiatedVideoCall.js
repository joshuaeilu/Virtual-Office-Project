import React, { useRef, useEffect, useCallback } from 'react';
import Peer from 'simple-peer';

function InitiatedVideoCall({ mySocketId, myStream, othersSocketId, webrtcSocket }) {
    const peerRef = useRef();

    const createPeer = useCallback(({ othersSocketId, mySocketId, myStream, webrtcSocket }) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: myStream
        });

        peer.on('signal', signal => {
            webrtcSocket.emit('sendOffer', { callToUserSocketId: othersSocketId, callFromUserSocketId: mySocketId, offerSignal: signal });
        });

        return peer;
    }, []);

    useEffect(() => {
        peerRef.current = createPeer({ othersSocketId, mySocketId, myStream, webrtcSocket });
    }, [othersSocketId, mySocketId, myStream, webrtcSocket, createPeer]);

    return <></>;
}

export default InitiatedVideoCall;