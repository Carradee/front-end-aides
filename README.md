# Front-End Code


This repository includes:
* a polyfill for the 
**THESE ITEMS ARE IN REVISION.** I've not yet prepped the edits in a releasable way.
* a master stylesheet
* CSS post processor

To come:

* a JS & CSS polyfill for the HTML5 `<dialog>` tag

## javascript-aides
Scripts from my personal JS library that I find worth sharing.

### dialogs-polyfill.js
Use `<dialog>` tags in your HTML, give them unique ids, and link to those ids. Nothing else needed. The script edits the HTML, adds CSS classes, and injects CSS into the page head as necessary. View it on [CodePen](https://codepen.io/Carradee/full/eVGeqj).

## master-stylesheet
**version: 0.01**
A master stylesheet project, intended to normalize site appearance across browsers.

### -melkor-reset.css
This is the reset file. Should work fine just with install—but some of the things it overrides or converts to default can cause problems on some setups. (Ex. `:focus` is overridden.) *This includes setup for printed pages.*

### -morgoth-defaults.css
This is the the tag default stylesheet made to go with *melkor-reset.css*. Adjust as warranted to suit your project. Includes some options.

## css-post-processors
CSS postprocessor, written in PHP.

### composite-processor.php
A CSS postprocessor (written in PHP) that lets you code in individual files and will compile a single "style.css" file for you. **This is designed for install in your CSS directory.**

TO USE:
* Number your CSS files in the order you want them to cascade. (I have a recommendation for this, but it's part of a bigger file-handling method that is in process.)
* Add to your css folder and run the script. Style.css will be generated, for use in your site.

**If style.css exists, it will be overwritten.**

## more features and such in the works

ALL SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
