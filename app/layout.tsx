import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import LoadingScreen from "./components/LoadingScreen";
import TrackingScripts from "./components/TrackingScripts";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const playfair = Playfair_Display({
	variable: "--font-playfair-var",
	subsets: ["latin"],
	weight: ["400", "700", "900"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "Zellers Chocolates — AI Avurudu",
	description:
		"Transform into a legendary AI Avurudu Kumara or Kumariya with Zellers Chocolates. Create your royal avatar and win big!",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-transparent`}
		>
			<head>
				<TrackingScripts />
			</head>
			<body className="min-h-screen flex flex-col">
				{/* Google Tag Manager (noscript) */}
				<noscript>
					<iframe
						src="https://www.googletagmanager.com/ns.html?id=GTM-56GNZXS8"
						height="0"
						width="0"
						style={{ display: "none", visibility: "hidden" }}
					></iframe>
				</noscript>
				{/* End Google Tag Manager (noscript) */}
				{/* Facebook Pixel (noscript) */}
				<noscript>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						height="1"
						width="1"
						style={{ display: "none" }}
						src="https://www.facebook.com/tr?id=711983798616091&ev=PageView&noscript=1"
						alt=""
					/>
				</noscript>
				{/* End Facebook Pixel (noscript) */}
				<LoadingScreen />
				{children}
			</body>
		</html>
	);
}

