import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const publicRoutes = ["/"]
  const [loading, setLoading] = useState(false)
  const route = useRouter()
  const path = usePathname()
  const isPublicRoute = publicRoutes.includes(path)
  return (
    <>
      <Head>
        <title>Website</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
