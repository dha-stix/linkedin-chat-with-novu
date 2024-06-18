"use client";
import { useState } from "react";
import {
	GoogleAuthProvider,
	GithubAuthProvider,
	signInWithPopup,
} from "firebase/auth";
import { googleProvider, githubProvider, auth  } from "@/app/utils/firebase";
import Link from "next/link";
import { IoReturnDownBackSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";


export default function Login() {
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();

	const handleSignIn = async (provider: any, authProvider: any) => {
    try {
        const result = await signInWithPopup(auth, provider);
        const credential = await authProvider.credentialFromResult(result);
        const token =  credential?.accessToken;
		if (!token || !result.user) return alert("An error occurred while signing in");
		// Save user to subscriber
			const saveSubscriber = await fetch("/api/subscriber", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: result.user.email,
					name: result.user.displayName,
					id: result.user.uid,
					image: result.user.photoURL,
				}),
			});
			if (saveSubscriber.ok) {
				const data = await saveSubscriber.json();
				console.log(data);
				router.push("/chat");
			} else {
				alert("An error occurred while saving creating subscriber");
				setLoading(false);
			}
		
    } catch (error: any) {
        const errorMessage = error?.message;
        alert(`An error occurred, ${errorMessage}`);
        console.log(error);
        window.location.reload();
        setLoading(false);
    }
	};
	
	const handleGoogleSignIn = () => {
		setLoading(true);
		handleSignIn(googleProvider, GoogleAuthProvider);
	};

	const handleGithubSignIn = () => {
		setLoading(true);
		handleSignIn(githubProvider, GithubAuthProvider);
	};
	return (
		<main className='flex min-h-screen'>
			<div className='lg:w-1/3 lg:flex hidden bg-blue-600 p-6 text-white flex-col justify-center text-center items-center relative'>
				<h1 className='text-2xl mb-4 font-bold'>Welcome to Novu Chat</h1>
				<p className='text-sm'>A place where like minds meet and interact.</p>

				<section className='absolute bottom-10 text-left'>
					<p>
						&copy; {new Date().getFullYear()},{" "}
						<Link
							href='https://novu.co/'
							target='_blank'
							className='text-red-200'
						>
							Novu Apps
						</Link>
					</p>
				</section>
			</div>
			<div className='lg:w-2/3 w-full bg-white flex flex-col justify-center items-center'>
				<h1 className='text-4xl font-bold mb-8'>Login</h1>

				<button
					className='mb-6 px-6 w-2/3 py-3 border-[1px] hover:bg-[#E5E1DA] rounded-md border-gray-700 hover:border-none hover:text-blue-700 hover:font-bold'
					onClick={handleGoogleSignIn}
					disabled={loading}
				>
					{loading ? "Signing in..." : "Sign in with Google"}
				</button>

				<button
					className='mb-6 px-6 w-2/3 py-3 border-[1px] hover:bg-[#E5E1DA]  hover:border-none rounded-md border-gray-700 hover:text-blue-700 hover:font-bold'
					onClick={handleGithubSignIn}
					disabled={loading}
				>
					{loading ? "Signing in..." : "Sign in with GitHub"}
				</button>

				<Link href='/' className='text-sm flex items-end gap-x-2 text-blue-500'>
					<IoReturnDownBackSharp /> Go back home
				</Link>
			</div>
		</main>
	);
}