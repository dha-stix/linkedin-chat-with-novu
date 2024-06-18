import Image from "next/image";
import { getDatePosted } from "../utils/functions";

export default function CommentBox({ key, comment }: { key: string, comment: Comment }) {
	return (
		<div key={key} className='flex items-end gap-2 my-3 border-[1px] border-blue-200 rounded-md p-3 bg-blue-50'>
			<div>
				<Image
					src={comment.author_image}
					width={40}
					height={40}
					alt='avatar'
					className='rounded-full'
				/>
			</div>
			<div className="w-full">
				<p className='text-xs opacity-60 mb-2'>
					{comment.content}
				</p>

				<div className="flex items-center justify-between w-full ">
					<p className='text-sm'>{comment.author_name}</p>
					<p className='text-xs text-blue-500'>{getDatePosted(comment.date_posted)}</p>
				</div>
			</div>
		</div>
	);
}