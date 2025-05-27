// ----------------------------
// General Functions
// ----------------------------


function InitStrings()
{
    $.getJSON("/js/strings.json", function(data) 
    {
        if ( parseInt(data.return) == 0)
        {
            if ( data.ok_strings.length == 0 )
            {
                // Unable to laod strings
                alert ("Empty strings");
            }
            else
            {
              gui_strings = data.ok_strings;
            }
        }
    });
}


function Init()
{   
    InitStrings();
    var kkeys = [], konami = "38,38,40,40,37,39,37,39,66,65";
    $(document).keydown(function(e) {
      kkeys.push( e.keyCode );
      if ( kkeys.toString().indexOf( konami ) >= 0 )
      {
        $(document).unbind('keydown',arguments.callee);
        window.location.href = '/tools.html';
      }
    });
    InitGauge();
        
    $( document ).tooltip();
    $("#json_result").width = $(window).width();    
    $("#json_title").on('click', function () { $("#json_result").val(""); });
    
    // Set global json options
    $.ajaxSetup({ timeout: 40000 });
    $.ajaxSetup({ cache: false });
    $.ajaxSetup({"error":function(jqXHR, textStatus, errorThrown) {
         $("#json_result").val("HTTP Error : " + jqXHR.status + "  " + errorThrown + " " + jqXHR.url);
         $.unblockUI(); 
         }
    });

    $.ajaxSetup({ beforeSend: function(jqXHR, settings) { jqXHR.url = settings.url;}
    });
}   

    

function CapitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function loadImage(path, width, height, target) 
{
    $('<img src="'+ path +'">').load(function() {
    $("#snapshot_filename").text(path);
    //document.getElementById('resultAreaID_1').innerHTML = "<img src="+imagePath +" onload='fnCallback_1()'>";
    //$('#img_snapshot')
    //document.getElementById('#img_snapshot').innerHTML('<div><img src="' + path + '" width=160 height=120 title="' + path + '"/></div>');
    var img = new Image();
    img.src =path ;
    img.width=160;
    img.height=120;
    img.border=2;
    img.title="Click to see full size image";
    $("#img_snapshot").hide();
    $("#img_snapshot").empty();
    $("#img_snapshot").append(img);
    $("#img_snapshot").show();      
    });
}


function CheckFirmware()
{
    $('#cbx_rupdate').empty();
    $('#cbx_rupdate').prop("disabled", true );
    $('#cbx_rupdate').append('<option value="-1">Loading Firmware(s) ...</option>');
    $("#btn_install_rupdate").prop("disabled", true );    
        $.getJSON("/cgi-bin/get_firmware_list", function(data) 
        {
            if ( parseInt(data.return) == 0)
            {
                if ( data.firmwares.length == 0 )
                {
                    $('#cbx_rupdate').empty();
                    $('#cbx_rupdate').append('<option value=\'{"id":"","file":""}\'">No update available...</option>'); 
                }
                else
                {
                    $('#cbx_rupdate').prop("disabled", false )
                    $("#btn_install_rupdate").prop("disabled", false );

                    $('#cbx_rupdate')[0].options.length = 0;
                    for (var i = 0; i < data.firmwares.length; i++)
                    {
                        $('#cbx_rupdate').append('<option value=\'' + data.firmwares[i].version + '\'>' + data.firmwares[i].name  + '</option>');                   
                    }               
                }
            }
            else
            {
                $('#cbx_rupdate').empty();
                $('#cbx_rupdate').append('<option value="-1">No update available...</option>');
            }
            
        }); 
    $('#cbx_rupdate').focus()

}

function CheckUpdate()
{
    $('#cbx_update').empty();
    $('#cbx_update').prop("disabled", true );
    $('#cbx_update').append('<option value="-1">Loading Update(s) ...</option>');
    $("#btn_install_update").prop("disabled", true );    
        $.getJSON("/cgi-bin/get_update_list", function(data) 
        {
            if ( parseInt(data.return) == 0)
            {
                if ( data.updates.length == 0 )
                {
                    $('#cbx_update').empty();
                    $('#cbx_update').append('<option value=\'{"id":"","file":""}\'">No update available...</option>');  
                }
                else
                {
                    $('#cbx_update').prop("disabled", false )
                    $("#btn_install_update").prop("disabled", false );

                    $('#cbx_update')[0].options.length = 0;
                    for (var i = 0; i < data.updates.length; i++)
                    {
                        $('#cbx_update').append('<option value=\'{"id":"' + data.updates[i].id + '","file":"' + data.updates[i].file + '"}\'>' + data.updates[i].name  + '</option>');                  
                    }               
                }
            }
            else
            {
                $('#cbx_update').empty();
                $('#cbx_update').append('<option value="-1">No update available...</option>');
            }
            
        }); 
    $('#cbx_update').focus()

}

