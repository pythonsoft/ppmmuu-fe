module.exports = {
  "root": true,
  "parser": "babel-eslint",
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": 6
  },
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": "airbnb-base",
  "plugins": [
      "html"
  ],
  "settings": {
    "import/resolver": {
      "webpack": {
        "config": "build/webpack.base.conf.js"
      }
    }
  },
  "rules": {
    "import/extensions": ["error", "always", {
      "js": "never",
      "vue": "never"
    }],
    "import/no-extraneous-dependencies": ["error", {
      "optionalDependencies": ["test/unit/index.js"]
    }],
    "no-unused-vars": 0,
    "global-require": 0,
    "comma-dangle": ["error", "never"],
    "object-property-newline": "warn",
    "object-shorthand": ["error", "methods"],
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
    "no-param-reassign": 0,
    "prefer-const": "warn",
    "no-unused-expressions": 0,
    "no-lonely-if": 0,
    "no-underscore-dangle": 0,
    "func-names": 0,
    "max-len": ["error", 100, { "ignoreComments": true, "ignoreUrls": true, "ignoreStrings": true }],
    "camelcase": 'off'
  }
};
