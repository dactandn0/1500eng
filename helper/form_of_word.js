const BOTH_COUNT_AND_UNCOUNT = "chicken,paper,time,hair,room,memory,coffee,water,beer,tea,soda,chocolate,light,gear,art,science"

const SPECIAL_WORDS = "definitely,also,just,only,always,absolutely,quite,sometimes,own,even if,even,though,although,despite,certainly,of course,so on\
,probably,currently,unfortunately,hardly,rarely,much,more,really,recently,ever,never\
,absolutely,actually,completely,really,totally,thoroughly,entirely,simply\
,pretty,quite,rather,fairly,basically,honestly\
,since,as,in fact,on top of that,what's more,besides,plus,as much as\
,incredibly,considerably,particularly,significantly\
,a bit of,a sense of,a bit,a lot"

const NOUN_SAME_VERBS = "attempt,compliment,cause,exercise,poison,access,dump,mail,shelter,ache,dust,make,shock,act,dye,man,shop,address,echo,march,show,aim,email,mark,sign,alert,end,match,\
signal,answer,escape,mate,silence,arrest,escort,matter,sin,attack,esteem,mean,sip,attribute,estimate,measure,skate,auction,exchange,milk,sketch,back,\
excuse,mind,ski,bail,exhibit,mine,slice,balance,experience,miss,slide,balloon,eye,mistake,slip,ban,face,moor,smell,bandage,fall,move,smile,bank,favor,\
mug,smirk,bare,fax,nail,smoke,bargain,fear,name,snack,battle,feel,need,snow,beam,fight,nest,sound,bear,file,notch,span,beat,fill,note,spot,bend,film,\
notice,spray,benefit,finish,number,sprout,blame,fish,object,squash,blast,fix,offer,stain,bleach,flap,oil,stamp,block,flash,order,stand,bloom,float,pack,\
star,blow,flood,pad,start,board,floss,paddle,state,bomb,flow,paint,steer,bother,flower,park,step,bounce,fly,part,sting,bow,fold,pass,stop,box,fool,paste,\
store,bread,force,pat,storm,break,form,pause,stress,breed,frame,pay,strip,broadcast,freeze,pedal,stroke,brush,frown,peel,struggle,bump,function,pelt,study,\
burn,garden,permit,stuff,buy,gaze,phone,stunt,cake,gel,photograph,subject,call,glue,pick,suit,camp,grate,pine,supply,care,grease,place,support,catch,grill,\
plan,surf,cause,grimace,plane,surprise,challenge,grin,plant,suspect,change,grip,play,swap,chant,guarantee,plow,swing,charge,guard,plug,swivel,cheat,guess,\
point,tack,check,guide,poke,talk,cheer,hammer,pop,taste,chip,hand,post,tear,claim,handle,practice,tease,clip,harm,praise,telephone,cloud,harness,present,\
test,clue,hate,proceed,thought,coach,head,process,thunder,color,heap,produce,tick,comb,heat,progress,tie,combat,help,project,time,comfort,hide,promise,tip,\
conduct,highlight,protest,tire,conflict,hike,pull,toast,contest,hit,pump,touch,contract,hold,punch,tour,contrast,hop,push,tow,control,hope,question,trace,cook,hose,quilt,track,coop,hug,quiz,trade,\
copy,humor,race,train,cost,hunt,rain,transport,count,hurry,raise,trap,cover,ice,rant,travel,crack,impact,rate,treat,crash,inch,reach,trick,crate,increase,reason,trim,credit,influence,rebel,trust,\
crush,insult,record,tug,cure,interest,refill,turn,curl,iron,refund,twist,curve,itch,reign,type,cut,jail,reject,upstage,cycle,jam,rent,use,dam,joke,repair,vacuum,damage,judge,repeat,value,dance,jump,\
reply,visit,deal,keep,report,voice,decay,kick,request,vote,decrease,kiss,rhyme,wake,delay,knit,ring,walk,delight,knock,riot,waltz,demand,knot,risk,design,label,rock,water,dial,land,roll,wave,die,\
last,row,wear,dislike,laugh,ruin,whip,display,lead,rule,whisper,dive,leap,run,whistle,divorce,level,sail,wick,dock,license,sand,wink,double,lie,saw,wire,doubt,lift,scare,wish,drain,light,scratch,work,\
draw,limit,screw,worry,dream,link,search,wrap,dress,load,season,wreck,drill,loan,sense,drink,lock,shampoo,yawn,drive,look,shape,yield,duck,love,share,zone,watch";

