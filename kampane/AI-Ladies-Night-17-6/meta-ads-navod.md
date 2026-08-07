# Meta Ads — AI Ladies Night — Návod na nasazení kampaně

> Step-by-step průvodce. Počítej s ~20 minut.
> Potřebuješ: přístup do Meta Ads Manager + PNG kreativy (máš ve složce `vizualy/png/`)

---

## 1. Otevři Ads Manager

1. Jdi na **https://adsmanager.facebook.com**
2. Přihlas se účtem, který spravuje FB/IG stránku AI Ladies
3. Zkontroluj, že nahoře vlevo máš správný **Ad Account** (pokud nemáš žádný, Meta tě provede vytvořením)

---

## 2. Vytvoř kampaň

1. Klikni zelené tlačítko **+ Vytvořit** (nebo **+ Create**)
2. Vyber cíl kampaně: **Sales** (nebo Prodej / Konverze)
   - Pokud se Meta ptá na "Conversion location" → vyber **Website**
3. Pojmenuj kampaň: `AI Ladies Night — 17.6.2026`
4. **Campaign budget optimization (CBO):** zapni Advantage Campaign Budget
5. **Budget:** 5 000 Kč celkový (Lifetime budget)
   - Nebo 500 Kč/den (Daily budget) — kampaň poběží ~2 dny, tak lifetime je lepší
6. Klikni **Další / Next**

---

## 3. Nastav Ad Set (cílení)

### Konverze
- **Conversion event:** InitiateCheckout
  - Pokud ho nevidíš, vyber PageView (a až se InitiateCheckout objeví po pár dnech dat, přepni)
- **Pixel:** AI Ladies Pixel (ten co jsme nasadili, ID `27041465528857133`)

### Rozpočet a harmonogram
- **Start:** hned (nebo dnes)
- **End:** 17. 6. 2026 ve 14:00 (pár hodin před eventem)

### Cílení (Audience)
- **Lokace:** Česká republika (nebo Praha + 50 km, pokud chceš jen lokální)
- **Věk:** 25–55
- **Pohlaví:** Ženy
- **Jazyk:** Čeština
- **Detailed targeting (zájmy):**
  - `Artificial intelligence`
  - `Podnikání` / `Entrepreneurship`
  - `Marketing`
  - `Osobní rozvoj` / `Self-improvement`
  - `Freelance`
  - `Vzdělávání` / `Education`
  - Můžeš přidat i: `Women's empowerment`, `Networking`
- **Advantage+ Audience:** klidně nech zapnuté — Meta optimalizuje cílení automaticky, ale detailed targeting mu dá signál

### Placements (umístění)
- Nech **Advantage+ Placements** (automatické) — Meta sám rozhodne, kde reklama poběží nejlépe
- Nebo vyber manuálně: **Facebook Feed, Instagram Feed, Instagram Stories, Facebook Stories**

Klikni **Další / Next**

---

## 4. Vytvoř reklamy (Ads)

Tady nahraješ kreativy. Doporučuju udělat **jednu reklamu s více kreativami** (Advantage+ Creative), ať Meta testuje, co funguje nejlíp.

### Identita
- **Facebook Page:** AI Ladies
- **Instagram Account:** AI Ladies (pokud máš propojený)

### Formát
- Vyber **Single image or video**

### Kreativy — nahrání
1. Klikni **Add Media → Add Image**
2. Nahraj z `vizualy/png/` tyto soubory:
   - `square-1-hero-claim.png`
   - `square-2-konverzace.png`
   - `square-3-program.png`
   - `square-4-low-barrier.png`
   - `square-5-identita.png`
   - `square-6-siroky-zaber.png`
3. Meta ti u každého obrázku ukáže náhled pro různé placementy
4. U **Stories** klikni **Edit placement** a nahraj stories verzi:
   - `story-1-hero-claim.png` (atd.)

### Copy — text reklamy

Vyber jednu variantu z `meta-ads-copy.md`. Doporučuju **Variantu A (Question hook)**:

**Primary text:**
```
Kdy ses naposledy posadila k AI a řekla si: tohle mi fakt pomáhá?

AI Ladies Night je komorní večer pro 50 žen, které chtějí AI dostat do praxe. Žádné přednášky, žádné slidy — jen otevřené konverzace u kulatých stolů, welcome drink a živé ukázky nástrojů, které můžeš zkusit hned zítra.

17. června, Space Cafe, Praha. Buď u toho od začátku.
```

**Headline:**
```
AI Ladies Night — 17. června, Praha
```

**Description:**
```
Komorní večer pro ženy, které chtějí AI v praxi.
```

### CTA Button
- Vyber: **Learn More** nebo **Sign Up**

### URL
- **Website URL:** `https://ailadies.cz/ai-ladies-night`
- **URL Parameters (volitelné):** `utm_source=meta&utm_medium=paid&utm_campaign=ailadies-night-june2026`
  - Toto ti pak ukáže v Google Analytics, odkud lidi přišli

Klikni **Publikovat / Publish**

---

## 5. Chceš víc reklam? (volitelné, ale doporučené)

Místo jedné reklamy s jedním copy můžeš udělat **3 reklamy** se 3 různými texty:

1. V Ad Setu klikni **+ Create** (nová reklama)
2. Nahraj stejné kreativy, ale použij **Variantu B** copy
3. Opakuj pro **Variantu C**

Meta pak automaticky přesouvá budget na tu reklamu, která konvertuje nejlíp.

---

## 6. Po publikaci — checklist

- [ ] Reklama přejde do **Review** (schvalování) — trvá obvykle 15 min až pár hodin
- [ ] Zkontroluj v **Events Manageru**, že Pixel sbírá data: https://business.facebook.com/events_manager
- [ ] Zkontroluj náhled reklamy na mobilu (Ads Manager → Preview → Mobile)
- [ ] Po 24h koukni na výsledky: CTR, CPC, počet InitiateCheckout

---

## Rychlý checklist — co kam patří

| Pole | Hodnota |
|---|---|
| Cíl kampaně | Sales / Conversions |
| Budget | 5 000 Kč lifetime |
| Konec | 17. 6. 2026, 14:00 |
| Pixel | 27041465528857133 |
| Event | InitiateCheckout |
| Cílení | Ženy, 25–55, ČR, zájmy AI/podnikání/marketing |
| Landing page | https://ailadies.cz/ai-ladies-night |
| UTM | utm_source=meta&utm_medium=paid&utm_campaign=ailadies-night-june2026 |

---

*Soubory s kreativami: `kampane/AI-Ladies-Night-17-6/vizualy/png/`*
*Texty: `kampane/AI-Ladies-Night-17-6/meta-ads-copy.md`*
