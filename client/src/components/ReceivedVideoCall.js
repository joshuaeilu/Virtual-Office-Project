import { off } from 'process';
import React, {useEffect, useRef, useCallback, useState} from 'react';
import Peer from 'simple-peer';

function ReceivedVideoCall({mySockedId, myStream, othersSocketId, webrtcSocket, offerSignal}){
    const peerRef = useRef();
    const [othersStream, setOthersStream] = useState();
    const setVideoNode = useCallback((videoNode) => {
        videoNode && (videoNode.srcObject = othersStream);
    }, [othersStream]);

    const createPeer = useCallback((othersSocketId, mySockedId, myStream, webrtcSocket, offerSignal) => {
        const peer = new Peer({
            initiator: false, 
            trickle: false,
            stream: myStream,
        });
        peer.on('signal', signal => {
            webrtcSocket.emit('sendAnswer', {callFromUserSocketId: othersSocketId, callToUserSocketId: webrtcSocket.id, answerSignal: signal})
        });
        peer.signal(offerSignal);
        return peer;
    }, []);

    useEffect(() => {
        peerRef.current = createPeer(othersSocketId, mySockedId, myStream, webrtcSocket, offerSignal);

        //Listening on the answer signal and printing the answer signal
        webrtcSocket.on("receiveAnswer", payload => {
            
            if(payload.callToUserSocketId === othersSocketId){
                peerRef.current.signal(payload.answerSignal);
                console.log("receive answer signal from ", payload.answerSignal);
                
            }
        });

peerRef.current.on('stream', (stream) => {
    
    setOthersStream(stream)});


    }, [mySockedId, myStream, othersSocketId, webrtcSocket]);

    return <>
        {othersStream && <video width="200px" ref={setVideoNode} autoPlay={true} />}

    
    </>;
}

export default ReceivedVideoCall;