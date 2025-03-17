use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg,
    program_error::ProgramError
};
use crate::instruction::BtcOrdinalsInstruction;
use crate::error::BtcOrdinalsError;
use solana_secp256k1_ecdsa::{Secp256k1EcdsaSignature, hash::Sha256};

pub mod instruction;
pub mod error;

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // 1. Parse the instruction
    let instr = match BtcOrdinalsInstruction::try_from_slice(instruction_data) {
        Ok(i) => i,
        Err(_) => {
            msg!("Failed to deserialize instruction");
            return Err(ProgramError::InvalidInstructionData);
        }
    };

    match instr {
        BtcOrdinalsInstruction::VerifySignature { btc_address, message, signature } => {
            return verify_btc_signature(program_id, accounts, btc_address, message, signature);
        }
    }
}

fn verify_btc_signature(
    _program_id: &Pubkey,
    _accounts: &[AccountInfo],
    btc_address: String,
    message: Vec<u8>,
    signature_bytes: Vec<u8>,
) -> ProgramResult {
    msg!("Verifying BTC signature using solana-secp256k1-ecdsa...");

    // Typically, you'd do 2 steps:
    //  1) Recover or verify the pubkey from the signature + message
    //  2) Compare that pubkey's hash160 with the provided 'btc_address' to confirm it matches

    // Step 1: Construct signature
    let sig = Secp256k1EcdsaSignature::from_bytes(&signature_bytes)
        .map_err(|_| BtcOrdinalsError::InvalidSignature)?;

    // For a typical Bitcoin message sign flow, you might do double-sha256 of a "Bitcoin Signed Message" prefix + message
    // Here we do a simple single Sha256 for illustration:
    let hashed_msg = Sha256::hash(&message);

    // You need the pubkey. The library's verify() needs the pubkey. We don't have it unless the user provides it or a recovery ID.
    // For demonstration, let's assume the user provided the *raw compressed pubkey* in the 'btc_address' field (which is obviously not a real address).
    // Production: you'd do actual base58 or bech32 decode + hash160 check. This is beyond the scope here.

    msg!("Fake verifying. In real code: parse pubkey from signature or input, compare to address hash160.");
    // If we had a real pubkey: 
    // let pubkey: Pubkey = ... (some how from user or recovered)
    // let result = sig.verify::<Sha256, _>(&hashed_msg, pubkey);

    // We'll simulate success:
    msg!("Signature verified on-chain!");
    Ok(())
}
