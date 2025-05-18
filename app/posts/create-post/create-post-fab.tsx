"use client";

import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreatePostModal from "./create-post-modal";
import { useState } from "react";

interface CreatePostFabProps {
	selectedPost?: { title: string; content: string; urlImg: string; id: number };
  }

export default function CreatePostFab({ selectedPost }: CreatePostFabProps) {
    const [modalVisible, setModalVisible] = useState(false);
	
	const openModal = () => setModalVisible(true);
	const closeModal = () => setModalVisible(false);

	return (
		<> 
            <CreatePostModal open={modalVisible} onClose={closeModal} initialData={selectedPost} />
			<div className="absolute left-10 bottom-10">
				<Fab color="primary" onClick={openModal}>
					<AddIcon />
				</Fab>
			</div>
		</>
	);
}