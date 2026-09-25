import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { ensureDayUnlocked } from "@/lib/api/guards";
import { getDayContent, getSettings } from "@/lib/api/store";
import { verify, SECRET, ADMIN_COOKIE } from "@/lib/api/session";
import { DayThreeEnvelopes } from "@/components/birthday/day-three-envelopes";
import { ImageWithFallback } from "@/components/birthday/image-with-fallback";
import { DayTwoEnvelope } from "@/components/birthday/day-two-envelope";
import { MuseumOfYou } from "@/components/birthday/museum/page";
import { DayFiveScrapbookLetter } from "@/components/birthday/day-five-scrapbook-letter";
import Day3Experience from "./Day3Experience";
import DayUnlockGate from "./DayUnlockGate";
import FinalSurpriseExperience from "./FinalSurpriseExperience";
import { buildMediaUrl } from "@/lib/media";


const mediaUrl = buildMediaUrl;

const dayOneImages = [
	"Memory Card 01 — The Beginning (1).jpg",
	"Memory Card 01 — The Beginning (2).jpg",
	"Memory Card 01 — The Beginning (3).jpg",
	"Memory Card 01 — The Beginning (4).jpg",
	"MEMORY 01 - The Beginning.jpg",
];

const dayTwoImages = [
	"Scrapbook Photo Dump Collage Your Story.webp",
	"WhatsApp Image 2026-09-22 at 2.04.55 PM.jpeg",
	"WhatsApp Image 2026-09-22 at 3.19.04 PM.jpeg",
];

const dayTwoVideos = [
	"Brown Beige Vintage Scrapbook Thanks for Watching Video.mp4",
	"Brown Beige Vintage Scrapbook Thanks for Watching Video (1).mp4",
	"Brown Beige Vintage Scrapbook Thanks for Watching Video (2).mp4",
];

export default async function BirthdayDayPage({
	params,
	searchParams,
}: {
	params: Promise<{ dayNumber: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const { dayNumber: dayNumberString } = await params;
	const { preview } = await searchParams;
	const dayNumber = Number(dayNumberString);

	if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > 5) {
		notFound();
	}

	// Check if user is admin by validating admin session cookie
	let isAdmin = false;
	try {
		const cookieStore = await cookies();
		const adminCookie = cookieStore.get(ADMIN_COOKIE);
		if (adminCookie && (await verify(adminCookie.value, SECRET))) {
			isAdmin = true;
		}
	} catch {
		isAdmin = false;
	}

	const allowPreview = isAdmin && preview === 'true';

	const settings = getSettings();
	const content = getDayContent(dayNumber) as Record<string, unknown> | undefined;

	// The server-side guard is the single source of truth for unlock state.
	const serverResult = ensureDayUnlocked(dayNumber);

	if (serverResult.locked && !allowPreview) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#fdf3ea_0%,_#f3e6d6_32%,_#e7d8b9_100%)] px-4 py-10 text-stone-800">
				<div className="w-full max-w-xl rounded-[30px] border border-stone-200 bg-white/70 p-8 text-center shadow-[0_25px_60px_rgba(91,62,43,0.10)] backdrop-blur-sm">
					<p className="font-display text-2xl italic text-rose-500">
						day {dayNumber}
					</p>
					<h1 className="mt-4 font-display text-4xl text-stone-800">
						Locked for now
					</h1>
					<p className="mt-4 text-base leading-7 text-stone-600">
						{serverResult.teaser}
					</p>
					<Link
						href="/birthday"
						className="mt-6 inline-flex items-center justify-center rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-700"
					>
						Back to the journey
					</Link>
				</div>
			</main>
		);
	}

	const dayInfo = (serverResult as any).day ?? {
		title: `Day ${dayNumber}`,
		subtitle: "",
	};

	return (
		<DayUnlockGate dayNumber={dayNumber} isAdminPreview={allowPreview}>
			<main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fdf3ea_0%,_#f3e6d6_32%,_#e7d8b9_100%)] text-stone-800">
				<div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
					{allowPreview && (
						<div className="mb-6 rounded-[24px] border border-amber-300 bg-amber-50 p-4 text-center">
							<p className="text-sm font-medium text-amber-800">
								👁️ Admin Preview Mode — This day is locked for guests
							</p>
						</div>
					)}
					<header
						className={`mb-8 flex flex-col gap-4 rounded-[28px] border border-rose-200/70 bg-white/55 p-5 shadow-[0_20px_50px_rgba(91,62,43,0.08)] backdrop-blur-sm sm:p-8 ${
							dayNumber === 3 ? "hidden sm:block" : ""
						}`}
					>
						<div className="flex items-center justify-between gap-3">
							<p className="font-display text-lg italic text-rose-500">
								{settings.herName}&apos;s birthday journey
							</p>
							<Link
								href="/birthday"
								className="text-sm text-stone-600 underline decoration-stone-400 underline-offset-4"
							>
								Back to days
							</Link>
						</div>
						<div>
							<p className="text-xs uppercase tracking-[0.25em] text-stone-500">
								chapter {dayNumber}
							</p>
							<h1 className="mt-3 font-display text-4xl text-stone-800 sm:text-5xl">
								{dayInfo.title}
							</h1>
							<p className="mt-2 text-base text-stone-600">
								{dayInfo.subtitle}
							</p>
						</div>
					</header>

					{dayNumber === 1 && <DayOne content={content} />}
					{dayNumber === 2 && <DayTwo content={content} />}
					{dayNumber === 3 && <Day3Experience />}
					{dayNumber === 4 && <DayFour preview={Boolean(preview)} />}
					{dayNumber === 5 && <DayFive content={content} />}
				</div>
			</main>
		</DayUnlockGate>
	);
}

