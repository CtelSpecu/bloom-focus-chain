
/*
  This file provides dynamic contract addresses based on chain ID.
  
  Addresses can be overridden via environment variables:
  - NEXT_PUBLIC_FOCUS_SESSION_ADDRESS_HARDHAT (for chainId 31337)
  - NEXT_PUBLIC_FOCUS_SESSION_ADDRESS_SEPOLIA (for chainId 11155111)
  
  Command: 'npm run genabi' to regenerate from deployment artifacts.
*/

// Default addresses from deployment artifacts
const DEFAULT_ADDRESSES = {
  "11155111": { address: "0x0000000000000000000000000000000000000000", chainId: 11155111, chainName: "sepolia" },
  "31337": { address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", chainId: 31337, chainName: "hardhat" },
} as const;

// Allow runtime override via environment variables
function getHardhatAddress(): string {
  if (typeof window !== 'undefined') {
    const envAddress = process.env.NEXT_PUBLIC_FOCUS_SESSION_ADDRESS_HARDHAT;
    if (envAddress && envAddress !== "" && envAddress !== "0x0000000000000000000000000000000000000000") {
      return envAddress;
    }
  }
  return DEFAULT_ADDRESSES["31337"].address;
}

function getSepoliaAddress(): string {
  if (typeof window !== 'undefined') {
    const envAddress = process.env.NEXT_PUBLIC_FOCUS_SESSION_ADDRESS_SEPOLIA;
    if (envAddress && envAddress !== "" && envAddress !== "0x0000000000000000000000000000000000000000") {
      return envAddress;
    }
  }
  return DEFAULT_ADDRESSES["11155111"].address;
}

// Export dynamic addresses
export const FocusSessionAddresses = {
  "11155111": { 
    get address() { return getSepoliaAddress(); },
    chainId: 11155111, 
    chainName: "sepolia" 
  },
  "31337": { 
    get address() { return getHardhatAddress(); },
    chainId: 31337, 
    chainName: "hardhat" 
  },
} as const;

// Helper function to get address by chainId
export function getFocusSessionAddress(chainId: number | undefined): string | undefined {
  if (!chainId) return undefined;
  
  const chainIdStr = chainId.toString();
  if (chainIdStr === "31337") {
    return getHardhatAddress();
  }
  if (chainIdStr === "11155111") {
    return getSepoliaAddress();
  }
  return undefined;
}
