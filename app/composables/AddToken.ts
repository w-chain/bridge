function getImageUrl(symbol: string) {
  switch (symbol) {
    case "USDT":
      return "https://static.alchemyapi.io/images/assets/825.png";
    case "USDC":
      return "https://static.alchemyapi.io/images/assets/3408.png";
    default:
      return "";
  }
}

export const useAddToken = async (tokenAddress: string, symbol: string, decimals: number, chainId: number) => {
  if (!window || !window.ethereum) return false;
  try {
    await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: tokenAddress,
          symbol: symbol,
          decimals: decimals,
          image: getImageUrl(symbol)
        },
        chainId: `0x${Number(chainId).toString(16)}`
      }
    });
    return true;
  } catch (error) {
    console.error("Add token error:", error);
    return false;
  }
}
