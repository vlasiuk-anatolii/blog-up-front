"use server";

import { cookies } from 'next/headers';
import { FormResponse } from "@/app/common/interfaces/form-response.interface";
import { API_URL } from "@/app/common/constants/api";
import { getErrorMessage } from "@/app/common/utils/errors";
import { redirect } from "next/navigation";
import { jwtDecode } from 'jwt-decode';
import { AUTHENTICATION_COOKIE } from '../auth.cookie';

// export const API_URL =
//   typeof window === "undefined"
//     ? process.env.API_URL
//     : process.env.NEXT_PUBLIC_API_URL;

export default async function login(_prevState: FormResponse, formData: FormData) {
	const response = await fetch(`${API_URL}/auth/login`, {
	method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(Object.fromEntries(formData)),
	});

	const parsedRes = await response.json();

	if (!response.ok) {
		return { error: getErrorMessage(parsedRes) };
	}

    await setAuthCookie(response);
	redirect("/");
}

export const setAuthCookie = async (response: Response) => {
    const setCookieHeader = response.headers.get("Set-Cookie");

    if (setCookieHeader) {
        const token = setCookieHeader.split(";")[0].split("=")[1];
        (await cookies()).set({
            name: AUTHENTICATION_COOKIE,
            value: token,  
            secure: true,
            httpOnly: true,
            expires: new Date(jwtDecode(token).exp! * 1000), 
        })
    }
}
