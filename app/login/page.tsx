import LoginButton from "@/components/auth/LoginButton";
import { Drama } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
        <Drama className="h-10 w-10 text-white" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-gray-900">뮤지컬 커뮤니티</h1>
      <p className="mt-2 text-sm text-gray-500">
        뮤지컬을 사랑하는 사람들의 공간
      </p>
      <div className="mt-8">
        <LoginButton />
      </div>
    </div>
  );
}
