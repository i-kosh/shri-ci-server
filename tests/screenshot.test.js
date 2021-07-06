const setCookies = require('./helpers/setCookies')
const waitTimer = require('./helpers/waitTimer')

describe('Тестирование компонентов скриншотами', function () {
  it('футер', async function () {
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

    const footer = await browser.$('.page__footer')
    await footer.waitForDisplayed()

    await browser.assertView('footer', '.page__footer', {
      allowViewportOverflow: true,
    })

    await browser.deleteAllCookies()
  })

  it('заголовок главной страницы когда нет настроек', async function () {
    const browser = this.browser

    await setCookies(
      [
        {
          name: 'testMockApi',
          value: 'test',
        },
        {
          name: 'testNoSettings',
          value: 'test',
        },
      ],
      browser
    )
    await browser.url('/')
    await waitTimer(1000, browser)

    const header = await browser.$('header')
    await header.waitForDisplayed()

    await browser.assertView('header', 'header')

    await browser.deleteAllCookies()
  })

  it('контент главной страницы когда нет настроек', async function () {
    const browser = this.browser

    await setCookies(
      [
        {
          name: 'testMockApi',
          value: 'test',
        },
        {
          name: 'testNoSettings',
          value: 'test',
        },
      ],
      browser
    )
    await browser.url('/')
    await waitTimer(1000, browser)

    const main = await browser.$('main')
    await main.waitForDisplayed()

    await browser.assertView('main', 'main')

    await browser.deleteAllCookies()
  })

  it('форма настроек когда нет настроек', async function () {
    const browser = this.browser

    await setCookies(
      [
        {
          name: 'testMockApi',
          value: 'test',
        },
        {
          name: 'testNoSettings',
          value: 'test',
        },
      ],
      browser
    )
    await browser.url('/settings')
    await waitTimer(1000, browser)

    const main = await browser.$('main')
    await main.waitForDisplayed()

    await browser.assertView('main', 'main')

    await browser.deleteAllCookies()
  })

  it('форма настроек', async function () {
    const browser = this.browser

    await setCookies(
      [
        {
          name: 'testMockApi',
          value: 'test',
        },
      ],
      browser
    )
    await browser.url('/settings')
    await waitTimer(1000, browser)

    const main = await browser.$('main')
    await main.waitForDisplayed()

    await browser.assertView('main', 'main')

    await browser.deleteAllCookies()
  })

  it('заголовок страницы настроек', async function () {
    const browser = this.browser

    await setCookies(
      [
        {
          name: 'testMockApi',
          value: 'test',
        },
      ],
      browser
    )
    await browser.url('/settings')
    await waitTimer(1000, browser)

    const header = await browser.$('header')
    await header.waitForDisplayed()

    await browser.assertView('header', 'header')

    await browser.deleteAllCookies()
  })

  it('заголовок главной страницы', async function () {
    const browser = this.browser

    await setCookies(
      [
        {
          name: 'testMockApi',
          value: 'test',
        },
      ],
      browser
    )
    await browser.url('/')
    await waitTimer(1000, browser)

    const header = await browser.$('header')
    await header.waitForDisplayed()

    await browser.assertView('header', 'header', {
      allowViewportOverflow: true,
    })

    await browser.deleteAllCookies()
  })

  it('заголовок страницы билда', async function () {
    const browser = this.browser

    await setCookies(
      [
        {
          name: 'testMockApi',
          value: 'test',
        },
      ],
      browser
    )
    await browser.url('/build/test-build-id')
    await waitTimer(1000, browser)

    const header = await browser.$('header')
    await header.waitForDisplayed()

    await browser.assertView('header', 'header')

    await browser.deleteAllCookies()
  })

  it('форма добавления нового билда', async function () {
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

    await waitTimer(600, browser)
    await browser.assertView('newbuild', '.newbuild')

    await browser.deleteAllCookies()
  })

  it('форма добавления нового билда c текстом', async function () {
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

    const input = await browser.$('.newbuild__input')
    await input.waitForClickable()
    await input.click()
    await input.keys('test build hash')

    await browser.assertView('newbuild', '.newbuild')

    await browser.deleteAllCookies()
  })

  it('карточка билда в списке', async function () {
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

    await browser.assertView('buildCard', '.build-list__item')

    await browser.deleteAllCookies()
  })

  it('карточка билда на странице билда', async function () {
    const browser = this.browser

    await setCookies(
      {
        name: 'testMockApi',
        value: 'test',
      },
      browser
    )
    await browser.url('/build/test-build-id')
    await waitTimer(1000, browser)

    await browser.assertView('buildCard', '.build-card')

    await browser.deleteAllCookies()
  })

  it('лог странице билда', async function () {
    const browser = this.browser

    await setCookies(
      {
        name: 'testMockApi',
        value: 'test',
      },
      browser
    )
    await browser.url('/build/test-build-id')
    await waitTimer(1000, browser)

    await browser.assertView('log', '.log')

    await browser.deleteAllCookies()
  })
})
