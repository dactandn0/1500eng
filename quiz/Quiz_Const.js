// Quiz_Const.js - hang so du lieu tinh cho Quiz (SECTION 1-5).
// File nay phai nap TRUOC quiz/Quiz.js trong index.html.
// (Cac object state runtime: QUIZ_API_CACHE, QUIZ_ADDR_POOL,
//  PIC_IMG_CACHE, PIC_WIKI_CACHE, DIR_OSM van nam trong Quiz.js)

const QUIZ_ROUND_SIZE = 20;

const QUIZ_OPTION_COUNT = 4;

const DETAIL_ROUND_SIZE = 20;

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const CONF_MONTH = {
	'January': ['June','July','February'],
	'February': ['December','November','January'],
	'March': ['May','August','April'],
	'April': ['August','July','June'],
	'May': ['March','July','April'],
	'June': ['July','January','April'],
	'July': ['June','January','May'],
	'August': ['April','October','July'],
	'September': ['December','November','October'],
	'October': ['August','November','September'],
	'November': ['December','September','October'],
	'December': ['September','November','February']
};

const STREET_GROUPS = [
	['Main','Maine','Mason'],
	['Travis','Tavis','Davis'],
	['Fannin','Fannon','Cannon'],
	['San Jacinto','San Antonio','San Felipe'],
	['Louisiana','Luciana','Indiana'],
	['Milam','Milan','Miller'],
	['Westheimer','Westmar','Westmere'],
	['Kirby','Kerby','Kirkby'],
	['Shepherd','Sheppard','Sheffield'],
	['Richmond','Richman','Richland'],
	['Bellaire','Bel Air','Bella Vista'],
	['Memorial','Memoral','Mermorial'],
	['Post Oak','Post Oaks','Pine Oak'],
	['Montrose','Monroe','Monterey'],
	['Washington','Warrington','Arlington'],
	['Katy','Katie','Cady'],
	['Lamar','Lamor','Lemark'],
	['Polk','Poke','Park'],
	['Walker','Waker','Walter'],
	['Preston','Presten','Houston']
];

const STREET_TYPES = ['Street','Avenue','Boulevard','Drive','Lane','Road','Way'];

const CITIES = [
	'Houston, Texas 77002',
	'Houston, Texas 77006',
	'Houston, Texas 77054',
	'Houston, Texas 77082',
	'Katy, Texas 77494',
	'Sugar Land, Texas 77479',
	'Pasadena, Texas 77506',
	'The Woodlands, Texas 77380',
	'Dallas, Texas 75201',
	'Austin, Texas 78701',
	'San Antonio, Texas 78205',
	'El Paso, Texas 79901'
];

const US_AREA_CODES = ['713','281','832','346','214','469','972','512','210','212','213','312','305','404','415','617','718','917'];

const NAME_GROUPS = [
	['Anna','Hannah','Emma','Anne'],
	['Emily','Emilia','Amelia','Emma'],
	['Daniel','Danielle','Danny','David'],
	['Michael','Michelle','Mitchell','Matthew'],
	['John','Joan','Jon','Johnson'],
	['Smith','Smyth','Smit','Schmidt'],
	['Brown','Browne','Braun','Brian'],
	['Johnson','Jonson','Johnston','Jackson'],
	['Taylor','Tyler','Tailor','Tayla'],
	['Wilson','Willson','Wilton','William'],
	['David','Davis','Davies','Daisy'],
	['Sophia','Sofia','Sophie','Sarah'],
	['Catherine','Katherine','Kathryn','Katie'],
	['Steven','Stephen','Stephens','Stewart'],
	['Brian','Bryan','Ryan','Bryant']
];

const BLOOD_TYPES = [
	{ long: 'A positive', short: 'A+' },
	{ long: 'A negative', short: 'A-' },
	{ long: 'B positive', short: 'B+' },
	{ long: 'B negative', short: 'B-' },
	{ long: 'AB positive', short: 'AB+' },
	{ long: 'AB negative', short: 'AB-' },
	{ long: 'O positive', short: 'O+' },
	{ long: 'O negative', short: 'O-' }
];

const PIC_ROUND_SIZE = 20;

