import React, {useCallback, useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import CanvasContext from './CanvasContext';

import {MOVE_DIRECTIONS, MAP_DIMENSIONS, TILE_SIZE} from './mapConstants';
import { MY_CHARACTER_INIT_CONFIG } from './characterConstants';
import {update as updateAllCharactersData} from './slices/allCharactersSlice'
import {checkMapCollision} from './utils';
import { use } from 'react';

const GameLoop = ({children, allCharactersData, updateAllCharactersData}) => {
    const canvasRef = useRef(null);
    const [context, setContext] = useState(null);
    useEffect(() => {
        // frameCount used for re-rendering child components
        console.log("initial setContext");
        setContext({canvas: canvasRef.current.getContext('2d'), frameCount: 0});
    }, [setContext]);

    // keeps the reference to the main rendering loop
    const loopRef = useRef();

    const mycharacterData = allCharactersData[MY_CHARACTER_INIT_CONFIG.id];
    const moveMyCharacter = useCallback((e) => {
        var currentPosition = mycharacterData.position;
        const key = e.key;
       if(checkMapCollision(currentPosition.x, currentPosition.y)){
           return;
       }else{
        if (MOVE_DIRECTIONS[key]) {
            // ***********************************************
            // TODO: Add your move logic here
            const newPosition = { ...currentPosition };

        // Update the new position based on the key pressed
        if (key === 'w') {
            newPosition.y -= 1;
        } else if (key === 'a') {
            newPosition.x -= 1;
        } else if (key === 's') {
            newPosition.y += 1;
        } else if (key === 'd') {
            newPosition.x += 1;
        }

        // Create a new character data object with the updated position
        const newCharacterData = { ...mycharacterData, position: newPosition };

        // Update the state with the new character data
        updateAllCharactersData({ ...allCharactersData, [MY_CHARACTER_INIT_CONFIG.id]: newCharacterData });
        
        }
       }
    }, [ mycharacterData]);

    const tick = useCallback(() => {
        if (context != null) {
            setContext({canvas: context.canvas, frameCount: (context.frameCount + 1) % 60});
        }
        loopRef.current = requestAnimationFrame(tick);
    }, [context]);

    useEffect(() => {   
        loopRef.current = requestAnimationFrame(tick);
        return () => {
            loopRef.current && cancelAnimationFrame(loopRef.current);
        }
    }, [loopRef, tick])

    useEffect(() => {
        document.addEventListener('keypress', moveMyCharacter);
        return () => {
            document.removeEventListener('keypress', moveMyCharacter);
        }
    }, [moveMyCharacter]);

    return (
        <CanvasContext.Provider value={context}>
            <canvas
                ref={canvasRef} 
                width={TILE_SIZE * MAP_DIMENSIONS.COLS}
                height={TILE_SIZE * MAP_DIMENSIONS.ROWS}
                class="main-canvas"
            />
            {children}
        </CanvasContext.Provider>
    );
};

const mapStateToProps = (state) => {
    return {allCharactersData: state.allCharacters.users};
};

const mapDispatch = {updateAllCharactersData};

export default connect(mapStateToProps, mapDispatch)(GameLoop);