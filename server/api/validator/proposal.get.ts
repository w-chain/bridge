import { fetchProposal } from "~~/server/service/ethers/proposal";

export default defineEventHandler(async (event) => {
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
