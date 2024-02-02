# NFT2.0 SubQuery

The [SubQuery](https://subquery.network) project for NFT2.0 protocol. This includes indexer for all protocol originated (onchain) events, including but not limited to:
> 1. Factory events: create data-registries, collections, derived-accounts
> 2. Data-registry events: write, compose, derive, reclaim, inscribe
> 3. Collection events: mint, burn, transfer
> 4. Derived-account: claim royalty

## Prerequisites
- [NodeJS v18.x](https://nodejs.org/en/blog/release/v18.17.0)
- [Docker LTS](https://docs.docker.com/engine/install/)
- [Docker Compose Plugin LTS](https://docs.docker.com/compose/install/linux/)
- [SubQuery CLI](https://academy.subquery.network/quickstart/quickstart.html#_1-install-the-subquery-cli)

## Install
- Install dependencies
```bash
$ yarn install
```

## Build
- Generate types
```bash
$ yarn codegen
```
*This command will generate types manifest in /src/types folder*

- Compile code
```bash
$ yarn build
```
*This command will compile TS code and store artifacts to /dist folder, every update logic, including configuration in project.ts would need to rerun this command*

## Run locally
- Spin up infrastructure stack, which includes PostgreSQL, Subquery node, GraphQL engine by using docker compose
```bash
$ docker-compose pull && docker-compose up
```

- Access [GraphQL playground](http://localhost:3000/) to start query

## Test
- Execute UT
```bash
$ yarn test
```

## Query
- Via local [GraphQL playground](http://localhost:3000/)

```graphql
query {
  dataRegistries(first: 5) {
    nodes {
      id
      blockHeight
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
          "blockHeight": "36375106",
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
- Publish project manifest to IPFS
```bash
$ SUBQL_ACCESS_TOKEN="<access-token>" subql publish
```

- The IPFS CID will be saved in .project-cid file in root folder

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
$ sudo rm -rf .data/
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
Copyright belongs to DareNFT - Alpha Waves PTE. LTD, 2023

