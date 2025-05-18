"use client";

import { useEffect } from "react";
import { Typography, CircularProgress, Box } from "@mui/material";
import PostsGrid from "./posts-grid";
import { usePosts } from "../store/usePosts";
import { SearchButton } from "./searchButton";

export default function Posts() {
	const { posts, loading, error, loadPosts } = usePosts();

	useEffect(() => {
		loadPosts();
	}, [loadPosts]);

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ textAlign: "center", mt: 4 }}>
				<Typography color="error">{error}</Typography>
			</Box>
		);
	}

	if (!posts?.length) {
		return (
			<Box sx={{ textAlign: "center", mt: 4 }}>
				<Typography>No posts available at the moment.</Typography>
			</Box>
		);
	}

	return (
		<>
			<SearchButton />
			<PostsGrid posts={posts} />
		</>
	);
}