const UNCOUNT_NOUNS = "misinformation,serenity,advice,information,knowledge,imagination,creativity,education,intelligence,love,luck,music,air,cement,clothing,energy,glue,gold,surf,coral,\
iron,money,oil,paper,salt,sand,steel,wood,water,gasoline,steam,sugar,vinegar,beauty,confidence,happiness,justice,peace,respect,safety,strength,time,\
furniture,equipment,machinery,tools,weapons,lightning,rain,snow,wind,medicine,accommodation,advertising,beer,bread,childhood,chocolate,coffee,courage,\
fame,food,freedom,fun,hair,health,homework,juice,luggage,milk,news,poetry,progress,research,rice,rubbish,tea,transport,travel,whisky,work,aggression,\
assistance,attention,athletics,access,adulthood,alcohol,applause,agriculture,atmosphere,anger,art,absence,aid,arithmetic,age,beef,bravery,business,\
blood,botany,bacon,baggage,ballet,butter,biology,behaviour,cake,cash,chaos,compassion,calm,corruption,comprehension,cheese,currency,carbon,cardboard,\
chalk,chess,coal,commerce,confusion,cookery,countryside,crockery,cutlery,content,cotton,data,dancing,democracy,damage,darkness,determination,\
delight,depression,driving,dignity,dessert,design,dust,distribution,dirt,duty,economics,earth,expense,electricity,enthusiasm,danger,enjoyment,\
envy,evil,engineering,entertainment,evolution,existence,ethics,evidence,employment,experience,failure,fire,fiction,fashion,forgiveness,faith,flour,\
flu,fear,finance,fruit,fuel,friendship,flesh,genetics,garbage,growth,grief,grammar,garlic,gossip,gymnastics,glass,grass,golf,gratitude,ground,guilt,\
harm,hardware,hydrogen,help,hate,hope,hospitality,heat,hatred,hunger,honey,humour,honesty,height,housework,history,ice,independence,infrastructure,\
ice cream,importance,industry,irony,injustice,innocence,insurance,inflation,judo,jealousy,jam,jewellery,joy,kindness,karate,laughter,labour,lava,\
livestock,land,leather,linguistics,light,loneliness,lack,litter,leisure,logic,literature,mail,mankind,marriage,magic,marble,mercy,meat,management,\
mathematics,moonlight,methane,metal,mayonnaise,mud,mist,motivation,motherhood,measles,nature,nitrogen,nutrition,noise,nonsense,nurture,obedience,\
obesity,oxygen,passion,parking,pressure,perfume,physics,psychology,peel,pepper,patience,permission,philosophy,plastic,production,pollution,pleasure,\
pork,petrol,pronunciation,pride,policy,purity,poverty,punctuation,power,produce,protection,publicity,pasta,pay,pain,painting,quartz,quality,quantity,\
reliability,rum,recreation,reality,revenge,racism,relief,relaxation,religion,salad,scaffolding,soil,satisfaction,satire,security,sorrow,seafood,speed,\
scenery,sewing,space,software,seaside,streaming,stupidity,shopping,stress,shame,spite,silence,sunshine,sleep,status,success,soup,smoking,silver,symmetry,\
spaghetti,spelling,soap,sport,stuff,smoke,tolerance,thirst,technology,trousers,tennis,trade,timber,turbulence,toothpaste,traffic,toast,thunder,transportation,\
trust,trouble,temperature,understanding,usage,underwear,unemployment,unity,violence,veal,environment,\
validity,vitality,vision,vegetation,vegetarianism,vengeance,warmth,weight,whiskey,weather,wildlife,welfare,wine,wisdom,wealth,wheat,wool,width,yoga,\
youth,yeast,zoology,zinc";

const NGUYEN_AM = 'ueoai'

function Helper_IsUncountNoun(wordInput) {
	var word = wordInput
	if (wordInput.indexOf(" ") >= 0)
	{
		word = wordInput.split(" ")[0]
	}
	var regex = new RegExp(`\\b${word}\\b` , 'gi')
	var matches = UNCOUNT_NOUNS.match(regex);

	if (matches && matches.length > 0) {
		wordInput = wordInput.replace(word, UNCOUNT_TAG_BEGIN+word+UNCOUNT_TAG_END)
	}
	return wordInput;
}

