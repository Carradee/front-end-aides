<?php
/*
Melkor CSS Postprocessor
v. 0.01

Compile all CSS files and overwrite style.css if it differs from source files.

Misti Wolanski
Carradee @ GitHub
http://github.com/Carradee

YOUR CSS FILES MUST BE ORDERED IN THE NUMBER IN WHICH YOU WANT THEM TO CASCADE.
*/

// set up $test_content
if (isset($css_content)) {	
	$test_content = $css_content;
} else {
	$test_content = "";
}

// get $css_content
function CSS_from_scanned_directory() {
	$dir = dirname(__FILE__);
	$file_list = scandir($dir);
	$expression_search = array(
		array("needle" => "/.*\.php$/", "straw" => ""),
		array("needle" => "/^\..*/", "straw" => ""),
		array("needle" => "/style.css/", "straw" => ""),
	);
	foreach ($expression_search as $row) {
		$file_list = preg_replace( $row['needle'], $row['straw'], $file_list );
	}
	$file_list = array_filter($file_list);
	$file_content = array();
	$i = 0;
	foreach ($file_list as $entry) {
		$file_content[$i] = file_get_contents($entry);
		$i++;
	} // end foreach
	$file_content = implode("\r\n", $file_content);
	return $file_content;
} // end function CSS_from_scanned_directory

function CSS_from_manual_setup() {
	$file_content = array( // change the "file_get_contents" to manually select the various files you want to use.
		file_get_contents('example-style.css'),
		file_get_contents('example-style2.css'),
		file_get_contents('../css/example-style3.css'),
	); // end $css_content
	$file_content = implode("\r\n", $file_content);
	return $file_content;
} // end function CSS_from_manual_setup

/* set which method you want to use:
   - CSS_from_scanned_directory - to get files from a specific directory (by default, the one the script's in)
   - CSS_from_manual_setup - where you tell which specific files you want used
*/
$css_content = CSS_from_scanned_directory();

function CSS_minify($var) {
	// set up & run regex search
	$expression_search = array(
		array("needle" => "@\@charset ['\"]utf-8['\"];@", "straw" => ""),
		array("needle" => "@\n@", "straw" => ""),
		array("needle" => "@\t+@", "straw" => " "),
		array("needle" => "@ +@", "straw" => " "),
		array("needle" => "@ @", "straw" => " "),
		array("needle" => "@[  \t]*{@", "straw" => "{"),
		array("needle" => "@(\*\/)@", "straw" => "$1\n"),
		array("needle" => "@\/\*.*\*\/\n@", "straw" => ""),
		array("needle" => "@ *([;{},:]) +@", "straw" => "$1"),
		array("needle" => "@ *(\@media)@", "straw" => "\n$1"),
		array("needle" => "@(}).*{}\n@", "straw" => "$1"),
		array("needle" => "@.*{}\n@", "straw" => "\n"),
		array("needle" => "/@media (.*?){}/", "straw" => ""),
		array("needle" => "@\n\n+@", "straw" => "\n"),
	);
	foreach ($expression_search as $row) {
		$var = preg_replace( $row['needle'], $row['straw'], $var );
	}
//	echo "<h2>Testing CSS_minify()</h2>";
	return $var;
} // end function CSS_minify()

function CSS_creation($var) {
	// set up variables
	$destination_file = "style.css";
	$new_contents = "@charset 'utf-8';\r\n" . $var;
	$current_contents = file_get_contents($destination_file);
	echo str_replace("\r\n", "<br>", $new_contents);
	// test that contents differ
	if ( $new_contents !== $current_contents) {
		// create file
		file_put_contents($destination_file, $new_contents);
	} // end if
//	echo "<h2>Testing CSS_creation()</h2>";
} // end function CSS_creation()

// test contents and run functions
if ( $test_content !== $css_content ) {
	$css_content = CSS_minify($css_content);
	CSS_creation($css_content);
} // end if ( $test_content !== $css_content )
?>
