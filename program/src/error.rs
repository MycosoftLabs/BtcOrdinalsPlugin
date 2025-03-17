use thiserror::Error;
use solana_program::program_error::ProgramError;

#[derive(Error, Debug, Copy, Clone)]
pub enum BtcOrdinalsError {
    #[error("Invalid Signature")]
    InvalidSignature,
    #[error("Signature Mismatch")]
    SignatureMismatch,
    #[error("Pubkey Derivation Failure")]
    PubkeyDerivationFailure,
    #[error("Not Implemented")]
    NotImplemented,
}

impl From<BtcOrdinalsError> for ProgramError {
    fn from(e: BtcOrdinalsError) -> Self {
        ProgramError::Custom(e as u32)
    }
}
