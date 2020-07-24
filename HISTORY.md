# 0.2.3 / 24-07-2020

**Enhancements**
- Security Patches for depeneent packages

# 0.2.2 / 23-03-2020

**Enhancements:**
- Additional hook messages (`before-challengerequest` and `after-challengerequest`) are sent to provide addtional checks before and after challenge request is executed ([#6](https://github.com/rabobank-blockchain/ula-process-eth-barcode/pull/6))
- Updated all dependencies
- Downgraded TypeScript to v3.4.5 to provide proper `d.ts` files (v3.7 breaks this)

# 0.2.1 / 09-01-2020

**Enhancements:**
- Updated all dependencies
- Introduced [HISTORY.md](HISTORY.md)
- Updated copyright year

# 0.2.0 / 27-12-2019

**BREAKING**

- Advised to use `ula-vp-controller@0.2.0` which has a protocol change. The ChallengeRequest object contains a new mandatory field: `postEndpoint`. This new field makes the `endpoint` field that we used in our ULA message redundant, [so it's removed](https://github.com/rabobank-blockchain/ula-process-eth-barcode/commit/39f7983cb5e333419311eda6ee25a77a000d5e9c). This version is not compatible with `ula-vp-controller@0.1.x`.

**Bug fixes**

- Fixed Handlebars vulnerability [CVE-2019-19919](https://github.com/advisories/GHSA-w457-6q6x-cgp9)

**Enhancements**

This release has no enhancements.

# 0.1.0 / 20-09-2019

*Initial release*
