import LayoutBoard from "@/components/template/layoutBoard";
import { Toaster } from "@/components/ui/sonner";
import { checkMigration, getListTransactions } from "@/store/action/transactions";
import { useAuthStore } from "@/store/hooks/useAuth";
import { useTransactionStore } from "@/store/hooks/useTransactions";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const publicPaths = ["/login", "/", "/403", "/404"]

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const { statusMigration } = useTransactionStore()

  const [isLoading, setIsLoading] = useState(true)

  const checkMigrationStatus = () => {
    const intervalCheking = setInterval(async () => {
      const checkResult = await checkMigration();
      if (checkResult?.status === 200) {
        clearInterval(intervalCheking);
        localStorage.removeItem("tiketId");
        getListTransactions({ page: 1, limit: 10 })
        toast.success("Transfer is completed.");
      } else if (checkResult?.status === 102) {
        toast.info(checkResult?.message || "Transfer is still in progress. Please wait.");
      } else {
        localStorage.removeItem("tiketId");
        toast.error(checkResult?.message || "Failed to check transfer status. Please try again.");
        clearInterval(intervalCheking);
      }
    }, 1000);
  };

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


  useEffect(() => {
    if (statusMigration) {
      checkMigrationStatus()
    }
  }, [statusMigration])


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
