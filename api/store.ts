export type User = { chatId: number; eduform?: string; course?: string; flow?: string; flowName?: string; notifyTimes: string[] };
const memory = new Map<number, User>();
function key(id: number) { return `rggu:user:${id}`; }
async function redis<T>(path: string): Promise<T | null> {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  const res = await fetch(`${url}/${path}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Store error ${res.status}`);
  return (await res.json() as { result: T }).result;
}
export async function getUser(chatId: number): Promise<User | undefined> { const value = await redis<string | null>(`get/${encodeURIComponent(key(chatId))}`); return value ? JSON.parse(value) : memory.get(chatId); }
export async function saveUser(user: User): Promise<void> { const payload = encodeURIComponent(JSON.stringify(user)); await redis(`set/${encodeURIComponent(key(user.chatId))}/${payload}`); memory.set(user.chatId, user); }
export async function allUsers(): Promise<User[]> { const keys = await redis<string[]>(`keys/${encodeURIComponent("rggu:user:*")}`); if (!keys) return [...memory.values()]; const result: User[] = []; for (const k of keys) { const v = await redis<string | null>(`get/${encodeURIComponent(k)}`); if (v) result.push(JSON.parse(v)); } return result; }
