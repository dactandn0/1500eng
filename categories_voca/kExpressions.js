const kExpressions = [
    'step by step', // từ từ
    'face to face', // đối mặt
    'bit by bit', // từng chút một
    'one by one', // từng cái một
    'little by little', // từng chút một
    'hand in hand', // tay trong tay
    'more and more', // ngày càng nhiều
    'side by side', // bên cạnh nhau
    'again and again', // lần nữa và lần nữa
    'as long as', // miễn là
    'heart to heart', // trái tim đến trái tim
    'day after day', // ngày sau ngày
    'on and on', // tiếp tục
    'head to head', // đầu đến đầu
    'as well as', // cũng như
    'year after year', // năm sau năm
    'all in all', // nói chung
    'mouth to mouth', // hô hấp
    'shoulder to shoulder', // vai kề vai
    'end to end', // cuối đến cuối
    'over and over',       // lặp đi lặp lại
    'back and forth',      // qua lại
    'here and there',      // đây đó
    'now and then',        // thỉnh thoảng
    'time after time',     // hết lần này đến lần khác
    'from time to time',   // thỉnh thoảng
    'sooner or later',     // sớm hay muộn
    'more or less',        // gần như; xấp xỉ
    'give and take',       // sự nhường nhịn; cho và nhận
    'ups and downs',       // thăng trầm
    'pros and cons',       // ưu và nhược điểm
    'safe and sound',      // bình an vô sự
    'by and large',        // nhìn chung
    'far and wide',        // khắp nơi
    'in and out',          // ra vào
    'through and through', // hoàn toàn; từ trong ra ngoài
    'first and foremost',  // trước hết và quan trọng nhất
    'all over again',      // lại từ đầu
    'so far so good',      // cho đến giờ mọi thứ vẫn ổn
    'little or nothing',   // rất ít hoặc không có gì
    'more than ever',      // hơn bao giờ hết
    'once and for all',    // một lần dứt điểm
    'day in and day out',  // ngày này qua ngày khác
    'live and learn',      // sống và học hỏi từ kinh nghiệm
    'part and parcel',     // phần không thể thiếu
    'wear and tear',       // sự hao mòn
    'peace and quiet',     // sự yên bình và tĩnh lặng
    'black and white',     // đen trắng; rõ ràng
    'on and off',          // lúc có lúc không; không liên tục
    'round and round'      // vòng đi vòng lại
].map(name => {
    return {
        name: name,
        category_name: 'Expressions',
        color: '#7700ff',
        noun: true
    };
});