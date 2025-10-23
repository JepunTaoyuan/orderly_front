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
  const detectChainType = useCallback((): ChainType => {
    if (wallet.startsWith("0x")) {
      return "evm";
    } else {
      return "solana";
    }
  }, []);

  // 簽署訊息
  const signMessage = useCallback(
    async (message: string): Promise<string> => {
      if (state.chainType === "solana") {
        const encodedMessage = new TextEncoder().encode(message);
        const { signature } = await window.solana.signMessage(
          encodedMessage,
          "utf8",
        );
        return Buffer.from(signature).toString("hex");
      } else if (state.chainType === "evm") {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        return await signer.signMessage(message);
      }

      throw new Error("Invalid chain type");
    },
    [state.chainType],
  );

  return {
    ...state,
    signMessage,
  };
}
