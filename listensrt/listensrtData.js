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
//   lst_data_selaa.js -> LISTEN_DATA_SELAA (SpeakEnglishLikeAnAmerican/)
//   lst_data_music.js -> LISTEN_DATA_MUSIC (music/)
//   lst_data_tiktok.js -> LISTEN_DATA_TIKTOK (tiktok/)
//   lst_data_enc.js -> LISTEN_DATA_ENC (EnglishConversation_Premium_2nd/)
//   lst_data_ssv5.js -> LISTEN_DATA_SSV5 (Speaking_Sample_Vol5/ 1.1-1.10)
// Thu tu concat = thu tu hien trong app (sort theo order, thieu order giu nguyen).
const LISTEN_DATA =
	// tam an nhom VOA (chua uu tien hoc) - bo comment dong duoi de hoc lai
	// (typeof LISTEN_DATA_VOA !== 'undefined' ? LISTEN_DATA_VOA : [])
	(typeof LISTEN_DATA_SELAA !== 'undefined' ? LISTEN_DATA_SELAA : [])
	.concat(typeof LISTEN_DATA_MUSIC !== 'undefined' ? LISTEN_DATA_MUSIC : [])
	.concat(typeof LISTEN_DATA_TIKTOK !== 'undefined' ? LISTEN_DATA_TIKTOK : [])
	.concat(typeof LISTEN_DATA_ENC !== 'undefined' ? LISTEN_DATA_ENC : [])
	.concat(typeof LISTEN_DATA_SSV5 !== 'undefined' ? LISTEN_DATA_SSV5 : [])
	;
