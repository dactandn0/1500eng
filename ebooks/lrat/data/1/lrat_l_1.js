let LRAT_DATA_L_1 = [
{
	track:"1.1"
	,en:"CLERK: Good morning, ma'am, and welcome to 'Australia's Moving Experience'! How can I help you?<br>\
WOMAN: Well, I... I hope you can help me. I'm so up in the air right now... I...<br>\
CLERK: Just calm down, now. Let me guess: you're moving and its has you a little confused.<br>\
WOMAN: That's it exactly. You see, I'm relocating to the United States next month and I'm having a hard time getting organised.<br>\
CLERK: Here, fill out your name and address, and let me ask you a few questions. Oh, what should I call you?<br>\
WOMAN: My name is Jane, Jane Bond.<br>\
CLERK: OK, Jane, first of all, what's your work phone number? In case I have any questions about things.<br>\
WOMAN: My work phone is 94635550. But please try not to call me too often there. My boss hates personal calls.<br>\
CLERK: So does mine, ma'am, so does mine. And what address should we ship your things to?<br>\
WOMAN: My new company is letting me stay temporarily at 509 Clark House, that's C-L-A-R-K, 1137 University Drive in Seattle.<br>\
CLERK: Seattle? Beautiful city, I hear. Mountains right beside the ocean, almost. Cooler than Australia, too. OK, and when should we come pack your things?<br>\
WOMAN: I guess that would be on Monday, March 11th.<br>\
CLERK: Do you want any help with an after-packing clean-up? We do that for a small additional charge. Packing<br>\
WOMAN: Yes, that would be helpful. I promised the landlord I'd give her the keys back by 5:00 pm. on Thursday, the 14th.<br>\
CLERK: Great, we'll just schedule the clean-up for that day. That way, the place will smell clean and there'll be no dust.<br>\
WOMAN: Well, you do think of everything! Oh, how much is this going to cost?<br>\
CLERK: Here is a list of our basic prices.<br>\
WOMAN: Oh dear, this seems rather expensive! getmom boo<br>\
CLERK: Yes ma'am, but you're paying for the best. We're careful and we're fast. Like we say, the only thing we break are speed records getting you moved.<br>\
WOMAN: Well... maybe that's so... Oh, I nearly forgot to tell you. I don't want my furniture shipped with me. I won't be look- ing for an apartment till after I arrive in America. Would it be possible to put my furniture in storage here for a month, then have it sent along later? <br>\
CLERK: Of course, we do that all the time. A couple of other things. Here at 'A Moving Experience', we try to pack your things logically. We don't just throw stuff in boxes.<br>\
CLERK: Do you have any special requests? You know, things you want packed in some special place, so you know where to find them?<br>\
WOMAN: Like what?<br>\
CLERK: Oh, I don't know... Things like dishes maybe. Not to be rude, but you look like a lady who likes to eat.<br>\
WOMAN: Ahhh! Yes, I need my dishes and things where I can find them quickly.<br>\
CLERK: Great. We'll put those dishes and cutlery in what we call the emergency pack. Can you think of anything else?<br>\
WOMAN: Ummm, I do have an antique tea kettle my great-grand- mother gave my mother. I wouldn't want to lose that. So I guess you'd better put that in storage with the furniture. <br>\
CLERK: Grandma's tea kettle with the furniture, got it! Say, how about things like your alarm clock? You don't want to miss your plane on the big day, right?<br>\
WOMAN: Well, you certainly think of everything! Yes, that's right. I'll 110 also need my alarm clock where I can find it.<br>\
CLERK: Fine, we'll put that in your personal package. And of course, we'll give you a list of where we pack everything. So, all you'll have to do on Thursday, the 14th is grab your luggage on your way out the door. Um, I couldn't help noticing the new CD player you're carrying. Is that a Samsung?<br>\
WOMAN: Why? Yes, it is. One of their best. Cost me nearly a hundred dollars, it did!<br>\
CLERK: Do you want to take special care of it? I mean it's brand new.<br>\
WOMAN: Take care of it, but nothing special. You can just put it in storage with the furniture.<br>\
CLERK: That looks like everything we need here. I guess you're all set.<br>\
WOMAN: That was certainly quick. Thank you, young man. This has been a most moving experience!"
}
]








function make_DATA () 
{
	let rrr = []
	for (var i = 1; i <= 1; i++) 
	{
		for (var j = 1; j <= 4; j++) 
		{
			const trackName = i + '.' + j

			var json = {
				track: trackName,
				en: '',
				images: [trackName],
			}

			let idx = LRAT_DATA_L_1.findIndex(ele => ele && ele.track == trackName);
			if (idx >= 0)
			{
				var findObj = LRAT_DATA_L_1[idx]
				json.en = findObj.en
				json.vi = findObj.vi || ''
				json.voca = findObj.voca || ''
				json.note = findObj.note || ''
				json.isTest = findObj.isTest || false

			}

			rrr.push(json)
		}
	}

	LRAT_DATA_L_1 = rrr;
}


make_DATA ()