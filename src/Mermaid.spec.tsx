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
import React from 'react'
import renderer from 'react-test-renderer'

import mermaid from 'mermaid'

import { jest } from '@jest/globals'

const spy = {
  initialize: jest.spyOn(mermaid, 'initialize').mockImplementation(() => {}),
  render: jest.spyOn(mermaid, 'render').mockImplementation(() => {})
}

import { Mermaid } from './Mermaid'
import {
  DARK_THEME_KEY,
  HTML_THEME_ATTRIBUTE,
  LIGHT_THEME_KEY
} from './theme.helper'
import * as ThemeHelper from './theme.helper'


async function waitFor (ms: number) {
  return new Promise<void>(resolve => {
    setTimeout(() => resolve(), ms)
  })
}


afterEach(() => {
  jest.clearAllMocks()
})

it('renders without diagram', () => {
  const component = renderer.create(<Mermaid chart={''} />)
  expect(component.toJSON()).toMatchSnapshot()
  expect(spy.initialize).toBeCalledTimes(0)
  expect(spy.render).toBeCalledTimes(0)
  component.update()
  expect(spy.render).toHaveBeenCalled()
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
      C-->D;`} />)
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

it('renders with config', () => {
  const component = renderer.create(<Mermaid chart={`graph TD;
      A-->B;
      A-->C;
      B-->D;
      C-->D;`} config={{}} />)
  expect(component.toJSON()).toMatchSnapshot()
  expect(spy.initialize).toBeCalledTimes(0)
  expect(spy.render).toBeCalledTimes(0)
  component.update()
  expect(spy.render).toHaveBeenCalled()
  expect(spy.initialize).toBeCalledTimes(1)
  component.update()
  expect(spy.render).toBeCalledTimes(1)
  expect(spy.initialize).toBeCalledTimes(1)
})

it('renders with mermaid config', () => {
  const component = renderer.create(<Mermaid chart={`graph TD;
      A-->B;
      A-->C;
      B-->D;
      C-->D;`} config={{ mermaid: { theme: 'dark' } } } />)
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
            C-->D;`} />
    </html>)
  expect(mermaid.initialize).toBeCalledTimes(0)
  expect(mermaid.render).toBeCalledTimes(0)
  component.update()
  expect(mermaid.render).toBeCalledTimes(1)
  expect(mermaid.initialize).toBeCalledTimes(1)
  component.update()
  expect(mermaid.render).toBeCalledTimes(1)
  expect(mermaid.initialize).toBeCalledTimes(1)

  component.update(
    <html data-theme='dark'>
      <Mermaid chart={`graph TD;
            A-->B;
            A-->C;
            B-->D;
            C-->D;`} />
        </html>)

  // Time for mutation observer to notice change.
  await waitFor(2000)

  expect(mermaid.render).toBeCalledTimes(2)
  expect(mermaid.initialize).toBeCalledTimes(2)
})

it('renders the output of mermaid into the div', async () => {
  const expectedOutput = 'mermaid output'
  mermaid.render = jest.fn((_, __, cb) => {
    if (cb) cb(expectedOutput, () => 0)
    return expectedOutput
  })

  let component: any
  renderer.act(() => {
    component = renderer.create(
      <Mermaid chart={`graph TD;
            A-->B;
            A-->C;
            B-->D;
            C-->D;`} />
    )
  })

  expect(mermaid.initialize).toBeCalledTimes(1)
  expect(mermaid.render).toBeCalledTimes(1)
  expect(component.toJSON()).toMatchSnapshot()
})

describe('changing the theme at runtime', () => {
  let useRefSpy: jest.SpyInstance
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
    const getThemeSpy = jest.spyOn(ThemeHelper, 'getTheme')
    renderer.act(() => {
      renderer.create(
        <Mermaid chart={`graph TD;
              A-->B;
              A-->C;
              B-->D;
              C-->D;`} />
      )
    })

    await renderer.act(async () => {
      html.setAttribute(HTML_THEME_ATTRIBUTE, DARK_THEME_KEY)
      await waitFor(1000)
    })

    expect(getThemeSpy.mock.calls.length).toBeGreaterThan(2)
  })

  it('does not react to non-theme attribute changes of html', async () => {
    const getThemeSpy = jest.spyOn(ThemeHelper, 'getTheme')
    renderer.act(() => {
      renderer.create(
        <Mermaid chart={`graph TD;
              A-->B;
              A-->C;
              B-->D;
              C-->D;`} />
      )
    })

    await renderer.act(async () => {
      html.setAttribute('manifest', 'some-value')
      await waitFor(1000)
    })
    expect(getThemeSpy).toHaveBeenCalledTimes(2)
  })
})
