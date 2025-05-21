/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
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

	try {
		const response = await axios.post(`${API_URL}/${path}`, body, {
			withCredentials: true,
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		});
		return { error: "", data: response.data };
	} catch (error: any) {
		return {
			error: getErrorMessage(error.response?.data),
		};
	}
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

		const response = await axios.get<T>(url, {
			withCredentials: true,
		});

		return response.data;
	} catch (error: any) {
		const status = error.response?.status;
		return {
			message: `Error: ${status} ${error.response?.statusText || ""}`,
			statusCode: status,
			details: error.message,
		};
	}
};

export const deleteRequest = async (path: string, data?: object) => {
	try {
		const response = await axios.delete(`${API_URL}/${path}`, {
			withCredentials: true,
			data,
			headers: {
				"Content-Type": "application/json",
			},
		});
		return { error: "", data: response.data };
	} catch (error: any) {
		return {
			error: getErrorMessage(error.response?.data),
		};
	}
};

export const patch = async (path: string, data: object) => {
	try {
		const response = await axios.patch(`${API_URL}/${path}`, data, {
			withCredentials: true,
			headers: {
				"Content-Type": "application/json",
			},
		});
		return { error: "", data: response.data };
	} catch (error: any) {
		return {
			error: getErrorMessage(error.response?.data),
		};
	}
};
