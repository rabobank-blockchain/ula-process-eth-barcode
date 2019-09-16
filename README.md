# ula-process-eth-barcode

[![Build Status](https://travis-ci.org/rabobank-blockchain/ula-process-eth-barcode.svg?branch=master)](https://travis-ci.org/rabobank-blockchain/ula-process-eth-barcode)
[![Test Coverage](https://api.codeclimate.com/v1/badges/773aa5e63b2d2b70b99c/test_coverage)](https://codeclimate.com/github/rabobank-blockchain/ula-process-eth-barcode/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/773aa5e63b2d2b70b99c/maintainability)](https://codeclimate.com/github/rabobank-blockchain/ula-process-eth-barcode/maintainability)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A Holder [ULA](https://github.com/rabobank-blockchain/universal-ledger-agent) plugin for processing [W3C Verifiable Credential](https://www.w3.org/TR/verifiable-claims-data-model/) QR codes, using
the [credential exchange flow](https://github.com/rabobank-blockchain/vp-toolkit/blob/master/doc/vc-flow.png) described in [vp-toolkit](https://github.com/rabobank-blockchain/vp-toolkit).
This small plugin calls the endpoint as provided in the QR code and expects a ChallengeRequest object response from the endpoint.
Then the ChallengeRequest object is parsed and sent to the next plugin by broadcasting a ULA message.

**We strongly recommend to add the [ula-vp-controller](https://github.com/rabobank-blockchain/ula-vp-controller) plugin so the rest of the flow is executed.**

## Installation

In an existing project (with `package.json`), install `ula-process-eth-barcode`

```bash
npm install ula-process-eth-barcode --save
```

## Usage

```typescript
import { ProcessEthBarcode, BrowserHttpService } from 'ula-process-eth-barcode'
import { EventHandler, UlaResponse } from 'universal-ledger-agent'

// Prepare the ProcessEthBarcode plugin
const httpService = new BrowserHttpService()
const processEthBarcode = new ProcessEthBarcode(httpService)
// Instantiate the Universal Ledger Agent with this plugin
const ulaEventHandler = new EventHandler([processEthBarcode])
// Note that you will need to add more plugins to complete the flow

// Then, somewhere in your code, call your own QR code scanner component:
const qrCodeContents: object = await yourQRCodeScanner.scan()
// Make sure that qrCodeContents object at least contains a 'type' field!

// And let the ULA handle the rest of the process:
ulaEventHandler.processMsg(qrCodeContents, (response: UlaResponse) => {
  // Handle callback
})
```

The `UlaResponse` callback with the `statusCode` and `body` fields can be in many shapes or forms.
This plugin does not use the callback itself, instead, it passes it to the next plugin.


### QR code content

In order to trigger this plugin, the ULA message must be in the following format:
```typescript
const msg = {
  type: 'ethereum-qr',
  url: '{endpoint}'
}
```
The endpoint must return a signed, stringified [ChallengeRequest](https://github.com/rabobank-blockchain/vp-toolkit-models/blob/master/src/model/challenge-request.ts) when doing a `GET` request.

### Handling the ChallengeRequest

This plugin does **not** handle the ChallengeRequest. Instead, this plugin will send a new ULA message with this payload:
```typescript
const msg = {
  type: 'process-challengerequest',
  endpoint: '{endpoint from QR code}',
  msg: challengeRequestJson
}
```
This message can be handled by the [ula-vp-controller](https://github.com/rabobank-blockchain/ula-vp-controller) plugin.
If you want to handle the ChallengeRequest yourself, create a plugin which listens to the `process-challengerequest` type.

## Running tests

Besides unit testing with Mocha, the effectivity of all tests are also measured with the Stryker mutation testing framework.

```bash
npm run test
npm run stryker
```

We aim to achieve a coverage of 100%. Stryker and/or mocha test scores below 80% will fail the build.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License and disclaimer

[apache-2.0](https://choosealicense.com/licenses/apache-2.0/) with a [notice](NOTICE).

We discourage the use of this work in production environments as it is in active development and not mature enough.
