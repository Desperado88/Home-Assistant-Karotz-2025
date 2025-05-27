function InitDialog()
{	

//================================
	$("#dlg_flash_upate").dialog({
		modal: true,
		autoOpen: false,
		buttons: {
		"Flash": function() 
		{
			$.ajaxSetup({ timeout: 100000 });
			SendCommand ("flash_update?version=" + $(cbx_rupdate).val(), "Flashing Firmware ...", 1);
			$.ajaxSetup({ timeout:40000 });
			$( this ).dialog( "close" );
		},
		Cancel: function() { $( this ).dialog( "close" );},		
		}
	});	


	$("#dlg_delete_snapshots").dialog({
		modal: true,
		autoOpen: false,
		buttons: {
		"Delete Snapshots": function() 
		{
			 SendCommand ("clear_snapshots", "Removing all picture...", 1);
			 $( this ).dialog( "close" );
		},
		Cancel: function() { $( this ).dialog( "close" );},		
		}
	});	
	
	 $("#dlg_show_snapshot").dialog({
		modal: true,
		autoOpen: false,
		buttons: {
		Ok: function() { $( this ).dialog( "close" );},		
		}
	});	
//================================
	 $("#dlg_tag_delete").dialog({
		modal: true,
		autoOpen: false,
		buttons: {
		"Delete Tag": function() 
		{
			$('#cbx_tags4').val("Deleting tag");
			$("#json_result").val("");
			$.get("/cgi-bin/rfid_delete?tag="+$('#dlg_tag_delete_tag_id').text(), function(data) 
			{
				$("#json_result").val(data);
				rfid_loaded = 0;
				RefreshTagList();
			});
			 $( this ).dialog( "close" );	
		},
		Cancel: function() { $( this ).dialog( "close" );},		
		}
	});	
	
	$( "#dlg_tag_delete" ).on( "dialogopen", function() 
	{
		var obj = jQuery.parseJSON( $('#cbx_tags4').val() );
		var ltag = obj.type_name + " " + obj.color_name
				
        $("#dlg_tag_delete_tag_id").text( obj.id );
		$("#dlg_tag_delete_tag_type").text( ltag );
     } );

//================================	
	 $("#dlg_tag_unassign").dialog({
		modal: true,
		autoOpen: false,
		buttons: {
		"Unassign Tag": function()
		{
			$("#json_result").val("");
			$.get("/cgi-bin/rfid_unassign?tag="+$('#dlg_tag_unassign_tag_id').text(), function(data) 
			{
				$("#json_result").val(data);
				rfid_loaded = 0;
				RefreshTagList();
			});
			 $( this ).dialog( "close" );	
		},
		Cancel: function() { $( this ).dialog( "close" );},		
		}
	});	
	
	$( "#dlg_tag_unassign" ).on( "dialogopen", function() 
	{
		var obj = jQuery.parseJSON( $('#cbx_tags4').val() );
		var ltag = obj.type_name + " " + obj.color_name
				
        $("#dlg_tag_unassign_tag_id").text( obj.id );
		$("#dlg_tag_unassign_tag_type").text( ltag );
     } );

//================================
// CLEAR TTS
//================================
	 $("#dlg_delete_tts").dialog({
		modal: true,
		autoOpen: false,
		buttons: {
		"Clear cache": function() 
		{
		$("#json_result").val("");
			$.get("/cgi-bin/clear_cache", function(data) 
			{
				$("#json_result").val(data);
			});
			 $( this ).dialog( "close" );	
		},
		Cancel: function() { $( this ).dialog( "close" );},		
		}
	});	
//================================	
// CLIPBOARD
//================================
	 $("#dlg_clipboard").dialog({
		modal: true,
		autoOpen: false,
		buttons: {
		"Close": function() { $( this ).dialog( "close" );},		
		}
	});	
	
	$( "#dlg_clipboard" ).on( "dialogopen", function() {
            $("#api_text").val( $("#dlg_clipboard").data('tips') );
			$("#api_text").select(); 
			$("#api_text").focus();
//================================
// TAG EDIT
//================================
        } );
	
	 $("#dlg_tag_edit").dialog({
		modal: true,
		autoOpen: false,
		buttons: {
		Ok: function() {
			$("#json_result").val("");
			$.get("/cgi-bin/rfid_rename?tag="+$('#dlg_tag_edit_tag_id').text()+"&color="+$('#dlg_tag_edit_tag_color').val()+"&name="+$('#dlg_tag_edit_tag_name').val(), function(data) 
			{
				$("#json_result").val(data);
				rfid_loaded = 0;
				RefreshTagList();
			});
			 $( this ).dialog( "close" );	
		;},
		Cancel: function() { $( this ).dialog( "close" );}	
		
		}
	});	
	
	$( "#dlg_tag_edit" ).on( "dialogopen", function() 
	{
		var obj = jQuery.parseJSON( $('#cbx_tags4').val() );
		var ltag = obj.type_name + " " + obj.color_name
				
        $("#dlg_tag_edit_tag_id").text( obj.id );
		$("#dlg_tag_edit_tag_type").text( ltag );
		$("select#dlg_tag_edit_tag_color").val( obj.color ); 
		$("#dlg_tag_edit_tag_name").val( obj.name );
		$("#dlg_tag_edit_action").text( obj.action );
		
     } );
//================================
// RFID EEDOMUS
//================================
	 $("#dlg_box_eedomus").dialog({
		modal: true,
		autoOpen: false,
		buttons: {
		"Test": function() 
		{
			var obj = jQuery.parseJSON( $('#cbx_tags4').val() );
			var portal = $('#rfid_eedomus_portal').is(":checked") ? "1" : "0";
			var lurl = "rfid_test_eedomus_macro?tag="+ obj.id + "&ip=" + $('#rfid_eedomus_ip').val() + "&macro=" + $('#rfid_macro_id').val() + "&api_user=" + $('#rfid_api_user').val() + "&api_password=" +$("#rfid_api_password").val()+"&portal="+ portal;
			SendCommand ( lurl, "Sending Eedomus macro ..." );		
		},		
		"Assign": function() 
		{ 
			var obj = jQuery.parseJSON( $('#cbx_tags4').val() );
			var portal = $('#rfid_eedomus_portal').is(":checked") ? "1" : "0";
			var lurl = "rfid_assign_eedomus_macro?tag="+ obj.id + "&ip=" + $('#rfid_eedomus_ip').val() + "&macro=" + $('#rfid_macro_id').val() + "&api_user=" + $('#rfid_api_user').val() + "&api_password=" +$("#rfid_api_password").val()+"&name=" + $('#rfid_eedomus_name').val() + "&portal="+ portal;
			rfid_loaded = 0;
			SendCommand ( lurl, "Assign Eedomus macro ...", RefreshTagList );
			$( this ).dialog( "close" );
		},		
		"Close": function() { $( this ).dialog( "close" );},		
		}
	 } );

	$( "#dlg_box_eedomus" ).on( "dialogopen", function() 
	{
		var obj = jQuery.parseJSON( $('#cbx_tags4').val() );
		var ltag = obj.type_name + " " + obj.color_name;
		
		$('#rfid_eedomus_portal').prop('checked', false);
								
		$("#rfid_eedomus_ip").val( $("#dlg_box_eedomus").data('ip') );
		$("#rfid_api_user").val( $("#dlg_box_eedomus").data('user') );
		$("#rfid_api_password").val( $("#dlg_box_eedomus").data('pass') );
				
        $("#dlg_box_eedomus_tag_id").text( obj.id );
		$("#dlg_box_eedomus_tag_type").text( ltag );
		$("#rfid_eedomus_name").val( obj.name );
	
		$("#rfid_eedomus_portal").change(function()
		{ 
			if ($('#rfid_eedomus_portal').is(":checked"))
			{ 
				$("#rfid_eedomus_ip").attr("disabled",true);
				$("#rfid_eedomus_ip").val( "api.eedomus.com" );
			}
			else
			{ 
				$("#rfid_eedomus_ip").val( $("#dlg_box_eedomus").data('ip') );
				$("#rfid_eedomus_ip").attr("disabled",false);
			}
		});		
						
     } );	
	 
	 
	 
 
//================================
// RFID VERA
//================================
	 $("#dlg_box_vera").dialog({
		modal: true,
		autoOpen: false,
		buttons: {
		"Test": function() {
					var obj = jQuery.parseJSON( $('#cbx_tags4').val() );
					SendCommand ("rfid_test_vera_scene?tag="+ obj.id + "&ip=" + $('#rfid_vera_ip').val() + "&scene=" + $('#rfid_scene_id').val() + "&name=" + $('#rfid_vera_name').val(), "Calling vera scene ...");

		},		
		"Assign": function() {
					var obj = jQuery.parseJSON( $('#cbx_tags4').val() );
					lurl="rfid_assign_vera_scene?tag="+ obj.id + "&ip=" + $('#rfid_vera_ip').val() + "&scene=" + $('#rfid_scene_id').val() + "&name=" + $('#rfid_vera_name').val(), "Assigning vera scene ...";		
			 rfid_loaded = 0;
			 SendCommand ( lurl, "Assign Vera scene ...", RefreshTagList );
			 $( this ).dialog( "close" );
		},		
		"Close": function() { $( this ).dialog( "close" );},		
		}		
	});	

	$( "#dlg_box_vera" ).on( "dialogopen", function() 
	{
		var obj = jQuery.parseJSON( $('#cbx_tags4').val() );
		var ltag = obj.type_name + " " + obj.color_name
	
		$("#rfid_vera_ip").val( $("#dlg_box_vera").data('ip') );
		$("#rfid_vera_name").val( obj.name );
        $("#dlg_box_vera_tag_id").text( obj.id );
		$("#dlg_box_vera_tag_type").text( ltag );
						
     } );	

//================================
// RFID ZIBASE
//================================
	 $("#dlg_box_zibase").dialog({
		modal: true,
		autoOpen: false,
		buttons: {
		"Test": function()
		{
			var obj = jQuery.parseJSON( $('#cbx_tags4').val() );	
			lurl="rfid_test_zibase_cmd?tag="+ obj.id + "&ip=" + $('#rfid_zibase_ip').val() + "&cmd=" + $("#rfid_zibase_cmd").val() + "&name=" + $("#rfid_zibase_name").val();						        	
			SendCommand ( lurl, "Sending URL ...");				
		},		
		"Assign": function() 
		{
			 var obj = jQuery.parseJSON( $('#cbx_tags4').val() );	
			lurl="rfid_assign_zibase_cmd?tag="+ obj.id + "&ip=" + $('#rfid_zibase_ip').val() + "&cmd=" + $("#rfid_zibase_cmd").val() + "&name=" + $("#rfid_zibase_name").val();						        	
			SendCommand ( lurl, "Assigning Zibase Command ...", RefreshTagList);				

			 $( this ).dialog( "close" );
		},		
		"Close": function() { $( this ).dialog( "close" );},		
		}		
	});	


	$( "#dlg_box_zibase" ).on( "dialogopen", function() 
	{
		var obj = jQuery.parseJSON( $('#cbx_tags4').val() );
		var ltag = obj.type_name + " " + obj.color_name
				
        $("#dlg_box_zibase_tag_id").text( obj.id );
		$("#dlg_box_zibase_tag_type").text( ltag );
						
     } );	
//================================
// RFID URL
//================================

	 $("#dlg_box_url").dialog({
		modal: true,
		autoOpen: false,
		buttons: {
		"Test": function() 
		{ 
			var obj = jQuery.parseJSON( $('#cbx_tags4').val() );
			var lurl = "rfid_test_url?tag="+ obj.id + "&url=" + $('#rfid_url').val()  + "&param=" + $.base64.encode(encodeURI($('#rfid_url_parameters').val())) + "&user=" + $('#rfid_url_username').val() + "&password=" + $('#rfid_url_password').val();
			SendCommand ( lurl, "Sending URL ...");		
		},		
		"Assign": function() 
		{ 
			var obj = jQuery.parseJSON( $('#cbx_tags4').val() );
			var lurl = "rfid_assign_url?tag="+ obj.id + "&url=" + $('#rfid_url').val()  + "&param=" + $.base64.encode(encodeURI($('#rfid_url_parameters').val())) + "&user=" + $('#rfid_url_username').val() + "&password=" + $('#rfid_url_password').val() + "&name=" + $('#rfid_url_name').val();
			rfid_loaded = 0;
			SendCommand ( lurl, "Assigning URL ...", RefreshTagList  );				
			$( this ).dialog( "close" );
		},		
		"Close": function() { $( this ).dialog( "close" );},		
		}		
	});	

	$( "#dlg_box_url" ).on( "dialogopen", function() 
	{
		var obj = jQuery.parseJSON( $('#cbx_tags4').val() );
		var ltag = obj.type_name + " " + obj.color_name
				
        $("#dlg_box_url_tag_id").text( obj.id );
		$("#dlg_box_url_tag_type").text( ltag );
						
     } );	
//================================
// ACTION KAROTZ TTS
//================================
	 $("#dlg_action_tts").dialog({
		modal: true,
		autoOpen: false,
		buttons: {
		"Assign": function()
		{
			var obj = jQuery.parseJSON( $('#cbx_tags4').val() );
			
			// Create Sound in cache
			rurl='/cgi-bin/tts?nocache=0&text='+ escape($("#dlg_tts_action_text").val()) + "&voice=" + $("#dlg_cbx_action_voice").val();
			$.get( rurl + "&mute=1", function(data) {});
			var b64url = $.base64.encode('http://127.0.0.1' + rurl);
			$("#json_result").val("");
			rfid_loaded = 0;
			SendCommand ( "rfid_assign_karotz?tag="+ obj.id + "&url=" + b64url, "Assigning Karotz action ...", RefreshTagList );

			 $( this ).dialog( "close" );	
		},
		"Close": function() { $( this ).dialog( "close" );},		
		}
	});	

	$( "#dlg_action_tts" ).on( "dialogopen", function() 
	{
		var obj = jQuery.parseJSON( $('#cbx_tags4').val() );
		var ltag = obj.type_name + " " + obj.color_name
				
        $("#dlg_tts_tag_id").text( obj.id );
		$("#dlg_tts_tag_type").text( ltag );
		RefreshVoiceList( "#dlg_cbx_action_voice" ,1);
						
     } );	
//================================
// ACTION KAROTZ SLEEP
//=================================
	 $("#dlg_action_sleep").dialog({
		modal: true,
		autoOpen: false,
		buttons: {
		"Assign": function()
		{
			var obj = jQuery.parseJSON( $('#cbx_tags4').val() );
			var b64url = $.base64.encode('"http://127.0.0.1/cgi-bin/sleep"');
			$("#json_result").val("");
			rfid_loaded = 0;
			SendCommand ( "rfid_assign_karotz?tag="+ obj.id + "&url=" + b64url, "Assigning Karotz action ...", RefreshTagList );
			 $( this ).dialog( "close" );	
		},
		"Close": function() { $( this ).dialog( "close" );},		
		}
	});	

	$( "#dlg_action_sleep" ).on( "dialogopen", function() 
	{
		var obj = jQuery.parseJSON( $('#cbx_tags4').val() );
		var ltag = obj.type_name + " " + obj.color_name
				
        $("#dlg_sleep_tag_id").text( obj.id );
		$("#dlg_sleep_tag_type").text( ltag );
     } );	

//================================
// ACTION KAROTZ WAKEUP
//=================================
	 $("#dlg_action_wakeup").dialog({
		modal: true,
		autoOpen: false,
		buttons: {
		"Assign": function()
		{
			var obj = jQuery.parseJSON( $('#cbx_tags4').val() );
			var b64url = $.base64.encode('"http://127.0.0.1/cgi-bin/wakeup"');
			$("#json_result").val("");
			rfid_loaded = 0;
			SendCommand ( "rfid_assign_karotz?tag="+ obj.id + "&url=" + b64url, "Assigning Karotz action ...", RefreshTagList );
			 $( this ).dialog( "close" );	
		},
		"Close": function() { $( this ).dialog( "close" );},		
		}
	});	

	$( "#dlg_action_wakeup" ).on( "dialogopen", function() 
	{
		var obj = jQuery.parseJSON( $('#cbx_tags4').val() );
		var ltag = obj.type_name + " " + obj.color_name
				
        $("#dlg_wakeup_tag_id").text( obj.id );
		$("#dlg_wakeup_tag_type").text( ltag );
		$("#wakeup_cache" ).buttonset();
     } );	
//================================
// KAROTZ ACTION EARS
//================================
	 $("#dlg_action_ears").dialog({
		modal: true,
		autoOpen: false,
		buttons: {
		"Assign": function()
		{
			var obj = jQuery.parseJSON( $('#cbx_tags4').val() );
			var b64url = $.base64.encode('http://127.0.0.1/cgi-bin/ears?left=' + $('#dlg_cbx_left_ears').val() +"&right=" + $('#dlg_cbx_right_ears').val() );
			$("#json_result").val("");
			rfid_loaded = 0;
			SendCommand ( "rfid_assign_karotz?tag="+ obj.id + "&url=" + b64url, "Assigning Karotz action ...", RefreshTagList );
			 $( this ).dialog( "close" );	
		},
		"Close": function() { $( this ).dialog( "close" );},		
		}
	});	

	$( "#dlg_action_ears" ).on( "dialogopen", function() 
	{
		var obj = jQuery.parseJSON( $('#cbx_tags4').val() );
		var ltag = obj.type_name + " " + obj.color_name

		for ( i=1; i < 17; i++ )
		{
			$('#dlg_cbx_left_ears').append('<option value="'+i+'">'+i+'</option>');
			$('#dlg_cbx_right_ears').append('<option value="'+i+'">'+i+'</option>');
		}		
		
        $("#dlg_ears_tag_id").text( obj.id );
		$("#dlg_ears_tag_type").text( ltag );
     } );	
//================================
// KAROTZ ACTION MOODS
//================================
	 $("#dlg_action_moods").dialog({
		modal: true,
		height: 'auto',
		width: 350,
		autoOpen: false,
		buttons: {
		"Assign": function()
		{
			var obj = jQuery.parseJSON( $('#cbx_tags4').val() );
			var url='http://127.0.0.1/cgi-bin/apps/moods?id=' + $("#dlg_cbx_moods").val();
			var b64url = $.base64.encode(url);
			$("#json_result").val("");
			rfid_loaded = 0;
			SendCommand ( "rfid_assign_karotz?tag="+ obj.id + "&url=" + b64url, "Assigning Karotz action ...", RefreshTagList );
			 $( this ).dialog( "close" );	
		},
		"Close": function() { $( this ).dialog( "close" );},		
		}
	});	

	$( "#dlg_action_moods" ).on( "dialogopen", function() 
	{
		var obj = jQuery.parseJSON( $('#cbx_tags4').val() );
		var ltag = obj.type_name + " " + obj.color_name
		RefreshMoodsList( "#dlg_cbx_moods");
				
        $("#dlg_moods_tag_id").text( obj.id );
		$("#dlg_moods_tag_type").text( ltag );
     } );
	 	
//================================
// KAROTZ ACTION SOUNDS
//================================
	 $("#dlg_action_sounds").dialog({
		modal: true,
		autoOpen: false,
		buttons: {
		"Assign": function()
		{
			var obj = jQuery.parseJSON( $('#cbx_tags4').val() );
			var url='http://127.0.0.1/cgi-bin/sound?id=' + $("#dlg_cbx_sounds").val();
			var b64url = $.base64.encode(url);
			$("#json_result").val("");
			rfid_loaded = 0;
			SendCommand ( "rfid_assign_karotz?tag="+ obj.id + "&url=" + b64url, "Assigning Karotz action ...", RefreshTagList );

			 $( this ).dialog( "close" );	
		},
		"Close": function() { $( this ).dialog( "close" );},		
		}
	});	

	$( "#dlg_action_sounds" ).on( "dialogopen", function() 
	{
		var obj = jQuery.parseJSON( $('#cbx_tags4').val() );
		var ltag = obj.type_name + " " + obj.color_name
		RefreshSoundList( "#dlg_cbx_sounds");
				
        $("#dlg_sounds_tag_id").text( obj.id );
		$("#dlg_sounds_tag_type").text( ltag );
     } );	
	 
//================================
// KAROTZ ACTION NETWORK SOUND
//================================
	 $("#dlg_action_nsounds").dialog({
		modal: true,
		autoOpen: false,
		buttons: {
		"Assign": function()
		{
			var obj = jQuery.parseJSON( $('#cbx_tags4').val() );
			var url='http://127.0.0.1/cgi-bin/sound?url=' + $("#dlg_nsounds_url").val();
			var b64url = $.base64.encode(url);
			$("#json_result").val("");
			rfid_loaded = 0;
			SendCommand ( "rfid_assign_karotz?tag="+ obj.id + "&url=" + b64url, "Assigning Karotz action ...", RefreshTagList );
			 $( this ).dialog( "close" );	
		},
		"Close": function() { $( this ).dialog( "close" );},		
		}
	});	

	$( "#dlg_action_nsounds" ).on( "dialogopen", function() 
	{
		var obj = jQuery.parseJSON( $('#cbx_tags4').val() );
		var ltag = obj.type_name + " " + obj.color_name
				
        $("#dlg_nsounds_tag_id").text( obj.id );
		$("#dlg_nsounds_tag_type").text( ltag );
     } );	
//================================
// KAROTZ STOP NETWORK SOUND
//================================
	 $("#dlg_action_snsounds").dialog({
		modal: true,
		autoOpen: false,
		buttons: {
		"Assign": function()
		{
			var obj = jQuery.parseJSON( $('#cbx_tags4').val() );
			var url='http://127.0.0.1/cgi-bin/sound_control?cmd=quit';
			var b64url = $.base64.encode(url);
			$("#json_result").val("");
			rfid_loaded = 0;
			SendCommand ( "rfid_assign_karotz?tag="+ obj.id + "&url=" + b64url, "Assigning Karotz action ...", RefreshTagList );

			$( this ).dialog( "close" );	
		},
		"Close": function() { $( this ).dialog( "close" );},		
		}
	});	

	$( "#dlg_action_snsounds" ).on( "dialogopen", function() 
	{
		var obj = jQuery.parseJSON( $('#cbx_tags4').val() );
		var ltag = obj.type_name + " " + obj.color_name
				
        $("#dlg_snsounds_tag_id").text( obj.id );
		$("#dlg_snsounds_tag_type").text( ltag );
     } );	

dlg_action_snsounds

} // Init Dialog