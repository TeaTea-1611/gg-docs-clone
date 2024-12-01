import { Editor } from "./editor";
import { Navbar } from "./navbar";
import { Toolbar } from "./toolbar";

interface Props {
  params: Promise<{ docId: string }>;
}

export default async function Page({ params }: Props) {
  const { docId } = await params;

  return (
    <div className="min-h-screen">
      <div className="fixed inset-x-0 top-0 z-10 flex flex-col px-4 pt-2 gap-y-2 print:hidden bg-card h-[112px]">
        <Navbar />
        <Toolbar />
      </div>
      <div className="pt-[116px] print:p-0">
        <Editor />
      </div>
    </div>
  );
}