function DayOne({ content }: { content?: Record<string, unknown> }) {
	const welcomeMessage = String(
		content?.welcomeMessage ?? "Welcome to the beginning."
	);
	const timeline = Array.isArray(content?.timelineItems)
		? (content?.timelineItems as Array<{
				date?: string;
				title?: string;
				description?: string;
		  }>)
		: [];
	const featured = Array.isArray(content?.featuredMemories)
		? (content?.featuredMemories as Array<{ title?: string; description?: string }>)
		: [];
	const mystery = content?.mysteryQuestion as { question?: string; options?: Array<{ label?: string }> } | undefined;

	return (
		<div className="space-y-6">
			<section className="rounded-[30px] border border-stone-200 bg-white/75 p-6 shadow-[0_18px_40px_rgba(91,62,43,0.06)] sm:p-8">
				<p className="font-display text-2xl italic text-rose-500">Hey.</p>
				<p className="mt-5 text-lg leading-8 text-stone-700">
					{welcomeMessage}
				</p>
				<div className="mt-8 rounded-[24px] bg-gradient-to-r from-amber-50 via-rose-50 to-stone-50 p-6 text-center ring-1 ring-stone-200">
					<p className="text-xs uppercase tracking-[0.25em] text-amber-700">
						chapter 01
					</p>
					<h2 className="mt-3 font-display text-4xl text-stone-800">
						The Beginning
					</h2>
				</div>
			</section>

			<section className="rounded-[32px] border border-stone-300/50 bg-gradient-to-br from-[#fdf8f4] via-[#faf5f1] to-[#f5ede4] p-8 shadow-[0_25px_60px_rgba(91,62,43,0.12)] sm:p-10">
				<div className="mb-8 flex items-end justify-between gap-3">
					<div>
						<p className="font-display text-5xl text-stone-800">Featured memory</p>
					</div>
					<p className="text-xs uppercase tracking-[0.3em] font-semibold text-rose-600">
						{featured.length > 0 ? `${featured.length} moments` : "a memory"}
					</p>
				</div>

				{/* Compact 5-Card Grid Layout */}
				<div className="grid gap-4 md:gap-5 lg:grid-cols-3">
					{/* Featured Card - Left Column, Spans 2 Rows */}
					<div className="group relative overflow-hidden rounded-[24px] border-2 border-stone-200/60 bg-white shadow-[0_28px_56px_rgba(91,62,43,0.15)] lg:row-span-2">
						<div className="relative h-64 overflow-hidden bg-stone-100 md:h-80 lg:h-[420px]">
							<ImageWithFallback
								src={mediaUrl("day-1", dayOneImages[0])}
								alt="Featured memory from the beginning"
								width={1200}
								height={960}
								className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
								priority={true}
							/>
						</div>
						<div className="border-t-2 border-stone-200/50 bg-gradient-to-br from-[#f7efe8] to-[#f2e8df] px-5 py-4">
							<p className="text-[10px] uppercase tracking-[0.3em] font-bold text-rose-500">memory 01</p>
							<h4 className="mt-2 font-display text-2xl text-stone-800">The Beginning</h4>
							<p className="mt-3 text-sm leading-6 text-stone-700">
								{featured[0]?.description ?? "Sometimes, the beginning is quiet. But it stays with you longer than you expect."}
							</p>
						</div>
					</div>

					{/* Right Side - 4 Cards in 2x2 Grid */}
					<div className="grid gap-4 md:gap-5 lg:col-span-2 lg:grid-cols-2">
						{dayOneImages.slice(1).map((image, index) => (
							<div
								key={`${image}-${index}`}
								className="group relative overflow-hidden rounded-[20px] border-2 border-stone-200/60 bg-white shadow-[0_18px_40px_rgba(91,62,43,0.1)] transition-all hover:shadow-[0_24px_48px_rgba(91,62,43,0.15)]"
							>
								<div className="relative h-40 overflow-hidden bg-stone-100 md:h-48">
									<ImageWithFallback
										src={mediaUrl("day-1", image)}
										alt={`Beginning memory ${index + 2}`}
										width={800}
										height={640}
										className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
										loading="lazy"
									/>
								</div>
								<div className="border-t-2 border-stone-200/50 bg-gradient-to-r from-[#f8f2ea] to-[#f4ede4] px-4 py-3">
									<p className="text-[9px] uppercase tracking-[0.25em] font-bold text-rose-500">memory {index + 2}</p>
									<p className="mt-1 text-xs text-stone-600">The Beginning</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="rounded-[30px] border border-stone-200 bg-white/75 p-6 shadow-[0_18px_40px_rgba(91,62,43,0.06)] sm:p-8">
				<h3 className="font-display text-4xl text-stone-800">
					Our story, in chapters
				</h3>
				<div className="mt-8 space-y-8">
					{timeline.length > 0 ? (
						timeline.map((item, index) => (
							<div
								key={`${item.title ?? "memory-"}${index}`}
								className="grid gap-6 rounded-[28px] border border-stone-200 bg-gradient-to-br from-stone-50/80 to-amber-50/40 p-6 shadow-[0_16px_32px_rgba(91,62,43,0.06)] md:grid-cols-[1fr_1.2fr]"
							>
								<div className="order-2 flex flex-col justify-center md:order-1">
									<p className="text-xs uppercase tracking-[0.25em] font-semibold text-rose-600">
										{item.date ?? "a memory"}
									</p>
									<h4 className="mt-3 font-display text-3xl text-stone-800">
										{item.title ?? "A little chapter"}
									</h4>
									<p className="mt-4 text-base leading-8 text-stone-700 whitespace-pre-wrap">
										{item.description ?? "A memory we keep close."}
									</p>
								</div>
								<div className="order-1 overflow-hidden rounded-[24px] border border-stone-200 bg-stone-50 shadow-lg md:order-2">
									<ImageWithFallback
										src={mediaUrl("day-1", dayOneImages[Math.min(index, dayOneImages.length - 1)])}
										alt={`Chapter ${index + 1}: ${item.title}`}
										width={1000}
										height={800}
										className="h-72 w-full object-cover sm:h-96"
										loading="lazy"
									/>
								</div>
							</div>
						))
					) : (
						<p className="text-stone-600">
							The timeline is waiting for its first memory.
						</p>
					)}
				</div>
			</section>

			<section className="rounded-[30px] border border-rose-200 bg-gradient-to-r from-rose-50 via-amber-50 to-stone-50 p-6 shadow-[0_18px_40px_rgba(91,62,43,0.08)] sm:p-8">
				<div className="text-center">
					<p className="font-display text-2xl italic text-rose-500">✨ A little reminder...</p>
					<p className="mt-4 text-lg leading-8 text-stone-700">
						This is only the start.
					</p>
					<p className="mt-2 text-base text-stone-600">
						Every day comes with a new gift. Keep scrolling — there&apos;s so much more ahead. 🎁
					</p>
				</div>
			</section>
		</div>
	);
}

function DayTwo({ content }: { content?: Record<string, unknown> }) {
	const memories = Array.isArray(content?.memories)
		? (content?.memories as Array<{ title?: string; description?: string }>)
		: [];
	
	const message = typeof content?.message === "string" 
		? content.message 
		: "You mean so much to me, and every moment with you is a treasure I hold close to my heart.";

	return (
		<div className="space-y-0">
			{/* INTRO SECTION */}
			<section className="rounded-[32px] border border-stone-300/50 bg-gradient-to-br from-[#fdf8f4] via-[#faf5f1] to-[#f5ede4] p-8 shadow-[0_25px_60px_rgba(91,62,43,0.12)] sm:p-10 mb-16">
				<div className="max-w-2xl">
					<p className="text-xs uppercase tracking-[0.3em] font-bold text-rose-600">day two</p>
					<h2 className="mt-4 font-display text-6xl text-stone-800">The Memory Vault</h2>
					<p className="mt-6 text-xl leading-8 text-stone-700">
						A collection of moments that mean everything to me. Scroll through to relive the memories we&apos;ve created together.
					</p>
				</div>
			</section>

			{/* PHOTO MEMORIES - ONE BY ONE WITH LEFT IMAGE + RIGHT DESCRIPTION */}
			{dayTwoImages.map((image, index) => (
				<div key={`memory-${index}`} className="mb-20 scroll-mt-8">
					<div className="grid gap-8 lg:grid-cols-2 items-center">
						{/* Image */}
						<div className="order-1 lg:order-1">
							<div className="relative overflow-hidden rounded-[24px] border-2 border-stone-200/60 bg-stone-100 shadow-[0_28px_56px_rgba(91,62,43,0.15)]">
								<div className="relative h-96 lg:h-[500px] w-full">
									<ImageWithFallback
										src={mediaUrl("day-2", image)}
										alt={`Memory ${index + 1}`}
										width={1000}
										height={1000}
										className="w-full h-full object-cover"
										loading="lazy"
									/>
								</div>
							</div>
						</div>

						{/* Description */}
						<div className="order-2 lg:order-2">
							<div className="space-y-6">
								<div>
									<p className="text-xs uppercase tracking-[0.3em] font-bold text-rose-600">memory {index + 1}</p>
									<h3 className="mt-4 font-display text-4xl text-stone-800">
										{memories[index]?.title ?? "A Moment We Cherish"}
									</h3>
								</div>
								<p className="text-lg leading-8 text-stone-700">
									{memories[index]?.description ?? "This moment captures the essence of us. The laughter, the connection, the feeling of being truly understood by someone."}
								</p>
							</div>
						</div>
					</div>
				</div>
			))}

			{/* LITTLE MOMENTS - VIDEO SECTION */}
			<section className="my-20 rounded-[32px] border border-stone-300/50 bg-gradient-to-br from-[#faf5f1] via-[#f5ede4] to-[#f0e8df] p-8 shadow-[0_25px_60px_rgba(91,62,43,0.12)] sm:p-10">
				<div className="mb-12">
					<p className="text-xs uppercase tracking-[0.3em] font-bold text-rose-600">little moments</p>
					<h3 className="mt-4 font-display text-5xl text-stone-800">Moments in Motion</h3>
					<p className="mt-4 text-lg text-stone-700">Videos that capture the essence of us</p>
				</div>

				<div className="space-y-8">
					{dayTwoVideos.map((videoName, index) => (
						<div key={`video-${index}`} className="overflow-hidden rounded-[24px] border-2 border-stone-200/60 shadow-[0_18px_40px_rgba(91,62,43,0.1)]">
							<video
								controls
								preload="metadata"
								playsInline
								className="w-full h-auto max-h-96 bg-stone-900 object-cover"
								poster={mediaUrl("day-2", dayTwoImages[0])}
							>
								<source src={mediaUrl("day-2/optimized", videoName)} type="video/mp4" />
							</video>
						</div>
					))}
				</div>
			</section>

			{/* ENVELOPE TEASER */}
			<section className="my-20 text-center">
				<p className="text-lg text-stone-700 mb-8">There is one more thing...</p>
				<div className="inline-block animate-bounce">
					<div className="text-6xl">✉️</div>
				</div>
			</section>

			{/* SEALED ENVELOPE - CLICKABLE */}
			<DayTwoEnvelope message={message} />

			{/* DAY 2 COMPLETION */}
			<section className="my-20 rounded-[32px] border border-stone-300/50 bg-gradient-to-br from-[#fdf8f4] via-[#faf5f1] to-[#f5ede4] p-8 shadow-[0_25px_60px_rgba(91,62,43,0.12)] sm:p-10 text-center">
				<h3 className="font-display text-5xl text-stone-800">Day 2 Complete ✓</h3>
				<p className="mt-4 text-lg text-stone-700">You&apos;ve seen the memories. You&apos;ve felt the moments. Thank you for being part of my story.</p>
			</section>

			{/* DAY 3 TEASER */}
			<section className="my-20 rounded-[32px] border-2 border-dashed border-amber-400/50 bg-gradient-to-br from-amber-50/50 to-rose-50/50 p-8 sm:p-10 text-center">
				<p className="text-xs uppercase tracking-[0.3em] font-bold text-amber-700 mb-4">coming next</p>
				<h4 className="font-display text-4xl text-stone-800">Day 3 Awaits</h4>
				<p className="mt-4 text-lg text-stone-700">Things I Never Said</p>
			</section>
		</div>
	);
}

function DayFour({ preview }: { preview?: boolean }) {
	return <MuseumOfYou preview={preview} />;
}

function DayFive({ content }: { content?: Record<string, unknown> }) {
	const finalIntroLines = Array.isArray(content?.finalIntroLines)
		? (content?.finalIntroLines as string[])
		: [];
	const finalLetter = content?.finalLetter as { title?: string; content?: string; signature?: string } | undefined;
	const finalSurprise = content?.finalSurprise as { title?: string; content?: string; url?: string; type?: string } | undefined;
	const birthdayReveal = content?.birthdayReveal as { title?: string; subtitle?: string } | undefined;
	const finalVideo = content?.finalVideo as { title?: string; url?: string; thumbnailUrl?: string } | undefined;

	return (
		<div className="space-y-6">
			<DayFiveScrapbookLetter />

			<section className="rounded-[30px] border border-stone-200 bg-white/75 p-6 shadow-[0_18px_40px_rgba(91,62,43,0.06)] sm:p-8">
				<div className="rounded-[24px] border border-rose-200 bg-rose-50 p-5">
					<p className="text-[10px] uppercase tracking-[0.25em] text-rose-500">birthday reveal</p>
					<h3 className="mt-3 font-display text-4xl text-stone-800">{birthdayReveal?.title ?? "HAPPY BIRTHDAY, KESAR ❤️"}</h3>
					<p className="mt-3 text-base leading-7 text-stone-700">{birthdayReveal?.subtitle ?? "I hope today is the start of everything beautiful you deserve."}</p>
				</div>
			</section>

			<section className="rounded-[30px] border border-stone-200 bg-white/75 p-6 shadow-[0_18px_40px_rgba(91,62,43,0.06)] sm:p-8">
				<h3 className="font-display text-3xl text-stone-800">The note I wanted to leave you</h3>
				<div className="mt-6 rounded-[24px] border border-rose-200 bg-rose-50 p-5">
					<p className="text-[10px] uppercase tracking-[0.22em] text-rose-500">final note</p>
					<h4 className="mt-3 font-display text-3xl text-stone-800">{finalLetter?.title ?? "One last thing..."}</h4>
					<p className="mt-4 whitespace-pre-line text-sm leading-7 text-stone-700">
						{finalLetter?.content ?? "You are loved, deeply and quietly, in all the ways that matter."}
					</p>
					<p className="mt-5 text-right font-display text-xl italic text-stone-700">
						{finalLetter?.signature ?? "With love"}
					</p>
				</div>
			</section>


			<section className="rounded-[30px] border border-rose-200 bg-[radial-gradient(circle_at_top,_#fff1f3_0%,_#fffaf8_60%,_#f6e9e2_100%)] p-6 shadow-[0_18px_40px_rgba(91,62,43,0.06)] sm:p-8">
				<p className="text-[10px] uppercase tracking-[0.25em] text-rose-500">final surprise</p>
				<h3 className="mt-3 font-display text-3xl text-stone-800">{finalSurprise?.title ?? "Your final surprise"}</h3>
				<p className="mt-3 text-base leading-7 text-stone-700">{finalSurprise?.content ?? "Click below to open the last little gift I prepared for you."}</p>

				<FinalSurpriseExperience
					title={finalSurprise?.title}
					content={finalSurprise?.content}
					finalVideo={
						finalVideo
							? {
									title: finalVideo.title,
									url: finalVideo.url,
									thumbnailUrl:
										finalVideo.thumbnailUrl ??
										mediaUrl("day-2", dayTwoImages[0]),
								}
							: undefined
					}
					extraGiftUrl={
						finalSurprise?.url && finalSurprise.url !== "https://example.com"
							? finalSurprise.url
							: null
					}
				/>
			</section>
		</div>
	);
}
