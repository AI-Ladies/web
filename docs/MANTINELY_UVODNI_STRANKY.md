---
title: Mantinely úvodní stránky ailadies.cz — co musí návrh unést
date: 2026-08-04
last_updated: 2026-08-04
status: PLATNÝ pro návrh úvodní stránky `/`. Zdroj a jediné místo, kde se mění, je repozitář `katka-ai/ai-ladies`, složka `docs/pro-web/`
tags: [ai-ladies, web, hub, homepage, navrh]
---

# Mantinely úvodní stránky

> **Jak to bude probíhat:** Aneta udělá klikací návrh v HTML, Katka ho postaví v Next.js jako součást Hubu. `/` bude po sloučení jedna jediná stránka pro celou značku.
>
> **Co je čí:** obsah, texty, vzhled a pořadí sekcí jsou Anetina věc a tenhle dokument do nich nemluví. Jsou tu jen tři věci, které se z návrhu nedají doplnit potom: **co musí tahat živá data**, **kam se odkazuje** a **co na stránce musí být kvůli vyhledávačům**.
>
> **Proč to musí být dopředu:** blok napsaný natvrdo se nedá „potom napojit". Napojení není úprava textu, je to jiný tvar bloku — musí unést dvě, šest i nula položek a nesmí se rozpadnout, když jich přijde jiný počet. Když se to zjistí až při stavbě, návrh se překresluje.

---

## 1. Tři bloky musí tahat živá data

Tyhle tři věci **nesmí být v návrhu napsané natvrdo**. Vymyšlené položky v návrhu jsou v pořádku a jsou potřeba — jde o to, aby blok počítal s tím, že se jejich počet a obsah mění bez zásahu do stránky.

| Blok | Co se tahá | Odkud |
|---|---|---|
| **Co je nového** | šest nejnovějších kusů obsahu napříč sekcemi — knihovna, blog, callcasty, záznamy webinářů, nástroj měsíce | databáze Hubu |
| **Nejbližší akce** | tři nejbližší nadcházející akce: název, datum, cena, odkaz | databáze Hubu |
| **Hlavička** | rozdíl mezi nepřihlášenou (*Registrovat*, *Přihlásit*) a přihlášenou (*Do Hubu*) | přihlášení |

**Akce jsou zvlášť od obsahu, ne v jednom seznamu.** Akce mají datum v budoucnosti, obsah v minulosti; v jednom seznamu řazeném podle data by se to rozpadlo.

**Co k tomu návrh musí ukázat, aby se dal postavit:**

1. **Jeden řádek jako vzor** — z čeho se skládá: štítek sekce, název jako odkaz, jedna věta popisu, datum. Ne šest různě vypadajících řádků.
2. **Jak vypadá blok, když je položek méně.** Seznam se **zkrátí**, nedoplňuje se prázdnými místy ani zástupným obsahem.
3. **Jak vypadá blok, když je prázdný.** U nadcházejících akcí se to stane pokaždé mezi dvěma termíny. Prázdný seznam není chyba, je to platný stav — a musí mít podobu, ne zmizet.

**Žádné číslo o sobě natvrdo.** Ani počet akcí, ani počet návodů, ani počet členek. Dnešní stránka Hubu tvrdila „04 setkání ročně" a v databázi bylo šest budoucích akcí. Napevno napsané číslo je slib, který zastará, aniž by si toho kdo všiml. **Když má být na stránce počet, musí se počítat z dat** — a pak není potřeba ho v návrhu psát.

**Napevno naopak zůstávají a je to záměr:** nadpis, perex, tlačítka, manifest a slib o tom, co zůstane zdarma. Je to slib, ne data. Nesmí se změnit nedopatřením při migraci databáze — mění se rozhodnutím.

**Cena členství na stránku nepatří** a v návrhu s ní nepočítej. Doplní se **30 dní před spuštěním členství**, spolu s datem, odkdy platí. Do té doby by to byl slib, který nemá kdy začít platit.

## 2. Kam se odkazuje

**Odkazuj jen na adresy, které existují.** Nová adresa je rozhodnutí, ne detail návrhu — když stránka potřebuje odkaz někam, kde nic není, řekni to; adresa se založí, nebo se odkaz vypustí.

| Kam | Adresy |
|---|---|
| **Hlavička** | `/knihovna` · `/blog` · `/webinare` · `/callcasty` · `/akce` · `/autorky` · `/registrace` · `/login` |
| **Z bloků a tlačítek** | `/knihovna` · `/blog` · `/akce` · `/co-je-zdarma` (plné znění toho, co zůstane zdarma) · `/registrace` |
| **Patička** | totéž co hlavička plus právní dokumenty: `/obchodni-podminky` · `/ochrana-osobnich-udaju` · `/cookies` · `/seznam-zpracovatelu` |

