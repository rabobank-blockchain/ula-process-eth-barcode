"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const message_type_1 = require("./model/message-type");
class ProcessEthBarcode {
    constructor(_httpService) {
        this._httpService = _httpService;
        this._eventHandler = undefined;
    }
    /**
     * The name of the plugin
     * @return {string}
     */
    get name() {
        return 'ProcessBarcode';
    }
    /**
     * Receive the eventHandler so we can put messages
     * back on the ULA again
     * @param {EventHandler} eventHandler
     */
    initialize(eventHandler) {
        this._eventHandler = eventHandler;
    }
    /**
     * Handle incoming messages
     * @param {Message} message
     * @param callback
     * @return {Promise<string>}
     */
    handleEvent(message, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!message.properties.type.match(/(did:eth:[A-Za-z0-9]*\/qr)|(ethereum-qr)/g)) {
                return 'ignored'; // This message is not intended for us
            }
            if (!message.properties.url) {
                return 'ignored'; // The message type is correct, but url is missing
            }
            if (!this._eventHandler) {
                throw new Error('Plugin not initialized. Did you forget to call initialize() ?');
            }
            // execute challengeRequest preparation
            const beforeChallengeRequestStatuses = yield this._eventHandler.processMsg({ type: message_type_1.MessageType.beforeChallengeRequest }, callback);
            // Call the endpoint to get the Challenge Request
            const challengeRequestJson = yield this._httpService.getRequest(message.properties.url);
            // preprocess challengeRequest response
            const afterChallengeRequestStatuses = yield this._eventHandler.processMsg({ type: message_type_1.MessageType.afterChallengeRequest, msg: challengeRequestJson }, callback);
            const ulaMessage = {
                type: message_type_1.MessageType.processChallengeRequest,
                msg: challengeRequestJson
            };
            // Send the Challenge Request to the next plugin
            yield this._eventHandler.processMsg(ulaMessage, callback);
            return 'completed';
        });
    }
}
exports.ProcessEthBarcode = ProcessEthBarcode;
exports.default = ProcessEthBarcode;
//# sourceMappingURL=process-eth-barcode.js.map