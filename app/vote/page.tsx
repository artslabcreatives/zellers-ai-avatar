"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Smartphone, CheckCircle2, ShieldCheck, RefreshCw, AlertCircle, Share2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { trackVoting, trackAuth, trackError } from "@/lib/analytics";
import { useAnalytics } from "@/lib/useAnalytics";

// ─── Types ────────────────────────────────────────────────────────────────────
type Filter = "all" | "kumara" | "kumariya" | "top";

type Post = {
	postId: string;
	postNumber: number;
	displayName: string;
	gender: "male" | "female";
	flavor: string;
	voteCount: number;
	rank?: number;
	imageUrl?: string; // populated once image API is ready
	shareUrl?: string; // share URL for social media
};

type PaginationMeta = {
	totalPosts: number;
	currentPage: number;
	totalPages: number;
	perPage: number;
};

// ─── Constants ────────────────────────────────────────────────────────────────
// Campaign ends April 22, 2026
const TARGET_DATE = new Date("2026-04-22T23:59:59");

const FILTERS: { key: Filter; label: string; dot?: string }[] = [
	{ key: "all", label: "All" },
	{ key: "kumara", label: "Kumara", dot: "bg-blue-400" },
	{ key: "kumariya", label: "Kumariya", dot: "bg-pink-400" },
	{ key: "top", label: "Top Voted", dot: "bg-yellow-400" },
];

// ─── Countdown hook time ───────────────────────────────────────────────────────────
function useCountdown(target: Date) {
	const calc = useCallback(() => {
		const diff = Math.max(0, target.getTime() - Date.now());
		return {
			days: Math.floor(diff / 86_400_000),
			hours: Math.floor((diff % 86_400_000) / 3_600_000),
			minutes: Math.floor((diff % 3_600_000) / 60_000),
			seconds: Math.floor((diff % 60_000) / 1_000),
		};
	}, [target]);

	const [time, setTime] = useState(calc);

	useEffect(() => {
		const id = setInterval(() => setTime(calc()), 1000);
		return () => clearInterval(id);
	}, [calc]);

	return time;
}

// ─── Countdown display ────────────────────────────────────────────────────────
function CountdownTimer() {
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	const { days, hours, minutes, seconds } = useCountdown(TARGET_DATE);

	const units = [
		{ label: "DAYS", value: days, yellow: true },
		{ label: "HOURS", value: hours, yellow: false },
		{ label: "MINUTES", value: minutes, yellow: false },
		{ label: "SECONDS", value: seconds, yellow: false },
	];

	if (!mounted) return (
		<div className="flex items-center gap-0.5 sm:gap-1 justify-center">
			{units.map((u, i) => (
				<div key={u.label} className="flex items-center gap-0.5 sm:gap-1">
					<div className="flex flex-col items-center">
						<span className="text-2xl sm:text-3xl md:text-4xl font-black tabular-nums w-10 sm:w-14 text-center text-gray-100">00</span>
						<span className="text-[8px] sm:text-[9px] tracking-[0.15em] sm:tracking-[0.2em] text-gray-400 mt-0.5">{u.label}</span>
					</div>
					{i < units.length - 1 && <span className="text-xl sm:text-2xl font-black text-gray-600 mb-4 mx-0.5">:</span>}
				</div>
			))}
		</div>
	);

	return (
		<div className="flex items-center gap-0.5 sm:gap-1 justify-center">
			{units.map((u, i) => (
				<div key={u.label} className="flex items-center gap-0.5 sm:gap-1">
					<div className="flex flex-col items-center">
						<span className={`text-2xl sm:text-3xl md:text-4xl font-black tabular-nums w-10 sm:w-14 text-center drop-shadow-md ${u.yellow ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" : "text-gray-100"
							}`}>
							{String(u.value).padStart(2, "0")}
						</span>
						<span className={`text-[8px] sm:text-[9px] tracking-[0.15em] sm:tracking-[0.2em] mt-0.5 ${u.yellow ? "text-yellow-500" : "text-gray-400"}`}>
							{u.label}
						</span>
					</div>
					{i < units.length - 1 && <span className="text-xl sm:text-2xl font-black text-gray-600 mb-4 mx-0.5">:</span>}
				</div>
			))}
		</div>
	);
}

// ─── Placeholder Avatar ───────────────────────────────────────────────────────
// Shown in place of a real image until the image API is ready.
function PlaceholderAvatar({ post }: { post: Post }) {
	const initials = post.displayName
		.split(" ")
		.map((w) => w[0] ?? "")
		.join("")
		.toUpperCase()
		.slice(0, 2);

	const gradient =
		post.gender === "male"
			? "from-blue-700 via-indigo-700 to-violet-800"
			: "from-pink-600 via-rose-600 to-purple-700";

	return (
		<div className={`absolute inset-0 bg-linear-to-br ${gradient} flex items-center justify-center`}>
			<span className="text-5xl sm:text-6xl font-black text-white/25 select-none tracking-wider drop-shadow-2xl">
				{initials}
			</span>
		</div>
	);
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
	return (
		<div className="flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-pulse">
			<div className="w-full aspect-4/5 bg-white/10" />
			<div className="p-4 space-y-3">
				<div className="h-4 bg-white/10 rounded-full w-3/4" />
				<div className="h-3 bg-white/10 rounded-full w-1/2" />
				<div className="flex justify-between items-center mt-2">
					<div className="h-5 bg-white/10 rounded-full w-20" />
					<div className="h-8 bg-white/10 rounded-full w-16" />
				</div>
			</div>
		</div>
	);
}

