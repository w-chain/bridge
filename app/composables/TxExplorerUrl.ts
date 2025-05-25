import { useVueDapp } from "@vue-dapp/core"
import { getExplorerTxUrl } from "~~/shared/utils"

export const useTxExplorerUrl = () => {
  const { chainId } = useVueDapp()
  return getExplorerTxUrl(chainId.value ?? 1);
}