function Helper_N_V_Add_S_ES(words) {

	words = words.trim();
	var word = words;
	var rest = "";
	// word is combine of 2,3...
	if (words.indexOf(" ") >= 0)
	{
		word = words.split(" ")[0]
		rest = words.substring(word.length)
	}
	// local (a) # locals (n)
	var excepts = ['local','economic']
 	for (var i = 0; i < excepts.length; i++) {
		if (word===excepts[i]) return word + rest
	}
	if (word==='potato') return 'potatoes' + rest
	if (word==='tomato') return 'tomatoes' + rest
	if (word==='do') return 'does' + rest
	if (word==='go') return 'goes' + rest

	var r = /^\w+.*(s|ss|sh|ch|x)+$/gi.test(word)
	if (r) return word+'es' + rest

	r = /^\w+.*(uy|ey|oy|ay|iy)+$/gi.test(word)
	if (r) return word+'s' + rest

	r = /^\w+.*[^ueoai]+y$/gi.test(word)
	if (r) return word.substring(0, word.length-1) + 'ies' + rest

	return word +'s' + rest
}

function Helper_Add_ED(words) {
	words = words.trim();
	var word = words;
	var rest = "";
	// word is combine of 2,3...
	if (words.indexOf(" ") >= 0)
	{
		word = words.split(" ")[0]
		rest = words.substring(word.length)
	}
	// local (a) # locals (n)
	var excepts = ['']
 	for (var i = 0; i < excepts.length; i++) {
		if (word===excepts[i]) return word + rest
	}

	var r = /^\w+.*(e)+$/gi.test(word)  // ending with -e
	if (r) return word +'d' + rest

	r = /^\.*[^ueoai][ueoai][^ueoaiyw]$/gi.test(word)   	// phụ âm + nguyên âm + phụ âm (not y&w)
	if (r) return word + word[word.length-1] + 'ed' + rest

	r = /^\w+.*[^ueoai]y$/gi.test(word)
	if (r) return word.substring(0, word.length-1) + 'ied' + rest

	return word +'ed' + rest
}

function Helper_N_V_Add_ING(words) {

	words = words.trim();
	var word = words;
	var rest = "";
	// word is combine of 2,3...
	if (words.indexOf(" ") >= 0)
	{
		word = words.split(" ")[0]
		rest = words.substring(word.length)
	}
	var excepts = ['strike','dress']    // dressing = nước sốt
 	for (var i = 0; i < excepts.length; i++) {
		if (word===excepts[i]) return word + rest
	}
	if (word==='reward') return 'reward' + rest   // reward(n) # rewarding (a)
	if (word==='be') return 'being' + rest

	var r = /^\w+.*(h|w|x|y)+$/gi.test(word)
	if (r) return word+'ing' + rest

	r = /^\w+.*(ee){1}\w{0,1}$/gi.test(word)
	if (r) return word+'ing' + rest
		
	r = /^\w+.*(ie){1}$/gi.test(word)
	if (r) return word.substring(0, word.length-2) + 'ying' + rest

	r = /^\w+.*[ueoai]+[^hwxy]$/gi.test(word)
	if (r) return word + word[word.length-1] + 'ing' + rest

	r = /^\w+.*[^ei](e)+$/gi.test(word)
	if (r) return word.substring(0, word.length-1) + 'ing' + rest

	return word +'ing' + rest
}

function IsVerbInData(SeqWord, word) {
	if( SeqWord.indexOf(' - ') !== -1 ) 
	{
		return SeqWord.indexOf(word) !== -1
	}
	return false;
}

// word = bare in Data
// touchedWord = touched in web
function Helper_IsFormOfWord (word, touchedWord) {
	var isVerb = IsVerbInData(word, touchedWord);
	if (isVerb) return true;

	var add_E_ES = Helper_N_V_Add_S_ES(word).toLowerCase(); 
	var add_ING = Helper_N_V_Add_ING(word).toLowerCase();
	var add_Ly = Helper_A_Add_LY(word).toLowerCase();
	var add_ER = Helper_A_Add_ER(word).toLowerCase();
	var add_EST = Helper_A_Add_EST(word).toLowerCase();
	var add_ED = Helper_Add_ED(word).toLowerCase();
	return touchedWord === add_E_ES 
			|| touchedWord === add_ING 
			|| touchedWord === add_Ly
			|| touchedWord === add_ER
			|| touchedWord === add_EST
			|| touchedWord === add_ED
}

function xxx () {
	var word = "go to word"

	if (word.indexOf(" ") >= 0)
	{
		var firstW = word.split(" ")[0]
	var rest = word.substring(firstW.length)
	console.log(firstW)
	console.log(rest)
	}
}

