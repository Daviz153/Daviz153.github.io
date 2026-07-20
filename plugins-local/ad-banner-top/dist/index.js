import { h } from "preact"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

const AD_URL =
  "https://crmbiz.kr/%eb%85%b8%ec%85%98-%ea%b3%a0%ea%b0%9d%ea%b4%80%eb%a6%ac-%ed%85%9c%ed%94%8c%eb%a6%bf/?utm_source=wiki153&utm_medium=banner&utm_content=topLineAd&utm_campaign=notionTemp_promotion"

const AdBannerTop = ({ fileData, displayClass }) => {
  if (fileData?.slug === "index") return null
  return h(
    "a",
    {
      class: classNames(displayClass, "dvz-ad-banner-top"),
      href: AD_URL,
      target: "_blank",
      rel: "noopener",
      style:
        "display: block; margin: 1.5rem 0; padding: 1.1rem 1.4rem; " +
        "border-radius: 8px; text-decoration: none; " +
        "background: var(--secondary, #1F7BC1); " +
        "background: linear-gradient(135deg, var(--secondary, #1F7BC1) 0%, color-mix(in srgb, var(--secondary, #1F7BC1) 100%, black 30%) 100%); " +
        "font-family: var(--bodyFont, 'Pretendard', sans-serif);",
    },
    h(
      "div",
      {
        style:
          "font-size: 1rem; font-weight: 700; color: #ffffff; line-height: 1.4;",
      },
      "그 고객, 갱신일 지난 거 알고 계셨어요?",
    ),
    h(
      "div",
      {
        style:
          "margin-top: 4px; font-size: 0.85rem; color: rgba(255, 255, 255, 0.85); line-height: 1.4;",
      },
      "엑셀·수첩·카톡에 흩어진 고객정보, 노션 하나로 끝내는 법 →",
    ),
  )
}

const AdBannerTop_default = () => AdBannerTop

export { AdBannerTop_default as AdBannerTop }
