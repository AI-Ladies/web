# Zásady používání cookies AI Ladies

> **Verze:** 2026.1 · **Účinnost:** [DOPLNIT DATUM ZVEŘEJNĚNÍ]
> **Související dokumenty:** [Zásady ochrany osobních údajů](AILadies_zasady_ochrany_osobnich_udaju_2026.md), [Seznam zpracovatelů](AILadies_seznam_zpracovatelu_2026.md), [VOP](AILadies_obchodni_podminky_2026.md).
> **Interní podklad pro implementaci v Macaly:** viz [AILadies_cookie_lista_navod.md](../business/AILadies_cookie_lista_navod.md).
>
> Tyto Zásady popisují, jak web ailadies.cz a platforma AI Ladies Hub používají cookies a podobné technologie, jaké kategorie cookies používáme, k jakým účelům a jak můžete své nastavení kdykoli změnit.

---

## 1. Co jsou cookies a podobné technologie

**Cookies** jsou malé textové soubory, které web ukládá ve Vašem prohlížeči nebo zařízení. Slouží k tomu, aby si web pamatoval Vaše volby, fungoval správně, měřil návštěvnost nebo zobrazoval relevantní obsah.

Vedle klasických cookies používají moderní weby také **podobné technologie**:

- **Local storage / session storage** — paměť prohlížeče pro Vaše nastavení.
- **Pixely a tagy** — drobné technické prvky pro měření kampaní a chování.
- **Identifikátory zařízení** — anonymní identifikátor relace nebo prohlížeče.

Pro stručnost v tomto dokumentu označujeme všechny tyto technologie jednoduše jako **„cookies"**.

---

## 2. Právní rámec

Používání cookies upravuje zejména:

- **Nařízení (EU) 2016/679 (GDPR)** — pro cookies, které zpracovávají osobní údaje,
- **Zákon č. 127/2005 Sb., o elektronických komunikacích** (§ 89), který provádí evropskou směrnici ePrivacy,
- **Pokyny Úřadu pro ochranu osobních údajů (ÚOOÚ)** a stanoviska **Evropského sboru pro ochranu osobních údajů (EDPB)**.

**Praktické důsledky:**

- **Nezbytné (technicky nutné) cookies** můžeme používat bez Vašeho souhlasu.
- **Všechny ostatní cookies** (zejména analytické a marketingové) můžeme aktivovat **až poté, co dáte svobodný, informovaný a prokazatelný souhlas**.
- **Odmítnutí musí být stejně snadné** jako přijetí — proto v cookie liště máme tlačítka „Přijmout vše" a „Odmítnout vše" stejně viditelná.
- **Předem zaškrtnuté volby** pro neesenciální cookies nejsou platným souhlasem.
- **Cookie walls** (podmínění přístupu k obsahu udělením souhlasu s cookies) jsou v rozporu s pravidly EDPB a nepoužíváme je.

---

## 3. Kategorie cookies, které AI Ladies používá

### 3.1 Nezbytné cookies *(vždy zapnuté, souhlas se nevyžaduje)*

Tyto cookies jsou nutné pro **základní funkci webu a Hubu**, jejich bezpečnost a uložení Vašich voleb. Bez nich web nemůže správně fungovat.

| Cookie / technologie | Účel | Doba uložení | Poskytovatel |
|---|---|---|---|
| `ailadies_cookie_consent` | Uložení Vaší volby v cookie liště | 12 měsíců | AI Ladies (first-party) |
| Session cookie pro přihlášení do Hubu | Udržení přihlášené relace | Po dobu relace | AI Ladies / poskytovatel platformy |
| CSRF token | Ochrana proti útokům typu cross-site request forgery | Po dobu relace | AI Ladies / poskytovatel platformy |
| Cookies platebních bran (Stripe / Macaly) | Bezpečné dokončení platby | Po dobu transakce | Stripe / Macaly |

### 3.2 Analytické cookies *(souhlas vyžadován)*

