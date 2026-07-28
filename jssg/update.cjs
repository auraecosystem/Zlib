import { jssgTransform } from "codemod:ast-grep";
import type { Codemod } from "codemod:ast-grep";
import type TSX from "codemod:ast-grep/langs/tsx";
import type CSS from "codemod:ast-grep/langs/css";

// Secondary transform: convert .less → .css
const lessToCSS: Codemod<CSS> = async (root) => {
  root.rename(root.filename().replace('.less', '.css'));
  return transformedCSS;
};

// Primary transform: update imports and trigger the conversion
const codemod: Codemod<TSX> = async (root) => {
  const rootNode = root.root();
  const edits: Edit[] = [];

  const lessImports = rootNode.findAll({
    rule: { pattern: "import $$$NAMES from $SOURCE" },
  });

  for (const imp of lessImports) {
    const source = imp.getMatch("SOURCE");
    if (!source || !source.text().includes(".less")) continue;

    const lessPath = source.text().slice(1, -1);
    const cssPath = lessPath.replace(".less", ".css");

    // Transform the .less file
    await jssgTransform(lessToCSS, lessPath, "css");

    // Update the import in this file
    edits.push(source.replace(`"${cssPath}"`));
  }

  return edits.length > 0 ? rootNode.commitEdits(edits) : null;
};

export default codemod;
