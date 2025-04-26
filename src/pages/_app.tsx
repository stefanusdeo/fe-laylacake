import LayoutBoard from "@/components/template/layoutBoard";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "@/store/hooks/useAuth";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const publicPaths = ["/login", "/", "/403", "/404"]

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

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
        <title>Laylacake</title>
      </Head>
      <Toaster position="top-right" richColors />
      {isPublicPath ? (
        <Component {...pageProps} />
      ) : (
        <LayoutBoard>
          <Component {...pageProps} />
        </LayoutBoard>
      )}
    </>
  );
}
