import { DataRegistry, NFT, DataRegistryNFT, DataRegistryNFTData } from "../types";
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

async function getNFT(collection: string, tokenId: BigNumber): Promise<NFT> {
  let nft = await NFT.get(`${collection}-${tokenId.toString()}`);

  if (!nft) {
    nft = await NFT.create({
      id: `${collection}-${tokenId.toString()}`,
      collection: collection,
      tokenId: BigInt(tokenId),
    })
  }

}

export async function handleSafeWrite(log: WriteLog): Promise<void> {
  logger.info(`New Write log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const dataRegistry = await getDataRegistry(log.address);
  const nft = await getNFT(log.args.nftCollection, log.args.tokenId);

  const transaction = DataRegistryNFTData.create({
    id: `${log.transactionHash}-${log.transactionIndex}`,
    blockHeight: BigInt(log.blockNumber),
    
  });

  await transaction.save();
}