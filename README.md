# NFT2.0 SubQuery

The [SubQuery](https://subquery.network) project for NFT2.0 protocol. This includes indexer for all protocol originated (onchain) events, including but not limited to:
- Factory events: create data-registries, collections, derived-accounts
- Data-registry events: write, set schema, compose, derive, reclaim
- Collection events: mint, burn, transfer
- Derived-account: claim royalty

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

## Run
- Generate types
```bash
$ yarn codegen
```

- Compile code
```bash
$ yarn build
```

- Spin up Docker
```bash
$ docker-compose pull && docker-compose up
```
then open [GraphQL playground](http://localhost:3000)

## Test
- Execute UT
```bash
$ yarn test
```

## Query

For this project, you can try to query with the following GraphQL code to get a taste of how it works.

```graphql
{
  query {
    transfers(first: 5, orderBy: VALUE_DESC) {
      totalCount
      nodes {
        id
        blockHeight
        from
        to
        value
        contractAddress
      }
    }
  }
  approvals(first: 5, orderBy: BLOCK_HEIGHT_DESC) {
    nodes {
      id
      blockHeight
      owner
      spender
      value
      contractAddress
    }
  }
}
```

The result should look something like this:

```json
{
  "data": {
    "query": {
      "transfers": {
        "totalCount": 12,
        "nodes": [
          {
            "id": "0x4cd1b558b1f4dcd0282306aa616eca9f471d43f9ad2e215fdc89842599fff41b",
            "blockHeight": "30738117",
            "from": "0x4cc661636e863438CDD3997FeF97F7834c18F30a",
            "to": "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
            "value": "127102935664186759",
            "contractAddress": "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd"
          },
          {
            "id": "0xb0fdfa888f4bf485c5e1fe7da7cd0602a24428cb7bc4cba4ee3c43e61a15f20d",
            "blockHeight": "30738255",
            "from": "0x79e06f034Cf960B360fFb0FE6C300aFF9E091d98",
            "to": "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
            "value": "30485080530383172",
            "contractAddress": "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd"
          },
          {
            "id": "0x3e9e81c473adb26aa5b73767ff98adf2cc1541170d222920ca66e368fcc6e946",
            "blockHeight": "30738226",
            "from": "0x79e06f034Cf960B360fFb0FE6C300aFF9E091d98",
            "to": "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
            "value": "18284534394168783",
            "contractAddress": "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd"
          },
          {
            "id": "0x231409b8a5cee2699ca7c8a2dda81c18b6ccad2c4f4724fd06d26d80ee996fb4",
            "blockHeight": "30738224",
            "from": "0x79e06f034Cf960B360fFb0FE6C300aFF9E091d98",
            "to": "0x94D13A9CF6cFeD7089C2e487dCC53C25cB0AcF1a",
            "value": "10058176217011011",
            "contractAddress": "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd"
          },
          {
            "id": "0xe8fb6aa646fc77d8f594f324f0f23eb9321307e3b36d04f17df920c06e630337",
            "blockHeight": "30738224",
            "from": "0x79e06f034Cf960B360fFb0FE6C300aFF9E091d98",
            "to": "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
            "value": "10053489076891799",
            "contractAddress": "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd"
          }
        ]
      }
    },
    "approvals": {
      "nodes": [
        {
          "id": "0x7cdf7d0a5e1be777c8cb2773ce0a157b1d18a5e91a77dd36793c5f9dbfcaa4a4",
          "blockHeight": null,
          "owner": "0xCBF177f46913069f6315219f243Dc14a21605fC8",
          "spender": "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
          "value": "100000000000000000",
          "contractAddress": "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd"
        },
        {
          "id": "0xac01452db99cb5e50d5defd20c72a88cb4286816fedd088709023c36c0e1ae85",
          "blockHeight": null,
          "owner": "0xCBF177f46913069f6315219f243Dc14a21605fC8",
          "spender": "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
          "value": "100000000000000000",
          "contractAddress": "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd"
        },
        {
          "id": "0xee60ff1f555bb052a0b624b9988855e6f8e368437911b42dfa3c18678e3dc91a",
          "blockHeight": null,
          "owner": "0xCBF177f46913069f6315219f243Dc14a21605fC8",
          "spender": "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
          "value": "100000000000000000",
          "contractAddress": "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd"
        },
        {
          "id": "0x0106161b9235f16a703b639eb241849076b72c6580d220d781098dea3912a090",
          "blockHeight": null,
          "owner": "0xCBF177f46913069f6315219f243Dc14a21605fC8",
          "spender": "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
          "value": "100000000000000000",
          "contractAddress": "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd"
        },
        {
          "id": "0x8a4da688ce5f82a8f5f4c6f50e09299e074e8aea6fb075d4a5c198aa649c8b91",
          "blockHeight": null,
          "owner": "0xCBF177f46913069f6315219f243Dc14a21605fC8",
          "spender": "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
          "value": "100000000000000000",
          "contractAddress": "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd"
        }
      ]
    }
  }
}
```

You can explore the different possible queries and entities to help you with GraphQL using the documentation draw on the right.

## Publish
TBD

## Cleanup
- Down Docker compose
```bash
$ docker-compose down
```

- Cleanup PostgreSQL data
```bash
$ sudo rm -rf .data/
```

## TODO

- Multi-chains supported

