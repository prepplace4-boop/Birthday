"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function DayTwoEnvelope({ message }: { message: string }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<section className="my-20 flex flex-col items-center justify-center">
			<AnimatePresence mode="wait">
				{!isOpen ? (
					// SEALED ENVELOPE
					<motion.div
						key="envelope-closed"
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0, opacity: 0 }}
						transition={{ duration: 0.6 }}
						onClick={() => setIsOpen(true)}
						className="w-full max-w-md cursor-pointer"
					>
						{/* Envelope Container */}
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.98 }}
							className="group"
						>
							{/* Envelope Outer */}
							<div className="rounded-[20px] border-2 border-stone-300 bg-gradient-to-b from-stone-100 to-stone-50 shadow-[0_20px_50px_rgba(91,62,43,0.2)] overflow-hidden">
								{/* Envelope Body */}
								<div className="aspect-video flex flex-col items-center justify-center px-8 py-12">
									{/* Front Flap */}
									<motion.div
										initial={{ rotateX: 0 }}
										whileHover={{ rotateX: -15 }}
										transition={{ duration: 0.3 }}
										className="w-full"
										style={{ perspective: "1000px" }}
									>
										<div className="bg-white border-2 border-stone-200 rounded-t-[16px] p-8 text-center shadow-[0_10px_20px_rgba(91,62,43,0.1)]">
											<p className="text-xs uppercase tracking-[0.2em] font-bold text-rose-600 mb-3">
												FOR YOUR EYES ONLY
											</p>
											<p className="text-2xl text-stone-800 font-display">✉️</p>
										</div>
									</motion.div>

									{/* Back Flap */}
									<div className="w-full bg-gradient-to-b from-stone-200 to-stone-100 border-2 border-t-0 border-stone-200 rounded-b-[16px] p-6 text-center">
										<p className="text-sm text-stone-600">Tap to open</p>
									</div>
								</div>
							</div>
						</motion.div>

						{/* Instruction Text */}
						<motion.p
							animate={{ y: [0, 8, 0] }}
							transition={{ duration: 2, repeat: Infinity }}
							className="text-center text-stone-600 mt-8 text-sm"
						>
							Click to open
						</motion.p>
					</motion.div>
				) : (
					// OPENED ENVELOPE WITH MESSAGE
					<motion.div
						key="envelope-open"
						initial={{ scale: 0, rotateY: 180, opacity: 0 }}
						animate={{ scale: 1, rotateY: 0, opacity: 1 }}
						exit={{ scale: 0, rotateY: 180, opacity: 0 }}
						transition={{ duration: 0.8 }}
						className="w-full max-w-2xl"
					>
						{/* Letter Content */}
						<div className="rounded-[24px] border-2 border-stone-300 bg-gradient-to-br from-[#fffbf8] via-[#faf5f1] to-[#f5ede4] shadow-[0_30px_70px_rgba(91,62,43,0.25)] p-12 md:p-16">
							{/* Header */}
							<div className="text-center mb-12">
								<p className="text-xs uppercase tracking-[0.3em] font-bold text-rose-600">A message</p>
								<h3 className="mt-4 font-display text-4xl text-stone-800">Just for You</h3>
							</div>

							{/* Message */}
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3, duration: 0.6 }}
							>
								<p className="text-center text-xl leading-10 text-stone-800 font-serif italic">
								&ldquo;{message}&rdquo;
								</p>
							</motion.div>

							{/* Footer */}
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.6, duration: 0.6 }}
								className="mt-12 text-center pt-8 border-t border-stone-300/50"
							>
								<p className="text-sm text-stone-600">With all my love</p>
								<p className="text-2xl mt-3">💫</p>
							</motion.div>

							{/* Close Button */}
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setIsOpen(false)}
								className="mt-10 w-full py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-[12px] font-semibold text-sm uppercase tracking-[0.1em] shadow-[0_8px_20px_rgba(244,63,94,0.3)] hover:shadow-[0_12px_28px_rgba(244,63,94,0.4)] transition-all"
							>
								Close Letter
							</motion.button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</section>
	);
}
