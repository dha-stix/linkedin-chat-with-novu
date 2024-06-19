import {
	Dialog,
	Transition,
	DialogTitle,
	TransitionChild,
	DialogPanel,
} from "@headlessui/react";
import { FormEventHandler, Fragment, useEffect, useState } from "react";
import { MdCancel } from "react-icons/md";
import CommentBox from "./CommentBox";
import {
	addDoc,
	getDocs,
	doc,
	serverTimestamp,
	collection,
	query,
	onSnapshot,
	orderBy,
	limit,
	updateDoc,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { generateID } from "../utils/functions";

export default function CommentModal({
	setCommentModal,
	commentModal,
	postID,
	user,
	authorID
}: {
	setCommentModal: (value: boolean) => void;
	commentModal: boolean;
	postID: string;
	authorID: string;
	user: User;
}) {
	const closeModal = () => setCommentModal(false);
	const [newComment, setNewComment] = useState<string>("");
	const [comments, setComments] = useState<Comment[]>([]);
	const [disable, setDisable] = useState<boolean>(false);

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		setDisable(true);
		try {
			await addDoc(collection(db, `posts/${postID}/comments`), {
				content: newComment,
				author_name: user.name,
				author_image: user.image,
				date_posted: serverTimestamp(),
				id: generateID(),
			});
			//👇🏻 get the number of documents in the collection
			const commentsQuery = query(collection(db, `posts/${postID}/comments`));
			const commentsSnapshot = await getDocs(commentsQuery);
			const numberOfComments = commentsSnapshot.size;

			//👇🏻 update the number of comments on the post
			const postRef = doc(db, "posts", postID);
			await updateDoc(postRef, { comments: numberOfComments });
			//👇🏻 send notification
			sendNotification();
			setDisable(false);
			setNewComment("");
		} catch (err) {
			console.error(err);
		}
	};

	const sendNotification = async () => { 
		try {
			const res = await fetch("/api/notify", {
				method: "POST",
				body: JSON.stringify({
					type: "comment",
					name: user.name,
					id: user.id,
					subscriberID: authorID,
					content: newComment,
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

	useEffect(() => {
		const q = query(
			collection(db, `posts/${postID}/comments`),
			orderBy("date_posted", "desc"),
			limit(5)
		);
		const unsubscribe = onSnapshot(q, (snapshot) => {
			setComments(
				snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Comment[]
			);
		});
		return () => unsubscribe();
	}, [postID]);

	return (
		<div className=''>
			<Transition appear show={commentModal} as={Fragment}>
				<Dialog as='div' className='relative z-10' onClose={closeModal}>
					<TransitionChild
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<div className='fixed inset-0 bg-black bg-opacity-80' />
					</TransitionChild>

					<div className='fixed inset-0 overflow-y-auto'>
						<div className='flex min-h-full items-center justify-center p-4 text-center'>
							<TransitionChild
								as={Fragment}
								enter='ease-out duration-300'
								enterFrom='opacity-0 scale-95'
								enterTo='opacity-100 scale-100'
								leave='ease-in duration-200'
								leaveFrom='opacity-100 scale-100'
								leaveTo='opacity-0 scale-95'
							>
								<DialogPanel className='w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all overflow-y-auto max-h-[80vh]'>
									<div className='flex items-center justify-between'>
										<DialogTitle
											as='h3'
											className='text-xl font-bold leading-6 text-gray-900 mb-3'
										>
											Comments
										</DialogTitle>

										<MdCancel
											className='text-3xl text-red-500 cursor-pointer'
											onClick={closeModal}
										/>
									</div>

									<div>
										<form className='mt-2' onSubmit={handleSubmit}>
											<label htmlFor='content' className='opacity-60'>
												Post content
											</label>
											<textarea
												className='w-full text-xs border-[1px] p-2 rounded-md'
												name='content'
												rows={6}
												id='content'
												placeholder='Write your comment here...'
												required
												value={newComment}
												onChange={(e) => setNewComment(e.target.value)}
											/>

											<div className='mt-[1px] flex items-center justify-between space-x-4'>
												<button
													disabled={disable}
													type='submit'
													className='inline-flex justify-center rounded-md border border-transparent bg-blue-200 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
												>
													{ disable ? "Adding comment..." : "Submit"}
												</button>
											</div>
										</form>

										{comments.map((comment) => (
											<CommentBox key={comment.id} comment={comment} />
										))}
									</div>
								</DialogPanel>
							</TransitionChild>
						</div>
					</div>
				</Dialog>
			</Transition>
		</div>
	);
}