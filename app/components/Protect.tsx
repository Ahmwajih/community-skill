import { useRouter } from "next/navigation"; // for app directory useRouter
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store"; // Adjust to your store's path

interface ProtectProps {
  children: React.ReactNode;
}

const Protect = ({ children }: ProtectProps) => {
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.token);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin"); // Redirect to the login page if not authenticated
    }
  }, [isAuthenticated, router]);

  // Render children only if authenticated
  if (!isAuthenticated) return null;

  return <>{children}</>;
};

export default Protect;