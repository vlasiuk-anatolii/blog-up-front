import { API_URL } from "../constants/api";
import { getErrorMessage } from "./errors";

export interface CustomError {
	message: string;
	statusCode?: number;
	details?: string;
}

export const post = async (path: string, data: FormData | object) => {
	const body =
		data instanceof FormData ? Object.fromEntries(data.entries()) : data;
	const response = await fetch(`${API_URL}/${path}`, {
		method: "POST",
		credentials: "include",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
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

    console.log("📡 GET request to:", url); // Лог адреси запиту
    console.log("🧾 Tags:", tags); // Лог тегів (якщо є)
    console.log("🧩 API_URL:", API_URL); // Лог змінної середовища

    const response = await fetch(url, {
      credentials: "include",
      next: {
        tags,
      },
    });

    console.log("📬 Response status:", response.status); // Статус відповіді

    if (!response.ok) {
      const error: CustomError = {
        message: `Error: ${response.status} ${response.statusText}`,
        statusCode: response.status,
        details: `The request to ${url} failed with status code ${response.status}.`,
      };
      console.error("❌ Error response:", error); // Лог помилки
      return error;
    }

    const data = await response.json();
    console.log("✅ Response data:", data); // Дані з відповіді
    return data as T;
  } catch (error) {
    const customError: CustomError = {
      message: "Network error or server is unreachable.",
      details: error instanceof Error ? error.message : "Unknown error.",
    };
    console.error("❗ Network or unexpected error:", customError);
    return customError;
  }
};

export const deleteRequest = async (path: string, data?: object) => {
	const response = await fetch(`${API_URL}/${path}`, {
		method: "DELETE",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
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
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	const parsedRes = await response.json();

	if (!response.ok) {
		return { error: getErrorMessage(parsedRes) };
	}

	return { error: "", data: parsedRes };
};
