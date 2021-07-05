const URI = require('urijs')

/**
 * @param {import('hermione').Worker} hermione
 * @param {{query?: string}} options
 */
const urlDecorator = (hermione, options) => {
  hermione.on(hermione.events.NEW_BROWSER, (browser) => {
    browser.overwriteCommand('url', (originalFn, uri) => {
      uri = uri ? new URI(uri).addQuery(options.query).toString() : uri

      originalFn(uri)
    })
  })
}

module.exports = urlDecorator
