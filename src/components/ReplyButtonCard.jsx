import { motion, useReducedMotion } from "framer-motion";
import { Heart, MessageCircle, Send } from "lucide-react";
import { formatExactMoment } from "../utils/dateUtils";

const replies = ["I miss you too", "I saw this", "Sending a hug", "Call me soon"];

const ReplyButtonCard = ({ reply, syncStatus, onSendReply, showToast }) => {
  const reduceMotion = useReducedMotion();

  const handleReply = (message) => {
    onSendReply(message);
    showToast(syncStatus === "synced" ? "Her reply is syncing back 💗" : "Her reply is saved here 💗");
  };

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.48, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-lg border border-white/75 bg-white/52 p-4 shadow-soft backdrop-blur-2xl xs:p-5 md:p-6"
      aria-labelledby="reply-title"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-lavender-200/75 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-cocoa-600">
            <MessageCircle size={14} aria-hidden="true" />
            Her reply
          </p>
          <h2 id="reply-title" className="mt-3 text-2xl font-black leading-tight text-cocoa-700">
            Swamini says
          </h2>
        </div>
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-blush-100 text-blush-500 shadow-soft">
          <Heart size={21} fill="currentColor" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-white/75 bg-white/62 p-4">
        {reply ? (
          <>
            <p className="text-lg font-black text-cocoa-700">{reply.message}</p>
            <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-blush-600/80">
              {formatExactMoment(reply.createdAt)}
            </p>
          </>
        ) : (
          <p className="text-sm font-bold leading-relaxed text-cocoa-600/78">
            Waiting for her little reply.
          </p>
        )}
      </div>

      <div className="mt-4 grid gap-2 xs:grid-cols-2">
        {replies.map((message) => (
          <button
            key={message}
            type="button"
            onClick={() => handleReply(message)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-blush-300/70 bg-white/58 px-3 text-sm font-black text-cocoa-600 shadow-soft outline-none transition hover:-translate-y-0.5 hover:text-blush-600 focus-visible:ring-2 focus-visible:ring-blush-400"
          >
            <Send size={15} aria-hidden="true" />
            {message}
          </button>
        ))}
      </div>
    </motion.section>
  );
};

export default ReplyButtonCard;
