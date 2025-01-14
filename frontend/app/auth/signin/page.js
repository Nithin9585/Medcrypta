// "use client";
// import { signIn } from "next-auth/react";
// import { useState } from "react";
// import { useRouter } from "next/navigation"; // Updated import

// export default function SignIn() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     const result = await signIn("credentials", {
//       redirect: false,
//       username,
//       password,
//     });

//     console.log("SignIn Result:", result); 
//     if (result?.error) {
//       console.error(result.error); // Log the error for debugging
//       setError("Invalid username or password");
//     } else if (result?.user) {
//       // Extract user role
//       const role = result.user.role; 
//       console.log("User role:", role); // Log role for debugging

//       // Redirect based on the user's role
//       switch (role) {
//         case "doctor":
//           router.push("/Doctor/dashboard");
//           break;
//         case "patient":
//           router.push("/Patient/dashboard");
//           break;
//         case "admin":
//           router.push("/Admin/dashboard");
//           break;
//         case "pharmacist":
//           router.push("/Pharmacist/dashboard");
//           break;
//         default:
//           console.error("User role is not recognized:", role);
//           setError("User role is not recognized.");
//           break;
//       }
//     } else {
//       setError("Something went wrong. Please try again.");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center">
//       <div className="p-8 rounded-lg shadow-lg w-full sm:w-96">
//         <h1 className="text-3xl font-semibold text-center text-green-600 mb-8">
//           Sign In
//         </h1>

//         <form onSubmit={handleSubmit}>
//           <div className="mb-6">
//             <label
//               htmlFor="username"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Username
//             </label>
//             <input
//               type="text"
//               id="username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//               className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300 ease-in-out"
//             />
//           </div>

//           <div className="mb-6">
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300 ease-in-out"
//             />
//           </div>

//           {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-3 mt-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-200 ease-in-out"
//           >
//             {loading ? (
//               <span className="animate-spin">Loading...</span>
//             ) : (
//               "Authenticate Role"
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