function CheckPatch()
{
    $('#cbx_patch').empty();
    $('#cbx_patch').prop("disabled", true );
    $('#cbx_patch').append('<option value="-1">Loading Patchs(s) ...</option>');
    $("#btn_install_patch").prop("disabled", true );    
        $.getJSON("/cgi-bin/get_patch_list", function(data) 
        {
            if ( parseInt(data.return) == 0)
            {
                if ( data.patchs.length == 0 )
                {
                    $('#cbx_patch').empty();
                    $('#cbx_patch').append('<option value=\'{"id":"","file":""}\'">No patch available...</option>');    
                }
                else
                {
                    $('#cbx_patch').prop("disabled", false )
                    $("#btn_install_patch").prop("disabled", false );

                    $('#cbx_patch').empty();
                    for (var i = 0; i < data.patchs.length; i++)
                    {
                        $('#cbx_patch').append('<option value=\'{"id":"' + data.patchs[i].id + '","file":"' + data.patchs[i].file + '"}\'>' + data.patchs[i].name  + '</option>');                  
                    }               
                }
            }
            else
            {
                $('#cbx_patch').empty();
                $('#cbx_patch').append('<option value="-1">No patch available...</option>');
            }
            
        }); 
    $('#cbx_patch').focus()

}
    

function CheckAppsInstallation( u, t )
{
  bInstalled=false;
 
    $.getJSON( "/cgi-bin/" + u +"?check=1", function(data) 
    {
        if ( parseInt(data.return) == 0)
        {
            if ( parseInt(data.enabled) == 1 )
            { $(t).removeClass( "ui-state-disabled" ); }    
            else
            { $(t).addClass( "ui-state-disabled" ); }
        }
    });
}


function RefreshAppsList()
{
    $('#cbx_apps').empty();
    $('#cbx_apps').prop("disabled", true );
    $('#cbx_apps').append('<option value="-1">Loading application(s) list ...</option>');
    $.blockUI({ message: '<H2><img src="/images/ajax-loader.gif" />&nbsp;Reading tag(s) list'});
        
        $.getJSON("/cgi-bin/get_apps_list", function(data) 
        {
            if ( parseInt(data.return) == 0)
            {
                if ( data.apps.length == 0 )
                {
                    $('#cbx_apps').empty();
                    $('#cbx_apps').prop("disabled", true );
                    $('#cbx_apps').append('<option value="-1">No applications ...</option>');
    
                    //$("#btn_delete_tag").prop("disabled", true );
                    //$("#btn_unassign_tag").prop("disabled", true )
                    //$("#btn_rfid_vera").prop("disabled", true )
                    //$("#btn_rfid_eedomus").prop("disabled", true )
                    //$("#btn_rfid_url").prop("disabled", true )
                }
                else
                {
                    $('#cbx_apps').prop("disabled", false )
                    //$("#btn_delete_tag").prop("disabled", false );
                    //$("#btn_unassign_tag").prop("disabled", false )
                    //$("#btn_rfid_vera").prop("disabled", false )
                    //$("#btn_rfid_eedomus").prop("disabled", false )
                    //$("#btn_rfid_url").prop("disabled", false )

                    $('#cbx_apps')[0].options.length = 0;
                    for (var i = 0; i < data.apps.length; i++)
                    {
                        $('#cbx_apps').append('<option value="'+ data.apps[i].file +'">'+ CapitaliseFirstLetter(data.apps[i].id ) + '</option>');                   
                    }               
                }
            }
            else
            {                   
                    $('#cbx_apps').empty();
                    $('#cbx_apps').prop("disabled", true );
                    $('#cbx_apps').append('<option value="-1">No applications ...</option>')
            }
            $.unblockUI();
        }); 
        $.unblockUI();  
        $('#cbx_apps').focus()
}


