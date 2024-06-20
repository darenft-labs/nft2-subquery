import {
  EthereumProject,
  EthereumDatasourceKind,
  EthereumHandlerKind,
} from "@subql/types-ethereum";

import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Need to load the appropriate .env file
//const chainEnv = "chain-name";

if (process.env.CHAIN == undefined) {
  throw new Error("Missing argument: CHAIN");
}

const chainEnv = process.env.CHAIN;
const dotenvPath = path.resolve(process.cwd(), `.env.${chainEnv}`);

if (!fs.existsSync(dotenvPath)) {
  throw new Error(`Dotenv file not found: ${dotenvPath}`);
}

dotenv.config({ path: dotenvPath });

// Can expand the Datasource processor types via the generic param
const project: EthereumProject = {
  specVersion: "1.0.0",
  version: "0.0.1",
  name: "nft2-multichain",
  description: "The SubQuery indexer for NFT2.0 Protocol.",
  runner: {
    node: {
      name: "@subql/node-ethereum",
      version: ">=3.0.0",
    },
    query: {
      name: "@subql/query",
      version: "*",
    },
  },
  schema: {
    file: "./schema.graphql",
  },
  network: {
    /**
     * chainId is the EVM Chain ID, for BSC testnet this is 97
     * https://chainlist.org/chain/97
     */

    chainId: process.env.CHAIN_ID!,

    /**
     * These endpoint(s) should be public non-pruned archive node
     * We recommend providing more than one endpoint for improved reliability, performance, and uptime
     * Public nodes may be rate limited, which can affect indexing speed
     * When developing your project we suggest getting a private API key
     * If you use a rate limited endpoint, adjust the --batch-size and --workers parameters
     * These settings can be found in your docker-compose.yaml, they will slow indexing but prevent your project being rate limited
     */

    endpoint: process.env.RPC_ENDPOINT!.split(","),
  },
  dataSources: [
    {
      kind: EthereumDatasourceKind.Runtime,
      startBlock: parseInt(process.env.PROTOCOL_START_BLOCK!),

      options: {
        // Must be a key of assets
        abi: "factory-abi",
        address: process.env.PROTOCOL_FACTORY_ADDRESS,
      },
      assets: new Map([["factory-abi", { file: "./abis/factory.abi.json" }]]),
      mapping: {
        file: "./dist/index.js",
        handlers: [
          {
            kind: EthereumHandlerKind.Event,
            handler: `handleDataRegistryCreated${process.env.CHAIN_NAME}`,
            filter: {
              topics: [
                "DataRegistryCreated(address dapp, address registry, string dappURI)",
              ],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: `handleDataRegistryV2Created${process.env.CHAIN_NAME}`,
            filter: {
              topics: [
                "DataRegistryV2Created(address indexed dapp, address indexed registry, string dappURI)",
              ],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: `handleCollectionCreated${process.env.CHAIN_NAME}`,
            filter: {
              topics: [
                "CollectionCreated(address owner, address collection, uint8 kind)",
              ],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: `handleDerivedAccountCreated${process.env.CHAIN_NAME}`,
            filter: {
              topics: [
                "DerivedAccountCreated(address underlyingCollection, uint256 underlyingTokenId, address derivedAccount)",
              ],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: `handleAddonsCreated${process.env.CHAIN_NAME}`,
            filter: {
              topics: [
                "AddonsCreated(address indexed collection, uint8 indexed kind, address addons, bytes32 campaignId, bytes data)",
              ],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: `handleERC6551AccountCreated${process.env.CHAIN_NAME}`,
            filter: {
              topics: [
                "ERC6551AccountCreated(address account, address indexed implementation, bytes32 salt, uint256 chainId, address indexed tokenContract, uint256 indexed tokenId)",
              ],
            },
          },
        ],
      },
    },
    {
      kind: EthereumDatasourceKind.Runtime,
      startBlock: parseInt(process.env.MARKETPLACE_START_BLOCK!),

      options: {
        // Must be a key of assets
        abi: "marketplace-abi",
        address: process.env.MARKETPLACE_ADDRESS,
      },
      assets: new Map([
        ["marketplace-abi", { file: "./abis/marketplace.abi.json" }],
      ]),
      mapping: {
        file: "./dist/index.js",
        handlers: [
          {
            kind: EthereumHandlerKind.Event,
            handler: `handleTakerBidLog${process.env.CHAIN_NAME}`,
            filter: {
              topics: [
                "TakerBid(bytes32 orderHash, uint256 orderNonce, address indexed taker, address indexed maker, address indexed strategy, address currency, address collection, uint256 tokenId, uint256 amount, uint256 price)",
              ],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: `handleTakerAskLog${process.env.CHAIN_NAME}`,
            filter: {
              topics: [
                "TakerAsk(bytes32 orderHash, uint256 orderNonce, address indexed taker, address indexed maker, address indexed strategy, address currency, address collection, uint256 tokenId, uint256 amount, uint256 price)",
              ],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: `handleCancelAllOrdersLog${process.env.CHAIN_NAME}`,
            filter: {
              topics: [
                "CancelAllOrders(address indexed user, uint256 newMinNonce)",
              ],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: `handleCancelMultipleOrdersLog${process.env.CHAIN_NAME}`,
            filter: {
              topics: [
                "CancelMultipleOrders(address indexed user, uint256[] orderNonces)",
              ],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: `handleRoyaltyPaymentLog${process.env.CHAIN_NAME}`,
            filter: {
              topics: [
                "RoyaltyPayment(address indexed collection, uint256 indexed tokenId, address indexed royaltyRecipient, address currency, uint256 amount)",
              ],
            },
          },
        ],
      },
    },
  ],
  templates: [
    {
      name: "DataRegistry",
      kind: EthereumDatasourceKind.Runtime,

      options: {
        // Must be a key of assets
        abi: "data-registry-abi",
      },
      assets: new Map([
        ["data-registry-abi", { file: "./abis/data-registry.abi.json" }],
      ]),
      mapping: {
        file: "./dist/index.js",
        handlers: [
          {
            kind: EthereumHandlerKind.Event,
            handler: `handleSafeWrite${process.env.CHAIN_NAME}`,
            filter: {
              topics: [
                "Write(address requester, address nftCollection, uint256 tokenId, bytes32 key, bytes value)",
              ],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: `handleCompose${process.env.CHAIN_NAME}`,
            filter: {
              topics: [
                "Compose(address srcCollection, uint256 srcTokenId, address descCollection, uint256 descTokenId, bytes32[] keys)",
              ],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: `handleDerive${process.env.CHAIN_NAME}`,
            filter: {
              topics: [
                "Derive(address underlyingCollection, uint256 underlyingTokenId, address derivedCollection, uint256 derivedTokenId, uint256 startTime, uint256 endTime)",
              ],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: `handleReclaim${process.env.CHAIN_NAME}`,
            filter: {
              topics: [
                "Reclaim(address underlyingCollection, uint256 underlyingTokenId, address derivedCollection, uint256 derivedTokenId)",
              ],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: `handleTransferDerived${process.env.CHAIN_NAME}`,
            filter: {
              topics: ["Transfer(address from, address to, uint256 tokenId)"],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: `handleURIUpdated${process.env.CHAIN_NAME}`,
            filter: {
              topics: ["URIUpdated(string uri)"],
            },
          },
        ],
      },
    },
    {
      name: "DataRegistryV2",
      kind: EthereumDatasourceKind.Runtime,

      options: {
        // Must be a key of assets
        abi: "data-registry-v2-abi",
      },
      assets: new Map([
        ["data-registry-v2-abi", { file: "./abis/data-registry-v2.abi.json" }],
      ]),
      mapping: {
        file: "./dist/index.js",
        handlers: [
          {
            kind: EthereumHandlerKind.Event,
            handler: `handleWriteBatch${process.env.CHAIN_NAME}`,
            filter: {
              topics: [
                "WriteBatch(address collection, uint256 startId, uint256 endId, bytes32 key, bytes value)",
              ],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: `handleCompose${process.env.CHAIN_NAME}`,
            filter: {
              topics: [
                "Compose(address srcCollection, uint256 srcTokenId, address descCollection, uint256 descTokenId, bytes32[] keys)",
              ],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: `handleDerive${process.env.CHAIN_NAME}`,
            filter: {
              topics: [
                "Derive(address underlyingCollection, uint256 underlyingTokenId, address derivedCollection, uint256 derivedTokenId, uint256 startTime, uint256 endTime)",
              ],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: `handleReclaim${process.env.CHAIN_NAME}`,
            filter: {
              topics: [
                "Reclaim(address underlyingCollection, uint256 underlyingTokenId, address derivedCollection, uint256 derivedTokenId)",
              ],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: `handleTransferDerived${process.env.CHAIN_NAME}`,
            filter: {
              topics: ["Transfer(address from, address to, uint256 tokenId)"],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: `handleURIUpdated${process.env.CHAIN_NAME}`,
            filter: {
              topics: ["URIUpdated(string uri)"],
            },
          },
        ],
      },
    },
    {
      name: "Collection",
      kind: EthereumDatasourceKind.Runtime,

      options: {
        // Must be a key of assets
        abi: "erc721",
      },
      assets: new Map([["erc721", { file: "./abis/erc721.abi.json" }]]),
      mapping: {
        file: "./dist/index.js",
        handlers: [
          {
            kind: EthereumHandlerKind.Event,
            handler: `handleTransfer${process.env.CHAIN_NAME}`,
            filter: {
              topics: ["Transfer(address from, address to, uint256 tokenId)"],
            },
          },
        ],
      },
    },
    {
      name: "DerivedAccount",
      kind: EthereumDatasourceKind.Runtime,

      options: {
        // Must be a key of assets
        abi: "derived-account",
      },
      assets: new Map([
        ["derived-account", { file: "./abis/derived-account.abi.json" }],
      ]),
      mapping: {
        file: "./dist/index.js",
        handlers: [
          {
            kind: EthereumHandlerKind.Event,
            handler: `handleRoyaltyClaimed${process.env.CHAIN_NAME}`,
            filter: {
              topics: [
                "RoyaltyClaimed(address receiver, address requestToken, uint256 amount)",
              ],
            },
          },
        ],
      },
    },
  ],
  //repository: "https://github.com/subquery/ethereum-subql-starter",
};

// Must set default to the project instance
export default project;
