
let VOA_80_DATA = [
{
	track:"02"
	,title:"Designing a QuakeResistant Building Starts at the Soil "
	,en:"I'm Alex Villarreal with the VOA Special English Technology Report.<br>\
Builders in developing countries are often not required to build strong buildings.<br>\
So, when a disaster strikes, the damage is often widespread.<br>\
Yet, Japan is one of the most developed countries in the world.<br>\
Still, the March eleventh tsunami waves destroyed more than fourteen thousand buildings.<br>\
Brandy Cox is an assistant professor of civil engineering at the University of Arkansas.<br>\
He is also an earthquake expert with an organization called Geotechnical Extreme Events Reconnaissance, or GEER.<br>\
The group studies major disasters.<br>\
Professor Cox says Japan has one of the best building code systems in the world.<br>\
However, he says, this earthquake was huge, one of the top five earthquakes in recorded history.<br>\
So anytime there is an earthquake that large, there is going to be damage.<br>\
The quake measured magnitude nine.<br>\
He says one thing many people don't understand is that building codes are meant to prevent loss of life in earthquakes.<br>\
That doesn't mean that the buildings won't have major damage.<br>\
Mr. Cox says Japan has invested a lot in seismic research and design since a magnitude seven point five earthquake in Niigata in nineteen sixtyfour. That same year a nine point two quake shook the American state of Alaska.<br>\
He says those two earthquakes opened up a lot of new research on something called soil liquefaction.<br>\
Soil liquefaction is the process by which the strength of stiffness of soil is weakened by an event like the shaking of an earthquake.<br>\
The soil begins to move like liquid. <br>\
Professor Cox says the first step to designing an earthquakeresistant building is to study the soil.<br>\
Then the structural engineers take that information and decide the details of the construction, such as, is this going to be a steel structure?<br>\
Is it going to be reinforced concrete? <br>\
How will the framing of the building be designed?<br>\
A team from Geotechnical Extreme Events Reconnaissance is going to Japan to examine the destruction.<br>\
Mr. Cox says they will also be working on rebuilding efforts. They want to make sure that schools, hospitals, police and fire stations and government buildings are rebuilt well.<br>\
Mr. Cox and other members of GEER went to Haiti after the powerful earthquake last year, and continue to work with Haitian officials.<br>\
For VOA Special English, I'm Alex Villarreal."
},
{
	track:"03",
	title:"Microsoft Says Google Blocks Competition in Europe Search Market",
	en:"\
This is VOA Special English Economics Report Microsoft has fought legal battles with officials in Europe and the United States over competition in the personal computer market.<br>\
But at the end of March, Microsoft accused Google of being anti-competitive. A complaint to the European Commission accused Google of unfairly controlling the Internet search market in Europe.<br>\
Google was already talking to the Commission about the issue and said it was happy to explain to anyone how its business works.<br>\
But Google also faced other issues <br>\
Gmail users in China began reporting problems with Google's email service in late February. The problems came as news of the revolution in the Arab world filled the Internet and there were online calls for protests in China.<br>\
Google said the government was interfering with its email service<br>\
Chinese Foreign Ministry spokewoman Jiang Yu called those accusations unacceptable<br>\
But Google spokewoman Jessica Powell said, “This is a government blockage, carefully designed to look like the problem is with Gmail. Google is the world leader in<br>\
Internet search But in China the biggest search engine is Baidu And in the late March, Chinese's largest Internet media company,<br>\
Sina, dropped Google's search engine from its website. Sina said it would use its own technology An estimated four hundred fifty million Chinese are online – about half of all Internet users in Asia.<br>\
In two thousand ten, Google said, a cyberattack from China had attempted to get the information from the Gmail accounts of human rights activists.<br>\
Google also express concerns about censorship.<br>\
So Google relocated its Chinese search engine from the mainland to Hong Kong.<br>\
In March, Google also faced new problems at home.<br>\
A federal judge in New York ruled against its plan to put millions of books online.<br>\
Google wants to create a digital library of all the world's books. It reached one hundred twenty five million dollar deal in two thousand eight with groups representing writers and publishers.<br>\
Google agreed to create a system to pay copyright holders when their works are used online.<br>\
But judge Denny Chin rejected the proposed settlement.<br>\
He said it would give Google monopoly control of the book search market But he left open the possibility for a new plan<br>\
On a similar issue, Baidu in China said it removed almost three million documents from its library. <br>\
Writers have complained that Baidu did not have permission for their works to appear on its document-sharing site. <br>\
For VOA Special English, I'm Alex Villarreal<br>\
You can read and listen to our program about business and other subjects at voaspeacialenglish.com.<br>\
And click on the classroom for interactive exercises for English learners.<br>\
	"
}


]

function MAKE_VOA_DATA () 
{
	let rrr = []
	for (var i = 2; i <= 10; i++) 
	{
		const trackName = (i < 10 ? ('0'+ i) : i )

		var json = {
			track: trackName,
			en: '',
		}

		let idx = VOA_80_DATA.findIndex(ele => ele && ele.track == trackName);
		if (idx >= 0)
		{
			var findObj = VOA_80_DATA[idx]
			json.en = findObj.en
			json.vi = findObj.vi || ''
			json.voca = findObj.voca || ''
			json.note = findObj.note || ''
			json.isTest = findObj.isTest || false

		}

		rrr.push(json)
	}

	VOA_80_DATA = rrr;
}

MAKE_VOA_DATA ()