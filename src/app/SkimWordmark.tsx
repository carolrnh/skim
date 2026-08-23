import Image from "next/image";

export default function SkimWordmark({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/brand/skim-wordmark.png"
      alt="Skim"
      width={720}
      height={467}
      priority={priority}
      className={["w-auto max-w-full self-start", className].filter(Boolean).join(" ")}
    />
  );
}
