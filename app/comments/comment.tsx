"use client";

import React, { useEffect, useState } from "react";
import {
	Avatar,
	Box,
	CircularProgress,
	Stack,
	Typography,
} from "@mui/material";
import { Image } from "antd";
import { getFileUrl } from "./actions/get-file-url";
import { styleBoxPreviewFile, boxStyles } from "../common/constants/styles";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import Divider from "@mui/material/Divider";

export interface User {
	id: number;
	username: string;
	email: string;
	isActive: boolean;
	isVerified: boolean;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}

interface CommentProps {
	username: string;
	content: string;
	date: string;
	email: string;
	homepage?: string;
	fileName?: string;
	previewUrlImg?: string;
	textFileContent?: string;
}

export default function Comment({
	content,
	date,
	username,
	email,
	homepage,
	fileName,
	previewUrlImg,
	textFileContent,
}: CommentProps) {
	const [formattedDate, setFormattedDate] = useState("");
	const [textContentFile, setTextContentFile] = useState("");

	useEffect(() => {
		const localDate = new Date(date).toLocaleString("uk-UA", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
		setFormattedDate(localDate);
	}, [date]);

	useEffect(() => {
		if (fileName && fileName.endsWith(".txt")) {
			fetch(getFileUrl(fileName))
				.then((res) => res.text())
				.then((data) => setTextContentFile(data))
				.catch((err) =>
					console.error("Unable to load file", err)
				);
		}
	}, [fileName]);

	if (!formattedDate) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box sx={boxStyles}>
			<Stack direction="row" spacing={2} alignItems="center">
				<Avatar src={""} alt={username}>
					{username.charAt(0).toUpperCase()}
				</Avatar>

				<Box>
					<Typography variant="body2" color="text.secondary">
						Username:{" "}
						<Typography
							component="span"
							fontWeight="medium"
							color="text.primary"
						>
							{username}
						</Typography>
					</Typography>

					<Typography variant="body2" color="text.secondary">
						Email:{" "}
						<Typography
							component="span"
							fontWeight="medium"
							color="text.primary"
						>
							{email}
						</Typography>
					</Typography>

					<Typography variant="body2" color="text.secondary">
						Date of creation:{" "}
						<Typography
							component="span"
							fontWeight="medium"
							color="text.primary"
						>
							{formattedDate}
						</Typography>
					</Typography>
				</Box>
			</Stack>
			<Divider>Comment</Divider>
			<Box sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
				<div dangerouslySetInnerHTML={{ __html: content }} />
			</Box>
			{fileName ? (
				fileName.includes(".txt") ? (
					<Box sx={styleBoxPreviewFile}>
						<Typography
							variant="subtitle2"
							color="text.secondary"
							sx={{
								display: "flex",
								alignItems: "center",
								mb: 1,
							}}
						>
							<InsertDriveFileIcon sx={{ fontSize: 18, mr: 1 }} />
							Content of the text file attached by the user:
						</Typography>

						<Typography
							variant="body2"
							color="text.secondary"
							sx={{
								whiteSpace: "pre-wrap",
								fontFamily: "monospace",
							}}
						>
							{textContentFile}
						</Typography>
					</Box>
				) : (
					<Box sx={styleBoxPreviewFile}>
						<Typography
							variant="subtitle2"
							color="text.secondary"
							sx={{
								display: "flex",
								alignItems: "center",
								mb: 1,
							}}
						>
							<InsertDriveFileIcon sx={{ fontSize: 18, mr: 1 }} />
							Content of the image file attached by the user:
						</Typography>

						<Image
							src={getFileUrl(fileName)}
							className="w-full h-auto"
							sizes="100vw"
							alt="Picture of the post"
						/>
					</Box>
				)
			) : null}

			{previewUrlImg && (
				<Box sx={styleBoxPreviewFile}>
					<Typography
						variant="subtitle2"
						color="text.secondary"
						sx={{
							display: "flex",
							alignItems: "center",
							mb: 1,
						}}
					>
						<InsertDriveFileIcon sx={{ fontSize: 18, mr: 1 }} />
						Content of the image file attached by the user:
					</Typography>
					<Image
						src={previewUrlImg}
						className="w-full h-auto"
						sizes="100vw"
						alt="Picture of the post"
					/>
				</Box>
			)}
			{textFileContent && (
				<Box sx={styleBoxPreviewFile}>
					<Typography
						variant="subtitle2"
						color="text.secondary"
						sx={{
							display: "flex",
							alignItems: "center",
							mb: 1,
						}}
					>
						<InsertDriveFileIcon sx={{ fontSize: 18, mr: 1 }} />
						Content of the text file attached by the user:
					</Typography>

					<Typography variant="body2" color="text.secondary">
						{textFileContent}
					</Typography>
				</Box>
			)}
			{homepage && (
				<Box sx={styleBoxPreviewFile}>
					<Typography variant="body2" color="text.secondary">
						My homepage: {homepage}
					</Typography>
				</Box>
			)}
		</Box>
	);
}
