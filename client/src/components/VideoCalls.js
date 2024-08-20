import React, { useEffect, useState } from 'react';
import MyVideo from './MyVideo';
import {connect} from 'react-redux';
import {MY_CHARACTER_INIT_CONFIG} from './characterConstants';
import InitiatedVideoCall from './InitiatedVideoCall';
import ReceivedVideoCall from './ReceivedVideoCall';



function VideoCalls({myCharacterData, otherCharactersData, webrtcSocket}) {
    const [myStream, setMyStream] = useState();
    const [offersReceived, setOffersReceived] = useState({});

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({video: true, audio: true})
        .then((stream) => {
            setMyStream(stream);
        });
    }, []);

    useEffect(() => {
        webrtcSocket.on("receiveOffer", payload => {
            console.log("received Offer from ", payload.callFromUserSocketId, "offersReceived", Object.keys(offersReceived));
            if(!Object.keys(offersReceived).includes(payload.callFromUserSocketId)){
                setOffersReceived({...offersReceived, [payload.callFromUserSocketId]: payload.offerSignal,});
            }
        }
        );},[webrtcSocket, offersReceived]);


    

    const myUserId = myCharacterData.id;
    const initiateCallToUsers = Object.keys(otherCharactersData)
    .filter((otherUserId) => otherUserId >= myUserId)
    .reduce((filteredObj, key) => {
        filteredObj[key] = otherCharactersData[key];
        return filteredObj;
    }, {});

    return (
        <>
            {myCharacterData && (
                <div className="videos">
                    <MyVideo myStream={myStream} />
                    {Object.keys(initiateCallToUsers).map((userId) => (
                        <InitiatedVideoCall
                            key={initiateCallToUsers[userId].socketId}
                            mySocketId={webrtcSocket.id}
                            myStream={myStream}
                            othersSocketId={initiateCallToUsers[userId].socketId}
                            webrtcSocket={webrtcSocket}
                        />
                    ))}

                    {Object.keys(offersReceived).map((othersSocketId) => {
                        // const matchingUserIds = Object.keys(otherCharactersData)
                        // .filter((otherUserId) => otherCharactersData[otherUserId].socketId === othersSocketId)
                        // console.assert(
                        //     matchingUserIds.length === 1,
                        //     "Unexpected list of matching user ids", 
                        //     matchingUserIds
                        // )

                        return <ReceivedVideoCall
                        key={othersSocketId}
                        mySocketId={webrtcSocket.id}
                        myStream={myStream}
                        othersSocketId={othersSocketId}
                        webrtcSocket={webrtcSocket}
                        offerSignal={offersReceived[othersSocketId]}/>
                    })}
                </div>
            )}
        </>
    );
}

const mapStateToProps = (state) => {
    const myCharacterData = MY_CHARACTER_INIT_CONFIG;
    const otherCharactersData = Object.keys(state.allCharacters.users)
    .filter(id => id != MY_CHARACTER_INIT_CONFIG.id)
    .reduce((filteredObj, key) => {
        filteredObj[key] = state.allCharacters.users[key];
        return filteredObj;
    }, {});

    return {myCharacterData: myCharacterData, otherCharactersData: otherCharactersData};
};

export default connect(mapStateToProps, {})(VideoCalls);