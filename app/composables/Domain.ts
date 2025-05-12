export const useDomain = () => {
  const url = useRequestURL();
  const domain = computed(() => url.host || 'unknown');
  const isTestnetDomain = computed(() => domain.value === 'bridge-testnet.w-chain.com');

  return {
    domain,
    isTestnetDomain
  };
}
