"use client";

import {
	Card,
	CardActionArea,
	Stack,
	Typography,
	IconButton,
	Box,
} from "@mui/material";
import { Post as IPost } from "./interfaces/post.interface";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { styleCard } from "../common/constants/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CreatePostModal from "./create-post/create-post-modal";
import { useState } from "react";
import { usePosts } from "../store/usePosts";

interface PostProps {
	post: Partial<IPost>;
}

export default function Post({ post }: PostProps) {
	const [modalVisible, setModalVisible] = useState(false);

	const openModal = () => setModalVisible(true);
	const closeModal = () => setModalVisible(false);

	const router = useRouter();
	const { removePost, loadPosts  } = usePosts();

	const handleCardClick = () => {
		router.push(`/posts/${post.id}`);
	};

	const handleDelete = async (e: React.MouseEvent) => {
		e.stopPropagation();
		const confirmDelete = window.confirm("Exactly delete the post?");
		if (confirmDelete && post.id !== undefined) {
			await removePost({id: post.id});
			loadPosts();
		}
	};

	const handleEdit = (e: React.MouseEvent) => {
		e.stopPropagation();
		openModal();
	};

	return (
		<>
			<CreatePostModal
				open={modalVisible}
				onClose={closeModal}
				initialData={post}
			/>

			<Card
				className={styleCard}
				sx={{ height: "500px", position: "relative" }}
			>
				<Box position="absolute" top={8} right={8} zIndex={1}>
					<IconButton onClick={handleEdit} aria-label="edit post">
						<EditIcon />
					</IconButton>
					<IconButton onClick={handleDelete} aria-label="delete post">
						<DeleteIcon />
					</IconButton>
				</Box>

				<CardActionArea
					onClick={handleCardClick}
					sx={{ height: "100%" }}
				>
					<Stack gap={3} height="100%" padding={2}>
						<Typography variant="h5">{post.title}</Typography>
						{post.urlImg && (
							<Image
								src={post.urlImg}
								width={600} 
								height={400}
								className="object-cover w-full h-auto"
								alt={`Picture of the post ${post.title}`}
								loading="lazy"
							/>
						)}
						<Typography variant="caption">
							{post.content}
						</Typography>
					</Stack>
				</CardActionArea>
			</Card>
		</>
	);
}
