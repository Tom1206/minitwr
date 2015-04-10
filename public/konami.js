var Konami = {};

Konami.table = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
Konami.I = 0;
Konami.cooldown = {};
Konami.onCodePerform = function(){};

document.getElementsByTagName('body')[0].addEventListener('keydown', function(event) {

	if (event.keyCode == Konami.table[Konami.I]) {
		if (Konami.cooldown) {
			clearTimeout(Konami.cooldown);
		}
		Konami.cooldown = setTimeout(function() {
			Konami.I = 0;
		}, 1000);
		if (Konami.I == 9) {
			Konami.onCodePerform();
		} else {
			Konami.I++;
		}
	} else {
		Konami.I = 0;
	}
});
