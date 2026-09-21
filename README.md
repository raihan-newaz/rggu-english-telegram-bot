# RGGU English Telegram Bot

English Telegram bot for RGGU schedules, based on the public RGGU schedule API.

## Deploy to Vercel

1. Import this folder as a Vercel project.
2. Set these environment variables:
   - `BOT_TOKEN`: the token from BotFather
   - `KV_REST_API_URL` and `KV_REST_API_TOKEN`: Vercel KV/Upstash REST credentials
   - `CRON_SECRET`: a random value used to protect the cron endpoint
3. Deploy.
4. Register the Telegram webhook once:

   `https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://<your-project>.vercel.app/api/webhook`

The webhook endpoint is `/api/webhook`; scheduled notifications run through `/api/cron`. The repository uses a daily Vercel Hobby-compatible cron. Exact multiple daily notification times require Vercel Pro or an external cron service.

Without KV variables, the bot falls back to in-memory storage for local testing. Production should always use KV because Vercel functions are stateless.