Pomáhají nám měřit návštěvnost, výkon stránek a chování uživatelů. Slouží ke zlepšování obsahu a Služeb AI Ladies.

| Cookie / technologie | Účel | Doba uložení | Poskytovatel |
|---|---|---|---|
| `_ga` | Identifikace unikátního uživatele (Google Analytics 4) | 13 měsíců | Google Ireland Limited |
| `_ga_<ID>` | Stav relace pro Google Analytics 4 | 13 měsíců | Google Ireland Limited |
| `_gid` *(pokud používáme)* | Identifikace uživatele po dobu jednoho dne | 24 hodin | Google Ireland Limited |

> **Pozn.:** Pokud místo Google Analytics použijeme jiné měření (například Plausible, Simple Analytics), tabulku aktualizujeme. AI Ladies se zavazuje **GA4 spouštět až po Vašem souhlasu** s analytickou kategorií (Google Consent Mode v2 nebo blokace skriptu).

### 3.3 Marketingové cookies *(souhlas vyžadován)*

Slouží k vyhodnocování kampaní a případně k zobrazování relevantní reklamy na externích platformách.

| Cookie / technologie | Účel | Doba uložení | Poskytovatel |
|---|---|---|---|
| `_fbp` *(jen pokud bude nasazen Meta Pixel)* | Měření kampaní na Meta (Facebook, Instagram) | 90 dní | Meta Platforms Ireland Ltd. |
| `li_*` *(jen pokud bude nasazen LinkedIn Insight Tag)* | Měření kampaní na LinkedIn | 90 dní | LinkedIn Ireland Unlimited Company |
| Google Ads remarketing *(jen pokud bude nasazen)* | Měření a remarketing | 90 dní | Google Ireland Limited |

> **Stav ke dni účinnosti těchto Zásad:** AI Ladies **prozatím nepoužívá** marketingové cookies. Sekci ponecháváme připravenou pro případné budoucí nasazení; v takovém případě Vás budeme transparentně informovat a marketingové cookies se aktivují **až po Vašem souhlasu**.

### 3.4 Cookies třetích stran v embedovaném obsahu

Pokud na webu vložíme **YouTube video** (například ukázka z CallCastu), **Spotify přehrávač** nebo **mapu Google Maps**, mohou tyto služby nastavit vlastní cookies podle svých pravidel. Tyto cookies se aktivují **až po načtení daného obsahu** a po Vašem souhlasu s marketingovou nebo analytickou kategorií, pokud je vyžadován.

---

## 4. Cookie lišta — jak vypadá a jak funguje

### 4.1 První vrstva (vstupní banner)

Při Vaší první návštěvě webu se zobrazí cookie lišta s krátkým vysvětlením a třemi tlačítky, která jsou **stejně viditelná**:

> **Používáme cookies a podobné technologie.**
> Nezbytné cookies používáme vždy, protože bez nich web správně nefunguje a nepamatuje si Vaši volbu. Analytické a marketingové cookies aktivujeme pouze po Vašem souhlasu. Své nastavení můžete kdykoli změnit přes odkaz **Nastavení cookies** v patičce webu. Více v [Zásadách ochrany osobních údajů](AILadies_zasady_ochrany_osobnich_udaju_2026.md) a v těchto Zásadách cookies.
>
> **Tlačítka:**
> **Přijmout vše** · **Odmítnout vše** · **Nastavení**

### 4.2 Druhá vrstva (detailní nastavení)

Po kliknutí na „Nastavení" se zobrazí druhá vrstva, kde můžete jednotlivé kategorie samostatně zapnout nebo nechat vypnuté:

