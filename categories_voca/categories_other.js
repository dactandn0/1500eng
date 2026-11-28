
let kApp_Categories = `
Egyptians
fermentation
carbon dioxide
scientific
cultures
vitamins
protein
substance
bacteria
reacted
carrots
cooking
a lot
a lot of
pieces
lifespan
live longer
polluted
industries
chemicals
mayor
government
smelled bad
think of doing
clean up
takes action
fluffy
couple of years
effect
global warming
Chicago
world get so crazy
fight each other
drop bombs
terrible
get across
less than
subway
take an apartment
right next to
garbage
landfills
buried
create less garbage
packaged foods
plastic trays
cardboard boxes
fresh meats
instead of
department
grocery
bring my own cup
paper cups
in the future
high-rise buildings
stories tall
upward
on-word
can't stand
beverage
on board 
flight
securely 
fastened
attendant
takeoff
technology
carry-on
luggage
probably
seat backs
tray tables
of the most
upright position
further
patience
severe
passenger
boarding pass
departure
Generous
Honest
Patient
Stubborn
Outgoing
Ambitious
Humble
Reliable
Sensitive
Selfish
Easygoing
Empathetic
Charismatic
Resilient
Conscientious
Assertive
Pragmatic
Spontaneous
Witty
Diligent
Compassionate
Tactful
Cynical
Arrogant
Grumpy
Gullible
Reckless
Moody
Sarcastic
Vindictive
Introverted
Optimistic
Pessimistic
Meticulous
Impulsive
Altruistic
Manipulative
Resourceful
Blunt
Observant
Rude
Evil
Cruel
Greedy
Jealous
Lazy
Cowardly
Hypocritical
Petty
Hostile
Callous
Snobbish
Deceitful
Impatient
Bossy
nature
natural
culture
cultural
made up of
once
later on
`;

const kOther = filterUniqueHighlights(kApp_Categories).map(function (name) {
	return { name: name, category_name: 'Other', color: '#ee02e2', noun: false };
});

kApp_Categories = (typeof kVegetable !== 'undefined' ? kVegetable : [])
	.concat(typeof kPersonality !== 'undefined' ? kPersonality : [])
	.concat(typeof kClothAccessory !== 'undefined' ? kClothAccessory : [])
	.concat(typeof kExpressions !== 'undefined' ? kExpressions : [])
	.concat(kOther);

function filterUniqueHighlights(raw) {
	const seen = Object.create(null);
	return String(raw || '')
		.split(/[\n,]+/)
		.map(function (value) { return value.trim(); })
		.filter(function (value) {
			const key = value.toLowerCase();
			if (!value || seen[key]) return false;
			seen[key] = true;
			return true;
		});
}

const highlightPluralExceptions = {
	avocado: 'avocados',
	photo: 'photos',
	piano: 'pianos',
	child: 'children',
	man: 'men',
	woman: 'women',
	person: 'people',
	foot: 'feet',
	tooth: 'teeth',
	goose: 'geese',
	mouse: 'mice',
	ox: 'oxen',
	cactus: 'cacti',
	fungus: 'fungi',
	nucleus: 'nuclei',
	syllabus: 'syllabi',
	phenomenon: 'phenomena',
	criterion: 'criteria',
	datum: 'data',
	medium: 'media',
	bacterium: 'bacteria',
	analysis: 'analyses',
	basis: 'bases',
	crisis: 'crises',
	thesis: 'theses',
	diagnosis: 'diagnoses',
	oasis: 'oases',
	axis: 'axes',
	appendix: 'appendices',
	index: 'indices',
	matrix: 'matrices',
	vertex: 'vertices',
	vortex: 'vortices',
	quiz: 'quizzes',
	video: 'videos',
	radio: 'radios',
	studio: 'studios',
	zoo: 'zoos',
	kangaroo: 'kangaroos',
	bamboo: 'bamboos',
	tattoo: 'tattoos',
	portfolio: 'portfolios',
	scenario: 'scenarios',
	memo: 'memos',
	demo: 'demos',
	logo: 'logos',
	auto: 'autos',
	disco: 'discos',
	taco: 'tacos',
	burrito: 'burritos',
	pesto: 'pestos',
	risotto: 'risottos',
	espresso: 'espressos',
	cappuccino: 'cappuccinos',
	fiasco: 'fiascos',
	ghetto: 'ghettos',
	solo: 'solos',
	soprano: 'sopranos',
	concerto: 'concertos',
	virtuoso: 'virtuosos',
	kimono: 'kimonos',
	cello: 'cellos',
	manifesto: 'manifestos',
	memento: 'mementos',
	placebo: 'placebos',
	tempo: 'tempos',
	tuxedo: 'tuxedos',
	libretto: 'librettos',
	alto: 'altos',
	banjo: 'banjos',
	canto: 'cantos',
	dynamo: 'dynamos',
	embryo: 'embryos',
	fresco: 'frescos',
	gizmo: 'gizmos',
	inferno: 'infernos',
	kilo: 'kilos',
	nacho: 'nachos',
	poncho: 'ponchos',
	psycho: 'psychos',
	quarto: 'quartos',
	repo: 'repos',
	rhino: 'rhinos',
	sombrero: 'sombreros',
	stucco: 'stuccos',
	tango: 'tangos',
	taro: 'taros',
	typo: 'typos',
	weirdo: 'weirdos',
	zero: 'zeros',
	roof: 'roofs',
	chef: 'chefs',
	chief: 'chiefs',
	belief: 'beliefs',
	proof: 'proofs',
	safe: 'safes',
	cafe: 'cafes',
	giraffe: 'giraffes',
	handkerchief: 'handkerchiefs',
	cliff: 'cliffs',
	staff: 'staffs',
	sheriff: 'sheriffs',
	tariff: 'tariffs',
	reef: 'reefs',
	brief: 'briefs',
	grief: 'griefs',
	disbelief: 'disbeliefs',
	fife: 'fifes',
	strife: 'strifes',
	carafe: 'carafes',
	gaffe: 'gaffes'
};

