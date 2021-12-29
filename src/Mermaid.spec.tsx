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
  expect(mermaid.initialize).toBeCalledTimes(0)
  expect(mermaid.render).toBeCalledTimes(0)
  component.update()
  expect(mermaid.render).toHaveBeenCalled()
  expect(mermaid.initialize).toBeCalledTimes(1)
  component.update()
  expect(mermaid.render).toBeCalledTimes(1)
  expect(mermaid.initialize).toBeCalledTimes(1)
})

it('renders with diagram', () => {
  const component = renderer.create(<Mermaid chart={`graph TD;
      A-->B;
      A-->C;
      B-->D;
      C-->D;`} />)
  expect(mermaid.initialize).toBeCalledTimes(0)
  expect(mermaid.render).toBeCalledTimes(0)
  component.update()
  expect(mermaid.render).toBeCalledTimes(1)
  expect(mermaid.initialize).toBeCalledTimes(1)
  component.update()
  expect(mermaid.render).toBeCalledTimes(1)
  expect(mermaid.initialize).toBeCalledTimes(1)
})

it('renders with config', () => {
  const component = renderer.create(<Mermaid chart={`graph TD;
      A-->B;
      A-->C;
      B-->D;
      C-->D;`} config={{}} />)
  expect(mermaid.initialize).toBeCalledTimes(0)
  expect(mermaid.render).toBeCalledTimes(0)
  component.update()
  expect(mermaid.render).toHaveBeenCalled()
  expect(mermaid.initialize).toBeCalledTimes(1)
  component.update()
  expect(mermaid.render).toBeCalledTimes(1)
  expect(mermaid.initialize).toBeCalledTimes(1)
})

it('renders with mermaid config', () => {
  const component = renderer.create(<Mermaid chart={`graph TD;
      A-->B;
      A-->C;
      B-->D;
      C-->D;`} config={{ mermaid: { theme: 'dark' } } } />)
  expect(mermaid.initialize).toBeCalledTimes(0)
  expect(mermaid.render).toBeCalledTimes(0)
  component.update()
  expect(mermaid.render).toHaveBeenCalled()
  expect(mermaid.initialize).toHaveBeenNthCalledWith(1, { startOnLoad: true, theme: 'dark' })
  component.update()
  expect(mermaid.render).toBeCalledTimes(1)
  expect(mermaid.initialize).toBeCalledTimes(1)
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
  await new Promise((resolve) => setTimeout(resolve, 2000))

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