function RefreshRadioList()
{
    $('#cbx_stream').empty();
    $('#cbx_stream').prop("disabled", true );
    $('#cbx_stream').append('<option value="-1">Loading streams ...</option>');
    $.blockUI({ message: '<H2><img src="/images/ajax-loader.gif" />&nbsp;Reading tag(s) list'});
    
    $.getJSON("http://www.freerabbits.nl/service/KarotzTimeRadioList", function(data) 
    {
        if ( parseInt(data.return) == 0)
        {
            if ( data.streams.length == 0 )
            {
                $('#cbx_stream').empty();
                $('#cbx_stream').prop("disabled", true );
                $('#cbx_stream').append('<option value="-1">No Streams ...</option>');

                $("#btn_sound_play").prop("disabled", true );
                $("#btn_sound_pause").prop("disabled", true )
                $("#btn_sound_stop").prop("disabled", true )
            }
            else
            {
                $('#cbx_stream').prop("disabled", false )
                $("#btn_sound_play").prop("disabled", false );
                $("#btn_sound_pause").prop("disabled", false )
                $("#btn_sound_stop").prop("disabled", false )

                $('#cbx_stream')[0].options.length = 0;
                for (var i = 0; i < data.streams.length; i++)
                {
                    $('#cbx_stream').append('<option value="'+ data.streams[i].url +'">'+data.streams[i].name +'</option>');                    
                }               
            }
        }
        $.unblockUI();
    }); 
    $.unblockUI();  
    $('#cbx_stream').focus()    
}   


function RefreshTagList()
{
    $('#accrfid1 .ui-accordion-content ').hide();

    if ( rfid_loaded == 1 )
      return;
      
    rfid_loaded = 1;  
    $('#cbx_tags4').empty();
    $('#cbx_tags4').prop("disabled", true );
    $('#cbx_tags4').append('<option value="-1">Loading Tags ...</option>');
    $('#rfid_ext').addClass( "ui-state-disabled" );
    $('#rfid_int').addClass( "ui-state-disabled" );

    $.blockUI({ message: '<H2><img src="/images/ajax-loader.gif" />&nbsp;Reading tag(s) list'});
        
        $.getJSON("/cgi-bin/rfid_list_ext", function(data) 
        {
            if ( parseInt(data.return) == 0)
            {
                if ( data.tags.length == 0 )
                {
                    $('#cbx_tags4').empty();
                    $('#cbx_tags4').prop("disabled", true );
                    $('#cbx_tags4').append('<option value="-1">No Tags ...</option>');
    
                    $("#btn_delete_tag").prop("disabled", true );
                    $("#btn_unassign_tag").prop("disabled", true );
                    $('#rfid_ext').addClass( "ui-state-disabled" );
                    $('#rfid_int').addClass( "ui-state-disabled" );
                }
                else
                {
                    $('#cbx_tags4').prop("disabled", false )
                    $("#btn_delete_tag").prop("disabled", false );
                    $("#btn_unassign_tag").prop("disabled", false )
                    $('#rfid_ext').removeClass( "ui-state-disabled" );
                    $('#rfid_int').removeClass( "ui-state-disabled" );

                    $('#cbx_tags4')[0].options.length = 0;
                    for (var i = 0; i < data.tags.length; i++)
                    {
                        var tname = data.tags[i].name;
                        if ( data.tags[i].name.length == 0 ) { tname = "No name"}
                        
                        // 2.01
                        // Json Value
                        $('#cbx_tags4').append('<option value=\'{"id":"' + data.tags[i].id + '","action":"' + data.tags[i].type +'","type_name":"' + data.tags[i].type_name + '","color_name":"' + data.tags[i].color_name + '","color":"' + data.tags[i].color + '","name":"' + data.tags[i].name + '"}\'>' + data.tags[i].type_name+"&nbsp;"+data.tags[i].color_name+ " - " + tname  + " - " + data.tags[i].type + '</option>');                  
                    }               
                }
            }
            $.unblockUI();
        }); 
        $.unblockUI();  
        $('#cbx_tags4').focus()
}
    

function SendCommandApps( cmd, message )
{
    $.ajaxSetup({ timeout: 60000 });
    $.blockUI({ message: '<H2><img src="/images/ajax-loader.gif" />&nbsp;' + message + '</H2>' })
    
    $("#json_result").val("");
    $.get("/cgi-bin/"+cmd, function(data) {
    $("#json_result").val(data); 
    
    CheckAppsInstallation( "apps.clock.install", "#funny_clock" );
    CheckAppsInstallation( "apps.moods.install", "#moods" );
    
    $.ajaxSetup({ timeout: 40000 });
    $.unblockUI();
    });
}

