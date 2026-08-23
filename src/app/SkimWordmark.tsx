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
      src="/brand/skim-wordmark.jpg"
      alt="Skim"
      width={923}
      height={610}
      priority={priority}
      className={["w-auto max-w-full self-start", className].filter(Boolean).join(" ")}
    />
  );
}
