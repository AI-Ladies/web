# AI Ladies Web

Oficiální webová stránka komunity AI Ladies.

- **Web:** https://ailadies.cz
- **Mentoring:** https://mentoring.ailadies.cz
- **GitHub:** https://github.com/AI-Ladies/web

---

## Jak to celé funguje

Web běží na [Vercelu](https://vercel.com) (hosting) a zdrojový kód je na [GitHubu](https://github.com/AI-Ladies/web). Jsou propojené tak, že **každý push na větev `main` automaticky nasadí novou verzi webu** — typicky za 10–15 sekund.

```
Editace souboru → git push → Vercel automaticky deployne → live na ailadies.cz
```

### Co kde běží

| Služba | Co dělá | Přístupy |
|--------|---------|----------|
| **GitHub** (AI-Ladies/web) | Uchovává zdrojový kód webu | Členky organizace AI-Ladies |
| **Vercel** (ai-ladies-projects) | Hostuje web + serverless API | hello@ailadies.cz |
| **Airtable** | Ukládá registrace na eventy | hello@ailadies.cz |
| **Brevo** | Newsletter + potvrzovací emaily | hello@ailadies.cz |
| **Forpsi** | Správa domény ailadies.cz | Petra |

### Formuláře a API

- **Registrace na event** (`/api/register`) — uloží data do Airtable + přidá kontakt do Brevo listu "AI Ladies Night" + pošle potvrzovací email
- **Newsletter** (`/api/newsletter`) — přidá email do Brevo listu "AI Ladies Newsletter"

API klíče jsou uložené jako environment variables na Vercelu (ne v kódu).

---

## Jak udělat změnu na webu

### Varianta A: Přes Cursor / Claude Code (doporučeno)

1. **Naklonuj si repo** (stačí jednou):
   ```bash
   git clone https://github.com/AI-Ladies/web.git
   cd web
   ```

2. **Před každou editací pullni aktuální verzi** (ať nepracuješ se starou):
   ```bash
   git pull
   ```
   > ⚠️ **Vždy udělej `git pull` před tím, než začneš cokoliv měnit.** Jinak se ti může stát, že přepíšeš změny od někoho jiného.

3. **Otevři v Cursoru** (nebo jiném editoru):
   ```bash
   cursor .
   ```

4. **Edituj soubory ve složce `public/`** — tam jsou všechny HTML stránky, styly a obrázky. Řekni AI co chceš změnit, například:
   > „Změň text v sekci O nás na homepage"
   >
   > „Přidej novou fotku do týmové sekce"
   >
   > „Uprav datum eventu na ai-ladies-night.html"

5. **Commitni a pushni**:
   ```bash
   git add .
   git commit -m "Popis změny"
   git push
   ```

6. **Hotovo!** Za ~15 sekund se změna projeví na https://ailadies.cz

### Varianta B: Přímo na GitHubu (rychlé drobné úpravy)

1. Jdi na https://github.com/AI-Ladies/web/tree/main/public
2. Klikni na soubor, který chceš upravit (např. `index.html`)
3. Klikni na ikonu tužky (Edit)
4. Uprav obsah
5. Klikni **Commit changes** → web se automaticky aktualizuje

### Varianta C: Upload obrázků přes GitHub

1. Jdi na https://github.com/AI-Ladies/web/tree/main/public/img
2. Klikni **Add file** → **Upload files**
3. Přetáhni obrázky a klikni **Commit changes**

---

## Struktura projektu

```
web/
├── public/                    ← TADY SE EDITUJE
│   ├── index.html             ← Homepage (ailadies.cz)
│   ├── ai-ladies-night.html   ← Landing page pro event
│   ├── obchodni-podminky.html ← Obchodní podmínky
│   ├── ochrana-osobnich-udaju.html
│   ├── cookies.html
│   ├── legal.html
│   ├── seznam-zpracovatelu.html
│   └── img/                   ← Obrázky (team.png, petra.png, ...)
│
├── api/                       ← Serverless funkce (NEMĚNIT bez rozmyslu)
│   ├── register.js            ← API pro registraci na event
│   └── newsletter.js          ← API pro newsletter signup
│
├── vercel.json                ← Konfigurace Vercelu (routing, headers)
├── package.json               ← Node.js metadata
├── .gitignore                 ← Soubory ignorované gitem
└── README.md                  ← Tento soubor
```

### Co můžeš měnit bez obav

- `public/*.html` — texty, strukturu, styly
- `public/img/*` — obrázky (přidat, nahradit)

### Co měnit opatrně

- `api/*.js` — serverless funkce (registrace, newsletter) — změny ovlivní, jak fungují formuláře
- `vercel.json` — routing a konfigurace — špatná změna může rozbít web

---

## DNS a domény

| Doména | Kam směřuje | Co tam běží |
|--------|-------------|-------------|
| `ailadies.cz` | Vercel (náš projekt) | Nový AI Ladies web |
| `www.ailadies.cz` | Přesměrování → `ailadies.cz` | — |
| `mentoring.ailadies.cz` | Vercel (Macaly projekt) | Petřin mentoring web |

DNS se spravuje na Forpsi (nameservery: ns.forpsi.net).

---

## Potřebuješ pomoct?

Napiš na hello@ailadies.cz nebo otevři issue na GitHubu.
