const fs = require("fs");
const path = require("path");
const camelCase = require("camelcase");
const { icon, toHtml } = require("@fortawesome/fontawesome-svg-core");
const allBrandsIcons = require("@fortawesome/free-brands-svg-icons");
const allSolidIcons = require("@fortawesome/free-solid-svg-icons");
const allRegularIcons = require("@fortawesome/free-regular-svg-icons");

let symbols = {};

function _getAttrs(obj) {
  let attrs = ``;
  const attrKeys = Object.keys(obj);

  if (attrKeys.length > 0) {
    attrs = `${attrKeys.map(key => ` ${key}="${obj[key]}"`).join("")}`;
  }
  return attrs;
}

function writeSvg() {
  const outputPath = `${path.resolve(process.cwd(), "./dist")}/fa-icons.svg`;
  const symbolsHtml = `${Object.keys(symbols)
    .map(iconId => symbols[iconId])
    .join(`\n`)}`;
  const output = `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">${symbolsHtml}</svg>`;
  fs.writeFileSync(outputPath, output, `utf-8`);
}

const TYPES = ["solid", "regular", "brand"];
const LIST_FORMATTER = new Intl.ListFormat("en", {
  style: "short",
  type: "disjunction"
});
const LIST_FORMATTER_TYPES = new Intl.ListFormat("en", {
  style: "short",
  type: "conjunction"
});

function getIconSet(type = "solid", canBeNull = false) {
  let iconSet = null;
  switch (type) {
    case "solid":
      iconSet = allSolidIcons;
      break;
    case "regular":
      iconSet = allRegularIcons;
      break;
    case "brand":
      iconSet = allBrandsIcons;
      break;
    default:
      iconSet = canBeNull ? null : allSolidIcons;
      break;
  }
  return iconSet;
}

function getAvailableIcons(type, log = true) {
  if (!TYPES.includes(type)) {
    console.warn(
      `FontAwesomeIcon:: you specified the type '${type}' for the icon '${name}'. The "type" parameter must be one of: ${LIST_FORMATTER.format(
        TYPES
      )}.`
    );
    return;
  }
  let iconSet = getIconSet(type, true);
  if (!iconSet) {
    if (log) {
      console.warn(
        `FontAwesomeIcon:: No icons available for the type: '${type}'.`
      );
    }
    return false;
  }
  let availableIcons = Object.keys(iconSet)
    .map((i, idx) => (idx > 2 ? iconSet[i].iconName : false))
    .filter(Boolean);
  if (log) {
    console.log(
      `FontaAwesomeIcon:: available icons for the type '${type}' are:\n${LIST_FORMATTER_TYPES.format(
        availableIcons
      )}`
    );
  }
  return availableIcons;
}

function isIconAvailable(name, type) {
  if (!TYPES.includes(type)) {
    console.warn(
      `FontAwesomeIcon:: you specified the type '${type}' for the icon '${name}'. The "type" parameter must be one of: ${LIST_FORMATTER.format(
        TYPES
      )}.`
    );
    return;
  }
  let availableIcons = getAvailableIcons(type, false);
  if (!availableIcons) {
    return console.warn(
      `FontAwesomeIcon:: couldn't find the icon set for the type '${type}'.`
    );
  }
  const faName = camelCase(name, { pascalCase: false });
  if (availableIcons.includes(faName)) {
    return console.log(
      `FontAwesomeIcon:: yes, the icon '${faName}' is available in type '${type}'.`
    );
  } else {
    let result = `FontAwesomeIcon:: no, the icon '${name}' is not available in type '${type}'`;
    type = type === `regular` ? `solid` : `regular`;
    availableIcons = getAvailableIcons(type, false);
    if (availableIcons.includes(faName)) {
      result = `${result}, but it is available in the type '${type}'.`;
    } else {
      result = `${result}.`;
    }
    return console.warn(result);
  }
}

function FontAwesomeIcon({ name, type = "solid", tag = "i", ...rest }) {
  if (!TYPES.includes(type)) {
    console.warn(
      `FontAwesomeIcon:: you specified the type ${type} for the icon ${name}. The "type" parameter must be one of: ${LIST_FORMATTER.format(
        TYPES
      )}. Setting the type to be "solid".`
    );
    type = "solid";
  }
  const faName = camelCase(name, { pascalCase: true });
  const iconName = `fa${faName}`;
  let iconSet = getIconSet(type);
  let attrClass = rest.class ? ` ${rest.class}` : ``;
  delete rest.class;

  let attrs = _getAttrs(rest);
  let faIcon = icon(iconSet[iconName], { symbol: true });
  if (!faIcon) {
    const newType = type === "solid" ? "regular" : "solid";
    iconSet = getIconSet(newType);
    faIcon = icon(iconSet[iconName], { symbol: true });
    if (!faIcon) {
      console.warn(
        `FontAwesomeIcon:: you tried to use the icon ${name} with type ${type}, but it doesn't exist in the free version of FontAwesome. You can check available types in your  .eleventy.js file - see the docs.`
      );
      return `<${tag} class="icon${attrClass}"${attrs}>${iconName}</${tag}>`;
    } else {
      console.warn(
        `FontAwesomeIcon:: you tried to use the icon ${name} with type ${type}, but it didn't exist. Used the ${newType} version instead.`
      );
    }
  }

  let faIconId = `${faIcon.prefix}-fa-${faIcon.iconName}`;
  let svgSymbol;

  if (!symbols[faIconId]) {
    svgSymbol = toHtml(
      icon(iconSet[iconName], { symbol: true }).abstract[0].children[0]
    );
    symbols[faIconId] = svgSymbol;
    writeSvg();
  }
  return `<${tag} class="icon${attrClass}"${attrs}><svg><use xlink:href="/fa-icons.svg#${faIconId}"></use></svg></${tag}>`;
}

module.exports = { FontAwesomeIcon, getAvailableIcons, isIconAvailable };
