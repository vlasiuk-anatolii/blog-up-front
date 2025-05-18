"use client";

import { useParams } from "next/navigation";
import { Card, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Image } from "antd";
import { styleCard } from "@/app/common/constants/styles";
import { usePosts } from "@/app/store/usePosts";
import CreateCommentFab from "../../comments/create-comment/create-comment-fab";
import Comments from "@/app/comments/comments";
import { useEffect } from "react";

export default function SinglePost() {
	const { postId } = useParams();
	const { posts, loadComments } = usePosts();

	const post = posts.find((p) => (p?.id ?? "").toString() === postId);

	useEffect(() => {
		if (post) {
			loadComments({ postId: post?.id as number });
		}
	}, [post, loadComments]);

	if (!post) {
		return (
			<Grid container marginBottom={"2rem"} rowGap={3}>
				<Typography variant="h4" color="error">
					Post not found
				</Typography>
			</Grid>
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
