'use client';
import { Button } from "@/components/ui/button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [showPassword, setPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPasswordInput] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const callbackUrl = new URLSearchParams(window.location.search).get('callbackUrl') || '/';

  const togglePassword = () => {
    setPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
      callbackUrl: callbackUrl,
    });

    if (res?.error) {
      setError("Invalid username or password");
    } else {
      console.log(callbackUrl)
      router.push(callbackUrl);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 rounded-lg w-full sm:w-96">
        <h1 className="text-2xl font-bold text-center text-green-600 mb-6">Sign In</h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-600">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 p-3 w-full border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="mt-2 p-3 w-full border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-14 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <Button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors">
            Authenticate
          </Button>
        </form>
      </div>
    </div>
  );
}
