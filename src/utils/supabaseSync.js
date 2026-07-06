import { createClient } from "@supabase/supabase-js";
import { normalizeMoments, normalizeSharedState } from "./storage";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const coupleId = import.meta.env.VITE_COUPLE_ID || "raj-swamini";
const TABLE = "little_miss_counter";
const SHARED_PAYLOAD_TYPE = "little-miss-counter-shared-v1";

let client;

export const isSupabaseSyncConfigured = () => Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const getClient = () => {
  if (!isSupabaseSyncConfigured()) return null;
  if (!client) client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return client;
};

const encodeSharedPayload = (sharedState) =>
  JSON.stringify({
    type: SHARED_PAYLOAD_TYPE,
    ...normalizeSharedState(sharedState),
  });

const decodeSharedPayload = (payload) => {
  if (typeof payload !== "string" || !payload) return normalizeSharedState();

  try {
    const parsed = JSON.parse(payload);
    if (parsed?.type === SHARED_PAYLOAD_TYPE) return normalizeSharedState(parsed);
  } catch {
    return normalizeSharedState({ photo: payload });
  }

  return normalizeSharedState({ photo: payload });
};

const normalizeRow = (row) => {
  const sharedState = decodeSharedPayload(row?.photo);

  return {
    exists: Boolean(row),
    moments: normalizeMoments(row?.moments || []),
    sharedState,
    photo: sharedState.photo,
    note: sharedState.note,
    reply: sharedState.reply,
    countdown: sharedState.countdown,
    hasSharedState: row ? Object.prototype.hasOwnProperty.call(row, "photo") : false,
  };
};

export const subscribeToSharedState = (onData, onError) => {
  const supabase = getClient();
  if (!supabase) return null;

  supabase
    .from(TABLE)
    .select("moments, photo")
    .eq("id", coupleId)
    .maybeSingle()
    .then(({ data, error }) => {
      if (error) onError?.(error);
      else onData(normalizeRow(data));
    });

  const channel = supabase
    .channel(`little-miss-counter-${coupleId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: TABLE,
        filter: `id=eq.${coupleId}`,
      },
      (payload) => onData(normalizeRow(payload.new)),
    )
    .subscribe((status) => {
      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") onError?.(new Error(status));
    });

  return () => supabase.removeChannel(channel);
};

export const replaceSharedState = (moments, sharedState) => {
  const supabase = getClient();
  if (!supabase) return Promise.resolve();

  const normalizedSharedState =
    typeof sharedState === "string" ? normalizeSharedState({ photo: sharedState }) : normalizeSharedState(sharedState);

  return supabase
    .from(TABLE)
    .upsert(
      {
        id: coupleId,
        moments: normalizeMoments(moments),
        photo: encodeSharedPayload(normalizedSharedState),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )
    .then(({ error }) => {
      if (error) throw error;
    });
};

export const replaceMomentsInCloud = (moments) => {
  const supabase = getClient();
  if (!supabase) return Promise.resolve();

  return supabase
    .from(TABLE)
    .upsert(
      {
        id: coupleId,
        moments: normalizeMoments(moments),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )
    .then(({ error }) => {
      if (error) throw error;
    });
};

export const saveSharedStateToCloud = (sharedState) => {
  const supabase = getClient();
  if (!supabase) return Promise.resolve();

  return supabase
    .from(TABLE)
    .upsert(
      {
        id: coupleId,
        photo: encodeSharedPayload(sharedState),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )
    .then(({ error }) => {
      if (error) throw error;
    });
};