// Remove noblock param
// function SendCommand( cmd, message, noblock )
function SendCommand( cmd, message, paramFunc )
{
    $.blockUI({ message: '<H2><img src="/images/ajax-loader.gif"/>&nbsp;' + message + '</H2>' })
    $("#json_result").val("");
    $.get("/cgi-bin/"+cmd, function(data) {
        $.unblockUI();      
        $("#json_result").val(data); 
        if (paramFunc && (typeof paramFunc == "function")) 
        {
          paramFunc();   
        }
    }); 
}

function SendCommandJSON( cmd, message )
{
        $.blockUI({ message: '<H2><img src="/images/ajax-loader.gif" />&nbsp;' + message + '</H2>' })
        $("#json_result").val("");
        $.getJSON("/cgi-bin/"+cmd, function(data) 
        {
            $.unblockUI();
            $("#json_result").val(data);
        });
}

function InitGauge()
{
        $("#json_result").val("");
        $.getJSON("/cgi-bin/get_free_space", function(data) 
        {
            kused=parseInt(data.karotz_percent_used_space);
            uused=parseInt(data.usb_percent_used_space);
            
            //alert ( kused );
            if ( kused > -1 )
            {
                $( "#internal_storage" ).removeClass( "ui-state-disabled" );
                $('#gaugeContainer').jqxGauge('value', kused );
                $('#gaugeValue').text( "Used Space: " + kused + ' %')
            }
            
            if ( uused > -1 )
            {
                $('#gaugeContainer2').jqxGauge('value', uused );
                $('#gaugeValue2').text( "Used Space: " + uused + ' %')
                $( "#usb_storage" ).removeClass( "ui-state-disabled" );
            }
            // alert( kused );
        });
}


function TakePicture( cmd )
{
        $.blockUI({ message: '<H2><img src="/images/ajax-loader.gif" />&nbsp;Taking Picture</H2>' })
        $("#json_result").val("");      
        $.getJSON("/cgi-bin/"+cmd, function(data,textStatus,jqXHR) 
        {
            $.unblockUI();
            // $("#img_snapshot").attr("href", "/Snapshots/" + data.thumb );
            fn = "/Snapshots/" + data.thumb;
            $("#snapshot_filename").attr({ title : fn });
          
            //$("#snapshot_filename").text("/snapshots/" + data.filename);
               loadImage( "/snapshots/" + data.filename, 160, 120, '#img_snapshot');
    
            // $('#img_snapshot').html('<img src="/Snapshots/snapshot_2013_09_29_00_18_21.jpg" width=100 height=100/>');
            $("#json_result").val(jqXHR.responseText);
        });
}


function Old_RefreshVoiceList()
{
    $('#cbx_voice').empty();
    $('#cbx_voice').prop("disabled", true );
    $('#cbx_voice').append('<option value="-1">No voice</option>');
    $.blockUI({ message: '<H2><img src="/images/ajax-loader.gif" />&nbsp;Reading voice list'});
        $.getJSON("/cgi-bin/voice_list", function(data) 
        {
            if ( parseInt(data.return) == 0)
            {
                if ( data.voices.length == 0 )
                {
                    $('#cbx_voice').prop("disabled", true );
                }
                else
                {
                    $('#cbx_voice').empty();
                    $('#cbx_voice')[0].options.length = 0;
                    $('#cbx_voice').prop("disabled", false )
                    for (var i = 0; i < data.voices.length; i++)
                    {
                        $('#cbx_voice').append('<option value="'+ data.voices[i].id +'">'+ CapitaliseFirstLetter(data.voices[i].id) +'</option>');                  
                    }               
                }
            }
        });
            
        $.unblockUI();  
        $('#cbx_voice').focus();
}

