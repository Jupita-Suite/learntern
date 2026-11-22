// Finds posts/articles added since a previous commit and emails subscribers about each (via tools/notify.mjs --send).
// Usage: node tools/notify-new.mjs <before-sha> [--dry]
// Only slugs that are NEW compared with <before-sha> are announced, so re-running or editing a post never re-sends.
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { site } from "../data/site.mjs";
const before = process.argv[2], dry = process.argv.includes("--dry");
const files = [["data/blog.mjs", "posts", "/blog/"], ["data/articles.mjs", "articles", "/learn/"]];
const zero = !before || /^0+$/.test(before);
const load = async (path, name, ref) => {
  if (!ref) { return (await import(pathToFileURL(join(process.cwd(), path)).href))[name]; }
  try {
    const dir = mkdtempSync(join(tmpdir(), "old-")); const f = join(dir, "old.mjs");
    writeFileSync(f, execFileSync("git", ["show", `${ref}:${path}`], { encoding: "utf8" }).replace(/from\s+["']\.\.?\/[^"']+["']/g, 'from "data:text/javascript,"')); // old file may import siblings; we only need its arrays
    return (await import(pathToFileURL(f).href))[name] || [];
  } catch { return []; }
};
const today = new Date().toISOString().slice(0, 10);
const fresh = [];
for (const [path, name, base] of files) {
  const now = await load(path, name), old = new Set((zero ? [] : await load(path, name, before)).map((x) => x.slug));
  for (const x of now) if (!old.has(x.slug) && (!x.date || x.date <= today)) fresh.push({ slug: x.slug, url: `${site.url}${base}${x.slug}/` });
}
if (zero) { console.log("No previous commit to compare with; nothing to announce."); process.exit(0); }
if (!fresh.length) { console.log("No new posts or articles in this change."); process.exit(0); }
for (const f of fresh) {
  console.log("New:", f.slug);
  if (dry) continue;
  let live = false; // wait up to ~12 minutes for the deploy to publish the page
  for (let i = 0; i < 48 && !live; i++) { try { live = (await fetch(f.url, { redirect: "follow" })).ok; } catch {} if (!live) await new Promise((r) => setTimeout(r, 15000)); }
  if (!live) { console.error("Page never went live, skipping notification:", f.url); process.exitCode = 1; continue; }
  execFileSync("node", ["tools/notify.mjs", f.slug, "--send"], { stdio: "inherit" });
}
