# BtcOrdinalsPlugin

A Realms plugin to display BTC Ordinals/Runes holdings and verify BTC address ownership using 
[solana-secp256k1-ecdsa](https://github.com/deanmlittle/solana-secp256k1-ecdsa). 

## Features
- Displays user’s BTC addresses and Ordinals data
- Lets a user prove ownership of a given BTC address by signing a message off-chain 
  and verifying on-chain (via a custom Solana program).

## Quick Start

1. **Install** the plugin UI dependencies:
   ```bash
   cd BtcOrdinalsPlugin
   npm install
   # or yarn
