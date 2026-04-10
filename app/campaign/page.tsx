"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Smartphone, User, Star, Sparkles, CheckCircle2, Camera, ArrowLeft, Check, UploadCloud, Gamepad2, Image as ImageIcon, X, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";
import ChocolateCatchGame from "../components/ChocolateCatchGame";
import {
	trackAuth,
	trackCampaign,
	trackAvatar,
	trackQuiz,
	trackError,
	trackConversion
} from "@/lib/analytics";
import { useAnalytics } from "@/lib/useAnalytics";

// ─── Step Definitions ─────────────────────────────────────────────────────────
const STEPS = [
	{ id: 1, key: "VERIFY", label: "VERIFY", icon: Smartphone },
	{ id: 2, key: "PROFILE", label: "PROFILE", icon: User },
	{ id: 3, key: "UPLOAD", label: "UPLOAD", icon: Camera },
	{ id: 4, key: "QUIZ", label: "QUIZ", icon: Star },
];

const QUIZ_QUESTIONS = [
	{
		id: "q3",
		question: "Choose your favorite Zellers Chocolate:",
		sinhala: "ඔබේ ප්‍රියතම Zellers චොකලට් තෝරන්න:",
		options: [
			{ id: "pistachio", label: "PISTACHIO & KUNAFA CREAM FILLED CHOCOLATE ", image: "/quiz/pistachio-and-kunafa.png" },
			{ id: "redvelvet", label: "RED VELVET COOKIE CREAM FILLED WHITE CHOCOLATE", image: "/quiz/red-velvet.png" },
			{ id: "coconut", label: "COCONUT CREAM FILLED CHOCOLATE", image: "/quiz/zellers-chocolate-coconut-cream.jpg" },
			{ id: "cookie", label: "COOKIE CREAM FILLED CHOCOLATE", image: "/quiz/zellers-chocolate-cookie-cream-filled.jpg" },
			{ id: "mixnut", label: "MIX NUT CREAM FILLED CHOCOLATE", image: "/quiz/zellers-chocolate-mix-nut-cream.jpg" },
			{ id: "strawberry", label: "STRAWBERRY CREAM FILLED CHOCOLATE", image: "/quiz/zellers-chocolate-strawberry.jpg" },
		],
	},
	{
		id: "q1",
		question: "What is your favorite Awurudu Kevili?",
		sinhala: "ඔබේ ප්‍රියතම අවුරුදු කැවිලි වර්ගය කුමක්ද?",
		options: [
			{ id: "kavum", label: "Konda Kavum", image: "/quiz/kavum.jpg" },
			{ id: "kokis", label: "Kokis", image: "/quiz/kokis.jpg" },
			{ id: "aluwa", label: "Aluwa", image: "/quiz/aluwa.jpg" },
			{ id: "mun", label: "Mun Kavum", image: "/quiz/munkavum.jpg" },
			{ id: "aasmi", label: "Aasmi", image: "/quiz/aasmi.jpg" },
			{ id: "undu", label: "Kiribath", image: "/quiz/kiribath.jpg" },
		],
	},
	{
		id: "q2",
		question: "What is your favorite Awurudu Krida?",
		sinhala: "ඔබ වඩාත් ප්‍රිය කරන අවුරුදු ක්‍රීඩාව කුමක්ද?",
		options: [
			{ id: "kotta", label: "Kotta Pora", image: "/quiz/kotta-pora.jpg" },
			{ id: "mutti", label: "Kana Mutti Bidima", image: "/quiz/kana-mutti.png" },
			{ id: "lissana", label: "Lissana Gaha", image: "/quiz/lissana-gaha.png" },
			{ id: "kamba", label: "Kamba Adeema", image: "/quiz/kamba-adeema.png" },
			{ id: "pancha", label: "Aliyata Asa Thabeema", image: "/quiz/aliyata-asa-thabima.png" },
			{ id: "olinda", label: "Pani Babare", image: "/quiz/pani-babare.png" },
		],
	},
];

const slideVariants = {
	enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
	center: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
	exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40, transition: { duration: 0.3, ease: "easeIn" as const } }),
};

