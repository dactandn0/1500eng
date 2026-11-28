var SYNONYMS = [{ title: "Ielts Synonyms", en: "" }];

let SynonymData = [
	{
		words: "fortune /ˈfɔːrtʃən/ | luck",
		us: "luck",
		type: "n",
		mean: "vận may mắn"
	},
	{
		words: "hazardous | perilous /ˈperələs/ | dangerous",
		us: "dangerous",
		type: "a",
		mean: "nguy hiểm"
	},
	{
		words: "denial /dɪˈnaɪəl/ | refusal /rɪˈfjuːzl/ | rejection | rebuff | repudiation /rɪˌpjuːdiˈeɪʃn/",
		us: "rejection",
		type: "n",
		mean: "sự từ chối"
	},
	{
		words: "depiction | description | delineation",
		us: "description",
		type: "n",
		mean: "miêu tả"
	},
	{
		words: "suffering (a) /ˈsʌfərɪŋ/ | distress (n) /dɪˈstres/",
		us: "suffering",
		type: "n",
		mean: "đau khổ"
	},
	{
		words: "intense | strong | vigorous",
		us: "intense",
		type: "a",
		mean: "mạnh"
	},
	{
		words: "sense | feel",
		us: "feel",
		type: "n",
		mean: "cảm giác"
	},
	{
		words: "autumn | fall",
		us: "fall",
		type: "n",
		mean: "mùa thu"
	},
	{
		words: "good health | fitness",
		us: "fitness",
		type: "n",
		mean: "sức khỏe tốt"
	},
	{
		words: "convenient | comfortable | advantageous | available | comfy | practical",
		us: "convenient",
		type: "a",
		mean: "tiện lợi"
	},
	{
		words: "focus | concentrate",
		us: "focus",
		type: "v",
		mean: "tập trung"
	},
	{
		words: "supply | offer | provide",
		us: "provide",
		type: "v",
		mean: "cung cấp"
	},
	{
		words: "cost | expense",
		us: "cost",
		type: "n",
		mean: "chi phí"
	},
	{
		words: "deliberately | on purpose",
		us: "on purpose",
		type: "adv",
		mean: "cố ý"
	},
	{
		words: "anonymous /əˈnɑːnɪməs/ | unnamed | nameless /ˈneɪmləs/",
		us: "anonymous",
		type: "a",
		mean: "vô danh"
	},
	{
		words: "reserve | book",
		us: "book",
		type: "v",
		mean: "đặt trước"
	},
	{
		words: "commodity | merchandise | stock | ware | influx | goods",
		us: "merchandise",
		type: "n",
		mean: "hàng hóa"
	},
	{
		words: "downturn | decline",
		us: "decline",
		type: "n",
		mean: "sự suy thoái"
	},
	{
		words: "intricate | complicated | perplexing",
		us: "complicated",
		type: "a",
		mean: "phức tạp"
	},
	{
		words: "wide | broad | large | extensive | vast",
		us: "wide",
		type: "a",
		mean: "rộng rãi"
	},
	{
		words: "vision | look | outlook | contemplation | regard",
		us: "outlook",
		type: "n",
		mean: "sự nhìn, góc nhìn"
	},
	{
		words: "appeal | attraction | attractiveness",
		us: "appeal",
		type: "n",
		mean: "sự hấp dẫn"
	},
	{
		words: "classify | digest | distribute | sort",
		us: "sort",
		type: "v",
		mean: "phân loại"
	},
	{
		words: "important /ɪmˈpɔːrtnt/ | crucial /ˈkruːʃl/ | significant /sɪɡˈnɪfɪkənt/ | be instrumental in | considerable",
		us: "important",
		type: "a",
		mean: "quan trọng"
	},
	{
		words: "obtain /əbˈteɪn/ | acquire /əˈkwaɪər/ | have | get /ɡet/",
		us: "get",
		type: "v",
		mean: "đạt được, lấy được"
	},
	{
		words: "deliberation | consideration",
		us: "consideration",
		type: "n",
		mean: "sự cân nhắc, sự đắn đo, thận trọng"
	},
	{
		words: "discrepancy /dɪˈskrepənsi/ | difference",
		us: "difference",
		type: "n",
		mean: "khác nhau"
	},
	{
		words: "conduct /kənˈdʌkt/ | carry out | perform /pərˈfɔːrm/ | do",
		us: "do",
		type: "v",
		mean: "thực hiện"
	},
	{
		words: "refer /rɪˈfɜːr/ | consult /kənˈsʌlt/ | check with",
		us: "check with",
		type: "v",
		mean: "tham khảo, tư vấn"
	},
	{
		words: "eastern | western | southern | northern",
		us: "eastern",
		type: "a,adv,n",
		mean: "đông tây nam bắc"
	},
	{
		words: "southeast | southwest | northeast | northwest",
		us: "southeast",
		type: "a",
		mean: "đông nam - tây nam - đông bắc - tây bắc"
	},
	{
		words: "strengthen /ˈstreŋkθn/ | boost /buːst/ | enhance /ɪnˈhæns/",
		us: "boost",
		type: "v",
		mean: "gia cố, tăng cường"
	},
	{
		words: "good | great | fine | favorable /ˈfeɪvərəbl/ | fair /fer/",
		us: "great",
		type: "a",
		mean: "tốt, tuyệt"
	},
	{
		words: "car | automobile /ˈɔːtəməbiːl/ | motorcar",
		us: "car",
		type: "n",
		mean: "ô tô"
	},
	{
		words: "many | multiple | numerous /ˈnuːmərəs/ | a lot of",
		us: "a lot of",
		type: "a",
		mean: "nhiều"
	},
	{
		words: "evil /ˈiːvl/ | wicked /ˈwɪkɪd/ | cruel /ˈkruːəl/ | mean",
		us: "cruel",
		type: "a",
		mean: "độc ác"
	},
	{
		words: "appropriate /əˈprəʊpriət/ | suitable | right",
		us: "appropriate",
		type: "a",
		mean: "thích hợp"
	},
	{
		words: "problem /ˈprɑːbləm/ | issue /ˈɪʃuː/ | matter /ˈmætər/",
		us: "issue",
		type: "n",
		mean: "vấn đề"
	},
	{
		words: "exciting /ɪkˈsaɪtɪŋ/ | dramatic /drəˈmætɪk/ | heady /ˈhedi/ | thrilling /ˈθrɪlɪŋ/ | exhilarating /ɪɡˈzɪləreɪtɪŋ/",
		us: "exciting",
		type: "a",
		mean: "phấn khởi, thú vị"
	},
	{
		words: "adjust /əˈdʒʌst/ | regulate /ˈreɡjuleɪt/",
		us: "adjust",
		type: "v",
		mean: "điều chỉnh"
	},
	{
		words: "solve /sɑːlv/ | resolve /rɪˈzɑːlv/ | tackle /ˈtækl/ | fix /fɪks/",
		us: "fix",
		type: "v",
		mean: "giải quyết, gỡ rối"
	},
	{
		words: "overweight | obese",
		us: "overweight",
		type: "a",
		mean: "béo phì"
	},
	{
		words: "increasingly | more and more",
		us: "more and more",
		type: "adv",
		mean: "ngày càng tăng"
	},
	{
		words: "raw | uncooked",
		us: "raw",
		type: "a",
		mean: "thô, chưa chế biến"
	},
	{
		words: "clothes | clothing | apparel | garment | outfit",
		us: "clothes",
		type: "n",
		mean: "quần áo, trang phục"
	},
	{
		words: "quite /kwaɪt/ | pretty | fairly /ˈferli/ | a bit of | rather",
		us: "pretty",
		type: "adv",
		mean: "khá (not very) (+ nouns, adj, adv)"
	},
	{
		words: "abroad (adv) | overseas (a)",
		us: "overseas",
		type: "adv,a",
		mean: "ở nước ngoài"
	},
	{
		words: "teenager | youth /juːθ/ | teen",
		us: "teenager",
		type: "n",
		mean: "thanh thiếu niên"
	},
	{
		words: "responsibility /rɪˌspɑːnsəˈbɪləti/ | obligation",
		us: "responsibility",
		type: "n",
		mean: "(sự chịu) trách nhiệm"
	},
	{
		words: "ignore | put aside | neglect /nɪˈɡlekt/",
		us: "ignore",
		type: "v",
		mean: "bỏ qua"
	},
	{
		words: "recommend /rekəˈmend/ | suggest /səɡˈdʒest/",
		us: "recommend",
		type: "v",
		mean: "gợi ý, đề xuất"
	},
	{
		words: "appraise /əˈpreɪz/ | judge /dʒʌdʒ/ | appreciate /əˈpriːʃieɪt/ | evaluate",
		us: "judge",
		type: "v",
		mean: "đánh giá"
	},
	{
		words: "appearance | emergence /ɪˈmɜːrdʒəns/ | protrusion",
		us: "appearance",
		type: "n",
		mean: "sự xuất hiện"
	},
	{
		words: "disappear /dɪsəˈpɪr/ | vanish",
		us: "disappear",
		type: "v",
		mean: "biến mất"
	},
	{
		words: "get rid of | eliminate",
		us: "get rid of",
		type: "v",
		mean: "loại bỏ"
	},
	{
		words: "favorite (a,n) /ˈfeɪvərɪt/ | preference /ˈprefrəns/ | first choice",
		us: "favorite",
		type: "n,a",
		mean: "ưa thích"
	},
	{
		words: "principal | headmaster",
		us: "principal",
		type: "n",
		mean: "hiệu trưởng"
	},
	{
		words: "wholesome | healthy | salubrious",
		us: "healthy",
		type: "a",
		mean: "lành mạnh"
	},
	{
		words: "personnel /ˌpɜːrsəˈnel/ | staff /stæf/ | employees",
		us: "staff",
		type: "n",
		mean: "nhân viên"
	},
	{
		words: "disease /dɪˈziːz/ | illness /ˈɪlnəs/ | sickness",
		us: "illness",
		type: "n",
		mean: "bệnh"
	},
	{
		words: "expert | specialist",
		us: "expert",
		type: "n",
		mean: "nhà chuyên gia (môn)"
	},
	{
		words: "obvious | apparent | clear",
		us: "obvious",
		type: "a",
		mean: "rõ ràng"
	},
	{
		words: "portion | serving",
		us: "portion",
		type: "n",
		mean: "phần, khẩu phần"
	},
	{
		words: "common /ˈkɑːmən/ | universal /juːnɪˈvɜːrsl/ | ubiquitous /juːˈbɪkwɪtəs/ | prevalent /ˈprevələnt/",
		us: "common",
		type: "a",
		mean: "phổ biến, toàn thể"
	},
	{
		words: "abundant /əˈbʌndənt/ | ample /ˈæmpl/ | plentiful /ˈplentɪfl/ | plenty of",
		us: "plenty of",
		type: "a",
		mean: "dồi dào"
	},
	{
		words: "happy | joyful | cheerful | content (n. nội dung)",
		us: "happy",
		type: "a",
		mean: "hạnh phúc"
	},
	{
		words: "sad | unhappy | sorrowful | dejected",
		us: "sad",
		type: "a",
		mean: "buồn, chán"
	},
	{
		words: "tiny | petite | small | little",
		us: "small",
		type: "a",
		mean: "bé, nhỏ"
	},
	{
		words: "quick | speedy | rapid | fast (adv)",
		us: "fast",
		type: "a",
		mean: "nhanh"
	},
	{
		words: "slow | sluggish | leisurely | unhurried",
		us: "slow",
		type: "a",
		mean: "chậm rãi"
	},
	{
		words: "smart | intelligent | clever | bright",
		us: "smart",
		type: "a",
		mean: "thông minh"
	},
	{
		words: "dumb | stupid | foolish | ignorant",
		us: "dumb",
		type: "a",
		mean: "khờ, đần, dốt, vô học"
	},
	{
		words: "rich | wealthy | affluent | prosperous (thịnh vượng)",
		us: "rich",
		type: "a",
		mean: "giàu có, phong phú"
	},
	{
		words: "poor | needy | destitute | impoverished | broke",
		us: "poor",
		type: "a",
		mean: "nghèo nàn"
	},
	{
		words: "beautiful | gorgeous | stunning (kinh ngạc, tuyệt vời) | attractive | tempting | pretty",
		us: "pretty",
		type: "a",
		mean: "xinh đẹp"
	},
	{
		words: "friend | buddy (thân) | pal",
		us: "buddy",
		type: "n",
		mean: "bạn bè"
	},
	{
		words: "vivid /ˈvɪvɪd/ | vibrant /ˈvaɪbrənt/ | lively /ˈlaɪvli/",
		us: "lively",
		type: "a",
		mean: "sống (sôi) động"
	},
	{
		words: "various /ˈveriəs/ | different /ˈdɪfrənt/ | several /ˈsevrəl/ | discrepant",
		us: "different",
		type: "a",
		mean: "khác nhau"
	},
	{
		words: "pursue /pərˈsuː/ | woo /wuː/ | chase",
		us: "pursue",
		type: "v",
		mean: "theo đuổi"
	},
	{
		words: "major /ˈmeɪdʒər/ | main /meɪn/ | primary /ˈpraɪmeri/ | significant /sɪɡˈnɪfɪkənt/",
		us: "major|main",
		type: "a",
		mean: "chính, chủ yếu, quan trọng"
	},
	{
		words: "find /faɪnd/ | seek /siːk/ | look for",
		us: "look for",
		type: "v",
		mean: "tìm kiếm"
	},
	{
		words: "accurate /ˈækjərət/ | precise /prɪˈsaɪs/ | exact /ɪɡˈzækt/",
		us: "exact",
		type: "a",
		mean: "chính xác"
	},
	{
		words: "vague /veɪɡ/ | obscure /əbˈskjʊr/ | hazy /ˈheɪzi/ | unclear",
		us: "vague",
		type: "a",
		mean: "không rõ ràng, mơ hồ"
	},
	{
		words: "top /tɑːp/ | peak /piːk/ | summit /ˈsʌmɪt/",
		us: "top",
		type: "n",
		mean: "đỉnh, đạt đỉnh"
	},
	{
		words: "conservation /ˌkɑːnsərˈveɪʃn/ | preservation /ˌprezərˈveɪʃn/",
		us: "conservation",
		type: "n",
		mean: "sự bảo tồn"
	},
	{
		words: "competitor /kəmˈpetɪtər/ | rival /ˈraɪvl/ | opponent /əˈpəʊnənt/",
		us: "competitor",
		type: "n",
		mean: "đối thủ"
	},
	{
		words: "blame /bleɪm/ | condemn /kənˈdem/",
		us: "blame",
		type: "v",
		mean: "đổ lỗi"
	},
	{
		words: "opinion /əˈpɪnjən/ | perspective /pərˈspektɪv/ | standpoint /ˈstændpɔɪnt/ | view (= scenery)",
		us: "opinion",
		type: "n",
		mean: "quan điểm"
	},
	{
		words: "fame /feɪm/ | prestige /preˈstiːʒ/ | reputation /ˌrepjuˈteɪʃn/",
		us: "reputation",
		type: "n",
		mean: "danh tiếng"
	},
	{
		words: "build /bɪld/ | erect /ɪˈrekt/ | establish /ɪˈstæblɪʃ/",
		us: "build",
		type: "v",
		mean: "xây dựng"
	},
	{
		words: "big | massive | colossal /kəˈlɑːsl/ | tremendous /trəˈmendəs/ | huge",
		us: "huge",
		type: "a",
		mean: "to lớn"
	},
	{
		words: "forever (adv) /fərˈevər/ | perpetual (a) /pərˈpetʃuəl/ | immutable (a) /ɪˈmjuːtəbl/",
		us: "forever",
		type: "adv,a",
		mean: "mãi mãi"
	},
	{
		words: "irritate /ˈɪrɪteɪt/ | annoy /əˈnɔɪ/ | upset /ʌpˈset/",
		us: "annoy",
		type: "v",
		mean: "làm phiền, làm khó chịu"
	},
	{
		words: "ever since | since then | since that time",
		us: "ever since",
		type: "adv",
		mean: "từ đó trở đi"
	},
	{
		words: "definitely /ˈdefɪnətli/ | certainly /ˈsɜːrtnli/ | surely /ˈʃʊrli/ | inevitably /ɪnˈevɪtəbli/",
		us: "definitely",
		type: "adv",
		mean: "chắc chắn"
	},
	{
		words: "outgoing (a) /ˌaʊtˈɡoʊɪŋ/ | extrovert (n) /ˈekstrəvɜːrt/",
		us: "outgoing",
		type: "a,n",
		mean: "hướng ngoại"
	},
	{
		words: "precisely | exactly | accurately | correctly | strictly",
		us: "exactly",
		type: "adv",
		mean: "chính xác, đúng đắn"
	},
	{
		words: "completely | totally | absolutely | utterly",
		us: "totally",
		type: "adv",
		mean: "hoàn toàn, tuyệt đối"
	},
	{
		words: "underneath | under | beneath | below | downstairs",
		us: "under",
		type: "prep,adv",
		mean: "ở dưới, bên dưới"
	},
	{
		words: "appointment | engagement | meeting",
		us: "appointment",
		type: "n",
		mean: "cuộc hẹn, cuộc gặp gỡ"
	},
	{
		words: "service | assistance /əˈsɪst/ | support | ministration | aid | help /help/",
		us: "help",
		type: "n,v",
		mean: "sự giúp đỡ, hỗ trợ, phục vụ"
	},
	{
		words: "purchase /ˈpɜːrtʃəs/ | buy /baɪ/",
		us: "buy",
		type: "v",
		mean: "mua, sắm"
	},
	{
		words: "choose /tʃuːz/ | pick /pɪk/",
		us: "pick",
		type: "v",
		mean: "chọn lựa"
	},
	{
		words: "repair /rɪˈper/ | mend | fix /fɪks/",
		us: "fix",
		type: "v",
		mean: "sửa chữa"
	},
	{
		words: "keep /kiːp/ | retain /rɪˈteɪn/ | hold on to",
		us: "keep",
		type: "v",
		mean: "giữ lại, duy trì"
	},
	{
		words: "leave /liːv/ | depart /dɪˈpɑːrt/ | take off",
		us: "leave",
		type: "v",
		mean: "rời đi, khởi hành"
	},
	{
		words: "show /ʃoʊ/ | demonstrate /ˈdemənstreɪt/",
		us: "show",
		type: "v",
		mean: "cho thấy, chứng minh"
	},
	{
		words: "tell /tel/ | inform /ɪnˈfɔːrm/ | let someone know",
		us: "tell",
		type: "v",
		mean: "nói cho biết, thông báo"
	},
	{
		words: "job /dʒɑːb/ | occupation /ˌɑːkjəˈpeɪʃn/ | work",
		us: "job",
		type: "n",
		mean: "công việc, nghề nghiệp"
	},
	{
		words: "kid /kɪd/ | child /tʃaɪld/",
		us: "kid",
		type: "n",
		mean: "đứa trẻ, trẻ em"
	},
	{
		words: "option /ˈɑːpʃn/ | choice /tʃɔɪs/",
		us: "option",
		type: "n",
		mean: "sự lựa chọn"
	},
	{
		words: "mistake /mɪˈsteɪk/ | error /ˈerər/ | screw-up",
		us: "mistake",
		type: "n",
		mean: "lỗi lầm, sai sót"
	},
	{
		words: "weird /wɪrd/ | strange /streɪndʒ/ | odd",
		us: "weird",
		type: "a",
		mean: "kỳ lạ, khác thường"
	},
	{
		words: "tired /ˈtaɪərd/ | exhausted /ɪɡˈzɔːstɪd/ | beat",
		us: "tired",
		type: "a",
		mean: "mệt mỏi, kiệt sức"
	}
];
function LookupWordKey(word) {
	return String(word == null ? '' : word).toLowerCase()
		.replace(/\/[^\/]*\//g, ' ')
		.replace(/\([^)]*\)/g, ' ')
		.replace(/[.,!?;:"“”‘’()[\]{}]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
}
function LookupWordForms(word) {
	const key = LookupWordKey(word)
	if (!key) return []
	const forms = [key]
	if (key.length > 3) {
		if (key.slice(-3) == 'ies') forms.push(key.slice(0, -3) + 'y')
		if (key.slice(-2) == 'es') forms.push(key.slice(0, -2))
		if (key.slice(-1) == 's' && key.slice(-2) != 'ss') forms.push(key.slice(0, -1))
	}
	return forms.filter(Boolean)
}
function IsSameLookupWord(a, b) {
	const fa = LookupWordForms(a)
	const fb = LookupWordForms(b)
	return fa.some(e => fb.indexOf(e) >= 0)
}
function IsExisted(seq, word) {
	const targets = LookupWordForms(word)
	if (!targets.length) return false
	return String(seq == null ? '' : seq).split('|').some(function (ele) {
		const forms = LookupWordForms(ele)
		return forms.some(function (f) { return targets.indexOf(f) >= 0 })
	})
}
function EscapeSynonymHtml(text) {
	return String(text == null ? '' : text).replace(/[&<>"']/g, function (ch) {
		return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
	})
}
function StripSynonymIpa(text) {
	return String(text == null ? '' : text).replace(/\/[^\/]*\//g, ' ').replace(/\s+/g, ' ').trim()
}
function UsFlagBadgeHtml() {
	return '<span class="us-badge" title="Từ thông dụng ở Mỹ" aria-label="Từ thông dụng ở Mỹ">' +
		'<svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true" focusable="false">' +
		'<rect width="20" height="14" fill="#fff"/>' +
		'<g fill="#b22234">' +
		'<rect y="0" width="20" height="1.08"/><rect y="2.15" width="20" height="1.08"/>' +
		'<rect y="4.31" width="20" height="1.08"/><rect y="6.46" width="20" height="1.08"/>' +
		'<rect y="8.62" width="20" height="1.08"/><rect y="10.77" width="20" height="1.08"/>' +
		'<rect y="12.92" width="20" height="1.08"/>' +
		'</g><rect width="8" height="7.54" fill="#3c3b6e"/>' +
		'<g fill="#fff">' +
		'<circle cx="1.3" cy="1.3" r=".38"/><circle cx="4" cy="1.3" r=".38"/><circle cx="6.7" cy="1.3" r=".38"/>' +
		'<circle cx="2.65" cy="3.1" r=".38"/><circle cx="5.35" cy="3.1" r=".38"/>' +
		'<circle cx="1.3" cy="4.9" r=".38"/><circle cx="4" cy="4.9" r=".38"/><circle cx="6.7" cy="4.9" r=".38"/>' +
		'<circle cx="2.65" cy="6.7" r=".38"/><circle cx="5.35" cy="6.7" r=".38"/>' +
		'</g></svg></span>'
}
function UsWordsOf(item) {
	const raw = item && item.us
	if (Array.isArray(raw)) return raw.map(e => String(e == null ? '' : e).trim()).filter(Boolean)
	return String(raw == null ? '' : raw).split('|').map(e => e.trim()).filter(Boolean)
}
function IsUsCommonWord(word) {
	const lookup = LookupWordKey(word)
	if (!lookup) return false
	for (var i = 0; i < SynonymData.length; i++) {
		const usWords = UsWordsOf(SynonymData[i])
		if (usWords.some(e => IsSameLookupWord(e, lookup))) return true
	}
	return false
}
function getWordUsBadge(word) {
	return IsUsCommonWord(word) ? UsFlagBadgeHtml() : ''
}
function getWordSynonym(word) {
	const lookup = LookupWordKey(word)
	if (!lookup) return ''
	var arr = []
	var usWords = []
	for (var i = 0; i < SynonymData.length; i++) {
		let words = SynonymData[i].words;
		if (IsExisted(words, lookup)) {
			usWords = UsWordsOf(SynonymData[i])
			arr = words.split('|')
			arr = arr.filter(e => !IsSameLookupWord(e, lookup))
			break
		}
	}
	var rr = arr.map(e => {
		let clean = StripSynonymIpa(e)
		if (usWords.some(us => IsSameLookupWord(clean, us))) {
			return EscapeSynonymHtml(clean) + ' ' + UsFlagBadgeHtml()
		}
		return EscapeSynonymHtml(clean)
	}).filter(Boolean).join(' · ')
	return rr
}
