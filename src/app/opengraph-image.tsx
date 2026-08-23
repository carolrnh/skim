import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_HOST, SKIM_PRICE_USD, SKIMS_PER_PAYMENT } from "../lib/site";

export const alt = "Skim — five red flags, a rewrite, and a reply";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const mark = await readFile(
    join(process.cwd(), "public/brand/skim-wordmark.png")
  );
  const src = `data:image/png;base64,${mark.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4efe6",
          color: "#1a1410",
          padding: "72px 80px",
        }}
      >
        <img src={src} width={420} height={273} alt="" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -1.5,
            }}
          >
            Five red flags. A rewrite. A reply.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 28,
              color: "#6b6258",
              fontWeight: 600,
            }}
          >
            {`$${SKIM_PRICE_USD}. Up to ${SKIMS_PER_PAYMENT} documents. ${SITE_HOST}`}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
