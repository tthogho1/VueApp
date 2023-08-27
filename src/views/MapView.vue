<template>
    <GoogleMap id="gmap" ref="mapRef" :api-key="GOOGLE_MAPS_API_KEY" style="width: 100%; height: 500px" :center="center" :zoom="15">
        <Marker :options="markerOptions" />

        <MarkerCluster>
        <Marker v-for="(user, i) in usersOnMap" :options="{ position: {lat:user.location.lat,lng:user.location.lng} }" :key="i">
            <InfoWindow>
                <div><button  class="link-button" v-on:click="Call(user.name);">{{ user.name }}</button></div>
            </InfoWindow> 
        </Marker>
        </MarkerCluster>
    </GoogleMap>
</template>

<style>
#gmap {
    pointer-events: auto; 
}
.header{
    width: 100%;
    height: 30px;
    z-index: 1;
}
.link-button {
    background: none;
    border: none;
    color: blue;
    text-decoration: underline;
    cursor: pointer;
}
</style>

<script setup lang="ts">
import { GoogleMap ,Marker, MarkerCluster,InfoWindow } from "vue3-google-map";
import { ref ,watch} from "vue";
import { loginUserStore } from '../stores/user';
import { getOtherUsersOnMap ,getUserToken ,getOtherUsersOnMapByListener} from "../firebase/user";
import type { user } from "../firebase/types/usertype";
import { messaging ,usersRef} from "../firebase/app";
import { mapconfig } from "../firebase/mapconfig";
import type { GoogleAuth } from "google-auth-library";

const mapRef = ref(null as any);
const center = ref({ lat: 0, lng: 0 }); // first position
const markerOptions = ref({ position: center})

const usersOnMap = ref<Array<user>>([]);

const GOOGLE_MAPS_API_KEY=`${mapconfig.apiKey}`;


messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
    
    // alert(JSON.stringify(payload.notification, null, 2));
    const confirmMessage = `${payload.notification.title} \n ${payload.notification.body}`;
    const result = window.confirm(confirmMessage);

    if (result){
        window.open('/skyway','_blank');
    }
    // Update the UI to include the received message.
});


const loginuserstore = loginUserStore();
const moveCurrentLocation = function(map:any,center:any, markerOptions:any){
    const markerIcon = {
        url:'./images/man.png',
        scaledSize: new mapRef.value.api.Size(30, 30)
    }
    
    const my = loginuserstore.user;
    center.value = my.location;
    markerOptions.value = {position: center, icon: markerIcon };
    const lat = my.location.lat;
    const lng = my.location.lng;
    map.panTo({ lat, lng });

} 

watch(() => mapRef.value?.ready, (ready) => {
    if ((!ready) || (mapRef.value == null)) {
        return;
    } 

    const map = mapRef.value?.map;
    moveCurrentLocation(map,center,markerOptions);

    const my = loginuserstore.user;
    map.addListener("idle", (e:any) => {
        getOtherUsersOnMap(map,my.name).then((users) =>{
            usersOnMap.value = users;
            //users.forEach((user)=>{console.log(user);})
        }).catch((error)=>{
            console.log(`get user ${error} `);
        });
    });

    getOtherUsersOnMapByListener(map,my.name);
    usersRef
        .onSnapshot((snapshot) => {
            const userArray = snapshot.docChanges();
            const latlngBound = map.getBounds();
            const latlngNE = latlngBound.getNorthEast();
            const latlngSW = latlngBound.getSouthWest();    
    
            const latitude_gte = latlngSW.lat(), latitude_lt = latlngNE.lat(), longitude_gte = latlngSW.lng(), longitude_lt = latlngNE.lng();

            userArray.forEach(change=>{
                const user :user = change.doc.data() as user;
                if (change.type === 'added'){
                    if (user.location.lat >= latitude_gte 
                        && user.location.lat < latitude_lt
                        && user.location.lng >= longitude_gte 
                        && user.location.lng < longitude_lt){
                            usersOnMap.value.push(user);
                    }
                }
            })
        })
})


const Call = async function(username:string){

    const result = confirm(`call to ${username} ?`); 
    if (result === false){
        return;
    }


    window.open('/skyway','_blank');

    const my = loginuserstore.user;
    const token = await getUserToken(username);
    
    const data = {
        title: "Call",
        message: `Call from ${my.name}`,
        token: `${token}`
    };

    const postData = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)   
    }

    try {
        const response = await fetch(`${mapconfig.pushMsgurl}`,postData);
        const result = await response.text();
        console.log(result);  
    } catch (error) {
        console.log(error);
    }
}

</script>
