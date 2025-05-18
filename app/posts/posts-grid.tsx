"use client";

import { Post as IPost } from "./interfaces/post.interface";
import { Grid } from "@mui/material";
import Post from "./post";

interface postGridProps {
	posts: IPost[];
}

export default function PostsGrid({ posts }: postGridProps) {
	return (
		<Grid
			container
			spacing={3}
			sx={{ height: "85vh", overflowY: "scroll" }}
		>
			{posts.map((post) => (
				<Grid key={post.id} size={{ xs: 12, sm: 6, lg: 4 }}>
					<Post post={post} />
				</Grid>
			))}
		</Grid>
	);
}
