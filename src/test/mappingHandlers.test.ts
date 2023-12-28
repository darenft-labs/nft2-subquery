import { subqlTest } from "@subql/testing";
import { Transfer } from "../types";

/*
// https://academy.subquery.network/build/testing.html
subqlTest(
  "testName", // test name
  1000003, // block height to process
  [], // dependent entities
  [], // expected entities
  "handleEvent" //handler name
);
*/

subqlTest(
  "handleLog test", // test name
  30856764, // block height to process
  [Transfer.create({
    id: "0x8ab06e5820ae38371d0a14952751bd60dec3810dedcfb27582dcfc84d4a40601",
    from: "0x9a489505a00cE272eAa5e07Dba6491314CaE3796",
    to: "0x96629768e8b4D28AA3FfD4eBf29FF4FAe348Eb49",
    value: BigInt(400000000000000000),
    blockHeight: BigInt(30856764),
    contractAddress: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
  })], // dependent entities
  [], // expected entities
  "handleLog" //handler name
);
