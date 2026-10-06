# Content and build connector architecture

The private Content Studio separates three kinds of evidence:

1. A local build-time snapshot for private facts and archived observations.
2. YouTube owner analytics through server-side OAuth.
3. TikTok profile and video statistics through server-side OAuth, supplemented
   by dated manual readings for metrics the creator API does not provide.

No provider secret belongs in the Vite bundle. The connector service is hosted
behind the existing Human Repo bridge. The Control Plane exchanges the bridge
password for a signed 30-day device token; the password itself is not stored by
the frontend. Provider client secrets and refresh tokens are encrypted with a
key derived from the bridge session secret before PostgreSQL persistence.

## YouTube

The Data API supplies the channel, uploads playlist, and public video
statistics. The YouTube Analytics API supplies owner-only views, watch time,
average duration, average percentage viewed, subscriber movement, engagement,
and revenue where eligible. OAuth requests offline access so the server can
refresh daily while the owner is absent. Content Studio also exposes an
explicit refresh action.

For an existing Google "Desktop app" OAuth credential, bootstrap the encrypted
server connector once from the owner's Mac:

```bash
npm run connect:youtube -- /path/to/client_secret.json
```

The local callback requests only `youtube.readonly` and
`yt-analytics.readonly`, sends the resulting refresh grant directly over SSH to
the private bridge, and never writes the token into the repository or browser.
The server then owns all daily refreshes; the Mac can be off.

## TikTok

The TikTok Display API can provide authorized user totals and paginated video
records with views, likes, comments, and shares. TikTok requires a developer
app, Login Kit, and approval for `user.info.stats` and `video.list`. Retention,
traffic sources, and some monetization fields still require exports.

Google result snippets are deliberately not treated as TikTok analytics. Their
counts can be cached, rounded, and detached from the account's actual
observation time. Until API approval, the dashboard's account and per-video
numbers remain editable. They persist on the current device immediately and in
PostgreSQL across devices after the private bridge is unlocked.

## Build activity

Public repository activity is generated every morning by a scheduled GitHub
Action and published as a safe aggregate JSON snapshot. The dashboard loads it
at runtime, so the contribution map changes without a frontend deployment or a
running Mac.

The encrypted private bridge separately holds a read-only GitHub token and
refreshes all eight public and private product repositories every day. That
snapshot includes activity and commit metadata, never source code or diffs.
Local source-line totals and uncommitted-worktree counts remain build-time facts
because GitHub cannot observe them.

## Private build-time data

`npm run snapshot` scans local Git repositories and reads an optional private
content module from `~/.config/life-control-plane/private-data.mjs`. It generates
`src/generated/privateSnapshot.ts`, which is ignored by Git. A machine without
that module receives a safe generic snapshot; the owner's private deployment
receives the real one.
