import { createClient } from "@supabase/supabase-js";
import { normalizeMoments } from "./storage";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const coupleId = import.meta.env.VITE_COUPLE_ID || "raj-swamini";
const TABLE = "little_miss_counter";

let client;

export const isSupabaseSyncConfigured = () => Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const getClient = () => {
  if (!isSupabaseSyncConfigured()) return null;
  if (!client) client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return client;
};

const normalizeRow = (row) => ({
  exists: Boolean(row),
  moments: normalizeMoments(row?.moments || []),
  photo: typeof row?.photo === "string" ? row.photo : "",
  hasPhoto: row ? Object.prototype.hasOwnProperty.call(row, "photo") : false,
});

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

export const replaceSharedState = (moments, photo) => {
  const supabase = getClient();
  if (!supabase) return Promise.resolve();

  return supabase
    .from(TABLE)
    .upsert(
      {
        id: coupleId,
        moments: normalizeMoments(moments),
        photo: photo || "",
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

export const savePhotoToCloud = (photo) => {
  const supabase = getClient();
  if (!supabase) return Promise.resolve();

  return supabase
    .from(TABLE)
    .upsert(
      {
        id: coupleId,
        photo: photo || "",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )
    .then(({ error }) => {
      if (error) throw error;
    });
};
