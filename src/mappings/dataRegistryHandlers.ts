import { DataRegistry, NFT, DataRegistryNFTData } from "../types";
import {
  WriteLog,  
} from "../types/abi-interfaces/DataRegistryAbi";
import assert from "assert";

async function getDataRegistry(id: string): Promise<DataRegistry> {
  let dataRegistry = await DataRegistry.get(id);

  if (!dataRegistry) {
    dataRegistry = await DataRegistry.create({
      id: id      
    });
  }

  return dataRegistry;
}

async function getNFT(collection: string, tokenId: bigint): Promise<NFT> {
  let nft = await NFT.get(`${collection}-${tokenId.toString()}`);

  if (!nft) {
    nft = await NFT.create({
      id: `${collection}-${tokenId.toString()}`,
      collection: collection,
      tokenId: BigInt(tokenId),
    })
  }

  return nft;
}

export async function handleSafeWrite(log: WriteLog): Promise<void> {
  logger.info(`New Write log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const dataRegistryId = log.address;
  const dataRegistry = await getDataRegistry(log.address);

  const nftId = `${log.args.nftCollection}-${log.args.tokenId.toString()}`;
  const nft = await getNFT(log.args.nftCollection, log.args.tokenId.toBigInt());

  const data = DataRegistryNFTData.create({
    id: `${log.transactionHash}-${log.transactionIndex}`,
    blockHeight: BigInt(log.blockNumber),
    dataRegistryId,
    nftId,
    key: log.args.key,
    value: log.args.value,
  });

  await data.save();
}