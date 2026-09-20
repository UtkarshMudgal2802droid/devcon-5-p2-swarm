# Take your records with you (Deccan Birders)

This repository fulfills **Problem Statement 2: Take your records with you** for the Road to Devcon V event.
It demonstrates data portability, format standardisation, and capability guarding on the Swarm decentralised network.

## Architecture

This submission contains two entirely independent applications:

1. **Sighting App (Writer)**: Located in `writer/`. Uses `@snaha/swarm-id` to authenticate users via browser and check their upload capabilities. It uploads bird sighting records to the public subsidised gateway (`https://api.gateway.ethswarm.org`). It implements aggressive capability guarding, halting gracefully if a new user lacks a postage stamp.
2. **Reader App**: Located in `reader/`. An entirely separate entrypoint that shares ZERO code with the Writer. It reads self-describing JSON records back through the `/bytes` endpoint of the gateway.

## Self-Describing Format
Every record uploaded to the network embeds its own format identifier and version. 
Please read `FORMAT.md` for the comprehensive schema definition that allows any third-party app to decode the Swarm bytes.

## Running the Apps

### Sighting App (Writer)
```bash
cd writer
npm install
npm run dev
```

### Reader App
```bash
cd reader
npm install
npm run dev
```

## Test Case Compliances
1. **Upload Capability (`canUpload`) Checked**: Yes. The Writer explicitly checks `canUpload` before executing `bee.data.upload`.
2. **Upload Route Configured Without Stamp**: Yes. Constructed `SwarmIdClient` with `subsidisedGatewayUrl`.
3. **Format Identifier**: Yes. Every record holds `_format` and `_version`.
4. **Independent Reader**: Yes. The Reader uses native validation and imports absolutely nothing from the Writer codebase. `FORMAT.md` acts as the cross-app contract.
5. **Read back via /bytes**: Yes. The reader calls `/bytes/<reference>` directly.
6. **No Pin/Tag on Gateway**: Yes. `bee.data.upload` is used plainly without passing the `{ pin: true }` object.
7. **Failed Upload Reason**: Yes. We throw "Your Swarm ID account lacks an active drive/postage stamp capability" when users cannot upload.
8. **No Secrets Tracked**: Yes. Everything relies on the OAuth browser flow.
