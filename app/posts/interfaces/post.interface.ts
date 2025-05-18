export interface Comment {
	id?: number;
	postId: number;
	username: string;
	email: string;
	homepage?: string;
	text: string;
	fileName?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface Post {
	id?: number;
	title: string;
	content: string;
	urlImg: string;
	comments?: Comment[];
	creatorId?: number;
	updaterId?: number;
	createdAt?: string;
	updatedAt?: string;
	recaptchaToken?: string;
}
