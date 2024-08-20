import React, { useRef, useEffect, useState, useCallback } from 'react';
import Peer from 'simple-peer';

function InitiatedVideoCall({ mySocketId, myStream, othersSocketId, webrtcSocket }) {
    
    const peerRef = useRef();
    const [othersStream, setOthersStream] = useState();
    const setVideoNode = useCallback( videoNode => {
        videoNode && (videoNode.srcObject = othersStream);
    }, [othersStream]);

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
        //Listening on the answer signal and printing the answer signal
        webrtcSocket.on("receiveAnswer", payload => {
            
            if(payload.callToUserSocketId === othersSocketId){
                peerRef.current.signal(payload.answerSignal);
                console.log("receive answer signal from ", payload.answerSignal);
                
            }
        });

peerRef.current.on('stream', (stream) => {
    
    setOthersStream(stream)});

    }, [othersSocketId, mySocketId, myStream, webrtcSocket]);

    return <>
    {othersStream && <video width="200px" ref={setVideoNode} autoPlay={true} />}


    </>;
}

export default InitiatedVideoCall;