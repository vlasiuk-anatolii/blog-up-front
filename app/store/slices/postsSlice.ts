import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
	CustomError,
	deleteRequest,
	get,
	patch,
	post,
} from "@/app/common/utils/fetch";
import { Post, Comment } from "@/app/posts/interfaces/post.interface";

interface PostsState {
	items: Post[];
	searchResults: Post[];
	loading: boolean;
	error: string | null;
	isRecaptchaReady: boolean;
}

const initialState: PostsState = {
	items: [],
	searchResults: [],
	loading: false,
	error: null,
	isRecaptchaReady: false,
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
	const response = await get<Post[]>("posts");
	return response;
});

export const createPost = createAsyncThunk(
	"posts/createPost",
	async (
		data: { title: string; content: string; urlImg: string },
		thunkAPI
	) => {
		const formData = new FormData();
		formData.append("title", data.title);
		formData.append("content", data.content);
		formData.append("urlImg", data.urlImg);
		const response = await post("posts", formData);
		if (response.error) return thunkAPI.rejectWithValue(response.error);
		return response.data as Post;
	}
);

export const updatePost = createAsyncThunk(
	"posts/updatePost",
	async (
		data: { id: number; title?: string; content?: string; urlImg?: string },
		thunkAPI
	) => {
		const response = await patch(`posts/${data.id}`, data);
		if (response.error) return thunkAPI.rejectWithValue(response.error);
		return response.data as Post;
	}
);

export const deletePost = createAsyncThunk(
	"posts/deletePost",
	async (id: number, thunkAPI) => {
		const response = await deleteRequest(`posts/${id}`);
		if (response.error) return thunkAPI.rejectWithValue(response.error);
		if (response.data) {
			thunkAPI.dispatch(fetchPosts());
		}
		return id;
	}
);

export const fetchComments = createAsyncThunk(
	"posts/fetchComments",
	async (postId: number, thunkAPI) => {
		const response = await get<Comment[]>(`comments`);
		if ("data" in response && Array.isArray(response.data)) {
			return { postId, comments: response.data as Comment[] };
		}
		return thunkAPI.rejectWithValue("Unexpected response format");
	}
);

export const addComment = createAsyncThunk(
	"posts/addComment",
	async (
		data: {
			postId: number;
			username: string;
			email: string;
			homepage?: string;
			text: string;
			fileName?: string;
		},
		thunkAPI
	) => {
		const formData = new FormData();
		formData.append("postId", data.postId.toString());
		formData.append("username", data.username);
		formData.append("email", data.email);
		if (data.homepage) {
			formData.append("homepage", data.homepage);
		}
		formData.append("text", data.text);
		if (data.fileName) {
			formData.append("fileName", data.fileName);
		}
		const response = await post(`comments`, formData);
		if (response.error) return thunkAPI.rejectWithValue(response.error);
		return { postId: data.postId, comment: response.data as Comment };
	}
);
		
		

export const searchPosts = createAsyncThunk(
	"posts/searchPosts",
	async (query: string, thunkAPI) => {
		try {
			const params = new URLSearchParams({ query });
			const response = await get<Post[]>(
				"posts/search",
				undefined,
				params
			);

			return response as Post[];
		} catch (err) {
			return thunkAPI.rejectWithValue(
				err instanceof Error ? err.message : "An unknown error occurred"
			);
		}
	}
);

const postsSlice = createSlice({
	name: "posts",
	initialState,
	reducers: {
		setRecaptchaReady: (state, action: PayloadAction<boolean>) => {
		state.isRecaptchaReady = action.payload;
	},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchPosts.pending, (state) => {
				state.loading = true;
			})
			.addCase(
				fetchPosts.fulfilled,
				(state, action: PayloadAction<Post[] | CustomError>) => {
					state.loading = false;
					if (Array.isArray(action.payload)) {
						state.items = action.payload;
					} else {
						state.error =
							action.payload.message || "Failed to load";
					}
				}
			)
			.addCase(fetchPosts.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || "Failed to load";
			})
			.addCase(
				createPost.fulfilled,
				(state, action: PayloadAction<Post>) => {
					state.items.unshift({ ...action.payload, comments: [] });
				}
			)
			.addCase(
				updatePost.fulfilled,
				(state, action: PayloadAction<Post>) => {
					const index = state.items.findIndex(
						(p) => p.id === action.payload.id
					);
					if (index !== -1) {
						state.items[index] = {
							...action.payload,
							comments: state.items[index].comments || [],
						};
					}
				}
			)
			.addCase(
				deletePost.fulfilled,
				(state, action: PayloadAction<number>) => {
					state.items = state.items.filter(
						(p) => p.id !== action.payload
					);
				}
			)
			.addCase(fetchComments.pending, (state) => {
				state.loading = true;
			})
			.addCase(
				fetchComments.fulfilled,
				(
					state,
					action: PayloadAction<{
						postId: number;
						comments: Comment[];
					}>
				) => {
					state.loading = false;
					const post = state.items.find(
						(p) => p.id === action.payload.postId
					);
					if (post) {
						post.comments = action.payload.comments;
					}
				}
			)
			.addCase(
				addComment.fulfilled,
				(
					state,
					action: PayloadAction<{ postId: number; comment: Comment }>
				) => {
					const post = state.items.find(
						(p) => p.id === action.payload.postId
					);
					if (post) {
						post.comments = [
							...(post.comments || []),
							action.payload.comment,
						];
					}
				}
			)
			.addCase(searchPosts.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				searchPosts.fulfilled,
				(state, action: PayloadAction<Post[]>) => {
					state.loading = false;
					state.searchResults = action.payload;
				}
			)
			.addCase(searchPosts.rejected, (state, action) => {
				state.loading = false;
				state.error =
					(action.payload as string) || "Failed to search posts";
				state.searchResults = [];
			});
	},
});

export const postsReducer = postsSlice.reducer;
