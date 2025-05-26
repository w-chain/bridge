import { getAddress, solidityPackedKeccak256, hexlify, JsonRpcProvider, Contract } from "ethers";
import { getAlchemyRpcUrl } from "~~/server/utils/rpc";
import { BRIDGE_ABI } from "~~/shared/abi/bridge";
import { BRIDGE_CONTRACT_REGISTRY } from "~~/shared/contracts/bridge";

export async function fetchProposal(fromChainId: number, toChainId: number, data: string, depositNonce: string) {
  const TARGET_CONTRACTS = BRIDGE_CONTRACT_REGISTRY[toChainId as ChainId];
  const bridgeAddress = TARGET_CONTRACTS.bridge;
  const handlerAddress = TARGET_CONTRACTS.erc20Handler;

  const fromDomainId = getDomainId(fromChainId);
  const dataHash = solidityPackedKeccak256(["address", "bytes"], [getAddress(handlerAddress), hexlify(data)]);
  
  const provider = new JsonRpcProvider(getAlchemyRpcUrl(toChainId));
  const bridgeContract = new Contract(bridgeAddress, BRIDGE_ABI, provider);

  const proposal = await bridgeContract.getProposal(fromDomainId, depositNonce, dataHash);

  const status = Number(proposal._status);
  const yesVotes = Number(proposal._yesVotes);

  return {
    status,
    yesVotes,
  };
}