## Utility functions for Amazon Kindle

Tested using the Kindle Paperwhite (10th Generation) running KindleOS 5.13.4.

I tried using a few repos to organise my Kindle quotations but most are outdated with little support. This is a NodeJS implementation that requires 0 packages, written in vanilla JavaScript.

## Usage

Put your _My Clippings.txt_ file in the root directory.

To export your citations as a .json:

```bash
npm run json
```

To export your citations as a .md:

```bash
npm run md
```

To export your citations as a .txt:

```bash
npm run txt
```

Or to export all three:

```bash
npm start
```

Collect your rewards from `./output`.
