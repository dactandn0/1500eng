var IELTS_SYN = [{title:"Ielts Synonyms",en:""}];
const SynonymData = [
{
	words:"important /ɪmˈpɔːrtnt/|crucial /ˈkruːʃl/|significant /sɪɡˈnɪfɪkənt/",
	type:"a",
	mean:"quan trọng"
},{
	words:"good|great",
	type:"a",
	mean:"tốt, tuyệt"
},{
	words:"exciting /ɪkˈsaɪtɪŋ/|dramatic /drəˈmætɪk/|heady /ˈhedi/|thrilling /ˈθrɪlɪŋ/|exhilarating /ɪɡˈzɪləreɪtɪŋ/",
	type:"a",
	mean:"phấn khởi, thú vị"
},{
	words:"overweight|obese",
	type:"a",
	mean:"béo phì"
},{
	words:"raw|uncooked",
	type:"a",
	mean:"thô, chưa chế biến"
},{
	words:"quite /kwaɪt/|pretty|fairly /ˈferli/|a bit of|rather",
	type:"adv",
	mean:"khá (not very) (+ nouns, adj, adv)"
},{
	words:"abroad (adv)|overseas",
	type:"a",
	mean:"ở nước ngoài"
},{
	words:"teenager|youth /juːθ/",
	type:"n",
	mean:"thanh thiếu niên"
},
{
	words:"ignore|put aside|neglect /nɪˈɡlekt/",
	type:"v",
	mean:"bỏ qua"
},{
	words:"recommend /rekəˈmend/|suggest /səɡˈdʒest/",
	type:"v",
	mean:"gợi ý, đề xuất"
},{
	words:"appraise /əˈpreɪz/|judge /dʒʌdʒ/|appreciate /əˈpriːʃieɪt/",
	type:"v",
	mean:"đánh giá"
},{
	words:"disappear /dɪsəˈpɪr/|vanish",
	type:"v",
	mean:"biến mất"
},{
	words:"get rid of|eliminate",
	type:"v",
	mean:"loại bỏ"
},{
	words:"favorite (a,n) /ˈfeɪvərɪt/ |preference /ˈprefrəns/|first choice",
	type:"n",
	mean:"ưu thích"
},
{
	words:"principal|headmaster",
	type:"n",
	mean:"hiệu trưởng"
},{
	words:"personnel /,p3:sa'nel/|staff /sta:f/",
	type:"n",
	mean:"nhân viên"
},
{
	words:"expert|specialist",
	type:"n",
	mean:"nhà chuyên gia (môn)"
},{
	words:"portion|serving",
	type:"n",
	mean:"phần, khẩu phần"
},
{
	words:"common /ˈkɑːmən/|universal /juːnɪˈvɜːrsl/|ubiquitous /juːˈbɪkwɪtəs/",
	type:"a",
	mean:"phổ biến, toàn thể"
},
{
	words:"abundant /əˈbʌndənt/|ample /ˈæmpl/|plentiful /ˈplentɪfl/",
	type:"a",
	mean:"dồi dào"
},
{
	words:"happy|joyful|cheerful |content (n. nội dung)",
	type:"a",
	mean:"hạnh phúc"
},
{
	words:"sad|unhappy|sorrowful |dejected ",
	type:"a",
	mean:"buồn, chán"
},
{
	words:"tiny|petite|small|little (adv. less. chút ít)",
	type:"a",
	mean:"bé, nhỏ"
},
{
	words:"quick|speedy|rapid|fast (adv)",
	type:"a",
	mean:"nhanh"
},
{
	words:"slow|sluggish|leisurely|unhurried",
	type:"a",
	mean:"chậm rãi"
},{
	words:"smart|intelligent|clever|bright",
	type:"a",
	mean:"thông minh"
},{
	words:"dumb|stupid|foolish|ignorant",
	type:"a",
	mean:"khờ, đần, dốt, vô học"
},{
	words:"rich|wealthy|affluent|prosperous (thịnh vượng)",
	type:"a",
	mean:"giàu có"
},{
	words:"poor|needy|destitute|impoverished",
	type:"a",
	mean:"nghèo nàn"
},{
	words:"beautiful|gorgeous|stunning(kinh ngạc, tuyệt vời)|attractive",
	type:"a",
	mean:"xinh đẹp"
},
{
	words:"friend|buddy (thân)|pal",
	type:"n",
	mean:"bạn bè"
},
{
	words:"vivid /ˈvɪvɪd/|Vibrant /ˈvaɪbrənt/|lively  /ˈlaɪvli/",
	type:"a",
	mean:"sống (sôi) động"
},
{
	words:"various /ˈveriəs/|different /ˈdɪfrənt/|several /ˈsevrəl/",
	type:"a",
	mean:"khác nhau"
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
	words:"conservation /konsǝ'vein/|preservation /prezərˈveɪʃn/",
	type:"n",
	mean:"sự bảo tồn"
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
	words:"opinion /əˈpɪnjən/|perspective /pərˈspektɪv/|standpoint /ˈstændpɔɪnt/|view ( = scenery)",
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
	words:"definitely /ˈdefɪnətli/|certainly /ˈsɜːrtnli/|surely /ˈʃʊrli/",
	type:"adv",
	mean:"chắc chắn"
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

function IELTS_SYN_IsIn(wordFormed) {
	var arr = IELTS_SYN[0].en.split('<br>')
	for (var i = 0; i < arr.length; i++) {
		var wordFullData = arr[i]
		var regex = new RegExp(`^${wordFormed}\\b` , 'g')   // wordphai đầu dòng
		var matches = wordFullData.match(regex)
		if (matches && matches.length > 0 ) {
			return wordFullData
		}
	}
	return ''
}

function addMean(txt) {
	if (!txt ||txt.trim().length===0) return ' '
	return txt
}
function addType(txt) {
	if (!txt ||txt.trim().length===0) return ' '
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
