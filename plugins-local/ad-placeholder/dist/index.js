function findH2Indices(children) {
  const idxs = []
  children.forEach((node, i) => {
    if (node.type === "element" && node.tagName === "h2") idxs.push(i)
  })
  return idxs
}

function makePlaceholder() {
  return {
    type: "element",
    tagName: "div",
    properties: {
      className: ["ad-placeholder-test"],
      style:
        "margin: 1.5rem 0; padding: 1.5rem; text-align: center; " +
        "border: 2px dashed var(--gray, #b8b8b8); color: var(--darkgray, #4e4e4e); " +
        "font-family: var(--codeFont, monospace); border-radius: 4px;",
    },
    children: [{ type: "text", value: "<----광고 자리-------->" }],
  }
}

function rehypeAdPlaceholder() {
  return (tree, file) => {
    if (!tree.children) return
    if (file?.data?.slug === "index") return

    const h2Indices = findH2Indices(tree.children)
    const insertAfterIndices = []
    if (h2Indices.length >= 1) insertAfterIndices.push(h2Indices[0])
    if (h2Indices.length >= 3) insertAfterIndices.push(h2Indices[2])

    // Splice highest index first so earlier indices stay valid.
    insertAfterIndices
      .sort((a, b) => b - a)
      .forEach((pos) => {
        tree.children.splice(pos + 1, 0, makePlaceholder())
      })
  }
}

export default function AdPlaceholder(_userOpts) {
  return {
    name: "AdPlaceholder",
    htmlPlugins() {
      return [rehypeAdPlaceholder]
    },
  }
}
