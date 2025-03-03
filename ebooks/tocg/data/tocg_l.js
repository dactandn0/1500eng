const TOCG_DATA_L = [

]

function makeOCG_DATA () 
{
	for (var i = 3; i <= 38; i++) 
	{
		var trackName = 'Cam' + (i < 10 ? ('0'+ i) : i )
		var json = {
			track: trackName,
			en: trackName,
			images: [trackName],
		}
		TOCG_DATA_L.push(json)
	}
}


makeOCG_DATA ()