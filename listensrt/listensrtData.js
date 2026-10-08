// LISTEN_DATA - du lieu module Watch (xem video + phu de song ngu).
// Moi element:
//   { id, title, type: 'file'|'youtube', src, subs: [{t, e, en, vi}] }
// - type 'file'   : src = duong dan mp4 (khuyen dung: listensrt/media/*.mp4, cung cap folder listensrt/)
//                   TikTok: tai mp4 ve (python) roi bo vao watch/media (embed TikTok khong cho doc gio chinh xac).
// - type 'youtube': src = videoId (VD: 'aqz-KE-bpKQ').
// - subs: t = giay bat dau, e = giay ket thuc, en/vi = noi dung.
//   Dung listensrt/srt2js.py de chuyen .srt -> khoi nay (khoi go tay).
//
// Moi nhom nam file rieng trong listensrt/data/ (sync_watch.py tu sync theo folder media):
//   lst_data_voa.js   -> LISTEN_DATA_VOA   (VOA + bai le goc media/)
//   lst_data_sela.js  -> LISTEN_DATA_SELA  (SpeakEnglishLikeAnAmerican/)
//   lst_data_music.js -> LISTEN_DATA_MUSIC (music/)
//   lst_data_tiktok.js -> LISTEN_DATA_TIKTOK (tiktok/)
//   lst_data_enc.js -> LISTEN_DATA_ENC (EnglishConversation_Premium_2nd/)
//   lst_data_ssv5.js -> LISTEN_DATA_SSV5 (Speaking_Sample_Vol5/ 1.1-1.10)
// Thu tu concat = thu tu hien trong app (sort theo order, thieu order giu nguyen).
//
// Bat/tat nhom o LISTEN_GROUPS_ON (true = hoc, false = an). Label chay o header tu sinh theo.
const LISTEN_GROUP_NAMES = { VOA: 'VOA', SELA: 'SELAA', MUSIC: 'Music', TIKTOK: 'TikTok', ENC: 'ENC', SSV5: 'SSV5' };
const LISTEN_GROUPS_ON = { VOA: false, SELA: true, MUSIC: true, TIKTOK: true, ENC: true, SSV5: true };
const LISTEN_DATA = []
	.concat(LISTEN_GROUPS_ON.VOA && typeof LISTEN_DATA_VOA !== 'undefined' ? LISTEN_DATA_VOA : [])
	.concat(LISTEN_GROUPS_ON.SELA && typeof LISTEN_DATA_SELA !== 'undefined' ? LISTEN_DATA_SELA : [])
	.concat(LISTEN_GROUPS_ON.MUSIC && typeof LISTEN_DATA_MUSIC !== 'undefined' ? LISTEN_DATA_MUSIC : [])
	.concat(LISTEN_GROUPS_ON.TIKTOK && typeof LISTEN_DATA_TIKTOK !== 'undefined' ? LISTEN_DATA_TIKTOK : [])
	.concat(LISTEN_GROUPS_ON.ENC && typeof LISTEN_DATA_ENC !== 'undefined' ? LISTEN_DATA_ENC : [])
	.concat(LISTEN_GROUPS_ON.SSV5 && typeof LISTEN_DATA_SSV5 !== 'undefined' ? LISTEN_DATA_SSV5 : []);
const LISTEN_GROUPS_LABEL = Object.keys(LISTEN_GROUPS_ON)
	.filter(function (k) { return LISTEN_GROUPS_ON[k]; })
	.map(function (k) { return LISTEN_GROUP_NAMES[k] || k; }).join('    •    ');
