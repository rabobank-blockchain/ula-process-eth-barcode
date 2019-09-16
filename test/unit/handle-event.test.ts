/*
 * Copyright 2019 Coöperatieve Rabobank U.A.
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

import * as chai from 'chai'
import * as sinon from 'sinon'
import { ProcessEthBarcode } from '../../src'
import { BrowserHttpService, EventHandler, Message } from 'universal-ledger-agent'
import * as chaiAsPromised from 'chai-as-promised'
import * as sinonChai from 'sinon-chai'

before(() => {
  chai.should()
  chai.use(chaiAsPromised)
  chai.use(sinonChai)
})

describe('process barcode handle event process', function () {
  const httpService = new BrowserHttpService()
  const httpServiceResponse = { toAttest: [], toVerify: [] }
  const ulaMessageType = 'did:eth:address/qr'
  const ulaMessageUrl = 'https://example.com'
  const ulaMessage = new Message({ type: ulaMessageType, url: ulaMessageUrl })
  const sut = new ProcessEthBarcode(httpService)

  afterEach(() => {
    sinon.restore()
  })

  it('should always return "ignored" when the message type does not match', () => {
    const wrongMessage = new Message({ type: 'did:any:address', url: 'https://example.com' })
    const handleEventCall = sut.handleEvent(wrongMessage, undefined)
    return handleEventCall.should.eventually.equal('ignored')
  })

  it('should return "ignored" when the message does not contain an url property', () => {
    const incompleteMessage = new Message({ type: 'did:eth:address/qr' })
    const handleEventCall = sut.handleEvent(incompleteMessage, undefined)
    return handleEventCall.should.eventually.equal('ignored')
  })

  it('should throw when the plugin was not initialized', () => {
    const handleEvent = sut.handleEvent(ulaMessage, undefined)

    return handleEvent.should.eventually.be.rejectedWith('Plugin not initialized. Did you forget to call initialize() ?')
  })

  it('should call the endpoint properly, publish a new ulaMessage and complete', () => {
    const httpServiceGetRequestStub = sinon.stub(httpService, 'getRequest').resolves(httpServiceResponse)
    const eventHandler = new EventHandler([])
    const eventHandlerStub = sinon.stub(eventHandler, 'processMsg')
    const expectedUlaMessage = {
      type: 'process-challengerequest',
      endpoint: ulaMessageUrl,
      msg: httpServiceResponse
    }
    sut.initialize(eventHandler)

    const handleEvent = sut.handleEvent(ulaMessage, undefined)

    httpServiceGetRequestStub.should.have.been.calledWithExactly(ulaMessageUrl)
    return handleEvent.should.eventually.equal('completed').then(() => {
      // Check the eventHandler call after the async method finished
      return eventHandlerStub.lastCall.args[0].should.have.been.deep.equal(expectedUlaMessage)
    })
  })
})
