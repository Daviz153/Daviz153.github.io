import { h } from "preact"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

const AdBannerFooter = ({ fileData, displayClass }) => {
  if (fileData?.slug === "index") return null
  return h(
    "div",
    {
      class: classNames(displayClass, "ad-placeholder-test", "ad-banner-footer"),
      style:
        "margin: 2rem 0 0; padding: 1rem 0.75rem; text-align: center; " +
        "border: 2px dashed var(--gray, #b8b8b8); color: var(--darkgray, #4e4e4e); " +
        "font-family: var(--codeFont, monospace); font-size: 0.8rem; " +
        "line-height: 1.5; border-radius: 4px;",
    },
    "<--광고 자리-->",
  )
}

const AdBannerFooter_default = () => AdBannerFooter

export { AdBannerFooter_default as AdBannerFooter }
