import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const publicRoutes = ["/login"]
  const [loading, setLoading] = useState(true)
  const route = useRouter()
  const path = usePathname()
  const isPublicRoute = publicRoutes.includes(path)

  useEffect(() => {
    const handleStart = () => setLoading(true)
    const handleComplete = () => setLoading(false)

    route.events.on("routeChangeStart", handleStart)
    route.events.on("routeChangeComplete", handleComplete)
    route.events.on("routeChangeError", handleComplete)

    return () => {
      route.events.off("routeChangeStart", handleStart)
      route.events.off("routeChangeComplete", handleComplete)
      route.events.off("routeChangeError", handleComplete)
    }
  }, [route])

  return (
    <>
      <Head>
        <title>Website</title>
      </Head>
      <Toaster position="top-right" richColors />
      {isPublicRoute ? (
        <Component {...pageProps} />
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
}