// ─── Interactive Step Indicator ───────────────────────────────────────────────
function StepIndicator({ current, unlocked, onStepClick }: { current: number, unlocked: number, onStepClick: (stepId: number) => void }) {
	return (
		<div className="flex items-center justify-center gap-0 mb-8 w-full max-w-[320px] mx-auto px-2">
			{STEPS.map((step, idx) => {
				const done = current > step.id;
				const active = current === step.id;
				const isClickable = step.id <= unlocked;

				return (
					<div key={step.id} className="flex items-center flex-1 last:flex-none">
						<div
							onClick={() => isClickable && onStepClick(step.id)}
							className={`flex flex-col items-center gap-2 relative z-10 transition-transform ${isClickable && !active ? 'cursor-pointer hover:scale-110' : ''} ${!isClickable ? 'opacity-50' : ''}`}
						>
							<div
								className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold border-2 transition-all duration-500 ${active
									? "border-yellow-400 bg-yellow-500/20 text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.4)] scale-110"
									: done
										? "border-yellow-500/50 bg-yellow-500/15 text-yellow-500"
										: "border-white/10 bg-white/5 text-gray-500"
									}`}
							>
								{done ? <CheckCircle2 size={18} strokeWidth={3} className="text-yellow-400" /> : <step.icon size={16} strokeWidth={2.5} />}
							</div>
							<span
								className={`absolute -bottom-5 text-[8px] sm:text-[9px] font-bold tracking-[0.2em] transition-colors duration-300 ${active ? "text-yellow-400" : done ? "text-yellow-500/70" : "text-gray-500"
									}`}
							>
								{step.label}
							</span>
						</div>
						{idx < STEPS.length - 1 && (
							<div
								className={`h-0.5 flex-1 mx-2 sm:mx-3 rounded-full transition-all duration-500 ${done ? "bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.5)]" : "bg-white/10"
									}`}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
}

// ─── Step 1: Verify ───────────────────────────────────────────────────────────
function StepVerify({ onNext }: { onNext: () => void }) {
	const [phone, setPhone] = useState("");
	const [otpSent, setOtpSent] = useState(false);
	const [otp, setOtp] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [cooldown, setCooldown] = useState(0);
	const [channel, setChannel] = useState<"whatsapp" | "sms" | null>(null);

	useEffect(() => {
		trackCampaign.stepStarted('verify');
	}, []);

	useEffect(() => {
		if (cooldown <= 0) return;
		const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
		return () => clearTimeout(t);
	}, [cooldown]);

	async function handleSendOtp() {
		if (phone.length < 9) return;
		setError("");
		setLoading(true);
		const formattedPhone = `+94${phone}`;
		console.log("[StepVerify] Attempting WhatsApp OTP for:", formattedPhone);

		try {
			const waRes = await fetch("/api/auth/send-whatsapp-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ phone: formattedPhone }),
			});
			const waData = await waRes.json();

			if (waRes.status === 429) {
				setError(waData.message || "Too many requests. Please wait 30 seconds.");
				setCooldown(30);
				return;
			}

			if (waRes.ok) {
				setChannel("whatsapp");
				setOtpSent(true);
				trackAuth.otpRequested(formattedPhone, 'whatsapp');
				return;
			}

			const smsRes = await fetch("/api/auth/send-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ phone: formattedPhone }),
			});
			const smsData = await smsRes.json();

			if (smsRes.status === 429) {
				setError(smsData.message || "Too many requests. Please wait 30 seconds.");
				setCooldown(30);
			} else if (!smsRes.ok) {
				setError(smsData.message || "Failed to send OTP. Please try again.");
				trackAuth.otpFailed(formattedPhone, smsData.message || 'sms_send_failed');
			} else {
				setChannel("sms");
				setOtpSent(true);
				trackAuth.otpRequested(formattedPhone, 'sms');
			}
		} catch (err) {
			setError("Network error. Please check your connection and try again.");
		} finally {
			setLoading(false);
		}
	}

	async function handleVerify() {
		if (otp.length < 4) return;
		setError("");
		setLoading(true);
		const formattedPhone = `+94${phone}`;
		try {
			const res = await fetch("/api/auth/verify-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ phone: formattedPhone, otp }),
			});
			const data = await res.json();
			if (res.status === 429) {
				setError(data.message || "Too many attempts. Please wait before trying again.");
			} else if (!res.ok) {
				setError(data.message || "Invalid OTP. Please try again.");
				trackAuth.otpFailed(formattedPhone, data.message || 'invalid_otp');
			} else {
				console.log('✅ OTP VERIFIED SUCCESSFULLY');
				if (data.token) {
					sessionStorage.setItem("auth_token", data.token);
					console.log('🔑 AUTH TOKEN SAVED:', data.token.substring(0, 20) + '...');
				} else {
					console.error('❌ NO TOKEN RECEIVED FROM SERVER');
				}
				trackAuth.otpVerified(formattedPhone, channel || 'sms');
				trackCampaign.stepCompleted('verify', data.userId);
				console.log('➡️ Moving to profile step');
				onNext();
			}
		} catch (err) {
			setError("Network error. Please check your connection and try again.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="space-y-6 w-full">
			<div className="space-y-2">
				<label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400">
					MOBILE NUMBER <span className="text-yellow-500/70">• දුරකථන අංකය</span>
				</label>
				<div className="flex gap-2">
					<div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-gray-300 font-semibold shrink-0 select-none backdrop-blur-md">
						<span className="text-base">🇱🇰</span>
						<span>+94</span>
					</div>
					<input
						type="tel"
						inputMode="numeric"
						maxLength={10}
						value={phone}
						onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setError(""); }}
						placeholder="7X XXX XXXX"
						disabled={otpSent}
						className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-base text-gray-200 placeholder-gray-500 outline-none focus:border-yellow-500/50 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(234,179,8,0.1)] transition-all duration-300 backdrop-blur-md disabled:opacity-50"
					/>
				</div>
			</div>

			<AnimatePresence>
				{otpSent && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="space-y-3 overflow-hidden"
					>
						<div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${channel === "whatsapp"
							? "bg-green-500/10 border border-green-500/30 text-green-400"
							: "bg-blue-500/10 border border-blue-500/30 text-blue-400"
							}`}>
							<span>{channel === "whatsapp" ? "💬" : "📱"}</span>
							<span>
								{channel === "whatsapp"
									? "OTP sent via WhatsApp"
									: "OTP sent via SMS (number not on WhatsApp)"}
							</span>
						</div>

						<label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400">
							OTP CODE <span className="text-yellow-500/70">• කේතය</span>
						</label>
						<input
							type="text"
							inputMode="numeric"
							maxLength={6}
							value={otp}
							onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); setError(""); }}
							placeholder="• • • • • •"
							className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xl text-yellow-400 placeholder-gray-500 outline-none focus:border-yellow-500/50 transition-all duration-300 tracking-[0.5em] text-center font-bold backdrop-blur-md shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
						/>
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{error && (
					<motion.p
						initial={{ opacity: 0, y: -6 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						className="text-xs text-red-400 text-center font-semibold bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2"
					>
						{error}
					</motion.p>
				)}
			</AnimatePresence>

			{!otpSent ? (
				<button
					onClick={handleSendOtp}
					disabled={phone.length < 9 || loading || cooldown > 0}
					className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-sm font-black tracking-widest rounded-xl py-4 hover:scale-[1.02] shadow-[0_4px_15px_rgba(234,179,8,0.3)] disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed transition-all duration-300"
				>
					{loading ? "CHECKING…" : cooldown > 0 ? `WAIT ${cooldown}s` : "SEND OTP"}
				</button>
			) : (
				<div className="space-y-3">
					<button
						onClick={handleVerify}
						disabled={otp.length < 4 || loading}
						className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-sm font-black tracking-widest rounded-xl py-4 hover:scale-[1.02] shadow-[0_4px_15px_rgba(234,179,8,0.3)] disabled:opacity-40 disabled:scale-100 transition-all duration-300"
					>
						{loading ? "VERIFYING…" : "VERIFY"}
					</button>
					<button
						onClick={() => { setOtpSent(false); setOtp(""); setError(""); setChannel(null); }}
						className="w-full text-xs text-gray-400 hover:text-yellow-400 transition-colors py-1"
					>
						← Change number
					</button>
				</div>
			)}
		</div>
	);
}

// ─── Step 2: Profile ──────────────────────────────────────────────────────────
function StepProfile({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
	const [form, setForm] = useState({ name: "", displayName: "", gender: "" });
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		trackCampaign.stepStarted('profile');
	}, []);

	const isComplete = Object.values(form).every((val) => val.trim() !== "");

	async function handleSubmit() {
		if (!isComplete) return;
		setError("");
		setIsLoading(true);
		const token = sessionStorage.getItem("auth_token");
		console.log('📝 SUBMITTING PROFILE:', form);
		console.log('🔑 Token available:', !!token);
		try {
			const res = await fetch("/api/user/profile", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
				},
				body: JSON.stringify(form),
			});
			const data = await res.json();
			if (!res.ok) {
				setError(data.message || "Failed to save profile. Please try again.");
				trackError.apiError('/api/user/profile', res.status, data.message);
			} else {
				console.log('✅ PROFILE SAVED SUCCESSFULLY:', data);
				trackCampaign.profileCreated(data.userId || 'unknown', form.gender, form.name);
				trackCampaign.stepCompleted('profile', data.userId);
				console.log('➡️ Moving to upload step');
				onNext();
			}
		} catch (err) {
			setError("Network error. Please check your connection and try again.");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="space-y-5 w-full">
			<div className="space-y-1.5">
				<label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase ml-1">Full Name</label>
				<input
					type="text"
					value={form.name}
					onChange={(e) => {
						setForm({ ...form, name: e.target.value });
						setError("");
						if (e.target.value.length > 0) trackCampaign.formFieldFilled('name', 'profile');
					}}
					placeholder="e.g. Shashith Perera"
					className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-all backdrop-blur-md placeholder-gray-500"
				/>
			</div>

			<div className="space-y-1.5">
				<label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase ml-1 block">
					Display Name for Character{" "}
					<span className="text-yellow-500/70 normal-case tracking-normal hidden sm:inline">
						• Shown on your Avatar
					</span>
				</label>
				<input
					type="text"
					value={form.displayName}
					onChange={(e) => {
						setForm({ ...form, displayName: e.target.value });
						setError("");
						if (e.target.value.length > 0) trackCampaign.formFieldFilled('displayName', 'profile');
					}}
					placeholder="e.g. The Golden Prince"
					className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-all backdrop-blur-md placeholder-gray-500"
				/>
			</div>

			<div className="space-y-1.5">
				<label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase ml-1">Gender</label>
				<select
					value={form.gender}
					onChange={(e) => {
						setForm({ ...form, gender: e.target.value });
						setError("");
						if (e.target.value) trackCampaign.formFieldFilled('gender', 'profile');
					}}
					className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-all backdrop-blur-md appearance-none"
				>
					<option value="" className="bg-gray-900 text-gray-500">Select Gender</option>
					<option value="male" className="bg-gray-900">Male</option>
					<option value="female" className="bg-gray-900">Female</option>
				</select>
			</div>

			<AnimatePresence>
				{error && (
					<motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-red-400 text-center font-semibold bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
						{error}
					</motion.p>
				)}
			</AnimatePresence>

			<div className="flex gap-3 pt-2">
				<button
					onClick={onBack}
					className="shrink-0 bg-white/5 border border-white/10 text-gray-300 text-sm font-bold rounded-xl px-5 hover:bg-white/10 transition-all flex items-center justify-center"
					aria-label="Go back"
				>
					<ArrowLeft size={18} />
				</button>
				<button
					onClick={handleSubmit}
					disabled={!isComplete || isLoading}
					className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-sm font-black tracking-widest rounded-xl py-4 hover:scale-[1.02] shadow-[0_4px_15px_rgba(234,179,8,0.3)] disabled:opacity-40 disabled:scale-100 transition-all flex justify-center items-center gap-2"
				>
					{isLoading ? "SAVING…" : <>CONTINUE <ChevronRight size={18} strokeWidth={3} /></>}
				</button>
			</div>
		</div>
	);
}