const PIC_FOODS = [
	    { en: 'oatmeal', vi: 'cháo yến mạch' }, { en: 'cereal', vi: 'ngũ cốc ăn sáng' }, { en: 'pancakes', vi: 'bánh pancake' }, { en: 'waffles', vi: 'bánh waffle' }, { en: 'toast', vi: 'bánh mì nướng' }, { en: 'bagel', vi: 'bánh vòng bagel' }, { en: 'muffin', vi: 'bánh muffin' }, { en: 'donut', vi: 'bánh donut' }, { en: 'croissant', vi: 'bánh sừng bò' }, { en: 'pretzel', vi: 'bánh xoắn mặn' },
    { en: 'bacon', vi: 'thịt xông khói' }, { en: 'sausage', vi: 'xúc xích' }, { en: 'ham', vi: 'giăm bông' }, { en: 'turkey', vi: 'thịt gà tây' }, { en: 'duck', vi: 'thịt vịt' }, { en: 'lamb', vi: 'thịt cừu' }, { en: 'steak', vi: 'bít tết' }, { en: 'meatball', vi: 'thịt viên' }, { en: 'hot dog', vi: 'xúc xích hot dog' }, { en: 'fried chicken', vi: 'gà rán' },
    { en: 'fried rice', vi: 'cơm chiên' }, { en: 'fried noodles', vi: 'mì xào' }, { en: 'ramen', vi: 'mì ramen' }, { en: 'spaghetti', vi: 'mì Ý spaghetti' }, { en: 'macaroni', vi: 'mì macaroni' }, { en: 'lasagna', vi: 'mì lasagna' }, { en: 'dumplings', vi: 'há cảo/bánh bột' }, { en: 'wontons', vi: 'hoành thánh' }, { en: 'tacos', vi: 'bánh taco' }, { en: 'burrito', vi: 'bánh burrito' },
    { en: 'nachos', vi: 'nachos' }, { en: 'quesadilla', vi: 'bánh quesadilla' }, { en: 'french fries', vi: 'khoai tây chiên' }, { en: 'mashed potatoes', vi: 'khoai tây nghiền' }, { en: 'baked potato', vi: 'khoai tây nướng' }, { en: 'onion rings', vi: 'hành tây chiên vòng' }, { en: 'coleslaw', vi: 'salad bắp cải' }, { en: 'mac and cheese', vi: 'mì nui phô mai' }, { en: 'grilled cheese', vi: 'bánh mì phô mai nướng' }, { en: 'meatloaf', vi: 'bánh thịt' },
    { en: 'clam chowder', vi: 'súp nghêu' }, { en: 'chicken soup', vi: 'súp gà' }, { en: 'tomato soup', vi: 'súp cà chua' }, { en: 'mushroom soup', vi: 'súp nấm' }, { en: 'beef stew', vi: 'bò hầm' }, { en: 'chicken wings', vi: 'cánh gà' }, { en: 'chicken nuggets', vi: 'gà viên' }, { en: 'fish and chips', vi: 'cá chiên và khoai tây' }, { en: 'grilled chicken', vi: 'gà nướng' }, { en: 'barbecue ribs', vi: 'sườn nướng BBQ' },
    { en: 'tuna', vi: 'cá ngừ' }, { en: 'salmon', vi: 'cá hồi' }, { en: 'cod', vi: 'cá tuyết' }, { en: 'squid', vi: 'mực' }, { en: 'octopus', vi: 'bạch tuộc' }, { en: 'lobster', vi: 'tôm hùm' }, { en: 'oyster', vi: 'hàu' }, { en: 'clam', vi: 'nghêu' }, { en: 'mussel', vi: 'vẹm' }, { en: 'scallop', vi: 'sò điệp' },
    { en: 'mushroom', vi: 'nấm' }, { en: 'broccoli', vi: 'bông cải xanh' }, { en: 'cauliflower', vi: 'súp lơ trắng' }, { en: 'cabbage', vi: 'bắp cải' }, { en: 'lettuce', vi: 'xà lách' }, { en: 'spinach', vi: 'rau bina' }, { en: 'corn', vi: 'bắp/ngô' }, { en: 'peas', vi: 'đậu Hà Lan' }, { en: 'green beans', vi: 'đậu que' }, { en: 'celery', vi: 'cần tây' },
    { en: 'bell pepper', vi: 'ớt chuông' }, { en: 'chili pepper', vi: 'ớt cay' }, { en: 'ginger', vi: 'gừng' }, { en: 'scallion', vi: 'hành lá' }, { en: 'cilantro', vi: 'ngò rí' }, { en: 'basil', vi: 'húng quế' }, { en: 'mayo', vi: 'sốt mayonnaise' }, { en: 'ketchup', vi: 'tương cà' }, { en: 'mustard', vi: 'mù tạt' }, { en: 'hot sauce', vi: 'tương ớt' },
    { en: 'soy sauce', vi: 'nước tương' }, { en: 'fish sauce', vi: 'nước mắm' }, { en: 'vinegar', vi: 'giấm' }, { en: 'honey', vi: 'mật ong' }, { en: 'flour', vi: 'bột mì' }, { en: 'cornstarch', vi: 'bột bắp' }, { en: 'cooking oil', vi: 'dầu ăn' }, { en: 'olive oil', vi: 'dầu ô liu' }, { en: 'peanut butter', vi: 'bơ đậu phộng' }, { en: 'jam', vi: 'mứt' },
    { en: 'yogurt', vi: 'sữa chua' }, { en: 'cream', vi: 'kem sữa' }, { en: 'whipped cream', vi: 'kem tươi đánh bông' }, { en: 'pudding', vi: 'bánh pudding' }, { en: 'brownie', vi: 'bánh brownie' }, { en: 'cookie', vi: 'bánh quy' }, { en: 'pie', vi: 'bánh pie' }, { en: 'cheesecake', vi: 'bánh phô mai' }, { en: 'popcorn', vi: 'bỏng ngô' }, { en: 'chips', vi: 'khoai tây lát chiên' },
    { en: 'smoothie', vi: 'sinh tố' }, { en: 'milkshake', vi: 'sữa lắc' }, { en: 'soda', vi: 'nước ngọt có ga' }, { en: 'lemonade', vi: 'nước chanh' }, { en: 'hot chocolate', vi: 'sô cô la nóng' }, { en: 'sparkling water', vi: 'nước có ga' }, { en: 'coconut milk', vi: 'nước cốt dừa' }, { en: 'soy milk', vi: 'sữa đậu nành' }, { en: 'almond milk', vi: 'sữa hạnh nhân' }, { en: 'protein shake', vi: 'sữa lắc protein' }
];

