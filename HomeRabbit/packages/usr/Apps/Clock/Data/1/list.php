
<?php
$filelist='';
$i=0;

echo ( '{ "files":[' );
if ($handle = opendir('.')) {
    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != "..") 
	   {
            
		$ext = pathinfo($entry, PATHINFO_EXTENSION);
		if ( $ext != "md5"  && $ext != "php" ) 
		{
			$filelist.='{"filename":"' . $entry  .'"},';

			//. $entry; . '"},';
			//$afiles[$i++]= $entry;
		}

        }
    }
    closedir($handle);
}

echo ( rtrim($filelist, ",") . '] }' );
//echo ( '] }' );

?>