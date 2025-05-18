
import { API_URL } from "../constants/api";
import { getErrorMessage } from "./errors";

export interface CustomError {
	message: string;
	statusCode?: number;
	details?: string;
}

// const API_URL =
//   typeof window === "undefined"
//     ? process.env.API_URL
//     : process.env.NEXT_PUBLIC_API_URL;

export const post = async (path: string, data: FormData | object) => {
	const body = data instanceof FormData ? Object.fromEntries(data.entries()) : data;
	const response = await fetch(`${API_URL}/${path}`, {
		method: "POST",
		headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
				},
        credentials: 'include',
		body: JSON.stringify(body),
	});

	const parsedRes = await response.json();

	if (!response.ok) {
		return { error: getErrorMessage(parsedRes) };
	}

	return { error: "", data: parsedRes };
};

export const get = async <T>(
	path: string,
	tags?: string[],
	params?: URLSearchParams
): Promise<T | CustomError> => {
	try {
		const url = params
			? `${API_URL}/${path}?${params.toString()}`
			: `${API_URL}/${path}`;
 
		const response = await fetch(url, {
			credentials: 'include', 
			next: {
				tags,
			},
		});

		if (!response.ok) {
			const error: CustomError = {
				message: `Error: ${response.status} ${response.statusText}`,
				statusCode: response.status,
				details: `The request to ${url} failed with status code ${response.status}.`,
			};
			return error;
		}

		const data = await response.json();
		return data as T;
	} catch (error) {
		const customError: CustomError = {
			message: "Network error or server is unreachable.",
			details: error instanceof Error ? error.message : "Unknown error.",
		};
		return customError;
	}
};

export const deleteRequest = async (path: string, data?: object) => {
	const response = await fetch(`${API_URL}/${path}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: data ? JSON.stringify(data) : undefined,
	});

	const parsedRes = await response.json();

	if (!response.ok) {
		return { error: getErrorMessage(parsedRes) };
	}

	return { error: "", data: parsedRes };
};

export const patch = async (path: string, data: object) => {
	const response = await fetch(`${API_URL}/${path}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify(data),
	});

	const parsedRes = await response.json();

	if (!response.ok) {
		return { error: getErrorMessage(parsedRes) };
	}

	return { error: "", data: parsedRes };
};