const PIC_FRUITS = [
	{ en: 'pomegranate', vi: 'lựu' }, { en: 'grapefruit', vi: 'bưởi chùm' }, { en: 'lime', vi: 'chanh xanh' }, { en: 'passion fruit', vi: 'chanh dây' }, { en: 'guava', vi: 'ổi' }, { en: 'dragon fruit', vi: 'thanh long' }, { en: 'star fruit', vi: 'khế' }, { en: 'custard apple', vi: 'na' }, { en: 'soursop', vi: 'mãng cầu xiêm' }, { en: 'sapodilla', vi: 'hồng xiêm' },
    { en: 'persimmon', vi: 'hồng' }, { en: 'fig', vi: 'sung' }, { en: 'date', vi: 'chà là' }, { en: 'mulberry', vi: 'dâu tằm' }, { en: 'raspberry', vi: 'mâm xôi đỏ' }, { en: 'blackberry', vi: 'mâm xôi đen' }, { en: 'blueberry', vi: 'việt quất' }, { en: 'cranberry', vi: 'nam việt quất' }, { en: 'gooseberry', vi: 'lý gai' }, { en: 'blackcurrant', vi: 'lý chua đen' },
    { en: 'redcurrant', vi: 'lý chua đỏ' }, { en: 'grape', vi: 'quả nho' }, { en: 'cantaloupe', vi: 'dưa lưới' }, { en: 'honeydew', vi: 'dưa mật' }, { en: 'melon', vi: 'dưa' }, { en: 'cucumber', vi: 'dưa chuột' }, { en: 'cranberry', vi: 'quả nam việt quất' }, { en: 'elderberry', vi: 'quả cơm cháy' }, { en: 'boysenberry', vi: 'mâm xôi lai' }, { en: 'loganberry', vi: 'mâm xôi lai đỏ' },
    { en: 'breadfruit', vi: 'sa kê' }, { en: 'plantain', vi: 'chuối lá' }, { en: 'quince', vi: 'mộc qua' }, { en: 'nectarine', vi: 'xuân đào' }, { en: 'persimmon', vi: 'quả hồng' }, { en: 'olive', vi: 'ô liu' }, { en: 'kumquat', vi: 'tắc' }, { en: 'tamarind', vi: 'me' }, { en: 'rambutan', vi: 'chôm chôm' }, { en: 'mangosteen', vi: 'măng cụt' },
    { en: 'salak', vi: 'mây thái' }, { en: 'santol', vi: 'bòn bon' }, { en: 'langsat', vi: 'dâu da' }, { en: 'pulasan', vi: 'mận lông' }, { en: 'star apple', vi: 'vú sữa' }, { en: 'rose apple', vi: 'mận' }, { en: 'wax apple', vi: 'mận roi' }, { en: 'water apple', vi: 'roi' }, { en: 'ambarella', vi: 'cóc' }, { en: 'bilimbi', vi: 'khế tàu' },
    { en: 'breadnut', vi: 'quả sa kê hạt' }, { en: 'monstera fruit', vi: 'quả monstera' }, { en: 'ackee', vi: 'ackee' }, { en: 'feijoa', vi: 'ổi dứa' }, { en: 'loquat', vi: 'tỳ bà' }, { en: 'medlar', vi: 'sơn tra châu Âu' }, { en: 'hawthorn', vi: 'sơn tra' }, { en: 'persimmon', vi: 'quả hồng' }, { en: 'miracle fruit', vi: 'quả thần kỳ' }, { en: 'jabuticaba', vi: 'jabuticaba' },
    { en: 'cherimoya', vi: 'mãng cầu ta' }, { en: 'atemoya', vi: 'mãng cầu lai' }, { en: 'sugar apple', vi: 'mãng cầu' }, { en: 'black sapote', vi: 'hồng socola' }, { en: 'mamey sapote', vi: 'sapôchê mamey' }, { en: 'canistel', vi: 'trứng gà' }, { en: 'lucuma', vi: 'lúcuma' }, { en: 'tamarillo', vi: 'cà chua thân gỗ' }, { en: 'physalis', vi: 'tầm bóp' }, { en: 'cape gooseberry', vi: 'thù lù' },
    { en: 'horned melon', vi: 'dưa sừng' }, { en: 'bitter melon', vi: 'mướp đắng' }, { en: 'winter melon', vi: 'bí đao' }, { en: 'pumpkin', vi: 'bí ngô' }, { en: 'squash', vi: 'bí' }, { en: 'zucchini', vi: 'bí ngòi' }, { en: 'cactus pear', vi: 'lê gai' }, { en: 'prickly pear', vi: 'xương rồng lê gai' }, { en: 'kiwano', vi: 'dưa sừng châu Phi' }, { en: 'pepino', vi: 'dưa pepino' },
    { en: 'muscadine', vi: 'nho muscadine' }, { en: 'concord grape', vi: 'nho concord' }, { en: 'raisins', vi: 'nho khô' }, { en: 'currant', vi: 'quả lý chua' }, { en: 'sloe', vi: 'mận gai' }, { en: 'damson', vi: 'mận damson' }, { en: 'greengage', vi: 'mận xanh' }, { en: 'mirabelle', vi: 'mận mirabelle' }, { en: 'cloudberry', vi: 'mâm xôi vàng' }, { en: 'lingonberry', vi: 'việt quất đỏ' },
    { en: 'huckleberry', vi: 'huckleberry' }, { en: 'goji berry', vi: 'kỷ tử' }, { en: 'acai berry', vi: 'quả acai' }, { en: 'aronia berry', vi: 'quả chokeberry' }, { en: 'juniper berry', vi: 'quả bách xù' }, { en: 'sea buckthorn', vi: 'hắc mai biển' }, { en: 'serviceberry', vi: 'quả serviceberry' }, { en: 'salmonberry', vi: 'mâm xôi cá hồi' }, { en: 'dewberry', vi: 'mâm xôi dại' }, { en: 'marionberry', vi: 'mâm xôi marion' },
    { en: 'persian lime', vi: 'chanh Ba Tư' }, { en: 'key lime', vi: 'chanh key' }, { en: 'yuzu', vi: 'yuzu' }, { en: 'citron', vi: 'thanh yên' }, { en: 'bergamot', vi: 'cam bergamot' }, { en: 'pomelo', vi: 'bưởi' }, { en: 'mandarin', vi: 'quýt' }, { en: 'clementine', vi: 'quýt clementine' }, { en: 'tangelo', vi: 'quýt lai bưởi' }, { en: 'blood orange', vi: 'cam đỏ' }
];

