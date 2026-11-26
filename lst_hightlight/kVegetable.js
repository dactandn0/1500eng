/*
Just declare Singular NOUNs to create a list.
*/

const kVegetableNouns = [
// Củ, quả & các loại rau dạng quả (Roots, Tubers & Fruit Vegetables)
'carrot',          // cà rốt
'potato',          // khoai tây
'sweet potato',    // khoai lang
'yam',             // khoai mỡ/khoai từ
'tomato',          // cà chua
'cucumber',        // dưa chuột
'eggplant',        // cà tím
'zucchini',        // bí ngòi
'pumpkin',         // bí đỏ
'butternut squash',// bí hồ lô
'bell pepper',     // ớt chuông
'chili pepper',    // ớt
'corn',            // ngô/bắp
'pea',             // đậu Hà Lan
'green bean',      // đậu que/đậu xanh
'okra',            // đậu bắp
'winter melon',    // bí đao
'bitter melon',    // mướp đắng/khổ qua
'daikon',          // củ cải trắng
'radish',          // củ cải
'turnip',          // củ cải tròn (turnip)
'beet',            // củ dền
'avocado',         // quả bơ
'mushroom',        // nấm

// Rau ăn lá & các loại rau họ cải (Leafy Greens & Cruciferous)
'cabbage',         // bắp cải
'brussels sprout', // cải mầm Brussels
'lettuce',         // xà lách
'romaine lettuce', // xà lách Romaine
'iceberg lettuce', // xà lách cuộn (iceberg)
'spinach',         // rau chân vịt/cải bó xôi
'water spinach',   // rau muống
'kale',            // cải xoăn
'arugula',         // rau arugula (xà lách rocket)
'bok choy',        // cải thìa
'broccoli',        // bông cải xanh
'cauliflower',     // súp lơ trắng
'bite-sized floret',// bông súp lơ (cắt nhỏ vừa ăn)
'florets',         // các nhánh/bông nhỏ (của súp lơ/bông cải)
'celery',          // cần tây
'asparagus',       // măng tây

// Hành, tỏi & các loại rau thơm (Alliums & Herbs)
'onion',           // hành tây
'yellow onion',    // hành tây vàng
'red onion',       // hành tây tím
'green onion',     // hành lá
'shallot',         // hành tím/hành hương
'leek',            // tỏi tây
'garlic',          // tỏi
'ginger',          // gừng
'coriander',       // rau mùi/ngò rí
'cilantro',        // rau mùi/ngò rí
'culantro',        // ngò gai/mùi tàu
'parsley',         // ngò tây (parsley)
'basil',           // húng quế
'rosemary',        // hương thảo
'thyme',           // cỏ xạ hương
'mint',            // bạc hà

'coleslaw',        // salad bắp cải
'riced cauliflower'// súp lơ trắng băm nhỏ (dạng hạt cơm)
];

const kVegetableOthers = [
  'ripe', // adjective (chín)
  'steaming', // gerund / verb (hấp)
  'juicing', // gerund / verb (ép nước)
];

const kVegetable = [
  ...kVegetableNouns.map((name) => ({
    name,
    category_name: 'Vegetable',
    color: '#ff5303',
    noun: true,
  })),
  ...kVegetableOthers.map((name) => ({
    name,
    category_name: 'Vegetable',
    color: '#54be76',
    noun: false,
  })),
];
