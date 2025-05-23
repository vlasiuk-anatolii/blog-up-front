import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_URL } from "@/app/common/constants/api";
import { cookies } from "next/headers";
import { getErrorMessage } from "../common/utils/errors";

export const getHeaders = async () => ({
	Cookie: (await cookies()).toString(),
});

export async function GET(req: NextRequest) {
	try {
		const url = new URL(req.url);
		const params = url.searchParams.toString();
		const fetchUrl = params
			? `${API_URL}/posts?${params}`
			: `${API_URL}/posts`;

		const response = await fetch(fetchUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				...(await getHeaders()),
			},
			credentials: "include",
		});

		const data = await response.json();

		if (!response.ok) {
			return NextResponse.json(
				{ error: getErrorMessage(data) },
				{ status: response.status }
			);
		}

		return NextResponse.json(data);
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Error fetching posts:", error.message);
			return NextResponse.json(
				{ error: getErrorMessage(error.message) },
				{ status: 500 }
			);
		} 
		return NextResponse.json(
			{ error: getErrorMessage("Internal Server Error") },
			{ status: 500 }
		);
	}
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(`${API_URL}/posts`, {
			method: "POST",
		    credentials: "include",
			headers: {
				"Content-Type": "application/json",
				...(await getHeaders()),
			},
            body: JSON.stringify(body),
		});
    return NextResponse.json(response, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
			console.error("Error creating post:", error.message);
            return { error: getErrorMessage(error.message) };
		} 
    return NextResponse.json(
      { error: getErrorMessage('Invalid JSON or server error') },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const data = await req.json();
    const id = data.id;

    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(await getHeaders()),
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.message || "Failed to update post" }, { status: response.status });
    }

    const updatedPost = await response.json();

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const data = await req.json();
    const id = data.id;

    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(await getHeaders()),
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.message || "Failed to deleting post with " }, { status: response.status });
    }

    const updatedPost = await response.json();

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