// ─── Post Card ────────────────────────────────────────────────────────────────
function PostCard({ post, voted, onVote, votingOpen }: { post: Post; voted: boolean; onVote: () => void; votingOpen: boolean }) {
	const isMale = post.gender === "male";
	const [showShareMenu, setShowShareMenu] = useState(false);
	const [shareCopied, setShareCopied] = useState(false);
	const [imageError, setImageError] = useState(false);

	const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.aiavuruduwithzellers.com';
	const shareUrl = post.shareUrl || `${API_BASE}/share/${post.postId}`;
	const shareText = `Vote for ${post.displayName} in the Zellers Avurudu Avatar Contest! 🎉`;

	useEffect(() => {
		// Track post view when card mounts
		trackVoting.postViewed(post.postId, post.postNumber);
	}, [post.postId, post.postNumber]);

	// Close share menu when clicking outside
	useEffect(() => {
		const handleClickOutside = () => {
			if (showShareMenu) {
				setShowShareMenu(false);
			}
		};

		if (showShareMenu) {
			document.addEventListener('click', handleClickOutside);
		}

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [showShareMenu]);

	// Handle native mobile share or open custom menu
	const handleShareButtonClick = async (e: React.MouseEvent) => {
		e.stopPropagation();

		// Check if Web Share API is available (mobile devices)
		if (typeof navigator !== 'undefined' && navigator.share) {
			try {
				await navigator.share({
					title: `${post.displayName}'s Avurudu Avatar`,
					text: shareText,
					url: shareUrl,
				});
				// Track successful native share
				trackVoting.shareClicked(post.postId, 'native_share');
			} catch (error) {
				// User cancelled or share failed
				if ((error as Error).name !== 'AbortError') {
					console.error('Native share failed:', error);
					// Fall back to custom menu
					setShowShareMenu(true);
				}
			}
		} else {
			// Desktop or browsers without Web Share API - show custom menu
			setShowShareMenu(!showShareMenu);
		}
	};

	const handleShare = async (platform: string) => {
		// Track share action
		trackVoting.shareClicked(post.postId, platform);

		let url = '';
		switch (platform) {
			case 'facebook':
				url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
				window.open(url, '_blank', 'width=600,height=400');
				break;
			case 'twitter':
				url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
				window.open(url, '_blank', 'width=600,height=400');
				break;
			case 'whatsapp':
				url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
				window.open(url, '_blank');
				break;
			case 'copy':
				try {
					await navigator.clipboard.writeText(shareUrl);
					setShareCopied(true);
					setTimeout(() => setShareCopied(false), 2000);
				} catch (error) {
					console.error('Failed to copy link:', error);
				}
				break;
		}
		setShowShareMenu(false);
	};

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.95 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className="group relative flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-yellow-400/50 hover:-translate-y-2 transition-all duration-500 shadow-xl hover:shadow-[0_15px_40px_rgba(234,179,8,0.15)]"
			style={voted ? { boxShadow: "0 0 20px rgba(234,179,8,0.2)", borderColor: "rgba(234,179,8,0.4)" } : undefined}
		>
			{/* Image area */}
			<div className="relative w-full aspect-[3/5] overflow-hidden">
				{post.imageUrl && !imageError ? (
					<Image
						src={post.imageUrl}
						alt={post.displayName}
						fill
						sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
						className="object-cover transition-transform duration-700 group-hover:scale-110"
						onError={() => setImageError(true)}
						priority={false}
					/>
				) : (
					<PlaceholderAvatar post={post} />
				)}
				<div className="absolute inset-0 bg-linear-to-t from-[#1E0B4B]/95 via-[#1E0B4B]/20 to-transparent" />

				{/* Post number badge */}
				<div className="absolute top-2.5 left-2.5">
					<span className="text-[10px] font-extrabold text-gray-100 bg-black/60 backdrop-blur-md rounded-full px-2.5 py-1 border border-white/10 shadow-md">
						#{post.postNumber}
					</span>
				</div>

				{/* Gender badge */}
				<div className="absolute top-2.5 right-2.5">
					<span className={`text-[9px] font-extrabold tracking-widest text-white rounded-full px-2.5 py-1 shadow-md ${isMale
						? "bg-linear-to-r from-blue-500 to-indigo-500"
						: "bg-linear-to-r from-pink-500 to-rose-500"
						}`}>
						{isMale ? "KUMARA" : "KUMARIYA"}
					</span>
				</div>

				{/* Share button */}
				<div className="absolute bottom-2.5 right-2.5">
					<div className="relative">
						<button
							onClick={handleShareButtonClick}
							className="w-8 h-8 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-yellow-500/20 hover:border-yellow-500/50 transition-all duration-200 shadow-md"
							title="Share this avatar"
						>
							<Share2 size={14} />
						</button>

						{/* Share menu */}
						<AnimatePresence>
							{showShareMenu && (
								<motion.div
									initial={{ opacity: 0, scale: 0.9, y: -10 }}
									animate={{ opacity: 1, scale: 1, y: 0 }}
									exit={{ opacity: 0, scale: 0.9, y: -10 }}
									transition={{ duration: 0.2 }}
									className="absolute bottom-full right-0 mb-2 bg-[#1a0f4e] border border-purple-500/30 rounded-xl p-2 shadow-2xl backdrop-blur-xl min-w-[140px] z-50"
									onClick={(e) => e.stopPropagation()}
								>
									<div className="text-[10px] text-gray-400 font-bold px-3 py-1 tracking-wide uppercase">Share via</div>
									<button
										onClick={(e) => { e.stopPropagation(); handleShare('facebook'); }}
										className="w-full text-left text-xs font-bold text-white hover:text-blue-400 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
									>
										📘 Facebook
									</button>
									<button
										onClick={(e) => { e.stopPropagation(); handleShare('twitter'); }}
										className="w-full text-left text-xs font-bold text-white hover:text-blue-300 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
									>
										🐦 Twitter
									</button>
									<button
										onClick={(e) => { e.stopPropagation(); handleShare('whatsapp'); }}
										className="w-full text-left text-xs font-bold text-white hover:text-green-400 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
									>
										💬 WhatsApp
									</button>
									<button
										onClick={(e) => { e.stopPropagation(); handleShare('copy'); }}
										className="w-full text-left text-xs font-bold text-white hover:text-yellow-400 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
									>
										{shareCopied ? '✅ Copied!' : '📋 Copy Link'}
									</button>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-1.5 sm:gap-2 px-2.5 sm:px-4 pt-2 sm:pt-3 pb-3 sm:pb-5 relative z-10">
				<p className="text-xs sm:text-sm font-bold text-gray-100 leading-tight drop-shadow-sm truncate" title={post.displayName}>
					{post.displayName}
				</p>
				<p className="text-[10px] sm:text-[11px] text-yellow-400/80 font-medium truncate">{post.flavor}</p>

				{/* Rank display (if available) */}
				{post.rank && (
					<p className="text-[10px] sm:text-[11px] text-purple-400/80 font-bold">
						Rank #{post.rank}
					</p>
				)}

				{/* Vote row */}
				<div className="flex items-center justify-between mt-1 sm:mt-2 gap-1 sm:gap-2">
					<span className="text-sm sm:text-base font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]">
						{post.voteCount.toLocaleString()}
						<span className="text-[8px] sm:text-[10px] font-bold text-yellow-400/60 ml-0.5 sm:ml-1 tracking-wider uppercase">votes</span>
					</span>
					<button
						onClick={() => {
							if (!votingOpen) return;
							const userId = 'user_' + Date.now(); // Get from auth token
							trackVoting.voteAttempted(userId, post.postId);
							onVote();
						}}
						disabled={voted || !votingOpen}
						className={[
							"text-[10px] sm:text-[11px] font-extrabold tracking-widest rounded-full px-2.5 sm:px-4 py-1.5 sm:py-2 transition-all duration-300 shrink-0",
							!votingOpen
								? "bg-gray-500/10 text-gray-500 border border-gray-500/30 cursor-not-allowed opacity-50"
								: voted
									? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 cursor-default"
									: "bg-linear-to-r from-yellow-400 to-amber-500 text-black hover:brightness-110 hover:scale-105 shadow-[0_0_15px_rgba(234,179,8,0.4)]",
						].join(" ")}
						title={!votingOpen ? "Voting is currently closed" : voted ? "Already voted" : "Vote for this avatar"}
					>
						{!votingOpen ? "CLOSED" : voted ? "✦ VOTED" : "VOTE"}
					</button>
				</div>
			</div>
		</motion.div>
	);
}

// ─── Vote Modal ───────────────────────────────────────────────────────────────
type VoteModalProps = {
	post: Post | null;
	onClose: () => void;
	onSuccess: (postId: string, token: string) => void;
};

function VoteModal({ post, onClose, onSuccess }: VoteModalProps) {
	const [phase, setPhase] = useState<"phone" | "otp" | "success">("phone");
	const [phone, setPhone] = useState("");
	const [otp, setOtp] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [cooldown, setCooldown] = useState(0);
	const [voteResult, setVoteResult] = useState<"voted" | "already_voted">("voted");

	// Reset state whenever a different post is targeted
	useEffect(() => {
		setPhase("phone");
		setPhone("");
		setOtp("");
		setError("");
		setCooldown(0);
		setVoteResult("voted");
	}, [post?.postId]);

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
		try {
			// Try WhatsApp first; fall back to SMS if the number isn't on WhatsApp
			const waRes = await fetch("/api/auth/send-whatsapp-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ phone: formattedPhone }),
			});
			const waData = await waRes.json();

			if (waRes.status === 429) {
				setError(waData.message || "Too many requests. Please wait before trying again.");
				setCooldown(30);
				trackAuth.otpFailed(formattedPhone, 'rate_limited');
				return;
			}

			if (waRes.ok) {
				setPhase("otp");
				trackAuth.otpRequested(formattedPhone, 'whatsapp');
				return;
			}

			// WhatsApp unavailable — fall back to SMS
			const smsRes = await fetch("/api/auth/send-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ phone: formattedPhone }),
			});
			const smsData = await smsRes.json();

			if (smsRes.status === 429) {
				setError(smsData.message || "Too many requests. Please wait before trying again.");
				setCooldown(30);
				trackAuth.otpFailed(formattedPhone, 'rate_limited_sms');
			} else if (!smsRes.ok) {
				setError(smsData.message || "Failed to send OTP. Please try again.");
				trackAuth.otpFailed(formattedPhone, smsData.message || 'sms_failed');
			} else {
				setPhase("otp");
				trackAuth.otpRequested(formattedPhone, 'sms');
			}
		} catch {
			setError("Network error. Please check your connection.");
		} finally {
			setLoading(false);
		}
	}

	async function handleVerifyAndVote() {
		if (otp.length < 4 || !post) return;
		setError("");
		setLoading(true);
		try {
			const res = await fetch("/api/auth/verify-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ phone: `+94${phone}`, otp }),
			});
			const data = await res.json();
			if (res.status === 429) {
				setError(data.message || "Too many attempts. Please wait.");
				trackAuth.otpFailed(`+94${phone}`, 'rate_limited_verify');
			} else if (!res.ok) {
				setError(data.message || "Invalid OTP. Please try again.");
				trackAuth.otpFailed(`+94${phone}`, 'invalid_otp');
			} else {
				const token: string = data.token;
				trackAuth.otpVerified(`+94${phone}`, 'sms'); // Track successful verification
				try {
					const voteRes = await fetch(`/api/votes/${post.postId}`, {
						method: "POST",
						headers: { Authorization: `Bearer ${token}` },
					});
					const voteData = await voteRes.json();
					const userId = data.userId || 'user_' + Date.now();
					if (voteRes.status === 409) {
						// Already voted — acknowledge and mark as voted in UI
						setVoteResult("already_voted");
						trackVoting.voteFailed(userId, post.postId, 'already_voted');
					} else if (!voteRes.ok) {
						setError(voteData.message || "Failed to cast vote. Please try again.");
						trackVoting.voteFailed(userId, post.postId, voteData.message || 'vote_failed');
						trackError.apiError(`/api/votes/${post.postId}`, voteRes.status, voteData.message);
						return;
					} else {
						setVoteResult("voted");
					}
					setPhase("success");
					setTimeout(() => { onSuccess(post.postId, token); onClose(); }, 2000);
				} catch {
					setError("Network error. Failed to cast vote.");
					trackVoting.voteFailed('unknown', post.postId, 'network_error');
					return;
				}
			}
		} catch {
			setError("Network error. Please check your connection.");
		} finally {
			setLoading(false);
		}
	}

	// Close on backdrop click
	function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
		if (e.target === e.currentTarget) onClose();
	}

	if (!post) return null;

	return (
		<AnimatePresence>
			<motion.div
				key="vote-modal-backdrop"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.25 }}
				className="fixed inset-0 z-200 flex items-center justify-center px-4"
				style={{ backgroundColor: "rgba(10,5,30,0.85)", backdropFilter: "blur(8px)" }}
				onClick={handleBackdrop}
			>
				<motion.div
					key="vote-modal-card"
					initial={{ opacity: 0, scale: 0.92, y: 24 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.92, y: 24 }}
					transition={{ duration: 0.3, ease: "easeOut" }}
					className="relative w-full max-w-[calc(100vw-2rem)] sm:max-w-sm bg-[#1a0f4e] border border-purple-500/20 rounded-3xl p-4 sm:p-6 md:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden"
				>
					{/* Top gold accent line */}
					<div className="absolute top-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-yellow-400/60 to-transparent" />

					{/* Close button */}
					<button
						onClick={onClose}
						className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
						aria-label="Close"
					>
						<X size={14} />
					</button>

					<AnimatePresence mode="wait">

						{/* ── Phase: Phone ── */}
						{phase === "phone" && (
							<motion.div key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-5">
								<div className="flex items-center gap-3 mb-6">
									<div className="w-10 h-10 rounded-full bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center shrink-0">
										<Smartphone size={18} className="text-yellow-400" />
									</div>
									<div>
										<p className="text-base font-black text-gray-100 leading-tight">Verify to Vote</p>
										<p className="text-xs text-gray-400 mt-0.5">Voting for <span className="text-yellow-400 font-bold">{post.displayName}</span></p>
									</div>
								</div>

								<div className="space-y-1.5">
									<label className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400">
										Mobile Number <span className="text-yellow-500/70">• දුරකථන අංකය</span>
									</label>
									<div className="flex gap-2">
										<div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm text-gray-300 font-semibold shrink-0 select-none">
											<span>🇱🇰</span>
											<span>+94</span>
										</div>
										<input
											type="tel"
											inputMode="numeric"
											maxLength={10}
											value={phone}
											onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setError(""); }}
											placeholder="7X XXX XXXX"
											className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-all duration-300"
										/>
									</div>
								</div>

								<AnimatePresence>
									{error && (
										<motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-red-400 text-center font-semibold bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
											{error}
										</motion.p>
									)}
								</AnimatePresence>

								<button
									onClick={handleSendOtp}
									disabled={phone.length < 9 || loading || cooldown > 0}
									className="w-full bg-linear-to-r from-yellow-400 to-amber-500 text-black text-sm font-black tracking-widest rounded-xl py-3.5 hover:brightness-110 hover:scale-[1.01] shadow-[0_4px_15px_rgba(234,179,8,0.3)] disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed transition-all duration-300"
								>
									{loading ? "SENDING OTP…" : cooldown > 0 ? `WAIT ${cooldown}s` : "SEND OTP"}
								</button>

								<p className="text-center text-[10px] text-gray-600 tracking-wide">
									One vote per day, per number.
								</p>
							</motion.div>
						)}

						{/* ── Phase: OTP ── */}
						{phase === "otp" && (
							<motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-5">
								<div className="flex items-center gap-3 mb-6">
									<div className="w-10 h-10 rounded-full bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center shrink-0">
										<ShieldCheck size={18} className="text-yellow-400" />
									</div>
									<div>
										<p className="text-base font-black text-gray-100 leading-tight">Enter OTP</p>
										<p className="text-xs text-gray-400 mt-0.5">Sent to +94 {phone}</p>
									</div>
								</div>

								<div className="space-y-1.5">
									<label className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400">
										OTP Code <span className="text-yellow-500/70">• කේතය</span>
									</label>
									<input
										type="text"
										inputMode="numeric"
										maxLength={6}
										value={otp}
										onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); setError(""); }}
										placeholder="• • • • • •"
										className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xl text-yellow-400 placeholder-gray-600 outline-none focus:border-yellow-500/50 transition-all duration-300 tracking-[0.5em] text-center font-black"
									/>
								</div>

								<AnimatePresence>
									{error && (
										<motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-red-400 text-center font-semibold bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
											{error}
										</motion.p>
									)}
								</AnimatePresence>

								<button
									onClick={handleVerifyAndVote}
									disabled={otp.length < 4 || loading}
									className="w-full bg-linear-to-r from-yellow-400 to-amber-500 text-black text-sm font-black tracking-widest rounded-xl py-3.5 hover:brightness-110 hover:scale-[1.01] shadow-[0_4px_15px_rgba(234,179,8,0.3)] disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed transition-all duration-300"
								>
									{loading ? "VERIFYING…" : "VERIFY & VOTE"}
								</button>

								<button
									onClick={() => { setPhase("phone"); setOtp(""); }}
									className="w-full text-[11px] font-bold tracking-widest text-gray-500 hover:text-yellow-400 transition-colors duration-200 text-center"
								>
									← Change number
								</button>
							</motion.div>
						)}

						{/* ── Phase: Success ── */}
						{phase === "success" && (
							<motion.div key="success" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: "easeOut" }} className="flex flex-col items-center gap-4 py-6 text-center">
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
								>
									{voteResult === "already_voted" ? (
										<AlertCircle size={56} className="text-yellow-400" strokeWidth={1.5} />
									) : (
										<CheckCircle2 size={56} className="text-yellow-400" strokeWidth={1.5} />
									)}
								</motion.div>
								{voteResult === "already_voted" ? (
									<>
										<p className="text-xl font-black text-transparent bg-clip-text bg-linear-to-r from-yellow-300 to-amber-500">Already Voted!</p>
										<p className="text-sm text-gray-400">You&apos;ve already voted for <span className="text-yellow-400 font-bold">{post.displayName}</span>. Your vote still counts!</p>
									</>
								) : (
									<>
										<p className="text-xl font-black text-transparent bg-clip-text bg-linear-to-r from-yellow-300 to-amber-500">Vote Cast!</p>
										<p className="text-sm text-gray-400">Thanks for voting for <span className="text-yellow-400 font-bold">{post.displayName}</span>!</p>
									</>
								)}
							</motion.div>
						)}

					</AnimatePresence>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}

