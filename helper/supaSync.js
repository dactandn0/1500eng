// Supabase sync (free): luu word + sentence len bang online `saved_words`.
// Cau hinh o Setting (User) -> luu localStorage keys 'SupaUrl' / 'SupaAnonKey'.
// SQL can chay 1 lan trong Supabase SQL Editor:
//   create table saved_words (
//     id bigint generated always as identity primary key,
//     word text not null default '',
//     sentence text not null default '',
//     created_at timestamptz not null default now()
//   );
//   alter table saved_words enable row level security;
//   create policy "open" on saved_words for all using (true) with check (true);

function SupaSync_config() {
	var url = '', key = '';
	try {
		if (typeof Helper_loadStr === 'function') {
			url = (Helper_loadStr('SupaUrl', '') || '').trim().replace(/\/+$/, '');
			key = (Helper_loadStr('SupaAnonKey', '') || '').trim();
		}
	} catch (e) {}
	return { url: url, key: key };
}

function SupaSync_enabled() {
	var c = SupaSync_config();
	return !!(c.url && c.key);
}

// Fire-and-forget: khong chan UI, loi tu bo qua (local van save nhu cu).
function SupaSync_save(word, sentence) {
	var c = SupaSync_config();
	if (!c.url || !c.key) return;
	var w = String(word == null ? '' : word).replace(/(<([^>]+)>)/ig, '').trim();
	var s = String(sentence == null ? '' : sentence).replace(/(<([^>]+)>)/ig, '').trim();
	if (!w && !s) return;
	try {
		fetch(c.url + '/rest/v1/saved_words', {
			method: 'POST',
			headers: {
				'apikey': c.key,
				'Authorization': 'Bearer ' + c.key,
				'Content-Type': 'application/json',
				'Prefer': 'return=minimal'
			},
			body: JSON.stringify({ word: w, sentence: s })
		}).catch(function () {});
	} catch (e) {}
}

function SupaSync_test() {
	var c = SupaSync_config();
	if (!c.url || !c.key) return Promise.reject(new Error('Chua nhap URL/key'));
	return fetch(c.url + '/rest/v1/saved_words?select=id&limit=1', {
		headers: { 'apikey': c.key, 'Authorization': 'Bearer ' + c.key }
	}).then(function (r) {
		if (!r.ok) throw new Error('HTTP ' + r.status);
		return true;
	});
}