function Helper_A_Add_LY(words) {

	words = words.trim();
	var word = words;
	var rest = "";
	// word is combine of 2,3...
	if (words.indexOf(" ") >= 0)
	{
		word = words.split(" ")[0]
		rest = words.substring(word.length)
	}
	var excepts = ['hard','late','fast', 'early','high','near','straight','wrong', 'wide', 'free'  // adv same adj
	 			  ]
	for (var i = 0; i < excepts.length; i++) {
		if (word===excepts[i]) return word + rest
	}
	if (word==='public') return 'publicly' + rest

	var r = /^\w+.*(y){1}$/gi.test(word)   			// end with y
	if (r) return word.substring(0, word.length-1) + 'ily' + rest

	r = /^\w+.*(able|ible|le){1}$/gi.test(word)		// remove e to add 'y'
	if (r) return word.substring(0, word.length-1) + 'y' + rest
		
	r = /^\w+.*(ic){1}$/gi.test(word)
	if (r) return word + 'ally' + rest

 	// the rest
	return word +'ly' + rest
}

function Helper_A_Add_ER(words) {

	words = words.trim();
	var word = words;
	var rest = "";
	// word is combine of 2,3...
	if (words.indexOf(" ") >= 0)
	{
		word = words.split(" ")[0]
		rest = words.substring(word.length)
	}
	var excepts = ['old','late']		// need define ss>,ssI in data.js
	for (var i = 0; i < excepts.length; i++) {
		if (word===excepts[i]) return word + rest
	}
//	if (word==='good' || word==='well') return 'better' + rest
//	if (word==='bad' || word==='badly') return 'worse' + rest
	if (word==='little') return 'less' + rest
	if (word==='near') return 'nearer' + rest

	var r = /^\w+.*(y){1}$/gi.test(word)   			// end with y
	if (r) return word.substring(0, word.length-1) + 'ier' + rest

	r = /^\w+.*(e){1}$/gi.test(word)	// end with e
	if (r) return word + 'r' + rest

	r = /^\w+.*(w|r|re|le|te|et){1}$/gi.test(word)	// end that regarded as a short or long adject
	if (r) return word + 'er' + rest
		
	r = /^\w+.*[ueoai]+[^ueoai]$/gi.test(word)
	if (r) return word + word[word.length-1]  + 'er' + rest

 	// the rest
	return word +'er' + rest
}

// www.voca.vn/blog/so-sanh-hon-so-sanh-nhat--trong-tieng-anh-1265
function Helper_A_Add_EST(words) {

	words = words.trim();
	var word = words;
	var rest = "";
	// word is combine of 2,3...
	if (words.indexOf(" ") >= 0)
	{
		word = words.split(" ")[0]
		rest = words.substring(word.length)
	}
	var excepts = ['old','late']   					// need define ss>,ssI in data.js
	for (var i = 0; i < excepts.length; i++) {
		if (word===excepts[i]) return word + rest
	}
//	if (word==='good' || word==='well') return 'best' + rest
//	if (word==='bad' || word==='badly') return 'worst' + rest
	if (word==='little') return 'least' + rest
	if (word==='near') return 'nearest' + rest

	var r = /^\w+.*(y){1}$/gi.test(word)   			// end with y
	if (r) return word.substring(0, word.length-1) + 'iest' + rest

	r = /^\w+.*(e){1}$/gi.test(word)	// end with e
	if (r) return word + 'st' + rest
	
	r = /^\w+.*(w|r|re|le|te|et){1}$/gi.test(word)	// end that regarded as a short or long adject
	if (r) return word + 'est' + rest

	r = /^\w+.*[ueoai]+[^ueoai]$/gi.test(word)   // except near
	if (r) return word + word[word.length-1]  + 'est' + rest

 	// the rest
	return word +'est' + rest
}



function testED(word) {
	console.log(Helper_Add_ED(word))
}

function testEST(word) {
	console.log(Helper_A_Add_EST(word))
}

function testLy(word) {
	console.log(Helper_A_Add_LY(word))
}

function testS(word) {
	console.log(Helper_N_V_Add_S_ES(word))
}

function testIng(word) {
	console.log(Helper_N_V_Add_ING(word))
}

// testED('poison')
// testED('darken')
// testED('cook')
// testED('help')
// testED('watch')

// testLy('incredible')
// testEST('small')
// testEST('bad')
// testEST('near')
// testEST('bad')
// testEST('slowly')
// testEST('slowly')
// testEST('narrow')


//testS('Nutrient')
/*
 testIng("Fix")
 testIng("Snow")
 testIng("Sleep")
 testIng("Prefer")
 testIng("Lie")
 testIng("Die")
 testIng("Arrive")
 testIng("agree")
 testIng("live")
*/

