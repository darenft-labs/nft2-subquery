import { subqlTest } from "@subql/testing";
import { DataRegistry } from "../types";

subqlTest(
  "handleDataRegistryCreated test", // test name
  36349425, // block height to process
  [
    DataRegistry.create({
      id: "0xaEF59903412a974e3E4Bb85A69F8053297C0Bc8c",
      chainId: 1,
      address: "0xaEF59903412a974e3E4Bb85A69F8053297C0Bc8c",
      dapp: "0x84534a612d17568c26F2B4331Db8Fc62c7fA068b",
      uri: "IPFS://NTKH",
    }),
  ], // dependent entities
  [], // expected entities
  "handleDataRegistryCreated" //handler name
);
