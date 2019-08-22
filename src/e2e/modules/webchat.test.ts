import expectp from 'expect-puppeteer'
import { Page } from 'puppeteer'

import { clickOn, expectMatch, fillField, getPage, gotoAndExpect } from '..'
import { bpConfig } from '../../../jest-puppeteer.config'

// Required to ensure the bot has enough time to answer
// @ts-ignore
expectp.setDefaultOptions({ timeout: 3000 })

const getMessageCount = async (page: Page): Promise<number> => {
  return (await page.$$('.bpw-chat-bubble')).length
}

const getLastMessage = async (page: Page): Promise<string> => {
  const messages = await page.$$('.bpw-chat-bubble >div:last-child')
  const jsHandle = await messages[0].getProperty('innerText')
  return jsHandle.jsonValue()
}

describe('Module - Channel Web', () => {
  let page: Page

  beforeAll(async () => {
    page = await getPage()
  })

  describe('Chat', () => {
    it('Open chat window with shortlink', async () => {
      await gotoAndExpect(`${bpConfig.host}/s/${bpConfig.botId}`, `${bpConfig.host}/lite/${bpConfig.botId}/`)
    })

    it('Start conversation', async () => {
      await fillField('#input-message', 'Much automated!')
      await clickOn('#btn-send')
    })

    it('Testing Context discussion ', async () => {
      await clickOn('button', { text: 'What is a Context?' })
      await expectMatch(`Let's talk about animals`)
      await clickOn('button', { text: 'Monkey' })
      await expectMatch(`Please ask questions about that animal`)
    })

    it('Reset conversation', async () => {
      await clickOn('#btn-reset')
      await expectMatch(`Reset the conversation`)
    })

    it('Create new conversation', async () => {
      await clickOn('#btn-conversations')
      await clickOn('#btn-convo-add')
      await expect(await getMessageCount(page)).toBe(0)
    })
  })
})