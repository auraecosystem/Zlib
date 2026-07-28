# Build the project
zig build

# Run existing codemod (CommonJS → ES Modules)
npx codemod @nodejs/cjs-to-esm
