function softArrStr(arrInput, giamDan = true)
{
	arrInput.sort((a,b) =>
	{
		if (giamDan) return b.length - a.length
		if (!giamDan) return a.length - b.length
	})
	return arrInput
}

function arrRemoveZeroLenghthEle (arr) 
{
	if (arr)
	return arr.filter(function(ele) 
	{ 
		return ele.trim().length > 0 
	});
}

function Helper_ArrSortEleLength (arr)
{
	if (!arr) return arr
	arr.sort((a,b) =>
	{
		aArr = a.split(' ')
		bArr = b.split(' ')
		return bArr.length - aArr.length
	})
	return arr;
}

function Helper_SoftStringData (arrStr)
{
	var arr = arrStr.split(',')
	arr.sort((a,b) =>
	{
		aArr = a.split(' ')
		bArr = b.split(' ')
		return bArr.length - aArr.length
	})
	return arr.toString();
}

function Helper_getTouchTextEvent(ev)
{
  var KKK = kNgClickTagName.toUpperCase()

  var target = ev.target


   if (target.nodeName == KKK
  	&& (target.parentNode.nodeName == KKK || target.parentNode.nodeName == 'B')
  	) 
  	return target.parentNode.innerText

  if (target.nodeName == KKK
  	&& target.parentNode.parentNode.nodeName !== KKK
  	) 
  	return target.innerText

  while (target.parentElement) {
    target = target.parentNode;
    if (target.nodeName == KKK)
     {
      return target.innerText
     }
  }
  return;
}

function Helper_DoMenu(_scope)
{
	var kStories = _scope.stories
	var en = ""
	for (var i = 0; i < kStories.length; i++) {
		var lesson = kStories[i]
		if (lesson.title)
		{
			var order = lesson.track || lesson.unit || i
			en += order + ') ' + lesson.title + '<br>'
		}
	}
	var menu = {
		track: 'Menu',
		title: 'Lesson',
		en:en
	}
	var r = []
	r.push(menu)

	_scope.stories = r.concat(kStories)
}

function Helper_MakeVoca_Menu_Titles(rScope, _scope)
{
	var book = _scope.stories;

	rScope.vocaEbook = []
	for (var k = 0; k < book.length; k++) 
	{
		var lesson = book[k]
		if (lesson.voca && lesson.voca.trim().length > 0)
		{
			var vocas = lesson.voca.split(',');
			var color = "blue";
			
			var unitTrack = lesson.unit | lesson.track
			if (unitTrack) unitTrack = 'Unit: ' + unitTrack + '.'
			var jsonEle = {
				unit: unitTrack,
				title:lesson.title ? lesson.title : '#',
				vocas: vocas,
				lesson: lesson,
			}
			rScope.vocaEbook.push(jsonEle)
		}
	}

	Helper_DoMenu(_scope)
	showStoryTitles(_scope);

}


function makeVocaEbook(rtScrope, ...args)
{
	rtScrope.vocaEbook = []
	for (var i = 0; i < args.length; i++)
	{
		var book = args[i];
		for (var k = 0; k < book.length; k++) 
		{
			var lesson = book[k]
			if (lesson.voca && lesson.voca.trim().length > 0)
			{
				var vocas = lesson.voca.split(',');
				var color = "blue";
				
				var unitTrack = lesson.unit || lesson.track
				if (unitTrack) unitTrack = 'Unit: ' + unitTrack + '.'
				var jsonEle = {
					unit: unitTrack,
					title:lesson.title ? lesson.title : '#',
					vocas: vocas,
					lesson: lesson,
				}
				rtScrope.vocaEbook.push(jsonEle)
			}
		}
	}
	
}

// for Reading fullTitles
function showStoryTitles(_scope) {
	var data = _scope.stories
	var r = []
	for (var k = 0; k < data.length; k++) {
		var obj = data[k]
		var json_result = getFullTile(obj)
		r.push(json_result);
	}
	_scope.titles = r;
}

function getFullTile(obj) {
	var unit = obj.unit ? ('U' + obj.unit + ' ') : '';
	var track  = (obj.track) ? (obj.track + ' ') : '';
	var title  = (obj.title) ? (obj.title) : '';
	var hasNote = obj.note && obj.note.trim().length > 0
	var hasExercise = (obj.T_F_NG && obj.T_F_NG.trim().length > 0)
						|| (obj.images && obj.images.length > 0)

	return {
		unit : unit,
		track : track,
		title : title,
		blankEn : !obj.en || obj.en.trim().length == 0,
		hasNote : hasNote,
		hasExercise : hasExercise,
		fTitle : track + unit + title 
	}
}