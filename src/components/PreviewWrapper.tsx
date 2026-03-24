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
      debug={true}
      mode="auto"
      onSave={() => {
        router.refresh();
      }}
      overlay={{
        style: { borderColor: "#A1045A", borderWidth: "2px" },
        button: { backgroundColor: "#A1045A", color: "white" },
      }}
      // fieldUpdate must be true so Studio sends "field-update" messages and the
      // preview iframe reflects edits side-by-side (see Preview SDK capabilities / fieldUpdateSync).
      sync={{ fieldFocus: true, fieldUpdate: true }}
    >
      {children}
    </HygraphPreview>
  );
}
