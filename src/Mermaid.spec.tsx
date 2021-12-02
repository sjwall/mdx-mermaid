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
import renderer from 'react-test-renderer'

import mermaid from 'mermaid'

import { jest } from '@jest/globals'

const spy = {
  initialize: jest.spyOn(mermaid, 'initialize').mockImplementation(() => {}),
  contentLoaded: jest.spyOn(mermaid, 'contentLoaded').mockImplementation(() => {})
}

import { Mermaid } from './Mermaid'


afterEach(() => {
  jest.clearAllMocks()
})

it('renders without diagram', () => {
  const component = renderer.create(<Mermaid chart={''} />)
  expect(component.toJSON()).toMatchSnapshot()
  expect(spy.initialize).toBeCalledTimes(0)
  expect(spy.contentLoaded).toBeCalledTimes(0)
  component.update()
  expect(spy.contentLoaded).toHaveBeenCalled()
  expect(spy.initialize).toBeCalledTimes(0)
  component.update()
  expect(spy.contentLoaded).toBeCalledTimes(1)
  expect(spy.initialize).toBeCalledTimes(0)
})

it('renders with diagram', () => {
  const component = renderer.create(<Mermaid chart={`graph TD;
      A-->B;
      A-->C;
      B-->D;
      C-->D;`} />)
  expect(component.toJSON()).toMatchSnapshot()
  expect(spy.initialize).toBeCalledTimes(0)
  expect(spy.contentLoaded).toBeCalledTimes(0)
  component.update()
  expect(spy.contentLoaded).toHaveBeenCalled()
  expect(spy.initialize).toBeCalledTimes(0)
  component.update()
  expect(spy.contentLoaded).toBeCalledTimes(1)
  expect(spy.initialize).toBeCalledTimes(0)
})

it('renders with config', () => {
  const component = renderer.create(<Mermaid chart={`graph TD;
      A-->B;
      A-->C;
      B-->D;
      C-->D;`} config={{}} />)
  expect(component.toJSON()).toMatchSnapshot()
  expect(spy.initialize).toBeCalledTimes(0)
  expect(spy.contentLoaded).toBeCalledTimes(0)
  component.update()
  expect(spy.contentLoaded).toHaveBeenCalled()
  expect(spy.initialize).toBeCalledTimes(0)
  component.update()
  expect(spy.contentLoaded).toBeCalledTimes(1)
  expect(spy.initialize).toBeCalledTimes(0)
})

it('renders with mermaid config', () => {
  const component = renderer.create(<Mermaid chart={`graph TD;
      A-->B;
      A-->C;
      B-->D;
      C-->D;`} config={{ mermaid: { theme: 'dark' } } } />)
  expect(component.toJSON()).toMatchSnapshot()
  expect(spy.initialize).toBeCalledTimes(0)
  expect(spy.contentLoaded).toBeCalledTimes(0)
  component.update()
  expect(spy.contentLoaded).toHaveBeenCalled()
  expect(spy.initialize).toHaveBeenNthCalledWith(1, { startOnLoad: true, theme: 'dark' })
  component.update()
  expect(spy.contentLoaded).toBeCalledTimes(1)
  expect(spy.initialize).toBeCalledTimes(1)
})
