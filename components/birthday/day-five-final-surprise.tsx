"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

type Stage = "intro" | "video" | "cake";

interface FinalSurpriseProps {
	surprise?: { title?: string; content?: string; url?: string; type?: string };
	video?: { title?: string; url?: string; thumbnailUrl?: string };
	reveal?: { title?: string; subtitle?: string };
}

function isDirectVideoFile(url: string): boolean {
	return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url);
}

/** Turns a YouTube/Vimeo watch URL into an embeddable URL, or null if unrecognized. */
function toEmbedUrl(url: string): string | null {
	try {
		const u = new URL(url);
		if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
			return `https://www.youtube.com/embed/${u.searchParams.get("v")}?autoplay=1&rel=0`;
		}
		if (u.hostname === "youtu.be") {
			const id = u.pathname.replace("/", "");
			return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null;
		}
		if (u.hostname.includes("vimeo.com")) {
			const id = u.pathname.split("/").filter(Boolean).pop();
			return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : null;
		}
	} catch {
		return null;
	}
	return null;
}

function fireCakeConfetti() {
	const duration = 1800;
	const end = Date.now() + duration;
	const colors = ["#f43f5e", "#fb7185", "#fde68a", "#ffffff"];

	confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 }, colors });

	(function frame() {
		confetti({ particleCount: 4, angle: 60, spread: 65, origin: { x: 0 }, colors });
		confetti({ particleCount: 4, angle: 120, spread: 65, origin: { x: 1 }, colors });
		if (Date.now() < end) requestAnimationFrame(frame);
	})();
}

/**
 * The "Open the final surprise" box for Day 5.
 * Flow: intro card -> video plays to completion -> cake reveal (with confetti).
 * If there's no video configured, the box skips straight to the cake.
 */
export function DayFiveFinalSurprise({ surprise, video, reveal }: FinalSurpriseProps) {
	const [stage, setStage] = useState<Stage>("intro");
	const confettiFiredRef = useRef(false);

	const videoUrl = video?.url ?? "";
	const isDirect = videoUrl ? isDirectVideoFile(videoUrl) : false;
	const embedUrl = !isDirect && videoUrl ? toEmbedUrl(videoUrl) : null;

	function goToCake() {
		setStage("cake");
		if (!confettiFiredRef.current) {
			confettiFiredRef.current = true;
			fireCakeConfetti();
		}
	}

	function handleOpen() {
		if (videoUrl) {
			setStage("video");
		} else {
			goToCake();
		}
	}

	return (
		<section className="overflow-hidden rounded-[30px] border border-rose-200 bg-[radial-gradient(circle_at_top,_#fff1f3_0%,_#fffaf8_60%,_#f6e9e2_100%)] p-6 shadow-[0_18px_40px_rgba(91,62,43,0.06)] sm:p-8">
			<AnimatePresence mode="wait">
				{stage === "intro" && (
					<motion.div
						key="intro"
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{ duration: 0.4 }}
					>
						<p className="text-[10px] uppercase tracking-[0.25em] text-rose-500">final surprise</p>
						<h3 className="mt-3 font-display text-3xl text-stone-800">{surprise?.title ?? "Your final surprise"}</h3>
						<p className="mt-3 text-base leading-7 text-stone-700">
							{surprise?.content ?? "Click below to open the last little gift I prepared for you."}
						</p>
						<motion.button
							type="button"
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 0.97 }}
							onClick={handleOpen}
							className="mt-5 inline-flex items-center gap-2 rounded-full bg-rose-500 px-5 py-3 text-sm font-medium text-white shadow-[0_10px_24px_rgba(244,63,94,0.35)] transition hover:bg-rose-400"
						>
							<span aria-hidden>🎁</span> Open the final surprise
						</motion.button>
					</motion.div>
				)}

				{stage === "video" && (
					<motion.div
						key="video"
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{ duration: 0.4 }}
					>
						<p className="text-[10px] uppercase tracking-[0.25em] text-rose-500">one more thing</p>
						<h3 className="mt-3 font-display text-2xl text-stone-800">{video?.title ?? "A little film for you"}</h3>
						<div className="mt-5 overflow-hidden rounded-[22px] border border-rose-200 bg-black shadow-[0_18px_40px_rgba(91,62,43,0.15)]">
							<div className="aspect-video w-full">
								{isDirect ? (
									<video
										src={videoUrl}
										poster={video?.thumbnailUrl}
										className="h-full w-full"
										autoPlay
										controls
										playsInline
										onEnded={goToCake}
									/>
								) : embedUrl ? (
									<iframe
										src={embedUrl}
										className="h-full w-full"
										allow="autoplay; encrypted-media; picture-in-picture"
										allowFullScreen
									/>
								) : (
									<a
										href={videoUrl}
										target="_blank"
										rel="noreferrer"
										className="flex h-full w-full items-center justify-center text-sm text-white/80 underline"
									>
										Open the film in a new tab
									</a>
								)}
							</div>
						</div>
						{/* Manual continue, since onEnded can't be detected reliably for embedded/external players. */}
						<button
							type="button"
							onClick={goToCake}
							className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-rose-300 bg-white/70 px-5 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-white"
						>
							I&apos;ve watched it — continue to your cake <span aria-hidden>🎂</span>
						</button>
					</motion.div>
				)}

				{stage === "cake" && (
					<motion.div
						key="cake"
						initial={{ opacity: 0, scale: 0.92 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5 }}
						className="text-center"
					>
						<p className="text-[10px] uppercase tracking-[0.25em] text-rose-500">the moment</p>
						<motion.div
							initial={{ y: 20, opacity: 0, scale: 0.7 }}
							animate={{ y: 0, opacity: 1, scale: 1 }}
							transition={{ delay: 0.15, duration: 0.6, type: "spring" }}
							className="mx-auto mt-4 text-7xl"
						>
							🎂
						</motion.div>
						<h3 className="mt-5 font-display text-4xl text-stone-800">{reveal?.title ?? "HAPPY BIRTHDAY, KESAR ❤️"}</h3>
						<p className="mx-auto mt-3 max-w-md text-base leading-7 text-stone-700">
							{reveal?.subtitle ?? "I hope today is the start of everything beautiful you deserve."}
						</p>
						{surprise?.url ? (
							<a
								href={surprise.url}
								target="_blank"
								rel="noreferrer"
								className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-rose-500 px-5 py-3 text-sm font-medium text-white shadow-[0_10px_24px_rgba(244,63,94,0.35)] transition hover:bg-rose-400"
							>
								<span aria-hidden>🎁</span> Open your gift
							</a>
						) : null}
					</motion.div>
				)}
			</AnimatePresence>
		</section>
	);
}
