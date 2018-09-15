// ====================================
// dialogs-polyfill.js
// Use the dialog element easily!
// ====================================
// created in February 2018 by Misti Wolanski | http://mistiwolanski.com
// =======================================
/*
	HOW THIS SCRIPT WORKS:
	This script scans your page for use of the `<dialog>` element. If a dialog is on the 
	page, the script then revises that element to make it functional across browsers, 
	adjusting the dialog content for needed HTML and adding necessary CSS into the 
	`<style>` tag in the document head. (It works whether or not you're already using 
	the `<style>` tag, without losing what you have there.)
	
	The script ONLY runs through if BOTH criteria are met:
	  1. You have a dialog in the page.
	  2. You have a link to the dialog in the page.
	
	If both those criteria are not met, the script aborts.

	The end element is responsive and uses the following classes:
	  * in the dialog:
		  `.dialog`
		  `.dialog-header`
		  `.dialog-content`
		  `.dialog-footer` (only for screen readers)
	  * on the pertinent links:
		  `.open-dialog`
		  `.close-dialog`
		
	You can edit the CSS settings by revising the multidimensional array `css_array`. I
	have included a comment by the variable that shows the logic in the array.

	To change the backdrop behind the dialog box, edit
	`"background-color" : "rgba(21,21,21,0.75)"` in the `css_array` variable.

	To change the coloring on the X that closes the dialog, if `yourChoice` is the color 
	you want, you'll change the following items:

	  * for general color:
		 Edit the "color" of `.dialog-header` a in the `css_array`.
	  * for on-hover:
		 Edit the "color" of `.dialog-header a:hover` in the `css_array`.

	You can change the human-readability vs. minification of the generated CSS that's 
	injected into the document head by changing dialog_css(Boolean).

	  * dialog_css() or dialog_css(true) = minified
	  * dialog_css(false) = human-readable

	NO POLYFILLS SHOULD BE NECESSARY.
	
	(This cross-compatibility thing is why I used `var` instead of `let`.)
	
=======================================
	
	TESTED WITH:
		* Opera 51 for Mac
		* Chrome 64 for Mac
		* Firefox 57 & 58 for Mac
		
	This script is provided as-is without any guarantee that it'll work for your 
	situation. I cannot guarantee that it won't conflict with anything on your page, 
	though I did my best to make it as stand-alone as I could.

=======================================

	TO DO:
	  * Do MOAR testing of browsers!

=======================================

	NOTES ON USAGE:
	 * Wrappers are used for easy collapsing, for the sake of debugging and readability.
	 * This script uses underscores rather than camel case.
	 * For loops are used instead of Array.forEach due to increased speed/performance.

=======================================

	INDEX OF FUNCTIONS IN THIS DOCUMENT:
	 * polyfills() - runs polyfills needed by the dialog polyfill
	 	  - String.prototype.includes

	 * set_up_dialog_element() - runs the polyfill
	 — support functions (can be useful elsewhere)
	 * add_class(element, class_names)
	 * remove_class(element, class_names)
	 * set_attr(element, attributes, value = null)
	 * create(element, name_space = '')
	 * get_em(parent = '') - get item size; if empty, get default font size
	 * svg_x(parent) - creates a "x" drawn via SVG and placed in parent
	 — associated functions (required parts of set_up_dialog_element())
	 * dialog_listener()
	 * dialog_open_check(dialog)
	 * dialog_length_check(dialog)
	 * dialog_show_active(dialog)
	 * dialog_css(minified = true) - injects the CSS
	 * dialog_html(dialog) - injects the HTML
*/

// ===============================================
// POLYFILLS
// ===============================================

	(function polyfills() { // sets up polyfills needed for this script
		'use strict';
		//developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
		if (!String.prototype.includes) {
			String.prototype.includes = function(search, start) {
			 if (typeof start !== 'number') { start = 0; }
			 if (start + search.length > this.length) {
				return false;
			 } else {
				return this.indexOf(search, start) !== -1;
			 }
			};
		} // if (!String.prototype.includes)
	})(); // polyfills()

