import { off } from 'process';
import React, {useEffect, useRef, useCallback, useState} from 'react';
import Peer from 'simple-peer';

function ReceivedVideoCall({mySockedId, myStream, othersSocketId, webrtcSocket, offerSignal}){
    const peerRef = useRef();
    const [othersStream, setOthersStream] = useState();

    const createPeer = useCallback((othersSocketId, mySockedId, myStream, webrtcSocket, offerSignal) => {
        const peer = new Peer({
            initiator: false, 
            trickle: false,
            stream: myStream,
        });
        peer.on('signal', signal => {
            webrtcSocket.emit('sendAnswer', {callFromUserSocketId: othersSocketId, callToUserSocketId: mySockedId, answerSignal: signal})
        });
        peer.signal(offerSignal);
        return peer;
    }, []);

    useEffect(() => {
        peerRef.current = createPeer(othersSocketId, mySockedId, myStream, webrtcSocket, offerSignal);
    }, [mySockedId, myStream, othersSocketId, webrtcSocket]);

    return <></>;
}

export default ReceivedVideoCall;