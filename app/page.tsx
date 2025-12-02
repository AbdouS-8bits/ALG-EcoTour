import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-extrabold mb-4">ALG EcoTour</h1>
        <p className="text-lg mb-8">Sustainable tours and local experiences — discover, book, and support eco-friendly guides.</p>

        <div className="flex flex-wrap gap-3">
          <Link href="/admin/login" className="px-4 py-2 bg-green-600 text-white rounded">Admin Login</Link>
          <Link href="/admin/SighIn" className="px-4 py-2 border border-green-600 text-green-600 rounded">Admin Register</Link>
          <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded">Sign Up (Customer)</Link>
          <Link href="/tours" className="px-4 py-2 bg-zinc-800 text-white rounded">Browse Tours</Link>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-3">Why choose EcoTour?</h2>
          <ul className="list-disc ml-5 space-y-2">
            <li>Environmentally responsible local tours</li>
            <li>Verified local guides and community benefits</li>
            <li>Easy booking and secure payments</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
