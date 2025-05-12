export const useAddNetwork = () => {
  const networks = {
    71117: {
      chainId: `0x${Number(71117).toString(16)}`,
      chainName: "W Chain Testnet",
      nativeCurrency: {
        name: "W Coin",
        symbol: "WCO",
        decimals: 18
      },
      rpcUrls: ["https://rpc-testnet.w-chain.com/"],
      blockExplorerUrls: ["https://scan-testnet.w-chain.com/"]
    },
    171717: {
      chainId: `0x${Number(171717).toString(16)}`,
      chainName: "W Chain",
      nativeCurrency: {
        name: "W Coin",
        symbol: "WCO",
        decimals: 18
      },
      rpcUrls: ["https://rpc.w-chain.com/"],
      blockExplorerUrls: ["https://scan.w-chain.com/"]
    }
  }

  async function addWChainTestnet() {
    if (!window || !window.ethereum) return false;
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [networks[71117]]
      });
      return true;
    } catch (error) {
      console.error("Add network error:", error);
      return false;
    }
  }

  async function addWChainMainnet() {
    if (!window || !window.ethereum) return false;
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [networks[171717]]
      });
      return true;
    } catch (error) {
      console.error("Add network error:", error);
      return false;
    }
  }

  return { addWChainTestnet, addWChainMainnet }
}