> **Nastavení cookies**
>
> **Nezbytné cookies** *(vždy aktivní)*
> Zajišťují základní fungování webu, bezpečnost a uložení Vaší volby. Tyto cookies nelze vypnout.
>
> **Analytické cookies** *(volba: zapnout / nechat vypnuté)*
> Pomáhají nám měřit návštěvnost a výkon webu, abychom mohli obsah zlepšovat. Aktivují se pouze po Vašem souhlasu.
>
> **Marketingové cookies** *(volba: zapnout / nechat vypnuté)*
> Pomáhají měřit kampaně a zobrazovat relevantní reklamy na externích platformách. Aktivují se pouze po Vašem souhlasu.
>
> **Uložení Vaší volby**
> Volbu si pamatujeme prostřednictvím cookie `ailadies_cookie_consent` po dobu 12 měsíců, abychom Vás nemuseli ptát při každé návštěvě znovu.
>
> **Tlačítka:**
> **Uložit nastavení** · **Odmítnout vše** · **Přijmout vše**

### 4.3 Klíčové principy lišty

- Tlačítka **„Přijmout vše"**, **„Odmítnout vše"** a **„Nastavení"** jsou ve stejné vrstvě a stejně viditelná (stejná velikost, stejný kontrast, stejné umístění).
- Žádné analytické ani marketingové cookies se **neaktivují, dokud uživatel neudělí souhlas**.
- Lišta **neblokuje obsah webu**.
- Lišta **neobsahuje předem zaškrtnuté volby** pro neesenciální kategorie.
- Uživatel má kdykoli možnost **změnit nebo odvolat souhlas** přes odkaz **Nastavení cookies** v patičce webu.

---

## 5. Jak nastavit cookies v prohlížeči

Cookies můžete také spravovat **přímo ve svém prohlížeči** — můžete je odmítat, mazat nebo nastavit notifikace při jejich ukládání. Postupy se liší podle prohlížeče; návody najdete v nápovědě:

- [Google Chrome](https://support.google.com/chrome/answer/95647)
- [Mozilla Firefox](https://support.mozilla.org/cs/kb/cookies-informace-ktere-stranky-uchovavaji-na-vasem)
- [Safari](https://support.apple.com/cs-cz/guide/safari/sfri11471/mac)
- [Microsoft Edge](https://support.microsoft.com/cs-cz/microsoft-edge/odstran%C4%9Bn%C3%AD-soubor%C5%AF-cookie-v-prohl%C3%AD%C5%BEe%C4%8Di-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09)

> **Upozornění:** Blokace nezbytných cookies přímo v prohlížeči může způsobit, že některé funkce webu nebo Hubu nebudou fungovat správně (například přihlášení nebo dokončení objednávky).

---

## 6. Vaše práva při zpracování cookies

V rozsahu, ve kterém cookies a podobné technologie zpracovávají Vaše osobní údaje, máte všechna **práva subjektu údajů** popsaná v [Zásadách ochrany osobních údajů AI Ladies](AILadies_zasady_ochrany_osobnich_udaju_2026.md) — zejména právo na přístup, opravu, výmaz a vznesení námitky.

**Souhlas s cookies můžete kdykoli odvolat** kliknutím na odkaz **Nastavení cookies** v patičce webu. Odvolání nemá vliv na zákonnost zpracování provedeného před odvoláním.

---

## 7. Změny Zásad cookies

AI Ladies je oprávněna tyto Zásady cookies aktualizovat, zejména pokud:

- přidáme nebo odebereme některý analytický či marketingový nástroj,
- změní se dodavatel platformy webu nebo Hubu,
- dojde k podstatné změně právního rámce.

O **podstatných změnách** Vás budeme informovat **viditelným oznámením na webu** a aktualizací cookie lišty. Při zásadní změně rozsahu cookies Vás požádáme o **nový souhlas**.

Aktuální verze Zásad je vždy dostupná na **ailadies.cz/cookies**.

---

## 8. Kontakt

Otázky a žádosti směřujte na:

**AILadies s.r.o.**
Všehrdova 447/10, 118 00 Praha 1
E-mail: **hello@ailadies.cz**

V případě sporu se můžete obrátit také na:

**Úřad pro ochranu osobních údajů**
Pplk. Sochora 27, 170 00 Praha 7
[www.uoou.cz](https://www.uoou.cz) · posta@uoou.cz

---

*AILadies s.r.o. · Zásady cookies · verze 2026.1 · účinnost [DOPLNIT]*
