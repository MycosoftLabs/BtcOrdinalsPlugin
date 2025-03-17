import React, { useEffect, useState } from 'react';
import { fetchBtcAddressData } from './btcService';
import { verifyBtcSignatureOnSolana } from './solanaProgramClient';

interface OrdinalInfo {
  ordinalId: string;
  satRange: string;
  metaDescription?: string;
}

interface RuneBalance {
  ticker: string;
  amount: string;
}

interface BtcAddressInfo {
  address: string;
  btcBalance: string;
  ordinals: OrdinalInfo[];
  runes: RuneBalance[];
}

// Props if you want to pass in addresses from Realms or a config
interface BtcOrdinalsPluginProps {
  btcAddresses?: string[];
}

export const BtcOrdinalsPlugin: React.FC<BtcOrdinalsPluginProps> = ({
  btcAddresses = [],
}) => {
  const [addressData, setAddressData] = useState<BtcAddressInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For verifying ownership
  const [verifyAddress, setVerifyAddress] = useState('');
  const [verifyMessage, setVerifyMessage] = useState('Hello from Realms');
  const [userSignature, setUserSignature] = useState('');
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  useEffect(() => {
    if (!btcAddresses.length) return;
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const results: BtcAddressInfo[] = [];
        for (const addr of btcAddresses) {
          const info = await fetchBtcAddressData(addr);
          results.push(info);
        }
        setAddressData(results);
      } catch (err: any) {
        setError(err.message || 'Failed to load BTC Ordinals data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [btcAddresses]);

  const handleVerifyOwnership = async () => {
    try {
      setVerificationResult(null);
      const isVerified = await verifyBtcSignatureOnSolana({
        btcAddress: verifyAddress,
        message: verifyMessage,
        signature: userSignature
      });
      if (isVerified) {
        setVerificationResult(`Signature Verified! ${verifyAddress} is owned by you.`);
      } else {
        setVerificationResult(`Signature INVALID for address ${verifyAddress}.`);
      }
    } catch (err: any) {
      console.error(err);
      setVerificationResult('Error verifying signature on Solana.');
    }
  };

  return (
    <div style={{ margin: '1rem' }}>
      <h3>Bitcoin Treasury: Ordinals & Runes</h3>
      {loading && <p>Loading BTC data...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && addressData.map((entry) => (
        <div key={entry.address} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '0.5rem' }}>
          <h4>Address: {entry.address}</h4>
          <p>Balance (BTC): {entry.btcBalance}</p>

          <div>
            <p>Ordinals ({entry.ordinals.length}):</p>
            {entry.ordinals.map((o) => (
              <div key={o.ordinalId} style={{ border: '1px dashed #ccc', margin: '0.5rem' }}>
                <p>Ordinal ID: {o.ordinalId}</p>
                <p>Sat Range: {o.satRange}</p>
                <p>Metadata: {o.metaDescription || 'N/A'}</p>
              </div>
            ))}
          </div>

          <div>
            <p>Runes:</p>
            <ul>
              {entry.runes.map((r) => (
                <li key={r.ticker}>{r.ticker}: {r.amount}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      <hr />

      <div style={{ marginTop: '1rem' }}>
        <h4>Verify BTC Address Ownership</h4>
        <div>
          <label>BTC Address: </label>
          <input
            style={{ width: '80%' }}
            value={verifyAddress}
            onChange={(e) => setVerifyAddress(e.target.value)}
            placeholder="1YourBTCaddress..."
          />
        </div>
        <div>
          <label>Message to Sign: </label>
          <textarea
            rows={3}
            style={{ width: '80%' }}
            value={verifyMessage}
            onChange={(e) => setVerifyMessage(e.target.value)}
          />
        </div>
        <div>
          <label>Signature (Hex or Base64): </label>
          <textarea
            rows={3}
            style={{ width: '80%' }}
            value={userSignature}
            onChange={(e) => setUserSignature(e.target.value)}
          />
        </div>
        <button onClick={handleVerifyOwnership} style={{ marginTop: '0.5rem' }}>
          Verify On-Chain
        </button>
        {verificationResult && (
          <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>
            {verificationResult}
          </p>
        )}
      </div>
    </div>
  );
};