function highlightPluralForm(word) {
	const w = String(word == null ? '' : word).trim().toLowerCase();
	if (!w) return '';
	if (highlightPluralExceptions[w]) return highlightPluralExceptions[w];
	if (/(?:s|x|z|ch|sh)$/.test(w)) return w + 'es';
	if (/[^aeiou]y$/.test(w)) return w.slice(0, -1) + 'ies';
	if (/fe$/.test(w)) return w.slice(0, -2) + 'ves';
	if (/f$/.test(w)) return w.slice(0, -1) + 'ves';
	if (/o$/.test(w)) return w + 'es';
	return w + 's';
}

function highlightTokenMatches(entryToken, textToken, allowPlural) {
	const a = String(entryToken == null ? '' : entryToken).trim().toLowerCase();
	const b = String(textToken == null ? '' : textToken).trim().toLowerCase();
	if (!a || !b) return false;
	if (a === b) return true;
	if (!allowPlural) return false;
	return highlightPluralForm(a) === b || highlightPluralForm(b) === a;
}

function getHighlightEntries() {
	const raw = Array.isArray(kApp_Categories)
		? kApp_Categories
		: String(kApp_Categories == null ? '' : kApp_Categories).split(/[\n,]+/);
		const seenByCategory = Object.create(null);
		const entries = [];
	raw.forEach(function (item) {
		const isObj = item && typeof item === 'object';
		const categoryName = isObj ? String(item.category_name || item.category || 'Other') : 'Other';
		const explicitNoun = isObj && (item.noun === true || item.isNoun === true);
		const explicitNotNoun = isObj && (item.noun === false || item.isNoun === false);
		const entry = isObj
			? {
				name: String(item.name || item.word || '').trim(),
				category_name: categoryName,
				color: String(item.color || '#ee02e2'),
				noun: explicitNotNoun ? false : (explicitNoun || categoryName === 'Vegetable')
			}
			: {
				name: String(item == null ? '' : item).trim(),
				category_name: 'Other',
				color: '#ee02e2',
				noun: false
			};
		const key = String(categoryName || 'Other').toLowerCase() + '\u0000' + entry.name.toLowerCase();
		if (!entry.name || seenByCategory[key]) return;
		seenByCategory[key] = true;
		entries.push(entry);
	});
	return entries;
}

function getUniqueHighlights() {
	return getHighlightEntries().map(function (entry) { return entry.name; });
}

function getHighlightCategories(word) {
	const key = String(word == null ? '' : word).trim().toLowerCase()
		.replace(/^[^a-z0-9\u00C0-\u024F]+|[^a-z0-9\u00C0-\u024F]+$/g, '');
	if (!key) return [];
	const keyTokens = key.split(/\s+/);
	const entries = getHighlightEntries();
	const matches = [];
	for (let i = 0; i < entries.length; i++) {
		const entry = entries[i];
		const entryTokens = entry.name.toLowerCase().split(/\s+/);
		if (entryTokens.length !== keyTokens.length) continue;
		let exact = true;
		for (let j = 0; j < entryTokens.length; j++) {
			const canPlural = entry.noun === true && j === entryTokens.length - 1;
			if (!highlightTokenMatches(entryTokens[j], keyTokens[j], canPlural)) {
				exact = false;
				break;
			}
		}
		if (exact) {
			matches.push({ name: entry.category_name, color: entry.color || '#ee02e2' });
		}
	}
	const seen = Object.create(null);
	const out = [];
	for (const m of matches) {
		const k = String(m.name || '').toLowerCase();
		if (!k || seen[k]) continue;
		seen[k] = true;
		out.push(m);
	}
	return out;
}
function getHighlightCategory(word) {
	const cats = getHighlightCategories(word);
	return cats.length ? cats[0] : null;
}

