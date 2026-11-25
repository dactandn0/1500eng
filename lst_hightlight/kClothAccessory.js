const kClothAccessoryNouns = [
    'jacket',			// áo khoác
    'tie',				// cà vạt
    'shirt',			// váy
    'shorts',			// quần short, quần đùi (số nhiều)
    't-shirt',			// áo thun
    'blouse',			// áo kiểu sơ mi nữ
    'dress',			// váy
    'skirt',			// váy
    'pants',			// quần
    'socks',			// tất
    'shoe',				// giày
    'boot',				// bốt	
    'sandal',			// dép		
    'sneaker',					
    'hat',				// mũ
    'scarf',			// khăn quàng
    'glasses',			// kính
    'bag',				// túi xách
    'belt',				// dây lưng
    'ring',				// nhẫn
    'bracelet',			// vòng tay
    'necklace',			// dây chuyền
    'earring',			// khuyên tai
    'cap',				// mũ baseball
    'hoodie',			// áo khoác có mũ
    'sweater',			// áo knitted
    'coat',				// áo choàng
    'vest',
    'suit',

    'tank top',
    'polo shirt',
    'sweatshirt',
    'cardigan',
    'pullover',
    'turtleneck',
    'crop top',
    'button-down shirt',
    'long-sleeved shirt',
    'short-sleeved shirt',

    'jeans',
    'leggings',
    'sweatpants',
    'trousers',
    'khakis',
    'track pants',

    'raincoat',
    'windbreaker',
    'overcoat',
    'parka',
    'blazer',
    'leather jacket',
    'denim jacket',
    'puffer jacket',

    'flip-flop',		// dép xỏ ngón
    'loafer',			// giày lười
    'high heel',
    'dress shoe',
    'athletic shoe',
    'running shoe',
    'slipper',
    'cleat',

    'beanie',			// mũ len
    'beret',			// mũ nồi
    'sun hat',			// mũ rộng vành
    'baseball cap',		// mũ lưỡi trai

    'watch',
    'wallet',			// ví
    'purse',			// ví/ túi xách phụ nữ
    'backpack',
    'handbag',
    'tote bag',
    'briefcase',
    'glove',
    'mitten',
    'bow tie',			// cà vạt nơ
    'hairband',			// băng đô
    'headband',			//	băng đô
    'hair clip',		// kẹp tóc
    'hair tie',			// dây buộc tóc
    'brooch',			// trâm cài áo
    'anklet',			// vòng chân
    'pendant',			// mặt dây chuyền
    'wristband',		// vòng tay thể thao

    'swimsuit',
    'bathing suit',
    'underwear',
    'bra',				// áo ngực
    'boxer shorts',		// quần đùi nam
	'panties',			// quần lót nữ
	'lingerie',			// đồ lót nữ
    'pajamas',			// đồ ngủ  (số nhiều)
    'bathrobe',			// áo choàng tắm
    'apron',			// tạp dề
    'nightgown',		// váy ngủ
    'tights',			// quần tất (số nhiều)
    'stocking'			// tất dài, vớ dài
];

const kClothAccessory = kClothAccessoryNouns.map(function (name) {
	return { name: name, category_name: 'ClothAccessory', color: '#ffee00', noun: true };
});
