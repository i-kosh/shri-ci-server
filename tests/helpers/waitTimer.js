/** @typedef {import('webdriverio').Browser<async} Browser */

/**
 * @param {number} timer
 * @param {Browser} browser
 */
const waitTimer = async (timer, browser) => {
  await browser.waitUntil(() => {
    return new Promise((res) => {
      setTimeout(() => {
        res(true)
      }, timer)
    })
  })
}

module.exports = waitTimer
