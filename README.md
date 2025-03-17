# BtcOrdinalsPlugin

BtcOrdinalsPlugin is a Realms DAO plugin designed to integrate multi-chain asset management by displaying Bitcoin-based assets (BTC, Ordinals, and Runes) within the Solana-based Realms treasury interface. This plugin not only showcases the external asset balances but also enables users to prove ownership of their Bitcoin addresses by submitting a signed message. The signature is verified on-chain using a custom Solana program that leverages the [solana-secp256k1-ecdsa](https://github.com/deanmlittle/solana-secp256k1-ecdsa) library, providing a robust cross-chain verification mechanism and extending the governance capabilities of Realms to include external Bitcoin assets.

## Features

- **Multi-Chain Asset Display**: Retrieves and displays Bitcoin address data including BTC balances, Ordinals inscriptions, and Rune tokens from external APIs.
- **Ownership Verification**: Allows users to prove ownership of a Bitcoin address by signing a message off-chain. The signed message, along with the signature and Bitcoin address, is sent to a custom Solana program that verifies the signature using secp256k1 ECDSA methods.
- **Seamless Integration**: Built with React and Next.js for the front-end, the plugin is easily embeddable within the Realms UI. The on-chain Solana program is written in Rust, and both components interact via a custom client library.
- **Extensible Architecture**: While the current implementation provides a skeleton for signature verification, the modular design allows for future enhancements, including full Bitcoin address recovery and HASH160 verification for production-grade security.

## Folder Structure

```
BtcOrdinalsPlugin/
├── README.md
├── package.json
├── tsconfig.json
├── src/
│   ├── BtcOrdinalsPlugin.tsx         # React UI component for the plugin
│   ├── btcService.ts                # Service to fetch BTC address and Ordinals data
│   └── solanaProgramClient.ts       # Client library to interact with the Solana program
└── program/
    ├── Cargo.toml                   # Rust project configuration for the Solana program
    └── src/
        ├── lib.rs                   # Main entry point for the Solana on-chain program
        ├── instruction.rs           # Instruction definitions for the program
        └── error.rs                 # Custom error definitions
```

## Installation and Setup

1. **Front-End Setup**  
   - Navigate to the plugin directory and install dependencies:
     ```bash
     cd BtcOrdinalsPlugin
     npm install
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```
   - The plugin runs using Next.js; integrate it into your Realms front-end by importing the `BtcOrdinalsPlugin` component and including it in the appropriate DAO route.

2. **Solana Program Deployment**  
   - Ensure you have the Rust toolchain and Solana CLI installed.
   - Build the on-chain program:
     ```bash
     cd program
     cargo build-bpf
     ```
   - Deploy the program to your desired Solana cluster:
     ```bash
     solana program deploy <PATH_TO_YOUR_BPF_ELF>
     ```
   - Update the `PROGRAM_ID` in `src/solanaProgramClient.ts` with your deployed program's ID.

3. **Integration with Realms**  
   - Add the plugin as a new tab or route within the Realms UI.
   - Pass any required configuration (e.g., a list of BTC addresses) as props to the `BtcOrdinalsPlugin` component.
   - Ensure wallet connectivity is established via a compatible Solana wallet adapter.

## Usage

- **Viewing BTC Assets**:  
  The plugin automatically retrieves BTC treasury data (balances, Ordinals, Runes) from external services and displays them in a structured format within the Realms interface.

- **Verifying Ownership**:  
  Users can verify that they control a specific Bitcoin address by:
  1. Entering their BTC address.
  2. Providing a message (defaulted to "Hello from Realms" but customizable).
  3. Pasting the signature generated off-chain (using a Bitcoin wallet or CLI that supports ECDSA signing).
  The plugin then sends this data to the on-chain Solana program for verification. Successful verification is confirmed on-chain and indicated within the UI.

- **On-Chain Verification Process**:  
  The custom Solana program deserializes the incoming instruction, reconstructs the data using the [borsh](https://github.com/near/borsh-rs) library, and verifies the ECDSA signature using the [solana-secp256k1-ecdsa](https://github.com/deanmlittle/solana-secp256k1-ecdsa) crate. Although the current implementation assumes a simplified verification (e.g., using a direct pubkey provided by the user), the architecture is designed to be extended for full Bitcoin address validation and recovery logic.

## Resources and Links

1. **Solana Secp256k1 ECDSA Library**  
   [https://github.com/deanmlittle/solana-secp256k1-ecdsa](https://github.com/deanmlittle/solana-secp256k1-ecdsa)

2. **Realms Documentation**  
   [https://docs.realms.today/](https://docs.realms.today/)

3. **Realms Governance UI Repository**  
   [https://github.com/solana-labs/governance-ui](https://github.com/solana-labs/governance-ui)

4. **Solana Web3.js Documentation**  
   [https://solana-labs.github.io/solana-web3.js](https://solana-labs.github.io/solana-web3.js)

5. **Next.js Framework**  
   [https://nextjs.org/](https://nextjs.org/)

6. **Borsh Serialization Library**  
   [https://github.com/near/borsh-rs](https://github.com/near/borsh-rs)

7. **Solana Developer Resources**  
   [https://solana.com/developers](https://solana.com/developers)

8. **Solana Wallet Adapter**  
   [https://github.com/solana-labs/wallet-adapter](https://github.com/solana-labs/wallet-adapter)

9. **MycoDAO Website**  
   [https://mycodao.com](https://mycodao.com)

## Disclaimer

This repository contains conceptual sample code designed to demonstrate how a Realms plugin can integrate on-chain Bitcoin signature verification using Solana. This code is not production-ready and has not been audited. Developers should thoroughly test, secure, and adapt the code to meet their specific requirements and security standards before deployment in a live environment.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/yourusername/btc-ordinals-plugin/issues) if you want to contribute.

---

Happy Hacking!