const PIC_INSECTS = [
	 { en: 'earwig', vi: 'bọ kẹp kìm' }, { en: 'silverfish', vi: 'bọ bạc' }, { en: 'booklouse', vi: 'rận sách' }, { en: 'weevil', vi: 'mọt' }, { en: 'stink bug', vi: 'bọ xít' }, { en: 'water bug', vi: 'bọ nước' }, { en: 'water strider', vi: 'bọ gọng vó' }, { en: 'praying mantis', vi: 'bọ ngựa' }, { en: 'walking stick', vi: 'bọ que' }, { en: 'leaf insect', vi: 'bọ lá' },
    { en: 'cicada', vi: 've sầu' }, { en: 'cicada nymph', vi: 'ấu trùng ve sầu' }, { en: 'mayfly', vi: 'phù du' }, { en: 'dragonfly nymph', vi: 'ấu trùng chuồn chuồn' }, { en: 'damselfly', vi: 'chuồn chuồn kim' }, { en: 'lacewing', vi: 'bọ cánh ren' }, { en: 'antlion', vi: 'bọ sư tử kiến' }, { en: 'dobsonfly', vi: 'ruồi dobson' }, { en: 'stonefly', vi: 'phù du đá' }, { en: 'caddisfly', vi: 'ruồi cánh lông' },
    { en: 'mayfly', vi: 'con phù du' }, { en: 'horsefly', vi: 'ruồi trâu' }, { en: 'fruit fly', vi: 'ruồi giấm' }, { en: 'housefly', vi: 'ruồi nhà' }, { en: 'drain fly', vi: 'ruồi cống' }, { en: 'blowfly', vi: 'ruồi xanh' }, { en: 'gnat', vi: 'muỗi nhỏ' }, { en: 'midge', vi: 'muỗi dĩn' }, { en: 'black fly', vi: 'ruồi đen' }, { en: 'sandfly', vi: 'ruồi cát' },
    { en: 'bumblebee', vi: 'ong nghệ' }, { en: 'honeybee', vi: 'ong mật' }, { en: 'carpenter bee', vi: 'ong thợ mộc' }, { en: 'hornet', vi: 'ong vò vẽ' }, { en: 'paper wasp', vi: 'ong giấy' }, { en: 'yellowjacket', vi: 'ong vàng' }, { en: 'mud dauber', vi: 'ong đất' }, { en: 'ichneumon wasp', vi: 'ong ký sinh' }, { en: 'fig wasp', vi: 'ong sung' }, { en: 'sawfly', vi: 'ong cưa' },
    { en: 'mole cricket', vi: 'dế trũi' }, { en: 'field cricket', vi: 'dế đồng' }, { en: 'house cricket', vi: 'dế nhà' }, { en: 'katydid', vi: 'châu chấu lá' }, { en: 'locust', vi: 'châu chấu' }, { en: 'mormon cricket', vi: 'dế Mormon' }, { en: 'tree cricket', vi: 'dế cây' }, { en: 'camel cricket', vi: 'dế lạc đà' }, { en: 'bush cricket', vi: 'dế bụi' }, { en: 'jerusalem cricket', vi: 'dế Jerusalem' },
    { en: 'stag beetle', vi: 'bọ hươu' }, { en: 'rhinoceros beetle', vi: 'bọ tê giác' }, { en: 'jewel beetle', vi: 'bọ kim bảo' }, { en: 'click beetle', vi: 'bọ bật' }, { en: 'longhorn beetle', vi: 'bọ xén tóc' }, { en: 'tiger beetle', vi: 'bọ hổ' }, { en: 'dung beetle', vi: 'bọ hung' }, { en: 'water beetle', vi: 'bọ nước' }, { en: 'darkling beetle', vi: 'bọ cánh cứng đen' }, { en: 'soldier beetle', vi: 'bọ lính' },
    { en: 'weevil', vi: 'mọt vòi voi' }, { en: 'grain beetle', vi: 'bọ hạt' }, { en: 'flour beetle', vi: 'bọ bột' }, { en: 'carpet beetle', vi: 'bọ thảm' }, { en: 'bark beetle', vi: 'bọ vỏ cây' }, { en: 'potato beetle', vi: 'bọ khoai tây' }, { en: 'leaf beetle', vi: 'bọ ăn lá' }, { en: 'blister beetle', vi: 'bọ phồng rộp' }, { en: 'rove beetle', vi: 'bọ cánh ngắn' }, { en: 'ladybird', vi: 'bọ rùa' },
    { en: 'fire ant', vi: 'kiến lửa' }, { en: 'carpenter ant', vi: 'kiến thợ mộc' }, { en: 'black ant', vi: 'kiến đen' }, { en: 'red ant', vi: 'kiến đỏ' }, { en: 'army ant', vi: 'kiến quân đội' }, { en: 'leafcutter ant', vi: 'kiến cắt lá' }, { en: 'weaver ant', vi: 'kiến vàng' }, { en: 'bullet ant', vi: 'kiến đạn' }, { en: 'harvester ant', vi: 'kiến thu hoạch' }, { en: 'ghost ant', vi: 'kiến ma' },
    { en: 'termite queen', vi: 'mối chúa' }, { en: 'termite worker', vi: 'mối thợ' }, { en: 'flea beetle', vi: 'bọ nhảy' }, { en: 'bedbug', vi: 'rệp giường' }, { en: 'head louse', vi: 'chấy đầu' }, { en: 'body louse', vi: 'rận thân' }, { en: 'pubic louse', vi: 'rận mu' }, { en: 'tick', vi: 've' }, { en: 'mite', vi: 'con mạt' }, { en: 'dust mite', vi: 'mạt bụi' },
    { en: 'tarantula', vi: 'nhện tarantula' }, { en: 'black widow', vi: 'nhện góa phụ đen' }, { en: 'wolf spider', vi: 'nhện sói' }, { en: 'jumping spider', vi: 'nhện nhảy' }, { en: 'orb-weaver', vi: 'nhện giăng lưới' }, { en: 'crab spider', vi: 'nhện cua' }, { en: 'funnel-web spider', vi: 'nhện mạng phễu' }, { en: 'cellar spider', vi: 'nhện chân dài' }, { en: 'house spider', vi: 'nhện nhà' }, { en: 'garden spider', vi: 'nhện vườn' },
];

