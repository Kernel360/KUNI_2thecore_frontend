'use client'

import Map from "./map";

export default function CarLocationMap() {
    
    return (
        <div className="w-full h-full">
            <Map 
                width="300px" 
                height="350px" 
            />
        </div>
    );
}