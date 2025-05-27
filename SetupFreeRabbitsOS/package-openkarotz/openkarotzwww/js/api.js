var kused = -1;
var uused = -1;
var rfid_loaded = 0;
var gui_strings = [];

// ----------------------------
$(document).ready(
function(){

Init();	
	// Load Tabs Content
	$('#Infos').load('infos.html');
	$('#State').load('state.html');
	$('#Leds').load('leds.html');
	$('#Ears').load('ears.html');
	$('#Rfid').load('rfid.html');
	$('#TTS').load('tts.html');
	$('#Sounds').load('sounds.html');	
  	$('#Pictures').load('pictures.html');
	$('#Apps').load('apps.html');
	$('#Update').load('update.html');
	// $('#Setup').load('setup.html');
	$('#Docs').load('about.html');
	
	// Load Dialog
	$('#Dialog').load('dialog.html');			
 
$("#tabs").tabs({
 activate: function(event, ui) {
	 	$("#json_result").val("");
 
     	if ( ui.newPanel.attr('id') == "Infos" ) 	{ InitGauge(); }
		if ( ui.newPanel.attr('id') == "Pictures" ) { loadImage( "/images/mire.jpg", 160, 120, '#img_snapshot'); }			
	    if ( ui.newPanel.attr('id') == "Rfid" ) 	{ RefreshTagList(); }
		if ( ui.newPanel.attr('id') == "TTS" )  	{ RefreshVoiceList( "#cbx_voice" ,1);}	
		if ( ui.newPanel.attr('id') == "Sounds")	{ RefreshSoundList('#cbx_sound'); RefreshRadioList();}
		if ( ui.newPanel.attr('id') == "Update")	{ CheckUpdate();  CheckPatch(); CheckFirmware(); }
		if ( ui.newPanel.attr('id') == "Apps")		{
			 CheckAppsInstallation( "apps.clock.install", "#funny_clock" );
			 CheckAppsInstallation( "apps.moods.install", "#moods" );
			 CheckAppsInstallation( "apps.story.install", "#story" );
			 RefreshAppsList();
			 RefreshMoodsList('#cbx_moods');
			 RefreshStoriesList();
		}

		CheckUpdate}							  							
});
	
});



