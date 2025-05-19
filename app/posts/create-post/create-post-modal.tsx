"use client";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { usePosts } from "../../store/usePosts";
//import { API_URL } from "@/app/common/constants/api";
import { useAppSelector } from "../../store/hooks";

const styles = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

interface CreatePostModalProps {
	open: boolean;
	onClose: () => void;
	initialData?: {
		title?: string;
		content?: string;
		urlImg?: string;
		id?: number;
	};
}

export default function CreatePostModal({
	open,
	onClose,
	initialData,
}: CreatePostModalProps) {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [urlImg, setUrlImg] = useState("");
	const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
	const isRecaptchaReady = useAppSelector((state) => state.recaptcha.isReady);

	const [error, setError] = useState<{
		title?: string;
		content?: string;
		urlImg?: string;
		recaptcha?: string;
	} | null>(null);

	const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

	const { createNewPost, updateExistingPost, loadPosts } = usePosts();
	const action = "submit";

	useEffect(() => {
		if (initialData && open) {
			setTitle(initialData.title || "");
			setContent(initialData.content || "");
			setUrlImg(initialData.urlImg || "");
		} else if (!open) {
			setTitle("");
			setContent("");
			setUrlImg("");
		}
	}, [initialData, open]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);
		

		if (!title || !content || !urlImg) {
			setError({
				...(title ? {} : { title: "Title is required" }),
				...(content ? {} : { content: "Content is required" }),
				...(urlImg ? {} : { urlImg: "URL image is required" }),
			});
			return;
		}

		try {
			if (!recaptchaToken) {
				setError({
					recaptcha:
						"reCAPTCHA token is not ready. Please try again.",
				});
				return;
			}
			
			//const response = await fetch(`${API_URL}/recaptcha/verify`, {
			const response = await fetch(`/recaptcha/verify`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					token: recaptchaToken,
					action,
				}),
			});

			const resultResponse = await response.json();

			if (
				!resultResponse.success ||
				typeof resultResponse.score !== "number"
			) {
				setError({
					recaptcha:
						"reCAPTCHA verification failed. Please try again.",
				});
				return;
			}
			
			if (initialData?.id !== undefined) {
				await updateExistingPost({
					id: initialData.id,
					title,
					content,
					urlImg,
				});
				loadPosts();
			} else {
				await createNewPost({ title, content, urlImg });
				loadPosts();
			}
			handleClose();
		} catch (err: unknown) {
			setError({
				urlImg:
					(err as { message?: string })?.message ||
					"Error creating or updating post",
			});
		}
	};

	const handleClose = () => {
		setTitle("");
		setContent("");
		setUrlImg("");
		setRecaptchaToken(null);
		setError(null);
		onClose();
	};

	useEffect(() => {
		if (
			open &&
			isRecaptchaReady &&
			siteKey &&
			window.grecaptcha?.enterprise
		) {
			window.grecaptcha.enterprise.ready(() => {
				window.grecaptcha.enterprise
					.execute(siteKey, { action })
					.then((token: string) => {
						setRecaptchaToken(token);
					})
					.catch(() => {
						setRecaptchaToken(null);
					});
			});
		}
	}, [open, isRecaptchaReady, siteKey]);

	return (
		<Modal open={open} onClose={handleClose}>
			<Box sx={styles}>
				<form onSubmit={handleSubmit} className="w-full max-w-xs">
					<Stack spacing={2}>
						<Typography variant="h5">Add post</Typography>
						<TextField
							name="title"
							label="Title"
							variant="outlined"
							value={title}
							onChange={(e) => {
								setTitle(e.target.value);
								console.log("Title changed:", e.target.value);
							}}
							helperText={error?.title}
							error={!!error?.title}
						/>
						<TextField
							name="content"
							label="Content"
							variant="outlined"
							value={content}
							onChange={(e) => {
								setContent(e.target.value);
								console.log("Content changed:", e.target.value);
							}}
							helperText={error?.content}
							error={!!error?.content}
						/>
						<TextField
							name="urlImg"
							label="URLImg"
							variant="outlined"
							value={urlImg}
							onChange={(e) => {
								setUrlImg(e.target.value);
								console.log("URLImg changed:", e.target.value);
							}}
							helperText={error?.urlImg}
							error={!!error?.urlImg}
						/>
						{error?.recaptcha && (
							<div
								style={{
									color: "red",
									fontSize: "0.75rem",
									marginTop: "3px",
								}}
							>
								{error.recaptcha}
							</div>
						)}
						
						<Button
							type="submit"
							variant="contained"
							disabled={!recaptchaToken}
						>
							{initialData?.id !== undefined ? "Update post" : "Create a post"}
						</Button>
					</Stack>
				</form>
			</Box>
		</Modal>
	);
}