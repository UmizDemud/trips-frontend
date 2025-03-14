import dynamic from "next/dynamic";

export const MapView =  dynamic(() => import("./client-map-view"), { ssr: false });