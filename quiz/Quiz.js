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

$scope.mode = 'voca'; // 'voca' | 'detail'
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
		return { entry: e, display: text, meaning: quizPlainMeaning(e.word) };
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
	return digits.slice(0, 4) + ' ' + digits.slice(4, 7) + ' ' + digits.slice(7, 10);
}
function genPhone() {
	let digits = '0' + qPick(['9','3','7','8']) + qRand(10000000, 99999999);
	digits = digits.slice(0, 10);
	const correct = fmtPhone(digits);
	const speak = 'My phone number is ' + digits.split('').join(' ') + '.';
	const opts = [correct];
	const arr = digits.split('');
	function mutate1(a) {
		const b = a.slice();
		const pos = qRand(2, 9); // giu 0 dau
		let nd = String(qRand(0, 9));
		let guard = 0;
		while (nd === b[pos] && guard++ < 10) nd = String(qRand(0, 9));
		b[pos] = nd;
		return b.join('');
	}
	function swapAdj(a) {
		const b = a.slice();
		const pos = qRand(2, 8);
		const t = b[pos]; b[pos] = b[pos + 1]; b[pos + 1] = t;
		return b.join('');
	}
	const d1 = mutate1(arr);
	const d2 = swapAdj(arr);
	let d3 = mutate1(arr), guard = 0;
	while ((d3 === d1 || d3 === digits) && guard++ < 10) d3 = mutate1(arr);
	[d1, d2, d3].forEach(function (d) { opts.push(fmtPhone(d)); });
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

function genWeight() {
	const style = Math.random();
	if (style < 0.45) {
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
$scope.retryWrongDetail = function () { $scope.startDetail(true); };

$scope.detailKindLabel = function (k) {
	if (k === 'address') return 'Address';
	if (k === 'birthday') return 'Birthday';
	if (k === 'phone') return 'Phone';
	if (k === 'money') return 'Money';
	if (k === 'weight') return 'Weight';
	if (k === 'spelling') return 'Spelling';
	return k;
};

// init (khong tu phat tieng khi vua mo trang)
$scope.startQuiz(false, true);
$scope.startDetail(false, true);

});
