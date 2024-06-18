interface User {
	image: string | null;
	id: string;
	email: string | null;
	name: string | null;
}
interface Post {
    id: string;
    content: string;
    author_id: string;
    author_name: string;
    author_image: string;
    date_posted: any;
    likes: number;
    comments: number;
}

interface Comment {
    id: string;
    author_name: string;
    author_image: string;
    content: string;
    date_posted: any;
}