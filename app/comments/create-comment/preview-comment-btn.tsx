"use client";

import PreviewIcon from "@mui/icons-material/Preview";
import PreviewCommentModal from "./preview-comment-modal";
import { useState } from "react";

interface PreviewCommentBtnProps {
	data: {
		username: string;
		email: string;
		homepage?: string;
		text: string;
		previewUrlImg?: string;
		textFileContent?: string;
	};
}

export default function PreviewCommentBtn({ data }: PreviewCommentBtnProps) {
	const [modalVisible, setModalVisible] = useState(false);

	return (
		<>
			<PreviewCommentModal
				open={modalVisible}
				onClose={() => setModalVisible(false)}
				data={data}
			/>

			<PreviewIcon onClick={() => setModalVisible(true)} />
		</>
	);
}