**Mentoring:** jestli v navigaci zůstane, je rozhodnutí o obsahu, ne o technice — dnešní stránka na něj odkazuje. Když tam bude, odkazuje se na **`/mentoring`**, nikdy přímo na `mentoring.ailadies.cz`. Pod `/mentoring` je přesměrování a to je jediné místo, kde se cíl mění; přímý odkaz na subdoménu by ho obešel a přestal by platit ve chvíli, kdy se mentoring přestěhuje.

**Tři věci, na které se odkázat nesmí:**

- **`hub.ailadies.cz` ani žádná adresa `*.vercel.app`.** Jsou to jiné adresy téže stránky a po sloučení se z nich stanou přesměrování. Odkaz na ně říká vyhledávači, že tatáž věc žije dvakrát.
- **Ploché adresy jednotlivých webinářů** (`/webinar-asistent-na-web` a podobné). Mají trvale skončit; z úvodní stránky se odkazuje na rozcestník `/akce` nebo `/webinare`, ne na jeden termín.
- **Adresa, kterou si vymyslíš, protože se hodí do návrhu.** Zní to jako drobnost, ale adresa je to jediné na celé stránce, co se po zapnutí indexace nedá vzít zpět bez ztráty.

## 3. Co na stránce musí být kvůli vyhledávačům

Úvodní stránka je nejnavštěvovanější adresa značky a jediné místo, kde značka mluví sama o sobě. Šest požadavků, všechny se týkají **struktury**, ne vzhledu:

1. **Jeden nadpis nejvyšší úrovně** a v něm i v prvním odstavci je vidět, co tohle je a pro koho.
2. **Věta o tom, co AI Ladies je, ve viditelném textu.** Doslova tahle: *„AI Ladies je česká komunita pro vzdělávání žen v AI. Založily ji v roce 2026 Aneta Lízancová, Kateřina Šumpíková a Petra Květová Pšeničná."* Umístění je věc návrhu, existence není. **Nesmí být v obrázku** — z obrázku ji stroj nepřečte a nezopakuje.
3. **Žádný fakt jen v obrázku.** Co zůstane zdarma, termíny, ceny, jména: všechno musí být i jako text. Obrázek s textem je pro vyhledávač prázdné místo. Obrázky mají `alt`.
4. **Odkazy z úvodní stránky dál.** Nejhorší možná úvodní stránka je ta, ze které se nedá pokračovat. Bloky s obsahem a akcemi to zajišťují samy, patička taky — jen se z nich nesmí stát dekorace bez odkazů.
5. **Nadpisy věcně, ne jako otázky, a bez sekce s častými otázkami.** Otázkové nadpisy měly v měřeních méně citací a obohacený výsledek pro časté otázky Google 7. 5. 2026 zrušil. Není to zákaz otázky ve textu, je to zákaz té sekce jako povinného útvaru.
6. **Odstavce mezi nadpisy spíš delší než kratší** — přibližně 120 až 180 slov na sekci. Sekce o dvou větách nemá co citovat. Je to redakční zvyk pro nový text, ne pravidlo, kvůli kterému se přepisuje existující.

**A tři věci, které na stránce být nesmí.** Nejsou to technická omezení, jsou to rozhodnutí a nepovolí se ani později:

- **Nic z adresáře členek.** Žádné profily, žádné počty členek, žádné fotky ani jména tažená z registrací. Adresář je celý za přihlášením a veřejný nebude.
- **Reference a citace jen se souhlasem konkrétní ženy**, a jako obsah, ne jako výpis z databáze.
- **Žádný slib, který stránka nesplní** — účet, který nejde založit, sekce, která neexistuje, certifikát, který nevydáváme.

---

## Dvě věci, které je dobré vědět dopředu

**Návrh není nasazená stránka.** Klikací HTML je zadání ke stavbě. Živá `/` se přepne na Hub **až ve chvíli, kdy hubová verze skutečně nese obsah z té dnešní webové** — do té doby obsluhuje `/` dál dnešní `public/index.html` a návštěvnice si nemá čeho všimnout. Až se přepne, ta dnešní stránka z repozitáře webu **zmizí**, aby nezůstaly dvě verze téhož.

**Adresa se nemění, mění se jen motor.** `/` je `/` před i po, takže se nic nepřesměrovává a nic se neztrácí. Proto se s tím nemusí spěchat a proto je v pořádku návrh dvakrát překreslit.
