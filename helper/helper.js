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
  	&& target.parentNode.nodeName == KKK
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
				if (k % 2=== 0) color = 'green'
				var jsonEle = {
					unit: lesson.unit ? lesson.unit : lesson.track,
					title:lesson.title ? lesson.title : '#',
					color: color,
					vocas: vocas
				}
				rtScrope.vocaEbook.push(jsonEle)
			}
		}
	}
	
}

