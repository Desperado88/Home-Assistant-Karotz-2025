<?php
$filelist='';
$i=0;

//echo ( '{ "files":[' );
if ($handle = opendir('.')) {
    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != "..") 
	   {
            
		$ext = pathinfo($entry, PATHINFO_EXTENSION);
		if ( $ext != "md5"  && $ext != "php" && $ext != "txt" && !is_dir($entry) && $entry != "setup.inc" ) 
		{
			//$filelist.='{"filename":"' . $entry  .'"},';
			echo ( $entry . "\n");
			//. $entry; . '"},';
			//$afiles[$i++]= $entry;
		}

        }
    }
    closedir($handle);
}

//echo ( rtrim($filelist, ",") . '] }' );
//echo ( '] }' );

?>