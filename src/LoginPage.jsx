export default function LoginPage({ onLogin }) {
  return (
    <div className="bg-blue-900 min-h-screen flex items-center justify-center">
      
      <div className="bg-white p-8 rounded-xl shadow-lg w-80">
        
        <h1 className="text-2xl font-bold text-blue-900 text-center mb-6">
          Emergency Routing System
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={onLogin}
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition"
        >
          Login
        </button>

      </div>

    </div>
  );
}