
const kPersonality = [
	'Generous',   		//hào phóng
	'Friendly',   		//thân thiện
	'Honest',			//trung thực
	'Confident',		//tự tin
	'Creative',			//sáng tạo
	'Optimistic',		//lạc quan
	'Adventurous',		//thích phiêu lưu
	'Curious',			//tò mò
	'Open-minded',		//cởi mở
	'Patient',			//kiên nhẫn
	'Stubborn',			//bướng bỉnh
	'Outgoing',			//hướng ngoại
	'Ambitious',		//tham vọng
	'Humble',			//khiêm tốn
	'Reliable',			//đáng tin cậy
	'Sensitive',		//nhạy cảm
	'Selfish',			//ích kỷ
	'Easygoing',		//dễ tính
	'Empathetic',		//thấu cảm
	'Charismatic',		//có sức hút
	'Resilient',		//kiên cường
	'Conscientious',	//có trách nhiệm
	'Assertive',		//quyết đoán
	'Pragmatic',		//thực dụng
	'Spontaneous',		//tự phát
	'Witty',			//hóm hỉnh
	'Diligent',			//siêng năng
	'Compassionate', 	//đầy lòng trắc ẩn
	'Tactful',			//khéo léo
	'Cynical',			//hoài nghi
	'Arrogant',			//kiêu ngạo
	'Grumpy',			//cáu kỉnh
	'Gullible',			//dễ tin người
	'Reckless',			//liều lĩnh
	'Moody',			//thất thường
	'Sarcastic',		//mỉa mai
	'Vindictive',		//thù dai
	'Introverted',		//hướng nội
	'Optimistic',		//lạc quan
	'Pessimistic',		//bi quan
	'Meticulous',		//tỉ mỉ
	'Impulsive',		//bốc đồng
	'Altruistic', 		//vị tha
	'Manipulative', 	//thao túng
	'Resourceful', 		//có tài xoay sở
	'Blunt',			//thẳng thắn
	'Observant', 		//tinh ý
	'Rude',				//thô lỗ
	'Evil',				//xấu xa
	'Cruel',			//tàn nhẫn
	'Greedy',			//tham lam
	'Jealous',			//ghen tị
	'Lazy',				//lười biếng
	'Cowardly',			//hèn nhát
	'Hypocritical',		//đạo đức giả
	'Petty',			//nhỏ nhen
	'Hostile',			//thù địch
	'Callous',			//nhẫn tâm
	'Snobbish',			//kiêu căng
	'Deceitful', 		//dối trá
	'Impatient', 		//thiếu kiên nhẫn
	'Bossy', 			//hống hách
	'good listener', 	//người biết lắng nghe
	'kind'				//tốt bụng
].map(function (name) {
	return { name: name, category_name: 'Personality', color: '#8e24aa', noun: name === 'good listener' };
});

const kPersonalityNouns = [
	'Generous',
	'Friendly',
	'Honest',
	'Confident',
	'Creative',
	'Optimistic',
	'Adventurous',
	'Curious',
	'Open-minded',		
	'Patient',
	'Stubborn',
	'Outgoing',
	'Ambitious',
	'Humble',
	'Reliable',
	'Sensitive',
	'Selfish',
	'Easygoing',
	'Empathetic',
	'Charismatic',
	'Resilient',
	'Conscientious',
	'Assertive',
	'Pragmatic',
	'Spontaneous',
	'Witty',
	'Diligent',
	'Compassionate',
	'Tactful',
	'Cynical',
	'Arrogant',
	'Grumpy',
	'Gullible',
	'Reckless',
	'Moody',
	'Sarcastic',
	'Vindictive',
	'Introverted',
	'Optimistic',
	'Pessimistic',
	'Meticulous',
	'Impulsive',
	'Altruistic',
	'Manipulative',
	'Resourceful',
	'Blunt',
	'Observant',
	'Rude',
	'Evil',
	'Cruel',
	'Greedy',
	'Jealous',
	'Lazy',
	'Cowardly',
	'Hypocritical',
	'Petty',
	'Hostile',
	'Callous',
	'Snobbish',
	'Deceitful',
	'Impatient',
	'Bossy',
	'good listener',
	'kind'
].map(function (name) {
	return { name: name, category_name: 'Personality', color: '#8e24aa', noun: name === 'good listener' };
});
