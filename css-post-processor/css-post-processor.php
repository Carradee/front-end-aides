<?php
/*
	CSS Postprocessor
	v. 1.0

	Compile all CSS files and overwrite style.css if it differs from source files.

	Misti Wolanski
	Carradee @ GitHub
	http://github.com/Carradee

	YOUR CSS FILES MUST BE ORDERED IN THE IN WHICH YOU WANT THEM TO CASCADE.

	Procedural paradigm intentional.

	Change Log:
		v. 0.2 - initial demo
		v. 1.0 - full release
*/


// if you have a specific order in which you want to order the CSS, set it here.
	function list_css_order() {

		$file_list = [];

		return $file_list;

	} // end function manual_CSS_loader


	function scan_css_directory() {
	
		// get list of files in order
			$ordered_files = list_css_order();

		// set up variables
			$dir = getcwd()."/css/";
			$scanned_files = scandir($dir);

		// remove directory files that shouldn't be included
			$expression_search = array(
				array("find" => "/^\..*/", "replacement" => ""),
				array("find" => "/.*\.php$/", "replacement" => ""),
				array("find" => "/^\..*/", "replacement" => ""),
				array("find" => "/"."style-min.css"."/", "replacement" => ""),
			);
			foreach ($expression_search as $row) {
				$scanned_files = preg_replace( $row['find'], $row['replacement'], $scanned_files );
			}
			$scanned_files = (!!$ordered_files)
				? array_filter(array_diff($scanned_files,$ordered_files))
				: array_filter($scanned_files)
				;
			
		// put the manually listed files on top
			$file_list = (!!$ordered_files)
				? array_values(array_merge($ordered_files, $scanned_files))
				: array_values($scanned_files)
				;
			
			return $file_list;
			
	} // end function scan_css_directory


	function load_css() {
	
		// set up variables
			$dir = getcwd()."/css/";
			$file_list = scan_css_directory();

		// get contents of all files
			$file_content = [];
			$i = 0;
			foreach ($file_list as $entry) {
				$file_content[$i] = file_get_contents($dir.$entry);
				$i++;
			} // foreach

		// convert all contents into a string
			return implode("\r\n", $file_content);

	} // end function load_css


	function strip_css_comments() {
	
		// get css from files
			$contents = load_css();
			
		// strip the comments via regex search
			$expression_search = array(
				array('find' => "/\/charset ['\"]utf-8['\"];/", 'replacement' => ""),
				array('find' => "/\s*\/\*[\w\W]*?\*\//", 'replacement' => ""),
				array('find' => "/([\w]*?,)\v([\w]*?)/", 'replacement' => "\1 \2"),
				array('find' => "/ (\v)/", 'replacement' => "\1"),
				array('find' => "/(,{;)\v/", 'replacement' => "\1"),
				array('find' => "/(,{;)\v/", 'replacement' => "\1"),
			);
			foreach ($expression_search as $row) {
				$contents = preg_replace( $row['find'], $row['replacement'], $contents );
			} // foreach

		// return comment-free contents
			return $contents;

	} // end function strip_css_comments($contents)


	function minify_css() {

		// get content with comments stripped
			$contents = strip_css_comments();

		// find & reserve any @imports; they'll be bumped to top of file
			preg_match_all( "@\@import.*@", $contents, $imports);

		// remove duplicates & erase empty entries from array
			$imports = array_filter(array_unique($imports));
			
		// convert array to string
			$import_header = (!$imports) ? '' : implode("\r\n",$imports)."\r\n";

		// set up & run regex search
			$expression_search = array(
				array("find" => "/@charset ['\"]utf-8['\"];\n*/", "replacement" => ""),
				array("find" => "/[\r\n][\r\n]+/", "replacement" => "\n"),
				array("find" => "/[\r\n][ \t]*/", "replacement" => ""),
				array("find" => "/ ?([:,{}>+]) ?/", "replacement" => "$1"),
				array("find" => "/(\@media)/", "replacement" => "\n$1"),
				array("find" => "/;}[a-z#,-\.]+?{}/", "replacement" => ";}"),
				array("find" => "/@media[,a-z0-9 \(\):-]*?{}[\r\n]?/", "replacement" => ""),
				array("find" => "/}[a-z]+{}/", "replacement" => "}"),
				array("find" => "/[\r\n]+/", "replacement" => ""),
			);
			foreach ($expression_search as $row) {
				$contents = preg_replace( $row['find'], $row['replacement'], $contents );
			}

		// restore @import rules
			$contents = $import_header . $contents;

		// return minified contents
			return $contents;

	} // end function minify_css()

// create the file

	function CSS_creator() {

		// set up variables
			$contents = minify_css();
			$dir = getcwd()."/css/";
			$destination_file = $dir."style-min.css";
			$contents = "@charset 'utf-8';\r\n" . $contents;

		// if file doesn't exist, create it
			$file_headers = @get_headers($destination_file);
			($file_headers[0] != 'HTTP/1.1 404 Not Found')
				?: fopen($destination_file, 'w') or die('Cannot open file: '.$destination_file)
				;

		// get current contents
			$current_contents = (file_exists($destination_file))
				? file_get_contents($destination_file)
				: ""
				;

		// check compiled contents against current ones and only replace if different
			( $contents === $current_contents )
				?: file_put_contents($destination_file, $contents);

	} // end function CSS_creator()

// Run script
	
	CSS_creator($css_content);

?>
