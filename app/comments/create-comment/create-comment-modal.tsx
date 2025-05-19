"use client"
import {
	Box,
	Button,
	Modal,
	Stack,
	TextField,
	Typography,
	Input,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { usePosts } from "../../store/usePosts";
import { CloudUpload } from "@mui/icons-material";
//import { API_URL } from "@/app/common/constants/api";
import { uploadCommentFile } from "../actions/upload-comment-file";
import { useAppSelector } from "@/app/store/hooks";
import NextImage from "next/image";
import Tiptap from "./comment-editor";
import { sanitizeInputHtml } from "../../common/utils/sanitize-html";
import {
	fileInputStyles,
	styleBoxPreviewFile,
	styles,
} from "@/app/common/constants/styles";
import PreviewCommentBtn from "./preview-comment-btn";

interface CreateCommentModalProps {
	open: boolean;
	onClose: () => void;
}

export default function CreateCommentModal({
	open,
	onClose,
}: CreateCommentModalProps) {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [homepage, setHomepage] = useState("");
	const [text, setText] = useState("");
	const [fileName, setFileName] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const [textFileContent, setTextFileContent] = useState<string>("");
	const [preview, setPreview] = useState<string | null>(null);
	const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
	const [error, setError] = useState<{ [key: string]: string }>({});
	const { commentOnPost, loadComments } = usePosts();
	const { postId: postIdParam } = useParams();
	const postId = Number(postIdParam);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const isRecaptchaReady = useAppSelector((state) => state.recaptcha.isReady);
	const action = "submit";
	const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];

		if (!selectedFile) return;

		const fileType = selectedFile.type;
		if (
			![
				"image/jpg",
				"image/jpeg",
				"image/png",
				"image/gif",
				"text/plain",
			].includes(fileType)
		) {
			setError({ error: "Valid file formats are JPG, PNG, GIF, or TXT" });
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
			return;
		}

		const maxSize =
			fileType === "text/plain" ? 100 * 1024 : 5 * 1024 * 1024;
		if (selectedFile.size > maxSize) {
			setError({
				error: `The file is too large. Maximum size: ${
					maxSize / 1024
				} КB`,
			});
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
			return;
		}

		if (fileType.startsWith("image/")) {
			try {
				const resizedImage: File = await resizeImage(
					selectedFile,
					320,
					240
				);
				setFile(resizedImage);

				const previewURL = URL.createObjectURL(resizedImage);
				setPreview(previewURL);
			} catch (error) {
				console.error("Error processing image", error);
				setError({ error: "Error processing image" });
				if (fileInputRef.current) {
					fileInputRef.current.value = "";
				}
			}
		} else {
			setFile(selectedFile);
			setPreview(null);
		}
	};

	const resizeImage = (
		file: File,
		maxWidth: number,
		maxHeight: number
	): Promise<File> => {
		return new Promise<File>((resolve, reject) => {
			const img = new Image();

			img.onload = (): void => {
				let width = img.width;
				let height = img.height;

				if (width > maxWidth || height > maxHeight) {
					const ratio = Math.min(
						maxWidth / width,
						maxHeight / height
					);
					width = Math.round(width * ratio);
					height = Math.round(height * ratio);
				}

				const canvas = document.createElement("canvas");
				canvas.width = width;
				canvas.height = height;

				const ctx = canvas.getContext("2d");
				if (!ctx) {
					reject(new Error("Failed to get 2D context for canvas"));
					return;
				}

				ctx.drawImage(img, 0, 0, width, height);

				canvas.toBlob(
					(blob): void => {
						if (!blob) {
							reject(
								new Error("Failed to create Blob from canvas")
							);
							return;
						}

						const resizedFile = new File([blob], file.name, {
							type: file.type,
							lastModified: Date.now(),
						});
						resolve(resizedFile);
					},
					file.type,
					0.9
				);
			};

			img.onerror = (error: Event | string): void => {
				reject(new Error(`Error loading image: ${error}`));
			};

			img.src = URL.createObjectURL(file);
		});
	};

	const validate = () => {
		const errors: { [key: string]: string } = {};
		if (!/^[a-zA-Z0-9]+$/.test(username))
			errors.username = "Only letters and digits allowed.";
		if (!email.match(/^\S+@\S+\.\S+$/)) errors.email = "Invalid email.";
		if (
			homepage &&
			!homepage.match(/^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+[/#?]?.*$/)
		)
			errors.homepage = "Invalid URL.";
		if (!text.trim()) errors.text = "Text is required.";
		return errors;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const errors = validate();
		if (Object.keys(errors).length > 0) {
			setError(errors);
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
					Accept: "application/json",
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

			let uploadedFilename = "";

			if (file) {
				const responseUploaded = await uploadCommentFile(
					postId,
					file as File
				);

				const uploadedData = await responseUploaded.json();
				uploadedFilename = uploadedData.filename;
			}

			await commentOnPost({
				username,
				email,
				homepage,
				postId,
				text,
				fileName: uploadedFilename,
			});

			await loadComments({ postId });
			handleClose();
		} catch (err: unknown) {
			setError({
				error:
					(err as { message?: string })?.message ||
					"Error creating or updating post",
			});
		}
	};

	const handleClose = () => {
		setUsername("");
		setEmail("");
		setHomepage("");
		setText("");
		setFile(null);
		setPreview(null);
		setFileName("");
		setRecaptchaToken(null);
		setError({});
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

	useEffect(() => {
		if (!file || !file.name.endsWith(".txt")) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			const text = e.target?.result as string;
			setTextFileContent(text);
		};
		reader.onerror = () => {
			setError({
				error: "Error reading text file",
			});
		};

		reader.readAsText(file);
	}, [file]);

	return (
		<Modal open={open} onClose={handleClose}>
			<Box sx={styles}>
				<form onSubmit={handleSubmit}>
					<Stack spacing={2}>
						<Typography variant="h5">Add New Comment</Typography>
						<TextField
							label="User Name"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							error={!!error.username}
							helperText={error.username}
						/>
						<TextField
							label="Email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							error={!!error.email}
							helperText={error.email}
						/>
						<TextField
							label="Homepage"
							value={homepage}
							onChange={(e) => setHomepage(e.target.value)}
							error={!!error.homepage}
							helperText={error.homepage}
						/>
						<Tiptap
							value={text}
							onChange={(val) => setText(sanitizeInputHtml(val))}
							error={!!error.text}
							helperText={error.text}
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
						{preview && (
							<Box sx={styleBoxPreviewFile}>
								<NextImage
									src={preview}
									alt="Preview"
									width={320}
									height={240}
									style={{ objectFit: "cover" }}
								/>
							</Box>
						)}
						{file && file.name.endsWith(".txt") && (
							<Box sx={styleBoxPreviewFile}>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									{textFileContent}
								</Typography>
							</Box>
						)}
						<Button
							component="label"
							variant="outlined"
							startIcon={<CloudUpload />}
						>
							Upload File
							<Input
								type="file"
								name="file"
								style={fileInputStyles}
								inputRef={fileInputRef}
								onChange={(
									e: React.ChangeEvent<HTMLInputElement>
								) => {
									const file = e.target.files?.[0];
									setFileName(file?.name || "");
									handleFileChange(e);
								}}
							></Input>
						</Button>

						<Typography>{fileName}</Typography>
						<PreviewCommentBtn
							data={{
								username,
								email,
								homepage,
								text,
								previewUrlImg: preview || "",
								textFileContent,
							}}
						/>
						<Button
							type="submit"
							variant="contained"
							disabled={!recaptchaToken}
						>
							Submit
						</Button>
					</Stack>
				</form>
			</Box>
		</Modal>
	);
}
