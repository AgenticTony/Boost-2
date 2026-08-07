# Hygraph: the `Exercise` model

How the locked-area exercise library maps to Hygraph. **This documents the
model as it actually exists**, verified by introspecting the project, not a
proposal.

Project: `cmq8mzl7900oo07wbs723qais` (locked-area has its own Hygraph project;
public-site uses a different one, `cmq1xlnd2022t07w9jmsfkk5o`).

---

## The model as built

| Field | Type | Required | How the app uses it |
|---|---|---|---|
| `id` | `ID!` | ✅ | **The URL key.** There is no `slug` field, so routes are `/exercise/<id>`. |
| `title` | `String!` | ✅ | Card and detail heading. |
| `description` | `String!` | ✅ | Card summary; clamps to two lines. |
| `duration` | `Int!` | ✅ | Minutes. The UI appends "min", so store `45`, not `"45 min"`. |
| `difficulty` | `String!` | ✅ | Free text — see the warning below. |
| `muscleGroups` | `String` | — | Comma-separated: `"Quadriceps, Hamstrings, Core"`. Split into chips and searched. |
| `steps` | `Json` | — | Expected to be an **array of strings**. Rendered as a numbered list. |
| `videoUrl` | `String` | — | Renders a "Se instruktionsvideo" link. |
| `image` | `Asset` | — | Card and detail header; falls back to a branded placeholder. |

There are also `material` and `member` models in this project, currently unused
by the app — relevant when the handbook and knowledge sections get wired up.

### ⚠️ `difficulty` is a free String, not an enumeration

The filter buttons match on the exact values **`Lätt`**, **`Medel`**, **`Svår`**.

Because Hygraph types this as a plain `String`, an editor can type anything.
The app normalises casing and whitespace, so `medel` and `" Svår "` still work
— but a genuine typo (`"Meddel"`) produces an exercise that renders fine and
**silently never appears under any filter**.

Making this an enumeration in Hygraph would remove the whole class of problem.
Until then, `normaliseDifficulty` in `src/api/exercise-mapping.ts` is the
safety net, and it can only do so much.

### `steps` is a `Json` column

It holds an array of strings today, which is what the app renders. Anything
else — an object, a bare string — is treated as "no steps" rather than printed
raw. That is deliberate: a `Json` field can hold anything, and
`[object Object]` in the instructions is worse than an honest empty state.

Because steps are plain strings rather than rich text, the detail page renders
real `<ol>` markup and contains **no `dangerouslySetInnerHTML`** at all.

---

## ⚠️ Content permissions: this project is publicly readable

Verified by request: the endpoint returns published content **with no
credential at all**, because the Public Content API has a permission of
*Read / all models / on all stages*.

"All stages" includes `DRAFT`, so unpublished work-in-progress is readable too.

This is correct for public-site's project. It is wrong here — it means the
members-only material is available to anyone with the endpoint URL, and the
login screen protects nothing for this content.

**Fix, in Hygraph:** Project Settings → API Access → Public Content API →
delete the Read permission. Then confirm the `BoostApp_Local` Permanent Auth
Token still has read on `PUBLISHED`, since that is the credential the edge
function uses.

---

## How the app reads it

The browser never talks to Hygraph. `supabase/functions/hygraph-exercises`
holds the token and proxies two named queries; the client picks one by name and
can never compose GraphQL of its own.

```bash
cd apps/locked-area
supabase secrets set HYGRAPH_ENDPOINT="<the Content API endpoint>"
supabase secrets set HYGRAPH_TOKEN="<the BoostApp_Local token>"
supabase functions deploy hygraph-exercises
```

The endpoint and token are already in `apps/locked-area/.env`, commented out
and renamed off the `VITE_` prefix. Anything prefixed `VITE_` is inlined
verbatim into the browser bundle — which is precisely how the token would leak.

Then enable it for the app:

```
VITE_USE_HYGRAPH=true
```

Hygraph is on automatically in production builds; this flag is only needed to
opt in during local development. Without it the app uses
`src/api/mock-adapter.ts`, whose fixtures are all prefixed `[Exempel]` so mock
data is never mistaken for real content.

---

## Checklist

- [ ] Remove the public Read permission from the Content API
- [ ] Confirm `BoostApp_Local` retains read on `PUBLISHED`
- [ ] `supabase secrets set HYGRAPH_ENDPOINT` / `HYGRAPH_TOKEN`
- [ ] `supabase functions deploy hygraph-exercises`
- [ ] Consider converting `difficulty` to an enumeration
- [ ] Publish exercises (drafts are not returned)
