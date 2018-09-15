# Front-End Code


This repository includes:
* a polyfill for the HTML5 `<dialog>` tag
* a master stylesheet - revisions in testing
* CSS post processor - revisions in testing

## dialogs-polyfill.js

Use `<dialog>` tags in your HTML, give them unique ids, and link to those ids. Nothing else needed. The script edits the HTML, adds CSS classes, and injects CSS into the page head as necessary. View it on [CodePen](https://codepen.io/Carradee/full/eVGeqj).



## css-post-processor.php
A CSS postprocessor (written in PHP) that lets you code in individual files and will compile a single "style-min.css" file for you. Designed for vanilla CSS.



ALL SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
