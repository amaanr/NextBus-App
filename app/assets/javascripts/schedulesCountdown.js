function makeMinSec (seconds) {
	var minutes = Math.round((seconds - 30)/60);
	var remainingSeconds = seconds % 60;
	if (remainingSeconds < 10) {
		remainingSeconds = "0" + remainingSeconds;
	}

	return minutes + ":" + remainingSeconds;
}

function countDepartsIn() {
	$('.cellDepartsIn').each(function () {
		var count = $(this).data('seconds');
		count --;
		$(this).data('seconds', count);
		$(this).text(makeMinSec(count));
	});
}