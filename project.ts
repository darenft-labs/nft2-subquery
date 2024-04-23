import {
  EthereumProject,
  EthereumDatasourceKind,
  EthereumHandlerKind,
} from "@subql/types-ethereum";

import dotenv from "dotenv";
dotenv.config();

// Can expand the Datasource processor types via the generic param
const project: EthereumProject = {
  specVersion: "1.0.0",
  version: "0.0.1",
  name: "nft2-subquery",
  description:
    "The SubQuery indexer for NFT2.0 Protocol.",
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

    endpoint: (process.env.RPC_ENDPOINT!).split(","),
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
            handler: "handleDataRegistryCreated",
            filter: {              
              topics: [
                "DataRegistryCreated(address dapp, address registry, string dappURI)",
              ],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: "handleDataRegistryV2Created",
            filter: {              
              topics: [
                "DataRegistryV2Created(address indexed dapp, address indexed registry, string dappURI)",
              ],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: "handleCollectionCreated",
            filter: {              
              topics: [
                "CollectionCreated(address owner, address collection, uint8 kind)",
              ],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: "handleDerivedAccountCreated",
            filter: {              
              topics: [
                "DerivedAccountCreated(address underlyingCollection, uint256 underlyingTokenId, address derivedAccount)",
              ],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: "handleAddonsCreated",
            filter: {              
              topics: [
                "AddonsCreated(address indexed collection, uint8 indexed kind, address addons, bytes32 campaignId, bytes data)",
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
      assets: new Map([["data-registry-abi", { file: "./abis/data-registry.abi.json" }]]),
      mapping: {
        file: "./dist/index.js",
        handlers: [          
          {
            kind: EthereumHandlerKind.Event,
            handler: "handleSafeWrite",
            filter: {              
              topics: [
                "Write(address requester, address nftCollection, uint256 tokenId, bytes32 key, bytes value)",
              ],
            },
          },          
          {
            kind: EthereumHandlerKind.Event,
            handler: "handleCompose",
            filter: {              
              topics: [
                "Compose(address srcCollection, uint256 srcTokenId, address descCollection, uint256 descTokenId, bytes32[] keys)",
              ],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: "handleDerive",
            filter: {              
              topics: [
                "Derive(address underlyingCollection, uint256 underlyingTokenId, address derivedCollection, uint256 derivedTokenId, uint256 startTime, uint256 endTime)",
              ],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: "handleReclaim",
            filter: {              
              topics: [
                "Reclaim(address underlyingCollection, uint256 underlyingTokenId, address derivedCollection, uint256 derivedTokenId)",
              ],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: "handleTransferDerived",
            filter: {              
              topics: [
                "Transfer(address from, address to, uint256 tokenId)",
              ],
            },
          },          
          {
            kind: EthereumHandlerKind.Event,
            handler: "handleURIUpdated",
            filter: {              
              topics: [
                "URIUpdated(string uri)",
              ],
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
      assets: new Map([["data-registry-v2-abi", { file: "./abis/data-registry-v2.abi.json" }]]),
      mapping: {
        file: "./dist/index.js",
        handlers: [          
          {
            kind: EthereumHandlerKind.Event,
            handler: "handleWriteBatch",
            filter: {              
              topics: [
                "WriteBatch(address collection, uint256 startId, uint256 endId, bytes32 key, bytes value)",
              ],
            },
          },          
          {
            kind: EthereumHandlerKind.Event,
            handler: "handleCompose",
            filter: {              
              topics: [
                "Compose(address srcCollection, uint256 srcTokenId, address descCollection, uint256 descTokenId, bytes32[] keys)",
              ],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: "handleDerive",
            filter: {              
              topics: [
                "Derive(address underlyingCollection, uint256 underlyingTokenId, address derivedCollection, uint256 derivedTokenId, uint256 startTime, uint256 endTime)",
              ],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: "handleReclaim",
            filter: {              
              topics: [
                "Reclaim(address underlyingCollection, uint256 underlyingTokenId, address derivedCollection, uint256 derivedTokenId)",
              ],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: "handleTransferDerived",
            filter: {              
              topics: [
                "Transfer(address from, address to, uint256 tokenId)",
              ],
            },
          },          
          {
            kind: EthereumHandlerKind.Event,
            handler: "handleURIUpdated",
            filter: {              
              topics: [
                "URIUpdated(string uri)",
              ],
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
            handler: "handleTransfer",
            filter: {              
              topics: [
                "Transfer(address from, address to, uint256 tokenId)",
              ],
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
      assets: new Map([["derived-account", { file: "./abis/derived-account.abi.json" }]]),
      mapping: {
        file: "./dist/index.js",
        handlers: [
          {
            kind: EthereumHandlerKind.Event,
            handler: "handleRoyaltyClaimed",
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
