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

$scope.mode = 'voca'; // 'voca' | 'detail' | 'pic' | 'dir' | 'nail'
$scope.setMode = function (m) {
	$scope.mode = m;
	try { Text2SpeechStop(); } catch (e) {}
	// chuyen tab thi doc lai cau hien tai (neu la dang nghe)
	$timeout(function () {
		if (m === 'detail' && $scope.detail.current && !$scope.detail.answered && !$scope.detail.finished) {
			$scope.detailSpeak(null, true);
		} else if (m === 'dir' && $scope.dir.current && !$scope.dir.answered && !$scope.dir.finished) {
			$scope.dirSpeak(null, true);
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
// SECTION 3: Picture quiz - Mon an / Fruit / Insects / Nail
// Anh tu API free, khong key, CORS *: TheMealDB (mon an) + Wikipedia (con lai)
// =====================================================
const PIC_ROUND_SIZE = 20;

const PIC_FOODS = [
	{ en: 'oatmeal', vi: 'cháo yến mạch' }, { en: 'cereal', vi: 'ngũ cốc ăn sáng' }, { en: 'pancakes', vi: 'bánh pancake' }, { en: 'waffles', vi: 'bánh waffle' }, { en: 'toast', vi: 'bánh mì nướng' }, { en: 'bagel', vi: 'bánh vòng bagel' }, { en: 'muffin', vi: 'bánh muffin' }, { en: 'donut', vi: 'bánh donut' }, { en: 'croissant', vi: 'bánh sừng bò' }, { en: 'pretzel', vi: 'bánh xoắn mặn' },
    { en: 'bacon', vi: 'thịt xông khói' }, { en: 'sausage', vi: 'xúc xích' }, { en: 'ham', vi: 'giăm bông' }, { en: 'turkey', vi: 'thịt gà tây' }, { en: 'duck', vi: 'thịt vịt' }, { en: 'lamb', vi: 'thịt cừu' }, { en: 'steak', vi: 'bít tết' }, { en: 'meatball', vi: 'thịt viên' }, { en: 'hot dog', vi: 'xúc xích hot dog' }, { en: 'fried chicken', vi: 'gà rán' },
    { en: 'fried rice', vi: 'cơm chiên' }, { en: 'fried noodles', vi: 'mì xào' }, { en: 'ramen', vi: 'mì ramen' }, { en: 'spaghetti', vi: 'mì Ý spaghetti' }, { en: 'macaroni', vi: 'mì macaroni' }, { en: 'lasagna', vi: 'mì lasagna' }, { en: 'dumplings', vi: 'há cảo/bánh bột' }, { en: 'wontons', vi: 'hoành thánh' }, { en: 'tacos', vi: 'bánh taco' }, { en: 'burrito', vi: 'bánh burrito' },
    { en: 'nachos', vi: 'nachos' }, { en: 'quesadilla', vi: 'bánh quesadilla' }, { en: 'french fries', vi: 'khoai tây chiên' }, { en: 'mashed potatoes', vi: 'khoai tây nghiền' }, { en: 'baked potato', vi: 'khoai tây nướng' }, { en: 'onion rings', vi: 'hành tây chiên vòng' }, { en: 'coleslaw', vi: 'salad bắp cải' }, { en: 'mac and cheese', vi: 'mì nui phô mai' }, { en: 'grilled cheese', vi: 'bánh mì phô mai nướng' }, { en: 'meatloaf', vi: 'bánh thịt' },
    { en: 'clam chowder', vi: 'súp nghêu' }, { en: 'chicken soup', vi: 'súp gà' }, { en: 'tomato soup', vi: 'súp cà chua' }, { en: 'mushroom soup', vi: 'súp nấm' }, { en: 'beef stew', vi: 'bò hầm' }, { en: 'chicken wings', vi: 'cánh gà' }, { en: 'chicken nuggets', vi: 'gà viên' }, { en: 'fish and chips', vi: 'cá chiên và khoai tây' }, { en: 'grilled chicken', vi: 'gà nướng' }, { en: 'barbecue ribs', vi: 'sườn nướng BBQ' },
    { en: 'tuna', vi: 'cá ngừ' }, { en: 'salmon', vi: 'cá hồi' }, { en: 'cod', vi: 'cá tuyết' }, { en: 'squid', vi: 'mực' }, { en: 'octopus', vi: 'bạch tuộc' }, { en: 'lobster', vi: 'tôm hùm' }, { en: 'oyster', vi: 'hàu' }, { en: 'clam', vi: 'nghêu' }, { en: 'mussel', vi: 'vẹm' }, { en: 'scallop', vi: 'sò điệp' },
    { en: 'mushroom', vi: 'nấm' }, { en: 'broccoli', vi: 'bông cải xanh' }, { en: 'cauliflower', vi: 'súp lơ trắng' }, { en: 'cabbage', vi: 'bắp cải' }, { en: 'lettuce', vi: 'xà lách' }, { en: 'spinach', vi: 'rau bina' }, { en: 'corn', vi: 'bắp/ngô' }, { en: 'peas', vi: 'đậu Hà Lan' }, { en: 'green beans', vi: 'đậu que' }, { en: 'celery', vi: 'cần tây' },
    { en: 'bell pepper', vi: 'ớt chuông' }, { en: 'chili pepper', vi: 'ớt cay' }, { en: 'ginger', vi: 'gừng' }, { en: 'scallion', vi: 'hành lá' }, { en: 'cilantro', vi: 'ngò rí' }, { en: 'basil', vi: 'húng quế' }, { en: 'mayo', vi: 'sốt mayonnaise' }, { en: 'ketchup', vi: 'tương cà' }, { en: 'mustard', vi: 'mù tạt' }, { en: 'hot sauce', vi: 'tương ớt' },
    { en: 'soy sauce', vi: 'nước tương' }, { en: 'fish sauce', vi: 'nước mắm' }, { en: 'vinegar', vi: 'giấm' }, { en: 'honey', vi: 'mật ong' }, { en: 'flour', vi: 'bột mì' }, { en: 'cornstarch', vi: 'bột bắp' }, { en: 'cooking oil', vi: 'dầu ăn' }, { en: 'olive oil', vi: 'dầu ô liu' }, { en: 'peanut butter', vi: 'bơ đậu phộng' }, { en: 'jam', vi: 'mứt' },
    { en: 'yogurt', vi: 'sữa chua' }, { en: 'cream', vi: 'kem sữa' }, { en: 'whipped cream', vi: 'kem tươi đánh bông' }, { en: 'pudding', vi: 'bánh pudding' }, { en: 'brownie', vi: 'bánh brownie' }, { en: 'cookie', vi: 'bánh quy' }, { en: 'pie', vi: 'bánh pie' }, { en: 'cheesecake', vi: 'bánh phô mai' }, { en: 'popcorn', vi: 'bỏng ngô' }, { en: 'chips', vi: 'khoai tây lát chiên' },
    { en: 'smoothie', vi: 'sinh tố' }, { en: 'milkshake', vi: 'sữa lắc' }, { en: 'soda', vi: 'nước ngọt có ga' }, { en: 'lemonade', vi: 'nước chanh' }, { en: 'hot chocolate', vi: 'sô cô la nóng' }, { en: 'sparkling water', vi: 'nước có ga' }, { en: 'coconut milk', vi: 'nước cốt dừa' }, { en: 'soy milk', vi: 'sữa đậu nành' }, { en: 'almond milk', vi: 'sữa hạnh nhân' }, { en: 'protein shake', vi: 'sữa lắc protein' }
];
const PIC_FRUITS = [
	{ en: 'pomegranate', vi: 'lựu' }, { en: 'grapefruit', vi: 'bưởi chùm' }, { en: 'lime', vi: 'chanh xanh' }, { en: 'passion fruit', vi: 'chanh dây' }, { en: 'guava', vi: 'ổi' }, { en: 'dragon fruit', vi: 'thanh long' }, { en: 'star fruit', vi: 'khế' }, { en: 'custard apple', vi: 'na' }, { en: 'soursop', vi: 'mãng cầu xiêm' }, { en: 'sapodilla', vi: 'hồng xiêm' },
    { en: 'persimmon', vi: 'hồng' }, { en: 'fig', vi: 'sung' }, { en: 'date', vi: 'chà là' }, { en: 'mulberry', vi: 'dâu tằm' }, { en: 'raspberry', vi: 'mâm xôi đỏ' }, { en: 'blackberry', vi: 'mâm xôi đen' }, { en: 'blueberry', vi: 'việt quất' }, { en: 'cranberry', vi: 'nam việt quất' }, { en: 'gooseberry', vi: 'lý gai' }, { en: 'blackcurrant', vi: 'lý chua đen' },
    { en: 'redcurrant', vi: 'lý chua đỏ' }, { en: 'grape', vi: 'quả nho' }, { en: 'cantaloupe', vi: 'dưa lưới' }, { en: 'honeydew', vi: 'dưa mật' }, { en: 'melon', vi: 'dưa' }, { en: 'cucumber', vi: 'dưa chuột' }, { en: 'cranberry', vi: 'quả nam việt quất' }, { en: 'elderberry', vi: 'quả cơm cháy' }, { en: 'boysenberry', vi: 'mâm xôi lai' }, { en: 'loganberry', vi: 'mâm xôi lai đỏ' },
    { en: 'breadfruit', vi: 'sa kê' }, { en: 'plantain', vi: 'chuối lá' }, { en: 'quince', vi: 'mộc qua' }, { en: 'nectarine', vi: 'xuân đào' }, { en: 'persimmon', vi: 'quả hồng' }, { en: 'olive', vi: 'ô liu' }, { en: 'kumquat', vi: 'tắc' }, { en: 'tamarind', vi: 'me' }, { en: 'rambutan', vi: 'chôm chôm' }, { en: 'mangosteen', vi: 'măng cụt' },
    { en: 'salak', vi: 'mây thái' }, { en: 'santol', vi: 'bòn bon' }, { en: 'langsat', vi: 'dâu da' }, { en: 'pulasan', vi: 'mận lông' }, { en: 'star apple', vi: 'vú sữa' }, { en: 'rose apple', vi: 'mận' }, { en: 'wax apple', vi: 'mận roi' }, { en: 'water apple', vi: 'roi' }, { en: 'ambarella', vi: 'cóc' }, { en: 'bilimbi', vi: 'khế tàu' },
    { en: 'breadnut', vi: 'quả sa kê hạt' }, { en: 'monstera fruit', vi: 'quả monstera' }, { en: 'ackee', vi: 'ackee' }, { en: 'feijoa', vi: 'ổi dứa' }, { en: 'loquat', vi: 'tỳ bà' }, { en: 'medlar', vi: 'sơn tra châu Âu' }, { en: 'hawthorn', vi: 'sơn tra' }, { en: 'persimmon', vi: 'quả hồng' }, { en: 'miracle fruit', vi: 'quả thần kỳ' }, { en: 'jabuticaba', vi: 'jabuticaba' },
    { en: 'cherimoya', vi: 'mãng cầu ta' }, { en: 'atemoya', vi: 'mãng cầu lai' }, { en: 'sugar apple', vi: 'mãng cầu' }, { en: 'black sapote', vi: 'hồng socola' }, { en: 'mamey sapote', vi: 'sapôchê mamey' }, { en: 'canistel', vi: 'trứng gà' }, { en: 'lucuma', vi: 'lúcuma' }, { en: 'tamarillo', vi: 'cà chua thân gỗ' }, { en: 'physalis', vi: 'tầm bóp' }, { en: 'cape gooseberry', vi: 'thù lù' },
    { en: 'horned melon', vi: 'dưa sừng' }, { en: 'bitter melon', vi: 'mướp đắng' }, { en: 'winter melon', vi: 'bí đao' }, { en: 'pumpkin', vi: 'bí ngô' }, { en: 'squash', vi: 'bí' }, { en: 'zucchini', vi: 'bí ngòi' }, { en: 'cactus pear', vi: 'lê gai' }, { en: 'prickly pear', vi: 'xương rồng lê gai' }, { en: 'kiwano', vi: 'dưa sừng châu Phi' }, { en: 'pepino', vi: 'dưa pepino' },
    { en: 'muscadine', vi: 'nho muscadine' }, { en: 'concord grape', vi: 'nho concord' }, { en: 'raisins', vi: 'nho khô' }, { en: 'currant', vi: 'quả lý chua' }, { en: 'sloe', vi: 'mận gai' }, { en: 'damson', vi: 'mận damson' }, { en: 'greengage', vi: 'mận xanh' }, { en: 'mirabelle', vi: 'mận mirabelle' }, { en: 'cloudberry', vi: 'mâm xôi vàng' }, { en: 'lingonberry', vi: 'việt quất đỏ' },
    { en: 'huckleberry', vi: 'huckleberry' }, { en: 'goji berry', vi: 'kỷ tử' }, { en: 'acai berry', vi: 'quả acai' }, { en: 'aronia berry', vi: 'quả chokeberry' }, { en: 'juniper berry', vi: 'quả bách xù' }, { en: 'sea buckthorn', vi: 'hắc mai biển' }, { en: 'serviceberry', vi: 'quả serviceberry' }, { en: 'salmonberry', vi: 'mâm xôi cá hồi' }, { en: 'dewberry', vi: 'mâm xôi dại' }, { en: 'marionberry', vi: 'mâm xôi marion' },
    { en: 'persian lime', vi: 'chanh Ba Tư' }, { en: 'key lime', vi: 'chanh key' }, { en: 'yuzu', vi: 'yuzu' }, { en: 'citron', vi: 'thanh yên' }, { en: 'bergamot', vi: 'cam bergamot' }, { en: 'pomelo', vi: 'bưởi' }, { en: 'mandarin', vi: 'quýt' }, { en: 'clementine', vi: 'quýt clementine' }, { en: 'tangelo', vi: 'quýt lai bưởi' }, { en: 'blood orange', vi: 'cam đỏ' }
];
const PIC_INSECTS = [
	 { en: 'earwig', vi: 'bọ kẹp kìm' }, { en: 'silverfish', vi: 'bọ bạc' }, { en: 'booklouse', vi: 'rận sách' }, { en: 'weevil', vi: 'mọt' }, { en: 'stink bug', vi: 'bọ xít' }, { en: 'water bug', vi: 'bọ nước' }, { en: 'water strider', vi: 'bọ gọng vó' }, { en: 'praying mantis', vi: 'bọ ngựa' }, { en: 'walking stick', vi: 'bọ que' }, { en: 'leaf insect', vi: 'bọ lá' },
    { en: 'cicada', vi: 've sầu' }, { en: 'cicada nymph', vi: 'ấu trùng ve sầu' }, { en: 'mayfly', vi: 'phù du' }, { en: 'dragonfly nymph', vi: 'ấu trùng chuồn chuồn' }, { en: 'damselfly', vi: 'chuồn chuồn kim' }, { en: 'lacewing', vi: 'bọ cánh ren' }, { en: 'antlion', vi: 'bọ sư tử kiến' }, { en: 'dobsonfly', vi: 'ruồi dobson' }, { en: 'stonefly', vi: 'phù du đá' }, { en: 'caddisfly', vi: 'ruồi cánh lông' },
    { en: 'mayfly', vi: 'con phù du' }, { en: 'horsefly', vi: 'ruồi trâu' }, { en: 'fruit fly', vi: 'ruồi giấm' }, { en: 'housefly', vi: 'ruồi nhà' }, { en: 'drain fly', vi: 'ruồi cống' }, { en: 'blowfly', vi: 'ruồi xanh' }, { en: 'gnat', vi: 'muỗi nhỏ' }, { en: 'midge', vi: 'muỗi dĩn' }, { en: 'black fly', vi: 'ruồi đen' }, { en: 'sandfly', vi: 'ruồi cát' },
    { en: 'bumblebee', vi: 'ong nghệ' }, { en: 'honeybee', vi: 'ong mật' }, { en: 'carpenter bee', vi: 'ong thợ mộc' }, { en: 'hornet', vi: 'ong vò vẽ' }, { en: 'paper wasp', vi: 'ong giấy' }, { en: 'yellowjacket', vi: 'ong vàng' }, { en: 'mud dauber', vi: 'ong đất' }, { en: 'ichneumon wasp', vi: 'ong ký sinh' }, { en: 'fig wasp', vi: 'ong sung' }, { en: 'sawfly', vi: 'ong cưa' },
    { en: 'mole cricket', vi: 'dế trũi' }, { en: 'field cricket', vi: 'dế đồng' }, { en: 'house cricket', vi: 'dế nhà' }, { en: 'katydid', vi: 'châu chấu lá' }, { en: 'locust', vi: 'châu chấu' }, { en: 'mormon cricket', vi: 'dế Mormon' }, { en: 'tree cricket', vi: 'dế cây' }, { en: 'camel cricket', vi: 'dế lạc đà' }, { en: 'bush cricket', vi: 'dế bụi' }, { en: 'jerusalem cricket', vi: 'dế Jerusalem' },
    { en: 'stag beetle', vi: 'bọ hươu' }, { en: 'rhinoceros beetle', vi: 'bọ tê giác' }, { en: 'jewel beetle', vi: 'bọ kim bảo' }, { en: 'click beetle', vi: 'bọ bật' }, { en: 'longhorn beetle', vi: 'bọ xén tóc' }, { en: 'tiger beetle', vi: 'bọ hổ' }, { en: 'dung beetle', vi: 'bọ hung' }, { en: 'water beetle', vi: 'bọ nước' }, { en: 'darkling beetle', vi: 'bọ cánh cứng đen' }, { en: 'soldier beetle', vi: 'bọ lính' },
    { en: 'weevil', vi: 'mọt vòi voi' }, { en: 'grain beetle', vi: 'bọ hạt' }, { en: 'flour beetle', vi: 'bọ bột' }, { en: 'carpet beetle', vi: 'bọ thảm' }, { en: 'bark beetle', vi: 'bọ vỏ cây' }, { en: 'potato beetle', vi: 'bọ khoai tây' }, { en: 'leaf beetle', vi: 'bọ ăn lá' }, { en: 'blister beetle', vi: 'bọ phồng rộp' }, { en: 'rove beetle', vi: 'bọ cánh ngắn' }, { en: 'ladybird', vi: 'bọ rùa' },
    { en: 'fire ant', vi: 'kiến lửa' }, { en: 'carpenter ant', vi: 'kiến thợ mộc' }, { en: 'black ant', vi: 'kiến đen' }, { en: 'red ant', vi: 'kiến đỏ' }, { en: 'army ant', vi: 'kiến quân đội' }, { en: 'leafcutter ant', vi: 'kiến cắt lá' }, { en: 'weaver ant', vi: 'kiến vàng' }, { en: 'bullet ant', vi: 'kiến đạn' }, { en: 'harvester ant', vi: 'kiến thu hoạch' }, { en: 'ghost ant', vi: 'kiến ma' },
    { en: 'termite queen', vi: 'mối chúa' }, { en: 'termite worker', vi: 'mối thợ' }, { en: 'flea beetle', vi: 'bọ nhảy' }, { en: 'bedbug', vi: 'rệp giường' }, { en: 'head louse', vi: 'chấy đầu' }, { en: 'body louse', vi: 'rận thân' }, { en: 'pubic louse', vi: 'rận mu' }, { en: 'tick', vi: 've' }, { en: 'mite', vi: 'con mạt' }, { en: 'dust mite', vi: 'mạt bụi' },
    { en: 'tarantula', vi: 'nhện tarantula' }, { en: 'black widow', vi: 'nhện góa phụ đen' }, { en: 'wolf spider', vi: 'nhện sói' }, { en: 'jumping spider', vi: 'nhện nhảy' }, { en: 'orb-weaver', vi: 'nhện giăng lưới' }, { en: 'crab spider', vi: 'nhện cua' }, { en: 'funnel-web spider', vi: 'nhện mạng phễu' }, { en: 'cellar spider', vi: 'nhện chân dài' }, { en: 'house spider', vi: 'nhện nhà' }, { en: 'garden spider', vi: 'nhện vườn' },
];
// Tu vung nghe Nail (My) - lay tu ebooks/spkBook/data/nail/nail.js trong app.
// Dung cho SECTION 5 (Nail quiz 2 chieu, khong anh).
const PIC_NAILS = [
	{ en: 'nail tip', vi: 'móng tip' }, { en: 'nail tips', vi: 'tip móng' }, { en: 'nail glue', vi: 'keo dán móng' }, { en: 'nail form', vi: 'form móng' }, { en: 'acrylic liquid', vi: 'dung dịch acrylic' }, { en: 'monomer', vi: 'dung dịch monomer' }, { en: 'dip powder', vi: 'bột nhúng' }, { en: 'dip powder nails', vi: 'móng bột nhúng' }, { en: 'builder gel', vi: 'gel đắp móng' }, { en: 'hard gel', vi: 'gel cứng' },
    { en: 'soft gel', vi: 'gel mềm' }, { en: 'polygel', vi: 'polygel' }, { en: 'gel extension', vi: 'móng nối gel' }, { en: 'gel-x', vi: 'móng Gel-X' }, { en: 'overlay', vi: 'lớp phủ trên móng thật' }, { en: 'acrylic overlay', vi: 'phủ acrylic lên móng thật' }, { en: 'gel overlay', vi: 'phủ gel lên móng thật' }, { en: 'nail extension', vi: 'móng nối dài' }, { en: 'extension', vi: 'móng nối' }, { en: 'press-on nails', vi: 'móng dán' },
    { en: 'soak-off', vi: 'tháo bằng cách ngâm' }, { en: 'gel removal', vi: 'tháo gel' }, { en: 'acrylic removal', vi: 'tháo acrylic' }, { en: 'dip removal', vi: 'tháo bột nhúng' }, { en: 'polish removal', vi: 'tẩy sơn' }, { en: 'fill-in', vi: 'dặm móng' }, { en: 'fill', vi: 'dặm phần mọc ra' }, { en: 'rebalance', vi: 'cân chỉnh lại móng' }, { en: 'repair', vi: 'sửa móng' }, { en: 'nail repair', vi: 'sửa móng' },
    { en: 'short', vi: 'ngắn' }, { en: 'medium', vi: 'vừa' }, { en: 'long', vi: 'dài' }, { en: 'extra long', vi: 'rất dài' }, { en: 'square', vi: 'vuông' }, { en: 'squoval', vi: 'vuông bo góc' }, { en: 'round', vi: 'tròn' }, { en: 'oval', vi: 'oval' }, { en: 'almond shape', vi: 'dáng hạnh nhân' }, { en: 'coffin shape', vi: 'dáng coffin' },
    { en: 'ballerina', vi: 'dáng ballerina' }, { en: 'stiletto shape', vi: 'dáng stiletto' }, { en: 'tapered square', vi: 'vuông thuôn' }, { en: 'nail length', vi: 'độ dài móng' }, { en: 'nail shape', vi: 'dáng móng' }, { en: 'free edge', vi: 'phần móng chìa ra' }, { en: 'sidewall', vi: 'thành bên móng' }, { en: 'apex', vi: 'điểm cao nhất của móng' }, { en: 'nail plate', vi: 'bản móng' }, { en: 'lunula', vi: 'bán nguyệt móng' },
    { en: 'hangnail', vi: 'xước da quanh móng' }, { en: 'dry cuticles', vi: 'da quanh móng bị khô' }, { en: 'dry skin', vi: 'da khô' }, { en: 'callus', vi: 'chai chân' }, { en: 'callus remover', vi: 'dung dịch tẩy chai' }, { en: 'foot scrub', vi: 'tẩy tế bào chết chân' }, { en: 'foot soak', vi: 'ngâm chân' }, { en: 'spa treatment', vi: 'chăm sóc spa' }, { en: 'hot towel', vi: 'khăn nóng' }, { en: 'massage', vi: 'massage' },
    { en: 'lotion', vi: 'kem dưỡng' }, { en: 'scrub', vi: 'kem tẩy tế bào chết' }, { en: 'paraffin wax', vi: 'sáp paraffin' }, { en: 'paraffin treatment', vi: 'liệu trình paraffin' }, { en: 'cuticle remover', vi: 'dung dịch làm mềm da' }, { en: 'nail dehydrator', vi: 'dung dịch làm khô móng' }, { en: 'nail primer', vi: 'primer móng' }, { en: 'bond', vi: 'dung dịch tạo liên kết' }, { en: 'lint-free wipe', vi: 'khăn không xơ' }, { en: 'alcohol wipe', vi: 'khăn lau cồn' },
    { en: 'dust collector', vi: 'máy hút bụi móng' }, { en: 'UV lamp', vi: 'đèn UV' }, { en: 'lamp', vi: 'đèn hơ móng' }, { en: 'drill', vi: 'máy mài' }, { en: 'e-file', vi: 'máy mài điện' }, { en: 'mandrel', vi: 'trục gắn đầu mài' }, { en: 'sanding band', vi: 'ống nhám mài' }, { en: 'diamond bit', vi: 'đầu mài kim cương' }, { en: 'ceramic bit', vi: 'đầu mài ceramic' }, { en: 'carbide bit', vi: 'đầu mài carbide' },
    { en: 'nail art brush', vi: 'cọ vẽ móng' }, { en: 'liner brush', vi: 'cọ nét' }, { en: 'detail brush', vi: 'cọ chi tiết' }, { en: 'dotting tool', vi: 'dụng cụ chấm bi' }, { en: 'nail art', vi: 'vẽ trang trí móng' }, { en: 'nail sticker', vi: 'sticker móng' }, { en: 'nail decal', vi: 'decal móng' }, { en: 'rhinestones', vi: 'đá trang trí' }, { en: 'charms', vi: 'phụ kiện đính móng' }, { en: 'nail gems', vi: 'đá đính móng' },
    { en: 'chrome powder', vi: 'bột chrome' }, { en: 'glitter', vi: 'kim tuyến' }, { en: 'foil', vi: 'giấy foil trang trí' }, { en: 'cat eye', vi: 'mắt mèo' }, { en: 'magnetic gel', vi: 'gel nam châm' }, { en: 'matte top coat', vi: 'sơn phủ lì' }, { en: 'glossy top coat', vi: 'sơn phủ bóng' }, { en: 'sheer', vi: 'trong nhẹ' }, { en: 'opaque', vi: 'đục/che phủ hoàn toàn' }, { en: 'nude', vi: 'màu nude' },
    { en: 'neutral', vi: 'màu trung tính' }, { en: 'clear', vi: 'trong suốt' }, { en: 'milky white', vi: 'trắng sữa' }, { en: 'pink nude', vi: 'hồng nude' }, { en: 'red polish', vi: 'sơn đỏ' }, { en: 'white polish', vi: 'sơn trắng' }, { en: 'black polish', vi: 'sơn đen' }, { en: 'color change', vi: 'đổi màu' }, { en: 'ombre', vi: 'chuyển màu ombre' }, { en: 'French tip', vi: 'đầu móng kiểu French' }
];

const PIC_IMG_CACHE = {};
const PIC_WIKI_CACHE = {};
function picFetchWikiSummary(name) {
	const key = String(name || '').toLowerCase();
	if (PIC_WIKI_CACHE[key] !== undefined) return Promise.resolve(PIC_WIKI_CACHE[key]);
	if (typeof fetch !== 'function') return Promise.resolve(null);
	const url = 'https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(name);
	return fetch(url).then(function (r) {
		if (!r.ok) return null;
		return r.json();
	}).then(function (data) {
		let out = null;
		try {
			let img = null;
			if (data && data.thumbnail && data.thumbnail.source) img = data.thumbnail.source;
			else if (data && data.originalimage && data.originalimage.source) img = data.originalimage.source;
			let extract = (data && data.extract) || '';
			if (extract.length > 220) {
				const cut = extract.slice(0, 220);
				const dot = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
				extract = (dot > 80 ? cut.slice(0, dot + 1) : cut).trim() + ' ...';
			}
			if (img || extract) out = { img: img, extract: extract };
		} catch (e) {}
		PIC_WIKI_CACHE[key] = out;
		return out;
	}).catch(function () { PIC_WIKI_CACHE[key] = null; return null; });
}
function picFetchWiki(name) {
	return picFetchWikiSummary(name).then(function (s) {
		return (s && s.img) || null;
	});
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
	if (!type || type === 'all' || type === 'nail') push(PIC_NAILS, 'nail');
	return out;
}

// =====================================================
// SECTION 5: Nail quiz - tu vung nghe Nail (My), 2 chieu, khong anh.
// EN -> VI: cau hoi tieng Anh, chon nghia Viet. VI -> EN: nguoc lai.
// =====================================================
const NAIL_ROUND_SIZE = 20;
const NAIL_OPTION_COUNT = 4;

$scope.nail = {
	items: [],
	index: 0,
	current: null,
	direction: 'en-vi', // 'en-vi' | 'vi-en'
	questionText: '',
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

$scope.startNail = function (wrongOnly) {
	try { Text2SpeechStop(); } catch (e) {}
	let pool = PIC_NAILS.slice();
	if (wrongOnly && $scope.nail.wrong.length) {
		pool = $scope.nail.wrong.slice();
	}
	$scope.nail.items = qShuffle(pool.slice()).slice(0, NAIL_ROUND_SIZE);
	$scope.nail.index = 0;
	$scope.nail.score = 0;
	$scope.nail.streak = 0;
	$scope.nail.bestStreak = 0;
	$scope.nail.wrong = [];
	$scope.nail.finished = !$scope.nail.items.length;
	if ($scope.nail.items.length) $scope.buildNailQuestion();
};

function nailDistractors(entry, count) {
	const picked = [];
	const seen = {};
	seen[entry.en] = true;
	const pool = qShuffle(PIC_NAILS.slice());
	for (let i = 0; i < pool.length && picked.length < count; i++) {
		if (!seen[pool[i].en]) {
			seen[pool[i].en] = true;
			picked.push(pool[i]);
		}
	}
	return picked;
}

$scope.buildNailQuestion = function () {
	const entry = $scope.nail.items[$scope.nail.index];
	if (!entry) { $scope.nail.finished = true; return; }
	$scope.nail.current = entry;
	$scope.nail.direction = Math.random() < 0.5 ? 'en-vi' : 'vi-en';
	$scope.nail.questionText = ($scope.nail.direction === 'en-vi') ? entry.en : entry.vi;
	const distractors = nailDistractors(entry, NAIL_OPTION_COUNT - 1);
	const entries = qShuffle([entry].concat(distractors));
	$scope.nail.options = entries.map(function (e) {
		return {
			en: e.en, vi: e.vi,
			display: ($scope.nail.direction === 'en-vi') ? e.vi : e.en
		};
	});
	$scope.nail.correctIdx = -1;
	for (let i = 0; i < entries.length; i++) {
		if (entries[i].en === entry.en) { $scope.nail.correctIdx = i; break; }
	}
	$scope.nail.picked = -1;
	$scope.nail.answered = false;
};

$scope.answerNail = function (idx) {
	if ($scope.nail.answered || idx < 0) return;
	$scope.nail.answered = true;
	$scope.nail.picked = idx;
	if (idx === $scope.nail.correctIdx) {
		$scope.nail.score += 1;
		$scope.nail.streak += 1;
		if ($scope.nail.streak > $scope.nail.bestStreak) $scope.nail.bestStreak = $scope.nail.streak;
	} else {
		$scope.nail.streak = 0;
		$scope.nail.wrong.push($scope.nail.current);
	}
};

$scope.nailSpeak = function (ev, text) {
	if (ev) { try { ev.stopPropagation(); } catch (e) {} }
	const word = text || ($scope.nail.current && $scope.nail.current.en) || '';
	if (!word) return;
	if (!text && ttsIsBusy()) return;
	try { (typeof Text2SpeechReplay === 'function' ? Text2SpeechReplay : Text2Speech)(word); } catch (e) {}
};

$scope.nextNail = function () {
	$scope.nail.index += 1;
	if ($scope.nail.index >= $scope.nail.items.length) {
		$scope.nail.current = null;
		$scope.nail.finished = true;
	} else {
		$scope.buildNailQuestion();
	}
};
$scope.retryWrongNail = function () { $scope.startNail(true); };

// Click dòng đáp án: chưa trả lời -> chọn; đã trả lời -> phát âm từ tiếng Anh đó
$scope.clickNailOption = function (ev, idx) {
	if (ev) { try { ev.stopPropagation(); } catch (e) {} }
	if (!$scope.nail.answered) { $scope.answerNail(idx); return; }
	if (ttsIsBusy()) return;
	const opt = $scope.nail.options[idx];
	if (opt && opt.en) { try { (typeof Text2SpeechReplay === 'function' ? Text2SpeechReplay : Text2Speech)(opt.en); } catch (e) {} }
};

// =====================================================
// (SECTION 3: Picture quiz - xem phia duoi)
// =====================================================

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
	if (k === 'nail') return 'Nail';
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

// =====================================================
// SECTION 4: Directions - cau chi duong that tu OpenStreetMap (free, khong key)
// Route that tu OSRM demo server (du lieu OSM): steps -> cau chi duong (ten duong,
// re trai/phai, khoang cach that). Question CHI CO LOA; ABCD la 4 cau na-na nhau.
// Mat mang / het quota -> fallback sample local. Map tinh chi hien SAU khi tra loi.
// Ton trong server free: toi da ~1 request/giay.
// Docs: https://router.project-osrm.org/ , https://www.openstreetmap.org/copyright
// =====================================================
const DIR_ROUND_SIZE = 10;
// Trong so thanh pho: ~70% Houston, Texas; con lai chia deu Dallas / Austin / San Antonio.
const DIR_CENTERS = [
	{ id: 'houston', label: 'Houston, Texas', lat: 29.7604, lon: -95.3698, w: 70 },
	{ id: 'dallas', label: 'Dallas, Texas', lat: 32.7767, lon: -96.7970, w: 10 },
	{ id: 'austin', label: 'Austin, Texas', lat: 30.2672, lon: -97.7431, w: 10 },
	{ id: 'sanantonio', label: 'San Antonio, Texas', lat: 29.4241, lon: -98.4936, w: 10 }
];
const DIR_OSM = { routes: [], nearby: [], busy: false };
const DIR_FLIP_MOD = {
	'left': 'right', 'right': 'left',
	'slight left': 'slight right', 'slight right': 'slight left',
	'sharp left': 'sharp right', 'sharp right': 'sharp left'
};

function dirCenterOf(id) {
	for (let i = 0; i < DIR_CENTERS.length; i++) {
		if (DIR_CENTERS[i].id === id) return DIR_CENTERS[i];
	}
	return DIR_CENTERS[0];
}
function dirPickCenter(filter) {
	if (filter && filter !== 'all') return dirCenterOf(filter);
	let total = 0, i;
	for (i = 0; i < DIR_CENTERS.length; i++) total += (DIR_CENTERS[i].w || 0);
	let r = Math.random() * total;
	for (i = 0; i < DIR_CENTERS.length; i++) {
		r -= (DIR_CENTERS[i].w || 0);
		if (r <= 0) return DIR_CENTERS[i];
	}
	return DIR_CENTERS[0];
}
// diem random: c co {lat, lon} (dung duoc cho ca center lan diem start)
function dirRandPt(c, minM, maxM) {
	const r = minM + Math.random() * (maxM - minM);
	const br = Math.random() * 2 * Math.PI;
	const dLat = (r * Math.cos(br)) / 111320;
	const dLon = (r * Math.sin(br)) / (111320 * Math.cos(c.lat * Math.PI / 180));
	return { lat: c.lat + dLat, lon: c.lon + dLon };
}
function dirFmtDist(m) {
	m = Math.round(m);
	if (m >= 1000) return (Math.round(m / 100) / 10) + ' kilometers';
	if (m >= 100) return (Math.round(m / 10) * 10) + ' meters';
	if (m < 20) m = 20;
	return m + ' meters';
}
// parts: [{op:'head'|'turn'|'cont'|'merge'|'rdbt', mod, road, dist}] -> 2-4 cau tieng Anh
function dirRender(parts, side) {
	const out = [];
	parts.forEach(function (p) {
		const road = p.road || 'the road';
		if (p.op === 'head') {
			out.push('Head ' + (p.mod ? p.mod + ' ' : '') + 'on ' + road + ' for ' + dirFmtDist(p.dist));
		} else if (p.op === 'turn') {
			out.push('Turn ' + (p.mod || 'left') + ' onto ' + road);
		} else if (p.op === 'merge') {
			out.push('Merge onto ' + road);
		} else if (p.op === 'rdbt') {
			out.push('At the roundabout, take the exit onto ' + road);
		} else {
			if (road === 'the road') out.push('Continue straight for ' + dirFmtDist(p.dist));
			else if (!p.mod || p.mod === 'straight') out.push('Continue on ' + road + ' for ' + dirFmtDist(p.dist));
			else out.push('Continue ' + p.mod + ' onto ' + road + ' for ' + dirFmtDist(p.dist));
		}
	});
	if (side === 'left' || side === 'right') out.push('Your destination is on the ' + side);
	else out.push('You have arrived at your destination');
	return out.join('. ') + '.';
}
// OSRM steps -> {parts, side, roads, text, start, end, city} (null neu kem chat luong)
function dirParseOsrm(json, a, b, center) {
	try {
		if (!json || json.code !== 'Ok' || !json.routes || !json.routes.length) return null;
		const leg = json.routes[0].legs && json.routes[0].legs[0];
		const steps = (leg && leg.steps) || [];
		if (steps.length < 2) return null;
		const parts = [];
		let side = '';
		const roads = [];
		steps.forEach(function (st) {
			const man = st.maneuver || {};
			const type = man.type || '';
			const mod = man.modifier || '';
			const name = (st.name || '').trim();
			const dist = st.distance || 0;
			if (type === 'arrive') {
				if (mod === 'left' || mod === 'right') side = mod;
				return;
			}
			if (name && roads.indexOf(name) < 0) roads.push(name);
			if (type === 'depart') {
				parts.push({ op: 'head', mod: (/^(north|south|east|west)$/.test(mod) ? mod : ''), road: name, dist: dist });
			} else if (type === 'turn') {
				if (!mod) return;
				parts.push({ op: 'turn', mod: mod, road: name, dist: 0 });
			} else if (type === 'new name') {
				parts.push({ op: 'cont', mod: mod, road: name, dist: dist });
			} else if (type === 'continue') {
				if (dist < 30 && !name) return;
				parts.push({ op: 'cont', mod: (mod || 'straight'), road: name, dist: dist });
			} else if (type === 'merge' || type === 'on ramp' || type === 'off ramp' || type === 'fork') {
				parts.push({ op: 'merge', mod: mod, road: name, dist: 0 });
			} else if (type.indexOf('roundabout') >= 0 || type.indexOf('rotary') >= 0) {
				parts.push({ op: 'rdbt', mod: mod, road: name, dist: 0 });
			} else if (dist >= 30 || name) {
				parts.push({ op: 'cont', mod: (mod || 'straight'), road: name, dist: dist });
			}
		});
		const slim = parts.slice(0, 3); // gon: toi da 3 menh de de de nghe
		if (!slim.length || !roads.length) return null;
		return { qtype: 'route', parts: slim, side: side, roads: roads, text: dirRender(slim, side), start: a, end: b, city: center.id };
	} catch (e) { return null; }
}
function dirFetchRoute(center) {
	const a = dirRandPt(center, 0, 700);
	const b = dirRandPt(a, 400, 1200);
	const url = 'https://router.project-osrm.org/route/v1/driving/' +
		a.lon.toFixed(5) + ',' + a.lat.toFixed(5) + ';' + b.lon.toFixed(5) + ',' + b.lat.toFixed(5) +
		'?overview=false&steps=true';
	return fetch(url).then(function (r) {
		if (!r.ok) throw new Error('osrm ' + r.status);
		return r.json();
	}).then(function (json) {
		return dirParseOsrm(json, a, b, center);
	});
}
// =====================================================
// NEARBY: "X is next to / across from / near Y" (nha B canh/sau/doi dien nha C,
// near lake/park/school...) - du lieu that tu Overpass API (OSM, free, khong key).
// Quan he suy tu toa do that: <120m = next to, <400m = near, xa hon = huong
// la ban (north of...); 2 so nha cung duong: lien ke = next to, chan/le = across from.
// Docs: https://wiki.openstreetmap.org/wiki/Overpass_API
// =====================================================
const DIR_OVERPASS_EPS = [
	'https://overpass-api.de/api/interpreter',
	'https://overpass.kumi.systems/api/interpreter'
];
function dirOverpassQuery(lat, lon, r) {
	const sel = [
		'node["leisure"="park"]["name"]',
		'way["leisure"="park"]["name"]',
		'node["leisure"="playground"]["name"]',
		'node["amenity"~"^(school|library|hospital|fire_station|college|university)$"]["name"]',
		'way["amenity"~"^(school|library|hospital|fire_station|college|university)$"]["name"]',
		'node["natural"="water"]["name"]',
		'way["natural"="water"]["name"]',
		'node["addr:housenumber"]["addr:street"]',
		'way["addr:housenumber"]["addr:street"]'
	];
	return '[out:json][timeout:20];(' +
		sel.map(function (s) { return s + '(around:' + r + ',' + lat.toFixed(5) + ',' + lon.toFixed(5) + ');'; }).join('') +
		');out center tags;';
}
function dirFetchNearby(center) {
	const p = dirRandPt(center, 0, 900);
	const data = dirOverpassQuery(p.lat, p.lon, 800);
	function tryEp(i) {
		if (i >= DIR_OVERPASS_EPS.length) return Promise.reject(new Error('overpass down'));
		return fetch(DIR_OVERPASS_EPS[i] + '?data=' + encodeURIComponent(data)).then(function (r) {
			if (!r.ok) throw new Error('overpass ' + r.status);
			return r.json();
		}).catch(function () { return tryEp(i + 1); });
	}
	return tryEp(0).then(function (json) { return dirParseOverpass(json, center); });
}
function dirHavM(a, b) {
	const R = 6371000, dLa = (b.lat - a.lat) * Math.PI / 180;
	const dLo = (b.lon - a.lon) * Math.PI / 180;
	const s1 = Math.sin(dLa / 2), s2 = Math.sin(dLo / 2);
	const h = s1 * s1 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * s2 * s2;
	return 2 * R * Math.asin(Math.sqrt(h));
}
function dirBearing(a, b) {
	const la1 = a.lat * Math.PI / 180, la2 = b.lat * Math.PI / 180;
	const dLo = (b.lon - a.lon) * Math.PI / 180;
	const y = Math.sin(dLo) * Math.cos(la2);
	const x = Math.cos(la1) * Math.sin(la2) - Math.sin(la1) * Math.cos(la2) * Math.cos(dLo);
	return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}
function dirCardinal(br) {
	const dirs = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
	return dirs[Math.round(br / 45) % 8];
}
// Overpass JSON -> {qtype:'nearby', a, b, rel, pa, pb, city, altNames, text}
function dirParseOverpass(json, center) {
	try {
		const els = (json && json.elements) || [];
		if (!els.length) return null;
		const pois = [], houses = [], seen = {};
		els.forEach(function (e) {
			const t = e.tags || {};
			let lat = e.lat, lon = e.lon;
			if ((lat == null || lon == null) && e.center) { lat = e.center.lat; lon = e.center.lon; }
			if (lat == null || lon == null) return;
			if (t['addr:housenumber'] && t['addr:street']) {
				const num = String(t['addr:housenumber']).trim(), street = String(t['addr:street']).trim();
				if (!num || !street || seen['H' + num + '|' + street.toLowerCase()]) return;
				seen['H' + num + '|' + street.toLowerCase()] = true;
				houses.push({ num: num, street: street, lat: lat, lon: lon });
				return;
			}
			const name = (t.name || '').trim();
			if (!name || seen['P' + name.toLowerCase()]) return;
			let cat = '';
			if (t.leisure === 'park') cat = 'park';
			else if (t.leisure === 'playground') cat = 'playground';
			else if (t.amenity === 'school') cat = 'school';
			else if (t.amenity === 'library') cat = 'library';
			else if (t.amenity === 'hospital') cat = 'hospital';
			else if (t.amenity === 'fire_station') cat = 'fire station';
			else if (t.amenity === 'college' || t.amenity === 'university') cat = 'college';
			else if (t.natural === 'water') {
				const w = String(t.water || ''), nm = name;
				if (/river/i.test(w) || /river/i.test(nm)) cat = 'river';
				else if (/pond/i.test(w) || /pond/i.test(nm)) cat = 'pond';
				else cat = 'lake';
			} else return;
			seen['P' + name.toLowerCase()] = true;
			pois.push({ name: name, cat: cat, lat: lat, lon: lon });
		});
		// uu tien 1: 2 POI co ten gan nhau (park/school/lake...)
		if (pois.length >= 2) {
			const order = qShuffle(pois.slice());
			for (let i = 0; i < order.length; i++) {
				for (let j = 0; j < order.length; j++) {
					if (i === j) continue;
					const A = order[i], B = order[j];
					const d = dirHavM(A, B);
					if (d > 1500) continue;
					const rel = d < 120 ? 'next to' : (d < 400 ? 'near' : dirCardinal(dirBearing(B, A)) + ' of');
					const alts = [];
					order.forEach(function (o) {
						if (o.name !== A.name && o.name !== B.name && alts.indexOf(o.name) < 0) alts.push(o.name);
					});
					houses.forEach(function (h) {
						const nm = h.num + ' ' + h.street;
						if (alts.indexOf(nm) < 0) alts.push(nm);
					});
					DIR_LOCAL_POIS.forEach(function (o) {
						if (o.name !== A.name && o.name !== B.name && alts.indexOf(o.name) < 0) alts.push(o.name);
					});
					return dirMakeNearby(A.name, B.name, rel, A, B, center.id, alts);
				}
			}
		}
		// uu tien 2: 2 so nha cung duong (nha B canh / doi dien nha C)
		if (houses.length >= 2) {
			const byStreet = {};
			houses.forEach(function (h) {
				const k = h.street.toLowerCase();
				(byStreet[k] = byStreet[k] || []).push(h);
			});
			const keys = qShuffle(Object.keys(byStreet));
			for (let k = 0; k < keys.length; k++) {
				const list = byStreet[keys[k]];
				if (list.length < 2) continue;
				qShuffle(list);
				const A = list[0], B = list[1];
				const d = dirHavM(A, B);
				if (d > 400) continue;
				const na = parseInt(A.num, 10), nb = parseInt(B.num, 10);
				let rel;
				if (!isNaN(na) && !isNaN(nb) && Math.abs(na - nb) <= 8) rel = 'next to';
				else if (!isNaN(na) && !isNaN(nb) && (na % 2) !== (nb % 2)) rel = 'across from';
				else rel = d < 120 ? 'next to' : 'near';
				const aName = A.num + ' ' + A.street, bName = B.num + ' ' + B.street;
				const alts = [];
				houses.forEach(function (h) {
					const nm = h.num + ' ' + h.street;
					if (nm !== aName && nm !== bName && alts.indexOf(nm) < 0) alts.push(nm);
				});
				pois.forEach(function (o) { if (alts.indexOf(o.name) < 0) alts.push(o.name); });
				DIR_LOCAL_POIS.forEach(function (o) { if (alts.indexOf(o.name) < 0) alts.push(o.name); });
				return dirMakeNearby(aName, bName, rel, A, B, center.id, alts);
			}
		}
		return null;
	} catch (e) { return null; }
}
function dirMakeNearby(a, b, rel, pa, pb, cityId, altNames) {
	const text = a + ' is ' + rel + ' ' + b + '.';
	return { qtype: 'nearby', a: a, b: b, rel: rel, pa: pa, pb: pb, city: cityId, altNames: altNames || [], text: text };
}
const DIR_FLIP_REL = {
	'next to': ['across from', 'behind'],
	'across from': ['next to', 'behind'],
	'behind': ['next to', 'across from'],
	'near': ['far from', 'next to'],
	'far from': ['near'],
	'north of': ['south of'], 'south of': ['north of'],
	'east of': ['west of'], 'west of': ['east of'],
	'northeast of': ['southwest of'], 'southwest of': ['northeast of'],
	'northwest of': ['southeast of'], 'southeast of': ['northwest of']
};
// bien the gay nham: 0 = doi quan he, 1 = doi ten B, 2 = doi ten A / doi so nha
function dirNearbyMutate(parsed, idx) {
	for (let tries = 0; tries < 12; tries++) {
		let a = parsed.a, b = parsed.b, rel = parsed.rel;
		if (idx === 0) {
			const cands = DIR_FLIP_REL[rel] || ['near'];
			rel = qPick(cands);
		} else if (idx === 1) {
			if (!parsed.altNames.length) continue;
			b = qPick(parsed.altNames);
			if (b === parsed.b) continue;
		} else {
			if (parsed.altNames.length && Math.random() < 0.6) {
				a = qPick(parsed.altNames);
				if (a === parsed.a) continue;
			} else {
				// doi so nha kieu detail (1204 -> 1024)
				const m = a.match(/^(\d+)\s+(.*)$/);
				if (!m) continue;
				a = swapDigitsNum(parseInt(m[1], 10)) + ' ' + m[2];
				if (a === parsed.a) continue;
			}
		}
		const t = a + ' is ' + rel + ' ' + b + '.';
		if (t && t !== parsed.text) return t;
	}
	return null;
}
function dirBuildNearbyOptions(parsed) {
	const opts = [parsed.text];
	[0, 1, 2].forEach(function (k) {
		const m = dirNearbyMutate(parsed, k);
		if (m && opts.indexOf(m) < 0) opts.push(m);
	});
	let guard = 0;
	while (opts.length < 4 && guard++ < 20) {
		const m = dirNearbyMutate(parsed, guard % 3);
		if (m && opts.indexOf(m) < 0) opts.push(m);
	}
	while (opts.length < 4) opts.push(parsed.text + ' ');
	return qShuffle(opts.slice(0, 4));
}
function dirItemFromNearby(parsed) {
	return dirWrapItem({
		sub: 'nearby', city: parsed.city, live: true, text: parsed.text,
		options: dirBuildNearbyOptions(parsed), start: parsed.pa, end: parsed.pb
	});
}
function dirItemFromLive(live) {
	if (live && live.qtype === 'nearby') return dirItemFromNearby(live);
	return dirItemFromParsed(live);
}
// sample offline: dia danh Houston that + so nha Texas
const DIR_LOCAL_POIS = [
	{ name: 'Memorial Park', cat: 'park' }, { name: 'Hermann Park', cat: 'park' },
	{ name: 'Discovery Green', cat: 'park' }, { name: 'Buffalo Bayou Park', cat: 'park' },
	{ name: 'Lamar High School', cat: 'school' }, { name: 'Westside High School', cat: 'school' },
	{ name: 'Houston Public Library', cat: 'library' }, { name: 'Memorial Hermann Hospital', cat: 'hospital' },
	{ name: 'Lake Houston', cat: 'lake' }, { name: 'McGovern Lake', cat: 'lake' },
	{ name: 'Station 8 Fire Station', cat: 'fire station' }, { name: 'Rice University', cat: 'college' }
];
const DIR_LOCAL_RELS = ['next to', 'near', 'north of', 'south of', 'east of', 'west of', 'across from'];
function dirGenLocalNearby(filter) {
	const center = dirPickCenter(filter);
	const pool = qShuffle(DIR_LOCAL_POIS.slice());
	const A = pool[0], B = pool[1];
	const useHouse = Math.random() < 0.4;
	let parsed;
	if (useHouse) {
		const g = qPick(STREET_GROUPS);
		const road = qPick(g) + ' ' + qPick(STREET_TYPES);
		const n1 = qRand(1201, 4899);
		const rel = qPick(['next to', 'across from', 'near']);
		const n2 = (rel === 'next to') ? n1 + 2 : (rel === 'across from' ? n1 + 1 : n1 + qRand(10, 60));
		const alts = pool.slice(2, 6).map(function (o) { return o.name; });
		parsed = dirMakeNearby(n1 + ' ' + road, n2 + ' ' + road, rel, null, null, center.id, alts);
	} else {
		const alts = pool.slice(2).map(function (o) { return o.name; });
		parsed = dirMakeNearby(A.name, B.name, qPick(DIR_LOCAL_RELS), null, null, center.id, alts);
	}
	return dirWrapItem({
		sub: 'nearby', city: center.id, live: false, text: parsed.text,
		options: dirBuildNearbyOptions(parsed), start: null, end: null
	});
}
// nap cache du lieu that (route + nearby xen ke; tuan tu, ~1.1s/cau);
// xong thi nang cap cac cau sample chua lam toi
function dirEnsureOsm(want) {
	if (DIR_OSM.busy || typeof fetch !== 'function') return;
	DIR_OSM.busy = true;
	want = want || 6;
	let attempts = 0;
	const maxAttempts = want * 3;
	function cachedCount() { return DIR_OSM.routes.length + DIR_OSM.nearby.length; }
	function step() {
		if (cachedCount() >= want || attempts >= maxAttempts) {
			DIR_OSM.busy = false;
			try { dirUpgradePending(); } catch (e) {}
			return;
		}
		attempts++;
		const center = dirPickCenter(($scope.dir && $scope.dir.type) || 'all');
		const wantNearby = Math.random() < 0.5;
		const p = wantNearby ? dirFetchNearby(center) : dirFetchRoute(center);
		p.then(function (parsed) {
			if (parsed && parsed.qtype === 'nearby') {
				DIR_OSM.nearby.push(parsed);
				if (DIR_OSM.nearby.length > 30) DIR_OSM.nearby.shift();
			} else if (parsed) {
				DIR_OSM.routes.push(parsed);
				if (DIR_OSM.routes.length > 30) DIR_OSM.routes.shift();
			}
		}).catch(function () {
			// fail -> giu sample local, khong lam gi
		}).finally(function () {
			$timeout(step, 1100);
		});
	}
	$timeout(step, 0);
}
function dirTakeOsm(filter, qtype) {
	const pool = (qtype === 'nearby') ? DIR_OSM.nearby : DIR_OSM.routes;
	for (let i = pool.length - 1; i >= 0; i--) {
		if (!filter || filter === 'all' || pool[i].city === filter) {
			return pool.splice(i, 1)[0];
		}
	}
	return null;
}
// thay cau sample (chua lam toi) bang du lieu that vua fetch ve (uu tien dung loai)
function dirUpgradePending() {
	const d = $scope.dir;
	if (!d || !d.items || !d.items.length || d.finished) return;
	for (let i = d.index + 1; i < d.items.length; i++) {
		const it = d.items[i];
		if (it && it.needsOsm) {
			const live = dirTakeOsm(d.type, it.want) || dirTakeOsm(d.type, it.want === 'nearby' ? 'route' : 'nearby');
			if (!live) break;
			d.items[i] = dirItemFromLive(live);
		}
	}
}
function dirCloneParts(parts) {
	return parts.map(function (p) { return { op: p.op, mod: p.mod, road: p.road, dist: p.dist }; });
}
function dirLocalRoad(exclude) {
	const flat = [];
	STREET_GROUPS.forEach(function (g) {
		g.forEach(function (s) {
			if (s !== exclude && flat.indexOf(s) < 0) flat.push(s);
		});
	});
	return qPick(flat) + ' ' + qPick(STREET_TYPES);
}
// bien the gay nham: idx 0 = doi trai/phai, 1 = doi ten duong, 2 = doi khoang cach
function dirMutate(parsed, idx) {
	for (let tries = 0; tries < 12; tries++) {
		const parts = dirCloneParts(parsed.parts);
		let side = parsed.side;
		if (idx === 0) {
			let done = false;
			for (let i = 0; i < parts.length; i++) {
				if (DIR_FLIP_MOD[parts[i].mod]) { parts[i].mod = DIR_FLIP_MOD[parts[i].mod]; done = true; break; }
			}
			if (!done) side = (side === 'left') ? 'right' : 'left';
		} else if (idx === 1) {
			const cands = parts.filter(function (p) { return p.road; });
			if (!cands.length) continue;
			const target = qPick(cands);
			const others = parsed.roads.filter(function (r) { return r && r !== target.road; });
			target.road = others.length ? qPick(others) : dirLocalRoad(target.road);
		} else {
			const cands = parts.filter(function (p) { return p.dist >= 40; });
			if (!cands.length) continue;
			const target = qPick(cands);
			let nd = Math.round(target.dist + qPick([-150, -100, -60, 60, 100, 150]));
			if (nd < 40) nd = target.dist + 120;
			target.dist = nd;
		}
		const t = dirRender(parts, side);
		if (t && t !== parsed.text) return { text: t, side: side };
	}
	return null;
}
function dirBuildOptions(parsed) {
	const opts = [parsed.text];
	[0, 1, 2].forEach(function (k) {
		const m = dirMutate(parsed, k);
		if (m && opts.indexOf(m.text) < 0) opts.push(m.text);
	});
	let guard = 0;
	while (opts.length < 4 && guard++ < 20) {
		const m = dirMutate(parsed, guard % 3);
		if (m && opts.indexOf(m.text) < 0) opts.push(m.text);
	}
	while (opts.length < 4) opts.push(parsed.text + ' ');
	return qShuffle(opts.slice(0, 4));
}
function dirMapImg(a, b) {
	if (!a || !b) return '';
	const midLat = ((a.lat + b.lat) / 2).toFixed(5), midLon = ((a.lon + b.lon) / 2).toFixed(5);
	return 'https://staticmap.openstreetmap.de/staticmap.php?center=' + midLat + ',' + midLon +
		'&zoom=15&size=420x220&maptype=mapnik&markers=' +
		a.lat.toFixed(5) + ',' + a.lon.toFixed(5) + ',green-pushpin|' +
		b.lat.toFixed(5) + ',' + b.lon.toFixed(5) + ',red-pushpin';
}
function dirOsmLink(a, b) {
	if (!a || !b) return '';
	return 'https://www.openstreetmap.org/directions?from=' + a.lat.toFixed(5) + ',' + a.lon.toFixed(5) +
		'&to=' + b.lat.toFixed(5) + ',' + b.lon.toFixed(5);
}
function dirWrapItem(o) {
	const idx = o.options.indexOf(o.text);
	const sub = o.sub || 'route';
	const tag = o.live ? (' [OSM live · ' + sub + ']') : ' [sample]';
	return {
		kind: 'dir', city: o.city, live: o.live, sub: sub, want: sub,
		speakText: o.text, transcript: o.text + tag,
		correct: o.text, options: o.options, correctIdx: idx >= 0 ? idx : 0,
		start: o.start || null, end: o.end || null,
		mapImg: dirMapImg(o.start, o.end), osmLink: dirOsmLink(o.start, o.end),
		needsOsm: !o.live
	};
}
function dirItemFromParsed(parsed) {
	return dirWrapItem({
		sub: 'route', city: parsed.city, live: true, text: parsed.text,
		options: dirBuildOptions(parsed), start: parsed.start, end: parsed.end
	});
}
// fallback offline: route sample hoac nearby sample (tron 50/50)
function dirGenLocalItem(filter, wantNearby) {
	if (wantNearby == null) wantNearby = Math.random() < 0.5;
	if (wantNearby) return dirGenLocalNearby(filter);
	const center = dirPickCenter(filter);
	const g = qPick(STREET_GROUPS);
	const r1 = qPick(g);
	const rest = g.filter(function (s) { return s !== r1; });
	const r2 = rest.length ? qPick(rest) : qPick(g);
	const t1 = qPick(STREET_TYPES);
	let t2 = qPick(STREET_TYPES), gg = 0;
	while (t2 === t1 && gg++ < 5) t2 = qPick(STREET_TYPES);
	const road1 = r1 + ' ' + t1, road2 = r2 + ' ' + t2;
	const parts = [
		{ op: 'head', mod: '', road: road1, dist: qPick([100, 150, 200, 250, 300, 400, 500]) },
		{ op: 'turn', mod: qPick(['left', 'right']), road: road2, dist: 0 }
	];
	if (Math.random() < 0.5) parts.push({ op: 'cont', mod: 'straight', road: road2, dist: qPick([100, 200, 300]) });
	const side = qPick(['left', 'right']);
	const parsed = { parts: parts, side: side, roads: [road1, road2], text: dirRender(parts, side) };
	return dirWrapItem({
		city: center.id, live: false, text: parsed.text,
		options: dirBuildOptions(parsed), start: null, end: null
	});
}

$scope.dir = {
	type: 'all', // all | houston | dallas | austin | sanantonio
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

$scope.setDirType = function (t) {
	$scope.dir.type = t;
	$scope.startDir();
};

$scope.dirCityLabel = function (id) {
	if (!id || id === 'all') return 'All cities';
	return dirCenterOf(id).label;
};

$scope.startDir = function (wrongOnly, noSpeak) {
	try { Text2SpeechStop(); } catch (e) {}
	let items = [];
	if (wrongOnly && $scope.dir.wrong.length) {
		items = $scope.dir.wrong.slice(0, DIR_ROUND_SIZE).map(function (w) {
			const opts = qShuffle(w.options.slice());
			return {
				kind: 'dir', city: w.city, live: w.live, sub: w.sub || 'route', want: w.want || w.sub || 'route',
				speakText: w.speakText, transcript: w.transcript,
				correct: w.correct, options: opts, correctIdx: opts.indexOf(w.correct),
				start: w.start || null, end: w.end || null,
				mapImg: w.mapImg || '', osmLink: w.osmLink || '', needsOsm: false
			};
		});
	} else {
		for (let i = 0; i < DIR_ROUND_SIZE; i++) {
			const wantNearby = Math.random() < 0.5;
			const live = dirTakeOsm($scope.dir.type, wantNearby ? 'nearby' : 'route') ||
				dirTakeOsm($scope.dir.type, wantNearby ? 'route' : 'nearby');
			items.push(live ? dirItemFromLive(live) : dirGenLocalItem($scope.dir.type, wantNearby));
		}
		// nap them du lieu that cho cac cau sau (tuan tu, ton trong server free)
		try { dirEnsureOsm(DIR_ROUND_SIZE); } catch (e) {}
	}
	$scope.dir.items = items;
	$scope.dir.index = 0;
	$scope.dir.score = 0;
	$scope.dir.streak = 0;
	$scope.dir.bestStreak = 0;
	$scope.dir.wrong = [];
	$scope.dir.finished = !items.length;
	$scope.buildDirQuestion(!noSpeak);
};

$scope.buildDirQuestion = function (autoSpeak) {
	const it = $scope.dir.items[$scope.dir.index];
	if (!it) { $scope.dir.finished = true; return; }
	$scope.dir.current = it;
	$scope.dir.options = it.options;
	$scope.dir.correctIdx = it.correctIdx;
	$scope.dir.picked = -1;
	$scope.dir.answered = false;
	if (autoSpeak) {
		$timeout(function () { $scope.dirSpeak(null, true); }, 350);
	}
};

$scope.dirSpeak = function (ev, isAuto) {
	if (ev) { try { ev.stopPropagation(); } catch (e) {} }
	if (!$scope.dir.current) return;
	if (!isAuto && ttsIsBusy()) return; // spam click trong luc dang phat -> bo qua
	try { (typeof Text2SpeechReplay === 'function' ? Text2SpeechReplay : Text2Speech)($scope.dir.current.speakText); } catch (e) {}
};

$scope.answerDir = function (idx) {
	const d = $scope.dir;
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
			kind: 'dir', city: it.city, live: it.live, sub: it.sub || 'route', want: it.want || it.sub || 'route',
			speakText: it.speakText, transcript: it.transcript,
			correct: it.correct, options: it.options.slice(),
			start: it.start, end: it.end, mapImg: it.mapImg, osmLink: it.osmLink
		});
	}
};

$scope.nextDir = function () {
	$scope.dir.index += 1;
	if ($scope.dir.index >= $scope.dir.items.length) {
		$scope.dir.current = null;
		$scope.dir.finished = true;
	} else {
		$scope.buildDirQuestion(true);
	}
};
// Click dòng đáp án: chưa trả lời -> chọn; đã trả lời (đúng/sai) -> phát âm đáp án đó
$scope.clickDirOption = function (ev, idx) {
	const d = $scope.dir;
	if (ev) { try { ev.stopPropagation(); } catch (e) {} }
	if (!d.answered) { $scope.answerDir(idx); return; }
	if (ttsIsBusy()) return;
	const text = d.options[idx];
	if (text) { try { (typeof Text2SpeechReplay === 'function' ? Text2SpeechReplay : Text2Speech)(String(text)); } catch (e) {} }
};
$scope.retryWrongDir = function () { $scope.startDir(true); };

// init (khong tu phat tieng khi vua mo trang)
try { quizApiPrefetch(); } catch (e) {}
$scope.startQuiz(false, true);
$scope.startDetail(false, true);
$scope.startPic(false);
$scope.startDir(false, true);
try { $scope.startNail(); } catch (e) {}
try { dirEnsureOsm(6); } catch (e) {}

});
