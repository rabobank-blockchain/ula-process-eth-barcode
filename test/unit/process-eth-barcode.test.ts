/*
 * Copyright 2020 Coöperatieve Rabobank U.A.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { assert } from 'chai'
import { ProcessEthBarcode } from '../../src'
import { BrowserHttpService, EventHandler } from 'universal-ledger-agent'

describe('process barcode requestData, name and initialize', function () {
  const httpService = new BrowserHttpService()
  let sut = new ProcessEthBarcode(httpService)

  afterEach(() => {
    sut = new ProcessEthBarcode(httpService)
  })

  it('should return a hardcoded name', () => {
    const pluginName = 'ProcessBarcode'
    const result = sut.name
    assert.strictEqual(result, pluginName)
  })

  it('should initialize with a valid eventhandler object', () => {
    const eventHandler = new EventHandler([])
    const initAction = () => {
      sut.initialize(eventHandler)
    }
    assert.doesNotThrow(initAction)
  })
})
