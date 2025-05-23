import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_URL } from "@/app/common/constants/api";
import { cookies } from "next/headers";
import { getErrorMessage } from "../common/utils/errors";

export const getHeaders = async () => ({
	Cookie: (await cookies()).toString(),
});

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		const response = await fetch(`${API_URL}/comments`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				...(await getHeaders()),
			},
			body: JSON.stringify(body),
		});
        const responseData = await response.json();
		return NextResponse.json(responseData, { status: 201 });
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Error creating comment:", error.message);
			return { error: getErrorMessage(error.message) };
		}
		return NextResponse.json(
			{ error: getErrorMessage("Invalid JSON or server error") },
			{ status: 400 }
		);
	}
}
