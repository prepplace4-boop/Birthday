'use client';

import { useState } from 'react';

interface Letter {
	title?: string;
	message?: string;
}

export function DayThreeEnvelopes({ letters }: { letters: Letter[] }) {
	const [openedIds, setOpenedIds] = useState<Set<number>>(new Set());
	const [openedCount, setOpenedCount] = useState(0);

	const toggleEnvelope = (index: number) => {
		const newOpened = new Set(openedIds);
		if (newOpened.has(index)) {
			newOpened.delete(index);
			setOpenedCount(openedCount - 1);
		} else {
			newOpened.add(index);
			setOpenedCount(openedCount + 1);
		}
		setOpenedIds(newOpened);
	};

	return (
		<div className="space-y-4">
			<div className="mb-6 text-center">
				<p className="text-xs uppercase tracking-[0.25em] font-semibold text-stone-500">
					{openedCount} of {letters.length} opened
				</p>
				<div className="mt-2 h-1.5 w-full max-w-xs rounded-full bg-stone-200 mx-auto overflow-hidden">
					<div
						className="h-full bg-rose-500 transition-all duration-300"
						style={{ width: `${(openedCount / letters.length) * 100}%` }}
					/>
				</div>
			</div>

			{letters.map((letter, index) => (
				<button
					key={index}
					onClick={() => toggleEnvelope(index)}
					className="w-full text-left transition-all duration-300"
				>
					<div
						className={`rounded-[24px] border-2 border-stone-200/60 bg-gradient-to-br from-[#fdf8f4] to-[#f5ede4] p-5 shadow-[0_16px_32px_rgba(91,62,43,0.08)] transition-all hover:shadow-[0_20px_40px_rgba(91,62,43,0.12)] ${
							openedIds.has(index) ? 'ring-2 ring-rose-300' : ''
						}`}
					>
						<div className="flex items-start gap-4">
							<div className="flex-shrink-0">
								<div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-rose-600 text-white font-semibold shadow-md">
									{index + 1}
								</div>
							</div>
							<div className="flex-1 min-w-0">
								<h3 className="font-display text-lg text-stone-800">{letter.title}</h3>
								<p className="mt-1 text-xs uppercase tracking-[0.2em] text-stone-500">
									{openedIds.has(index) ? 'tap to close' : 'tap to open'}
								</p>
							</div>
							<div className="flex-shrink-0 text-stone-500 transition-transform duration-300" style={{
								transform: openedIds.has(index) ? 'rotate(180deg)' : 'rotate(0deg)'
							}}>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<path d="M6 9l6 6 6-6" />
								</svg>
							</div>
						</div>

						{openedIds.has(index) && (
							<div className="mt-5 border-t-2 border-stone-200/50 pt-5">
								<p className="text-base leading-8 text-stone-800">
									{letter.message}
								</p>
							</div>
						)}
					</div>
				</button>
			))}

			<div className="mt-8 rounded-[24px] border-2 border-rose-200/50 bg-gradient-to-r from-rose-50 via-amber-50 to-stone-50 p-6 text-center">
				<p className="font-display text-lg italic text-rose-500">✨ A little reminder...</p>
				<p className="mt-3 text-base leading-7 text-stone-700">
					Kept for myself, until now.
				</p>
			</div>
		</div>
	);
}
