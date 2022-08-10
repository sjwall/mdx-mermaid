/**
 * @jest-environment jsdom
 */
/**
 * Copyright (c) Samuel Wall.
 *
 * This source code is licensed under the MIT license found in the
 * license file in the root directory of this source tree.
 */
import mermaid from 'mermaid'
import type mermaidAPI from 'mermaid/mermaidAPI'
import React from 'react'
import renderer from 'react-test-renderer'

import { jest } from '@jest/globals'

const spy = {
  initialize: jest.spyOn(mermaid, 'initialize').mockImplementation(jest.fn()),
  render: jest.spyOn(mermaid, 'render').mockImplementation((id_, chart_, callback) => {
    callback!('content', (element_) => {})
    return 'content'
  })
}

import { Mermaid } from './Mermaid'
import {
  DARK_THEME_KEY,
  HTML_THEME_ATTRIBUTE,
  LIGHT_THEME_KEY
} from './theme.helper'

async function waitFor(ms: number) {
  return new Promise<void>(resolve => {
    setTimeout(() => resolve(), ms)
  })
}

afterEach(() => {
  jest.clearAllMocks()
})

it('renders without diagram', () => {
  const component = renderer.create(<Mermaid chart={''} config={{}} />)
  expect(spy.initialize).toBeCalledTimes(0)
  expect(spy.render).toBeCalledTimes(0)
  component.update()
  expect(spy.render).toBeCalledTimes(1)
  expect(spy.initialize).toBeCalledTimes(1)
  component.update()
  expect(spy.render).toBeCalledTimes(1)
  expect(spy.initialize).toBeCalledTimes(1)
})

it('renders with diagram', () => {
  const component = renderer.create(<Mermaid chart={`graph TD;
      A-->B;
      A-->C;
      B-->D;
      C-->D;`} config={{}} />)
  expect(component.toJSON()).toMatchSnapshot()
  expect(spy.initialize).toBeCalledTimes(0)
  expect(spy.render).toBeCalledTimes(0)
  component.update()
  expect(spy.render).toBeCalledTimes(1)
  expect(spy.initialize).toBeCalledTimes(1)
  component.update()
  expect(spy.render).toBeCalledTimes(1)
  expect(spy.initialize).toBeCalledTimes(1)
})

it('initializes only once', async () => {
  const component = renderer.create(<>
    <Mermaid chart={'foo'} config={{}} />
    <Mermaid chart={'bar'} />
  </>)
  expect(spy.initialize).toBeCalledTimes(0)
  expect(spy.render).toBeCalledTimes(0)
  await waitFor(1000)
  component.update()
  expect(spy.render).toBeCalledTimes(2)
  expect(spy.initialize).toBeCalledTimes(1)
  component.update()
  expect(spy.render).toBeCalledTimes(2)
  expect(spy.initialize).toBeCalledTimes(1)
})

it('renders with mermaid config', () => {
  const component = renderer.create(<Mermaid chart={`graph TD;
      A-->B;
      A-->C;
      B-->D;
      C-->D;`} config={{ mermaid: { theme: 'dark' as mermaidAPI.Theme } }} />)
  expect(component.toJSON()).toMatchSnapshot()
  expect(spy.initialize).toBeCalledTimes(0)
  expect(spy.render).toBeCalledTimes(0)
  component.update()
  expect(spy.render).toHaveBeenCalled()
  expect(spy.initialize).toHaveBeenNthCalledWith(1, { startOnLoad: true, theme: 'dark' })
  component.update()
  expect(spy.render).toBeCalledTimes(1)
  expect(spy.initialize).toBeCalledTimes(1)
})

it('re-renders mermaid theme on html data-theme attribute change', async () => {
  const component = renderer.create(
    <html data-theme='light'>
      <Mermaid chart={`graph TD;
            A-->B;
            A-->C;
            B-->D;
            C-->D;`} config={{}} />
    </html>)
  expect(component.toJSON()).toMatchSnapshot()
  expect(spy.initialize).toBeCalledTimes(0)
  expect(spy.render).toBeCalledTimes(0)
  component.update()
  expect(spy.render).toBeCalledTimes(1)
  expect(spy.initialize).toBeCalledTimes(1)
  component.update()
  expect(spy.render).toBeCalledTimes(1)
  expect(spy.initialize).toBeCalledTimes(1)

  component.update(
    <html data-theme='dark'>
      <Mermaid chart={`graph TD;
            A-->B;
            A-->C;
            B-->D;
            C-->D;`} config={{}} />
    </html>)

  // Time for mutation observer to notice change.
  await waitFor(2000)

  expect(spy.render).toBeCalledTimes(2)
  expect(spy.initialize).toBeCalledTimes(2)
})

describe('changing the theme at runtime', () => {
  let useRefSpy: unknown
  let html: HTMLHtmlElement

  beforeEach(() => {
    html = document.createElement('html')
    html.setAttribute(HTML_THEME_ATTRIBUTE, LIGHT_THEME_KEY)
    useRefSpy = jest.spyOn(document, 'querySelector').mockReturnValue(html)
  })

  afterEach(() => {
    expect(useRefSpy).toHaveBeenCalled()
  })

  it('reacts to changed theme', async () => {
    renderer.act(() => {
      renderer.create(
        <Mermaid chart={`graph TD;
              A-->B;
              A-->C;
              B-->D;
              C-->D;`} config={{}} />
      )
    })

    await renderer.act(async () => {
      html.setAttribute(HTML_THEME_ATTRIBUTE, DARK_THEME_KEY)
      await waitFor(1000)
    })

    expect(spy.initialize).toHaveBeenNthCalledWith(1, {"startOnLoad": true, "theme": "default"})
    expect(spy.initialize).toHaveBeenNthCalledWith(2, {"startOnLoad": true, "theme": "dark"})
  })

  it('does not react to non-theme attribute changes of html', async () => {
    renderer.act(() => {
      renderer.create(
        <Mermaid chart={`graph TD;
              A-->B;
              A-->C;
              B-->D;
              C-->D;`} config={{}} />
      )
    })

    await renderer.act(async () => {
      html.setAttribute('manifest', 'some-value')
      await waitFor(1000)
    })

    expect(spy.initialize).toHaveBeenCalledWith({"startOnLoad": true, "theme": "default"})
  })
})