// ===============================================
// core function used to set up the dialog element
// ===============================================

	(function set_up_dialog_element() {
		"use strict";
		if (document.querySelectorAll('dialog')) { // if page has `dialog` tags
			var dialogs = document.querySelectorAll('dialog');
		
			dialog_css(); // inject CSS in page, if necessary
			document.addEventListener('keydown', dialog_listener, false);

			// for each `<dialog>`in pageÉ
			// dialogs.forEach(function(dialog){});
			for ( var i = 0; i < dialogs.length; i++) {
				var dialog = dialogs[i];

				// make sure all dialogsÉ
				dialog_html(dialog);  // inject HTML so it displays properly
				dialog_length_check(dialog); // add class adjustment for long dialog boxes
				dialog_open_check(dialog);   // test if a dialog is open already
				dialog_show_active(dialog);  // have aria-hidden

				// [all links in page] | (find & edit links to dialog in page)
				// document.querySelectorAll('a').forEach(function(a){});
				for ( var j = 0; j < document.querySelectorAll('a').length; j++) {
					var a = document.querySelectorAll('a')[j];
					if (a.href.includes("#"+dialog.id)) {
						add_class(a, "open-dialog");
						a.setAttribute("data-dialog", dialog.id);
						a.addEventListener('click', dialog_listener, false);
					} // if (a.href.includes("#"+dialog.id))
				} // end for loop for all anchors in document

				// [all links in dialogs] | (edit links in dialog to return to page)
				// dialog.querySelectorAll('a').forEach(function(a){});
				for ( var j = 0; j < dialog.querySelectorAll('a').length; j++) {
					var a = dialog.querySelectorAll('a')[j];
					if (!a.href) {
						add_class(a, "close-dialog");
						a.setAttribute("data-dialog", dialog.id);
						a.addEventListener('click', dialog_listener, false);
					} // if (a.href == window.location.href)
				} // end for loop for all anchors in document

			} // end for loop for all dialogs in document
		} // if page has `<dialog>`
	})(); // run function set_up_dialog_element()

// ===============================================
// support functions used in set_up_dialog_element
// ===============================================

	function add_class(element, class_names) {
		if (typeof class_names == 'string') { class_names = [class_names]; }
		var class_name;
		// class_names.forEach(function(class_name)
		for ( var i = class_names.length - 1; i >= 0; i--) {
			class_name = class_names[i];
			// modern:
			element.classList.add(class_name);
			// fallback:
			if (element.className.indexOf(class_name) === -1) {
				element.className += class_name;
			} // if
		} // for each class_names
	} // add_class(element, class_name)

	function remove_class(element, class_names) {
		if (typeof class_names == 'string') { class_names = [class_names]; }
		if ( element.style == '' ) { element.removeAttribute("style"); }
		// class_names.forEach(function(class_name)
		for ( var i = class_names.length - 1; i >= 0; i--) {
			var class_name = class_names[i];
			// modern:
			if (element.classList.contains(class_name)) {
				element.classList.remove(class_name);
			}
			// fallback:
			if (element.className.indexOf(class_name) !== -1) {
				var regex = "([a-z0-9-\s]*)";
				var replace = new RegExp(regex+class_name+regex,"gi");
				element.className = element.className.replace(replace, '$1 $2');
			} // if
		} // for each class_names
		var classes = element.classList || element.className;
		if ( classes == '' ) { element.removeAttribute("class"); }
	} // remove_class(element, class_name)

	function set_attr(element, attributes, value) {
		var value = value || null; // default parameter, IE compatible
		if ((value !== null) && (typeof attributes == 'string')) { // if 3 values are passed
			element.setAttribute(attributes, value);
		} else { // if a multidimensional array is passedÉ
			if (typeof attributes == 'string') { attributes = [attributes]; }
			for (var key in attributes) {
				element.setAttribute(key, attributes[key]);
			} // for (var key in attributes)
		} // if 3 values are passed instead of multidimensional array
	} // set_attr(element, attributes)

	function create(element, namespace_link) {
		var namespace_link = namespace_link || ''; // default parameter, IE compatible
		// if namespace isn't given, check element
		if (namespace_link === '' ) {
			if (element === 'svg') { namespace_link = 'http://www.w3.org/2000/svg'; }
			if (element === 'xhtml') { namespace_link = 'http://www.w3.org/1999/xhtml'; }
			if (element === 'xlink') { namespace_link = 'http://www.w3.org/1999/xlink'; }
		} // if (namespace_link === '' )
		// create element appropriately
		if (namespace_link === '' ) {
			return document.createElement(element);
		} else { // if namespace is given, use it
			return document.createElementNS(namespace_link, element);
		} // if (namespace_link === '' )
	} // create(element, namespace_link = '')

	function get_em(parent) {
		var parent = parent || '';  // default parameter, IE compatible
		var element = document.querySelectorAll(parent + 'p')[0] ||
			document.querySelectorAll(parent + ':first-child')[0];
		// https://www.eriwen.com/javascript/measure-ems-for-layout/
		return Number(getComputedStyle(element, '').fontSize.match(/(\d+(\.\d+)?)px$/)[1]);
	} // get_em(parent = '')

	function svg_x(parent) {
		var src = "http://www.w3.org/2000/svg";
		var svg = parent.appendChild(create("svg",src));
		var size = get_em(); // get assumed size for 1em-ish
		var attributes = [];

		{ // set attributes for & on svg
			attributes = {
				"width" : size,
				"height" : size,
				"viewBox" : "0 0 "+size+" "+size,
				"fill" : "none",
				"stroke" : "currentColor",
				"stroke-width" : ".2em",
				"stroke-linecap" : "round"
			};
			set_attr(svg, attributes);
		} // set attributes for & on svg
		{ // draw in svg
			svg.appendChild(create("line",src));
			{ // set attributes for & on child
				attributes = {
					"x1" : "0",
					"y1" : "0",
					"x2" : "100%",
					"y2" : "100%"
				};
				set_attr(svg.children[0], attributes);
			} // set attributes for & on child
			{ // set attributes for & on child
			svg.appendChild(create("line",src));
				attributes = {
					"x1" : "0",
					"y1" : "100%",
					"x2" : "100%",
					"y2" : "0"
				};
				set_attr(svg.children[1], attributes);
			} // set attributes for & on child
		} // draw in svg
	} // function svg_x(parent)

