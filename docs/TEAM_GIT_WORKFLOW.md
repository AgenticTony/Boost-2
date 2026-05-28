# Boost by FCR — Git (enkel guide)

Hur vi jobbar med Git. **Följ stegen i ordning.** Hela loopen är 6 steg.

Repo: **github.com/AgenticTony/boost-by-fcr**

---

## ⚠️ Tre regler som alltid gäller

1. **Pusha aldrig direkt till `main`** — alltid via en PR (Pull Request).
2. **Hämta senaste innan du börjar koda** (steg 1).
3. **En review** från någon annan innan en PR mergas.

---

## 🖥️ Första gången? Hämta projektet (gör detta en gång)

Innan du kan följa stegen nedan måste projektet ligga på din dator.

1. Öppna en terminal (Terminal på Mac, eller terminalen i VS Code).
2. Gå till mappen där du vill ha projektet, t.ex.:
   ```bash
   cd ~/Projects
   ```
3. Hämta projektet från GitHub:
   ```bash
   git clone https://github.com/AgenticTony/boost-by-fcr.git
   ```
4. Gå in i projektmappen:
   ```bash
   cd boost-by-fcr
   ```
5. Installera paketen i den app du ska jobba i (första gången):
   ```bash
   cd apps/public-site     # eller apps/locked-area, apps/contact-worker
   npm install
   ```


Sen är du igång — **varje dag du jobbar** följer du 6-stegsloopen nedan (steg 1: `git pull`).

---

## 📍 Var gör du allt detta? (läs detta en gång)

**Alla kommandon** i den här guiden skriver du i **terminalen** — inte i en kodfil.

Så här kommer du dit (i **VS Code** — funkar likadant i de flesta editorer):

1. Öppna VS Code.
2. Öppna projektmappen: **File → Open Folder…** → välj mappen `boost-by-fcr`.
3. Öppna terminalen: klicka i menyfliken **Terminal → New Terminal**.

Nu öppnas en terminal i botten av VS Code. **Alla `git`-kommandon nedan skriver du här** — och trycker **Enter** efter varje.

**Kolla att du är på rätt ställe:** det ska stå något med `boost-by-fcr` i terminalen
(t.ex. `➜ boost-by-fcr`). Står det något annat? Skriv `cd ` (med mellanslag) och dra in
projektmappen i terminalfönstret, så fylls sökvägen i automatiskt — tryck Enter.

> **Första gången och det känns krångligt?** Fråga Anthony eller Robert — vi visar dig.

---

## Din arbetsdag — 6 steg

Allt nedan görs i terminalen (se ☝️), om inget annat sägs.

### 1. Hämta senaste
```bash
git checkout main
git pull origin main
```
*Gör alltid detta först. Då har du andras senaste ändringar och slipper konflikter.*

### 2. Skapa en egen branch
```bash
git checkout -b feature/pX-min-uppgift
```
- `pX` = din roll: **p1, p2, p3** eller **p4**
- `min-uppgift` = kort vad du gör

**Exempel:** `feature/p4-login-page` (ny funktion) eller `fix/p2-mobile-nav` (buggfix).

### 3. Koda och spara (committa) — ofta
Gör dina ändringar i koden (i vanliga filer, som vanligt). Spara dem sen i små commits
i terminalen:
```bash
git status                          # se vilka filer du ändrat
git add apps/din/mapp/fil.tsx       # lägg till dina filer (specifika sökvägar)
git commit -m "feature/p4: la till logga på startsidan"
```
**Commit-meddelande:** `typ: kort beskrivning` — `feature` (nytt), `fix` (bugg),
`chore` (config), `docs`.
*Tips: spara hellre 5 små gånger än 1 stor.*

### 4. Pusha till GitHub
```bash
git push origin feature/pX-min-uppgift
```

### 5. Öppna en Pull Request (PR)
**Lättast — på webben:**
1. Gå till **github.com/AgenticTony/boost-by-fcr** i din webbläsare.
2. Du ser en grön knapp **"Compare & pull request"** — klicka den.
3. Skriv en titel, klicka **"Create pull request"**.

*Eller i terminalen (om GitHub CLI `gh` är installerat):*
```bash
gh pr create --title "feature/p4: logga på startsidan" --body ""
```

### 6. Be om review — sen mergea
Skriv i team-chatten:
> "PR uppe för [vad du gjort], kan någon reviewa? #p4"

När någon har godkänt — **innan du mergear, kolla två saker:**
- **Inga konflikter:** det ska stå *"This branch has no conflicts with the base branch"*.
  Står det *"has conflicts that must be resolved"*? Då måste du lösa dem först (se
  "Merge-konflikt" under *Vid problem* nedan) — GitHub blockerar merge-knappen tills
  det är klart.
- **Checkar gröna:** ikonerna vid PR:n ska vara ✓ (godkända), inte ✗. Röd ✗? Då har
  något test eller bygge misslyckats — rätta och pusha igen (steg 3–4).

*Ok på båda? Då mergear du på webben:*
1. Öppna din PR på github.com.
2. Klicka **"Merge pull request"** → **"Confirm merge"**.

*Eller i terminalen:*
```bash
gh pr merge <PR-nummer> --squash
```

Sen — tillbaka i terminalen — hämta senaste och städa din branch:
```bash
git checkout main
git pull origin main
git branch -d feature/pX-min-uppgift
```

---

## Vid problem (läs här om det strular)

### "Jag skrev kod direkt i main av misstag"
```bash
git checkout -b feature/pX-mine-changes
git push origin feature/pX-mine-changes
git checkout main
git reset --hard origin/main
```

### "Merge-konflikt när jag pullade"
```bash
git pull origin main
# Öppna filerna som nämns. Leta efter <<<<<<< HEAD
# Välj rätt kod, ta bort markörerna (<<<<<<, =======, >>>>>>)
git add .
git commit -m "fix: löste merge-konflikt"
```

### "Jag vill ångra min senaste commit (inte pushad ännu)"
```bash
git reset --soft HEAD~1
# Ändringarna finns kvar, bara inte sparade (uncommitted)
```

### "Terminalen säger att den inte hittar `git` eller `gh`"
Då är programmet inte installerat. Fråga Anthony eller Robert om hjälp.

---

## Vem gör vad (rör inte andras mappar)
```
apps/public-site/     ← ANTHONY (P2)
apps/locked-area/     ← MOHAND (P4)
apps/contact-worker/  ← MOHAND (P4)
apps/cms/             ← MARCUS (P1) + ROBERT (P3)
.github/workflows/    ← MOHAND (P4)
docs/                 ← ALLA
```
**Ändra aldrig filer i någon annans mapp utan att prata med dem först.**
Behöver du ändra något utanför din mapp: skriv i chatten, eller gör en PR och låt
mappens ägare reviewa.

---

*Senast uppdaterad: 2026-06-25*
