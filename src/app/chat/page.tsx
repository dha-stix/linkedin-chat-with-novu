"use client";
import { useState, useEffect} from "react";
import PostBox from "../components/PostBox";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/app/utils/firebase";
import Image from "next/image";
import ava from "@/app/images/ava.jpg";
import { useRouter } from "next/navigation";
import {
	serverTimestamp,
	addDoc,
	collection,
	onSnapshot,
	orderBy,
	query,
} from "firebase/firestore";
import NovuBell from "../components/NovuBell";


export default function Chat() {
	const [post, setPost] = useState<string>("");
	const [posts, setPosts] = useState<Post[]>([]);
	const [user, setUser] = useState<User>({
		image: "",
		id: "",
		email: "",
		name: "User",
	});
	const router = useRouter();

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user?.uid) {
				setUser({
					image: user.photoURL,
					id: user.uid,
					email: user.email,
					name: user.displayName,
				});
			} else {
				return router.replace("/");
			}
		});
	}, [router]);

	useEffect(() => {
		const q = query(collection(db, "posts"), orderBy("date_posted", "desc"));
		const unsubscribe = onSnapshot(q, (snapshot) => {
			setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Post[]);
		});
		return () => unsubscribe();
	}, [posts]);



	const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await addDoc(collection(db, "posts"), {
				content: post,
				author_id: user.id,
				author_name: user.name,
				author_image: user.image,
				date_posted: serverTimestamp(),
				likes: 0,
				comments: 0,
			});
			setPost("");
		
		} catch (err) {
			console.error(err);
		}
	};

	const handleSignOut = () => {
		signOut(auth)
			.then(() => {
				router.push("/login");
			})
			.catch((error) => {
				console.error({ error });
				alert("An error occurred, please try again");
			});
	};

	return (
		<div className='min-h-screen'>
			<nav className='w-full min-h-[10vh] flex items-center justify-between bg-blue-200 md:px-8 py-4 px-4 sticky top-0 z-10'>
				<h2 className='lg:text-2xl text-xl font-bold'>Novu Chat</h2>

				<div className='flex items-center gap-x-3'>
					<NovuBell subscriberID={user.id} />
				
					<Image
						src={user.image || ava}
						width={40}
						height={40}
						alt='avatar'
						className='rounded-full'
					/>

					<button
						className='bg-red-500 text-white px-4 py-2 rounded-md'
						onClick={handleSignOut}
					>
						Logout
					</button>
				</div>
			</nav>

			<main className='w-full lg:p-8 p-4 flex lg:flex-row flex-col-reverse items-start justify-between gap-5 '>
				<div className='lg:w-3/5 w-full flex flex-col items-center'>
					{posts.map((post) => (
						<PostBox key={post.id} post={post} user={user} />
					))}
				</div>

				<div className='lg:w-2/5 w-full'>
					<div className='lg:w-1/3 bg-[#F6F1F1] shadow-md rounded-lg lg:fixed w-full p-4'>
						<form onSubmit={handleCreatePost}>
							<textarea
								rows={8}
								value={post}
								required
								onChange={(e) => setPost(e.target.value)}
								placeholder="What's on your mind?"
								className='w-full border-[1px] border-blue-300 rounded-md p-2 text-xs'
							/>
							<div className='mt-2 flex items-center justify-between'>
								<button className='bg-blue-500 text-white px-4 py-2 text-sm rounded-md'>
									Post
								</button>
								<p className='text-xs text-gray-400'>{user.name}</p>
							</div>
						</form>
					</div>
				</div>
			</main>
		</div>
	);
}