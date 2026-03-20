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
      studioUrl={process.env.NEXT_PUBLIC_HYGRAPH_STUDIO_URL}
      debug={false}
      mode="auto"
      onSave={() => {
        router.refresh();
      }}
      overlay={{
        style: { borderColor: "#A1045A", borderWidth: "2px" },
        button: { backgroundColor: "#A1045A", color: "white" },
      }}
      sync={{ fieldFocus: true, fieldUpdate: false }}
    >
      {children}
    </HygraphPreview>
  );
}
