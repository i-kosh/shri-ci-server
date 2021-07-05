const fs = require('fs')
const { config } = require('dotenv')
config()

const isWSL = !!process.env.WSLENV
let gridIP = 'localhost'
if (isWSL) {
  try {
    const file = fs.readFileSync('/etc/resolv.conf', {
      encoding: 'utf8',
    })
    gridIP = file.match(/^nameserver (.*)$/m)[1]
  } catch (error) {
    console.error(error)
  }
}

/** @type {import('hermione').Config} */
const cfg = {
  baseUrl: `http://localhost:${process.env.PORT || 3030}`,
  gridUrl: process.env.SELENIUM_HUB_URL || `http://${gridIP}:4444/wd/hub`,

  browsers: {
    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
      },
    },
  },

  sets: {
    desktop: {
      files: 'tests',
      ignoreFiles: ['tests/plugins', 'tests/helpers'],
    },
  },

  plugins: {
    'html-reporter/hermione': {},
  },
}

// cfg.plugins[`${__dirname}/tests/plugins/url-decorator.js`] = {
//   query: {
//     test: 'test',
//   },
// }
// cfg.plugins[`${__dirname}/tests/plugins/set-test-cookies.js`] = {
// }

// console.log(cfg)

module.exports = cfg