const PIC_NAIL_SHAPES = [
    { en: 'square', vi: 'móng vuông' }, { en: 'squoval', vi: 'vuông bo góc' }, { en: 'round', vi: 'móng tròn' }, { en: 'oval', vi: 'móng oval' }, { en: 'almond', vi: 'móng hạnh nhân' }, { en: 'coffin', vi: 'móng coffin' }, { en: 'ballerina', vi: 'móng ballerina' }, { en: 'stiletto', vi: 'móng nhọn' }, { en: 'tapered square', vi: 'móng vuông thuôn' }, { en: 'lipstick', vi: 'móng hình thỏi son' },
    { en: 'edge', vi: 'móng dáng cạnh' }, { en: 'flare', vi: 'móng xòe' }, { en: 'duck nails', vi: 'móng chân vịt' }, { en: 'mountain peak', vi: 'móng đỉnh núi' }, { en: 'pipe', vi: 'móng ống' }, { en: 'arrowhead', vi: 'móng đầu mũi tên' }, { en: 'edge nails', vi: 'móng cạnh' }, { en: 'gothic almond', vi: 'almond kiểu gothic' }, { en: 'gothic stiletto', vi: 'stiletto kiểu gothic' }, { en: 'modern almond', vi: 'almond hiện đại' },
    { en: 'short square', vi: 'vuông ngắn' }, { en: 'medium square', vi: 'vuông vừa' }, { en: 'long square', vi: 'vuông dài' }, { en: 'short squoval', vi: 'squoval ngắn' }, { en: 'medium squoval', vi: 'squoval vừa' }, { en: 'long squoval', vi: 'squoval dài' }, { en: 'short round', vi: 'tròn ngắn' }, { en: 'medium round', vi: 'tròn vừa' }, { en: 'long oval', vi: 'oval dài' }, { en: 'short oval', vi: 'oval ngắn' },
    { en: 'short almond', vi: 'almond ngắn' }, { en: 'medium almond', vi: 'almond vừa' }, { en: 'long almond', vi: 'almond dài' }, { en: 'extra long almond', vi: 'almond rất dài' }, { en: 'short coffin', vi: 'coffin ngắn' }, { en: 'medium coffin', vi: 'coffin vừa' }, { en: 'long coffin', vi: 'coffin dài' }, { en: 'extra long coffin', vi: 'coffin rất dài' }, { en: 'short stiletto', vi: 'stiletto ngắn' }, { en: 'long stiletto', vi: 'stiletto dài' },
    { en: 'soft square', vi: 'vuông mềm' }, { en: 'sharp square', vi: 'vuông góc sắc' }, { en: 'soft almond', vi: 'almond mềm' }, { en: 'sharp almond', vi: 'almond nhọn' }, { en: 'wide almond', vi: 'almond bản rộng' }, { en: 'narrow almond', vi: 'almond thon' }, { en: 'wide coffin', vi: 'coffin bản rộng' }, { en: 'narrow coffin', vi: 'coffin thon' }, { en: 'tapered almond', vi: 'almond thuôn' }, { en: 'tapered coffin', vi: 'coffin thuôn' },
    { en: 'natural shape', vi: 'dáng tự nhiên' }, { en: 'natural round', vi: 'tròn tự nhiên' }, { en: 'natural oval', vi: 'oval tự nhiên' }, { en: 'natural square', vi: 'vuông tự nhiên' }, { en: 'natural almond', vi: 'almond tự nhiên' }, { en: 'sculpted square', vi: 'vuông đắp khuôn' }, { en: 'sculpted almond', vi: 'almond đắp khuôn' }, { en: 'sculpted coffin', vi: 'coffin đắp khuôn' }, { en: 'sculpted stiletto', vi: 'stiletto đắp khuôn' }, { en: 'custom shape', vi: 'dáng tùy chỉnh' },
    { en: 'straight sidewalls', vi: 'thành móng thẳng' }, { en: 'tapered sidewalls', vi: 'thành móng thuôn' }, { en: 'wide tip', vi: 'đầu móng rộng' }, { en: 'narrow tip', vi: 'đầu móng hẹp' }, { en: 'pointed tip', vi: 'đầu móng nhọn' }, { en: 'rounded tip', vi: 'đầu móng tròn' }, { en: 'flat tip', vi: 'đầu móng phẳng' }, { en: 'sharp tip', vi: 'đầu móng sắc' }, { en: 'soft tip', vi: 'đầu móng mềm' }, { en: 'flat sidewalls', vi: 'thành móng phẳng' },
    { en: 'deep C-curve', vi: 'đường cong C sâu' }, { en: 'soft C-curve', vi: 'đường cong C nhẹ' }, { en: 'high apex', vi: 'apex cao' }, { en: 'low apex', vi: 'apex thấp' }, { en: 'balanced shape', vi: 'dáng cân đối' }, { en: 'symmetrical shape', vi: 'dáng đối xứng' }, { en: 'asymmetrical shape', vi: 'dáng không đối xứng' }, { en: 'slim shape', vi: 'dáng thon' }, { en: 'wide shape', vi: 'dáng rộng' }, { en: 'dramatic shape', vi: 'dáng nổi bật' },
    { en: 'extra short', vi: 'siêu ngắn' }, { en: 'short length', vi: 'độ dài ngắn' }, { en: 'medium length', vi: 'độ dài vừa' }, { en: 'long length', vi: 'độ dài dài' }, { en: 'extra long', vi: 'siêu dài' }, { en: 'natural length', vi: 'độ dài tự nhiên' }, { en: 'extension length', vi: 'độ dài nối' }, { en: 'tip length', vi: 'độ dài phần đầu móng' }, { en: 'free-edge length', vi: 'độ dài phần móng chìa' }, { en: 'length and shape', vi: 'độ dài và dáng móng' },
    { en: 'shape change', vi: 'đổi dáng móng' }, { en: 'reshape', vi: 'đổi lại dáng móng' }, { en: 'file into shape', vi: 'giũa tạo dáng' }, { en: 'square off', vi: 'giũa thành vuông' }, { en: 'round off', vi: 'bo tròn' }, { en: 'taper', vi: 'thuôn dần' }, { en: 'file the sides', vi: 'giũa hai bên' }, { en: 'file the tip', vi: 'giũa đầu móng' }, { en: 'match the shape', vi: 'làm dáng giống nhau' }, { en: 'match the length', vi: 'làm độ dài giống nhau' }
];

