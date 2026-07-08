module.exports = {
  extends: ["stylelint-config-standard-scss"],
  plugins: ["stylelint-order"],
  overrides: [
    {
      files: ["**/*.sass"],
      customSyntax: "postcss-sass",
    },
  ],
  rules: {
    "no-empty-source": null,

    "declaration-empty-line-before": null,

    "custom-property-empty-line-before": null,
    "custom-property-pattern": "^[a-z][a-z0-9_-]*(?:--[a-z][a-z0-9_-]*)*$",

    "selector-class-pattern": [
      "^([a-z][a-z0-9]*(?:-[a-z0-9]+)*)(__[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?(--[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?$",
      {
        message:
          "Use kebab-case BEM: block, block__element, block--modifier, or block__element--modifier",
      },
    ],

    "max-nesting-depth": [
      2,
      {
        ignore: ["blockless-at-rules", "pseudo-classes"],
        ignoreAtRules: ["supports", "container"],
      },
    ],

    "order/properties-order": [
      [
        {
          groupName: "positioning",
          emptyLineBefore: "never",
          noEmptyLineBetween: true,
          properties: ["position", "top", "right", "bottom", "left", "z-index"],
        },
        {
          groupName: "layout",
          emptyLineBefore: "always",
          noEmptyLineBetween: true,
          properties: [
            "display",
            "flex",
            "flex-direction",
            "justify-content",
            "align-items",
          ],
        },
        {
          groupName: "sizing",
          emptyLineBefore: "always",
          noEmptyLineBetween: true,
          properties: ["width", "height", "padding", "margin"],
        },
        {
          groupName: "appearance",
          emptyLineBefore: "always",
          noEmptyLineBetween: true,
          properties: [
            "background",
            "border",
            "border-radius",
            "box-shadow",
            "color",
          ],
        },
      ],
      {
        unspecified: "bottomAlphabetical",
      },
    ],
  },
};
