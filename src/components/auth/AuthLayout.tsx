import { type ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900">
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
      {children}
    </div>
  </div>
);

export default AuthLayout;