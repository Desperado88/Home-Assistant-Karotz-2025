/*
 * OpenKarotz controller web application.
 *
 * Requires:
 * - jQuery 1.10+
 * - FancyBox 2.1.5+
 * - Bootstrap 3.0+
 * - OpenKarotz-js 0.4+
 */

// Config to be loaded from /config.json
var config;

// Necessary for Nodeclipse warnings
var OpenKarotz, $, document;

// OpenKartoz instance
var K;

// GUI elements
var kontrolTab = $("#kontrol");
var photosTab = $("#photos");
var radioTab = $("#radio");
var storyTab = $("#story");
var stateTab = $("#state");
var halloweenTab = $("#halloween");
var xmasTab = $("#xmas");

var alertPanel = $("#alert");
var ledsPanel = $("#ledspanel");
var earsPanel = $("#earspanel");
var radioPanel = $("#radioaccordion");
var storyPanel = $("#storyaccordion");

var wakeupButton = $("#wakeupbutton");
var sleepButton = $("#sleepbutton");
var ttsSpeakButton = $("#ttsspeakbutton");

/*
 * Utilities
 */

function showAlert(message) {
	$("#alert-msg").html(message);
	alertPanel.slideDown(200).delay(3000).slideUp(200);
	console.log("showAlert: " + message);
}

function dismissAlert() {
	alertPanel.hide();
}

function updateKarotzInfo() {
	$("#ok-info-version").html(K.getState().version);
	$("#ok-info-ethmac").html(K.getState().eth_mac);
	$("#ok-info-wlanmac").html(K.getState().wlan_mac);

	var freemem = K.getState().karotz_free_space;
	$('#ok-info-intfreemem').html((freemem === "-1") ? 'n/a' : freemem);
	var usedpc = K.getState().karotz_percent_used_space;
	if (usedpc) {
		$('#ok-info-intfreemem-bar').attr('aria-valuenow' , usedpc);
		$('#ok-info-intfreemem-bar').attr('style', 'width: ' + usedpc + '%');
		$('#ok-info-intfreemem-rr').html(usedpc + '%');
	}

	freemem = K.getState().usb_free_space;
	$("#ok-info-usbfreemem").html((freemem === "-1") ? 'n/a' : freemem);
	usedpc = K.getState().usb_percent_used_space;
	if (usedpc) {
		$('#ok-info-usbfreemem-bar').attr('aria-valuenow' , usedpc);
		$('#ok-info-usbfreemem-bar').attr('style', 'width: ' + usedpc + '%');
		$('#ok-info-usbfreemem-rr').html(usedpc + '%');
	}
}

function updateSleepState() {
	if (K.getState().sleep === 0 || K.getState().sleep === "0") {
		// Awake, actions possible
		wakeupButton.addClass("disabled");
		sleepButton.removeClass("disabled");

		$("#a-leds .btn").removeClass("disabled");
		$("#a-ears .btn").removeClass("disabled");
		ttsSpeakButton.removeClass("disabled");
		$("#a-moods .btn").removeClass("disabled");
		$(".moodlist > li").show();

		$(".radiolist > li > .btn").removeClass("disabled");
		$(".storylist > li").show();
	} else {
		// Sleeping, no action possible
		wakeupButton.removeClass("disabled");
		sleepButton.addClass("disabled");

		$("#a-leds .btn").addClass("disabled");
		$("#a-ears .btn").addClass("disabled");
		ttsSpeakButton.addClass("disabled");
		$("#a-moods .btn").addClass("disabled");
		$(".moodlist > li").hide();

		$(".radiolist > li > .btn").addClass("disabled");
		$(".storylist > li").hide();
	}
}


/*
 * Karotz specific methods
 */

function kStatus() {
	K.status(function(result) {
		updateSleepState();
		updateKarotzInfo();
	}, function(message) {
		showAlert(message);
	});
}

function kSleep() {
	K.sleep(function(result) {
		kStatus();
	}, function(msg) {
		showAlert(msg);
	});
}

function kWakeUp() {
	K.wakeup(true, function(result) {
		kStatus();
	}, function(msg) {
		showAlert(msg);
	});
}

function kReboot() {
	K.reboot(function(result) {
		kStatus();
	}, function(msg) {
		showAlert(msg);
	});
}

function kClearCache() {
	K.clearCache(null, function(msg) {
		showAlert(msg);
	});
}

function kSoundPause() {
	K.soundControlPause(null, function(msg) {
		showAlert(msg);
	});
}

function kSoundStop() {
	K.soundControlQuit(null, function(msg) {
		showAlert(msg);
	});
}

function kSoundUrl(url) {
	K.sound(url, null, function(msg) {
		showAlert(msg);
	});
}

function kLedFixed(color) {
	K.ledsFixed(color, null, function(msg) {
		showAlert(msg);
	});
}

function kLedPulse(color) {
	K.ledsPulse(color, null, function(msg) {
		showAlert(msg);
	});
}

function kEars(left, right) {
	K.ears(left, right, true, null, function(msg) {
		showAlert(msg);
	});
}

