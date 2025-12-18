'use client';
import React from 'react';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";



export default function EcoTourPage() {
const { data: session, status } = useSession();
const router = useRouter();
const [error, setError] = React.useState<string | null>(null);
const [loading, setLoading] = React.useState(false);
const [success, setSuccess] = React.useState<string | null>(null);
const [tours, setTours] = React.useState<any[]>([]);

 useEffect(() => {
   async function fetchTours() {
     try {
       const res = await fetch("/api/ecotours");
       if (!res.ok) throw new Error("Failed to fetch tours");
       const data = await res.json();
       setTours(data.tours ?? data.ecoTours ?? []);
     } catch (err) {
       console.error(err);
     }
   }
   fetchTours();
 }, [status,session]);

 async function handleTourClick(tourId: string) {
   router.push(`/EcoTour/${tourId}`);
 }


    
    return ( 
        <div>
            <h1>Welcome to the Eco Tour Page</h1>

            <p>Explore our eco-friendly tours and adventures!</p>
                <div className="tour-list">
                    {tours.map((tour) => (
                        <div key={tour.id} className="tour-item" onClick={() => handleTourClick(tour.id)}>
                            <h2>{tour.title}</h2>
                            <p>{tour.description}</p>
                            <p>Price: ${tour.price}</p>
                            <p>Location: {tour.location}</p>
                        </div>
                    ))}
        </div>
        </div>
    );
}