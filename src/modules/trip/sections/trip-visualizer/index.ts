"use client"

import dynamic from "next/dynamic";

export const TripVisualizer =  dynamic(() => import("./client-trip-visualizer"), { ssr: false });
