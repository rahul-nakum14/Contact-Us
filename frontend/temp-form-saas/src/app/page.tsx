import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <header className="text-center py-20 px-6">
        <h1 className="text-4xl font-bold text-gray-900">
          Create & Share Temporary Contact Forms 🚀
        </h1>
        <p className="text-gray-600 mt-4 max-w-lg mx-auto">
          Generate custom contact forms in seconds and share them easily. No coding required.
        </p>
        <Link href="/auth/signup">
          <button className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Get Started
          </button>
        </Link>
      </header>
      <Footer />
    </div>
  );
}
