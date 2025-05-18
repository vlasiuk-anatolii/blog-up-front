"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Box, Typography, Tooltip, IconButton } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import CodeIcon from "@mui/icons-material/Code";
import LinkIcon from "@mui/icons-material/Link";
import { useEffect } from "react";
import Placeholder from "@tiptap/extension-placeholder";
import { boxStyles } from "@/app/common/constants/styles";

type TiptapProps = {
	value: string;
	onChange: (value: string) => void;
	error?: boolean;
	helperText?: string;
};

const Tiptap = ({ value, onChange, error, helperText }: TiptapProps) => {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Placeholder.configure({
				placeholder: "Start messaging...",
			}),

			Link.configure({
				openOnClick: false,
			}),
		],
		content: value,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
	});

	useEffect(() => {
		if (editor && value !== editor.getHTML()) {
			editor.commands.setContent(value);
		}
	}, [editor, value]);

	if (!editor) return null;

	const handleClick = (e: React.MouseEvent, action: () => void) => {
		e.stopPropagation();
		action();
	};

	return (
		<Box>
			{/* Toolbar */}
			<Box sx={boxStyles}>
				<Tooltip title="Bold">
					<IconButton
						onClick={(e) =>
							handleClick(e, () =>
								editor.chain().focus().toggleBold().run()
							)
						}
						color={editor.isActive("bold") ? "primary" : "default"}
					>
						<FormatBoldIcon />
					</IconButton>
				</Tooltip>
				<Tooltip title="Italic">
					<IconButton
						onClick={(e) =>
							handleClick(e, () =>
								editor.chain().focus().toggleItalic().run()
							)
						}
						color={
							editor.isActive("italic") ? "primary" : "default"
						}
					>
						<FormatItalicIcon />
					</IconButton>
				</Tooltip>
				<Tooltip title="Code">
					<IconButton
						onClick={(e) =>
							handleClick(e, () =>
								editor.chain().focus().toggleCode().run()
							)
						}
						color={editor.isActive("code") ? "primary" : "default"}
					>
						<CodeIcon />
					</IconButton>
				</Tooltip>
				<Tooltip title="Insert link">
					<IconButton
						onClick={(e) =>
							handleClick(e, () => {
								const url = prompt("Enter URL");
								if (url) {
									editor
										.chain()
										.focus()
										.extendMarkRange("link")
										.setLink({ href: url })
										.run();
								}
							})
						}
					>
						<LinkIcon />
					</IconButton>
				</Tooltip>

				<EditorContent editor={editor} />
			</Box>

			{/* Editor */}

			{helperText && (
				<Typography
					variant="caption"
					color={error ? "error" : "textSecondary"}
					mt={0.5}
				>
					{helperText}
				</Typography>
			)}
		</Box>
	);
};

export default Tiptap;
