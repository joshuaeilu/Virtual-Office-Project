import { onValue,ref } from "firebase/database";
import { useEffect } from "react";

export default function FirebaseListener({firebaseDatabase, updateAllCharactersData}) {
    useEffect(() => {
        const dbRef = ref(firebaseDatabase, 'users');
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            if (data != null) {
                updateAllCharactersData(data);
            }
        });
    }, [])
    
}