const PIC_NAIL_ART = [
    { en: 'French tip', vi: 'đầu móng French' }, { en: 'reverse French', vi: 'French ngược' }, { en: 'micro French', vi: 'French nét siêu mảnh' }, { en: 'double French', vi: 'French hai đường' }, { en: 'deep French', vi: 'French đầu sâu' }, { en: 'colored French', vi: 'French màu' }, { en: 'ombre French', vi: 'French ombre' }, { en: 'side French', vi: 'French một bên' }, { en: 'V French', vi: 'French chữ V' }, { en: 'French fade', vi: 'French chuyển màu' },
    { en: 'ombre', vi: 'chuyển màu ombre' }, { en: 'baby boomer', vi: 'baby boomer' }, { en: 'aura nails', vi: 'móng hiệu ứng aura' }, { en: 'chrome nails', vi: 'móng chrome' }, { en: 'glazed nails', vi: 'móng hiệu ứng tráng men' }, { en: 'cat eye', vi: 'mắt mèo' }, { en: 'magnetic nails', vi: 'móng hiệu ứng nam châm' }, { en: 'velvet nails', vi: 'móng hiệu ứng nhung' }, { en: 'mirror nails', vi: 'móng gương' }, { en: 'metallic nails', vi: 'móng ánh kim' },
    { en: 'marble nails', vi: 'móng vân đá' }, { en: 'tortoiseshell', vi: 'mai rùa' }, { en: 'animal print', vi: 'họa tiết da động vật' }, { en: 'leopard print', vi: 'da báo' }, { en: 'zebra print', vi: 'sọc ngựa vằn' }, { en: 'cow print', vi: 'da bò' }, { en: 'snake print', vi: 'da rắn' }, { en: 'floral design', vi: 'họa tiết hoa' }, { en: 'flower design', vi: 'hình hoa' }, { en: 'rose design', vi: 'hình hoa hồng' },
    { en: 'cherry design', vi: 'hình quả cherry' }, { en: 'strawberry design', vi: 'hình dâu' }, { en: 'butterfly design', vi: 'hình bướm' }, { en: 'heart design', vi: 'hình trái tim' }, { en: 'star design', vi: 'hình ngôi sao' }, { en: 'moon design', vi: 'hình mặt trăng' }, { en: 'sun design', vi: 'hình mặt trời' }, { en: 'cloud design', vi: 'hình mây' }, { en: 'smiley face', vi: 'mặt cười' }, { en: 'checkered nails', vi: 'móng họa tiết caro' },
    { en: 'swirl design', vi: 'họa tiết xoắn' }, { en: 'wavy lines', vi: 'đường lượn sóng' }, { en: 'abstract design', vi: 'họa tiết trừu tượng' }, { en: 'geometric design', vi: 'họa tiết hình học' }, { en: 'line art', vi: 'vẽ nét' }, { en: 'minimalist design', vi: 'họa tiết tối giản' }, { en: 'negative space', vi: 'khoảng trống tạo hình' }, { en: 'color block', vi: 'mảng màu' }, { en: 'checkerboard', vi: 'bàn cờ' }, { en: 'polka dots', vi: 'chấm bi' },
    { en: 'rhinestones', vi: 'đá đính móng' }, { en: 'nail gems', vi: 'đá trang trí móng' }, { en: 'crystals', vi: 'pha lê' }, { en: 'pearls', vi: 'ngọc trai' }, { en: '3D flowers', vi: 'hoa 3D' }, { en: '3D charms', vi: 'phụ kiện 3D' }, { en: 'nail charms', vi: 'phụ kiện đính móng' }, { en: 'metal charms', vi: 'phụ kiện kim loại' }, { en: 'gold flakes', vi: 'vảy vàng' }, { en: 'silver flakes', vi: 'vảy bạc' },
    { en: 'glitter nails', vi: 'móng kim tuyến' }, { en: 'fine glitter', vi: 'kim tuyến mịn' }, { en: 'chunky glitter', vi: 'kim tuyến hạt lớn' }, { en: 'glitter fade', vi: 'kim tuyến chuyển dần' }, { en: 'glitter French', vi: 'French kim tuyến' }, { en: 'foil nails', vi: 'móng foil' }, { en: 'gold foil', vi: 'foil vàng' }, { en: 'silver foil', vi: 'foil bạc' }, { en: 'transfer foil', vi: 'foil chuyển hình' }, { en: 'holographic', vi: 'holographic' },
    { en: 'stamping', vi: 'dập hình móng' }, { en: 'nail stamping plate', vi: 'bảng dập móng' }, { en: 'sticker', vi: 'sticker dán móng' }, { en: 'nail decal', vi: 'decal móng' }, { en: 'water decal', vi: 'decal nước' }, { en: 'hand-painted', vi: 'vẽ bằng tay' }, { en: 'freehand design', vi: 'vẽ tự do' }, { en: 'airbrush', vi: 'phun airbrush' }, { en: 'airbrush design', vi: 'họa tiết airbrush' }, { en: '3D nail art', vi: 'nail art 3D' },
    { en: 'raised design', vi: 'họa tiết nổi' }, { en: 'embossed design', vi: 'họa tiết dập nổi' }, { en: 'textured nails', vi: 'móng có họa tiết nổi' }, { en: 'sugar effect', vi: 'hiệu ứng đường cát' }, { en: 'velvet effect', vi: 'hiệu ứng nhung' }, { en: 'chrome effect', vi: 'hiệu ứng chrome' }, { en: 'mirror effect', vi: 'hiệu ứng gương' }, { en: 'matte finish', vi: 'bề mặt lì' }, { en: 'glossy finish', vi: 'bề mặt bóng' }, { en: 'shimmer', vi: 'ánh nhũ' },
    { en: 'accent nail', vi: 'móng nhấn' }, { en: 'feature nail', vi: 'móng tạo điểm nhấn' }, { en: 'statement nail', vi: 'móng nổi bật' }, { en: 'matching set', vi: 'bộ móng đồng bộ' }, { en: 'mixed designs', vi: 'nhiều kiểu họa tiết' }, { en: 'mix and match', vi: 'phối nhiều kiểu' }, { en: 'two-tone', vi: 'hai màu' }, { en: 'multicolor', vi: 'nhiều màu' }, { en: 'ombre fade', vi: 'chuyển màu dần' }, { en: 'custom nail art', vi: 'nail art thiết kế riêng' }
];