function kEarsReset() {
	K.earsReset(null, function(msg) {
		showAlert(msg);
	});
}

function kEarsRandom() {
	K.earsRandom(function(result) {
		// showAlert('Position: ' + result.left + '/' + result.right);
	}, function(msg) {
		showAlert(msg);
	});
}

function kSpeak(text) {
	K.tts(text, config.karotz.voice, true, null, function(msg) {
		showAlert(msg);
	});
}

function loadSnapshots() {
	K.snapshotList(function(data) {
		var html = '';
		$.each(data.snapshots, function(index, snapshot) {
			var filename = snapshot.id;
			html += '<li>';
			html += '<a href="' + K.getSnapshotUrl(filename) + '" title="' + filename + '" class="fancybox-thumb fancybox.image" rel="fancybox-thumb">';
			html += '<img class="snapshot" src="' + K.getSnapshotThumbnailUrl(filename) + '" alt="' + filename + '">';
			html += '</a>';
			html += '</li>';
		});

		$("#snapshotlist").html(html);
	});
}

function kSnapshot() {
	$.fancybox({
		href : 'lib/fancybox/fancybox_loading@2x.gif',
		title : 'Capture',
		autoSize: true,
		closeBtn : false,
		beforeShow : function() {
			$(".fancybox-skin").css("display", "none");
			$.fancybox.showLoading();
		}
	});

	K.snapshot(true, function(result) {
		$('#a-snaplist').collapse('hide');
		$('#a-snapshot').collapse('show');

		$("#snapshotlink").fancybox();
		$("#snapshotimg").attr("src", K.getSnapshotUrl(result.thumb));
		$("#snapshotlink").attr("href", K.getSnapshotUrl(result.filename));
		$.fancybox.hideLoading();
		$.fancybox.close();

		// Refresh snapshot list
		//loadSnapshots();
	}, function(msg) {
		showAlert(msg);
	});
}

function loadSnapshots() {
	K.snapshotList(function(data) {
		var html = '';
		$.each(data.snapshots, function(index, snapshot) {
			var filename = snapshot.id;
			html += '<li>';
			html += '<a href="' + K.getSnapshotUrl(filename) + '" title="' + filename + '" class="fancybox-thumb fancybox.image" rel="fancybox-thumb">';
			html += '<img class="snapshot" src="' + K.getSnapshotThumbnailUrl(filename) + '" alt="' + filename + '">';
			html += '</a>';
			html += '</li>';
		});

		$("#snapshotlist").html(html);
	});
}

function kClearSnapshots() {
	K.clearSnapshots(function(result) {
		loadSnapshots();
	}, function(msg) {
		showAlert(msg);
	});
}

function loadMoods() {
	K.moodsList(function(data) {
		var html = '';
		html += '<ul class="moodlist">';
		$.each(data.moods, function(index, mood) {
			html += '<li>';
			html += '<a href="javascript:;" onclick="kMoods(' + mood.id + ')">';
			html += mood.text + '</a>';
			html += '</li>';
		});
		html += '</ul>';

		$("#moodlist").html(html);
	});
}

function kMoods(id) {
	K.moods(id, null, function(msg) {
		showAlert(msg);
	});
}


/*
 * Data loading (JSON)
 */

function loadConfig(callback) {
	$.getJSON('./config.json', function(data) {
		config = data;
		console.log('Configuration file loaded: config.json');
		console.log(data);
		console.log('config.karotz.name: ' + config.karotz.name);
		console.log('config.karotz.host: ' + config.karotz.host);
		console.log('config.karotz.voice: ' + config.karotz.voice);

		if (callback) {
			callback();
		}
	});
}

function loadColors() {
	$.getJSON('./data/colors.json', function(data) {
		var html = '';

		$.each(data.colors, function(index, color) {
			html += '<div class="btn color_square" ';
			html += 'style="background-color: #' + color.code + '" ';
			html += 'onclick="kLedPulse(\'' + (color.real ? color.real : color.code) + '\');">';
			html += '</div>';
		});
		ledsPanel.html(html);
	});
}

function loadEarPositions() {
	var html = '';
	for (var i = 1; i <= 16; i++) {
		html += '<button class="btn btn-info earbtn" ';
		html += 'onclick="kEars(' + i + ',' + i + ');">';
		html += i + '</button>';
	}
	earsPanel.html(html);
}

function loadRadios() {
	$.getJSON('./data/radios.json', function(data) {
		var html = '';
		var first = true;

		$.each(data, function(catid, category) {

			html += '<div class="panel panel-default">';
			html += '<div class="panel-heading">';
			html += '<h4 class="panel-title">';
			html += '<a class="accordion-toggle" data-toggle="collapse" data-parent="#radioaccordion" href="#a-' + catid + '">';
			html += category.name;
			html += '</a>';
			html += '</h4>';
			html += '</div>';
			html += '<div id="a-' + catid + '" class="panel-collapse collapse' + (first === true ? ' in' : '') + '">';
			html += '<div class="panel-body">';
			first = false;

			html += '<ul class="list-inline radiolist">';
			$.each(category.radios, function(index, radio) {
				html += '<li>';
				html += '<button class="btn btn-default btn-lg radiobtn ' + radio.id;
				html += '" onclick="kSoundUrl(';
				html += "'" + radio.url + "')";
				html += '">';
				if (radio.logo) {
					html += '<img class="radiologo" src="' + radio.logo + '"/>';
				} else {
					html += radio.name;
				}
				html += '</button>';
				html += '</li>';
			});
			html += '</ul>';
			html += '</div></div></div>';

		});
		radioPanel.html(html);
	});
}

