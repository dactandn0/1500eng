var app = angular.module("quizApp", []);
app.controller("quizCtrl", function($scope, $rootScope, $timeout, $interval) {

// Co BUSY cho nut loa: dang phat -> disable nut, click spam bi bo qua.
// Duoc cap nhat qua poll Text2SpeechIsBusy() (co nay ha khi audio ended/error/stop).
$scope.ttsBusy = false;
var ttsPoll = $interval(function () {
	try { $scope.ttsBusy = (typeof Text2SpeechIsBusy === 'function') ? Text2SpeechIsBusy() : false; }
	catch (e) { $scope.ttsBusy = false; }
}, 250);
$scope.$on('$destroy', function () { try { $interval.cancel(ttsPoll); } catch (e) {} });
function ttsIsBusy() {
	try { if (typeof Text2SpeechIsBusy === 'function' && Text2SpeechIsBusy()) return true; } catch (e) {}
	return false;
}

// ============ shared helpers ============
function qShuffle(arr) {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
	}
	return arr;
}
function qPick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function qRand(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }
function qUnique(list) {
	const seen = {}, out = [];
	for (let i = 0; i < list.length; i++) {
		if (!seen[list[i]]) { seen[list[i]] = true; out.push(list[i]); }
	}
	return out;
}

$scope.mode = 'voca'; // 'voca' | 'detail' | 'pic'
$scope.setMode = function (m) {
	$scope.mode = m;
	try { Text2SpeechStop(); } catch (e) {}
	// chuyen tab thi doc lai cau hien tai (neu la dang nghe)
	$timeout(function () {
		if (m === 'detail' && $scope.detail.current && !$scope.detail.answered && !$scope.detail.finished) {
			$scope.detailSpeak(null, true);
		} else if (m === 'voca' && $scope.quiz.current && !$scope.quiz.answered && $scope.quiz.direction === 'listen') {
			try { (typeof Text2SpeechReplay === 'function' ? Text2SpeechReplay : Text2Speech)(quizHeadword($scope.quiz.current)); } catch (e) {}
		}
		// pic: khong tu phat (nhin hinh doan chu, phat truoc la lo dap an)
	}, 300);
};

// =====================================================
// SECTION 1: Vocabulary quiz (chuyen tu wordCollect sang)
// =====================================================
$scope.quiz = {
	active: true,
	finished: false,
	pool: [],
	items: [],
	index: 0,
	current: null,
	direction: 'en-vi',
	questionText: '',
	correctHead: '',
	correctMeaning: '',
	options: [],
	correctIdx: -1,
	picked: -1,
	answered: false,
	score: 0,
	streak: 0,
	bestStreak: 0,
	wrong: []
};

const QUIZ_ROUND_SIZE = 20;
const QUIZ_OPTION_COUNT = 4;

function quizHeadword(word) {
	try { return Helper_GetVocaFromWordFull(word.full); } catch (e) { return ''; }
}
function quizMeaning(word) {
	try { return Helper_RemoveHTMLtag(word.p2); } catch (e) { return word.p2 || ''; }
}
// Nghia gon: bo tag + bo /IPA/ dau dong (co IPA de qua)
function quizPlainMeaning(word) {
	let s = quizMeaning(word);
	s = s.replace(/^\s*\/[^\/]*\/\s*/, '');
	if (!s) s = quizMeaning(word);
	return s;
}

function vocaPool() {
	const kSTORIES = $rootScope.VocaToUI || [];
	const pool = [];
	for (let k = 0; k < kSTORIES.length; k++) {
		const story = kSTORIES[k];
		if (!story.en) continue;
		const words = story.en.split('<br>').map(function (word) {
			return Helper_SliceHalfString(Helper_hlUncNoun(word));
		});
		for (let i = 0; i < words.length; i++) {
			if (words[i] && words[i].full) pool.push({ word: words[i], cat: k });
		}
	}
	return pool;
}

$scope.startQuiz = function (wrongOnly, noSpeak) {
	let pool = vocaPool();
	if (wrongOnly && $scope.quiz.wrong.length) {
		pool = $scope.quiz.wrong.slice();
	}
	$scope.quiz.pool = pool;
	$scope.quiz.items = qShuffle(pool.slice()).slice(0, QUIZ_ROUND_SIZE);
	$scope.quiz.index = 0;
	$scope.quiz.score = 0;
	$scope.quiz.streak = 0;
	$scope.quiz.bestStreak = 0;
	$scope.quiz.wrong = [];
	$scope.quiz.finished = !$scope.quiz.items.length;
	$scope.quiz.active = true;
	if ($scope.quiz.items.length) $scope.buildQuizQuestion(!noSpeak);
};

function quizPickDistractors(entry, count) {
	const picked = [];
	const usedFull = {};
	usedFull[entry.word.full] = true;
	const sameCat = $scope.quiz.pool.filter(function (e) { return e.cat === entry.cat && !usedFull[e.word.full]; });
	const others = $scope.quiz.pool.filter(function (e) { return e.cat !== entry.cat && !usedFull[e.word.full]; });
	qShuffle(sameCat);
	qShuffle(others);
	const ordered = sameCat.concat(others);
	for (let i = 0; i < ordered.length && picked.length < count; i++) {
		picked.push(ordered[i]);
		usedFull[ordered[i].word.full] = true;
	}
	return picked;
}

$scope.buildQuizQuestion = function (autoSpeak) {
	const entry = $scope.quiz.items[$scope.quiz.index];
	if (!entry) {
		$scope.quiz.finished = true;
		return;
	}
	$scope.quiz.current = entry.word;
	const roll = Math.random();
	$scope.quiz.direction = roll < 0.4 ? 'en-vi' : (roll < 0.7 ? 'vi-en' : 'listen');
	$scope.quiz.questionText = ($scope.quiz.direction === 'en-vi') ? '' : quizPlainMeaning(entry.word);
	$scope.quiz.correctHead = quizHeadword(entry.word);
	$scope.quiz.correctMeaning = quizPlainMeaning(entry.word);
	const distractors = quizPickDistractors(entry, QUIZ_OPTION_COUNT - 1);
	const entries = qShuffle([entry].concat(distractors));
	$scope.quiz.options = entries.map(function (e) {
		let text;
		if ($scope.quiz.direction === 'en-vi') {
			text = quizPlainMeaning(e.word);
		} else if ($scope.quiz.direction === 'listen') {
			text = quizHeadword(e.word) + ' \u2013 ' + quizPlainMeaning(e.word);
		} else {
			text = quizHeadword(e.word);
		}
		return { entry: e, display: text, meaning: quizPlainMeaning(e.word), speak: quizHeadword(e.word) };
	});
	$scope.quiz.correctIdx = -1;
	for (let i = 0; i < entries.length; i++) {
		if (entries[i].word.full === entry.word.full) { $scope.quiz.correctIdx = i; break; }
	}
	$scope.quiz.picked = -1;
	$scope.quiz.answered = false;
	if (autoSpeak !== false && $scope.quiz.direction === 'listen') {
		try { (typeof Text2SpeechReplay === 'function' ? Text2SpeechReplay : Text2Speech)($scope.quiz.correctHead); } catch (e) {}
	}
};

$scope.answerQuiz = function (idx) {
	if ($scope.quiz.answered || idx < 0) return;
	$scope.quiz.answered = true;
	$scope.quiz.picked = idx;
	if (idx === $scope.quiz.correctIdx) {
		$scope.quiz.score += 1;
		$scope.quiz.streak += 1;
		if ($scope.quiz.streak > $scope.quiz.bestStreak) $scope.quiz.bestStreak = $scope.quiz.streak;
	} else {
		$scope.quiz.streak = 0;
		$scope.quiz.wrong.push({
			word: $scope.quiz.current,
			cat: ($scope.quiz.items[$scope.quiz.index] || {}).cat,
			head: quizHeadword($scope.quiz.current),
			meaning: quizPlainMeaning($scope.quiz.current)
		});
	}
};

$scope.quizSpeak = function (ev, isAuto) {
	if (ev) { try { ev.stopPropagation(); } catch (e) {} }
	if (!$scope.quiz.current) return;
	if (!isAuto && ttsIsBusy()) return; // spam click trong luc dang phat -> bo qua
	try { (typeof Text2SpeechReplay === 'function' ? Text2SpeechReplay : Text2Speech)(quizHeadword($scope.quiz.current)); } catch (e) {}
};

$scope.nextQuiz = function () {
	$scope.quiz.index += 1;
	if ($scope.quiz.index >= $scope.quiz.items.length) {
		$scope.quiz.current = null;
		$scope.quiz.finished = true;
	} else {
		$scope.buildQuizQuestion(true);
	}
};
$scope.retryWrongQuiz = function () { $scope.startQuiz(true); };

// Click dòng đáp án: chưa trả lời -> chọn; đã trả lời (đúng/sai) -> phát âm từ đó
$scope.clickQuizOption = function (ev, idx) {
	if (ev) { try { ev.stopPropagation(); } catch (e) {} }
	if (!$scope.quiz.answered) { $scope.answerQuiz(idx); return; }
	if (ttsIsBusy()) return;
	const opt = $scope.quiz.options[idx];
	const text = (opt && opt.speak) || '';
	if (text) { try { (typeof Text2SpeechReplay === 'function' ? Text2SpeechReplay : Text2Speech)(text); } catch (e) {} }
};

// =====================================================
// SECTION 2: Listening detail - Address / Birthday / Phone / Spelling
// Cau hoi: sound + 4 dap an ABCD de gay confuse
// =====================================================
const DETAIL_ROUND_SIZE = 20;

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const CONF_MONTH = {
	'January': ['June','July','February'],
	'February': ['December','November','January'],
	'March': ['May','August','April'],
	'April': ['August','July','June'],
	'May': ['March','July','April'],
	'June': ['July','January','April'],
	'July': ['June','January','May'],
	'August': ['April','October','July'],
	'September': ['December','November','October'],
	'October': ['August','November','September'],
	'November': ['December','September','October'],
	'December': ['September','November','February']
};

const STREET_GROUPS = [
	['Main','Maine','Mason'],
	['Travis','Tavis','Davis'],
	['Fannin','Fannon','Cannon'],
	['San Jacinto','San Antonio','San Felipe'],
	['Louisiana','Luciana','Indiana'],
	['Milam','Milan','Miller'],
	['Westheimer','Westmar','Westmere'],
	['Kirby','Kerby','Kirkby'],
	['Shepherd','Sheppard','Sheffield'],
	['Richmond','Richman','Richland'],
	['Bellaire','Bel Air','Bella Vista'],
	['Memorial','Memoral','Mermorial'],
	['Post Oak','Post Oaks','Pine Oak'],
	['Montrose','Monroe','Monterey'],
	['Washington','Warrington','Arlington'],
	['Katy','Katie','Cady'],
	['Lamar','Lamor','Lemark'],
	['Polk','Poke','Park'],
	['Walker','Waker','Walter'],
	['Preston','Presten','Houston']
];
const STREET_TYPES = ['Street','Avenue','Boulevard','Drive','Lane','Road','Way'];
// Uu tien Houston / Texas: trumpet weighting bang cach lap lai Houston nhieu lan
const CITIES = [
	'Houston, Texas 77002',
	'Houston, Texas 77006',
	'Houston, Texas 77054',
	'Houston, Texas 77082',
	'Katy, Texas 77494',
	'Sugar Land, Texas 77479',
	'Pasadena, Texas 77506',
	'The Woodlands, Texas 77380',
	'Dallas, Texas 75201',
	'Austin, Texas 78701',
	'San Antonio, Texas 78205',
	'El Paso, Texas 79901'
];

// Ma vung dien thoai My (uu tien Texas/Houston)
const US_AREA_CODES = ['713','281','832','346','214','469','972','512','210','212','213','312','305','404','415','617','718','917'];

// =====================================================
// Free API (khong key, CORS *). Fail -> fallback data/code local.
// - Name/Phone (Anh/My): randomuser.me (nat=us,gb)
// - Address (My, nhieu bang/city): random-data-api (chinh) + randomuser US (phu)
// Docs: https://randomuser.me/documentation , https://random-data-api.com/documentation
// =====================================================
const QUIZ_API_CACHE = { entries: [], fetching: false, done: false };
const QUIZ_ADDR_POOL = { list: [], fetching: false };
function quizApiPrefetch() {
	quizApiPrefetchUsers();
	quizApiPrefetchAddr();
}
function quizApiPrefetchUsers() {
	if (QUIZ_API_CACHE.fetching) return;
	if (QUIZ_API_CACHE.entries.length >= 20) return;
	if (typeof fetch !== 'function') return;
	QUIZ_API_CACHE.fetching = true;
	const url = 'https://randomuser.me/api/?results=60&nat=us,gb&inc=name,location,phone,cell,nat&noinfo';
	fetch(url).then(function (r) {
		if (!r.ok) throw new Error('api ' + r.status);
		return r.json();
	}).then(function (data) {
		const list = (data && data.results) || [];
		list.forEach(function (u) {
			try {
				QUIZ_API_CACHE.entries.push(quizParseApiUser(u));
				// dia chi US cung bo sung vao pool address de tang da dang bang/city
				if ((u.nat || '').toUpperCase() === 'US' && QUIZ_ADDR_POOL.list.length < 80) {
					try {
						const a = quizParseAddrFromRandomUser(u);
						if (a) QUIZ_ADDR_POOL.list.push(a);
					} catch (e2) {}
				}
			} catch (e) {}
		});
		QUIZ_API_CACHE.done = true;
	}).catch(function () {
		// fail -> giu fallback local, khong lam gi
	}).finally(function () {
		QUIZ_API_CACHE.fetching = false;
	});
}
// Pool dia chi My rieng: random-data-api cho nhieu bang/city (size=30/lan)
function quizApiPrefetchAddr() {
	if (QUIZ_ADDR_POOL.fetching) return;
	if (QUIZ_ADDR_POOL.list.length >= 20) return;
	if (typeof fetch !== 'function') return;
	QUIZ_ADDR_POOL.fetching = true;
	fetch('https://random-data-api.com/api/v2/addresses?size=30').then(function (r) {
		if (!r.ok) throw new Error('addr api ' + r.status);
		return r.json();
	}).then(function (data) {
		const list = Array.isArray(data) ? data : (data ? [data] : []);
		list.forEach(function (a) {
			try {
				const p = quizParseAddrFromRandomData(a);
				if (p) QUIZ_ADDR_POOL.list.push(p);
			} catch (e) {}
		});
	}).catch(function () {
		// fail -> randomuser US o tren + fallback local lo lieu
		try { quizApiPrefetchUsers(); } catch (e) {}
	}).finally(function () {
		QUIZ_ADDR_POOL.fetching = false;
	});
}
function quizParseAddrFromRandomData(a) {
	if (!a) return null;
	const streetAddr = a.street_address || (((a.building_number || '') + ' ' + (a.street_name || '')).trim()) || null;
	const city = a.city || null;
	const state = a.state || null;
	const zip = a.zip_code || a.zip || a.postcode || '';
	if (!streetAddr || !city || !state) return null;
	return { streetAddr: streetAddr, cityFull: city + ', ' + state + ' ' + zip, src: 'rda' };
}
function quizParseAddrFromRandomUser(u) {
	const stNum = (u.location && u.location.street && u.location.street.number) || null;
	const stName = (u.location && u.location.street && u.location.street.name) || null;
	const city = (u.location && u.location.city) || null;
	const state = (u.location && u.location.state) || null;
	const postcode = (u.location && u.location.postcode) || '';
	if (!stNum || !stName || !city || !state) return null;
	return { streetAddr: stNum + ' ' + stName, cityFull: city + ', ' + state + ' ' + postcode, src: 'ru' };
}
// lay 1 dia chi My tu pool (consume); het -> kich fetch bu + tra null (caller fallback local)
function quizTakeApiAddress() {
	if (!QUIZ_ADDR_POOL.list.length) {
		try { quizApiPrefetchAddr(); } catch (e) {}
		return null;
	}
	const idx = Math.floor(Math.random() * QUIZ_ADDR_POOL.list.length);
	const out = QUIZ_ADDR_POOL.list.splice(idx, 1)[0];
	if (QUIZ_ADDR_POOL.list.length < 10) {
		try { quizApiPrefetchAddr(); } catch (e) {}
	}
	return out;
}
// peek 1 city khac de lam distractor (khong consume) -> dam bao nhieu bang
function quizPeekOtherCity(excludeCity) {
	const cand = QUIZ_ADDR_POOL.list.filter(function (a) { return a && a.cityFull && a.cityFull !== excludeCity; });
	if (cand.length) return qPick(cand).cityFull;
	let otherCity = qPick(CITIES), guard = 0;
	while (otherCity === excludeCity && guard++ < 10) otherCity = qPick(CITIES);
	return otherCity;
}
function quizParseApiUser(u) {
	const first = (u.name && u.name.first) || '';
	const last = (u.name && u.name.last) || '';
	const fullName = (first + ' ' + last).trim();
	const nat = (u.nat || 'US').toUpperCase();
	const stNum = (u.location && u.location.street && u.location.street.number) || qRand(101, 9899);
	const stName = (u.location && u.location.street && u.location.street.name) || 'Main Street';
	const city = (u.location && u.location.city) || 'Houston';
	const state = (u.location && u.location.state) || 'Texas';
	const postcode = (u.location && u.location.postcode) || '77002';
	const streetAddr = stNum + ' ' + stName;
	const cityFull = city + ', ' + state + ' ' + postcode;
	// phone: uu tien cell, normalize ve 10 so US
	const rawPhone = u.cell || u.phone || '';
	let digits = String(rawPhone).replace(/\D/g, '');
	if (digits.length === 11 && digits[0] === '1') digits = digits.slice(1);
	if (digits.length !== 10) {
		// du lieu GB hoac thieu -> sinh so US gia lap tu ma vung that
		digits = qPick(US_AREA_CODES) + String(qRand(1000000, 9999999));
	}
	return {
		fullName: fullName, first: first, last: last, nat: nat,
		streetAddr: streetAddr, cityFull: cityFull,
		phoneDigits: digits
	};
}
// lay 1 entry tu cache (uu tien nat); lay xong thi xoa khoi cache + kich fetch bu
// strict=true: chi lay dung nat (dung cho address/phone My), khong co thi tra null
function quizTakeApiEntry(preferNat, strict) {
	if (!QUIZ_API_CACHE.entries.length) {
		quizApiPrefetch();
		return null;
	}
	let idx = -1;
	if (preferNat) {
		for (let i = 0; i < QUIZ_API_CACHE.entries.length; i++) {
			if (QUIZ_API_CACHE.entries[i].nat === preferNat) { idx = i; break; }
		}
		if (idx < 0 && strict) {
			quizApiPrefetch();
			return null;
		}
	}
	if (idx < 0) idx = Math.floor(Math.random() * QUIZ_API_CACHE.entries.length);
	const entry = QUIZ_API_CACHE.entries.splice(idx, 1)[0];
	// sap het thi fetch bu cho round sau (khong block cau hien tai)
	if (QUIZ_API_CACHE.entries.length < 10) { try { quizApiPrefetchUsers(); } catch (e) {} }
	return entry;
}
function quizDigitsSpaced(digits) { return String(digits).split('').join(' '); }
function fmtUSPhoneDisplay(digits) {
	const d = String(digits);
	return '+1 (' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6, 10);
}
function quizRandomUSPhoneDigits() {
	return qPick(US_AREA_CODES) + String(qRand(1000000, 9999999));
}
// doi ten de gay nham khi dung ten API (doi 1-2 ky tu)
function quizMutateName(name) {
	const alpha = 'abcdefghijklmnopqrstuvwxyz';
	function subOnce(s) {
		if (!s) return s;
		const pos = qRand(0, s.length - 1);
		const arr = s.split('');
		// 50% swap 2 ky tu canh nhau, 50% thay 1 ky tu
		if (pos < s.length - 1 && Math.random() < 0.5) {
			const t = arr[pos]; arr[pos] = arr[pos + 1]; arr[pos + 1] = t;
		} else {
			let nc = alpha[qRand(0, 25)];
			let guard = 0;
			while (nc.toLowerCase() === arr[pos].toLowerCase() && guard++ < 10) nc = alpha[qRand(0, 25)];
			arr[pos] = (arr[pos] === arr[pos].toUpperCase()) ? nc.toUpperCase() : nc;
		}
		return arr.join('');
	}
	let out = subOnce(name), guard = 0;
	while (out === name && guard++ < 5) out = subOnce(name);
	return out;
}

