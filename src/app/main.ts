import { buildStore as buildIt, Prototype, render } from 'prodom'
import './blog.article.css'
import Editor from './editor'
import { darkIcon, devIcon } from './icons'
import icon from '../icon-trans.png'
export interface BlogArticleProps {
  dark: boolean
}

const article: BlogArticleProps = {
  dark:
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches,
}

const createBlogArticle = (
  { dark }: BlogArticleProps,
  { setDark }: BlogActions,
): Prototype<HTMLBodyElement> => {
  const darkModeDOM: Prototype<HTMLDivElement> = {
    tag: 'div',
    className: ['control'],
    style: { backgroundColor: dark ? '#bbb' : '#666' },
    onclick: () => setDark(!dark),

    children: [darkIcon(dark, '#666', '#bbb')],
  }

  const headerDOM: Prototype<HTMLDivElement> = {
    tag: 'div',
    className: ['header'],
    children: [darkModeDOM],
  }

  const container = {
    tag: 'div',
    className: ['blog-article-container', dark && 'dark'],
    children: [
      Editor(
        `{
    					tag:'div',

    children: [
			{
				tag: 'input',
				// className: ['input'],
				type: 'text',
				name: 'message',
				placeholder: 'message',

			},
			{
				tag: 'button',
				type:'submit',
				// className: ['button'],
				// set the text to send
				innerText: 'send',
				// set the action to send the message
				onclick: () => {
					// get message from input
					const message = document.querySelector('input[name="message"]')
					// send message
					sendMessage(message.value)

				}

			},
			{
				tag:'br',
			},
			{
				tag:'div',
				className:['messages'],
				id:'messages',

			}
			
		],			
}`,
        'Chat History',
        'https://codepen.io/m3ftah/pen/PopdwaG',

        dark,
      ),
      Editor(
        `{
    					tag:'div',

    children: [
			{
				tag: 'input',
				// className: ['input'],
				type: 'text',
				name: 'parse',
				placeholder: 'parse',

			},
			{
				tag: 'button',
				type:'submit',
				// className: ['button'],
				innerText: 'send',
				onclick: () => {
					// get message from input
					const parse = document.querySelector('input[name="parse"]')
					// send message
					sendParser(parse.value)

				}

			},
			{
				tag:'br',
			},
			{
				tag:'div',
				className:['parsed'],
				id:'parsed',

			}
			
		],			
}`,
        'Parser',
        'https://codepen.io/m3ftah/pen/PopdwaG',

        dark,
      )
    ],
  }
  const padding = {
    tag: 'div',
    className: ['padding', dark && 'dark'],
  }
  return {
    init: () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => {
          const mode = e.matches
          setDark(mode)
        })
      return document.createElement('body')
    },
    className: ['blog-article-page', dark && 'dark'],
    children: [headerDOM, container, padding],
  }
}
type BlogActions = {
  setDark: (dark: boolean) => void
}
const actions = (state: BlogArticleProps): BlogActions => ({
  setDark: (dark: boolean) => {
    state.dark = dark
  },
})
export default render(buildIt(createBlogArticle, actions, article)(), {})
