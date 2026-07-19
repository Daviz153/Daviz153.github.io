import { h } from "preact"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

const AdBannerTop = ({ fileData, displayClass }) => {
  if (fileData?.slug === "index") return null
  return h(
    "div",
    {
      class: classNames(displayClass, "ad-placeholder-test"),
      style:
        "margin: 1.5rem 0; padding: 1.5rem; text-align: center; " +
        "border: 2px dashed var(--gray, #b8b8b8); color: var(--darkgray, #4e4e4e); " +
        "font-family: var(--codeFont, monospace); border-radius: 4px;",
    },
    "<----광고 자리-------->",
  )
}

const AdBannerTop_default = () => AdBannerTop

export { AdBannerTop_default as AdBannerTop }