const NAME_GROUPS = [
	['Anna','Hannah','Emma','Anne'],
	['Emily','Emilia','Amelia','Emma'],
	['Daniel','Danielle','Danny','David'],
	['Michael','Michelle','Mitchell','Matthew'],
	['John','Joan','Jon','Johnson'],
	['Smith','Smyth','Smit','Schmidt'],
	['Brown','Browne','Braun','Brian'],
	['Johnson','Jonson','Johnston','Jackson'],
	['Taylor','Tyler','Tailor','Tayla'],
	['Wilson','Willson','Wilton','William'],
	['David','Davis','Davies','Daisy'],
	['Sophia','Sofia','Sophie','Sarah'],
	['Catherine','Katherine','Kathryn','Katie'],
	['Steven','Stephen','Stephens','Stewart'],
	['Brian','Bryan','Ryan','Bryant']
];

$scope.detail = {
	type: 'all', // all | address | birthday | phone | spelling
	items: [],
	index: 0,
	current: null,
	options: [],
	correctIdx: -1,
	picked: -1,
	answered: false,
	score: 0,
	streak: 0,
	bestStreak: 0,
	wrong: [],
	finished: false
};

$scope.setDetailType = function (t) {
	$scope.detail.type = t;
	$scope.startDetail();
};

function ordinal(n) {
	if (n % 100 >= 11 && n % 100 <= 13) return n + 'th';
	const r = n % 10;
	if (r === 1) return n + 'st';
	if (r === 2) return n + 'nd';
	if (r === 3) return n + 'rd';
	return n + 'th';
}

