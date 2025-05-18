"use client";

import Script from "next/script";
import { useAppDispatch } from "./store/hooks";
import { setIsRecaptchaReady } from "./store/slices/recaptchaSlice";
const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

const RecaptchaProvider = () => {
	const dispatch = useAppDispatch();

	return (
		<Script
			src={`https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`}
			strategy="afterInteractive"
			onLoad={() => {
				dispatch(setIsRecaptchaReady(true));
			}}
		/>
	);
};

export default RecaptchaProvider;
