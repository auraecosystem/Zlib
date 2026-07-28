const codemod: Codemod<TSX> = (root) => {
  const rootNode = root.root();
  
  // Early return for non-applicable files
  if (!root.filename().endsWith(".tsx")) {
    return null;
  }
  
  // Single traversal for multiple patterns
  const edits: Edit[] = [];
  
  rootNode
    .findAll({
      rule: {
        any: [
          { pattern: "console.log($$$ARGS)" },
          { pattern: "console.warn($$$ARGS)" },
          { pattern: "console.error($$$ARGS)" },
        ],
      },
    })
    .forEach((node) => {
      const callee = node.field("function");
      const method = callee?.field("property")?.text() || "log";
      const args = node.getMultipleMatches("ARGS")
        .map(arg => arg.text())
        .join(", ");
      edits.push(node.replace(`logger.${method}(${args})`));
    });
  
  return edits.length > 0 ? rootNode.commitEdits(edits) : null;
}

export default codemod;
