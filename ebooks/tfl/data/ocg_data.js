
const OCG_DATA = [
// {track:"Cam03",en:"1",images:['Cam03'] }
// ,{track:"Cam04",en:"2",images:['Cam04'] }
// ,{track:"Cam05",en:"3",images:['Cam05'] }
// ,{track:"Cam06",en:"4",images:['Cam06'] }
// ,{track:"Cam07",en:"5",images:['Cam07'] }

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
		OCG_DATA.push(json)
	}
}


makeOCG_DATA ()