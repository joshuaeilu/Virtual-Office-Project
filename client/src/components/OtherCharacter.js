
import React, {useEffect, useContext} from 'react';
import CanvasConext from './CanvasContext';
import {CHARACTER_IMAGE_SIZE, CHARACTER_CLASSES_MAP} from './characterConstants';
import {TILE_SIZE} from './mapConstants';
import {loadCharacter} from './slices/statusSlice';
import { MY_CHARACTER_INIT_CONFIG } from './characterConstants';
function OtherCharacter({name, x, y, characterClass}){
    const context = useContext(CanvasConext);
    useEffect(() => {
        if (context == null) {
            return;
        }
        const characterImg = document.querySelector(`#character-sprite-img-${characterClass}`);
        const { sx, sy } = CHARACTER_CLASSES_MAP[characterClass].icon;
        context.canvas.drawImage(
            characterImg,
            sx,
            sy,
            CHARACTER_IMAGE_SIZE - 5,
            CHARACTER_IMAGE_SIZE - 5,
            x * TILE_SIZE,
            y * TILE_SIZE,
            CHARACTER_IMAGE_SIZE,
            CHARACTER_IMAGE_SIZE
        );
        loadCharacter(true);
    }, [context, x, y, loadCharacter]);
    return null;

}


export default OtherCharacter;