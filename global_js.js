
const UNCOUNT_TAG_BEGIN = '<xxx class="abcdxyz">'
const UNCOUNT_TAG_END = '</xxx>'
const kBackTimeAudio = 8; //8s

var Helper_AudioSpeed = 0.9;
var UtterEnd = true;

// console.log("uncount_nouns.js")
const BOTH_COUNT_AND_UNCOUNT = "chicken,paper,time,hair,room,memory,coffee,water,beer,tea,soda,chocolate,light,gear,art,science"

const NOUN_SAME_VERBS = "access,dump,mail,shelter,ache,dust,make,shock,act,dye,man,shop,address,echo,march,show,aim,email,mark,sign,alert,end,match,\
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
reply,visit,deal,keep,report,voice,decay,kick,request,vote,decrease,kiss,rhyme,wake,delay,knit,ring,walk,delight,knock,riot,waltz,demand,knot,risk,watch,design,label,rock,water,dial,land,roll,wave,die,\
last,row,wear,dislike,laugh,ruin,whip,display,lead,rule,whisper,dive,leap,run,whistle,divorce,level,sail,wick,dock,license,sand,wink,double,lie,saw,wire,doubt,lift,scare,wish,drain,light,scratch,work,\
draw,limit,screw,worry,dream,link,search,wrap,dress,load,season,wreck,drill,loan,sense,drink,lock,shampoo,yawn,drive,look,shape,yield,duck,love,share,zone";

const UNCOUNT_NOUNS = "advice,information,knowledge,imagination,creativity,education,intelligence,love,luck,music,air,cement,clothing,energy,glue,gold,coral,\
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
scenery,sewing,space,software,seaside,stream,stupidity,shopping,stress,shame,spite,silence,sunshine,sleep,status,success,soup,smoking,silver,symmetry,\
spaghetti,spelling,soap,sport,stuff,smoke,tolerance,thirst,technology,trousers,tennis,trade,timber,turbulence,toothpaste,traffic,toast,thunder,transportation,\
trust,trouble,temperature,understanding,usage,underwear,unemployment,unity,violence,veal,environment,\
validity,vitality,vision,vegetation,vegetarianism,vengeance,warmth,weight,whiskey,weather,wildlife,welfare,wine,wisdom,wealth,wheat,wool,width,yoga,\
youth,yeast,zoology,zinc";


function MYLOG(msg) {
	console.log(msg);
}


RANGE = function(min, max, step) {
    step = step || 1;
    var input = [];
    for (var i = min; i <= max; i += step) {
        input.push(i);
    }
    return input;
};

document.write('<small class="note">\
	<span class="text-danger">red:</span> uncount.n<br>\
	<u>u:</u> n = v<br>\
	</small>'
	);

var arrBOTH_COUNT_UNCOUNT = [];
var arrUNCOUNT_NOUNS = [];
var arrNOUN_SAME_VERBS = [];
function longStrToArray(long_txt) {
	var arr  = long_txt.replace(/\s*\,\s*/g, ",");
	arr = arr.split(',');
	arr = arr.filter((item, index) => arr.indexOf(item) === index); // remove dup
//	console.log(arr.toString());
	return arr;
};

function preprocess() {
	arrUNCOUNT_NOUNS = longStrToArray(UNCOUNT_NOUNS);
	arrNOUN_SAME_VERBS = longStrToArray(NOUN_SAME_VERBS);
	// arrBOTH_COUNT_UNCOUNT = longStrToArray(BOTH_COUNT_AND_UNCOUNT);

};

function isInArr(ele, arr) {
	return arr.includes(ele);
};

function hLightWord(word, arr, graph, tagOpen, tagClose) {
	if (isInArr(word, arr)) {
		var regex = new RegExp(`\\b${word}\\b` , 'g')
		return graph.replace(regex, tagOpen + word + tagClose);
	}
	return graph;
}

var dones = []
function ngClickOnWord(word, graph) {
	if (ValidateWord(word) 
		&& word !=='br'
		&& word !=='hr' 
		&& UNCOUNT_TAG_BEGIN.indexOf(word) === -1
		&& !isInArr(word, dones)
		) 
  	{
		const tagOpen = '<span ng-click="Index_ngClickWordSpeak($event)">'
		const tagClose = '</span>'

		var regex = new RegExp(`\\b${word}\\b` , 'g')

		dones.push(word)
		return graph.replace(regex, tagOpen + word + tagClose);
	}
	return graph
}

