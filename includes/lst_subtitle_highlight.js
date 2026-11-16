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
frozen
prepared dinners
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
expand 
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
carry-on luggage
overhead bins
seat backs
tray tables
of the most
upright position
further
patience
estimated departure time
flight information screens
severe weather conditions
transfer
passenger
onward boarding pass
connecting flight gate
departure
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
