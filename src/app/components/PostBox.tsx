import Image from "next/image";
import { FcLike } from "react-icons/fc";
import { FaComment } from "react-icons/fa6";
import { useState } from "react";
import CommentModal from "./CommentModal";
import { getDatePosted } from "../utils/functions";
import { updateDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

export default function PostBox({
	post,
	key,
	user,
}: {
	post: Post;
	key: string;
	user: User;
}) {
	const [commentModal, setCommentModal] = useState<boolean>(false);
	const openModal = () => setCommentModal(true);

	const handleLikePost = async () => {
		try {
			//👇🏻 create likes collection to allow a user like only once
			const docRef = doc(db, `posts/${post.id}/likes`, user.id);
			const document = await getDoc(docRef);
			if (document.exists()) return;
			//👇🏻 create or update the document
			await setDoc(docRef, { liked: true });
			//👇🏻 update the number of likes on the post
			await updateDoc(doc(db, "posts", post.id), { likes: post.likes + 1 });
			//👇🏻 send Notification
			sendNotification();
		} catch (err) {
			console.error(err);
		}
	};

		const sendNotification = async () => { 
		try {
			const res = await fetch("/api/notify", {
				method: "POST",
				body: JSON.stringify({
					type: "like",
					name: user.name,
					id: user.id,
					subscriberID: post.author_id,
					content: "like",
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();
			console.log(data);

		} catch (err) { 
			console.error(err);
		}
	}


	return (
		<section
			className='md:my-4 my-2 p-4 rounded-lg md:w-2/3 w-full border-blue-200 border-[1px] shadow-lg'
			key={key}
		>
			<div className='flex gap-2 mb-3'>
				<Image
					src={post.author_image}
					width={40}
					height={40}
					alt='avatar'
					className='rounded-full'
				/>
				<div>
					<p className='text-sm'>{post.author_name}</p>
					<p className='text-xs text-blue-400'>
						{getDatePosted(post.date_posted)}
					</p>
				</div>
			</div>

			<p className='text-xs opacity-70 mb-4'>{post.content}</p>

			<div className='w-full flex items-center gap-5'>
				<section className='flex items-baseline'>
					<FcLike
						className='text-md cursor-pointer mr-[2px]'
						onClick={handleLikePost}
					/>
					<p className='text-md'>{post.likes}</p>
				</section>

				<section className='flex items-baseline'>
					<FaComment
						className='text-md cursor-pointer text-blue-500 mr-[2px]'
						onClick={openModal}
					/>
					<p className='text-md'>{post.comments}</p>
				</section>
			</div>
			{commentModal && (
				<CommentModal
					setCommentModal={setCommentModal}
					commentModal={commentModal}
					postID={post.id}
					authorID={post.author_id}
					user={user}
				/>
			)}
		</section>
	);
}