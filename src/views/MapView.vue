<template>
<div>
    <GoogleMap id="gmap" ref="mapRef" :api-key="GOOGLE_MAPS_API_KEY" style="width: 100%; height: 500px" :center="center" :zoom="15">
        <Marker :options="markerOptions" />
        <!-- MarkerCluster>
        <Marker v-for="(webCam, i) in webCams" :options="{ position: {lat:webCam.location.latitude,lng:webCam.location.longitude} }" :key="i">
            <InfoWindow>
                <div><button  class="link-button"  v-on:click="openvideo(webCam.player.day.link,webCam.image.current.thumbnail)">{{ webCam.title }}</button></div>
                <div><img :src="webCam.image.current.thumbnail" /></div>
            </InfoWindow>
        </Marker>
        </MarkerCluster -->
    </GoogleMap>
</div>
<div><button  v-on:click="TEST()">TEST</button></div>
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
</style>

<script setup lang="ts">
import { GoogleMap,  Marker } from "vue3-google-map";
import { ref ,watch} from "vue";
import { useUserStore } from '../stores/user';
import { getUsers } from "../firebase/user";

const mapRef = ref(null);
const center = ref({ lat: 0, lng: 0 }); // first position
const markerOptions = ref({ position: center})

const GOOGLE_MAPS_API_KEY="AIzaSyAYemHqW9xU48b7KhMXauA6P0fDFTWyly0";
//
// getLocation is called when the map is ready
//
const userStore = useUserStore();
const moveCurrentLocation = function(map:any,center:any, markerOptions:any){
    const markerIcon = {
        url:'./images/man.png',
        scaledSize: new mapRef.value.api.Size(30, 30)
    }
    
    const my = userStore.user;
    center.value = my.location;
    markerOptions.value = {position: center, icon: markerIcon};
    const lat = my.location.lat;
    const lng = my.location.lng;
    map.panTo({ lat, lng });

} 

watch(() => mapRef.value?.ready, (ready) => {
    if (!ready) return;

    if (mapRef.value == null){  
        return;
    }
    const map = mapRef.value?.map;
    moveCurrentLocation(map,center,markerOptions);

    map.addListener("idle", (e:any) => {
        getUsers(map).then((users) =>{
        users.forEach((user)=>{
            console.log(user.data);
        })
    });
    });

    
})



const TEST = async function(){
    const data = {
        title: "Call",
        message: "Call from tester",
        token: "eGZXpoN-xKwU0xw2OSGrpk:APA91bHSBtStdITyFmY0NKyfZZI_UXCfiTAFmGDKPYqCFpzh4dt_OofXQjEkJOBOhi7lrcRj6VKTVa29bpyPDJpcFBebKGU8kHMxtL8d9fj_UXPgalXaOppCe9IRD6pvj8RV_5Mg4xZC"
    };

    const url = "https://ogr6nxh4gosk2nzcrighy2gr3u0zelzj.lambda-url.ap-northeast-1.on.aws/";

    const postData = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)   
    }
    try {
        const response = await fetch(url,postData);
        const result = await response.json();
        console.log(result);  
    } catch (error) {
        console.log(error);
    }
}

</script>

<style>
.link-button {
    background: none;
    border: none;
    color: blue;
    text-decoration: underline;
    cursor: pointer;
}
</style>