
const STORIES1 = [
{
	en: 
	'The Lion and the Rabbit <br>\
A cruel lion lived in the forest. Every day, he killed and ate a lot of animals. The other animals were afraid the lion would kill them all.<br>\
The animals told the lion, "Let‘s make a deal. If you promise to eat only one animal each day, then one of us will come to you every day. Then you don‘t have to hunt and kill us."<br>\
The plan sounded well thought-out to the lion, so he agreed, but he also said, "If you don‘t come every day, I promise to kill all of you the next day!"<br>\
Each day after that, one animal went to the lion so that the lion could eat it. Then, all the other animals were safe.<br>\
Finally, it was the rabbit‘s turn to go to the lion. The rabbit went very slowly that day, so the lion was angry when the rabbit finally arrived.<br>\
The lion angrily asked the rabbit, "Why are you late?" <br>\
"I was hiding from another lion in the forest. That lion said he was the king, so I was afraid."<br>\
The lion told the rabbit, "I am the only king here! Take me to that other lion, and I will kill him. The rabbit replied, "I will be happy to show you where he lives."<br>\
The rabbit led the lion to an old well in the middle of the forest. The well was very deep with water at the bottom.<br>\
The rabbit told the lion, "Look in there. The lion lives at the bottom." <br>\
When the lion looked in the well, he could see his own face in-the water. He thought that was the other lion. Without waiting another moment, the lion jumped into the well to attack the other lion. He never came out.<br>\
All of the other animals in the forest were very pleased with the rabbit‘s clever trick.',
	vi: 
	'Sư tử và Thỏ <br>\
Một con sư tử hung dữ sống trong rừng. Mỗi ngày, nó giết và ăn rất nhiều động vật. Các loài động vật khác sợ rằng sư tử sẽ giết hết chúng.<br>\
Các loài động vật nói với sư tử, "Chúng ta hãy thỏa thuận. Nếu anh hứa chỉ ăn một con vật mỗi ngày, thì một trong số chúng tôi sẽ đến gặp anh mỗi ngày. Khi đó, anh không phải săn đuổi và giết chúng tôi nữa."<br>\
Kế hoạch nghe có vẻ hợp lý với sư tử, nên nó đồng ý, nhưng nó cũng nói, "Nếu anh không đến mỗi ngày, tôi hứa sẽ giết hết các người vào ngày hôm sau!"<br>\
Mỗi ngày sau đó, một con vật đến gặp sư tử để sư tử có thể ăn thịt nó. Sau đó, tất cả các loài động vật khác đều được an toàn.<br>\
Cuối cùng, đến lượt thỏ đến gặp sư tử. Thỏ đi rất chậm vào ngày hôm đó, vì vậy sư tử đã tức giận khi thỏ cuối cùng cũng đến.<br>\
Sư tử tức giận hỏi thỏ, "Tại sao bạn đến muộn? <br>\
"Tôi đang trốn một con sư tử khác trong rừng. Con sư tử đó nói rằng nó là vua, vì vậy tôi sợ."<br>\
Sư tử nói với thỏ, "Tôi là vị vua duy nhất ở đây! Hãy dẫn tôi đến chỗ con sư tử kia, và tôi sẽ giết nó." Thỏ trả lời, "Tôi sẽ rất vui khi chỉ cho bạn nơi nó sống."<br>\
Thỏ dẫn sư tử đến một cái giếng cũ ở giữa rừng. Giếng rất sâu với nước ở dưới đáy.<br>\
Thỏ nói với sư tử, "Hãy nhìn vào đó. Sư tử sống ở dưới đáy." <br>\
Khi sư tử nhìn vào giếng, nó có thể nhìn thấy khuôn mặt của chính mình trong nước. Nó nghĩ rằng đó là con sư tử kia. Không đợi thêm một phút nào nữa, sư tử nhảy xuống giếng để tấn công con sư tử kia. Anh ta không bao giờ ra ngoài.<br>\
Tất cả các loài động vật khác trong rừng đều rất hài lòng với trò lừa bịp thông minh của chú thỏ.',
voca:'afraid, agree, angry, arrive, attack, bottom, clever, cruel, finally, hide, hunt, lot, middle, moment, pleased, promise, reply, safe, trick, well',
voca4k: [
{en:"afraid", type:'a.', ipa: '[afreid]', mean:'When someone is afraid, they feel fear.', sample:'The woman was afraid of what she saw.',time: 3},
{en:"agree", type:'v.', ipa: '[fegn:i]', mean:'To agree is to say “yes” or to think the same way.', sample:'A: The food is very good in that restaurant. B: I agree with you.',time: 14},
{en:"angry", type:'a.', ipa: '[]', mean:'When someone is angry, they may want to speak loudly or fight.', sample:' She didn’t do her homework, so her father is angry.',time: 27},
{en:"arrive", type:'v.', ipa: '[]', mean:'To arrive is to get to or reach some place.', sample:'The bus always arrives at the corner of my street at 4:00.',time: 40},
{en:"attack", type:'v.', ipa: '[]', mean:'To attack is to try to fight or to hurt.', sample:'The man with the sword attacked the other man first.',time: 53},
{en:"bottom", type:'n.', ipa: '[]', mean:'The bottom is the lowest part.', sample:'The bottom of my shoe has a hole in it.',time: 65},
{en:"clever", type:'a.', ipa: '[]', mean:'When someone is clever, they can solve a hard puzzle or problem.', sample:'The clever boy thought of a good idea.',time: 75},
{en:"cruel", type:'a.', ipa: '[]', mean:'When someone is cruel, they do bad things to hurt others.', sample:'The cruel man yelled at his sister.',time: 87},
{en:"finally", type:'adv.', ipa: '[]', mean:'If something happens finally, it happens after a longtime or at the end.', sample:'He finally crossed the finish line after five hours of running.',time: 98},
{en:"hide", type:'v.', ipa: '[]', mean:'To hide is to try not to let others see you', sample:'The other children will hide while you count to 100',time: 112},
{en:"hunt", type:'v.', ipa: '[]', mean:'To hunt is to look for or search for an animal to kill.', sample:'Long ago, people hunted with bows and arrows',time: 123},
{en:"lot", type:'n.', ipa: '[]', mean:'A lot means a large number or amount of people, animals, things, etc.', sample:'There are a lot of apples in the basket.',time: 134},
{en:"middle", type:'n.', ipa: '[]', mean:'The middle of something is the center or halfway point.', sample:'The Canadian flag has a maple leaf in the middle of it.',time: 148},
{en:"moment", type:'n.', ipa: '[]', mean:'A moment is a second or a very short time.', sample:'I was only a few moments late for the meeting.',time: 161},
{en:"pleased", type:'a.', ipa: '[pli:zd]', mean:'When someone is pleased, they are happy.', sample:'She was pleased with the phone call she received.',time: 172},
{en:"promise", type:'v.', ipa: '[prdmis]', mean:'To promise is to say you will do something for sure.', sample:'He promised to return my key by tomorrow.',time: 182},
{en:"reply", type:'v.', ipa: '[]', mean:'To reply is to give an answer or say back to someone.', sample:'She asked him what time his meeting was. He replied, "at three."',time: 193},
{en:"safe", type:'a.', ipa: '[seif]', mean:'When a person is safe, they are not in danger.', sample:'Put on your seat belt in the car to be safe.',time: 206},
{en:"trick", type:'n.', ipa: '[]', mean:'A trick is something you do to fool another person.', sample:'His card trick really surprised us.',time: 217},
{en:"well", type:'adv.', ipa: '[wel]', mean:'You use well to say that something was done in a good way.', sample:'The couple can dance quite well.',time: 227},
]
},
{
	en: 
	'The Laboratory <br>\
Mia‘s father had a laboratory, but she had no idea what was in it. Her dad always closed and locked the door when he went in. She knew that he used it to do projects for work. He never told Mia what these projects were.<br>\
One night, Mia approached the door to the laboratory. She stopped and thought, "I wonder what crazy experiment he is doing now." Suddenly, she heard a loud noise. It sounded like an evil laugh. The noise scared her, so she walked quickly back to her room.<br>\
The next night, her friend Liz came to her house. When Liz arrived, Mia told her about the night before. "Oh, it was terrible," she said. "Why don‘t we see what is in there?" Liz asked. "It will be a fun adventure!"<br>\
Mia felt nervous about going into her father‘s laboratory, but she agreed. <br>\
As always, the door was locked. They waited until Mia‘s father left the laboratory to eat dinner. "He didn‘t lock the door!" Liz said. "Let‘s go."<br>\
The laboratory was dark. The girls walked down the stairs carefully. Mia smelled strange chemicals. What terrible thing was her father creating? Suddenly, they heard an evil laugh. It was even worse than the one Mia heard the night before. What if a monster was going to kill them? Mia had to do something. She shouted for help.<br>\
Mia‘s father ran into the room and turned on the lights. "Oh, no," he said. "You must have learned my secret." "Your monster tried to kill us," Mia said.<br>\
"Monster?" he asked. "You mean this?" He had a pretty doll in his hands. The doll laughed. The laugh didn‘t sound so evil anymore. "I made this for your birthday. I wanted to give it to you then, but you can have it now. I hope you like it!"',
	vi: 
	'Phòng thí nghiệm <br>\
Bố của Mia có một phòng thí nghiệm, nhưng cô bé không biết bên trong có gì. Bố cô bé luôn đóng và khóa cửa khi vào. Cô bé biết rằng ông dùng phòng thí nghiệm để làm dự án cho công việc. Ông chưa bao giờ nói với Mia những dự án đó là gì.<br>\
Một đêm nọ, Mia đến gần cửa phòng thí nghiệm. Cô bé dừng lại và nghĩ, "Không biết ông ấy đang làm thí nghiệm điên rồ gì đây." Đột nhiên, cô bé nghe thấy một tiếng động lớn. Nghe giống như tiếng cười ma quái. Tiếng động đó khiến cô bé sợ hãi, vì vậy cô bé nhanh chóng quay trở lại phòng mình.<br>\
Đêm hôm sau, bạn của cô bé là Liz đến nhà cô bé. Khi Liz đến, Mia kể cho cô bé nghe về đêm hôm trước. "Ồ, kinh khủng thật," cô bé nói. "Sao chúng ta không xem bên trong có gì nhỉ?" Liz hỏi. "Sẽ là một cuộc phiêu lưu thú vị!"<br>\
Mia cảm thấy lo lắng khi vào phòng thí nghiệm của bố mình, nhưng cô bé đồng ý. <br>\
Như thường lệ, cửa đã bị khóa. Họ đợi cho đến khi bố của Mia rời khỏi phòng thí nghiệm để ăn tối. "Bố ấy không khóa cửa!" Liz nói. "Đi thôi."<br>\
Phòng thí nghiệm tối om. Các cô gái cẩn thận bước xuống cầu thang. Mia ngửi thấy mùi hóa chất lạ. Cha cô đang tạo ra thứ gì kinh khủng thế? Đột nhiên, họ nghe thấy tiếng cười độc ác. Thậm chí còn tệ hơn tiếng cười mà Mia nghe thấy đêm hôm trước. Nếu một con quái vật định giết họ thì sao? Mia phải làm gì đó. Cô hét lên cầu cứu.<br>\
Cha của Mia chạy vào phòng và bật đèn. "Ồ, không," ông nói. "Con hẳn đã biết được bí mật của cha." "Con quái vật của con đã cố giết chúng ta," Mia nói.<br>\
"Quái vật?" ông hỏi. "Ý con là cái này à?" Ông cầm một con búp bê xinh xắn trên tay. Con búp bê cười. Tiếng cười không còn nghe có vẻ độc ác nữa. "Cha đã làm cái này cho sinh nhật con. Cha đã muốn tặng con lúc đó, nhưng giờ con có thể lấy nó. Cha hy vọng con thích nó!"',
voca: 'adventure, approach, carefully, chemical, create, evil, experiment, kill, laboratory, laugh, loud, nervous, noise, project, scare, secret, shout, smell, terrible, worse',
voca4k:[
{en:"adventure", type:'n.', ipa: '[]', mean:'An adventure is a fun or exciting thing that you do.', sample:'Riding in the rough water was an adventure.',time: 5},
{en:"approach", type:'v.', ipa: '[]', mean:'To approach something means to move close to it.', sample:'The boy approached his school.',time: 17},
{en:"carefully", type:'adv.', ipa: '[]', mean:'Carefully means with great attention, especially to detail or safety.', sample:'The baby carefully climbed down the stairs.',time: 26},
{en:"chemical", type:'n.', ipa: '[]', mean:'A chemical is something that scientists use in chemistry.', sample:'The scientist mixed the chemicals',time: 40},
{en:"create", type:'v.', ipa: '[]', mean:'To create means to make something new.', sample:'She created an igloo from blocks of snow.',time: 50},
{en:"evil", type:'n.', ipa: '[]', mean:'Evil describes something or someone bad or cruel, not good.', sample:' The evil figure scared us all.',time: 61},
{en:"experiment", type:'n.', ipa: '[]', mean:'Evil describes something or someone bad or cruel, not good."', sample:'I killed the fly with a fly swatter.',time: 74},
{en:"kill", type:'v.', ipa: '[]', mean:"To kill someone or something is to make them die.", sample:'The evil figure scared us all.',time: 86},
{en:"laboratory", type:'n.', ipa: '[]', mean:'A laboratory is a room where a scientist works.', sample:'My mother works in a laboratory.',time: 95},
{en:"laugh", type:'n.', ipa: '[]', mean:'Laugh is the sound made when someone is happy or a funny thing occurs', sample:'The sound of their laugh filled the room.',time: 107},
{en:"loud", type:'a.', ipa: '[]', mean:'If a sound is loud, it is strong and very easy to hear.', sample:'The man’s voice was so loud that we all could hear him',time: 118},
{en:"nervous", type:'a.', ipa: '[]', mean:'When a person is nervous, they think something bad will happen.', sample:'The boy became nervous when he heard the news.',time: 130},
{en:"noise", type:'n.', ipa: '[]', mean:'A noise is an unpleasant sound.', sample:'The crying baby made a loud noise.',time: 142},
{en:"project", type:'n.', ipa: '[]', mean:'A project is a type of work that you do for school ora job.', sample:'His afternoon work project was to paint the room green.',time: 152},
{en:"scare", type:'v.', ipa: '[]', mean:'To scare someone is to make them feel afraid.', sample:'My uncle was scared by what he saw in the room.',time: 165},
{en:"secret", type:'n.', ipa: '[]', mean:'A secret is something that you do not tell other people.', sample:'The two boys were sharing a secret.',time: 177},
{en:"shout", type:'v.', ipa: '[]', mean:'To shout is to say something loudly.', sample:'My boss shouted at me because I was late for work.',time: 187},
{en:"smell", type:'v.', ipa: '[]', mean:'To smell something means to use your nose to sense it.', sample:'The two friends smelled the flower',time: 199},
{en:"terrible", type:'a.', ipa: '[]', mean:'If something is terrible, it is very bad.', sample:'The way he treated his classmate was terrible.',time: 209},
{en:"worse", type:'adj.', ipa: '[]', mean:'If something is worse, it is of poorer quality than another thing.', sample:'Business was worse this month than last month.',time: 220},
]
},
{
	en:'The Report <br>\
Lee sat among the books at the library and thought about his group project.<br>\
They had to turn it in soon, but he hadn‘t even started his part! Jack and Claire were in his group. They had worked hard. They were also very smart, and Lee didn‘t want them to get a bad grade.<br>\
Jack did the report. He wrote a lot of very good sentences and described things with great adjectives. Claire drew a nice map of the stars.<br>\
Now, Lee needed to do his part of the project. <br>\
"Well, I suppose I need to start my model," Lee thought.<br>\
Making a model of a planet was really hard. Lee tried to read several books, but he couldn‘t comprehend any of the charts. "We‘re going to fail because of me!" Lee said. He put his head down on the table and said, "I wish I could see a planet, instead of having to read about it!"<br>\
Suddenly, there was a bright light. Lee was pulled from his chair, through the roof, and right into a strange ship! " Hello, kid," said an alien. " Did you ask for help?"<br>\
Lee told the friendly alien all about his project. The alien agreed to help Lee solve his problem. " First, we‘ll fly through space to view the universe. Then, I can help you make a model of my planet."<br>\
Soon, they were going through the clouds. They passed the moon. Then they viewed Mars. Lee was very excited. Instead of a bad grade, his group would have the best project ever!<br>\
"It‘s time to go home," the alien finally said. On the way back, he helped Lee make a model of the planet Mars. Soon, they were on Earth.<br>\
"Thanks," Lee said." My model will be awesome!" Then he took his model and said goodbye to his new friend.'
,vi:'Bản báo cáo <br>\
Lee ngồi giữa những cuốn sách ở thư viện và nghĩ về dự án nhóm của mình.<br>\
Họ phải nộp bài sớm thôi, nhưng anh ấy thậm chí còn chưa bắt đầu phần của mình! Jack và Claire cũng ở trong nhóm của anh ấy. Họ đã làm việc chăm chỉ. Họ cũng rất thông minh, và Lee không muốn họ bị điểm kém.<br>\
Jack đã làm báo cáo. Anh ấy đã viết rất nhiều câu rất hay và mô tả mọi thứ bằng những tính từ tuyệt vời. Claire đã vẽ một bản đồ các vì sao rất đẹp.<br>\
Bây giờ, Lee cần phải làm phần của mình trong dự án. <br>\
"Được rồi, mình nghĩ là mình cần bắt đầu mô hình của mình", Lee nghĩ.<br>\
Việc tạo mô hình của một hành tinh thực sự khó. Lee đã cố gắng đọc một số cuốn sách, nhưng anh ấy không thể hiểu bất kỳ biểu đồ nào. "Chúng ta sẽ thất bại vì mình!" Lee nói. Anh ấy gục đầu xuống bàn và nói, "Ước gì mình có thể nhìn thấy một hành tinh, thay vì phải đọc về nó!"<br>\
Đột nhiên, có một ánh sáng rực rỡ. Lee bị kéo khỏi ghế, xuyên qua mái nhà và bay thẳng vào một con tàu lạ! "Xin chào, nhóc," một người ngoài hành tinh nói. "Cậu đã nhờ giúp đỡ chưa?"<br>\
Lee kể cho người ngoài hành tinh thân thiện nghe về dự án của mình. Người ngoài hành tinh đồng ý giúp Lee giải quyết vấn đề. "Đầu tiên, chúng ta sẽ bay qua không gian để ngắm vũ trụ. Sau đó, tôi có thể giúp cậu làm mô hình hành tinh của tôi."<br>\
Chẳng mấy chốc, họ đã bay qua những đám mây. Họ đã đi qua mặt trăng. Sau đó, họ đã ngắm sao Hỏa. Lee rất phấn khích. Thay vì điểm kém, nhóm của cậu sẽ có dự án tuyệt vời nhất từ ​​trước đến nay!<br>\
"Đã đến lúc về nhà rồi," người ngoài hành tinh cuối cùng cũng nói. Trên đường trở về, anh ta đã giúp Lee làm mô hình hành tinh sao Hỏa. Chẳng mấy chốc, họ đã đến Trái đất.<br>\
"Cảm ơn," Lee nói. "Mô hình của tôi sẽ tuyệt lắm!" Sau đó, cậu cầm mô hình và tạm biệt người bạn mới của mình.',
voca:'alien, among, chart, cloud, comprehend, describe, ever, fail, friendly, grade, instead, library, planet, report, several, solve, suddenly, suppose, universe, view'
},
{
	en:'The Dog’s Bell<br>\
John‘s dog was a bad dog. He bit people frequently. John had great concern about this. It was not an appropriate way for a dog to behave. His friends in the village always expected the dog to bite them. The news about John‘s dog spread through the village. None of the people wanted to go to John‘s house. John tried to instruct the dog to behave, but it never worked. He tried to be patient and teach the dog to be calm. That also didn‘t work. John didn‘t want to punish the dog. "How will I stop my dog‘s bad habit?" John asked himself.<br>\
John‘s friend came to talk to him about the issue. During their important meeting, his friend said, ―The people in the village asked me to represent them. We want your dog to stop this habit. Why don‘t you put a bell around the dog‘s neck? This way, we would hear your dog coming down the street." John thought this was a great idea. Now, people could stay away from the dog. It would not be able to bite anyone anymore.<br>\
The dog liked the bell, too. People looked at him when they heard his bell. This made the dog very content. He liked the song the bell played when he walked. One day, John‘s dog strolled through the village and met some other dogs. He expected them to want a bell like his. But they laughed at his bell. They said the bell made people avoid him. John‘s dog shook his head. "No, they look at me because they like the bell."<br>\
The other dogs said, ―You have the wrong idea of what makes you popular. Of course they like your bell. It tells them where you are so they can avoid you. You aren‘t able to bite them anymore!"<br>\
You see, being popular isn‘t something positive when it‘s for the wrong reason.',
vi:'Chuông chó<br>\
Con chó của John là một con chó hư. Nó thường xuyên cắn người. John rất lo lắng về điều này. Đây không phải là cách cư xử phù hợp của một con chó. Bạn bè anh trong làng luôn mong đợi con chó sẽ cắn họ. Tin tức về con chó của John lan truyền khắp làng. Không ai trong số những người dân muốn đến nhà John. John đã cố gắng hướng dẫn con chó cư xử, nhưng không bao giờ có hiệu quả. Anh đã cố gắng kiên nhẫn và dạy con chó bình tĩnh. Điều đó cũng không hiệu quả. John không muốn trừng phạt con chó. "Làm sao mình có thể ngăn chặn thói quen xấu của con chó?" John tự hỏi.<br>\
Người bạn của John đã đến nói chuyện với anh về vấn đề này. Trong cuộc họp quan trọng của họ, người bạn của anh ấy nói, ―Những người dân trong làng đã yêu cầu tôi đại diện cho họ. Chúng tôi muốn con chó của anh dừng thói quen này. Tại sao anh không đeo một chiếc chuông quanh cổ con chó? Bằng cách này, chúng tôi sẽ nghe thấy tiếng chó của anh đi xuống phố." John nghĩ đây là một ý tưởng tuyệt vời. Bây giờ, mọi người có thể tránh xa con chó. Nó sẽ không thể cắn bất kỳ ai nữa.<br>\
Con chó cũng thích tiếng chuông. Mọi người nhìn nó khi nghe thấy tiếng chuông. Điều này khiến con chó rất vui. Nó thích bài hát mà tiếng chuông phát ra khi nó đi bộ. Một ngày nọ, con chó của John đi dạo qua làng và gặp một số con chó khác. Nó mong đợi chúng muốn có một chiếc chuông giống như của nó. Nhưng chúng cười nhạo tiếng chuông của nó. Chúng nói rằng tiếng chuông khiến mọi người tránh xa nó. Con chó của John lắc đầu. "Không, chúng nhìn tôi vì chúng thích tiếng chuông."<br>\
Những con chó khác nói, ―Bạn đã hiểu sai về điều khiến bạn trở nên nổi tiếng. Tất nhiên là chúng thích tiếng chuông của bạn. Nó cho chúng biết bạn đang ở đâu để chúng có thể tránh bạn. Bạn không thể cắn chúng nữa!"<br>\
Bạn thấy đấy, trở nên nổi tiếng không phải là điều tích cực khi nó xuất phát từ lý do sai lầm.',
voca:'appropriate, avoid, behave, calm, concern, content, expect, frequently, habit, instruct, issue, none, patient, positive, punish, represent, shake, spread, stroll, village'
}
	   ];
