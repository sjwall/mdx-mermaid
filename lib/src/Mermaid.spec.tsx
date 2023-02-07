/**
 * @jest-environment jsdom
 */
/**
 * Copyright (c) Samuel Wall.
 *
 * This source code is licensed under the MIT license found in the
 * license file in the root directory of this source tree.
 */
import React from 'react'
import { act, render, RenderResult } from '@testing-library/react'
import mermaid from 'mermaid'
import { jest } from '@jest/globals'
import { Mermaid } from './Mermaid'
import {
  DARK_THEME_KEY,
  HTML_THEME_ATTRIBUTE,
  LIGHT_THEME_KEY
} from './theme.helper'

describe('Mermaid', () => {
  const spy = {
    initialize: jest.spyOn(mermaid, 'initialize').mockImplementation(jest.fn()),
    contentLoaded: jest.spyOn(mermaid, 'contentLoaded').mockImplementation(jest.fn())
  }

  const diagram = `graph TD;
  A-->B;
  A-->C;
  B-->D;
  C-->D;`

  afterEach(() => {
    jest.clearAllMocks()
  })

  const removeUniqueness = (element: Element) => {
    element.querySelectorAll('style').forEach((v) => v.remove())
    element.querySelectorAll('svg').forEach((v) => {
      v.removeAttribute('id')
      v.parentElement!.removeAttribute('id')
    })
  }

  const expectMermaidMatch = (result: RenderResult) => {
    removeUniqueness(result.baseElement)
    expect(result.baseElement.parentElement).toMatchSnapshot()
    return result
  }

  it('renders without diagram', () => {
    expectMermaidMatch(render(<Mermaid chart={''} config={{}} />))
  })

  it('renders with diagram', () => {
    expectMermaidMatch(render(<svg><Mermaid chart={diagram} config={{}} /></svg>))
  })

  it('renders with diagram change', () => {
    const config = {}
    jest.useFakeTimers()
    const view = expectMermaidMatch(render(<Mermaid chart={diagram} config={config} />))
    view.rerender(<Mermaid chart={`graph TD;
  D-->C;
  D-->B;
  C-->A;
  B-->A;`} config={config} />)
    jest.advanceTimersByTime(1000)
    expectMermaidMatch(view)
    expect(spy.contentLoaded).toBeCalledTimes(3)
    expect(spy.initialize).toBeCalledTimes(1)
    jest.useRealTimers()
  })

  it('initializes only once', () => {
    expectMermaidMatch(render(<>
      <Mermaid chart={'foo'} config={{}} />
      <Mermaid chart={'bar'} />
    </>))
    expect(spy.contentLoaded).toBeCalledTimes(1)
    expect(spy.initialize).toBeCalledTimes(1)
  })

  it('renders with mermaid config', () => {
    expectMermaidMatch(render(<Mermaid chart={diagram} config={{ mermaid: { theme: 'dark' } }} />))
    expect(spy.contentLoaded).toBeCalledTimes(1)
    expect(spy.initialize).toBeCalledWith({ startOnLoad: true, theme: 'dark' })
  })

  it('renders with mermaid config change', () => {
    const view = expectMermaidMatch(render(<Mermaid chart={diagram} config={{ mermaid: { theme: 'dark' } }} />))
    view.baseElement.querySelectorAll('div.mermaid').forEach((v) => {
      v.setAttribute('data-processed', 'true')
    })
    expect(spy.contentLoaded).toBeCalledTimes(1)
    expect(spy.initialize).toBeCalledWith({ startOnLoad: true, theme: 'dark' })
    view.rerender(<Mermaid chart={diagram} config={{ mermaid: { theme: 'forest' } }} />)
    // await waitFor(1000)
    expectMermaidMatch(view)
    expect(spy.contentLoaded).toBeCalledTimes(2)
    expect(spy.initialize).toHaveBeenNthCalledWith(2, { startOnLoad: true, theme: 'forest' })
  })

  it('renders with string mermaid config', () => {
    expectMermaidMatch(render(<Mermaid chart={diagram} config={JSON.stringify({ mermaid: { theme: 'dark' } })} />))
    expect(spy.contentLoaded).toBeCalledTimes(1)
    expect(spy.initialize).toBeCalledWith({ startOnLoad: true, theme: 'dark' })
  })

  it('re-renders mermaid theme on html data-theme attribute change', () => {
    const component = render(
      <Mermaid chart={diagram} config={{}} />)

    expectMermaidMatch(component)
    expect(spy.contentLoaded).toBeCalledTimes(1)
    expect(spy.initialize).toBeCalledTimes(1)

    act(() => document.querySelector('html')!.setAttribute(HTML_THEME_ATTRIBUTE, DARK_THEME_KEY))

    expectMermaidMatch(component)

    expect(spy.contentLoaded).toBeCalledTimes(1)
    expect(spy.initialize).toBeCalledTimes(1)

    act(() => document.querySelector('html')!.setAttribute(HTML_THEME_ATTRIBUTE, LIGHT_THEME_KEY))

    expectMermaidMatch(component)
  })

  it('does not react to non-theme attribute changes of html', () => {
    const component = render(<Mermaid chart={diagram} config={{}} />)

    expectMermaidMatch(component)
    expect(spy.contentLoaded).toBeCalledTimes(1)
    expect(spy.initialize).toBeCalledTimes(1)

    act(() => document.querySelector('html')!.setAttribute('manifest', 'some-value'))

    expectMermaidMatch(component)
  })
})