function confuseDay(d) {
	const c = [];
	if (d + 10 <= 28) c.push(d + 10);
	if (d - 10 >= 1) c.push(d - 10);
	if (d + 1 <= 28) c.push(d + 1);
	if (d - 1 >= 1) c.push(d - 1);
	if (d >= 10) { // dao so: 12 -> 21
		const s = String(d), sw = parseInt(s[1] + s[0], 10);
		if (sw >= 1 && sw <= 28 && sw !== d) c.push(sw);
	}
	if (d === 13) c.push(30); if (d === 30) c.push(13);
	if (d === 14) c.push(40 > 28 ? 24 : 40); if (d === 15) c.push(50 > 28 ? 25 : 50);
	if (d === 12) c.push(20); if (d === 20) c.push(12);
	return qUnique(c);
}

function confuseYear(y) {
	const s = String(y), c = [];
	c.push(y + 1); c.push(y - 1);
	// dao 2 so cuoi: 1998 -> 1989
	const swapped = parseInt(s.slice(0, 2) + s[3] + s[2], 10);
	if (swapped !== y) c.push(swapped);
	c.push(y + 10); c.push(y - 10);
	return qUnique(c.filter(function (v) { return v >= 1950 && v <= 2025 && v !== y; }));
}

function fmtBirthday(month, day, year) {
	return month + ' ' + day + ', ' + year; // display gon
}
function speakBirthday(month, day, year) {
	return 'My birthday is on ' + month + ' ' + ordinal(day) + ', ' + year + '.';
}

