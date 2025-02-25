
// speechSynthesis.cancel() 
// in autioCtrl.js

const utter = new SpeechSynthesisUtterance();


function Text2Speech(word) 
{
	if (speechSynthesis.speaking)
	{
		speechSynthesis.cancel()
		if (word == utter.text) return;
	}

	utter.text = word;
	utter.pitch  = Helper_loadFloat(Helper_AudioPitchKey, 1);
	utter.rate  = Helper_loadFloat(Helper_AudioRateKey, 1);
	utter.volume  = 1;
	utter.lang='en-US';

	utter.addEventListener('end', (evt) => {
		const { charIndex, utterance } = evt
	})

	speechSynthesis.speak(utter);
}