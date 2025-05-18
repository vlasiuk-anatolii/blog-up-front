"use client";

import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreateCommentModal from "./create-comment-modal";
import { useState } from "react";

export default function CreateCommentFab() {
    const [modalVisible, setModalVisible] = useState(false);

	return (
		<> 
            <CreateCommentModal open={modalVisible} onClose={() => setModalVisible(false)} />
			<div className="fixed bottom-4 left-4">
				<Fab color="primary" onClick={() => setModalVisible(true)}>
					<AddIcon />
				</Fab>
			</div>
		</>
	);
}