function genBirthday() {
	const month = qPick(MONTHS);
	const day = qRand(1, 28);
	const year = qRand(1965, 2010);
	const correct = fmtBirthday(month, day, year);
	const speak = speakBirthday(month, day, year);
	const opts = [correct];
	// D1: cung thang + ngay confuse
	const d1 = qPick(confuseDay(day).length ? confuseDay(day) : [day === 28 ? 27 : day + 1]);
	opts.push(fmtBirthday(month, d1, year));
	// D2: thang confuse + cung ngay
	const cm = (CONF_MONTH[month] || []).slice();
	qShuffle(cm);
	opts.push(fmtBirthday(cm[0] || qPick(MONTHS.filter(function (m) { return m !== month; })), day, year));
	// D3: cung thang/ngay + nam confuse
	const cy = qPick(confuseYear(year));
	opts.push(fmtBirthday(month, day, cy));
	return { kind: 'birthday', speakText: speak, transcript: speak, correct: correct, options: qUnique(opts) };
}

function swapDigitsNum(n) {
	const s = String(n);
	if (s.length < 2) return n + 10;
	const i = qRand(0, s.length - 2);
	const arr = s.split('');
	const t = arr[i]; arr[i] = arr[i + 1]; arr[i + 1] = t;
	const v = parseInt(arr.join(''), 10);
	return (v === n || isNaN(v)) ? n + 1 : v;
}

function genAddress() {
	// Uu tien 1: dia chi My that tu API (random-data-api + randomuser US) -> nhieu bang/city.
	// Fail -> fallback local.
	const api = quizTakeApiAddress();
	if (api && api.streetAddr && api.cityFull) {
		const streetAddr = api.streetAddr;
		const city = api.cityFull;
		const correct = streetAddr + ', ' + city;
		const speak = 'My address is ' + streetAddr + ', ' + city + '.';
		const opts = [correct];
		// D1: dao so nha (1204 -> 1024)
		const mNum = streetAddr.match(/^(\d+)\s+(.*)$/);
		if (mNum) opts.push(swapDigitsNum(parseInt(mNum[1], 10)) + ' ' + mNum[2] + ', ' + city);
		// D2: doi street type neu co (Street -> Avenue), khong thi mutate 1 chu
		let altStreet = streetAddr;
		let swapped = false;
		STREET_TYPES.forEach(function (t) {
			if (!swapped && new RegExp('\\b' + t + '\\b', 'i').test(streetAddr)) {
				const others = STREET_TYPES.filter(function (x) { return x.toLowerCase() !== t.toLowerCase(); });
				altStreet = streetAddr.replace(new RegExp('\\b' + t + '\\b', 'i'), qPick(others));
				swapped = true;
			}
		});
		if (!swapped) altStreet = quizMutateName(streetAddr);
		if (altStreet !== streetAddr) opts.push(altStreet + ', ' + city);
		// D3: khac city/bang that tu pool API (VD: Texas -> California), het pool moi dung local
		opts.push(streetAddr + ', ' + quizPeekOtherCity(city));
		return { kind: 'address', speakText: speak, transcript: speak + ' [US]', correct: correct, options: qUnique(opts) };
	}
	// Fallback local (logic cu)
	const g = qPick(STREET_GROUPS);
	const street = qPick(g);
	const type = qPick(STREET_TYPES);
	const num = qRand(101, 9899);
	const city = qPick(CITIES);
	const streetAddr = num + ' ' + street + ' ' + type;
	const correct = streetAddr + ', ' + city;
	const speak = 'My address is ' + streetAddr + ', ' + city + '.';
	const othersInGroup = g.filter(function (s) { return s !== street; });
	const opts = [correct];
	// D1: cung so + ten duong de nham (Main -> Maine) + cung city
	if (othersInGroup.length) opts.push(num + ' ' + qPick(othersInGroup) + ' ' + type + ', ' + city);
	// D2: dao so + cung duong (1204 -> 1024) + cung city
	opts.push(swapDigitsNum(num) + ' ' + street + ' ' + type + ', ' + city);
	// D3: doi nhau 50/50 -> khac type (Street -> Avenue) HOAC khac city (Houston -> Dallas)
	if (Math.random() < 0.5) {
		const otherTypes = STREET_TYPES.filter(function (t) { return t !== type; });
		opts.push(streetAddr.split(' ').slice(0, -1).join(' ') + ' ' + qPick(otherTypes) + ', ' + city);
	} else {
		let otherCity = qPick(CITIES), guard = 0;
		while (otherCity === city && guard++ < 10) otherCity = qPick(CITIES);
		opts.push(streetAddr + ', ' + otherCity);
	}
	return { kind: 'address', speakText: speak, transcript: speak, correct: correct, options: qUnique(opts) };
}

function fmtPhone(digits) {
	// Hien thi My kem ma vung: +1 (713) 555-0123
	return fmtUSPhoneDisplay(digits);
}
function genPhone() {
	// Uu tien 1: so My that tu API (randomuser nat=us). Fail -> sinh local kem ma vung.
	const api = quizTakeApiEntry('US', true);
	const digits = (api && api.phoneDigits) ? api.phoneDigits : quizRandomUSPhoneDigits();
	const correct = fmtUSPhoneDisplay(digits);
	// doc tung so, co "plus one" cho ma quoc gia de luyen nghe ma vung
	const speak = 'My phone number is plus one, ' + quizDigitsSpaced(digits) + '.';
	const opts = [correct];
	const arr = digits.split('');
	function mutateArea(a) {
		const b = a.slice();
		// doi ma vung sang ma vung My that khac (713 -> 214): bat ma vung la chinh
		let nc = qPick(US_AREA_CODES), guard = 0;
		while (nc === b.slice(0, 3).join('') && guard++ < 10) nc = qPick(US_AREA_CODES);
		return (nc + b.slice(3).join(''));
	}
	function mutate1(a) {
		const b = a.slice();
		const pos = qRand(3, 9); // giu ma vung cho D khac
		let nd = String(qRand(0, 9));
		let guard = 0;
		while (nd === b[pos] && guard++ < 10) nd = String(qRand(0, 9));
		b[pos] = nd;
		return b.join('');
	}
	function swapAdj(a) {
		const b = a.slice();
		const pos = qRand(3, 8);
		const t = b[pos]; b[pos] = b[pos + 1]; b[pos + 1] = t;
		if (b.join('') === a.join('')) b[9] = String((parseInt(b[9], 10) + 1) % 10);
		return b.join('');
	}
	const d1 = mutateArea(arr); // D1: sai ma vung
	const d2 = swapAdj(arr); // D2: dao 2 so ke nhau
	let d3 = mutate1(arr), guard = 0;
	while ((d3 === d1 || d3 === d2 || d3 === digits) && guard++ < 10) d3 = mutate1(arr);
	[d1, d2, d3].forEach(function (d) { opts.push(fmtUSPhoneDisplay(d)); });
	return { kind: 'phone', speakText: speak, transcript: speak, correct: correct, options: qUnique(opts) };
}

