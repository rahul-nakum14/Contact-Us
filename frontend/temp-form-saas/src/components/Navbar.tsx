import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-blue-600">
        FormSaaS
      </Link>
      <div className="space-x-4">
        <Link href="/auth/login" className="text-gray-700 hover:text-blue-500">
          Login
        </Link>
        <Link href="/auth/signup">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Sign Up
          </button>
        </Link>
      </div>
    </nav>
  );
}
