import { messaging , usersRef ,usersQuery} from "@/firebase/app";
import { credentials } from "@/firebase/credentials";
import type { user } from "@/firebase/types/usertype";

import { loginUserStore } from '../stores/user';
import type { Router } from 'vue-router'
import { query, where, getDocs } from "firebase/firestore";

export const login  = async (username :string,router:Router,transition:string)  => {

    try{
        const token = await messaging.getToken({
            vapidKey: credentials.messagingConfig.vapidKey
        })

        if (token){
            navigator.geolocation.getCurrentPosition(
                // success callback
                function(position) {
                    const user :user = {name :username,
                                        location:{ lat: position.coords.latitude,
                                                    lng: position.coords.longitude},
                                        token:token,
                                        subscribe:true};
                    usersRef.add(user);
                    loginUserStore().setUser(user);

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

export const getUserToken = async (username:string):Promise<string> =>{
    const q = query(usersQuery,
        where("name", "==", username)
    );

    const snapshot = await getDocs(q);
    const dataArray = snapshot.docs.map(doc=>doc.data() as user)

    return dataArray[0].token;
}


export const getOtherUsersOnMap  = async (map:any,myname:string):Promise<user[]>  => {
    const latlngBound = map.getBounds();
    const latlngNE = latlngBound.getNorthEast();
    const latlngSW = latlngBound.getSouthWest();    
    
    const latitude_gte = latlngSW.lat(), latitude_lt = latlngNE.lat(), longitude_gte = latlngSW.lng(), longitude_lt = latlngNE.lng();

    const q = query(usersQuery,
        where("location.lat", ">=", latitude_gte),
        where("location.lat", "<", latitude_lt)
    );

    const snapshot = await getDocs(q);
    const dataArray = snapshot.docs.map(doc=>doc.data() as user)

    const result  = dataArray.filter(doc=> doc.location.lng >= longitude_gte 
                                    && doc.location.lng < longitude_lt
                                    && doc.name !== myname);

    return result;
}


export const getOtherUsersOnMapByListener  = async (map:any,myname:string) => {
    const latlngBound = map.getBounds();
    const latlngNE = latlngBound.getNorthEast();
    const latlngSW = latlngBound.getSouthWest();    
    
    const latitude_gte = latlngSW.lat(), latitude_lt = latlngNE.lat(), longitude_gte = latlngSW.lng(), longitude_lt = latlngNE.lng();

    usersRef.where('name','!=',myname)
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach(change=>{
                if (change.type === 'added'){
                    const user :user = change.doc.data() as user;
                    if (user.location.lat >= latitude_gte && user.location.lat < latitude_lt
                        && user.location.lng >= longitude_gte 
                        && user.location.lng < longitude_lt){
                            console.log(user);
                    }
                }
            })
        })
}