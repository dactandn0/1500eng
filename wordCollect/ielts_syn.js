var IELTS_SYN = [{title:"Ielts Synonyms",en:""}];
const SynonymData = [
{
	words:"important /ɪmˈpɔːrtnt/| crucial /ˈkruːʃl/| significant /sɪɡˈnɪfɪkənt/",
	type:"a",
	mean:"quan trọng"
},
{
	words:"common /ˈkɑːmən/|universal /juːnɪˈvɜːrsl/|ubiquitous /juːˈbɪkwɪtəs/",
	type:"a",
	mean:"phổ biến"
},
{
	words:"abundant /əˈbʌndənt/| ample /ˈæmpl/| plentiful /ˈplentɪfl/",
	type:"a",
	mean:"dồi dào"
},
{
	words:"neglect /nɪˈɡlekt/| ignore /ɪɡˈnɔːr/",
	type:"v",
	mean:"không quan tâm, bỏ bê"
},
{
	words:"pursue /pərˈsuː/|woo /wuː/",
	type:"v",
	mean:"theo đuổi"
},
{
	words:"find /faɪnd/|seek /siːk/ |look for",
	type:"v",
	mean:"tìm kiếm"
},
{
	words:"accurate /ˈækjərət/|precise /prɪˈsaɪs/|exact /ɪɡˈzækt/",
	type:"a",
	mean:"chính xác"
},
{
	words:"vague /veɪɡ/|obscure /əbˈskjʊr/|hazy /ˈheɪzi/",
	type:"a",
	mean:"không rõ ràng, mơ hồ"
},
{
	words:"top /tɑːp/|peak /piːk/|summit /ˈsʌmɪt/",
	type:"n",
	mean:"đỉnh, đạt đỉnh"
},
{
	words:"competitor /kəmˈpetɪtər/|rival /ˈraɪvl/|opponent /əˈpəʊnənt/",
	type:"n",
	mean:"đối thủ"
},
{
	words:"blame/bleɪm/|condemn/kənˈdem/",
	type:"v",
	mean:"đổ lỗi"
},
{
	words:"opinion /əˈpɪnjən/|perspective /pərˈspektɪv/|standpoint /ˈstændpɔɪnt/",
	type:"n",
	mean:"quan điểm"
},
{
	words:"fame /feɪm/|prestige /preˈstiːʒ/|reputation /repjuˈteɪʃn/",
	type:"n",
	mean:"danh tiếng"
},
{
	words:"build /bɪld/|erect /ɪˈrekt/|establish /ɪˈstæblɪʃ/",
	type:"v",
	mean:"xây dựng"
},
{
	words:"big|massive|colossal /kəˈlɑːsl/|tremendous /trəˈmendəs/|huge",
	type:"a",
	mean:"to lớn"
},
{
	words:"forever (adv) /fɔːrˈɛv.ər/|perpetual (a) /pərˈpetʃuəl/|immutable (a) /ɪˈmjuːtəbl/",
	mean:"mãi mãi"
},
{
	words:"irritate /ˈɪrɪteɪt/|annoy /əˈnɔɪ/|upset /ʌpˈset/",
	type:"v",
	mean:"làm phiền, làm khó chịu"
},
{
	words:"ever since //|Since then //|Since that time //",
	type:"adv",
	mean:"từ đó trở đi"
},
{
	words:"outgoing (a) /ˈɪrɪteɪt/|extrovert (n) /ˈekstrəvɜːrt/",
	mean:"hướng ngoại"
},
]

function progress() {
	var en = ''
	for (var i = 0; i < SynonymData.length; i++) {
		var data = SynonymData[i]
		var type = data.type
		var mean = data.mean
		var words = data.words.split('|')
		for (var k = 0; k < words.length; k++) {
			var fullW = words[k].trim() + addType(type) + addMean(mean) + " [" + showAttachWords(words[k],words) + "] "
			en += fullW + "<br>"
		}
	}
	IELTS_SYN[0].en = en.replace(/\s\s/gi, " ")
}

function addMean(txt) {
	if (!txt || txt.trim().length===0) return ' '
	return txt
}
function addType(txt) {
	if (!txt || txt.trim().length===0) return ' '
	return " (" + txt + ") "
}

function showAttachWords(word, wordArr) {
	var resultTxt = ''
	for (var i = 0; i < wordArr.length; i++) {
		var ele = wordArr[i]
		
		var rrr=  /\/.+\//gi.test(ele)
	//	if (!rrr) console.log('showAttachWords::' + ele)

		if ( ele.indexOf(word) == -1 ) {
			resultTxt += ele.replace(/\/.+\//gi, '').trim() + ', '
		}
	}
	return resultTxt.trim().substring(0, resultTxt.length-2);
}

progress();
