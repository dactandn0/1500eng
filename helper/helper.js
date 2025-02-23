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
				
				var unitTrack = lesson.unit | lesson.track
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

