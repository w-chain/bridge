import { LazyConnectModal } from "#components";
import { useVueDapp, isMobileBrowser } from "@vue-dapp/core";

export const useConnectButtonLogic = () => {
  const { isWindowEthereumAvailable, connectTo } = useVueDapp();
  const overlay = useOverlay();
  const modal = overlay.create(LazyConnectModal);

  const openModal = () => modal.open();
  const onOpen = async () => {
    // connect to window.ethereum in the mobile browser
    if (isMobileBrowser() && isWindowEthereumAvailable) {
      await connectTo('BrowserWallet', { target: 'window.ethereum' });
      return;
    }
    openModal();
  }

  return { onOpen, openModal }
}
