import { messaging , usersRef } from "@/firebase/app";
import { credentials } from "@/firebase/credentials";
import type { user } from "@/firebase/types/usertype";

import { useUserStore } from '../stores/user';
import type { Router } from 'vue-router'
import { query, where, getDocs, QuerySnapshot } from "firebase/firestore";

export const login  = async (username :string,router:Router,transition:string)  => {

    try{
        const token = await messaging.getToken({
            vapidKey: credentials.messagingConfig.vapidKey
        })

        if (token){
            navigator.geolocation.getCurrentPosition(
                // success callback
                function(position) {
                    usersRef.add({token: token,
                                username : username,
                                location:{ lat: position.coords.latitude,
                                            lng: position.coords.longitude},
                                subscribe:true});
                    const user:user = {name :username,
                            location:{ lat: position.coords.latitude,
                                        lng: position.coords.longitude}} ;

                    const userStore = useUserStore();
                    userStore.setUser(user);

                    router.push(transition);
                },
                // error callback
                function(error) {
                    console.error(`Error getting location: ${error.message}`);
                }
            );
            
        }else{
            throw new Error("Token not found");
        }

    }catch(error){
        throw new Error(`login error : ${error} `);
    }
}

export const getUsers  = async (map:any):Promise<QuerySnapshot>  => {
    const latlngBound = map.getBounds();
    const latlngNE = latlngBound.getNorthEast();
    const latlngSW = latlngBound.getSouthWest();    
    
    const latitude_gte = latlngSW.lat(), latitude_lt = latlngNE.lat(), longitude_gte = latlngSW.lng(), longitude_lt = latlngNE.lng();

    const q = query(usersRef,
            where("location.lat", ">=", latitude_gte),
            where("location.lat", "<", latitude_lt),
            where("location.lng", ">=", longitude_gte),
            where("location.lng", "<", longitude_lt)
    )
    
    const snapshot = await  getDocs(q);

    return snapshot;

}