function fmtMoney(d, c) {
	const ds = String(d).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	const cs = (c < 10 ? '0' : '') + c;
	return '$' + ds + '.' + cs;
}
// teen <-> ty: 13<->30, 15<->50, 12<->20 ... (nghe nham kinh dien)
function confuseTeenTy(n) {
	const teen2ty = {12:20,13:30,14:40,15:50,16:60,17:70,18:80,19:90};
	const ty2teen = {20:12,30:13,40:14,50:15,60:16,70:17,80:18,90:19};
	const c = [];
	if (teen2ty[n] != null) c.push(teen2ty[n]);
	if (ty2teen[n] != null) c.push(ty2teen[n]);
	return c;
}
// nham 2 so cuoi: 150 -> 115 (fifty/fifteen), 150 -> 105 (dao so)
function confuseLast2(n) {
	const c = [];
	const hi = Math.floor(n / 100) * 100, lo = n % 100;
	confuseTeenTy(lo).forEach(function (v) { c.push(hi + v); });
	const s = (lo < 10 ? '0' : '') + lo;
	const sw = parseInt(s[1] + s[0], 10);
	if (sw !== lo) c.push(hi + sw);
	return c;
}

function genMoney() {
	const d = Math.random() < 0.5 ? qRand(1, 99) : qRand(100, 4999);
	const c = qPick([0, 5, 9, 25, 50, 75, 99, qRand(1, 99)]);
	const correct = fmtMoney(d, c);
	const speak = qPick([
		"The price is ",
		"It costs ",
		"The total is ",
		"I paid ",
		"That's ",
		"That'll be ",
		"Your total is ",
		"It comes to ",
		"That comes to ",
	]) + correct + '.';
	const opts = [correct];
	// D1: cung dollars + cents nham (.50 <-> .05, .13 <-> .30)
	let cc = confuseTeenTy(c).slice();
	if (c < 10) { cc.push(c * 10); cc.push(c + 10); }
	else {
		const s = String(c), sw = parseInt(s[1] + s[0], 10);
		if (sw !== c) cc.push(sw);
	}
	cc = qUnique(cc).filter(function (v) { return v >= 0 && v <= 99 && v !== c; });
	if (!cc.length) cc = [(c + 1) % 100];
	opts.push(fmtMoney(d, qPick(cc)));
	// D2: dollars nham + cung cents (13 <-> 30, 125 <-> 215)
	let dd = qUnique(confuseTeenTy(d).concat(confuseLast2(d)).concat([swapDigitsNum(d), d + 1, d - 1]))
		.filter(function (v) { return v > 0 && v !== d; });
	if (!dd.length) dd = [d + 2];
	opts.push(fmtMoney(qPick(dd), c));
	// D3: lech nhe ca 2 ve
	let d3 = d + qPick([-2, -1, 1, 2]);
	if (d3 <= 0) d3 = d + 3;
	const c3 = (c + qRand(1, 9)) % 100;
	opts.push(fmtMoney(d3, c3));
	return { kind: 'money', speakText: speak, transcript: speak, correct: correct, options: qUnique(opts) };
}

const BLOOD_TYPES = [
	{ long: 'A positive', short: 'A+' },
	{ long: 'A negative', short: 'A-' },
	{ long: 'B positive', short: 'B+' },
	{ long: 'B negative', short: 'B-' },
	{ long: 'AB positive', short: 'AB+' },
	{ long: 'AB negative', short: 'AB-' },
	{ long: 'O positive', short: 'O+' },
	{ long: 'O negative', short: 'O-' }
];
function quizConfuseBlood(bt) {
	// cung nhom chu khac Rh (A+ <-> A-) la bay nham chinh, roi toi khac nhom
	const sameLetter = BLOOD_TYPES.filter(function (x) { return x.short !== bt.short && x.short.replace(/[+-]/, '') === bt.short.replace(/[+-]/, ''); });
	const others = BLOOD_TYPES.filter(function (x) { return x.short !== bt.short && sameLetter.indexOf(x) < 0; });
	qShuffle(sameLetter); qShuffle(others);
	return sameLetter.concat(others);
}
function quizCmToFeetIn(cm) {
	const totalIn = Math.round(cm / 2.54);
	return { ft: Math.floor(totalIn / 12), inch: totalIn % 12 };
}
function quizHeightParts() {
	const cm = qRand(150, 193);
	const f = quizCmToFeetIn(cm);
	const kg = Math.round(cm - 105 + qRand(-5, 10)); // can nang hop ly theo chieu cao
	const lb = Math.round(kg * 2.20462);
	return { cm: cm, ft: f.ft, inch: f.inch, kg: kg, lb: lb };
}
function genBodyProfile() {
	// 1 cau gom: chieu cao + can nang + nhom mau (kieu My: feet/inch + pounds)
	const p = quizHeightParts();
	const bt = qPick(BLOOD_TYPES);
	const who = qPick(['He', 'She']);
	const verb = (who === 'He') ? 'He is ' : 'She is ';
	const inchWord = (p.inch === 1) ? ' inch' : ' inches';
	const speak = verb + p.ft + ' feet ' + p.inch + inchWord + ' tall, weighs ' + p.lb + ' pounds, blood type ' + bt.long + '.';
	const correct = p.ft + "'" + p.inch + '" (' + p.cm + ' cm), ' + p.lb + ' lbs (' + p.kg + ' kg), ' + bt.short;
	const opts = [correct];
	// D1: sai chieu cao (+/-1 inch -> doi ca ft/in + cm)
	const h2 = { ft: p.ft, inch: p.inch + qPick([-1, 1]) };
	if (h2.inch < 0) { h2.ft -= 1; h2.inch += 12; }
	if (h2.inch >= 12) { h2.ft += 1; h2.inch -= 12; }
	const cm2 = Math.round((h2.ft * 12 + h2.inch) * 2.54);
	opts.push(h2.ft + "'" + h2.inch + '" (' + cm2 + ' cm), ' + p.lb + ' lbs (' + p.kg + ' kg), ' + bt.short);
	// D2: sai can nang (teen/ty + giu chieu cao + nhom mau)
	let wl = qUnique(confuseTeenTy(p.lb).concat(confuseLast2(p.lb)).concat([p.lb + 1, p.lb - 1])).filter(function (v) { return v > 0 && v !== p.lb; });
	if (!wl.length) wl = [p.lb + 2];
	const lb2 = qPick(wl);
	const kg2 = Math.round(lb2 / 2.20462);
	opts.push(p.ft + "'" + p.inch + '" (' + p.cm + ' cm), ' + lb2 + ' lbs (' + kg2 + ' kg), ' + bt.short);
	// D3: sai nhom mau (giu chieu cao + can nang)
	const bt2 = quizConfuseBlood(bt)[0];
	opts.push(p.ft + "'" + p.inch + '" (' + p.cm + ' cm), ' + p.lb + ' lbs (' + p.kg + ' kg), ' + bt2.short);
	return { kind: 'weight', speakText: speak, transcript: speak, correct: correct, options: qUnique(opts) };
}