function RefreshVoiceList( cbx_target, noblock )
{
    $(cbx_target).empty();
    $(cbx_target).prop("disabled", true );
    $(cbx_target).append('<option value="-1">No voice</option>');
    if ( noblock == 1 )
        $.blockUI({ message: '<H2><img src="/images/ajax-loader.gif" />&nbsp;Reading voice list'});
        
        $.getJSON("/cgi-bin/voice_list", function(data) 
        {
            if ( parseInt(data.return) == 0)
            {
                if ( data.voices.length == 0 )
                {
                    $(cbx_target).prop("disabled", true );
                }
                else
                {
                    $(cbx_target).empty();
                    $(cbx_target)[0].options.length = 0;
                    $(cbx_target).prop("disabled", false )
                    for (var i = 0; i < data.voices.length; i++)
                    {
                        $(cbx_target).append('<option value="'+ data.voices[i].id +'">'+ CapitaliseFirstLetter(data.voices[i].id) +' (' + data.voices[i].lang.toUpperCase() +') </option>');                    
                    }               
                }
            }
        });
        if ( noblock == 1 )
            $.unblockUI();  
            
        $(cbx_target).focus();
}

 
// cbx moods
function RefreshMoodsList( id )
{
    $(id).empty();
    $(id).prop("disabled", true );
    $(id).append('<option value="-1">Loading Moods ...</option>');
    $.blockUI({ message: '<H2><img src="/images/ajax-loader.gif" />&nbsp;Reading mood(s) list'});
        
        $.getJSON("/cgi-bin/moods_list", function(data) 
        {
            if ( parseInt(data.return) == 0)
            {
                if ( data.moods.length == 0 )
                {
                    $(id).empty();
                    $(id).append('<option value="5">No Moods</option>');
                    $(id).prop("disabled", true );
                    
                }
                else
                {
                    $(id)[0].options.length = 0;
    
                    $(id).prop("disabled", false )
                    for (var i = 0; i < data.moods.length; i++)
                    {
                        Description = data.moods[i].text;   
                        $(id).append('<option value="'+ data.moods[i].id +'">'+ Description + '</option>');                 
                    }               
                }
            }
            else
            {
                $(id).empty();
                $(id).append('<option value="5">No Moods</option>');
            }
            $.unblockUI();
        }); 
        $.unblockUI();  
        $(id).focus()
}

// cbx_stories
function RefreshStoriesList()
{
    $('#cbx_stories').empty();
    $('#cbx_stories').prop("disabled", true );
    $('#cbx_stories').append('<option value="5">No stories</option>');
    $.blockUI({ message: '<H2><img src="/images/ajax-loader.gif" />&nbsp;Reading sound list'});
        $.getJSON("/cgi-bin/stories_list", function(data) 
        {
            if ( parseInt(data.return) == 0 )
            {
                if ( data.streams.length == 0 )
                {
                    $('#cbx_stories').prop("disabled", true );
                }
                else
                {
                    $('#cbx_stories').empty();
                    $('#cbx_stories')[0].options.length = 0;
                    $('#cbx_stories').prop("disabled", false )
                    for (var i = 0; i < data.streams.length; i++)
                    {
                        $('#cbx_stories').append('<option value="'+ data.streams[i].url +'">'+ CapitaliseFirstLetter(data.streams[i].name) +'</option>');                   
                    }               
                }
            }
        });
            
        $.unblockUI();  
        $('#cbx_stories').focus();
}



function RefreshSoundList( id )
{
    $(id).empty();
    $(id).prop("disabled", true );
    $(id).append('<option value="-1">Loading sound(s)</option>');
    $.blockUI({ message: '<H2><img src="/images/ajax-loader.gif" />&nbsp;Reading sound list'});
        $.getJSON("/cgi-bin/sound_list", function(data) 
        {
            if ( parseInt(data.return) == 0)
            {
                if ( data.sounds.length == 0 )
                {
                    $(id).prop("disabled", true );
                }
                else
                {
                    $(id).empty();
                    $(id)[0].options.length = 0;
                    $(id).prop("disabled", false )
                    for (var i = 0; i < data.sounds.length; i++)
                    {
                        $(id).append('<option value="'+ data.sounds[i].id +'">'+ CapitaliseFirstLetter(data.sounds[i].id) +'</option>');                    
                    }               
                }
            }
        });
            
        $.unblockUI();  
        $(id).focus();
}


function LoadMoods( MoodsId)
{
  var result;
  $.ajax(
  {
    type: 'GET',
    //async: true,
    url:  '/cgi-bin/get_file?src=usbkey/Moods/fr/' + MoodsId + '.mp3&dest=Apps/Moods/fr/' +  MoodsId +'.mp3',
    success: function(data) {
        result = data;
    }
  });
  return result;
}


function EedomusDialog()
{
    $.getJSON("/cgi-bin/eedomus_info", function(data) 
    {
        if ( parseInt(data.return) == 0)
        {
            $("#dlg_box_eedomus").data('pass', data.pass).data('user', data.user).data('ip', data.ip).dialog( "open" );
        }
        else
        {
            $("#dlg_box_eedomus").data('ip', "").data('user', "").dialog( "open" );         
        }
    }); 
}


function VeraDialog()
{
    $.getJSON("/cgi-bin/vera_info", function(data) 
    {
        if ( parseInt(data.return) == 0)
        {
            $("#dlg_box_vera").data('ip', data.ip).dialog( "open" );
        }
        else
        {
            $("#dlg_box_eedomus").data('ip', "").dialog( "open" );          
        }
    }); 
}



