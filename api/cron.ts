import { Telegraf } from "telegraf";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { allUsers } from "./store.js";
import { rggu } from "./rggu.js";
const bot = new Telegraf(process.env.BOT_TOKEN || "");
export default async function handler(req: VercelRequest, res: VercelResponse) { if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) return res.status(401).end(); const now = new Intl.DateTimeFormat("en-GB", { timeZone:"Europe/Moscow", hour:"2-digit", minute:"2-digit", hour12:false }).format(new Date()); let sent = 0; for (const u of await allUsers()) if (u.flow && u.notifyTimes.includes(now)) { const data = await rggu.schedule({ menuMode:"flow", flow:u.flow, eduform:u.eduform || "3", course:u.course || "1", intervalMode:"1" }); await bot.telegram.sendMessage(u.chatId, `🔔 ${now >= "19:00" ? "Tomorrow" : "Today"}\n\n${data.tblData?.[0] ? JSON.stringify(data.tblData[0]) : "No classes"}`); sent++; } return res.status(200).json({ ok:true, sent, time:now }); }
