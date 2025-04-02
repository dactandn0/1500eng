let WORD_FAMILY_DATA = [
	"conservation (n)| conserve (v)",
	"defense (n)| defender (n)| defend (n)",
	"environment (n)| environmental (a)| environmentally (adv)",
	"erosion (n)| erode (v)",
	"extent (n)| extend (v)",
	"extensive (a)| extensively (adv)",
	"pollution (n)| pollutant (n)| pollute (v)",
	"stability (n)| stabilize (v)| stable (a)",
	"evolution (n)| evolve (v)| evolutionary (a)",
	"fascination (n)| fascinate (v)| fascinating (a)",
	"migration (n)| migrant (n)| migrate (v)| migratory (a)",
	"navigation (n)| navigator (n)| navigate (v)| navigational (a)",
	"observation (n)| observer (n)| observe (v)| observant (a)",
	"adaptation (n)| adapt (v)| adaptable (a)",
	"diversity (n)| diversification (n)| diversify (v)| diverse (a)",
	"extreme (n)| extreme (a)| extremely (adv)",
	"resilience (n)| resilient (a)| resiliently (adv)",
	"stress (n,v)| stressor (n)| stressful (adv)",
	"violence (n)| violent (a)| violently (adv)",
	"complication (n)| complicate (v)| complicated (a)",
	"coordination (n)| coordinate (v)| coordinated (a)",
	"demonstration (n)| demonstrate (v)| demonstrative (a)",
	"performance (n)| performer (n)| perform (v)",
	"tolerance (n)| tolerant (a)| tolerate (v)",
	"vision (n)| visual (a)| visually (adv)",
]


function getWordFamily(word)
{
	word = word.toLowerCase()
	var arr = []
	for (var i = 0; i < WORD_FAMILY_DATA.length; i++) 
	{
		var group = WORD_FAMILY_DATA[i]
		if (group.indexOf(word) != -1)
		{
			arr = group.split('|')
			arr = arr.filter(e => e.indexOf(word) == -1)
			break
		}
	}
	return arr.join()
}

// getWordFamily('conservation')