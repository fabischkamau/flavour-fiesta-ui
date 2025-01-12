import { XCircle } from "lucide-react";

export default function ErrorBoundary({ message }: { message: string }) {
  return (
    <div>
      <div className="text-red-500 text-center mb-4 flex flex-col items-center gap-4 min-h-[400px] justify-center">
        <XCircle className="w-12 h-12" />
        <p>{message}</p>
      </div>
    </div>
  );
}
