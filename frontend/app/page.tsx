// import Image from "next/image";
// import Link from "next/link";

// export default function Home() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
//         <h1 className="text-3xl font-bold mb-8">Welcome to the Banking App</h1>
//         <Link href="/login">
//           <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
//             Go to Login Page
//           </button>
//         </Link>
//       </main>
//     </div>
//   );
// }

import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");
}
