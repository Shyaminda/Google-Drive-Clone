import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
		"../../packages/ui/components/ui/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				brand: {
					"100": "#997dff",
					DEFAULT: "#a48cfb",
				},
				red: "#FF7474",
				error: "#b80000",
				green: "#3DD9B3",
				blue: "#56B8FF",
				pink: "#EEA8FD",
				orange: "#F9AB72",
				light: {
					"100": "#333F4E",
					"200": "#A3B2C7",
					"300": "#F2F5F9",
					"400": "#F2F4F8",
				},
				dark: {
					"100": "#04050C",
					"200": "#131524",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			fontFamily: {
				poppins: ["var(--font-poppins)"],
			},
			boxShadow: {
				"drop-1": "0px 10px 30px 0px rgba(66, 71, 97, 0.1)",
				"drop-2": "0 8px 30px 0 rgba(65, 89, 214, 0.3)",
				"drop-3": "0 8px 30px 0 rgba(65, 89, 214, 0.1)",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"caret-blink": {
					"0%,70%,100%": { opacity: "1" },
					"20%,50%": { opacity: "0" },
				},
			},
			animation: {
				"caret-blink": "caret-blink 1.25s ease-out infinite",
			},
			screens: {
				"640": "640px",
				"652": "652px",
				"662": "662px",
				"1024": "1024px",
				"1090": "1090px",
				"1020": "1020px",
				"1166": "1166px",
				"1280": "1280px",
				"1292": "1292px",
				"1358": "1358px",
				"1412": "1412px",
				"1474": "1474px",
			},
		},
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