function genWeight() {
	const style = Math.random();
	if (style < 0.35) {
		// cau tong hop: chieu cao + can nang + nhom mau trong 1 cau
		return genBodyProfile();
	}
	if (style < 0.55) {
		// pounds: 110-220 (fifteen/fifty la bay nham chinh)
		const lb = qRand(110, 220);
		const correct = lb + ' pounds';
		const speak = qPick(['I weigh ', 'He weighs ', 'She weighs ']) + lb + ' pounds.';
		const opts = [correct];
		let dd = qUnique(confuseLast2(lb).concat([swapDigitsNum(lb), lb + 1, lb - 1]))
			.filter(function (v) { return v > 0 && v !== lb; });
		while (dd.length < 3) dd.push(lb + dd.length + 2);
		qShuffle(dd);
		opts.push(dd[0] + ' pounds'); opts.push(dd[1] + ' pounds'); opts.push(dd[2] + ' pounds');
		return { kind: 'weight', speakText: speak, transcript: speak, correct: correct, options: qUnique(opts) };
	} else if (style < 0.75) {
		// pounds + ounces: 7 lb 8 oz <-> 8 lb 7 oz
		const lb = qRand(5, 12);
		let oz = qRand(2, 15);
		if (oz === lb) oz = oz + 2; // tranh dao lb/oz ra dap an trung correct
		const correct = lb + ' pounds ' + oz + ' ounces';
		const speak = qPick(['The baby weighs ', 'The package weighs ']) + lb + ' pounds, ' + oz + ' ounces.';
		const opts = [correct];
		opts.push(oz + ' pounds ' + lb + ' ounces'); // dao lb/oz
		opts.push((lb + 1) + ' pounds ' + oz + ' ounces');
		let oz2 = oz + (oz >= 15 ? -1 : 1);
		opts.push(lb + ' pounds ' + oz2 + ' ounces');
		return { kind: 'weight', speakText: speak, transcript: speak, correct: correct, options: qUnique(opts) };
	}
	// kilos: so nguyen hoac 1 so le (2.5 <-> 2.05 <-> 5.2)
	const dec = Math.random() < 0.5;
	const kg = dec ? (qRand(10, 95) / 10) : qRand(3, 120);
	const kgStr = dec ? kg.toFixed(1) : String(kg);
	const correct = kgStr + ' kilos';
	const speak = 'The suitcase weighs ' + kgStr + ' kilos.';
	const opts = [correct];
	if (dec) {
		const whole = Math.floor(kg), frac = Math.round((kg - whole) * 10);
		opts.push(whole + ' kilos');
		opts.push(whole + '.' + ((frac + 5) % 10) + ' kilos');
		// dao: 2.5 -> 5.2 (neu frac == whole nhu 6.6 thi doi sang +1 de khoi trung)
		opts.push(frac !== whole ? (frac + '.' + whole + ' kilos') : ((whole + 1) + '.' + frac + ' kilos'));
	} else {
		let dd = qUnique(confuseTeenTy(kg).concat(confuseLast2(kg)).concat([swapDigitsNum(kg), kg + 1, kg - 1]))
			.filter(function (v) { return v > 0 && v !== kg; });
		while (dd.length < 3) dd.push(kg + dd.length + 2);
		opts.push(dd[0] + ' kilos'); opts.push(dd[1] + ' kilos'); opts.push(dd[2] + ' kilos');
	}
	return { kind: 'weight', speakText: speak, transcript: speak, correct: correct, options: qUnique(opts) };
}

function genSpelling() {
	// Uu tien 1: ten Anh/My that tu API (randomuser nat=us,gb ~70/30). Fail -> fallback nhom local.
	const rollNat = Math.random() < 0.7 ? 'US' : 'GB';
	const api = quizTakeApiEntry(rollNat) || quizTakeApiEntry(null);
	if (api && api.fullName) {
		const name = api.fullName;
		const tag = api.nat === 'GB' ? 'UK' : 'US';
		const spelled = name.toUpperCase().split('').join(' ');
		const speak = 'My name is ' + name + '. ' + spelled + '.';
		const opts = [name];
		// D gay nham: mutate 1-2 ky tu (nghe spelling moi phan biet duoc)
		let guard = 0;
		while (opts.length < 4 && guard++ < 20) {
			const m = quizMutateName(name);
			if (opts.indexOf(m) < 0) opts.push(m);
		}
		// van thieu -> lay ten local bo sung
		while (opts.length < 4) {
			const extra = qPick(qPick(NAME_GROUPS));
			if (opts.indexOf(extra) < 0) opts.push(extra);
		}
		return { kind: 'spelling', speakText: speak, transcript: 'My name is ' + name + ' (' + spelled + '). [' + tag + ']', correct: name, options: qUnique(opts) };
	}
	// Fallback local (logic cu)
	const g = qPick(NAME_GROUPS);
	const name = qPick(g);
	const spelled = name.toUpperCase().split('').join(' ');
	const speak = 'My name is ' + name + '. ' + spelled + '.';
	let opts = g.slice();
	qShuffle(opts);
	opts = opts.slice(0, 4);
	// nhom < 4 ten -> them ten ngoai de du 4
	if (opts.indexOf(name) < 0) { opts[0] = name; }
	while (opts.length < 4) {
		const extra = qPick(qPick(NAME_GROUPS));
		if (opts.indexOf(extra) < 0 && extra !== name) opts.push(extra);
	}
	return { kind: 'spelling', speakText: speak, transcript: 'My name is ' + name + ' (' + spelled + ').', correct: name, options: qUnique(opts) };
}

function genOneDetail(forcedKind) {
	const kinds = ['address','birthday','phone','money','weight','spelling'];
	const kind = forcedKind && forcedKind !== 'all' ? forcedKind : qPick(kinds);
	if (kind === 'address') return genAddress();
	if (kind === 'birthday') return genBirthday();
	if (kind === 'phone') return genPhone();
	if (kind === 'money') return genMoney();
	if (kind === 'weight') return genWeight();
	return genSpelling();
}

function ensureFourOptions(gen) {
	let guard = 0;
	while (gen.options.length < 4 && guard++ < 10) {
		const extra = genOneDetail(gen.kind);
		extra.options.forEach(function (o) {
			if (gen.options.indexOf(o) < 0 && o !== gen.correct && gen.options.length < 4) gen.options.push(o);
		});
	}
	// van thieu (hiem) -> nhan ban + danh dau
	while (gen.options.length < 4) gen.options.push(gen.correct + ' ');
	return gen;
}

$scope.startDetail = function (wrongOnly, noSpeak) {
	try { quizApiPrefetch(); } catch (e) {}
	let items = [];
	if (wrongOnly && $scope.detail.wrong.length) {
		items = $scope.detail.wrong.slice(0, DETAIL_ROUND_SIZE).map(function (w) {
			// phat lai cau cu: tron options
			const opts = qShuffle(w.options.slice());
			return {
				kind: w.kind,
				speakText: w.speakText,
				transcript: w.transcript,
				correct: w.correct,
				options: opts,
				correctIdx: opts.indexOf(w.correct)
			};
		});
	} else {
		for (let i = 0; i < DETAIL_ROUND_SIZE; i++) {
			const g = ensureFourOptions(genOneDetail($scope.detail.type));
			const opts = qShuffle(g.options.slice(0, 4));
			items.push({
				kind: g.kind,
				speakText: g.speakText,
				transcript: g.transcript,
				correct: g.correct,
				options: opts,
				correctIdx: opts.indexOf(g.correct)
			});
		}
	}
	$scope.detail.items = items;
	$scope.detail.index = 0;
	$scope.detail.score = 0;
	$scope.detail.streak = 0;
	$scope.detail.bestStreak = 0;
	$scope.detail.wrong = [];
	$scope.detail.finished = !items.length;
	$scope.buildDetailQuestion(!noSpeak);
};

