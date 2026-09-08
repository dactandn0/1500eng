const HELPER_FOR_TEST = false;


const GOOGLE_TRANS_API = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=vi&dt=t&q=";
let GOOGLE_ERROR_SHOWN = false;

const Helper_AudioPitchKey = 'AudioPitch';
const Helper_AudioRateKey = 'AudioRate';
const Helper_RepeatNumKey = 'RepeatNum';
const Helper_AdjAudioTimeKey = 'AdjAudioTime';
const Helper_ToastTimeOutKey = 'ToastTimeOutKey';
const Helper_ToastTimeOutMedKey = 'ToastTimeOutMedKey';
const Helper_ToastTimeOutLongKey = 'ToastTimeOutLongKey';

const HELPER_ADJ_AUDIO_TIME_DEF = 5 // 5s
const HELPER_REPEAT_NUM_DEF = 2
const HELPER_TOASTER_TIMEOUT_DEF = 3
const HELPER_TOASTER_TIMEOUT_MED_DEF = 5
const HELPER_TOASTER_TIMEOUT_LONG_DEF = 8
const TOAST_SHORT_MAX_WORDS = 3
const TOAST_LONG_MIN_WORDS = 16

const kRgexSen = /.*?((\.*\s*(<br>|<hr>))|(\!*\s*(<br>|<hr>))|(\?*\s*(<br>|<hr>))|('*\s*(<br>|<hr>))|(\"*\s*(<br>|<hr>))|(\d\.+\d+.+[\.\!\?])|[\.]+|[\!\?])/gi;
const kAudioLoopSaveKey = "audioLoop";

const UNCOUNT_TAG_BEGIN = '<x1x class="_y_z">';
const UNCOUNT_TAG_END = '</x1x>';
const SAME_N_V_TAG_BEGIN = '<y1 class="_y_1z">';
const SAME_N_V_TAG_END = '</y1>';
const PHRA_VERB_TAG_BEGIN = '<z1a class="_y_2z">';
const PHRA_VERB_TAG_END = '</z1a>';
const SPECIAL_WORDS_HL_TAG_BEGIN = '<advHL class="advHL_123">';
const SPECIAL_WORDS_HL_TAG_END = '</advHL>';
const NOTED_WORD_TAG_BEGIN = '<NOTED_WORD_HL class="_noted_word_hl">';
const NOTED_WORD_TAG_END = '</NOTED_WORD_HL>';

const kNgClickTagName = 'kkk';
const kNgClickTagOpen = '<' + kNgClickTagName + ' ng-click="Idx_n_L_WSp_($event)">';
const kNgClickTagClose = '</' + kNgClickTagName + '>';
const Helper_SelectedVoiceIdx = 'SelectedVoiceIdx';
const Helper_PuterVoiceKey = 'PuterVoice';
const PUTER_VOICES = [
	{ id: 'Joanna', desc: 'Joanna - Female US' },
	{ id: 'Kendra', desc: 'Kendra - Female US' },
	{ id: 'Salli', desc: 'Salli - Female US' },
	{ id: 'Kimberly', desc: 'Kimberly - Female US' },
	{ id: 'Matthew', desc: 'Matthew - Male US' },
	// { id: 'Joey', desc: 'Joey - Male US' },
	// { id: 'Amy', desc: 'Amy - Female UK' },
	// { id: 'Emma', desc: 'Emma - Female UK' },
	// { id: 'Brian', desc: 'Brian - Male UK' },
	// { id: 'Olivia', desc: 'Olivia - Female AU' }
];
const rgConversatinal = /^\w*(B|G|W|M)*\d*\s*\:+\s*/gi;
const kReplaceWords = [{
	src: 'ms\\.*',
	desc: 'Ms'
}, {
	src: 'mr\\.*',
	desc: 'Mr'
}, {
	src: 'p\\.m\\.*',
	desc: 'pm'
}, {
	src: 'a\\.m\\.*',
	desc: 'am'
}, {
	src: 'mrs\\.*',
	desc: 'Mrs'
}];

const TIENGVIET_ARR = ['giao', 'vui', 'trong', 'cho', 'bao', 'kinh', 'tinh', 'quen', 'con', 'lui', 'thui', 'tui', 'tin', 'sau', 'chung', 'thanh', 'sao'];