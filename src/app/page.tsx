import Link from "next/link";
import { FaRocketchat } from "react-icons/fa";

export default function Home() {

	return (
		<main className='flex text-center flex-col items-center justify-center md:px-8 py-8 px-4 min-h-screen'>
			<div className=' mb-3 flex'>
				<h1 className='md:text-4xl text-3xl font-bold text-blue-600'>
					Welcome to Novu Chat
				</h1>
				<FaRocketchat className='text-4xl text-blue-600' />
			</div>

			<p className='text-sm mb-5'>
				A place where your thoughts and opinions counts. Share and mingle with
				like minds.
			</p>
			<Link
				href='/login'
				className=' bg-blue-600 text-white px-6 py-3 rounded-md'
			>
				Get Started
			</Link>
		</main>
	);
}