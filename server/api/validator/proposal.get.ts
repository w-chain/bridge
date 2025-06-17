import { fetchProposal } from "~~/server/service/ethers/proposal";

export default defineEventHandler(async (event) => {
  // Set CORS headers
  const origin = getHeader(event, 'origin');
  const allowedOrigins = [
    'http://localhost:3000',
    'https://localhost:3000',
    /^https?:\/\/.*\.w-swap\.com$/,
    /^https?:\/\/.*\.w-chain\.com$/
  ];
  
  const isAllowed = allowedOrigins.some(allowed => {
    if (typeof allowed === 'string') {
      return origin === allowed;
    }
    return allowed.test(origin || '');
  });
  
  if (isAllowed) {
    setHeader(event, 'Access-Control-Allow-Origin', origin || '*');
  }
  
  setHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization');
  setHeader(event, 'Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (event.method === 'OPTIONS') {
    return '';
  }
  const { toChainId, fromChainId, depositNonce, data } = getQuery<{
    toChainId: number,
    fromChainId: number,
    depositNonce: string,
    data: string
  }>(event);

  if (!toChainId || !fromChainId || !depositNonce || !data) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    });
  }

  return await fetchProposal(Number(fromChainId), Number(toChainId), data, depositNonce);
})
