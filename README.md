# Chess

A chess board in React + TypeScript, with the movement rules written from
scratch — no chess library. Click a piece, click a destination; illegal moves
are refused.

<!-- SCREENSHOT: add docs/board.png -->
<!-- LIVE DEMO: add the deploy URL here and in the repo's About field -->

## What it does

- Full board with both armies in their opening positions
- Movement rules per piece: pawn, rook, knight, bishop, queen, king
- Path blocking — a rook cannot jump a piece standing between origin and target
- Captures
- Turn alternation between white and black

## What it does not do

No check or checkmate detection, no castling, no en passant, no promotion.
The board does not know the game is over.

## Running it

```bash
npm install
npm run dev
```

## About the code

A weekend project from 2022, written while learning TypeScript. The movement
rules live in `src/Board.tsx`: each piece type has a function that enumerates
the squares it could reach, and a separate pass checks whether anything stands
in the way. Positions are encoded as `"<row><column>"` strings, which keeps the
lookups to a single `Map`.

The code shows its age — some identifiers are in Portuguese, and the blocking
logic is longer than it needs to be. It is kept as written rather than
retouched.

## Stack

React 18 · TypeScript · Vite
