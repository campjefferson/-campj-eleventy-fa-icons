# Eleventy FontAwesome Icon

A configurable Eleventy shortcode that outputs FontAwesome icon svgs in a custom svg sprite.

## Usage

### Installation

`npm install --save-dev @campj/eleventy-fa-icons`

### Adding to Eleventy

in .eleventy.js:

```js
// require
const { FontAwesomeIcon } = require("@campj/eleventy-fa-icons");
module.exports = function(config) {
  // Shortcode
  config.addNunjucksShortcode("FontAwesomeIcon", FontAwesomeIcon);
  //
};
```

### In any nunjucks template file:

#### Use the shortcode:

```
{% FontAwesomeIcon
    name = "times",
    type = "solid",
    class = "someClassName",
    style = "font-size:24px"
%}
```

#### Props:

- **name:** the icon name
- **type:** the icon type (one of "solid", "regular" or "brand") -- defaults to **solid**
- **class:** additional classes to append to the icon wrapper
- **tag:** the type of html tag you'd like to use to output the icon

\*\* other properties will get applied to the wrapper tag as attributes

### CSS

Default styles for an icon can be imported from `@campj/eleventy-fa-icons/icon.css`;
They are pretty bare bones, so feel free to use them or not:

```css
.icon svg {
  display: block;
  width: 1em;
  height: 1em;
}
```

## Utility Methods

### _getAvailableIcons(type)_

#### Props:

- **type:** the icon type (one of "solid", "regular" or "brand")

#### Usage

```js
const { getAvailableIcons } = require("@campj/eleventy-fa-icons");

getAvailableIcons("solid"); // outputs a list of icon names for the 'solid' type
getAvailableIcons("regular"); // outputs a list of icon names for the 'regular' type
getAvailableIcons("brand"); // outputs a list of icon names for the 'brand' type
```

### _isIconAvailable(name, type)_

#### Props:

- **name:** the icon name
- **type:** the icon type (one of "solid", "regular" or "brand")

#### Usage

```js
const { isIconAvailable } = require("@campj/eleventy-fa-icons");
// checks whether the icon "times" is available in the "regular" type
isIconAvailable("times", "regular");
```

would output the following to the console:

```
FontAwesomeIcon:: no, the icon 'times' is not available in type regular, but it is available in the type solid.
```
