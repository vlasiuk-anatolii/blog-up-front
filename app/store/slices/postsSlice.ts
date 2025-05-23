import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CustomError, get } from "@/app/common/utils/fetch";
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
	const response = await fetch("/posts", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	});

	if (!response.ok) {
		throw new Error(`Error ${response.status}: ${response.statusText}`);
	}

	const data: Post[] = await response.json();
	return data;
});

export const createPost = createAsyncThunk(
	"posts/createPost",
	async (
		data: { title: string; content: string; urlImg: string },
		thunkAPI
	) => {
		const payload = {
			title: data.title,
			content: data.content,
			urlImg: data.urlImg,
		};

		try {
			const response = await fetch("/posts", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},

				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				const errorData = await response.json();
				return thunkAPI.rejectWithValue(
					errorData.error || "Failed to create post"
				);
			}

			const responseData = await response.json();
			return responseData as Post;
		} catch {
			return thunkAPI.rejectWithValue("Network error");
		}
	}
);

export const updatePost = createAsyncThunk(
	"posts/updatePost",
	async (
		data: { id: number; title?: string; content?: string; urlImg?: string },
		thunkAPI
	) => {
		try {
			const response = await fetch(`/posts`, {
				method: "PATCH",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},

				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const errorData = await response.json();
				return thunkAPI.rejectWithValue(
					errorData.error || "Failed to create post"
				);
			}

			const responseData = await response.json();
			return responseData as Post;
		} catch {
			return thunkAPI.rejectWithValue("Network error");
		}
	}
);

export const deletePost = createAsyncThunk(
	"posts/deletePost",
	async (data: { id: number }, thunkAPI) => {
		try {
			const response = await fetch(`/posts`, {
				method: "DELETE",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},

				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const errorData = await response.json();
				return thunkAPI.rejectWithValue(
					errorData.error || "Failed to create post"
				);
			}

			const responseData = await response.json();
			return responseData as Post;
		} catch {
			return thunkAPI.rejectWithValue("Network error");
		}
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
		const payload = {
			postId: data.postId,
			username: data.username,
			email: data.email,
			homepage: data.homepage || null,
			text: data.text,
			fileName: data.fileName || "",
		};
		
		try {
			const response = await fetch("/comments", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},

				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				const errorData = await response.json();
				return thunkAPI.rejectWithValue(
					errorData.error || "Failed to create comment"
				);
			}

			const responseData = await response.json();
			return { postId: data.postId, comment: responseData as Comment };
		} catch {
			return thunkAPI.rejectWithValue("Network error");
		}
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
				(state, action: PayloadAction<Post>) => {
					state.items = state.items.filter(
						(p) => p.id !== action.payload.id
					);
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
