# bwebbie187stealthagent

A minimal Solidity signal-storage contract. Each address can publish or replace its own signal; changes emit an event for applications and off-chain services to consume. The contract can be deployed to Base or GOAT Network using Hardhat.

> This repository deploys the on-chain contract only. It does not include an off-chain process that listens to events or autonomously performs actions. The contract has not been independently audited; review it and test on testnets before mainnet use.

## Networks

| Hardhat network | Chain ID | RPC default | Use |
| --- | ---: | --- | --- |
| `baseSepolia` | 84532 | `https://sepolia.base.org` | Base testnet |
| `base` | 8453 | `https://mainnet.base.org` | Base mainnet |
| `goatTestnet` | 48816 | `https://rpc.testnet3.goat.network` | GOAT Testnet3 |
| `goat` | 2345 | `https://rpc.goat.network` | GOAT mainnet |

RPC defaults are public endpoints and may be rate limited. Set the corresponding environment variable to use a provider endpoint you control. Confirm current network details with the official [Base](https://docs.base.org/) and [GOAT Network](https://docs.goat.network/docs/build/networks-rpc) documentation before deploying.

## Requirements

- Node.js 18 or newer and npm
- A wallet/private key dedicated to deployment, funded with the network's native gas token
- An RPC endpoint for each target network

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` and set `PRIVATE_KEY` to the deployer's private key. Keep `.env` private; it is ignored by Git. Do not use a wallet holding unrelated funds. The public RPC defaults can be overridden with `BASE_RPC`, `BASE_SEPOLIA_RPC`, `GOAT_RPC`, and `GOAT_TESTNET_RPC`.

Compile and run the test command before deployment:

```bash
npm run compile
npm test
```

## Deploy to testnets first

Fund the deployer with testnet gas tokens, then deploy:

```bash
npm run deploy:base-sepolia
npm run deploy:goat-testnet
```

## Deploy to mainnet

Mainnet deploys require an explicit confirmation flag to reduce accidental deployments. Check the selected network, RPC, deployer address, and available balance before running:

```bash
DEPLOY_CONFIRM_MAINNET=1 npm run deploy:base
DEPLOY_CONFIRM_MAINNET=1 npm run deploy:goat
```

On Windows PowerShell, set the flag for the command with `$env:DEPLOY_CONFIRM_MAINNET="1"; npm run deploy:base` (replace the script with `deploy:goat` for GOAT).

The deploy script verifies the RPC chain ID against the selected Hardhat network, refuses mainnet deployment without the confirmation flag, checks that the deployer has gas funds, waits for the deployment transaction, verifies contract bytecode, and writes deployment metadata to `deployments/<network>.json`. Verify the address and transaction on the relevant block explorer after deployment.

## Contract behavior and operational notes

- `updateSignal` requires at least the configured fee; excess payment is retained by the contract.
- The owner can change the fee and withdraw the contract balance.
- Signals are public on-chain data. Do not store secrets or personal data in them.
- This is not a fully autonomous agent: event monitoring and any off-chain actions require a separately operated service.
