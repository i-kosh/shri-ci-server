/** @typedef {import('../../src/server/utils/extractCookies').AvailableCookie} AvailableCookies */
/** @typedef {import('webdriverio').Browser<async} Browser */

/**
 * @param {AvailableCookies | [AvailableCookies]} cookies
 * @param {Browser} browser
 */
const setCookies = async (cookies, browser) => {
  await browser.url('/404')
  await browser.setCookies(cookies)
}

module.exports = setCookies