$scope.buildDetailQuestion = function (autoSpeak) {
	const it = $scope.detail.items[$scope.detail.index];
	if (!it) { $scope.detail.finished = true; return; }
	$scope.detail.current = it;
	$scope.detail.options = it.options;
	$scope.detail.correctIdx = it.correctIdx;
	$scope.detail.picked = -1;
	$scope.detail.answered = false;
	if (autoSpeak) {
		$timeout(function () { $scope.detailSpeak(null, true); }, 350);
	}
};

$scope.detailSpeak = function (ev, isAuto) {
	if (ev) { try { ev.stopPropagation(); } catch (e) {} }
	if (!$scope.detail.current) return;
	if (!isAuto && ttsIsBusy()) return; // spam click trong luc dang phat -> bo qua
	try { (typeof Text2SpeechReplay === 'function' ? Text2SpeechReplay : Text2Speech)($scope.detail.current.speakText); } catch (e) {}
};

$scope.answerDetail = function (idx) {
	const d = $scope.detail;
	if (d.answered || idx < 0) return;
	d.answered = true;
	d.picked = idx;
	if (idx === d.correctIdx) {
		d.score += 1;
		d.streak += 1;
		if (d.streak > d.bestStreak) d.bestStreak = d.streak;
	} else {
		d.streak = 0;
		const it = d.items[d.index];
		d.wrong.push({
			kind: it.kind,
			speakText: it.speakText,
			transcript: it.transcript,
			correct: it.correct,
			options: it.options.slice()
		});
	}
};

$scope.nextDetail = function () {
	$scope.detail.index += 1;
	if ($scope.detail.index >= $scope.detail.items.length) {
		$scope.detail.current = null;
		$scope.detail.finished = true;
	} else {
		$scope.buildDetailQuestion(true);
	}
};
// Click dòng đáp án: chưa trả lời -> chọn; đã trả lời (đúng/sai) -> phát âm đáp án đó
$scope.clickDetailOption = function (ev, idx) {
	const d = $scope.detail;
	if (ev) { try { ev.stopPropagation(); } catch (e) {} }
	if (!d.answered) { $scope.answerDetail(idx); return; }
	if (ttsIsBusy()) return;
	const text = d.options[idx];
	if (text) { try { (typeof Text2SpeechReplay === 'function' ? Text2SpeechReplay : Text2Speech)(String(text)); } catch (e) {} }
};
$scope.retryWrongDetail = function () { $scope.startDetail(true); };

$scope.detailKindLabel = function (k) {
	if (k === 'address') return 'Address (US)';
	if (k === 'birthday') return 'Birthday';
	if (k === 'phone') return 'Phone (US)';
	if (k === 'money') return 'Money';
	if (k === 'weight') return 'Body';
	if (k === 'spelling') return 'Name (US/UK)';
	return k;
};

// =====================================================
// SECTION 3: Picture quiz - Mon an / Fruit / Insects
// Anh tu API free, khong key, CORS *:
// - Mon an: TheMealDB (chinh) + Wikipedia (phu)
// - Fruit/Insects: Wikipedia REST summary
// Docs: https://www.themealdb.com/api.php , https://en.wikipedia.org/api/rest_v1/
// =====================================================
const PIC_ROUND_SIZE = 20;

const PIC_FOODS = [
	{ en: 'rice', vi: 'cơm' }, { en: 'noodles', vi: 'mì' },
	{ en: 'bread', vi: 'bánh mì' }, { en: 'egg', vi: 'trứng' },
	{ en: 'milk', vi: 'sữa' }, { en: 'cheese', vi: 'phô mai' },
	{ en: 'butter', vi: 'bơ' }, { en: 'chicken', vi: 'thịt gà' },
	{ en: 'beef', vi: 'thịt bò' }, { en: 'pork', vi: 'thịt heo' },
	{ en: 'fish', vi: 'cá' }, { en: 'shrimp', vi: 'tôm' },
	{ en: 'crab', vi: 'cua' }, { en: 'soup', vi: 'súp' },
	{ en: 'salad', vi: 'salad' }, { en: 'pizza', vi: 'pizza' },
	{ en: 'hamburger', vi: 'hamburger' }, { en: 'sandwich', vi: 'sandwich' },
	{ en: 'cake', vi: 'bánh ngọt' }, { en: 'ice cream', vi: 'kem' },
	{ en: 'chocolate', vi: 'sô cô la' }, { en: 'candy', vi: 'kẹo' },
	{ en: 'coffee', vi: 'cà phê' }, { en: 'tea', vi: 'trà' },
	{ en: 'juice', vi: 'nước ép' }, { en: 'sugar', vi: 'đường' },
	{ en: 'salt', vi: 'muối' }, { en: 'pepper', vi: 'hạt tiêu' },
	{ en: 'garlic', vi: 'tỏi' }, { en: 'onion', vi: 'hành' },
	{ en: 'potato', vi: 'khoai tây' }, { en: 'tomato', vi: 'cà chua' },
	{ en: 'carrot', vi: 'cà rốt' }, { en: 'spring rolls', vi: 'chả giò' },
	{ en: 'pho', vi: 'phở' }
];
const PIC_FRUITS = [
	{ en: 'apple', vi: 'táo' }, { en: 'banana', vi: 'chuối' },
	{ en: 'orange', vi: 'cam' }, { en: 'mango', vi: 'xoài' },
	{ en: 'pineapple', vi: 'dứa' }, { en: 'watermelon', vi: 'dưa hấu' },
	{ en: 'grapes', vi: 'nho' }, { en: 'strawberry', vi: 'dâu tây' },
	{ en: 'lemon', vi: 'chanh vàng' }, { en: 'coconut', vi: 'dừa' },
	{ en: 'papaya', vi: 'đu đủ' }, { en: 'avocado', vi: 'quả bơ' },
	{ en: 'peach', vi: 'đào' }, { en: 'pear', vi: 'lê' },
	{ en: 'cherry', vi: 'anh đào' }, { en: 'kiwi', vi: 'kiwi' },
	{ en: 'plum', vi: 'mận' }, { en: 'durian', vi: 'sầu riêng' },
	{ en: 'jackfruit', vi: 'mít' }, { en: 'longan', vi: 'nhãn' },
	{ en: 'lychee', vi: 'vải' }, { en: 'pomelo', vi: 'bưởi' },
	{ en: 'tangerine', vi: 'quýt' }, { en: 'apricot', vi: 'mơ' }
];
const PIC_INSECTS = [
	{ en: 'ant', vi: 'kiến' }, { en: 'bee', vi: 'ong' },
	{ en: 'wasp', vi: 'ong bắp cày' }, { en: 'butterfly', vi: 'bướm' },
	{ en: 'moth', vi: 'bướm đêm' }, { en: 'mosquito', vi: 'muỗi' },
	{ en: 'fly', vi: 'ruồi' }, { en: 'spider', vi: 'nhện' },
	{ en: 'cockroach', vi: 'gián' }, { en: 'beetle', vi: 'bọ cánh cứng' },
	{ en: 'cricket', vi: 'dế' }, { en: 'grasshopper', vi: 'châu chấu' },
	{ en: 'ladybug', vi: 'bọ rùa' }, { en: 'dragonfly', vi: 'chuồn chuồn' },
	{ en: 'termite', vi: 'mối' }, { en: 'firefly', vi: 'đom đóm' },
	{ en: 'caterpillar', vi: 'sâu bướm' }, { en: 'centipede', vi: 'rết' },
	{ en: 'scorpion', vi: 'bọ cạp' }, { en: 'flea', vi: 'bọ chét' }
];

