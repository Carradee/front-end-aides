# CSS stuff
make CSS easier to use

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