function processStory (story) {
	if (story.en.trim().length == 0) return story;
	story.enShow = '';
	story.viShow = '';

	// bold title
	var titleEn = story.en.split('<br>')[0];
	story.enShow = story.en.replace('',  '' );

	var titleVi = story.vi.split('<br>')[0];
	story.viShow = story.vi.replace(titleVi, titleVi);


	story.title = titleEn;
	var trackNum = titleEn.replace(/[^0-9.]/g, '');
	story.img = trackNum;

	var words = story.en.match(/\b(\w+)\b/g);
	var kDot = "";
	var kSpace = "";
	for (let i = 0; i < words.length; i++) {
	  	var word = words[i];

		story.enShow = hLightWord(word, arrUNCOUNT_NOUNS, story.enShow , UNCOUNT_TAG_BEGIN, UNCOUNT_TAG_END );
		story.enShow = hLightWord(word, arrNOUN_SAME_VERBS, story.enShow , '<u>', '</u>' );
		story.enShow = ngClickOnWord(word, story.enShow);


	} // for

	if (story.voca) {
		var vocas = story.voca.split(',');
		story.vocaNotes = [];
		for (var i = 0; i < vocas.length; i++) {
			voca = vocas[i].trim();
			var temp = voca;
			if (temp.indexOf("[") >= 0) {
				temp = temp.replace(/\s*\|\s*/g, ", ");
				temp = temp.replace(/\s*\[\s*/g, " : ");
				temp = temp.replace(/\s*\]\s*/g, "");
				story.vocaNotes.push(temp);
			}
			voca = voca.replace(/\[.*\]/g, '').trim();
			var regex = new RegExp(`\\b${voca}\\b` , 'g')
			story.enShow = story.enShow.replace(regex, '<b>' + voca + '</b>');
		}
	}
	return story;

}

function removeVietnameseTones(str) {
	    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
	    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
	    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
	    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
	    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
	    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
	    str = str.replace(/đ/g,"d");
	    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
	    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
	    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
	    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
	    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
	    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
	    str = str.replace(/Đ/g, "D");
	    // Some system encode vietnamese combining accent as individual utf-8 characters
	    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
	    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
	    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
	    // Remove extra spaces
	    // Bỏ các khoảng trắng liền nhau
	    str = str.replace(/ + /g," ");
	    str = str.trim();
	    // Remove punctuations
	    // Bỏ dấu câu, kí tự đặc biệt
	    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
	    return str;
}


function getLastWord(splitChar, string) {
	var str = string.split(splitChar);
	return str[str.length - 1];
}

function deleteLastWord(splitChar, string) {
	if (!string.includes(splitChar)) return string;
	var lastW = getLastWord(splitChar, string)
	return string.replace(splitChar + lastW, "");
}

function ValidateWord(word, minL = 2) 
{	
	var result = true;
	word = word.trim().toLowerCase();
	if (!isAsciiString(word)) result = false;

	let arr = ['<br>','</br>','<b>','</b>', '/','(',')', '[',']'];
	for (var i = 0; i < arr.length; i++) {
		var bList = arr[i];
		if (word.indexOf(bList) >= 0) {
			result = false;
		}
	}
	return result;
}

// for word3000.js
function _scrollIntoView(idx) {
var ele = document.getElementsByClassName("scroll")[idx];
setTimeout(function () {
	if (ele)
	   ele.scrollIntoView({
	       behavior: "smooth",
	       block: "start",
	   });
	}, 100);
}

preprocess();



window.onscroll = function() {scrollFunction()};
function scrollFunction() {
  let mybutton = document.getElementById("btn_back_to_top");
  
  if (!mybutton) return;
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}


function shuffle(array) {
  return array.sort(function() {
    return .5 - Math.random();
  });
}

function isAsciiString(text) {
	var tiengViet = ['giao','vui','trong', 'bao', 'kinh', 'tinh']
	var r = /^[\x00-\x7F]+$/g.test(text) && !isInArr(r, tiengViet);
    return r;
} 

function Helper_GetVocaFromWordFull(wordFull) {
  var splitW = wordFull.trim().split(" ");
  var result = "";
  for (var i = 0; i < splitW.length; i++) {
  	  var part = splitW[i].trim();
  	  if (ValidateWord(part)) 
  	  	result = result + " " + part;
  	  else break;
  }
   
  return result.trim();

}

// arrow up scroll
topFunction = function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


function ArrayRemove(arr, eleName) {
	return arr.filter((item) => {
    	return item !== eleName
	});
}

Helper_Speak = function (event, txt, fullSentence) {

	if (!UtterEnd) return;

	var target = Helper_GetVocaFromWordFull(txt);
	if (fullSentence) target = txt.replace(/(<([^>]+)>)/ig, '');

	 speechSynthesis.getVoices();
	 const utter = new SpeechSynthesisUtterance(target);
	 utter.text = target;
	 utter.rate  = Helper_AudioSpeed;
	 utter.lang='en-US';

	 utter.addEventListener('end', (evt) => {
  		const { charIndex, utterance } = evt
  			UtterEnd = true;
		})

	 speechSynthesis.speak(utter);
	 UtterEnd = false;
}

Helper_ngClickWordSpeak = function (event) {

	if (!UtterEnd) return;

	var target = event.target.innerText;

	 speechSynthesis.getVoices();
	 const utter = new SpeechSynthesisUtterance(target);
	 utter.text = target;
	 utter.rate  = Helper_AudioSpeed;
	 utter.lang='en-US';

	 utter.addEventListener('end', (evt) => {
  		const { charIndex, utterance } = evt
  			UtterEnd = true;
		})

	 speechSynthesis.speak(utter);
	 UtterEnd = false;
}

Helper_SliceHalfString = function (str) {
	var arr = str.split(" ");
	var partOne = ""
	var partTwo = ""

	if (arr.length===1) {
		partOne = str;
		partTwo = ' /unknown/'
	}
	else {
		var mm = Math.floor(arr.length/2)
		for (var i = 0; i < mm; i++) {
			partOne += arr[i] + " "
		}
		partTwo = str.substr(partOne.length)
	}

	return { p1:partOne, p2:partTwo, full:str }
}