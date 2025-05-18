"use client"
import { Box, Modal } from "@mui/material";
import Comment from "../comment";
import { stylesPreviewMessageModal } from "@/app/common/constants/styles";

interface PreviewCommentModalProps {
	open: boolean;
	onClose: () => void;
	data: {
		username: string;
		email: string;
		homepage?: string;
		text: string;
		previewUrlImg?: string;
		textFileContent?: string;
	};
}

export default function PreviewCommentModal({
	open,
	onClose,
	data,
}: PreviewCommentModalProps) {
	const handleClose = () => {
		onClose();
	};
	const { username, email, homepage, text, previewUrlImg, textFileContent } =
		data;
	return (
		<Modal open={open} onClose={handleClose}>
			<Box sx={stylesPreviewMessageModal}>
				<Comment
					username={username}
					email={email}
					homepage={homepage || ""}
					date={new Date().toISOString()}
					content={text}
					previewUrlImg={previewUrlImg || ""}
					textFileContent={textFileContent || ""}
				/>
			</Box>
		</Modal>
	);
}
