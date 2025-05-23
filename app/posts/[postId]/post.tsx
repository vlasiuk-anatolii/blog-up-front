"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Box, Card, CircularProgress, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Image } from "antd";
import { styleCard } from "@/app/common/constants/styles";
import { usePosts } from "@/app/store/usePosts";
import CreateCommentFab from "../../comments/create-comment/create-comment-fab";
import Comments from "@/app/comments/comments";

export default function SinglePost() {
	const { postId } = useParams();
	const { posts, loading, error, loadPosts } = usePosts();
	
	useEffect(() => {
		if (posts.length === 0) {
			loadPosts();
		}
	}, [loadPosts, posts.length]);

	const post = posts.find((p) => (p?.id ?? "").toString() === postId);

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

	if (!post) {
		return (
			<Box sx={{ textAlign: "center", mt: 4 }}>
				<Typography>No post available at the moment.</Typography>
			</Box>
		);
	}

	return (
		<>
			<Card className={styleCard}>
				<CreateCommentFab  />
				<Grid container marginBottom={"2rem"} rowGap={3}>
					<Grid size={{ xs: 12, md: 6 }} sx={{ paddingX: 2 }}>
						<Image
							src={post.urlImg}
							className="w-full h-auto"
							sizes="100vw"
							alt="Picture of the post"
						/>
					</Grid>

					<Grid size={{ xs: 12, md: 6 }} sx={{ paddingX: 2 }}>
						<Stack gap={3}>
							<Typography variant="h2">{post.title}</Typography>
							<Typography>{post.content}</Typography>
						</Stack>
					</Grid>
				</Grid>
			</Card>
			<Comments comments={post.comments || []} />
		</>
	);
}

