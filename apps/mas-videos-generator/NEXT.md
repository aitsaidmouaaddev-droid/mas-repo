# mas-videos-generator — Roadmap & Remaining Work

## In Progress / Current

- ✅ Full pipeline: Claude generate → email approve → TTS → fal.ai Wan 2.1 → Remotion composite → YouTube upload
- ✅ Back-office (BO): Subjects, Jobs, Logs pages with live refresh
- ✅ Manual pipeline trigger from BO (bypass cron)
- ✅ Retry per step (generate / render / upload) from BO
- ✅ Job output cleanup on success and render failure
- ✅ SRT subtitle upload to YouTube as caption tracks (en, fr, ar)
- ✅ Render progress logged live in BO Logs page
- ✅ Weekly cron: Saturday 21:00

---

## Deferred — Small / Medium

### Claude auto-retry on JSON parse failure

Auto-retry `ClaudeService.generate` up to 2 times before marking job FAILED.
Wrap `callClaude` + `extractJson` in a retry loop, log each attempt as WARN to `job_logs`.

### Toast notifications + SFX on job status change

In the BO Jobs page, diff job statuses between 5s polls and show a toast + play a sound effect per transition.
Use `@mas/react-ui` Toast component. Different sound per severity (success / warn / error).
Key statuses to notify: `draft_generating`, `awaiting_review`, `approved`, `rendering`, `done`, `failed`.

### Clear storage button in BO

Button per job (or global "purge") that calls a `clearJobOutput(jobId)` mutation.
Deletes `output/jobs/<jobId>/` folder and soft-deletes asset records.
Useful for manually freeing disk space before auto-cleanup triggers.

### Improve email command parser robustness

Current `parseCommand` handles `*REVISE:` (bold markdown). Keep testing edge cases:

- `**APPROVE**` (double bold)
- `Re: APPROVE` (email subject bleed)
- Multi-line commands from mobile clients

---

## Deferred — Large

### Stats / Bar Chart Race video type

A second video pipeline for "statistics over time" videos (bar chart race style).

**Concept:**

- Claude generates the data: topic, time range, entities (countries/teams/channels/etc.), values per year, colours, logos/flags descriptions
- Same email approval flow as the main pipeline (propose → approve / revise / skip)
- Separate render pipeline using Remotion's `interpolate()` + animated bar chart components
- Claude provides: entity names, colours, logo descriptions, data points per year, chart title, axis labels, narration script
- Remotion renders the animation natively (no fal.ai needed — pure code animation)
- Upload to YouTube with auto-generated title/description/tags

**New entities needed:**

- `StatsJob` — parallel to `VideoJob`
- `StatsVersion` — data payload with time-series values
- `StatsSubject` — topic, time range, data source hint, platforms

**Example topics:**

- "Morocco football ranking 2000–2025"
- "Top 10 African economies GDP 1990–2024"
- "Most streamed artists on Spotify by year"

**Pipeline differences vs standard video:**

- No fal.ai / Wan AI video generation — pure Remotion code animation (bar chart race components)
- Remotion renders the chart animation natively using `interpolate()` + animated bars
- TTS narration still applies (voice-over describing the stats story)
- SRT subtitles still apply

**Email approval flow:**

- Same cron + trigger email logic as standard subjects
- Same APPROVE / SKIP / REVISE reply commands
- Separate email template showing the proposed data (entities, time range, chart type, data points preview)

**Back-office (BO) — Stats page:**

- New `/stats` route and nav link (alongside Subjects, Jobs, Logs)
- `StatsSubjectListPage` — list/create/edit stats subjects, manual trigger button
- Stats jobs and logs appear in the existing **Jobs** and **Logs** pages (shared views)
- Add a `jobType` column to the Jobs table: `video | stats` — allows filtering and makes it clear which pipeline each job belongs to
- `jobType` field added to `VideoJob` entity (or unified `Job` entity) with a DB migration

**BO changes needed:**

- Add `jobType: 'video' | 'stats'` column to `video_jobs` table (migration required)
- Jobs page: add `Type` column showing `video` or `stats` badge, add filter dropdown
- Logs page: no changes needed (logs are already job-agnostic)
- New `StatsSubjectListPage` with same CRUD + trigger pattern as `SubjectListPage`
- Nav: add `Stats` link between `Subjects` and `Jobs`

---

## Deferred — Infrastructure / DevOps

### Docker image for production (Azure)

- Base image needs Chromium for Remotion renderer
- Install: `chromium`, `fonts-noto-color-emoji`, run `npx remotion browser ensure`
- `output/` dir is ephemeral (correct — files deleted after upload)
- Model weights not needed (fal.ai is remote)
- Add `FAL_API_KEY` and all secrets to Azure App Service config (see `project_azure_secrets.md` in memory)

### Production redirect URI for Google OAuth2

Add the Azure production URL to Google OAuth2 credentials before going live.
See `project_gmail_oauth_prod_uri.md` in memory.

---

---

## Deferred — Daily Trending Subject Discovery

### Daily email digest of trending topic suggestions

A daily cron (e.g. 8:00 AM) that:

1. **Fetches trending signals** — scrape/query one or more sources:
   - Google Trends API or RSS
   - YouTube Trending (Data API v3 `videos.list` with `chart=mostPopular`)
   - NewsAPI / GNews for hot headlines
   - Twitter/X trends (if API access available)

2. **Sends Claude the raw trends** — asks it to propose:
   - 3–5 **video subject** ideas (narrative/storytelling format, fits existing `Subject` entity)
   - 2–3 **stats subject** ideas (bar chart race format, fits future `StatsSubject` entity)
   - For each: topic, angle, why it's relevant now, suggested `targetPlatforms`, `voiceLanguage`, `priority`

3. **Sends you a daily digest email** — one email listing all suggestions with a summary per idea

4. **You reply to approve** — reply format:
   - `ADD VIDEO 1,3` → adds suggestions 1 and 3 as `Subject` records (status: pending)
   - `ADD STATS 2` → adds suggestion 2 as a `StatsSubject` record
   - `ADD ALL` → adds everything
   - No reply = nothing added (fully opt-in)

5. **System parses reply and inserts records** — same inbound email polling loop as the review flow

**New pieces needed:**

- `TrendingService` — fetches raw trending data from configured sources
- `SuggestionService` — sends to Claude, formats digest email, parses reply
- `SuggestionJob` entity — stores daily suggestions + approval status for traceability
- Cron target: `0 8 * * *` (daily 8 AM)
- New env vars: `NEWSAPI_KEY`, `GOOGLE_TRENDS_*` (or equivalent)

---

## Ideas / Backlog

- **Shorts generation**: use `shortsPlan` from `VideoJobData` to auto-generate vertical clips per video
- **Thumbnail generation**: use `thumbnailConfig.prompt` with an image generation API (DALL-E 3 / fal.ai flux) to auto-generate YouTube thumbnails
- **Self-hosted Wan 2.1** on Azure GPU VM (NC4as T4) when volume exceeds ~10 videos/week (~$7/video vs $2-4 on fal.ai)
- **Multi-subject weekly batch**: pick top N subjects instead of 1, run N pipelines in parallel
- **YouTube analytics webhook**: receive YouTube upload confirmation and view count milestones
- **Subject auto-suggestion**: Claude proposes new subjects based on trending topics (news API or YouTube trending)
