# Seznam zpracovatelů a příjemců osobních údajů AI Ladies

> **Verze:** 2026.1 · **Účinnost:** [DOPLNIT DATUM ZVEŘEJNĚNÍ] · **Poslední revize:** [DOPLNIT]
> Tento seznam je **nedílnou součástí** [Zásad ochrany osobních údajů AI Ladies](AILadies_zasady_ochrany_osobnich_udaju_2026.md) a souvisí s čl. 7 a 8 [VOP AI Ladies](AILadies_obchodni_podminky_2026.md).
>
> **Aktualizace:** Tento dokument je živý a aktualizujeme jej, jakmile přibude, ubude nebo se podstatně změní některý ze Zpracovatelů nebo se změní podmínky daného nástroje. Doporučujeme se s ním seznámit zejména před první objednávkou Služby.

---

## Co tento seznam obsahuje

Pro každého Zpracovatele uvádíme:

- **Nástroj a poskytovatele** (právní entitu),
- **Účel zpracování** v rámci Služeb AI Ladies,
- **Kategorie údajů**, které mu mohou být zpřístupněny,
- **Lokace zpracování** (EU / mimo EU),
- **Přenosovou záruku** dle čl. 44–49 GDPR (pokud probíhá přenos mimo EU/EHP),
- **Použitý tarif / režim** podstatný pro ochranu dat,
- **Odkaz na privacy / DPA** poskytovatele.

---

## 1. Videokonference, kalendář a kancelář

### 1.1 Google Workspace (Google Meet, Calendar, Drive, Apps Script, Gmail, NotebookLM)

