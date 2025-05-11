export const useTxHashToast = (hash: string) => {
  const toast = useToast();
  const blockExplorerUrl = useTxExplorerUrl();
  const clickHandler = () => {
    navigateTo(`${blockExplorerUrl}${hash}`, {
      open: { target: '_blank' }
    })
  }
  toast.add({
    title: 'Transaction Success!',
    description: 'You can check your transaction in block explorer:',
    duration: 0,
    color: 'success',
    actions: [{
      label: 'Explorer',
      onClick: clickHandler
    }]
  })
}
