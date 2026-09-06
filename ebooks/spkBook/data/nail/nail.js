const AMERICAN_NAIL_DATA = [{
		unit: 1
			//	,track:"1.06 - A6"
			,
		title: "Nail Tools",
		en: "\
- Hi, what service are we doing for you today? A full set or a refill?<br>\
- Could you please wash your hands with soap before we start?<br>\
- I'm going to trim your nails a bit. Is this length okay for you?<br>\
- Let me use the cuticle pusher to clean up your nail bed.<br>\
- Please put your hand into the LED lamp for 60 seconds to cure the gel.<br>\
- Does this drill bit feel too hot or uncomfortable on your nail?<br>\
- We'll use a smooth nail buffer to make the surface super shiny.<br>\
- Hi, welcome! Do you have an appointment today?<br>\
- What service would you like to get today?<br>\
- What service are you looking for today?<br>\
- Would you like your cuticles pushed back or cut?<br>\
- Are we doing a full set, a refill, or just a gel manicure?<br>\
- Please pick a color from the color book while you wait.<br>\
- Please wash your hands over there before we start.<br>\
- Do you want to keep this length or make it shorter?<br>\
- What shape do you prefer today? Square, coffin, almond, or oval?<br>\
- I will trim your nails a little bit first.<br>\
- I'll use the nail clipper to cut down the length.<br>\
- Let me use the nail file to shape your nails.<br>\
- Is this length okay for you, or shorter?<br>\
- I'm going to push back your cuticles now.<br>\
- I'll use the cuticle pusher to clean the nail bed.<br>\
- Let me trim the dead skin with the cuticle nipper.<br>\
- Does this hurt? Please let me know if it feels tender.<br>\
- I will gently buff your nails with this nail buffer.<br>\
- Let me sweep away the dust with a dust brush.<br>\
- We will put a nail tip on to extend your nail.<br>\
- I need to use the nail drill to smooth the surface.<br>\
- Is this drill bit too hot for you?<br>\
- I'll use tweezers to place these small rhinestones.<br>\
- I'll use an orangewood stick to clean the edges.<br>\
- Please put your hand into the LED lamp.<br>\
- Put your hand in the UV lamp for 60 seconds.<br>\
- Other hand, please.<br>\
- Relax your fingers, please don't stiffen your hand.<br>\
- Relax your hand, I will move it for you.<br>\
- We are all set! How do you like your nails?<br>\
- Before I attach the nail tip, I need to gently file the surface and sweep away the debris with a dust brush to prevent any air bubbles or lifting.<br>\
- If you prefer a completely customized shape without using plastic tips, I can fit a paper nail form underneath to sculpt a very natural hard-gel extension.<br>\
- Since your cuticles are quite sensitive today, I will carefully push them back first and only use the cuticle nipper on the dry, dead skin around the edges.<br>\
- I'm switching to a fine-grit carbide drill bit on my nail drill so I can smoothly blend the acrylic fill into your natural nail without damaging your nail bed.<br>\
- I recommend flash-curing this intricate design under the UV lamp for ten seconds first, then I'll use tweezers to place these delicate metallic charms precisely where you want them.<br>\
",
		voca: "Cuticle Pusher,Nail File,Nail Buffer,Cuticle Nipper,Nail Clipper,Nail Drill,LED Nail Lamp,Tweezers,Drill Bit",
		images: ["drill-bit", "nail-file", "CuticleNipper", "CuticlePusher", "Tweezers"]
	}, {
		unit: 2,
		title: "Nail Tools 2",
		en: "\
- I always apply dehydrator and primer before putting on any acrylic or gel. <br>\
- Before starting your set, I need to brush on dehydrator to remove moisture and prep your plate with primer so the product adheres without lifting. <br>\
- We use rubbing alcohol to sanitize your hands and wipe away the sticky residue. <br>\
- After curing the gel coat, I will wipe off the tacky inhibition layer with rubbing alcohol to leave a completely smooth, non-stick finish. <br>\
- Let me put on a thin base coat before we start painting the color. <br>\
- I will apply a high-adhesion base coat to protect your natural bed from staining and ensure your gel polish stays flawless for weeks. <br>\
- We need a glossy top coat to lock in the nail polish and make it shine. <br>\
- After finishing the art design, I will seal everything with a non-wipe top coat and cure it to give your set a scratch-resistant, mirror-like finish. <br>\
- Do you prefer regular nail polish or long-lasting gel polish today? <br>\
- If you want a quick-drying set that won't chip during daily activities, I highly recommend opting for gel polish over traditional lacquer. <br>\
- I will use a drop of nail glue to secure the extension tip to your natural nail. <br>\
- After sizing the plastic tips correctly, I'll apply a small drop of fast-drying nail glue to the well area and press it down firmly to eliminate air pockets. <br>\
- We mix acrylic powder and acrylic liquid to form the bead for your full set. <br>\
- By precisely dipping the brush into the monomer acrylic liquid and pick up the correct ratio of acrylic powder, I can sculpt a strong, balanced arch. <br>\
- We can use builder gel or hard gel if you want to strengthen your natural nails. <br>\
- For clients with weak, brittle plates, building an overlay with hard gel provides superior durability and structural support without requiring thick acrylic layers. <br>\
- We need pure acetone or nail polish remover to soak off your old set. <br>\
- Instead of using a standard non-acetone nail polish remover, we'll wrap your fingertips in cotton soaked with pure acetone to break down the hardened acrylic. <br>\
- Let me massage some cuticle oil around your fingers to hydrate your skin. <br>\
- To finish your service and restore moisture lost during the chemical process, I'll gently massage a rich cuticle oil into your surrounding skin folds. <br>\
- Can I have your other hand, please<br>\
- Is the water temperature okay for you?<br>\
- Do you want gel or regular polish?<br>\
- Please let me know if it hurts.<br>\
\
"
		//,images:["sos_2"]
	}, {
		unit: 3,
		title: "Nail Anatomy",
		en: "\
- Your natural nail is completely strong and healthy today.<br>\
- Inspecting the underlying nail plate allows me to ensure there is no thinning or damage before applying product.<br>\
- I will file the free edge to give your nail a clean shape.<br>\
- To prevent snagging, I need to smooth out the rough free edge and seal the keratin layers properly.<br>\
- Make sure not to clip too close to the nail bed.<br>\
- If product touches the soft tissue of the nail bed, it can cause lifting or skin irritation over time.<br>\
- I will gently push back the cuticle around your nail.<br>\
- We need to clean the proximal fold and remove dead cuticle tissue so the gel seals perfectly.<br>\
- Apply some oil to keep the skin around your nails soft.<br>\
- Dehydration can cause painful hangnails, so applying daily oil to the skin surrounding the plate is essential.<br>\
- Does it hurt when I press on your fingertip?<br>\
- Please rest the sensitive pad of your fingertip gently on the cushion so I can maintain control while filing.<br>\
- Your thumbnail grew out a bit longer than the rest.<br>\
- Because your thumbnail endures more stress during daily tasks, we should reinforce its arch with extra product.<br>\
- Do you also want a pedicure for your toenail today?<br>\
- Straightening the free margin of a curved toenail prevents ingrown edges from pressing into the lateral fold.<br>\
- Clean carefully along the sidewall to avoid any acrylic overflow.<br>\
- I'll run a fine tool along each lateral sidewall to clear excess product before it cures under the lamp.<br>\
\
"
	}, {
		unit: 4,
		title: "Shapes & Dimensions",
		en: "\
	- Which nail shape do you prefer for your new set today?<br>\
	- Choosing the right shape like almond or coffin helps elongate your fingers and creates a balanced look.<br>\
	- Is this short length okay, or do you want them medium or long?<br>\
	- If you work on a keyboard all day, I recommend keeping the length short to medium so they don't break.<br>\
	- We can make them extra long if you want a bold, dramatic style.<br>\
	- When extending to extra long length, we must build a stronger apex to support the added stress.<br>\
	- Do you like clean square edges or soft round corners?<br>\
	- A traditional square shape gives a sharp look, while a round shape is much lower maintenance.<br>\
	- An oval shape looks very natural on your hands.<br>\
	- Sculpting an oval shape naturally slims the appearance of wider nail beds.<br>\
	- Stiletto nails are super sharp and narrow at the tip.<br>\
	- Since stiletto tips come to a very sharp point, they require careful handling to avoid catching on clothing.<br>\
	- Coffin shape is one of our most requested styles right now.<br>\
	- A tapered coffin shape tapers inward towards the free edge and finishes with a flat, straight top.<br>\
	- Almond shape is great if you want something elegant and tapered.<br>\
	- We taper the sides into a soft, rounded peak to achieve that classic almond silhouette.<br>\
	- I will check the thickness of the acrylic to make sure it's not too bulky.<br>\
	- Controlling the thickness around the cuticle area ensures your enhancements look natural and grow out smoothly.\
	",
		images: ["nail_shapes"]
	}, {
		unit: 5,
		title: "Nail Gel",
		en: "\
	- Which shade of gel polish would you like to pick today?<br>\
	- Swatch this soft nude or neutral shade to see how nicely it complements your skin tone.<br>\
	- Do you want a glossy top coat or a sleek matte finish?<br>\
	- A glossy finish gives a clean, high-shine surface, whereas a matte top coat creates a modern, velvety look.<br>\
	- Adding a bit of glitter or chrome powder will make your set pop.<br>\
	- Applying a fine chrome powder over a cured non-wipe gel creates an incredible mirror-like reflection.<br>\
	- Classic Designs & Effects<br>\
	- A classic French tip is always an elegant choice for any occasion.<br>\
	- We can soft-blend the smile line if you prefer a subtle look over a stark white French tip.<br>\
	- An ombré gradient seamlessly fades one color into another.<br>\
	- Blending nude powder into white gel creates a flawless ombré transition from the cuticle to the tip.<br>\
	- Nail Art & Embellishments<br>\
	- Do you want simple hand-painted nail art or full 3D charms?<br>\
	- We can quickly apply delicate stickers or hand-paint custom line patterns to elevate your set.<br>\
	- Having an accent nail on each hand is a great way to try art without overdoing it.<br>\
	- Placing small rhinestones or gems on your ring finger creates a stunning focal accent nail.<br>\
	- We use thick gem gel to ensure those heavy rhinestones stay secured without snagging.\
	"
	}, {
		unit: 6,
		title: "Technical Actions",
		en: "\
	- I will trim and file your natural nails before we apply the product.<br>\
	- We need to soak your fingertips in warm water to soften the cuticle before we clean and shape the edges.<br>\
	- Let me remove the old set, repair that broken side, and reshape the tips to your liking.<br>\
	- After I paint the gel polish, please put your hand in the lamp so it can cure and dry completely.<br>\
	- I will apply a thin layer of builder gel to extend your length, then fill in the gap near the root.<br>\
	- We can shorten the length and buff the surface to make it smooth again.<br>\
	- <b>Client Comfort & Sensations</b><br>\
	- Please let me know if the temperature feels too hot, warm, or cold under the lamp.<br>\
	- I will be very gentle with the tool, but tell me right away if anything feels painful or uncomfortable.<br>\
	- Tell me if I am using too much pressure while filing your sensitive nails.<br>\
	- I will be careful around your skin so you feel relaxed and comfortable throughout the service.<br>\
	- Preferences & Comparisons<br>\
	- Do you prefer a simple, natural look, or do you want something more fancy today?<br>\
	- Would you like this shade to be a bit lighter or darker than the sample?<br>\
	- Let me know if you want the acrylic to be thinner or thicker near the apex.<br>\
	- Do you want this hand to look similar to the picture, or should we try a different color scheme?<br>\
	- Tell me if you want these middle fingers to be slightly shorter or longer to match the rest.\	"
	}, {
		unit: 7,
		title: "Comfort & Physical Sensations",
		en: "\
	- Are you feeling comfortable with the chair height and armrest position?<br>\
	- Please speak up if the friction from the e-file feels uncomfortable or slightly painful on your skin.<br>\
	- Since your nail beds are very sensitive, I will use a gentle touch and reduce the drill speed.<br>\
	- Let me know if I am applying too much pressure while pushing back your cuticles.<br>\
	- Does the water temperature feel warm, hot, or cold for your foot soak?<br>\
	- I will be extremely careful around that small cut near your sidewall so it does not sting.<br>\
	- Style & Aesthetic Preferences<br>\
	- Most clients prefer a natural finish that blends seamlessly with their real nails.<br>\
	- Do you want to keep the design clean and simple, or are you looking for a fancy set with glitter and stones?<br>\
	- This shade is very similar to your previous choice, but we can try a completely different hue if you want a change.<br>\
	- Adjustments & Comparisons<br>\
	- Should I make these index fingers slightly shorter, or do you prefer them a bit longer to match your middle fingers?<br>\
	- We can apply one more coat if you want the polish to look darker, or leave it as is if you like it lighter.<br>\
	- I can lay the acrylic a bit thinner at the edges or build it thicker in the middle for extra structure.\
	"
	}, {
		unit: 8,
		title: "Small Talk",
		en: "\
	Hỏi thăm chung & Thời tiết<br>\
	<br>\
	How's your day going so far?<br>\
	Tech: How's your day going so far?<br>\
	Client: Pretty good, just running a few errands before coming here.<br>\
	Tech: How's your day going so far?<br>\
	Client: It's been super busy at work, so I'm glad to finally sit down and relax.<br>\
	<br>\
	Do you have any fun plans for the weekend?<br>\
	Tech: Do you have any fun plans for the weekend?<br>\
	Client: Yes, we're going camping up in the mountains.<br>\
	Tech: Do you have any fun plans for the weekend?<br>\
	Client: Not really, just planning to catch up on sleep.<br>\
	<br>\
	It's getting pretty warm/cold outside, isn't it?<br>\
	Tech: It's getting pretty warm outside, isn't it?<br>\
	Client: I know, I had to turn the AC on in my car today!<br>\
	Tech: It's getting pretty cold outside, isn't it?<br>\
	Client: Yes! I heard it might rain tomorrow too.<br>\
	<br>\
	Hỏi về Công việc & Gia đình<br>\
	<br>\
	Are you taking a break from work today?<br>\
	Tech: Are you taking a break from work today?<br>\
	Client: Yeah, I took an early lunch break to get my nails done.<br>\
	Tech: Are you taking a break from work today?<br>\
	Client: Actually, today is my day off!<br>\
	<br>\
	Any big plans for the upcoming holidays?<br>\
	Tech: Any big plans for the upcoming holidays?<br>\
	Client: We're flying out to Texas to visit family.<br>\
	Tech: Any big plans for the upcoming holidays?<br>\
	Client: Just hosting a small dinner party at home.<br>\
	<br>\
	Do you have kids?<br>\
	Tech: Do you have kids?<br>\
	Client: Yes, I have two boys, five and seven years old.<br>\
	Tech: Do you have kids?<br>\
	Client: No kids yet, just two very spoiled dogs!<br>\
	<br>\
	Khen ngợi khách<br>\
	<br>\
	I love your outfit / purse / shoes!<br>\
	Tech: I love your purse! Where did you get it?<br>\
	Client: Thank you so much! I actually found it on sale at Target.<br>\
	Tech: I love your shoes!<br>\
	Client: Thanks! They're super comfortable for work.<br>\
	<br>\
	This color matches your skin tone so well!<br>\
	Tech: This color matches your skin tone so well!<br>\
	Client: Really? I was worried it might look too bright!<br>\
	Tech: This color matches your skin tone so well!<br>\
	Client: Thank you, I'm so glad I decided to try something new.<br>\
	<br>\
	You have such pretty natural nails.<br>\
	Tech: You have such pretty natural nails.<br>\
	Client: Thank you! I've been taking cuticle oil seriously lately.<br>\
	Tech: You have such pretty natural nails.<br>\
	Client: Thanks, they used to break all the time before I started using strengthener.<br>\
	<br>\
	II. Xử lý sự cố & Khiếu nại<br>\
	<br>\
	Khi khách phàn nàn về Mẫu/Màu<br>\
	<br>\
	If you don't like this shade, we can switch to another one right now.<br>\
	Tech: If you don't like this shade, we can switch to another one right now.<br>\
	Client: Yes please, this pink looks a bit too dark on my hands.<br>\
	Tech: If you don't like this shade, we can switch to another one right now.<br>\
	Client: Thank you, I think I want something a bit more nude instead.<br>\
	<br>\
	Let me know if you'd like to adjust the shape before I polish.<br>\
	Tech: Let me know if you'd like to adjust the shape before I polish.<br>\
	Client: Could you make the corners a little more rounded?<br>\
	Tech: Let me know if you'd like to adjust the shape before I polish.<br>\
	Client: They look great just like this, thank you!<br>\
	<br>\
	I can fix that for you right away. No worries!<br>\
	Tech: I can fix that for you right away. No worries!<br>\
	Client: Thanks, I accidentally smudged my index finger on my purse.<br>\
	Tech: I can fix that for you right away. No worries!<br>\
	Client: Appreciate it, I just noticed this side is a bit uneven.<br>\
	<br>\
	Khi làm rát/đau hoặc chảy máu<br>\
	<br>\
	Ouch, I'm so sorry! Did that hurt?<br>\
	Tech: Ouch, I'm so sorry! Did that hurt?<br>\
	Client: A little bit, my cuticles are really sensitive today.<br>\
	Tech: Ouch, I'm so sorry! Did that hurt?<br>\
	Client: It's okay, just caught me by surprise.<br>\
	<br>\
	Let me put some antiseptic on it to make sure it's clean.<br>\
	Tech: Let me put some antiseptic on it to make sure it's clean.<br>\
	Client: Okay, thank you for checking.<br>\
	Tech: Let me put some antiseptic on it to make sure it's clean.<br>\
	Client: Thanks, it doesn't sting too bad.<br>\
	<br>\
	I'll be extra gentle around this area.<br>\
	Tech: I'll be extra gentle around this area.<br>\
	Client: Thank you, I appreciate that.<br>\
	Tech: I'll be extra gentle around this area.<br>\
	Client: Sounds good, thank you so much.<br>\
	<br>\
	Khi móng bị hỏng sau đó<br>\
	<br>\
	I'm sorry to hear that. Let me fix that nail for you right now.<br>\
	Tech: I'm sorry to hear that. Let me fix that nail for you right now.<br>\
	Client: Thank you, I chipped it while opening a box at work.<br>\
	Tech: I'm sorry to hear that. Let me fix that nail for you right now.<br>\
	Client: Awesome, I really appreciate you squeezing me in.<br>\
	<br>\
	Since it broke within 3 days, there's no charge for the fix.<br>\
	Tech: Since it broke within 3 days, there's no charge for the fix.<br>\
	Client: Oh, that's so nice of you! Thank you!<br>\
	Tech: Since it broke within 3 days, there's no charge for the fix.<br>\
	Client: Wow, great customer service, thank you so much!<br>\
	<br>\
	Khi khách chê đắt hoặc thắc mắc về giá cả<br>\
	<br>\
	The base price is $40, but since you added gel polish and nail art, it's an extra $15.<br>\
	Tech: The base price is $40, but since you added gel polish and nail art, it's an extra $15.<br>\
	Client: Ah, I see! That makes sense.<br>\
	Tech: The base price is $40, but since you added gel polish and nail art, it's an extra $15.<br>\
	Client: Got it, thanks for explaining the breakdown!<br>\
	<br>\
	I completely understand. Here is our menu with all the prices listed.<br>\
	Tech: I completely understand. Here is our menu with all the prices listed.<br>\
	Client: Okay, let me take a look before we decide on the service.<br>\
	Tech: I completely understand. Here is our menu with all the prices listed.<br>\
	Client: Thanks, I just wanted to make sure I knew the total beforehand.<br>\
	"
	}, {
		title: "Small Talk 2",
		en: "\
	Du lịch & Kỳ nghỉ (Travel & Vacation)<br>\
	<br>\
	How do you like the weather in Da Nang City?<br>\
	Tech: How do you like the weather in Miami?<br>\
	Client: It's amazing! So much warmer than back home in New York.<br>\
	<br>\
	Are you going anywhere nice for the holidays?<br>\
	Tech: Are you going anywhere nice for the holidays?<br>\
	Client: Yes, we're taking a family trip to Hawaii next week!<br>\
	<br>\
	Is this set for a special occasion or just self-care?<br>\
	Tech: Is this set for a special occasion or just self-care?<br>\
	Client: I'm getting married this Saturday, so these are my wedding nails!<br>\
	<br>\
	Ăn uống & Giải trí (Food, Movies & Shows)<br>\
	<br>\
	Have you tried that new restaurant down the street?<br>\
	Tech: Have you tried that new restaurant down the street?<br>\
	Client: Not yet, but I've heard their tacos are incredible!<br>\
	<br>\
	Have you watched any good shows on Netflix lately?<br>\
	Tech: Have you watched any good shows on Netflix lately?<br>\
	Client: Oh, I just binged the new season of Stranger Things last night!<br>\
	<br>\
	Do you have any recommendations for good coffee around here?<br>\
	Tech: Do you have any recommendations for good coffee around here?<br>\
	Client: Definitely check out the local cafe across the block, their lattes are great.<br>\
	<br>\
	Mẫu móng & Xu hướng (Nail Trends & Inspo)<br>\
	<br>\
	Did you bring a reference picture or do you want to choose from our book?<br>\
	Tech: Did you bring a reference picture or do you want to choose from our book?<br>\
	Client: I found this cute design on Pinterest, can you do something like this?<br>\
	<br>\
	Have you ever tried Chrome powder / Cat-eye before?<br>\
	Tech: Have you ever tried Chrome powder before?<br>\
	Client: No, I haven't! How does it work?<br>\
	<br>\
	Are you feeling a bold color today or keeping it natural?<br>\
	Tech: Are you feeling a bold color today or keeping it natural?<br>\
	Client: I think I want to try a bright red this time!<br>\
	<br>\
	Chăm sóc móng & Tư vấn (Nail Care & Advice)<br>\
	<br>\
	Do your nails usually grow fast?<br>\
	Tech: Do your nails usually grow fast?<br>\
	Client: Yes, they grow like crazy! I have to come back every two weeks.<br>\
	<br>\
	Have you ever tried Dip Powder instead of Acrylic?<br>\
	Tech: Have you ever tried Dip Powder instead of Acrylic?<br>\
	Client: No, what's the difference between the two?<br>\
	<br>\
	Do you use cuticle oil at home?<br>\
	Tech: Do you use cuticle oil at home?<br>\
	Client: I always forget! I should probably start using it more often.<br>\
	<br>\
	Thói quen & Tương tác cá nhân (Personal Habits)<br>\
	<br>\
	Are you right-handed or left-handed?<br>\
	Tech: Are you right-handed or left-handed?<br>\
	Client: I'm right-handed, so this hand gets beaten up a lot more!<br>\
	<br>\
	Do you usually get both Mani and Pedi together?<br>\
	Tech: Do you usually get both Mani and Pedi together?<br>\
	Client: Yeah, I love getting the combo so I can just relax for an hour.<br>\
	<br>\
	How often do you usually get your nails done?<br>\
	Tech: How often do you usually get your nails done?<br>\
	Client: Every three weeks, it's my favorite way to treat myself.<br>\
	<br>\
	Nhắc nhở an toàn & Hướng dẫn (In-process Instructions)<br>\
	<br>\
	Could you relax your fingers a little bit for me?<br>\
	Tech: Could you relax your fingers a little bit for me?<br>\
	Client: Oh, sorry! I didn't realize I was holding them so stiff.<br>\
	<br>\
	Please keep your hand flat inside the lamp.<br>\
	Tech: Please keep your hand flat inside the lamp.<br>\
	Client: Got it, am I putting it in far enough?<br>\
	<br>\
	Be careful with your phone while the polish is drying!<br>\
	Tech: Be careful with your phone while the polish is drying!<br>\
	Client: Thanks for the warning, I almost smudged it!<br>\
	"
	}, {
		title: "Texas",
		en: "\
	Talk about Texas, and the first thing people will tell you is, 'Everything is bigger in Texas' From the massive portion sizes of slow-smoked BBQ and giant pickup trucks cruising down the highways, to the endless open skies and the warm, larger-than-life hospitality of the locals, this state truly lives up to its legendary reputation.<br>\
	Texas is the second-largest state in the US, right after Alaska. If you enjoy sunny weather and want to avoid brutal, freezing winters, Texas is a fantastic place to be. Land here feels infinite, and because the cost of living and tax setup are much more forgiving compared to California or New York, people have been moving here in droves—especially tight-knit Asian and Vietnamese communities looking for a great quality of life.<br>\
	When it comes to Texas, you simply can't skip Houston—the absolute beating heart of the state and the fourth-largest city in America. Walking into Houston as a newcomer, you immediately feel a sense of comfort because the diversity is palpable, and the Vietnamese community here is massive, vibrant, and incredibly welcoming.<br>\
	Areas like Bellaire Boulevard and the Chợ Bến Thành commercial districts feel almost like stepping right back into Vietnam. Rows upon rows of authentic restaurants line the streets—serving everything from steaming bowls of Pho, Bun Bo Hue, and crispy Banh Mi to late-night street food, boba, and traditional desserts. Need a doctor, an accountant, a real estate agent, or a nail salon supply store? You can easily find someone who speaks fluent Vietnamese to help you out from A to Z.<br>\
	Economically, Houston is a powerhouse. It is world-renowned as the 'Energy Capital of the World' due to its booming oil and gas industry. On top of that, it houses NASA’s famous Johnson Space Center—where space missions are managed—and the Texas Medical Center, which is the largest medical complex in the world.<br>\
	Because the economy is so diverse, job opportunities are everywhere. Whether you work in healthcare, engineering, run a small business, or build a career in the nail and service industry, Houston offers plenty of room to thrive and achieve your financial goals.<br>\
	Another huge perk of living in Houston is its mind-blowing food scene. Thanks to its multicultural mix of residents, the city is a haven for foodies. You can't live here without trying authentic Tex-Mex (think sizzling fajitas and cheesy enchiladas) or the famous Viet-Cajun Crawfish—a mouthwatering fusion of Louisiana Cajun spices and rich garlic butter created by local Vietnamese chefs that took the entire country by storm.<br>\
	Of course, no city is completely perfect. Houston summers can get quite hot and humid, and the area occasionally deals with hurricane season. Also, because the city is so spread out, having a car is an absolute necessity—driving 20 to 30 minutes to get anywhere is completely normal day-to-day routine here.<br>\
	Overall, Houston and Texas as a whole represent a true land of opportunity: friendly neighbors, strong economic stability, incredible food, and a warm, supportive community that makes living abroad feel remarkably like home.\
	"
	}, {
		title: " Texas 2",
		en: "\
	Cost of Living & Housing in Houston, Texas<br>\
	\
	Houston is famous for offering a big-city lifestyle at a fraction of the cost of other major US hubs like Los Angeles, San Francisco, or New York.<br>\
	No State Income Tax: Texas is one of nine US states with no state income tax, meaning you keep more of your paycheck.<br>\
	Housing & Rent: Housing is generally far more affordable than the national average.<br>\
	Renting: A nice 1-bedroom apartment ranges from $1,100 to $1,500/month depending on the neighborhood, while 2-bedroom units run around $1,400 to $1,900/month.<br>\
	Buying: The median home price in Greater Houston sits around $320,000–$350,000, making homeownership achievable much earlier.<br>\
	Utilities & Groceries: Electricity costs can spike during summer due to air conditioning, averaging $150–$250/month. Groceries are very reasonably priced, especially with large Asian markets (like H Mart and Hong Kong City Market) keeping competitive prices on fresh produce.<br>\
	Essential Phrases for Driving & Getting Around Texas<br>\
	Because Houston is massive (spanning over 600 square miles), owning a vehicle and knowing how to navigate the roads is essential.<br>\
	\
	On the Road & Traffic<br>\
	\
	Rush hour / Peak hours: Traffic is always brutal on I-10 during evening rush hour.<br>\
	\
	Feeder road / Frontage road: Take the feeder road right after you pass the exit.<br>\
	\
	Merge: Signal left and merge onto the highway when it's safe.<br>\
	\
	Toll road / Tollway: If you take the tollway, you'll save about twenty minutes.<br>\
	\
	EZ TAG / Toll pass: Make sure your EZ TAG is mounted on the windshield.<br>\
	\
	Bumper-to-bumper: It’s bumper-to-bumper all the way to downtown.<br>\
	\
	Gridlock: The accident caused total gridlock on the Beltway.<br>\
	\
	Pothole: Watch out for that huge pothole near the right lane!<br>\
	\
	Tailgating: Stop tailgating me, there's a red light right ahead!<br>\
	\
	Carpool lane / HOV lane: We have three people in the car, so we can use the HOV lane.<br>\
	\
	Speed trap: Slow down, there’s usually a speed trap right under this overpass.<br>\
	\
	Detour: Follow the detour signs because the main bridge is closed.<br>\
	\
	Cut off: That guy completely cut me off without using his blinker!<br>\
	\
	Blinker / Turn signal: Don't forget to put your blinker on before turning.<br>\
	\
	Pull over: The police officer signaled me to pull over to the side of the road.<br>\
	\
	Car Maintenance & Gas Station<br>\
	\
	Fill it up: Fill it up with regular gas, please.<br>\
	\
	Pump number: Twenty dollars on pump number four, please.<br>\
	\
	Unleaded / Premium: Does your car take unleaded or premium gas?<br>\
	\
	Oil change: My car is due for an oil change at 5,000 miles.<br>\
	\
	Tire pressure / PSI: Check the tire pressure before we start our road trip.<br>\
	\
	Flat tire / Spare tire: I got a flat tire on the way home and had to put on the spare.<br>\
	\
	Jump-start / Jumper cables: My battery died, do you have jumper cables to give me a jump-start?<br>\
	\
	Brake pads: The mechanic said my brake pads need to be replaced soon.<br>\
	\
	Windshield wiper fluid: Topping off the windshield wiper fluid only takes a minute.<br>\
	\
	Check engine light: My check engine light came on this morning, so I need to bring it to the shop.<br>\
	\
	Alignment: The steering wheel shakes a bit, so I think the car needs an alignment.<br>\
	\
	Inspection sticker: I need to get my annual state inspection sticker renewed this month.<br>\
	\
	Tow truck: The car broke down on the shoulder, so we called a tow truck.<br>\
	\
	Car wash / Detailing: I'm going to take the car to the shop for a full interior detailing.<br>\
	\
	Radiator coolant: Make sure the radiator coolant level is full before summer hits.<br>\
	\
	Market & Grocery Store<br>\
	\
	Aisle: Where can I find the olive oil? Which aisle is it in?<br>\
	\
	Produce section: The fresh fruits and vegetables are over in the produce section.<br>\
	\
	Deli counter: I need to get a pound of sliced turkey from the deli counter.<br>\
	\
	Bakery: They bake fresh bread every morning in the bakery department.<br>\
	\
	Seafood counter: Is the salmon at the seafood counter wild-caught or farm-raised?<br>\
	\
	Express lane: You have less than ten items, so you can use the express lane.<br>\
	\
	Self-checkout: The self-checkout line is moving much faster today.<br>\
	\
	Checkout lane / Register: Please line up at register number three.<br>\
	\
	Paper or plastic?: Will you be needing paper or plastic bags today?<br>\
	\
	Cart / Trolley: Grab a shopping cart at the entrance before going in.<br>\
	\
	Basket: I only need a few items, so a hand basket is fine.<br>\
	\
	On sale / Clearance: These strawberries are on sale for buy-one-get-one-free.<br>\
	\
	Expiration date / Best-by date: Always check the expiration date on the milk carton.<br>\
	\
	Coupons / Rewards card: Do you have our store rewards card or any digital coupons?<br>\
	\
	Restock: They are currently restocking the shelves, so check back shortly.<br>\
	\
	Hospital & Medical Clinic<br>\
	\
	Emergency Room (ER): He had sharp chest pain, so we rushed him straight to the ER.<br>\
	\
	Urgent Care: It’s not a major emergency, so let’s just go to Urgent Care instead.<br>\
	\
	Appointment: I made an appointment with my primary doctor for a checkup.<br>\
	\
	Co-pay: How much is the co-pay for a specialist visit with my insurance?<br>\
	\
	Health insurance card: Please present your photo ID and health insurance card at the front desk.<br>\
	\
	Pharmacy / Prescription: I need to pick up my prescription from the CVS pharmacy.<br>\
	\
	Over-the-counter (OTC): You don't need a prescription for that painkiller; it's available over-the-counter.<br>\
	\
	Symptoms: What symptoms are you experiencing, and when did they start?<br>\
	\
	Allergies: Are you allergic to penicillin or any other medications?<br>\
	\
	Triage / Vitals: The nurse will check your vitals and blood pressure first.<br>\
	\
	X-ray / MRI: The doctor ordered an X-ray to see if the bone is broken.<br>\
	\
	Stitches: The cut on his hand was deep, so he needed five stitches.<br>\
	\
	Refill: I called the clinic to request a refill on my blood pressure medication.<br>\
	\
	Outpatient / Inpatient: It’s an outpatient procedure, so you can go home the same afternoon.<br>\
	\
	Medical history: Please fill out this paperwork regarding your personal medical history.<br>\
	\
	Street & Navigation<br>\
	\
	Intersection: Turn right at the next major intersection after the gas station.<br>\
	\
	Crosswalk: Pedestrians always have the right of way at the crosswalk.<br>\
	\
	Sidewalk: Make sure the kids stay on the sidewalk and off the street.<br>\
	\
	Traffic light / Stoplight: The traffic light turned red just as I reached the line.<br>\
	\
	Stop sign: You must come to a complete stop at every stop sign.<br>\
	\
	Dead end: Don't turn down that street; it's a dead end.<br>\
	\
	One-way street: Be careful, you are driving the wrong way down a one-way street!<br>\
	\
	Alleyway / Alley: The trash cans are located in the alleyway behind the building.<br>\
	\
	Block: Walk straight for two blocks, then take a left.<br>\
	\
	Speed limit: The speed limit in this residential neighborhood is 25 miles per hour.<br>\
	\
	Yield: You need to yield to oncoming traffic when entering the roundabout.<br>\
	\
	Underpass / Overpass: Drive under the overpass and stay in the middle lane.<br>\
	\
	Landmark: The large water tower is a great landmark to help you find the house.<br>\
	\
	Parallel parking: I had to do parallel parking between two huge pickup trucks.<br>\
	\
	Parking garage / Parking lot: Park your car in the multi-story parking garage across the street.<br>\
	"
	}


]