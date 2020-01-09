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

import { HttpService, EventHandler, Message, Plugin } from 'universal-ledger-agent'

export class ProcessEthBarcode implements Plugin {
  private _eventHandler?: EventHandler = undefined

  public constructor (private _httpService: HttpService) {
  }

  /**
   * The name of the plugin
   * @return {string}
   */
  get name () {
    return 'ProcessBarcode'
  }

  /**
   * Receive the eventHandler so we can put messages
   * back on the ULA again
   * @param {EventHandler} eventHandler
   */
  public initialize (eventHandler: EventHandler): void {
    this._eventHandler = eventHandler
  }

  /**
   * Handle incoming messages
   * @param {Message} message
   * @param callback
   * @return {Promise<string>}
   */
  public async handleEvent (message: Message, callback: any): Promise<string> {
    if (!message.properties.type.match(/(did:eth:[A-Za-z0-9]*\/qr)|(ethereum-qr)/g)) {
      return 'ignored' // This message is not intended for us
    }

    if (!message.properties.url) {
      return 'ignored' // The message type is correct, but url is missing
    }

    if (!this._eventHandler) {
      throw new Error('Plugin not initialized. Did you forget to call initialize() ?')
    }

    // Call the endpoint to get the Challenge Request
    const challengeRequestJson = await this._httpService.getRequest(message.properties.url)

    const ulaMessage = {
      type: 'process-challengerequest',
      msg: challengeRequestJson
    }

    // Send the Challenge Request to the next plugin
    await this._eventHandler.processMsg(ulaMessage, callback)

    return 'completed'
  }
}

export default ProcessEthBarcode