// ─── Pagination component ─────────────────────────────────────────────────────
function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
	if (totalPages <= 1) return null;

	// Show up to 5 page numbers centred around current
	const delta = 2;
	const start = Math.max(1, page - delta);
	const end = Math.min(totalPages, page + delta);
	const range: number[] = [];
	for (let i = start; i <= end; i++) range.push(i);

	return (
		<div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
			<button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-white/20 bg-white/5 text-white text-xs sm:text-sm font-bold hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all" aria-label="Previous page">‹</button>
			{start > 1 && (
				<>
					<button onClick={() => onChange(1)} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-[10px] sm:text-xs font-extrabold border border-white/15 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-all">1</button>
					{start > 2 && <span className="text-gray-600 text-sm px-1">…</span>}
				</>
			)}

			{range.map((p) => (
				<button key={p} onClick={() => onChange(p)} className={["w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-[10px] sm:text-xs font-extrabold border transition-all", p === page ? "bg-yellow-500/20 border-yellow-400/50 text-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.25)]" : "border-white/15 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"].join(" ")}>{p}</button>
			))}

			{end < totalPages && (
				<>
					{end < totalPages - 1 && <span className="text-gray-600 text-sm px-1">…</span>}
					<button onClick={() => onChange(totalPages)} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-[10px] sm:text-xs font-extrabold border border-white/15 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-all">{totalPages}</button>
				</>
			)}

			<button onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-white/20 bg-white/5 text-white text-xs sm:text-sm font-bold hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all" aria-label="Next page">›</button>
		</div>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const PAGE_SIZE = 8; // Increased slightly for better grid fill

// ─── Analytics Wrapper Component with Suspense ────────────────────────────────
function AnalyticsTracker({ pageName }: { pageName: string }) {
	useAnalytics(pageName);
	return null;
}

// ─── Main Page Component ──────────────────────────────────────────────────────
function VotePageContent() {
	const [filter, setFilter] = useState<Filter>("all");
	const [page, setPage] = useState(1);
	const [posts, setPosts] = useState<Post[]>([]);
	const [pagination, setPagination] = useState<PaginationMeta | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [voted, setVoted] = useState<Set<string>>(new Set());
	const [voteTarget, setVoteTarget] = useState<Post | null>(null);
	const [query, setQuery] = useState("");
	const [votingOpen, setVotingOpen] = useState(false);
	const [votingStatusLoading, setVotingStatusLoading] = useState(true);

	// Check voting status on mount
	useEffect(() => {
		fetch("/api/votes/status")
			.then((r) => r.json())
			.then((data) => {
				if (data.success) {
					setVotingOpen(data.votingOpen);
				}
			})
			.catch(() => {
				// Default to closed on error
				setVotingOpen(false);
			})
			.finally(() => {
				setVotingStatusLoading(false);
			});
	}, []);

	const fetchPosts = useCallback(async (f: Filter, p: number) => {
		setLoading(true);
		setError("");
		try {
			const url =
				f === "all" ? `/api/posts?page=${p}` :
					f === "kumara" ? `/api/posts/male?page=${p}` :
						f === "kumariya" ? `/api/posts/female?page=${p}` :
							`/api/posts/top/mixed`;

			const res = await fetch(url);
			const data = await res.json();

			if (!res.ok || !data.success) {
				setError(data.message || "Failed to load posts. Please try again.");
				setPosts([]);
				setPagination(null);
				return;
			}

			setPosts(data.posts ?? []);
			setPagination(data.pagination ?? null); // top/mixed has no pagination
		} catch {
			setError("Network error. Please check your connection and try again.");
			setPosts([]);
			setPagination(null);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchPosts(filter, page);
		trackVoting.pageViewed(filter, page);
	}, [filter, page, fetchPosts]);

	// Restore previously voted posts from the stored auth token
	useEffect(() => {
		const token = typeof window !== "undefined" ? localStorage.getItem("zell_auth_token") : null;
		if (!token) return;
		fetch("/api/votes/my-votes", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((r) => r.json())
			.then((data) => {
				if (data.success && Array.isArray(data.votedPostIds)) {
					setVoted(new Set<string>(data.votedPostIds));
				}
			})
			.catch(() => { }); // silent fail — UI degrades gracefully
	}, []);

	function handleFilterChange(f: Filter) {
		setFilter(f);
		setPage(1);
		setQuery("");
		trackVoting.filterChanged(f);
	}

	function handleVoteSuccess(postId: string, token: string) {
		if (typeof window !== "undefined") {
			localStorage.setItem("zell_auth_token", token);
		}
		setVoted((prev) => new Set(prev).add(postId));
		// Track successful vote
		const userId = 'user_' + Date.now(); // Parse from token in production
		trackVoting.voteSuccess(userId, postId);
		// Optimistically bump vote count in local state
		setPosts((prev) =>
			prev.map((p) => p.postId === postId ? { ...p, voteCount: p.voteCount + 1 } : p)
		);
	}

	// Client-side search on the currently loaded page of posts
	const q = query.trim().toLowerCase();
	const visiblePosts = q
		? posts.filter(
			(p) =>
				p.displayName.toLowerCase().includes(q) ||
				p.flavor.toLowerCase().includes(q)
		)
		: posts;

	const totalPages = pagination?.totalPages ?? 1;

	return (
		<div className="min-h-screen bg-transparent flex flex-col relative">

			{/* ─── EXPERT UI: Unified Fixed Mesh Gradient Background ─── */}
			<div
				aria-hidden
				className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#1E0B4B]"
			>
				<div className="absolute -top-[20%] -right-[10%] w-[250px] sm:w-150 md:w-200 h-[250px] sm:h-150 md:h-200 rounded-full bg-[#00E5FF]/35 blur-[80px] sm:blur-[120px] md:blur-[160px]" />
				<div className="absolute -bottom-[20%] -left-[10%] w-[250px] sm:w-150 md:w-200 h-[250px] sm:h-150 md:h-200 rounded-full bg-[#00E5FF]/35 blur-[80px] sm:blur-[120px] md:blur-[160px]" />
				<div className="absolute top-[10%] left-[20%] w-[200px] sm:w-125 h-[200px] sm:h-125 rounded-full bg-[#9D00FF]/30 blur-[100px] sm:blur-[140px]" />
				<div className="absolute bottom-[20%] right-[20%] w-[200px] sm:w-125 h-[200px] sm:h-125 rounded-full bg-[#6A00F4]/30 blur-[100px] sm:blur-[140px]" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] sm:w-100 h-[150px] sm:h-100 rounded-full bg-yellow-500/10 blur-[80px] sm:blur-[100px]" />
				<div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
			</div>

			<Navbar />

			<div className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-3 sm:px-4 pt-24 sm:pt-32 pb-12 sm:pb-20">

				{/* ── Header ────────────────────────────────────────────────────── */}
				<div className="flex flex-col items-center text-center gap-2 sm:gap-3 mb-8 sm:mb-12">
					<motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
						{votingStatusLoading ? (
							<span className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase text-gray-400 border border-gray-500/40 bg-gray-500/10 rounded-full px-4 py-1.5 backdrop-blur-md">
								LOADING...
							</span>
						) : votingOpen ? (
							<span className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase text-green-400 border border-green-500/40 bg-green-500/10 rounded-full px-4 py-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(34,197,94,0.2)]">
								<span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
								VOTING IS LIVE
							</span>
						) : (
							<span className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase text-red-400 border border-red-500/40 bg-red-500/10 rounded-full px-4 py-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(239,68,68,0.2)]">
								<span className="w-2 h-2 rounded-full bg-red-400" />
								VOTING IS CLOSED
							</span>
						)}
					</motion.div>

					<motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }} className="text-[10px] sm:text-xs font-bold tracking-[0.4em] uppercase text-yellow-400 mt-2">
						AI AVATAR GALLERY
					</motion.p>

					<motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" as const }} className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-tight drop-shadow-lg">
						{votingOpen ? (
							<>
								VOTE FOR YOUR{" "}
								<span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-300 to-amber-500">FAVOURITE</span>
							</>
						) : (
							<>
								VIEW THE{" "}
								<span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-300 to-amber-500">AVATARS</span>
							</>
						)}
					</motion.h1>

					<motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="text-base sm:text-lg md:text-xl font-bold text-yellow-100/90">
						{votingOpen ? "ඔබේ ප්‍රියතම Avatar එකට ජන්දය දෙන්න" : "Avatar ගැලරිය නරඹන්න"}
					</motion.p>

					{!votingOpen && !votingStatusLoading && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.3 }}
							className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl px-6 py-4 max-w-2xl backdrop-blur-md"
						>
							<p className="text-sm sm:text-base text-yellow-200 font-semibold">
								Voting is currently closed. Please check back later!
							</p>
							<p className="text-xs sm:text-sm text-yellow-300/70 mt-2">
								You can still browse all the amazing AI avatars created by our community.
							</p>
						</motion.div>
					)}
				</div>

				{/* ── Countdown ─────────────────────────────────────────────────── */}
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl sm:rounded-4xl px-3 sm:px-8 py-5 sm:py-8 mb-8 sm:mb-12 max-w-md mx-auto text-center shadow-2xl">
					<CountdownTimer />
				</motion.div>

				{/* ── Filter Tabs ───────────────────────────────────────────────── */}
				<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.45 }} className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap mb-6">
					{FILTERS.map((f) => (
						<button
							key={f.key}
							onClick={() => handleFilterChange(f.key)}
							className={[
								"inline-flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold tracking-widest uppercase rounded-full px-3 sm:px-5 py-2 sm:py-2.5 border transition-all duration-300",
								filter === f.key
									? "bg-yellow-500/20 border-yellow-400/50 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]"
									: "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20 hover:text-white backdrop-blur-md",
							].join(" ")}
						>
							{f.dot && <span className={`w-2 h-2 rounded-full shadow-sm ${f.dot}`} />}
							{f.label}
						</button>
					))}
				</motion.div>

				{/* ── Search Bar ────────────────────────────────────────────────── */}
				<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }} className="relative max-w-lg mx-auto mb-8 sm:mb-12">
					<div className="relative flex items-center">
						<Search size={18} className="absolute left-5 text-white/40 pointer-events-none shrink-0" />
						<input
							type="text"
							value={query}
							onChange={(e) => {
								const newQuery = e.target.value;
								setQuery(newQuery);
								if (newQuery.trim().length > 2) {
									const matches = posts.filter(
										(p) =>
											p.displayName.toLowerCase().includes(newQuery.toLowerCase()) ||
											p.flavor.toLowerCase().includes(newQuery.toLowerCase())
									);
									trackVoting.searchPerformed(newQuery, matches.length);
								}
							}}
							placeholder="Search by name or flavor…"
							className="w-full bg-white/5 border border-white/10 backdrop-blur-md rounded-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-3.5 text-xs sm:text-sm text-white placeholder-white/40 tracking-wide focus:outline-none focus:border-yellow-400/50 focus:bg-white/10 focus:ring-4 focus:ring-yellow-400/10 transition-all duration-300"
						/>
						<AnimatePresence>
							{query && (
								<motion.button
									initial={{ opacity: 0, scale: 0.7 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.7 }}
									transition={{ duration: 0.15 }}
									onClick={() => { setQuery(""); }}
									className="absolute right-4 text-white/40 hover:text-white transition-colors duration-150 bg-white/10 rounded-full p-1"
									aria-label="Clear search"
								>
									<X size={14} />
								</motion.button>
							)}
						</AnimatePresence>
					</div>
					{q && !loading && (
						<p className="text-center text-[11px] font-bold tracking-widest text-yellow-400/70 mt-3 uppercase">
							{visiblePosts.length === 0
								? `No posts match "${query}"`
								: `${visiblePosts.length} post${visiblePosts.length !== 1 ? "s" : ""} found`}
						</p>
					)}
				</motion.div>

				{/* ── Grid / Error / Empty / Skeleton ───────────────────────────── */}
				{loading ? (
					<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
						{Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
					</div>
				) : error ? (
					<div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
						<p className="text-red-400 font-bold text-sm max-w-sm">{error}</p>
						<button
							onClick={() => fetchPosts(filter, page)}
							className="inline-flex items-center gap-2 text-xs font-black tracking-widest text-yellow-400 border border-yellow-400/30 rounded-full px-6 py-3 hover:bg-yellow-500/10 transition-all"
						>
							<RefreshCw size={14} /> TRY AGAIN
						</button>
					</div>
				) : visiblePosts.length === 0 ? (
					<div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
						<p className="text-gray-400 font-bold text-sm">
							{q ? `No posts match "${query}".` : "No posts found for this filter."}
						</p>
					</div>
				) : (
					<motion.div
						variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
						initial="hidden"
						animate="visible"
						className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
					>
						<AnimatePresence mode="popLayout">
							{visiblePosts.map((post) => (
								<PostCard
									key={post.postId}
									post={post}
									voted={voted.has(post.postId)}
									onVote={() => setVoteTarget(post)}
									votingOpen={votingOpen}
								/>
							))}
						</AnimatePresence>
					</motion.div>
				)}

				{/* Pagination */}
				{!loading && !error && pagination && filter !== "top" && (
					<div className="mt-16 flex flex-col items-center gap-4">
						<Pagination page={page} totalPages={totalPages} onChange={setPage} />
						<p className="text-[11px] font-bold text-white/30 tracking-widest uppercase">
							Page {page} of {totalPages} · {pagination.totalPosts} total entries
						</p>
					</div>
				)}

				{/* ── Bottom CTA ────────────────────────────────────────────────── */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className="mt-16 sm:mt-28 flex flex-col items-center gap-4 sm:gap-5"
				>
					<p className="text-lg font-black text-white tracking-wide">
						ඔබේ Avatar එකක් නොමතිද?
					</p>
					<Link
						href="/campaign"
						className="inline-flex items-center justify-center gap-2 text-sm font-extrabold tracking-widest text-black bg-linear-to-r from-yellow-400 via-yellow-500 to-amber-500 rounded-full px-10 py-4 hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(234,179,8,0.4)] hover:shadow-[0_6px_30px_rgba(234,179,8,0.6)] uppercase"
					>
						<span className="text-lg leading-none">+</span> CREATE YOUR AVATAR NOW
					</Link>
				</motion.div>

			</div>

			{/* ── Vote Modal ─────────────────────────────────────────────────────── */}
			<VoteModal
				post={voteTarget}
				onClose={() => setVoteTarget(null)}
				onSuccess={handleVoteSuccess}
			/>

			{/* ── Footer ───────────────────────────────────────────────────────────── */}
			<footer className="relative z-10 bg-transparent border-t border-white/10 py-12 mt-auto">
				<div className="relative z-10 max-w-6xl mx-auto px-4 flex flex-col items-center gap-6">
					<div className="relative w-40 h-20">
						<Image
							src="/Avrudu-logo.png"
							alt="AI Avurudu with Zellers Chocolates"
							fill
							className="object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
						/>
					</div>
					<nav aria-label="Vote page footer">
						<ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
							{[
								{ label: "TERMS", href: "/terms" },
								{ label: "PRIVACY", href: "/privacy" },
								{ label: "FAQ", href: "/faq" },
								{ label: "CONTACT", href: "/contact" },
							].map((l) => (
								<li key={l.label}>
									<Link href={l.href} className="text-xs font-bold text-white/50 hover:text-yellow-400 tracking-[0.2em] transition-colors duration-200">
										{l.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>
					<p className="text-[10px] font-bold text-white/30 tracking-widest text-center uppercase mt-4">
						© 2026 Zellers Chocolates. All rights reserved. <br className="sm:hidden" /> Campaign subject to terms & conditions.
					</p>
				</div>
			</footer>
		</div>
	);
}

// ─── Main Export with Suspense Boundary ───────────────────────────────────────
export default function VotePage() {
	return (
		<>
			<Suspense fallback={null}>
				<AnalyticsTracker pageName="vote" />
			</Suspense>
			<VotePageContent />
		</>
	);
}