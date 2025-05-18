"use client";

import { get } from "@/app/common/utils/fetch";
import { User } from "../comment";

export default async function getMe() {
    const response = await get<User>("users/me");
    return response;
}