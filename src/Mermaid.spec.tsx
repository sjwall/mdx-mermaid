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
import { Mermaid } from './Mermaid'

jest.mock('mermaid')

afterEach(() => {
  jest.clearAllMocks()
})

it('renders without diagram', () => {
  const component = renderer.create(<Mermaid chart={''} />)
  expect(component.toJSON()).toMatchSnapshot()
  expect(mermaid.initialize).toBeCalledTimes(0)
  expect(mermaid.contentLoaded).toBeCalledTimes(0)
  component.update()
  expect(mermaid.contentLoaded).toHaveBeenCalled()
  expect(mermaid.initialize).toBeCalledTimes(0)
  component.update()
  expect(mermaid.contentLoaded).toBeCalledTimes(1)
  expect(mermaid.initialize).toBeCalledTimes(0)
})

it('renders with diagram', () => {
  const component = renderer.create(<Mermaid chart={`graph TD;
      A-->B;
      A-->C;
      B-->D;
      C-->D;`} />)
  expect(component.toJSON()).toMatchSnapshot()
  expect(mermaid.initialize).toBeCalledTimes(0)
  expect(mermaid.contentLoaded).toBeCalledTimes(0)
  component.update()
  expect(mermaid.contentLoaded).toHaveBeenCalled()
  expect(mermaid.initialize).toBeCalledTimes(0)
  component.update()
  expect(mermaid.contentLoaded).toBeCalledTimes(1)
  expect(mermaid.initialize).toBeCalledTimes(0)
})

it('renders with config', () => {
  const component = renderer.create(<Mermaid chart={`graph TD;
      A-->B;
      A-->C;
      B-->D;
      C-->D;`} config={{}} />)
  expect(component.toJSON()).toMatchSnapshot()
  expect(mermaid.initialize).toBeCalledTimes(0)
  expect(mermaid.contentLoaded).toBeCalledTimes(0)
  component.update()
  expect(mermaid.contentLoaded).toHaveBeenCalled()
  expect(mermaid.initialize).toBeCalledTimes(0)
  component.update()
  expect(mermaid.contentLoaded).toBeCalledTimes(1)
  expect(mermaid.initialize).toBeCalledTimes(0)
})

it('renders with mermaid config', () => {
  const component = renderer.create(<Mermaid chart={`graph TD;
      A-->B;
      A-->C;
      B-->D;
      C-->D;`} config={{ mermaid: { theme: 'dark' } } } />)
  expect(component.toJSON()).toMatchSnapshot()
  expect(mermaid.initialize).toBeCalledTimes(0)
  expect(mermaid.contentLoaded).toBeCalledTimes(0)
  component.update()
  expect(mermaid.contentLoaded).toHaveBeenCalled()
  expect(mermaid.initialize).toHaveBeenNthCalledWith(1, { startOnLoad: true, theme: 'dark' })
  component.update()
  expect(mermaid.contentLoaded).toBeCalledTimes(1)
  expect(mermaid.initialize).toBeCalledTimes(1)
})
