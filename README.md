# CSS stuff
make CSS easier to use

## master-stylesheet
**version: 0.01**
A master stylesheet project, intended to normalize site appearance across browsers.

### all.css
The parts of the reset that focus on all types of screens.

### print.css
The parts of the reset specific to printed documents. (Or, in some setups, saving as PDF.)

## melkor
**version: 0.01**

### css-postprocessor
A CSS postprocessor (written in PHP) that lets you code in individual files and will compile a single "style.css" file for you. **If style.css exists, it will be overwritten.**

As it is now, it will scan the directory it's in and will auto-compile a list of all CSS files (except for "style.css"). **This means you must number your CSS files so they cascade properly.**

## more features and such in the works

ALL SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
