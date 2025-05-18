export {};

declare global {
  interface Window {
    grecaptcha: {
      enterprise: {
        execute: (siteKey: string, options: { action: string }) => Promise<string>;
        ready: (callback: () => void) => void;
        render: (
          container: string | HTMLElement,
          parameters: {
            sitekey: string;
            action?: string;
            theme?: 'light' | 'dark';
            size?: 'invisible' | 'normal' | 'compact';
            callback?: (token: string) => void;
            'expired-callback'?: () => void;
            'error-callback'?: () => void;
          }
        ) => number;
      };
    };
  }
}
