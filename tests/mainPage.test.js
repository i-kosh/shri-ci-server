const assert = require('chai').assert
const URI = require('urijs')

const setCookies = require('./helpers/setCookies')
const waitTimer = require('./helpers/waitTimer')

describe('Главная страница', function () {
  it('можно добавить новый билд', async function () {
    const browser = this.browser

    await setCookies(
      {
        name: 'testMockApi',
        value: 'test',
      },
      browser
    )
    await browser.url('/')
    await waitTimer(1000, browser)

    const runBildButtonContainer = await browser.$('.run-build-button-desktop')
    const runBuildButton = await runBildButtonContainer.$('.button')

    await runBuildButton.waitForClickable()
    await browser.elementClick(runBuildButton.elementId)

    const executeBtn = await browser.$('.newbuild__run')
    const input = await browser.$('.newbuild__input')

    await input.waitForClickable()
    await input.click()
    await input.keys('test build')

    await executeBtn.waitForExist()
    await executeBtn.waitForClickable()
    await executeBtn.click()

    const currUrl = new URI(await browser.getUrl())

    assert.strictEqual(currUrl.path(), '/build/test-build-id')
  })
})
