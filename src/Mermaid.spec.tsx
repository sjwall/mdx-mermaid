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

import { Mermaid } from './Mermaid'

it('renders without diagram', () => {
  const component = renderer.create(<Mermaid chart={''} />)
  expect(component.toJSON()).toMatchSnapshot()
})

it('renders with diagram', () => {
  const component = renderer.create(<Mermaid chart={`graph TD;
      A-->B;
      A-->C;
      B-->D;
      C-->D;`} />)
  expect(component.toJSON()).toMatchSnapshot()
})