function loadStories() {
	$.getJSON('./data/stories.json', function(data) {
		var html = '';
		var first = false; // All sections closed

		$.each(data, function(catid, category) {

			html += '<div class="panel panel-default">';
			html += '<div class="panel-heading">';
			html += '<h4 class="panel-title">';
			html += '<a class="accordion-toggle" data-toggle="collapse" data-parent="#storyaccordion" href="#a-' + catid + '">';
			html += category.name;
			html += '</a>';
			html += '</h4>';
			html += '</div>';
			html += '<div id="a-' + catid + '" class="panel-collapse collapse' + (first === true ? ' in' : '') + '">';
			html += '<div class="panel-body">';
			//first = false;

			html += '<ul class="list-unstyled storylist">';
			$.each(category.stories, function(index, story) {
				html += '<li>';
				html += '<a class="story ' + story.id;
				html += '" href="javascript:;" onclick="kSoundUrl(';
				html += "'" + story.url + "')";
				html += '">';
				html += story.name;
				html += '</a>';
				html += '</li>';
			});
			html += '</ul>';
			html += '</div></div></div>';

		});
		storyPanel.html(html);
	});
}

// TODO: This should be in a plugin
function halloween(id) {
	kSoundUrl('http://192.168.10.50/plugins/halloween/' + id + '.mp3');
}

// TODO: This should be in a plugin
function halloweenMood() {
	K.ledsPulse(K.ORANGE, function(result) {
		K.ears(9, 9);
	});
}

// TODO: This should be in a plugin
function xmas(id) {
	kSoundUrl('http://192.168.10.50/plugins/xmas/' + id + '.mp3');
}


/*
 * Button handler initialization
 */
function initButtonHandlers(){

	$('#alert .close').click(function(e) {
		dismissAlert();
	});

	$('#halloween-mood').click(function(e) {
		halloweenMood();
	});

	$('#radiobutton').click(function() {
		$('#mainnav a[href="#radio"]').tab('show');
	});

	ttsSpeakButton.click(function() {
		kSpeak($('#voicetext').val());
	});

	$('#soundpausebutton').click(function() {
		kSoundPause();
	});

	$('#soundstopbutton').click(function() {
		kSoundStop();
	});

	$('#sleepbutton').click(function() {
		kSleep();
	});

	$('#wakeupbutton').click(function() {
		kWakeUp();
	});

	$('#rebootbutton').click(function() {
		kReboot();
	});

	$('#clearcachebutton').click(function() {
		kClearCache();
	});

	$('#clearsnapshotsbutton').click(function() {
		kClearSnapshots();
	});

	$('#earsresetbutton').click(function() {
		kEarsReset();
	});

	$('#earsrandombutton').click(function() {
		kEarsRandom();
	});

	$('#snapshotbutton').click(function() {
		kSnapshot();
	});

	$('#snapshotqbutton').click(function() {
		$('#mainnav a[href="#photos"]').tab('show');
//		$('#photoaccordion').collapse({
//			parent: true,
//			toggle: false
//		});
		kSnapshot();
	});

	$('#snaplistlink').click(function() {
		loadSnapshots();
	});

	$('#moodrandombutton').click(function() {
		kMoods();
	});
}

function initFancyBox() {
	$('.fancybox-thumb').fancybox({
		prevEffect	: 'none',
		nextEffect	: 'none',
		helpers	: {
			title	: {
				type: 'outside'
			},
			thumbs	: {
				width	: 50,
				height	: 50
			}
		}
	});
}


/*
 * Initialization of GUI
 */
function initializeGui() {
	// Change title
	document.title = config.karotz.name + ' (OpenKarotz)';
	$('.navbar-brand').html(config.karotz.name);

	// Initialize button handlers
	initButtonHandlers();

	// Navigation bar auto-collapse on click
	$('.navbar-collapse').click('li', function() {
		$('.navbar-collapse').collapse('hide');
	});

	// Fancybox
	initFancyBox();

	// Visibility
	$('#alert').hide();

	// Usability
	// TODO: this button not yet implemented
	$('#soundplaybutton').addClass("disabled");

}


/*
 * Initializer for application
 */
function initializeApplication() {
	// Load configuration
	loadConfig(function() {
		// Create OpenKarotz instance
		K = new OpenKarotz(config.karotz.host);

		// Initialize GUI
		initializeGui();

		// Load data
		loadColors();
		loadEarPositions();
		loadMoods();
		loadRadios();
		loadStories();

		// Check Karotz status
		kStatus();
	});
}


/*
 * Initialize application on page load
 */
$(document).ready(function() {
	// DOM has been loaded.
	initializeApplication();
});

