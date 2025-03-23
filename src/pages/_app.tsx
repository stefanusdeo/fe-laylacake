import LayoutAuth from "@/components/template/layoutAuth";
import LayoutBoard from "@/components/template/layoutBoard";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "@/store/hooks/useAuth";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const publicPaths = ["/login", "/"]

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setIsLoading(false);
    } else {
      const unsubscribe = useAuthStore.persist.onHydrate(() => {
        setIsLoading(false);
      });

      return () => {
        unsubscribe();
      };
    }
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  const isPublicPath = publicPaths.some((path) => router.pathname === path || router.pathname.startsWith(`${path}/`))

  return (
    <>
      <Head>
        <title>Website</title>
      </Head>
      <Toaster position="top-right" richColors />
      {isPublicPath ? (
        <LayoutAuth restricted={true}>
          <Component {...pageProps} />
        </LayoutAuth>
      ) : (
        <LayoutBoard>
          <Component {...pageProps} />
        </LayoutBoard>
      )}
    </>
  );
}
