import { API_URL } from "@/app/common/constants/api";

export async function uploadCommentFile(commentId: number, file: File) {
	try {
		const formData = new FormData();
	formData.append("file", file);

	const response = await fetch(`${API_URL}/comments/${commentId}/file`, {
		method: "POST",
		body: formData,
		credentials: "include",
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Upload failed: ${response.status} ${errorText}`);
	}

	return await response.json();
	} catch (error) {
		throw new Error(
			`Error uploading file: ${error instanceof Error ? error.message : String(error)}`
		);	
	}
}