// ─── Camera Modal ─────────────────────────────────────────────────────────────
function CameraModal({ onCapture, onClose }: { onCapture: (file: File) => void; onClose: () => void }) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const [error, setError] = useState("");
	const [ready, setReady] = useState(false);

	useEffect(() => {
		async function startCamera() {
			try {
				const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
				streamRef.current = s;
				if (videoRef.current) videoRef.current.srcObject = s;
			} catch {
				setError("Could not access camera. Please allow camera permissions and try again.");
			}
		}
		startCamera();
		return () => {
			streamRef.current?.getTracks().forEach((t) => t.stop());
			streamRef.current = null;
		};
	}, []);

	function stopAndClose() {
		streamRef.current?.getTracks().forEach((t) => t.stop());
		streamRef.current = null;
		onClose();
	}

	function capture() {
		if (!videoRef.current) return;
		const video = videoRef.current;
		const canvas = document.createElement("canvas");
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		canvas.getContext("2d")?.drawImage(video, 0, 0);
		canvas.toBlob((blob) => {
			if (blob) {
				const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
				streamRef.current?.getTracks().forEach((t) => t.stop());
				streamRef.current = null;
				onCapture(file);
			}
		}, "image/jpeg");
	}

	return (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
			<motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-[calc(100vw-2rem)] sm:max-w-sm bg-[#160A30]/95 border border-yellow-500/30 rounded-3xl p-4 sm:p-6 relative">
				<button onClick={stopAndClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors" aria-label="Close camera">
					<X size={20} />
				</button>
				<h3 className="font-playfair text-xl text-white mb-4 text-center">Take a Selfie</h3>
				{error ? (
					<div className="text-center py-8">
						<p className="text-red-400 text-sm mb-4">{error}</p>
						<button onClick={stopAndClose} className="text-xs text-gray-400 hover:text-white transition-colors">Close</button>
					</div>
				) : (
					<>
						<div className="w-full rounded-xl overflow-hidden mb-4 bg-black relative" style={{ aspectRatio: "4/3" }}>
							<video
								ref={videoRef}
								autoPlay
								playsInline
								muted
								onCanPlay={() => setReady(true)}
								className="w-full h-full object-cover scale-x-[-1]"
							/>
							{!ready && (
								<div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
									Starting camera…
								</div>
							)}
						</div>
						<button
							onClick={capture}
							disabled={!ready}
							className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-sm font-black tracking-widest rounded-xl py-4 hover:scale-[1.02] shadow-[0_4px_15px_rgba(234,179,8,0.3)] disabled:opacity-40 disabled:scale-100 transition-all flex items-center justify-center gap-2"
						>
							<Camera size={18} /> CAPTURE PHOTO
						</button>
					</>
				)}
			</motion.div>
		</div>
	);
}

// ─── Step 3: Upload Photo ─────────────────────────────────────────────────────
function StepGenerate({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
	const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
	const [showCamera, setShowCamera] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);
	const uploadStartTime = useRef<number>(0);

	useEffect(() => {
		trackCampaign.stepStarted('upload');
	}, []);

	async function processUpload(file: File) {
		console.log('📸 UPLOAD STARTED');
		console.log('File:', file.name, file.size, 'bytes');
		setStatus("uploading");
		setErrorMsg("");
		uploadStartTime.current = Date.now();
		const token = sessionStorage.getItem("auth_token");
		console.log('🔑 Token available:', !!token);
		if (token) {
			console.log('Token preview:', token.substring(0, 20) + '...');
		}
		const userId = 'user_' + Date.now(); // Get from token in production
		trackAvatar.uploadStarted(userId, file.size);

		if (!token) {
			console.error('❌ NO AUTH TOKEN - Cannot upload');
			setErrorMsg("Authentication required. Please log in again.");
			setStatus("error");
			return;
		}

		try {
			const formData = new FormData();
			formData.append("photo", file);

			console.log('🚀 Calling upload API...');
			const res = await fetch("/api/images/upload", {
				method: "POST",
				headers: {
					"Authorization": `Bearer ${token}`,
				},
				body: formData,
			});

			console.log('📡 Upload response status:', res.status);
			const data = await res.json();
			console.log('📦 Upload response data:', data);

			if (!res.ok) {
				console.error('❌ UPLOAD FAILED:', res.status, data);
				setErrorMsg(data.message || "Failed to upload image. Please try again.");
				setStatus("error");
				const userId = 'user_' + Date.now();
				trackAvatar.uploadFailed(userId, data.message || 'upload_failed');
				trackError.apiError('/api/images/upload', res.status, data.message);
				return;
			}

			// Store upload info in sessionStorage
			console.log('✅ UPLOAD SUCCESS!');
			console.log('Image URL:', data.url);
			console.log('S3 Key:', data.s3Key);
			sessionStorage.setItem("uploaded_image_url", data.url || "");
			sessionStorage.setItem("uploaded_s3_key", data.s3Key || "");

			const uploadDuration = Date.now() - uploadStartTime.current;
			const userId = data.userId || 'user_' + Date.now();
			trackAvatar.uploadCompleted(userId, file.size, uploadDuration);
			trackCampaign.stepCompleted('upload', userId);

			setStatus("success");
			console.log('➡️ Moving to quiz step in 1.5s');
			setTimeout(() => onNext(), 1500);
		} catch (err) {
			console.error("Upload error:", err);
			setErrorMsg("Network error. Please check your connection.");
			setStatus("error");
		}
	}

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files && e.target.files.length > 0) {
			processUpload(e.target.files[0]);
		}
	}

	function handleCameraCapture(file: File) {
		setShowCamera(false);
		processUpload(file);
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-[360px] text-center w-full">
			{showCamera && <CameraModal onCapture={handleCameraCapture} onClose={() => setShowCamera(false)} />}
			<AnimatePresence mode="wait">

				{/* State 1: IDLE - Show dual upload options */}
				{status === "idle" && (
					<motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} className="w-full flex flex-col h-full justify-between">
						<div>
							<h3 className="font-playfair text-xl font-normal text-gray-100 mb-1 drop-shadow-sm">Select Your Portrait</h3>
							<p className="text-xs text-gray-400 mb-6 max-w-sm mx-auto">We need a clear, front-facing photo to base your Royal Avatar on.</p>

							<input
								type="file"
								accept="image/*"
								ref={fileInputRef}
								className="hidden"
								onChange={handleFileChange}
							/>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{/* Option 1: Upload Photo */}
								<button
									onClick={() => fileInputRef.current?.click()}
									className="w-full h-36 border-2 border-white/10 bg-white/5 hover:border-yellow-500/50 hover:bg-yellow-500/10 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 backdrop-blur-md group"
								>
									<ImageIcon size={36} className="text-gray-400 group-hover:text-yellow-400 transition-colors" />
									<span className="text-sm font-bold text-gray-300 group-hover:text-white tracking-wide">Upload Photo</span>
								</button>

								{/* Option 2: Take Selfie */}
								<button
									onClick={() => setShowCamera(true)}
									className="w-full h-36 border-2 border-white/10 bg-white/5 hover:border-yellow-500/50 hover:bg-yellow-500/10 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 backdrop-blur-md group"
								>
									<Camera size={36} className="text-gray-400 group-hover:text-yellow-400 transition-colors" />
									<span className="text-sm font-bold text-gray-300 group-hover:text-white tracking-wide">Take a Selfie</span>
								</button>
							</div>
						</div>

						<div className="mt-8 flex justify-start">
							<button
								onClick={onBack}
								className="text-xs font-bold tracking-widest text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 uppercase"
							>
								<ArrowLeft size={14} /> Back to Profile
							</button>
						</div>
					</motion.div>
				)}

				{/* State 2: UPLOADING */}
				{status === "uploading" && (
					<motion.div key="uploading" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center justify-center gap-6 h-full min-h-[250px]">
						<div className="relative w-24 h-24 flex items-center justify-center">
							<div className="absolute inset-0 rounded-full border-[3px] border-white/10" />
							<div className="absolute inset-0 rounded-full border-[3px] border-t-yellow-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
							<UploadCloud size={32} className="text-yellow-400 animate-pulse drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
						</div>
						<div>
							<p className="text-sm font-black text-yellow-400 tracking-widest animate-pulse drop-shadow-md">UPLOADING SECURELY…</p>
						</div>
					</motion.div>
				)}

				{/* State 3: SUCCESS */}
				{status === "success" && (
					<motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center w-full h-full min-h-[250px]">
						<div className="w-24 h-24 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
							<CheckCircle2 size={48} strokeWidth={3} className="text-green-400 drop-shadow-md" />
						</div>
						<p className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-green-300 to-green-500 drop-shadow-md mb-2">
							UPLOAD SUCCESSFUL!
						</p>
						<p className="text-sm text-gray-300 font-medium animate-pulse">Proceeding to Final Quiz...</p>
					</motion.div>
				)}

				{/* State 4: ERROR */}
				{status === "error" && (
					<motion.div key="error" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center w-full h-full min-h-[250px]">
						<div className="w-24 h-24 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center mb-6">
							<AlertCircle size={48} strokeWidth={3} className="text-red-400" />
						</div>
						<p className="text-xl font-black text-red-400 mb-2">Upload Failed</p>
						<p className="text-sm text-gray-300 mb-6 max-w-xs mx-auto">{errorMsg}</p>
						<button
							onClick={() => setStatus("idle")}
							className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
						>
							Try Again
						</button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

// ─── Step 4: Quiz ─────────────────────────────────────────────────────────────
function StepQuiz({ onBack, onShowGamePopup, onTriggerGeneration }: { onBack: () => void, onShowGamePopup: () => void, onTriggerGeneration: (flavour: string) => void }) {
	const [currentQIndex, setCurrentQIndex] = useState(0);
	const [answers, setAnswers] = useState<Record<string, string>>({});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [generationTriggered, setGenerationTriggered] = useState(false);

	useEffect(() => {
		trackCampaign.stepStarted('quiz');
		const userId = 'user_' + Date.now(); // Get from session/token
		trackQuiz.started(userId);
	}, []);

	const currentQ = QUIZ_QUESTIONS[currentQIndex];
	const isLastQ = currentQIndex === QUIZ_QUESTIONS.length - 1;

	function handleSelect(optionId: string) {
		setAnswers({ ...answers, [currentQ.id]: optionId });
		const userId = 'user_' + Date.now(); // Get from session/token
		trackQuiz.questionAnswered(userId, currentQ.id, optionId, currentQIndex + 1);

		// Auto-trigger generation on chocolate flavour selection (q3 is the first question)
		if (currentQ.id === 'q3' && !generationTriggered) {
			const optionObj = currentQ.options.find((o) => o.id === optionId);
			if (optionObj) {
				setGenerationTriggered(true);
				onTriggerGeneration(optionObj.label);
			}
		}

		if (!isLastQ) {
			setTimeout(() => setCurrentQIndex((prev) => prev + 1), 600);
		}
	}

	async function handleSubmitQuiz() {
		setError("");
		setIsLoading(true);
		const token = sessionStorage.getItem("auth_token");

		const formattedAnswers = Object.entries(answers).map(([qId, optionId]) => {
			const questionObj = QUIZ_QUESTIONS.find((q) => q.id === qId);
			const optionObj = questionObj?.options.find((o) => o.id === optionId);
			return {
				q: questionObj?.question ?? qId,
				answer: optionObj?.label ?? optionId,
			};
		});

		try {
			const res = await fetch("/api/quiz/submit", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
				},
				body: JSON.stringify({ answers: formattedAnswers }),
			});
			const data = await res.json();
			if (!res.ok) {
				setError(data.message || "Failed to save quiz. Please try again.");
				trackError.apiError('/api/quiz/submit', res.status, data.message);
			} else {
				const userId = data.userId || 'user_' + Date.now();
				trackQuiz.submitted(userId, data.flavor || 'unknown');
				trackCampaign.stepCompleted('quiz', userId);
				onShowGamePopup();
			}
		} catch (err) {
			setError("Network error. Please check your connection and try again.");
		} finally {
			setIsLoading(false);
		}
	}

	const isZellers = currentQ.id === "q3";

	return (
		<div className="relative min-h-[440px] flex flex-col w-full justify-between">
			<div>
				{/* Quiz Progress Header */}
				<div className="flex justify-between items-center mb-6">
					<button
						onClick={() => {
							if (currentQIndex === 0) onBack();
							else setCurrentQIndex((p) => Math.max(0, p - 1));
						}}
						className="text-gray-400 hover:text-yellow-400 transition-colors"
					>
						<ArrowLeft size={20} />
					</button>
					<div className="flex gap-1.5">
						{QUIZ_QUESTIONS.map((_, i) => (
							<div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentQIndex ? "w-6 bg-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.6)]" : i < currentQIndex ? "w-2 bg-yellow-400/50" : "w-2 bg-white/10"}`} />
						))}
					</div>
					<div className="w-5" />
				</div>

				{/* Quiz Content */}
				<AnimatePresence mode="wait">
					<motion.div
						key={currentQ.id}
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						transition={{ duration: 0.3 }}
						className="w-full"
					>
						<h3 className="font-playfair text-lg sm:text-xl font-normal text-gray-100 text-center mb-1 drop-shadow-sm px-2">
							{currentQ.question}
						</h3>
						<p className="text-xs text-yellow-400/80 text-center mb-6">{currentQ.sinhala}</p>

						<div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
							{currentQ.options.map((opt) => {
								const isSelected = answers[currentQ.id] === opt.id;
								return (
									<button
										key={opt.id}
										onClick={() => handleSelect(opt.id)}
										className="group relative w-full aspect-square rounded-2xl overflow-hidden focus:outline-none"
									>
										<Image
											src={opt.image}
											alt={opt.label}
											fill
											sizes="(max-width: 640px) 50vw, 33vw"
											className={`transition-transform duration-500 ${isZellers ? "object-contain p-3" : "object-cover"} ${isSelected ? "scale-105" : "group-hover:scale-110"}`}
											style={{ backgroundColor: isZellers ? '#ffffff' : '#1E0B4B' }}
										/>

										<div className={`absolute bottom-0 left-0 right-0 ${isZellers ? "h-3/5 bg-gradient-to-t from-black/95 via-black/60 to-transparent" : "inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"} transition-opacity duration-300 ${isSelected ? "opacity-80" : "opacity-100"}`} />

										<p className={`absolute left-1 right-1 text-center font-bold text-white tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] z-10 leading-tight px-1 flex items-end justify-center ${isZellers ? 'bottom-2 text-[10px] sm:text-[11px] h-10' : 'bottom-3 text-xs'}`}>
											<span className="line-clamp-3">{opt.label}</span>
										</p>

										<div className={`absolute inset-0 border-2 rounded-2xl transition-all duration-300 pointer-events-none ${isSelected ? "border-yellow-400 scale-100 bg-yellow-400/10" : "border-white/10 scale-105 opacity-0 group-hover:opacity-100 group-hover:scale-100 group-hover:border-white/30"}`} />

										<AnimatePresence>
											{isSelected && (
												<motion.div
													initial={{ scale: 0, opacity: 0 }}
													animate={{ scale: 1, opacity: 1 }}
													className="absolute top-2 right-2 bg-yellow-400 rounded-full p-1 shadow-lg z-20"
												>
													<Check size={14} strokeWidth={4} className="text-black" />
												</motion.div>
											)}
										</AnimatePresence>
									</button>
								);
							})}
						</div>
					</motion.div>
				</AnimatePresence>

				<AnimatePresence>
					{error && (
						<motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 text-xs text-red-400 text-center font-semibold bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
							{error}
						</motion.p>
					)}
				</AnimatePresence>
			</div>

			<div className="mt-8">
				<button
					onClick={handleSubmitQuiz}
					disabled={Object.keys(answers).length < QUIZ_QUESTIONS.length || isLoading}
					className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-sm font-black tracking-widest rounded-xl py-4 hover:scale-[1.02] shadow-[0_4px_15px_rgba(234,179,8,0.3)] disabled:opacity-40 disabled:scale-100 transition-all flex justify-center items-center gap-2"
				>
					{isLoading ? "SAVING…" : <>SUBMIT & GENERATE AVATAR <Sparkles size={18} strokeWidth={3} /></>}
				</button>
			</div>
		</div>
	);
}

// ─── Post-Quiz Game Modal ─────────────────────────────────────────────────────

const STAGE_PROGRESS: Record<string, number> = {
	otp_verify: 5,
	profile_setup: 10,
	selfie_upload: 15,
	quiz_complete: 20,
	fantasy_style: 50,
	face_swap: 70,
	bg_removal_gen: 85,
	branded_composites: 95,
};

function GamePopup({ onFinish }: { onFinish: () => void }) {
	const [progress, setProgress] = useState(0);
	const [status, setStatus] = useState<"generating" | "complete" | "error">("generating");
	const [errorMsg, setErrorMsg] = useState("");
	const [stageName, setStageName] = useState("Starting...");
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [queuePosition, setQueuePosition] = useState<number | null>(null);

	useEffect(() => {
		let cancelled = false;
		let pollTimer: ReturnType<typeof setTimeout>;

		async function pollStatus() {
			const token = sessionStorage.getItem("auth_token");
			if (!token || cancelled) return;

			try {
				const res = await fetch("/api/avatar/status", {
					headers: { "Authorization": `Bearer ${token}` },
				});
				const data = await res.json();

				if (cancelled) return;

				if (data.generationStatus === 'completed') {
					setProgress(100);
					setStageName("Complete!");
					setStatus("complete");
					setQueuePosition(null);
					if (data.imageUrl) setPreviewUrl(data.imageUrl);
					const userId = 'user_' + Date.now();
					trackAvatar.generationCompleted(userId, 0);
					trackConversion.campaignCompleted(userId, 0);
					return;
				}

				if (data.generationStatus === 'failed') {
					setErrorMsg(data.generationError || "Generation failed");
					setStatus("error");
					setQueuePosition(null);
					return;
				}

				// Update queue position if in queue
				if (data.queuePosition !== undefined && data.queuePosition !== null) {
					setQueuePosition(data.queuePosition);
					if (data.queuePosition === 0) {
						setStageName("Processing your request...");
						setProgress(10);
					} else {
						setStageName(`In queue - Position ${data.queuePosition}`);
						setProgress(5);
					}
				} else {
					setQueuePosition(null);
					// Map stage to progress percentage
					if (data.currentStage) {
						const p = STAGE_PROGRESS[data.currentStage] || progress;
						setProgress((prev) => Math.max(prev, p));
						setStageName(data.currentStage.replace(/_/g, ' '));
					}
				}

				// Continue polling
				pollTimer = setTimeout(pollStatus, 3000);
			} catch {
				// Network error — keep retrying
				if (!cancelled) pollTimer = setTimeout(pollStatus, 5000);
			}
		}

		// Start polling after a short delay
		pollTimer = setTimeout(pollStatus, 2000);

		return () => {
			cancelled = true;
			clearTimeout(pollTimer);
		};
	}, []);

	if (status === "error") {
		return (
			<div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0A0515]/80 backdrop-blur-md">
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="w-full max-w-[calc(100vw-2rem)] sm:max-w-md bg-[#160A30]/95 border border-red-500/30 rounded-3xl p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-center"
				>
					<div className="mx-auto w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
						<AlertCircle size={30} className="text-red-400" />
					</div>
					<h3 className="font-playfair text-2xl font-black text-white mb-2">Generation Failed</h3>
					<p className="text-sm text-gray-300 mb-6">{errorMsg}</p>
					<button
						onClick={onFinish}
						className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
					>
						Continue Anyway
					</button>
				</motion.div>
			</div>
		);
	}

	if (status === "complete") {
		return (
			<div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-[#0A0515]/80 backdrop-blur-md">
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="w-full max-w-[calc(100vw-1.5rem)] sm:max-w-md bg-[#160A30]/95 border border-yellow-500/30 rounded-3xl p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-center"
				>
					<div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.5)] mb-4 mt-2">
						<Sparkles size={30} className="text-white" />
					</div>

					<h3 className="font-playfair text-2xl font-black text-white leading-tight mb-2">
						Your Avatar is Ready!
					</h3>

					{previewUrl && (
						<div className="my-4 rounded-xl overflow-hidden border border-yellow-500/20 shadow-lg">
							<img src={previewUrl} alt="Your generated avatar" className="w-full h-auto" />
						</div>
					)}

					<div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3 mb-4">
						<p className="text-yellow-400 font-bold text-sm tracking-wide uppercase mb-1">Pending Admin Approval</p>
						<p className="text-blue-200/70 text-xs">Your avatar has been submitted for review. Once approved, it will appear on the vote page.</p>
					</div>

					<button
						onClick={onFinish}
						className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors text-sm"
					>
						Done
					</button>
				</motion.div>
			</div>
		);
	}

	return (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-[#0A0515]/80 backdrop-blur-md">
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				className="w-full max-w-[calc(100vw-1.5rem)] sm:max-w-md bg-[#160A30]/95 border border-yellow-500/30 rounded-3xl p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-center relative overflow-hidden"
			>
				<div className="absolute top-0 left-0 w-full h-1 bg-white/10">
					<div className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 transition-all duration-75 ease-linear" style={{ width: `${progress}%` }} />
				</div>

				<div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.5)] mb-6 mt-4">
					<Sparkles size={30} className="text-[#160A30] animate-pulse" />
				</div>

				<h3 className="font-playfair text-2xl font-black text-white leading-tight mb-2">
					{queuePosition !== null && queuePosition > 0 ? "In Queue..." : "Generating Avatar..."}
				</h3>
				<p className="text-sm text-blue-200/70 mb-8 max-w-[280px] mx-auto">
					{queuePosition !== null && queuePosition > 0
						? `You're in position ${queuePosition}. Your avatar will be generated soon!`
						: "The AI is working its magic! Play this quick mini-game while you wait."}
				</p>

				{queuePosition !== null && queuePosition > 0 ? (
					<div className="w-full border-2 border-yellow-500/30 rounded-xl bg-yellow-500/10 p-6 mb-6">
						<div className="text-6xl font-black text-yellow-400 mb-2">#{queuePosition}</div>
						<p className="text-xs text-yellow-200/70 uppercase tracking-widest">Queue Position</p>
						<p className="text-xs text-blue-200/60 mt-3">Processing one at a time to ensure quality</p>
					</div>
				) : (
					<div className="w-full mb-6">
						<ChocolateCatchGame progress={progress} />
					</div>
				)}

				<p className="text-yellow-400/80 font-bold text-xs tracking-widest uppercase">{progress}% — {stageName}</p>
			</motion.div>
		</div>
	);
}

