/**
 * Backfill FIRSTNAME_5PAD (vocative) for contacts in the AI Ladies Night list.
 *
 * Usage:
 *   BREVO_API_KEY=xkeysib-... BREVO_NIGHT_LIST_ID=4 SKLONOVANI_API_KEY=... node scripts/backfill-vocatives.mjs
 *
 * Or with .env.local:
 *   node --env-file=.env.local scripts/backfill-vocatives.mjs
 */

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const LIST_ID = Number(process.env.BREVO_NIGHT_LIST_ID || 4);
const SKLON_KEY = process.env.SKLONOVANI_API_KEY;

if (!BREVO_API_KEY) { console.error('Missing BREVO_API_KEY'); process.exit(1); }
if (!SKLON_KEY) { console.error('Missing SKLONOVANI_API_KEY'); process.exit(1); }

const brevoHeaders = { 'api-key': BREVO_API_KEY, 'Content-Type': 'application/json' };

async function ensureAttribute() {
  const res = await fetch('https://api.brevo.com/v3/contacts/attributes/normal/FIRSTNAME_5PAD', {
    method: 'POST',
    headers: brevoHeaders,
    body: JSON.stringify({ type: 'text' }),
  });
  if (res.ok) {
    console.log('✓ Created FIRSTNAME_5PAD attribute in Brevo');
  } else {
    const data = await res.json().catch(() => ({}));
    if (data.code === 'duplicate_parameter') {
      console.log('✓ FIRSTNAME_5PAD attribute already exists');
    } else {
      console.log('⚠ Attribute creation response:', data);
    }
  }
}

async function getContactsFromList() {
  const contacts = [];
  let offset = 0;
  const limit = 500;

  while (true) {
    const res = await fetch(
      `https://api.brevo.com/v3/contacts/lists/${LIST_ID}/contacts?limit=${limit}&offset=${offset}`,
      { headers: brevoHeaders }
    );
    if (!res.ok) {
      console.error('Error fetching contacts:', await res.text());
      break;
    }
    const data = await res.json();
    contacts.push(...data.contacts);
    console.log(`  Fetched ${contacts.length} / ${data.count} contacts...`);
    if (contacts.length >= data.count) break;
    offset += limit;
  }

  return contacts;
}

async function getVocative(firstname, lastname) {
  try {
    const url = new URL('https://www.sklonovani-jmen.cz/api');
    url.searchParams.set('klic', SKLON_KEY);
    url.searchParams.set('pad', '5');
    url.searchParams.set('jmeno', `${firstname} ${lastname}`);
    url.searchParams.set('pouzit-osloveni', 'ne');
    url.searchParams.set('pouzit-prijmeni', 'ne');
    url.searchParams.set('pouzit-krestni', 'ano');
    url.searchParams.set('format', 'json');

    const res = await fetch(url.toString());
    if (!res.ok) return firstname;

    const data = await res.json();
    if (Array.isArray(data) && data[0]?.odpoved) {
      const odpoved = data[0].odpoved;
      if (!/^\d+$/.test(odpoved)) return odpoved;
    }
  } catch (err) {
    console.error(`  ⚠ Sklonovani error for ${firstname}: ${err.message}`);
  }
  return firstname;
}

async function updateContact(email, firstname5pad) {
  const res = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
    method: 'PUT',
    headers: brevoHeaders,
    body: JSON.stringify({ attributes: { FIRSTNAME_5PAD: firstname5pad } }),
  });
  return res.ok;
}

async function main() {
  console.log('\n🔧 Backfill FIRSTNAME_5PAD for AI Ladies Night contacts\n');

  await ensureAttribute();

  console.log(`\n📋 Fetching contacts from list ${LIST_ID}...`);
  const contacts = await getContactsFromList();
  console.log(`\n👥 Found ${contacts.length} contacts. Computing vocatives...\n`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const contact of contacts) {
    const email = contact.email;
    const fname = contact.attributes?.FIRSTNAME || '';
    const lname = contact.attributes?.LASTNAME || '';
    const existing5pad = contact.attributes?.FIRSTNAME_5PAD;

    if (!fname) {
      console.log(`  ⏭ ${email} — no FIRSTNAME, skipping`);
      skipped++;
      continue;
    }

    if (existing5pad && existing5pad !== fname) {
      console.log(`  ✓ ${email} — already has vocative: ${existing5pad}`);
      skipped++;
      continue;
    }

    const vocative = await getVocative(fname, lname);
    const ok = await updateContact(email, vocative);

    if (ok) {
      console.log(`  ✅ ${email} — ${fname} → ${vocative}`);
      updated++;
    } else {
      console.log(`  ❌ ${email} — update failed`);
      errors++;
    }

    // Rate limiting — sklonovani-jmen has limits
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n📊 Done: ${updated} updated, ${skipped} skipped, ${errors} errors\n`);
}

main().catch(err => { console.error(err); process.exit(1); });
