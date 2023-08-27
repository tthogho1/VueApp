export type location = {
    lat: number;
    lng: number;
}

export type user = {
    name: string;
    location: location;
    token:string;
    subscribe:boolean;   
}