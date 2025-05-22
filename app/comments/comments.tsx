"use client";

import React, { useEffect, useState } from "react";
import {
	Box,
	Typography,
	FormControl,
	Select,
	MenuItem,
	SelectChangeEvent,
	Stack,
	Button,
	Pagination,
	Grid,
} from "@mui/material";
import { Comment as IComment } from "../posts/interfaces/post.interface";
import Comment from "./comment";
import { boxStyles } from "../common/constants/styles";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { API_URL } from "../common/constants/api";
import { io } from "socket.io-client";
import { usePosts } from "../store/usePosts";

interface CommentProps {
	comments: IComment[];
}

type SortField = "username" | "email" | "createdAt";

const COMMENTS_PER_PAGE = 25;

export default function Comments({ comments }: CommentProps) {
	const [sortField, setSortField] = useState<SortField>("createdAt");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const [page, setPage] = useState(1);
  const { loadPosts } = usePosts();
    
	useEffect(() => {
		const socket = io(API_URL!);

		socket.on("commentsUpdated", () => {
			loadPosts();
		});

		return () => {
			socket?.disconnect();
		};
	}, [loadPosts]);

	if (!comments?.length) {
		return (
			<Box sx={boxStyles}>
				<Typography variant="body2" color="text.secondary">
					No comments yet.
				</Typography>
			</Box>
		);
	}

	const handleSortFieldChange = (event: SelectChangeEvent) => {
		setSortField(event.target.value as SortField);
		setPage(1);
	};

	const toggleSortOrder = () => {
		setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		setPage(1);
	};

	const handlePageChange = (
		event: React.ChangeEvent<unknown>,
		value: number
	) => {
		setPage(value);
	};

	const sortedComments = [...comments].sort((a, b) => {
		const aValue = a[sortField] || "";
		const bValue = b[sortField] || "";

		if (sortField === "createdAt") {
			const aDate = aValue ? new Date(aValue).getTime() : 0;
			const bDate = bValue ? new Date(bValue).getTime() : 0;
			return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
		}

		const result = String(aValue).localeCompare(String(bValue));
		return sortOrder === "asc" ? result : -result;
	});

	const totalPages = Math.ceil(sortedComments.length / COMMENTS_PER_PAGE);
	const currentPageComments = sortedComments.slice(
		(page - 1) * COMMENTS_PER_PAGE,
		page * COMMENTS_PER_PAGE
	);

	return (
		<>
			<Box sx={{ ...boxStyles, mb: 2 }}>
				<Stack
					direction="row"
					spacing={2}
					alignItems="center"
					sx={{ mb: 2 }}
				>
					<FormControl size="small" sx={{ minWidth: 150 }}>
						<Select
							value={sortField}
							onChange={handleSortFieldChange}
							displayEmpty
						>
							<MenuItem value="username">User Name</MenuItem>
							<MenuItem value="email">E-mail</MenuItem>
							<MenuItem value="createdAt">Date</MenuItem>
						</Select>
					</FormControl>

					<Button
						variant="outlined"
						onClick={toggleSortOrder}
						startIcon={
							sortOrder === "asc" ? (
								<ArrowUpwardIcon />
							) : (
								<ArrowDownwardIcon />
							)
						}
						size="small"
					>
						{sortOrder === "asc" ? "Ascending" : "Descending"}
					</Button>

					<Typography variant="body2" color="text.secondary">
						{`All comments: ${comments.length}`}
					</Typography>
				</Stack>

				{currentPageComments.map(
					(
						{ id, username, text, email, createdAt, fileName, homepage },
						index
					) => (
						<div key={id} style={{ marginLeft: `${index * 10}px` }}>
							<Comment
								username={username}
								content={text}
								date={createdAt || ""}
								email={email}
								fileName={fileName || ""}
								homepage={homepage || undefined}
							/>
						</div>
					)
				)}

				{totalPages > 1 && (
					<Grid container justifyContent="center" sx={{ mt: 3 }}>
						<Pagination
							count={totalPages}
							page={page}
							onChange={handlePageChange}
							color="primary"
							showFirstButton
							showLastButton
						/>
					</Grid>
				)}
			</Box>
		</>
	);
}
