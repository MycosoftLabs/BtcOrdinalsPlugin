import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  clusterApiUrl
} from '@solana/web3.js';

// Replace with your deployed custom program ID
const PROGRAM_ID = new PublicKey("YourProgram11111111111111111111111111");

export interface VerifySignatureParams {
  btcAddress: string;
  message: string;
  signature: string; // user-supplied (hex or base64)
}

/**
 * Calls your Solana program to verify a BTC signature on-chain using solana-secp256k1-ecdsa
 */
export async function verifyBtcSignatureOnSolana(params: VerifySignatureParams): Promise<boolean> {
  const { btcAddress, message, signature } = params;

  // 1. Convert the user-supplied signature from hex/base64 to raw bytes
  //    In a real implementation, handle both base64 or hex carefully
  //    For demonstration, we assume hex:
  const signatureBytes = Buffer.from(signature, 'hex');
  const msgBytes = Buffer.from(message, 'utf8');

  // 2. Build instruction data
  //    This must match the program’s expected layout
  const ixData = buildVerifyInstructionData(btcAddress, msgBytes, signatureBytes);

  const keys = []; // if your program doesn’t need accounts, keep it empty
  const ix = new TransactionInstruction({
    keys,
    programId: PROGRAM_ID,
    data: ixData
  });

  // 3. Create transaction
  const connection = new Connection(clusterApiUrl("mainnet-beta")); // or your custom endpoint
  const tx = new Transaction().add(ix);

  // 4. Sign & send with user’s wallet - Realms typically has context for a connected wallet
  //    Example only, adapt to your environment:
  const { signAndSendTransaction } = window.myWalletAdapter || {};
  if (!signAndSendTransaction) {
    throw new Error("No wallet adapter found - can't sign transaction");
  }

  const txSig = await signAndSendTransaction(tx);
  await connection.confirmTransaction(txSig, "confirmed");

  // 5. Read logs or an account to know if verification passed
  //    For simplicity, pretend we parse the logs:
  const parsed = await connection.getConfirmedTransaction(txSig, "confirmed");
  if (!parsed || !parsed.meta) return false;

  const logs = parsed.meta.logMessages || [];
  // If your program prints "Signature verified on-chain!", we can look for that substring:
  const found = logs.some(log => log.includes("Signature verified on-chain!"));
  return found;
}

/**
 * Encodes the custom instruction data. You’ll define a layout in your Rust code.
 */
function buildVerifyInstructionData(
  btcAddr: string,
  message: Buffer,
  sig: Buffer
): Buffer {
  // Example layout: [tag: 1 byte, addressLen:1, address bytes, msgLen:4, msg..., sigLen:1, sig...]
  // This is just a demonstration. Real layout depends on your program’s `instruction.rs`.
  const addrBuf = Buffer.from(btcAddr, 'utf8');

  const tag = Buffer.from([0]); // e.g. 'VerifyInstruction' = 0
  const addrLen = Buffer.from([addrBuf.length]);
  const msgLen = Buffer.alloc(4);
  msgLen.writeUInt32LE(message.length, 0);
  const sigLen = Buffer.from([sig.length]);

  return Buffer.concat([
    tag,
    addrLen,
    addrBuf,
    msgLen,
    message,
    sigLen,
    sig
  ]);
}
