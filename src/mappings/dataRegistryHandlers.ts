import { DataRegistry, NFT, DataRegistryNFTData } from "../types";
import {
  WriteLog,
  ComposeLog,
  DeriveLog,
  ReclaimLog,
  TransferLog,
} from "../types/abi-interfaces/DataRegistryAbi";
import assert, { deepStrictEqual } from "assert";
import { getNFT, ADDRESS_ZERO } from "./utils";

export async function handleSafeWrite(log: WriteLog): Promise<void> {
  logger.info(`New Write log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const dataRegistryId = log.address.toLowerCase();
  const dataRegistry = await getDataRegistry(dataRegistryId);

  const data = DataRegistryNFTData.create({
    id: `${dataRegistryId}-${log.args.nftCollection.toLowerCase()}-${log.args.tokenId.toBigInt()}-${log.args.key}`,
    blockHeight: BigInt(log.blockNumber),
    dataRegistryId,
    collection: log.args.nftCollection.toLowerCase(),
    tokenId: log.args.tokenId.toBigInt(),
    key: log.args.key,
    value: log.args.value,
  });

  await data.save();
}

export async function handleCompose(log: ComposeLog): Promise<void> {
  logger.info(`New Compose log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const dataRegistryId = log.address.toLowerCase();
  const dataRegistry = await getDataRegistry(dataRegistryId);
  const srcCollection = log.args.srcCollection;
  const srcTokenId = log.args.srcTokenId.toBigInt();
  const destCollection = log.args.descCollection;
  const destTokenId = log.args.descTokenId.toBigInt();
  
  logger.info(`Keys ${log.args["keys"]} - Keys length ${log.args["keys"].length}`);
  for (let j=0;j<log.args["keys"].length; j++) {
    logger.info(`Compose key ${log.args["keys"][j]}`);
    await composeNFTDataByKey(dataRegistryId, log.args.srcCollection, log.args.srcTokenId.toBigInt(), log.args.descCollection, log.args.descTokenId.toBigInt(), log.args["keys"][j]);
  }
}

export async function handleDerive(log: DeriveLog): Promise<void> {
  logger.info(`New Derive log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const underlying = await getNFT(log.args.underlyingCollection, log.args.underlyingTokenId.toBigInt());
  const derived = await getNFT(log.args.derivedCollection, log.args.derivedTokenId.toBigInt());

  derived.isDerived = true;
  derived.underlyingNFTId = underlying.id;
  await derived.save();
}

export async function handleReclaim(log: ReclaimLog): Promise<void> {
  logger.info(`New Reclaim log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const underlying = await getNFT(log.args.underlyingCollection, log.args.underlyingTokenId.toBigInt());
  const derived = await getNFT(log.args.derivedCollection, log.args.derivedTokenId.toBigInt());

  derived.isBurned = true;  
  await derived.save();
}

export async function handleTransferDerived(log: TransferLog): Promise<void> {
  logger.info(`New Transfer-derived log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  logger.info(`NFT ${log.args.tokenId} is transfered on collection ${log.address}`);
  const nft = await getNFT(log.address, log.args.tokenId.toBigInt());
  nft.owner = log.args.to;

  if (log.args.to == ADDRESS_ZERO) {
    nft.isBurned = true;
  }
  
  await nft.save();
}

async function getDataRegistry(id: string): Promise<DataRegistry> {
  let dataRegistry = await DataRegistry.get(id);

  if (!dataRegistry) {
    dataRegistry = await DataRegistry.create({
      id: id      
    });
  }

  return dataRegistry;
}

async function composeNFTDataByKey(registry: string, srcCollection: string, srcTokenId: bigint, destCollection: string, destTokenId: bigint, key: string): Promise<boolean> {
  let srcData = await DataRegistryNFTData.get(getDataId(registry, srcCollection, srcTokenId, key));
  let destData = await DataRegistryNFTData.get(getDataId(registry, destCollection, destTokenId, key));
  if (srcData && destData) {
    logger.info(`Compose key ${key} from source ${srcCollection}-${srcTokenId} to dest ${destCollection}-${destTokenId}`);
    destData.value = srcData.value;
    await destData.save();

    srcData.value = "";
    await srcData.save();
    return true;
  } 
  logger.error(`Source or Dest data of key ${key} is not found`);
  return false;
}

function getDataId(registry: string, collection: string, tokenId: bigint, key: string): string {
  return `${registry}-${collection.toLowerCase()}-${tokenId}-${key}`;
}