const PIC_IMG_CACHE = {};
function picFetchWiki(name) {
	if (typeof fetch !== 'function') return Promise.resolve(null);
	const url = 'https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(name);
	return fetch(url).then(function (r) {
		if (!r.ok) return null;
		return r.json();
	}).then(function (data) {
		if (data && data.thumbnail && data.thumbnail.source) return data.thumbnail.source;
		if (data && data.originalimage && data.originalimage.source) return data.originalimage.source;
		return null;
	}).catch(function () { return null; });
}
function picFetchMeal(name) {
	if (typeof fetch !== 'function') return Promise.resolve(null);
	const url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=' + encodeURIComponent(name);
	return fetch(url).then(function (r) {
		if (!r.ok) return null;
		return r.json();
	}).then(function (data) {
		const meals = (data && data.meals) || [];
		if (meals.length && meals[0].strMealThumb) return meals[0].strMealThumb;
		return null;
	}).catch(function () { return null; });
}
function picFetchImage(item) {
	if (!item) return Promise.resolve(null);
	const key = String(item.en).toLowerCase();
	if (PIC_IMG_CACHE[key]) return Promise.resolve(PIC_IMG_CACHE[key]);
	let p;
	if (item.kind === 'food') {
		p = picFetchMeal(item.en).then(function (u) {
			if (u) return u;
			return picFetchWiki(item.en);
		});
	} else {
		p = picFetchWiki(item.en);
	}
	return p.then(function (u) {
		if (u) PIC_IMG_CACHE[key] = u;
		return u || null;
	});
}
function picPrefetch(items) {
	if (typeof fetch !== 'function') return;
	items.forEach(function (it) {
		try { picFetchImage(it); } catch (e) {}
	});
}
function picPoolOf(type) {
	const out = [];
	function push(list, kind) {
		list.forEach(function (x) { out.push({ en: x.en, vi: x.vi, kind: kind }); });
	}
	if (!type || type === 'all' || type === 'food') push(PIC_FOODS, 'food');
	if (!type || type === 'all' || type === 'fruit') push(PIC_FRUITS, 'fruit');
	if (!type || type === 'all' || type === 'insect') push(PIC_INSECTS, 'insect');
	return out;
}

$scope.pic = {
	type: 'all', // all | food | fruit | insect
	items: [],
	index: 0,
	current: null,
	options: [],
	correctIdx: -1,
	picked: -1,
	answered: false,
	score: 0,
	streak: 0,
	bestStreak: 0,
	wrong: [],
	finished: false,
	imgSrc: '',
	imgLoading: true
};

$scope.setPicType = function (t) {
	$scope.pic.type = t;
	$scope.startPic();
};

$scope.picKindLabel = function (k) {
	if (k === 'food') return 'Mon an';
	if (k === 'fruit') return 'Fruit';
	if (k === 'insect') return 'Insect';
	return k;
};

$scope.startPic = function (wrongOnly) {
	try { Text2SpeechStop(); } catch (e) {}
	let pool;
	if (wrongOnly && $scope.pic.wrong.length) {
		pool = $scope.pic.wrong.map(function (w) {
			return { en: w.en, vi: w.vi, kind: w.kind };
		});
	} else {
		pool = picPoolOf($scope.pic.type);
	}
	const items = qShuffle(pool.slice()).slice(0, PIC_ROUND_SIZE);
	$scope.pic.items = items;
	$scope.pic.index = 0;
	$scope.pic.score = 0;
	$scope.pic.streak = 0;
	$scope.pic.bestStreak = 0;
	$scope.pic.wrong = [];
	$scope.pic.finished = !items.length;
	try { picPrefetch(items); } catch (e) {}
	$scope.buildPicQuestion();
};

$scope.buildPicQuestion = function () {
	const cur = $scope.pic.items[$scope.pic.index];
	if (!cur) { $scope.pic.finished = true; return; }
	$scope.pic.current = cur;
	// distractor: uu tien cung kind
	const same = $scope.pic.items.filter(function (x) { return x.kind === cur.kind && x.en !== cur.en; });
	const others = picPoolOf($scope.pic.type).filter(function (x) {
		return x.en !== cur.en && x.kind !== cur.kind;
	});
	qShuffle(same);
	qShuffle(others);
	const picks = [cur];
	(same.concat(others)).forEach(function (x) {
		if (picks.length >= 4) return;
		let dup = false;
		for (let i = 0; i < picks.length; i++) {
			if (picks[i].en === x.en) { dup = true; break; }
		}
		if (!dup) picks.push(x);
	});
	const opts = qShuffle(picks);
	$scope.pic.options = opts;
	$scope.pic.correctIdx = -1;
	for (let i = 0; i < opts.length; i++) {
		if (opts[i].en === cur.en) { $scope.pic.correctIdx = i; break; }
	}
	$scope.pic.picked = -1;
	$scope.pic.answered = false;
	// load anh tu API
	$scope.pic.imgLoading = true;
	$scope.pic.imgSrc = '';
	try {
		picFetchImage(cur).then(function (url) {
			$timeout(function () {
				if ($scope.pic.current !== cur) return;
				$scope.pic.imgSrc = url || '';
				$scope.pic.imgLoading = false;
			});
		});
	} catch (e) {
		$scope.pic.imgLoading = false;
	}
};

$scope.answerPic = function (idx) {
	const p = $scope.pic;
	if (p.answered || idx < 0) return;
	p.answered = true;
	p.picked = idx;
	if (idx === p.correctIdx) {
		p.score += 1;
		p.streak += 1;
		if (p.streak > p.bestStreak) p.bestStreak = p.streak;
	} else {
		p.streak = 0;
		p.wrong.push({ en: p.current.en, vi: p.current.vi, kind: p.current.kind });
	}
};

$scope.nextPic = function () {
	$scope.pic.index += 1;
	if ($scope.pic.index >= $scope.pic.items.length) {
		$scope.pic.current = null;
		$scope.pic.finished = true;
	} else {
		$scope.buildPicQuestion();
	}
};
$scope.retryWrongPic = function () { $scope.startPic(true); };

// Click dòng đáp án: chưa trả lời -> chọn; đã trả lời (đúng/sai) -> phát âm từ đó
$scope.clickPicOption = function (ev, idx) {
	if (ev) { try { ev.stopPropagation(); } catch (e) {} }
	if (!$scope.pic.answered) { $scope.answerPic(idx); return; }
	const opt = $scope.pic.options[idx];
	if (opt && opt.en) $scope.picSpeak(ev, opt.en);
};

$scope.picSpeak = function (ev, text, force) {
	if (ev && ev.stopPropagation) { try { ev.stopPropagation(); } catch (e) {} }
	// cho phép gọi picSpeak(ev, true) để force replay, hoặc picSpeak(ev, 'word')
	let word = null, forceReplay = false;
	if (typeof text === 'string') word = text;
	else if (text === true) forceReplay = true;
	if (force === true) forceReplay = true;
	if (!word) {
		if (!$scope.pic.current) return;
		word = $scope.pic.current.en;
	}
	if (!forceReplay && ttsIsBusy()) return;
	try { (typeof Text2SpeechReplay === 'function' ? Text2SpeechReplay : Text2Speech)(word); } catch (e) {}
};

// init (khong tu phat tieng khi vua mo trang)
try { quizApiPrefetch(); } catch (e) {}
$scope.startQuiz(false, true);
$scope.startDetail(false, true);
$scope.startPic(false);

});
