function decorateSeconds (seconds) {
  var minutes = Math.round((seconds - 30)/60);
  var remainingSeconds = seconds % 60;
  if (remainingSeconds < 10) {
    remainingSeconds = "0" + remainingSeconds;
  }
	if (seconds == 0) {
    clearInterval(decorateSeconds);
    $('.cellDepartsIn').html("Departing...");
  } else {
    seconds--;
  }
  return minutes + ":" + remainingSeconds;
}

function tickDepartsIn() {
  $('.cellDepartsIn').each(function () {
    var count = $(this).data('seconds');
    if (count != 0) {
      count --;
    };
    $(this).data('seconds', count);
    $(this).text(decorateSeconds(count));
  });
}

setInterval(function(){tickDepartsIn()},1000);