const PIC_NAILS = PIC_NAIL_SHAPES.concat(PIC_NAIL_ART);

const NAIL_ROUND_SIZE = 20;

const NAIL_OPTION_COUNT = 4;

const DIR_ROUND_SIZE = 10;

const DIR_CENTERS = [
	{ id: 'houston', label: 'Houston, Texas', lat: 29.7604, lon: -95.3698, w: 70 },
	{ id: 'dallas', label: 'Dallas, Texas', lat: 32.7767, lon: -96.7970, w: 10 },
	{ id: 'austin', label: 'Austin, Texas', lat: 30.2672, lon: -97.7431, w: 10 },
	{ id: 'sanantonio', label: 'San Antonio, Texas', lat: 29.4241, lon: -98.4936, w: 10 }
];

const DIR_FLIP_MOD = {
	'left': 'right', 'right': 'left',
	'slight left': 'slight right', 'slight right': 'slight left',
	'sharp left': 'sharp right', 'sharp right': 'sharp left'
};

const DIR_OVERPASS_EPS = [
	'https://overpass-api.de/api/interpreter',
	'https://overpass.kumi.systems/api/interpreter'
];

const DIR_FLIP_REL = {
	'next to': ['across from', 'behind'],
	'across from': ['next to', 'behind'],
	'behind': ['next to', 'across from'],
	'near': ['far from', 'next to'],
	'far from': ['near'],
	'north of': ['south of'], 'south of': ['north of'],
	'east of': ['west of'], 'west of': ['east of'],
	'northeast of': ['southwest of'], 'southwest of': ['northeast of'],
	'northwest of': ['southeast of'], 'southeast of': ['northwest of']
};

const DIR_LOCAL_POIS = [
	{ name: 'Memorial Park', cat: 'park' }, { name: 'Hermann Park', cat: 'park' },
	{ name: 'Discovery Green', cat: 'park' }, { name: 'Buffalo Bayou Park', cat: 'park' },
	{ name: 'Lamar High School', cat: 'school' }, { name: 'Westside High School', cat: 'school' },
	{ name: 'Houston Public Library', cat: 'library' }, { name: 'Memorial Hermann Hospital', cat: 'hospital' },
	{ name: 'Lake Houston', cat: 'lake' }, { name: 'McGovern Lake', cat: 'lake' },
	{ name: 'Station 8 Fire Station', cat: 'fire station' }, { name: 'Rice University', cat: 'college' }
];

const DIR_LOCAL_RELS = ['next to', 'near', 'north of', 'south of', 'east of', 'west of', 'across from'];