// ─── Analytics Wrapper Component with Suspense ────────────────────────────────
function AnalyticsTracker({ pageName }: { pageName: string }) {
	useAnalytics(pageName);
	return null;
}

// ─── Main Page Component ──────────────────────────────────────────────────────
function CampaignPageContent() {
	const [step, setStep] = useState(1);
	const [unlockedStep, setUnlockedStep] = useState(1);
	const [dir, setDir] = useState(1);
	const [showGamePopup, setShowGamePopup] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);
	const stepStartTime = useRef<number>(Date.now());

	function goNext() {
		setDir(1);
		const nextStep = Math.min(step + 1, 4);
		setStep(nextStep);
		setUnlockedStep((prev) => Math.max(prev, nextStep));
	}

	function goBack() {
		if (isGenerating) return; // Block back navigation during generation
		setDir(-1);
		setStep((s) => Math.max(s - 1, 1));
	}

	function goToStep(targetStep: number) {
		if (isGenerating) return; // Block navigation during generation
		if (targetStep <= unlockedStep && targetStep !== step) {
			// Track abandonment if going backward
			if (targetStep < step) {
				const timeSpent = Math.round((Date.now() - stepStartTime.current) / 1000);
				const stepNames = ['verify', 'profile', 'upload', 'quiz'];
				trackCampaign.stepAbandoned(stepNames[step - 1] || 'unknown', timeSpent);
			}
			setDir(targetStep > step ? 1 : -1);
			setStep(targetStep);
			stepStartTime.current = Date.now();
		}
	}

	// Auto-trigger generation when flavour is selected during quiz
	async function handleTriggerGeneration(flavourLabel: string) {
		const token = sessionStorage.getItem("auth_token");
		if (!token) return;

		setIsGenerating(true);
		try {
			const res = await fetch("/api/avatar/generate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
				},
				body: JSON.stringify({ flavour: flavourLabel }),
			});
			const data = await res.json();
			if (res.ok) {
				const userId = 'user_' + Date.now();
				trackAvatar.generationStarted(userId, data.gender || 'unknown');
			}
		} catch (err) {
			console.error("Auto-trigger generation error:", err);
		}
	}

	return (
		<div className="min-h-screen bg-transparent flex flex-col font-sans relative">

			{/* ─── EXPERT UI: Unified Fixed Mesh Gradient Background ─── */}
			<div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#1E0B4B]">
				<div className="absolute -top-[20%] -right-[10%] w-[300px] sm:w-[600px] md:w-[800px] h-[300px] sm:h-[600px] md:h-[800px] rounded-full bg-[#00E5FF]/35 blur-[80px] sm:blur-[120px] md:blur-[160px]" />
				<div className="absolute -bottom-[20%] -left-[10%] w-[300px] sm:w-[600px] md:w-[800px] h-[300px] sm:h-[600px] md:h-[800px] rounded-full bg-[#00E5FF]/35 blur-[80px] sm:blur-[120px] md:blur-[160px]" />
				<div className="absolute top-[10%] left-[20%] w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] rounded-full bg-[#9D00FF]/30 blur-[100px] sm:blur-[140px]" />
				<div className="absolute bottom-[20%] right-[20%] w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] rounded-full bg-[#6A00F4]/30 blur-[100px] sm:blur-[140px]" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] rounded-full bg-yellow-500/10 blur-[80px] sm:blur-[100px]" />
				<div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
			</div>

			{/* Game Popup Overlay */}
			<AnimatePresence>
				{showGamePopup && (
					<GamePopup onFinish={() => setShowGamePopup(false)} />
				)}
			</AnimatePresence>

			<Navbar />

			<div className="flex-1 flex items-center justify-center px-3 sm:px-4 py-12 sm:py-16 pt-24 sm:pt-28 relative z-10 w-full">

				<div className="relative w-full max-w-lg">

					{/* Header Title Area */}
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, ease: "easeOut" }}
						className="text-center mb-10"
					>
						<div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 mb-4 backdrop-blur-md shadow-sm">
							<Sparkles size={14} className="text-yellow-400" />
							<span className="text-[10px] font-bold tracking-[0.25em] text-yellow-400 uppercase">Avurudu Campaign</span>
						</div>
						<h1 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-normal tracking-wide text-white mb-2 drop-shadow-lg">
							REVEAL YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">ROYAL</span> SELF
						</h1>
						<p className="text-xs sm:text-sm text-gray-300 px-2 sm:px-4 font-medium max-w-md mx-auto">
							Complete the steps below to generate your legendary AI Avatar and enter the Zellers competition.
						</p>
					</motion.div>

					{/* Step Indicator */}
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
						<StepIndicator current={step} unlocked={unlockedStep} onStepClick={goToStep} />
					</motion.div>

					{/* Interactive Form Card */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="bg-white/5 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl sm:rounded-[2rem] p-3 sm:p-6 md:p-8 backdrop-blur-2xl overflow-hidden mt-4 w-full"
					>
						<AnimatePresence mode="wait" custom={dir}>
							<motion.div
								key={step}
								custom={dir}
								variants={slideVariants}
								initial="enter"
								animate="center"
								exit="exit"
								className="w-full"
							>
								{step === 1 && <StepVerify onNext={goNext} />}
								{step === 2 && <StepProfile onNext={goNext} onBack={goBack} />}
								{step === 3 && <StepGenerate onNext={goNext} onBack={goBack} />}
								{step === 4 && <StepQuiz onShowGamePopup={() => setShowGamePopup(true)} onBack={goBack} onTriggerGeneration={handleTriggerGeneration} />}
							</motion.div>
						</AnimatePresence>
					</motion.div>

				</div>
			</div>

			<div className="relative z-10">
				{/* <Footer /> */}
			</div>
		</div>
	);
}

// ─── Main Export with Suspense Boundary ───────────────────────────────────────
export default function CampaignPage() {
	return (
		<>
			<Suspense fallback={null}>
				<AnalyticsTracker pageName="campaign" />
			</Suspense>
			<CampaignPageContent />
		</>
	);
}