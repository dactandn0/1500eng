
let VOA_80_DATA = [

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