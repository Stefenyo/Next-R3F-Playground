import dynamic from "next/dynamic";

const ModelScene = dynamic(() => import("@/app/components/ModelScene/Scene"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

const SaveaInspiredScene = dynamic(
  () => import("@/app/components/SaveaInspired/Scene"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

export default function Home() {
  return (
    <main className="relative h-screen">
      <SaveaInspiredScene />
    </main>
  );
}
