# NFT2.0 SubQuery

The [SubQuery](https://subquery.network) project for NFT2.0 protocol. This includes indexer for all protocol onchain events, including but not limited to:
> 1. Factory events: create data-registries, collections, derived-accounts
> 2. Data-registry events: write, derive.
> 3. Collection events: mint, burn, transfer.
> 4. Derived-account events: claim royalty.
> 5. Addons events: addons created.

## Prerequisites
- [NodeJS v18.x](https://nodejs.org/en/blog/release/v18.17.0)
- [Docker LTS](https://docs.docker.com/engine/install/)
- [Docker Compose Plugin LTS](https://docs.docker.com/compose/install/linux/)
- [SubQuery CLI](https://academy.subquery.network/quickstart/quickstart.html#_1-install-the-subquery-cli)

## Setup
- Install dependencies
```bash
$ yarn
```

- Create .env file of special chain from template. Ex for **avax-testnet**:
```bash
$ cp .env.example .env.avax-testnet
```

- Fulfill contract address, block number, etc to env file (`.env.avax-testnet`)

## Build
- Generate file yaml and all manifest for a chain:
```bash
$ CHAIN=<chain> yarn codegen -f project-multichain.ts && mv project-multichain.yaml project-<chain>.yaml
```

> CHAIN env var can be one of supported chains, including: *avax, bnb, avax-testnet, bnb-testnet*
>
> Eg., command for `avax`:
```bash
$ CHAIN="avax" yarn codegen -f project-multichain.ts && mv project-multichain.yaml project-avax.yaml
```

> *This command will also generate types manifest in /src/types folder*

- Compile code

> Mainnets
```bash
$ yarn build -f subquery-multichain.yaml
```

> Testnets
```bash
$ yarn build -f subquery-multichain-testnet.yaml
```

> *This command will compile TS code and store artifacts to /dist folder, every update logic, including configuration in project-multichain.ts would require to reexecute this command*

## Run locally
- Spin up infrastructure stack, which includes PostgreSQL, Subquery node, GraphQL engine by using docker compose
```bash
$ yarn start:docker
```

- Access [GraphQL playground local](http://localhost:3000/) to query

## Test
- Execute UT
```bash
$ yarn test
```

## Query
- Via [GraphQL playground local](http://localhost:3000/)

```graphql
query {
  dataRegistries(first: 5) {
    nodes {
      id
      chainId
      blockHeight
      timestamp
      dapp
      address
      uri
    }
  }
}
```

The result should look something like this:

```json
{
  "data": {
    "dataRegistries": {
      "nodes": [
        {
          "id": "0xcf9748bf255125e6143fe896de36ed2b7c329108",
          "chainId": 43113,
          "blockHeight": "36375106",
          "timestamp": "1705376380",
          "dapp": "0x2f1038982da18dDe6934D972128c50c079845176",
          "address": "0xcf9748bf255125e6143fe896de36ed2b7c329108",
          "uri": "ipfs://account-3"
        }
      ]
    }
  }
}
```

- Via cURL (after publishing project to Managed Service)
```bash
$ curl -g -X POST -H "Content-type: application/json" \
-d '{"query": "query{dataRegistries(first:5) {nodes {id blockHeight dapp address uri}}}"}' \
<subquery-query-url>
```

## Publish
- Prerequisites: step [Build](#build) must be done before doing publishment.

- Publish project manifest to IPFS

> Mainnets
```bash
$ SUBQL_ACCESS_TOKEN="<access-token>" subql publish -f subquery-multichain.yaml
```

> Testnets
```bash
$ SUBQL_ACCESS_TOKEN="<access-token>" subql publish -f subquery-multichain-testnet.yaml
```

> *The IPFS CID will be saved in .project-cid file in root folder*

- Deployment can be done either via Console or SubQL CLI
```bash
$ SUBQL_ACCESS_TOKEN="<access-token>" subql deployment:deploy -d \
--org "<your-org>" \
--projectName "<project-name>" \
--endpoint "<rpc-endpoint>" \
--ipfsCID "<ipfs-cid>"
```

## Cleanup
- Down Docker compose
```bash
$ docker-compose down
```

- Cleanup PostgreSQL data
```bash
$ sudo rm -rf ./.data/
```

- Cleanup compiled source
```bash
$ sudo rm -rf ./dist/
$ sudo rm -rf ./src/types/
```

- Delete deployment on Managed service
```bash
$ SUBQL_ACCESS_TOKEN="<access-token>" subql deployment:delete -d \
--org "<your-org>" \
--project_name "<project-name>" \
--deploymentID "<deployment-id>"
```

## Troubleshoot
- Subquery-node unhealthy upon docker-compose start, it might occur due to RPC endpoint rate limit, which leads to failure on sync up latest chain status, the solution for this issue is simply waiting for RPC connection success, by monitoring subquery-node logs
```bash
$ docker logs -f <subquery-node-container>
```

## License
Copyright belongs to [DareNFT - Alpha Waves PTE. LTD](https://darenft.com/), 2023

