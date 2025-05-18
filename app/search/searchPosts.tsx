"use client";

import { useState, useEffect, useMemo } from "react";
import {
	TextField,
	CircularProgress,
	Box,
	Typography,
	Paper,
} from "@mui/material";
import { usePosts } from "../store/usePosts";
import debounce from "lodash.debounce";
import PostsGrid from "../posts/posts-grid";

export default function SearchPosts() {
	const [query, setQuery] = useState("");
	const { performSearch, searchResults } = usePosts();
	const [loading, setLoading] = useState(false);

	const debouncedSearch = useMemo(() => {
		return debounce((value: string) => {
			setLoading(true);
			performSearch(value).finally(() => setLoading(false));
		}, 1000);
	}, [performSearch]);

	useEffect(() => {
		if (query.trim()) {
			debouncedSearch(query);
		}

		return () => {
			debouncedSearch.cancel();
		};
	}, [query, debouncedSearch]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value);
	};

	const hasResults = searchResults && searchResults.length > 0;
	const noResults =
		searchResults && searchResults.length === 0 && !loading && query.trim();

	return (
		<Box sx={{ margin: "0 auto", p: 2 }}>
			<Paper
				elevation={2}
				sx={{
					p: 2,
					mb: 3,
					borderRadius: 2,
				}}
			>
				<TextField
					fullWidth
					label="Find Posts"
					variant="outlined"
					value={query}
					onChange={handleChange}
					sx={{ mb: 1 }}
				/>
				<Typography variant="caption" color="text.secondary">
					Search for posts by title, content
				</Typography>
			</Paper>

			{loading && (
				<Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
					<CircularProgress />
				</Box>
			)}

			{hasResults && (
				<Box sx={{ mt: 3 }}>
					<Typography variant="subtitle1" sx={{ mb: 2 }}>
						Found {searchResults.length} result
						{searchResults.length !== 1 ? "s" : ""}
					</Typography>
					<PostsGrid posts={searchResults} />
				</Box>
			)}

			{noResults && (
				<Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
					<Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
						<Typography color="text.secondary">
							{`No results found for ${query}`}
						</Typography>
					</Paper>
				</Box>
			)}
		</Box>
	);
}