- **Poskytovatel:** Google Ireland Limited (Gordon House, Barrow Street, Dublin 4, Irsko) a její přidružené společnosti.
- **Účel:** vedení online Webinářů a Workshopů (Google Meet), pořízení záznamu, sdílení dokumentů, e-mailová komunikace, automatizace, využití NotebookLM pro práci s podklady.
- **Kategorie údajů:** identifikační, kontaktní, audiovizuální záznam, obsahové údaje, údaje o zařízení.
- **Lokace:** EU/USA (globální infrastruktura).
- **Přenosová záruka:** Standardní smluvní doložky (SCC) v rámci **Google Cloud Data Processing Addendum**; Google je certifikován v rámci **EU–US Data Privacy Framework (DPF)**.
- **Tarif / režim:** **Google Workspace Business / Enterprise** (firemní účet AI Ladies) s povoleným explicitním consentem pro Record, Transcribe a Take notes funkce v Google Meet.
- **Odkaz:** [privacy.google.com](https://privacy.google.com) · [workspace.google.com/terms/dpa_terms.html](https://workspace.google.com/terms/dpa_terms.html)
- **Specifikum NotebookLM:** Pro pracovní účty Google Workspace Google uvádí, že uploady, dotazy a odpovědi **nebudou používány k trénování modelů AI** a neprobíhá u nich lidská kontrola; AI Ladies používá výhradně tento pracovní režim.

---

## 2. Generativní AI a transkripce

### 2.1 OpenAI (ChatGPT, GPT API)

- **Poskytovatel:** OpenAI Ireland Ltd. (1st Floor, The Liffey Trust Centre, 117–126 Sheriff Street Upper, Dublin 1, Irsko) / OpenAI, L.L.C. (USA).
- **Účel:** generování návrhů textů, shrnutí, přepisů a doprovodných materiálů; podpora přípravy obsahu pro Webináře, Hub a komunikaci.
- **Kategorie údajů:** obsahové údaje (vstupy do modelu), přepisy audia, případně části Uživatelského obsahu.
- **Lokace:** EU/USA.
- **Přenosová záruka:** SCC v rámci **OpenAI Data Processing Addendum**; OpenAI je certifikována v rámci **EU–US Data Privacy Framework**.
- **Tarif / režim:** **ChatGPT Business / Enterprise** nebo **OpenAI API**. Podle podmínek poskytovatele **nejsou data z těchto tarifů ve výchozím nastavení používána k trénování modelů**. Standardní backend retence abuse-monitoring logů je až 30 dní; u kvalifikovaných organizací je k dispozici **Zero Data Retention (ZDR)**.
- **Odkaz:** [openai.com/policies/privacy-policy](https://openai.com/policies/privacy-policy) · [openai.com/policies/business-terms](https://openai.com/policies/business-terms)

### 2.2 Anthropic (Claude, Claude API, Claude Code)

- **Poskytovatel:** Anthropic, PBC (548 Market Street, San Francisco, USA).
- **Účel:** generování textů, shrnutí, přepisů, podpora vývoje interních nástrojů AI Ladies.
- **Kategorie údajů:** obsahové údaje (vstupy do modelu).
- **Lokace:** USA (zpracování přes infrastrukturu Anthropicu).
- **Přenosová záruka:** SCC v rámci **Anthropic Data Processing Addendum**.
- **Tarif / režim:** **Claude for Work / Enterprise** nebo **Anthropic API**. Podle podmínek poskytovatele **u komerčních produktů nejsou vstupy a výstupy ve výchozím nastavení využívány ke trénování modelů**; standardní backend retence je 30 dní, k dispozici je **Zero Data Retention**. Claude Code provozujeme s komerčními organizačními klíči.
- **Odkaz:** [anthropic.com/legal/privacy](https://www.anthropic.com/legal/privacy) · [anthropic.com/legal/commercial-terms](https://www.anthropic.com/legal/commercial-terms)

### 2.3 Wispr Flow

- **Poskytovatel:** Wispr AI, Inc. (USA).
- **Účel:** přepis řeči na text (dictation) pro přípravu obsahu, e-mailů a poznámek.
- **Kategorie údajů:** hlasový vstup, transkripty.
- **Lokace:** USA (cloudový přepis).
- **Přenosová záruka:** SCC dle DPA poskytovatele.
- **Tarif / režim:** **Wispr Flow s Privacy Mode** (případně Enterprise se ZDR). V Privacy Mode poskytovatel **neuchovává dictation data na serverech a nepoužívá je k trénování**. AI Ladies používá Privacy Mode.
- **Odkaz:** [wisprflow.ai/privacy](https://wisprflow.ai/privacy)

### 2.4 NotebookLM (Google)

- Viz Google Workspace v sekci 1.1. NotebookLM používáme **výhradně přes pracovní účet Google Workspace**, kde podle Google nejsou uploady, dotazy ani odpovědi využívány k trénování AI modelů.

---

## 3. Vývoj, kód a verzování

### 3.1 Cursor

- **Poskytovatel:** Anysphere Inc. (USA).
- **Účel:** vývoj a údržba interních nástrojů AI Ladies (webové stránky, automatizace, právní dokumenty, scripty).
- **Kategorie údajů:** kódová báze AI Ladies, dokumenty zpracovávané přes editor; **přímé osobní údaje Zákazníků nejsou do Cursoru rutinně vkládány**.
- **Lokace:** USA (přes backend Cursoru), s navazujícími model providery.
- **Přenosová záruka:** SCC dle podmínek poskytovatele.
- **Tarif / režim:** **Cursor s aktivním Privacy Mode** (ideálně org-wide). V Privacy Mode poskytovatel uvádí **Zero Data Retention** u model providerů a netrénování na kódu. Embeddingy a metadata o codebase mohou být ukládány na straně Cursoru pro indexaci — to bereme na vědomí.
- **Odkaz:** [cursor.com/privacy](https://cursor.com/privacy) · [cursor.com/security](https://cursor.com/security)

### 3.2 GitHub (vč. GitHub Copilot)

- **Poskytovatel:** GitHub, Inc. (USA) / Microsoft Corporation.
- **Účel:** verzování kódu, hosting interních dokumentů a webových materiálů, případně použití GitHub Copilot.
- **Kategorie údajů:** kód, dokumentace, případně metadata o uživatelích AI Ladies.
- **Lokace:** EU/USA.
- **Přenosová záruka:** SCC v rámci **GitHub DPA**; Microsoft je certifikován v rámci **EU–US Data Privacy Framework**.
- **Tarif / režim:** **GitHub Copilot Business / Enterprise** — podle podmínek poskytovatele **GitHub nepoužívá data Copilot Business a Enterprise k trénování modelů**.
- **Odkaz:** [docs.github.com/site-policy/privacy-policies](https://docs.github.com/en/site-policy/privacy-policies) · [github.com/customer-terms/github-data-protection-agreement](https://github.com/customer-terms/github-data-protection-agreement)

---

## 4. Platforma Hub a komunita

### 4.1 [PLATFORMA HUBU — finální výběr do 30. 6. 2026]

- **Možnosti zvažované AI Ladies:** Circle.so, Mighty Networks, případně vlastní řešení.
- **Účel:** provoz komunitní platformy AI Ladies Hub — profily, kalendář, diskuze, zpřístupnění obsahu, platby.
- **Kategorie údajů:** identifikační, kontaktní, profilové, Uživatelský obsah, údaje o chování, platební metadata.
- **Lokace:** dle finální volby (zpravidla EU/USA).
- **Přenosová záruka:** SCC dle DPA finálně zvoleného poskytovatele.
- **Tarif / režim:** **business plan s aktivní DPA**.
- **Odkaz:** doplníme po finální volbě.

> **Stav:** Tento řádek bude finalizován jakmile Katka rozhodne o platformě (úkol z [VOP plánu](AILadies_obchodni_podminky_2026.md) — do 30. 6. 2026).

---

## 5. Platební brány a fakturace

### 5.1 Macaly

- **Poskytovatel:** Macaly (viz aktuální dokumentace [macaly.com](https://www.macaly.com)).
- **Účel:** tvorba webu, formuláře, případně zpracování plateb v rámci checkoutu.
- **Kategorie údajů:** identifikační, kontaktní, objednávkové, transakční metadata (čísla karet se přes Macaly k AI Ladies nedostávají).
- **Lokace:** dle dokumentace poskytovatele.
- **Přenosová záruka:** dle DPA Macaly; pokud probíhá přenos mimo EU, SCC.
- **Odkaz:** [macaly.com](https://www.macaly.com) — privacy a DPA dle dokumentace.

### 5.2 Stripe *(je-li nasazen)*

- **Poskytovatel:** Stripe Payments Europe, Ltd. (Irsko) / Stripe, Inc. (USA).
- **Účel:** zpracování online plateb, opakované strhávání Předplatného Hubu.
- **Kategorie údajů:** transakční údaje, jméno, e-mail, technické metadata. **Údaje platební karty zpracovává výhradně Stripe** jako samostatný správce ve smyslu PCI-DSS; AI Ladies čísla karet **neuchovává**.
- **Lokace:** EU/USA.
- **Přenosová záruka:** SCC v rámci **Stripe DPA**.
- **Odkaz:** [stripe.com/privacy](https://stripe.com/privacy) · [stripe.com/legal/dpa](https://stripe.com/legal/dpa)

### 5.3 Fakturační a účetní systém

- **Poskytovatel:** [DOPLNIT — např. iDoklad / Fakturoid / 365.cz a zvolená účetní firma]
- **Účel:** vystavování faktur a daňových dokladů, vedení účetnictví.
- **Kategorie údajů:** fakturační, transakční.
- **Lokace:** Česká republika (EU).
- **Přenosová záruka:** v rámci EU, není potřeba mimoevropský přenos.
- **Odkaz:** doplníme dle finálního výběru.

---

## 6. E-mail marketing a newsletter

### 6.1 [Brevo / Mailchimp / jiný nástroj — finální volba do 5. 6. 2026]

- **Účel:** rozesílání transakčních a marketingových e-mailů (potvrzení objednávky, upomínky, follow-up po akci, newsletter).
- **Kategorie údajů:** identifikační (jméno), kontaktní (e-mail), údaje o doručení a otevření zpráv, segmentace.
- **Lokace:** dle finální volby (Brevo — EU/Francie; Mailchimp — USA).
- **Přenosová záruka:** dle finální volby — Brevo: zpravidla zpracování v EU; Mailchimp: SCC + DPF.
- **Tarif / režim:** standardní business účet s aktivní DPA.
- **Odkaz:** doplníme po finální volbě.

> **Stav:** úkol z VOP plánu — Aneta vybere nástroj do 5. 6. 2026.

---

## 7. Webhosting a infrastruktura

### 7.1 Hosting webu ailadies.cz

- **Poskytovatel:** [DOPLNIT — dle finálního řešení (Macaly hosting / vlastní hosting)].
- **Účel:** provoz webových stránek, server logy.
- **Kategorie údajů:** IP adresa, údaje o prohlížeči, údaje o návštěvnosti.
- **Lokace:** [DOPLNIT].
- **Přenosová záruka:** dle DPA poskytovatele.
- **Odkaz:** doplníme dle finální volby.

---

## 8. Externí samostatní správci (nejsou zpracovateli)

Tyto subjekty se mohou setkat s některými údaji ne jako zpracovatelé, ale jako **samostatní správci** ve svém vlastním právním režimu.

| Subjekt | Vztah | Údaje | Pozn. |
|---|---|---|---|
| Lektorky a externí hosté Webinářů a CallCastu | Spolupráce na konkrétní akci | Jméno účastnic, otázky v Q&A | Vázáni mlčenlivostí, zpracovávají údaje pro účely vlastní spolupráce |
| Účetní firma / daňový poradce | Vedení účetnictví a daní | Fakturační údaje | Smluvní mlčenlivost |
| Advokátní kancelář | Uplatnění právních nároků | Údaje nezbytné pro spor | Zákonná mlčenlivost dle zákona o advokacii |
| Banka | Příjem plateb | Transakční údaje | Samostatný správce |
| Orgány veřejné moci (FÚ, ČOI, ÚOOÚ, soudy, policie) | Zákonné povinnosti | Dle situace | Pouze v zákonných případech |
| YouTube (Google), Spotify, LinkedIn, Instagram, TikTok, Facebook | Provozují platformy, kde AI Ladies publikuje obsah (CallCast, marketing) | Údaje o interakcích posluchaček/posluchačů a sledujících | **Samostatní správci** ve svých vlastních režimech; AI Ladies u nich osobní údaje sledujících nezpracovává |

---

## 9. Změny v seznamu

AI Ladies tento seznam **aktualizuje průběžně**. O podstatných změnách (přidání nového kritického Zpracovatele, změna tarifu s dopadem na ochranu dat, změna lokace zpracování) informujeme Zákazníky e-mailem nebo viditelným oznámením na webu.

**Historie verzí:**

| Verze | Datum | Změna |
|---|---|---|
| 2026.1 | [DOPLNIT] | První publikovaná verze pro AILadies s.r.o. (4 produkty) |

---

## 10. Kontakt

Dotazy a žádosti o detailnější informace o konkrétním Zpracovateli (například kopii uplatněné záruky SCC) směřujte na:

**AILadies s.r.o.**
E-mail: **hello@ailadies.cz**
Web: [ailadies.cz](https://ailadies.cz)

---

*AILadies s.r.o. · Seznam zpracovatelů · verze 2026.1 · poslední revize [DOPLNIT]*
