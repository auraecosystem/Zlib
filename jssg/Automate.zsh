#!/usr/bin/env bash
set -e

echo "=== Installing prerequisites ==="
if ! command -v npm &> /dev/null; then
  echo "Please install Node.js and npm first."
  exit 1
fi

npm install -g codemod

if ! command -v cargo &> /dev/null; then
  echo "Rust not found. Install Rust via https://rustup.rs/"
  exit 1
fi

cargo install ast-grep

if ! command -v zig &> /dev/null; then
  echo "Zig not found. Download from https://ziglang.org/download"
  exit 1
fi

echo "=== Cloning repositories ==="
git clone https://github.com/auraecosystem/jssg
cd jssg
git checkout wip/cjs-to-esm || true

echo "=== Building jssg with Zig ==="
zig build

echo "=== Setting up tree-sitter grammars ==="
cd ..
git clone https://github.com/auraecosystem/tree-sitter
cd tree-sitter
npm install
npm run build
cd ..

echo "=== Creating ast-grep config ==="
cat > sgconfig.yml <<EOF
rules:
  - id: convert-commonjs-to-esm
    pattern: "require(\$VAR)"
    replace: "import \$VAR from ..."
EOF

echo "=== Running tests ==="
cd jssg
zig build test || echo "Tests failed — check src/test.zig"

echo "=== Sample codemod run ==="
echo "const fs = require('fs');" > sample.js
codemod run ./codemods/cjs-to-esm sample.js || echo "Codemod run failed"
cat sample.js

echo "=== Cleanup ==="
rm -f sample.js
zig build clean || true

echo "=== Setup, test, and cleanup complete! ==="
