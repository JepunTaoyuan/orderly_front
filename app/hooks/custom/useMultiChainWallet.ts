import { useState, useCallback, useEffect } from "react";
import { BrowserProvider } from "ethers";

export type ChainType = "solana" | "evm";

interface WalletState {
  chainType: ChainType;
  address: string | null;
  currentPrice: number;
}

export function useMultiChainWallet(wallet: string) {
  const [state, setState] = useState<WalletState>({
    chainType: "evm",
    address: null,
    currentPrice: 0,
  });

  // 偵測錢包類型
  const detectChainType = useCallback((wallet: string): ChainType => {
    if (wallet.startsWith("0x")) {
      return "evm";
    } else {
      return "solana";
    }
  }, []);

  // 簽署訊息
  const signMessage = useCallback(
    async (message: string, chainType: ChainType): Promise<string> => {
      if (chainType === "solana") {
        const encodedMessage = new TextEncoder().encode(message);
        const { signature } = await window.solana.signMessage(
          encodedMessage,
          "utf8",
        );
        return Buffer.from(signature).toString("hex");
      } else if (chainType === "evm") {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        return await signer.signMessage(message);
      }

      throw new Error("Invalid chain type");
    },
    [],
  );

  return {
    ...state,
    signMessage,
    detectChainType,
  };
}
