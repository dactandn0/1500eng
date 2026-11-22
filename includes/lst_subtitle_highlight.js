const lst_highlight = `
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
`;

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

function getUniqueHighlights() {
	return filterUniqueHighlights(lst_highlight);
}
