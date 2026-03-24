"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const HygraphPreview = dynamic(
  () =>
    import("@hygraph/preview-sdk/react").then((mod) => ({
      default: mod.HygraphPreview,
    })),
  { ssr: false }
);

export function PreviewWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT;

  if (!endpoint) return <>{children}</>;

  return (
    <HygraphPreview
      endpoint={endpoint}
      debug={true}
      onSave={() => {
        router.refresh();
      }}
      sync={{ fieldFocus: true, fieldUpdate: true }}
    >
      {children}
    </HygraphPreview>
  );
}