// ===============================================
// associated functions for set_up_dialog_element
// ===============================================

	function dialog_listener(event) {
		'use strict';
		var event = event || window.event; // default parameter, IE compatible
		var dialog = null;
		var run = false;
		var id;

		// if click
		if ( event.type === "click" ) { // if clickedÉ get associated dialog
			var a = event.target || event.srcElement;
			if (a.tagName != 'A'){ a = a.parentElement; }
			var custom_attr = "data-dialog";
			id = a.getAttribute(custom_attr) || a.parentElement.getAttribute(custom_attr);
			if(id) { run = true; }
		} // if ( event.type === "click" )

		// if key command
		if ( event.type === "keydown" ) { // if key pressedÉ get open dialog
			if ( (event.keyCode == '27') || (event.keyCode == '32') ) { // if esc or space
				run = true;
			} // if
		} // if ( event.type === "keydown" )

		dialog = document.querySelector("dialog[open]") || document.getElementById(id) || null;
		if (dialog === null) { // fallback for Firefox
			var dialogs = document.querySelectorAll('dialog');
			for ( var i = 0; i < dialogs.length; i++) {
				if (!dialogs[i].hasAttribute("aria-hidden")) {
					dialog = dialogs[i];
					break;
				} // if
			} // for loop for all dialogs in document
		} // if (dialog === null)

		if (dialog !== null && run == true) { // if dialog variable has been setÉ
			// if triggered
			var scroll_position = window.pageYOffset || document.documentElement.scrollTop;
			var dialog_open = dialog.open || !dialog.hasAttribute("aria-hidden") || false;

			switch ( dialog_open ) {
				case false:
					dialog.open = true;
				break;
				case true:
				default:
					dialog.open = false;
				break;
			} // switch ( dialog.open )

			dialog_show_active(dialog);

			window.location.replace("#"); // removes ID from URL
			// slice off the remaining '#' in HTML5:    
			if (typeof window.history.replaceState == 'function') {
			  history.replaceState({}, '', window.location.href.slice(0, -1));
			}
			if(scroll_position){
				document.documentElement.scrollTop = document.body.scrollTop = scroll_position;
			}
		} // if (dialog)

	} // dialog_listener()

	function dialog_open_check(dialog){ // tests if dialog is already open
		'use strict';
		var replace = new RegExp(".*#","gi");
		var check = window.location.href.replace(replace, '');
		if(check === dialog.id) { dialog.open = true; }
	} // dialog_open_check(dialog)

	function dialog_length_check(dialog){ // tests dialog length
		var adjusted = false;

		if (dialog.style.display !== "block") { // open if not already open
			adjusted = true;
			dialog.style.visibility = "hidden"; // but don't let it show
			dialog.style.display = "block";
		} // if

		if (dialog.scrollHeight > dialog.clientHeight) { // if dialog content > dialog height
			add_class(dialog.children[0], "long");
		} // if

		if (adjusted == true ) { // if style attributes were added, remove 'em
			dialog.removeAttribute("style"); // reset
		}

	} // dialog_length_check(dialog)

	function dialog_show_active(dialog) {
		var body = body || document.body.body || document.body; // catch for frames
		var dialog_open = dialog.open || dialog.getAttribute("open") || false;

		switch ( dialog_open ) {
			case true:
				add_class(body, "freeze"); // adds a class that keeps body from scroll
				dialog.removeAttribute("aria-hidden");
			break;
			case false:
					remove_class(body, "freeze");
					dialog.setAttribute("aria-hidden", "");
			break;
			default:
		} // switch (dialog.open)
	} // dialog_show_active(dialog)

	function dialog_css(minified = true) {
		minified = minified | true; // fallback for IE & Edge
		// test to see if the CSS has already been added to the page & only run if not
		var inserted = inserted | false; // test to see if this has run already
		if ( inserted == false ) { // if it hasn't been runÉ
			{ // set up variables & data
				var style = document.createElement('style');
				var nl = "\r\n";
				var dialog_css = '';
				var contents = '';
				// set up array of CSS settings
				var css_array = {
				/*
				variable = : {
					"media" : {
						"element" : {
							"attribute" : "value",
							"attribute" : "value",
						},
						"element" : {
							"attribute" : "value",
							"attribute" : "value",
						}
					}
				}
				*/
					"all" : { // media query
						".freeze" : {
							"overflow-y" : "hidden",
						},
						"dialog::backdrop" : {
							"background" : "transparent",
						},
						"dialog" : {
							"background-color" : "rgba(21,21,21,0.75)",
							"display" : "none",
							"background-attachment" : "fixed",
							"width" : "100%",
							"min-height" : "100%",
							"z-index" : "15",
							"position" : "fixed",
							"top" : "0",
							"left" : "0",
							"bottom" : "0",
							"right" : "0",
						},
						"dialog:target" : {
							"display" : "block",
						},
						"dialog a" : {
							"color" : "inherit",
							"cursor" : "inherit",
						},
						".dialog" : {
							"word-wrap" : "normal",
							"height" : "auto",
							"z-index" : "1000",
							"position" : "absolute",
							"left" : "50%",
							"background" : "#fff",
							"display" : "flex",
							"flex-direction" : "column",
							"justify-content" : "space-between",
						},
						".dialog-header" : {
							"text-align" : "right",
							"margin" : "0",
							"padding" : "0 .3rem .5rem .5rem",
						},
						".dialog-header a" : {
							"height" : "100%",
							"z-index" : "1100",
							"text-decoration" : "none",
							"font-weight" : "bold",
							"transition" : "all .2s linear 0s",
						},
						".dialog-header a:hover" : {
							"color" : "#666",
							"text-decoration" : "inherit",
						},
						".dialog-content" : {
							"max-width" : "100%",
							"overflow-y" : "scroll",
							"margin" : "0 0 1.5em 0",
							"padding" : ".5em 2.5em",
						},
						".dialog-content h2" : {
							"text-align" : "center",
						},
						".dialog-content h3" : {
							"margin" : "0",
						},
						".dialog-content > :first-child" : {
							"margin-top" : "0",
						},
						".dialog-content > :last-child" : {
							"margin-bottom" : "0",
						},
						".dialog-content figure img" : {
							"max-width" : "200px",
						},
						".dialog-content table" : {
							"width" : "100%",
							"margin" : "1em 0",
							"box-shadow" : "none",
						},
						".dialog-content form" : {
							"width" : "100%",
							"margin" : "1em 0",
							"box-shadow" : "none",
						},
						".dialog-footer" : {
							"display" : "none",
							"padding" : ".5em",
						},
						".dialog-footer p" : {
							"text-align" : "center",
						},
					}, // @media all
					"(min-width: 1001px), (min-height: 1001px)" : {
						".dialog" : {
							"width" : "60%",
							"margin" : "5% 0 5% -30%",
							"max-height" : "90%",
							"width" : "60vw",
							"margin" : "5vh 0 5vh -30vw",
							"max-height" : "90vh",
						},
						".dialog.long" : {
							"top" : "5%",
							"bottom" : "5%",
							"top" : "5vh",
							"bottom" : "5vh",
						},
					}, // @media (min-width: 1001px), (min-height: 1001px)
					"(max-width: 1000px), (max-height: 1000px)" : {
						".dialog" : {
							"width" : "80%",
							"margin" : "2.5% 0 2.5% -40%",
							"max-height" : "95%",
							"width" : "80vw",
							"margin" : "2.5vh 0 2.5vh -40vw",
							"max-height" : "95vh",
						},
						".dialog.long" : {
							"top" : "2.5%",
							"bottom" : "2.5%",
							"top" : "2.5vh",
							"bottom" : "2.5vh",
						},
					}, // @media (max-width: 1000px), (max-height: 1000px)
					"(max-width: 500px), (max-height: 500px)" : {
						"body" : {
							"margin" : "0",
						},
						".dialog" : {
							"width" : "100%",
							"margin" : "0 0 0 -50%",
							"max-height" : "100%",
							"width" : "100vw",
							"margin" : "0 0 0 -50vw",
							"max-height" : "100vh",
						},
						".dialog.long" : {
							"top" : "0",
							"bottom" : "0",
						},
						".dialog-header" : {
							"padding" : "0 .5rem",
						},
						".dialog-content" : {
							"padding" : ".5rem 1rem 1rem",
						},
					}, // @media (max-width: 500px), (max-height: 500px)
					"print" : {
						".dialog" : {
							"width" : "100%",
							"margin" : "0 0 0 -50%",
							"max-height" : "100%",
							"width" : "100vw",
							"margin" : "0 0 0 -50vw",
							"max-height" : "100vh",
						},
					}, // @media print
					"speech" : {
						".dialog-footer" : {
							"display" : "block",
						},
					}, // @media print
				} // css_array
			
			} // set up variables

			// convert data settings to css
			// 2 versions: human-readable and minified
			if (minified == false) {
				for (var media_query in css_array) {
					dialog_css += "@media " + media_query + " {" + nl;
					for (var element in css_array[media_query]) {
						dialog_css += "  " + element + " {" + nl;
						for (var attribute in css_array[media_query][element]) {
							dialog_css += "	 " + attribute+" : " + 
								css_array[media_query][element][attribute]+";" + nl;
						} // for (attribute in css_array[media_query][element])
						dialog_css += "  }" + nl;
					} // for (element in css_array[media_query])
					dialog_css += "} /* @media " + media_query + " */" + nl;
				} // for (var media_query in css_array)
			} else { // if (minified = true)
				for (var media_query in css_array) {
					dialog_css += "@media " + media_query + "{";
					for (var element in css_array[media_query]) {
						dialog_css += element + "{";
						for (var attribute in css_array[media_query][element]) {
							dialog_css += attribute+":" + 
								css_array[media_query][element][attribute]+";";
						} // for (attribute in css_array[media_query][element])
						dialog_css += "}";
					} // for (element in css_array[media_query])
					dialog_css += "}";
				} // for (var media_query in css_array)			
			} // if (minified = false)

			// if style tag already exists in head, pull its contents & remove
			if ( document.querySelectorAll('style') ) { // if style tag existsÉ
				var style_tag = document.head.querySelectorAll('style')[0];
				dialog_css = style_tag.innerHTML + nl + nl + dialog_css;
				style_tag.parentNode.removeChild(style_tag);
			} // if ( document.head.querySelectorAll('style') )

			// add contents to created style tag & inject in document head
			style.innerHTML = dialog_css;
			document.querySelectorAll('head')[0].appendChild(style);
		inserted = true; // yep, I've been run
		} //  if ( inserted = false )
	} // dialog_css()

	function dialog_html(dialog) { // revise dialogs to add HTML for polyfill
		// test to see if this has run already
		if ( dialog.inserted !== true ) { // TO-DO: this handling needs compatibility check
			{ // variable setup
				var all_content;
				var visible_content;
				var header;
				var body;
				var footer;
				var a;
			} // variable setup
			// get dialog content
				all_content = dialog.innerHTML;
			// remove dialog innards temporarily
				dialog.innerHTML = '';
			// add dialog box area (leaving <dialog> as wrapper, forcing background overlay)
				dialog.appendChild(create('div')).classList.add('dialog');
				visible_content = dialog.children[0];
			// inject header & content
				var header = visible_content.appendChild(create('header'));
				header.classList.add('dialog-header');
				a = header.appendChild(create('a')); // link to close dialog
				a.setAttribute("href",''); // needed for Firefox
				svg_x(a); // insert svg x inside link
			// inject body & content
				body = visible_content.appendChild(create('section'));
				body.classList.add('dialog-content');
				body.innerHTML = all_content;
			// inject footer & content (specifically for screen readers)
				footer = visible_content.appendChild(create('footer'));
				footer.classList.add('dialog-footer');
				a = footer.appendChild(create('p')).appendChild(create('a'));
				a.setAttribute('href','');
				a.innerHTML = "Close this window by selecting this paragraph, tapping the escape key, or tapping the space bar.";
			dialog.inserted = true;
		} //  if ( dialog.inserted !== true )

	} // dialog_html(dialog)
