use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub enum BtcOrdinalsInstruction {
    // We'll have just one instruction variant: VerifySignature
    VerifySignature {
        btc_address: String,
        message: Vec<u8>,
        signature: Vec<u8>,
    }
}
