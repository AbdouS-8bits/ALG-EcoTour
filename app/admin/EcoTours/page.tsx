'use client';
import React from 'react';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
export default function EcoTourDashboard () {
const { data: session, status } = useSession();
const router = useRouter();
const [error, setError] = React.useState<string | null>(null);
const [loading, setLoading] = React.useState(false);
const [success, setSuccess] = React.useState<string | null>(null);
const [tours, setTours] = React.useState<any[]>([]);
const [showForm, setShowForm] = React.useState(false);




useEffect(() => {
  if (status === "unauthenticated") {
    router.push("/admin/login");
  }
}, [status, router]);

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

if (status === "loading") {
  return <div>Loading...</div>;
}
if (status !== "authenticated" || !session) {
  return null;
}



    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    setSuccess(null);


     
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const location = formData.get("location") as string;
    const Participate = formData.get("Participate") as string;

    try {
        const response = await fetch("/api/ecotours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, price: Number(price), location, maxParticipants: Number(Participate) }),
        });
        const data = await response.json();


        if (!response.ok) {
        setError(data.error || "Tour creation failed");
        setLoading(false);
        return;
        }
        setSuccess("✅ Eco Tour created successfully!");
        event.currentTarget.reset();
        setLoading(false);
    } catch (err: any) {
        setError("An error occurred. Please try again.");
        setLoading(false);
    }
    }



 
   const toggleForm = () => {
    setShowForm(!showForm);
   }


    return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-zinc-50">
        <header className="flex items-center justify-between p-6 bg-white dark:bg-black shadow">
        <h1 className="text-2xl font-bold">Eco Tours Dashboard</h1>
        <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >   </button>
            Logout
        </header>
        <main className="max-w-4xl mx-auto p-6">
        <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Manage Eco Tours</h2>
            <button
                onClick={toggleForm}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
                {showForm ? "Hide Form" : "Add New Tour"}
            </button>
            </div>
            {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 bg-white dark:bg-zinc-800 p-6 rounded shadow">
                <div className="mb-4">
                <label className="block mb-2 text-sm font-medium" htmlFor="title">
                    Title
                </label>
                <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    name="title"
                    placeholder="Enter tour title"
                    required
                />
                </div>
                <div className="mb-4">
                <label className="block mb-2 text-sm font-medium" htmlFor="description">
                    Description
                </label>
                <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="description"
                    placeholder="Enter tour description"
                    required
                ></textarea>
                </div>
                <div className="mb-4">
                <label className="block mb-2 text-sm font-medium" htmlFor="price">
                    Price (DZ)
                </label>
                <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="number"
                    name="price"
                    placeholder="Enter tour price"
                    required
                />  
                </div>
                <div className="mb-4">
                <label className="block mb-2 text-sm font-medium" htmlFor="location">
                    Location
                </label>
                <input  
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    name="location"
                    placeholder="Enter tour location"
                    required
                />
                </div>
                <div className="mb-4">
                <label className="block mb-2 text-sm font-medium" htmlFor="Participate">
                    Max Participants
                </label>
                <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"  
                    type="number"
                    name="Participate"
                    placeholder="Enter max participants"
                    required
                />
                </div>  
                {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
                )}
                {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    {success}
                </div>
                )}
                <button
                className={`w-full text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                type="submit"
                disabled={loading}
                >
                {loading ? "Creating Tour..." : "Create Tour"}
                </button>
            </form>
            )}
            <div>
            <h3 className="text-lg font-semibold mb-4">Existing Tours</h3>
            {tours.length === 0 ? (
                <p>No tours available.</p>
            ) : (
                <ul className="space-y-4">
                {tours.map((tour) => (
                    <li key={tour.id} className="bg-white dark:bg-zinc-800 p-4 rounded shadow">
                    <h4 className="text-md font-semibold mb-2">{tour.title}</h4>
                    <p className="text-sm mb-1">{tour.description}</p>
                    <p className="text-sm mb-1">Location: {tour.location}</p>
                    <p className="text-sm mb-1">Price: {tour.price} DZ</p>
                    <p className="text-sm">Max Participants: {tour.maxParticipants}</p>
                    </li>
                ))}
                </ul>
            )}
            </div>
        </section>

        </main>
        </div>
    );
}