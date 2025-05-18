"use client";

import { ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ReactElement } from "react";
import darkTheme from "./dark.theme";
import { AuthContext } from "./auth/auth-context";
import { store } from "./store/store";
import { Provider as ReduxProvider } from "react-redux";

interface ProviderProps {
	children: ReactElement[];
	authenticated: boolean;
}

export default function Providers({ children, authenticated }: ProviderProps) {
	return (
		<AppRouterCacheProvider>
			<ThemeProvider theme={darkTheme}>
				<ReduxProvider store={store}>
					<AuthContext.Provider value={authenticated}>
						{children}
					</AuthContext.Provider>
				</ReduxProvider>
			</ThemeProvider>
		</AppRouterCacheProvider>
	);
}

