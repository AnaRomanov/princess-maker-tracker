Life Maker — Curated Jobs v6

Live at: https://princess-maker-tracker.vercel.app

8 jobs available: Housework, Woodworking Workshop, Botanical Garden, Clothing Store, Academy, Maid Cafe, Checkpoint and Tavern. All 10 classes and Free Time remain.

Restaurant, Tutor, Ranch, Infirmary, Fruit Warehouse, Blacksmith and Waterfront have been fully decommissioned: removed from the code, not just retired. Any block still referencing one of them will no longer render, score, or count toward stats, gold or stress.

Syncing across devices:
- Sign in with your email (enter the 6-digit code from the email, or use the link) to sync your progress to the cloud via Supabase. Signed-in progress is available on any device, at any URL.
- If you don't sign in, progress is saved only to that browser's local storage (key: lifemaker.v3) and won't follow you to another device or browser.
- Data is stored in a single Supabase table (game_state), one row per user, protected by row-level security so only you can read or write your own row.

Running it locally (Next.js):
- `npm install`, then copy `.env.local.example` to `.env.local` and fill in your Supabase project URL and anon key.
- `npm run dev` and open http://localhost:3000.
- Cloud sign-in requires the dev server's URL to be added to Supabase's Authentication > URL Configuration > Redirect URLs allow-list; without it, sign-in emails will fail to redirect back.
- Game-design data (activities, stats, ranks, economy constants) lives in `lib/gameConfig.js`, separate from the UI code in `components/`.

Compatibility:
- Woodworking Workshop and Botanical Garden changed their stat rules in v6; plans made under the old rules keep scoring against them until replanned.
- This update does not change gold rewards, scores, or rules for the eight continuing jobs.

Gold is an in-game reward, not actual income.
