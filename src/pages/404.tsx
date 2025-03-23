import Link from "next/link"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
    const router = useRouter()

    const goBack = () => {
        router.back()
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="container flex max-w-md flex-col items-center justify-center gap-6 px-4 py-16 text-center">
                <div className="rounded-full bg-amber-400/20 p-6">
                    <AlertTriangle className="h-16 w-16 text-amber-400" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">404</h1>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">Page Not Found</h2>
                <p className="text-slate-600 dark:text-slate-400">
                    Sorry, the page you are looking for cannot be found or has been moved.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                    <Button onClick={goBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to home
                    </Button>
                    <Button variant="outline" asChild className="border-slate-300 dark:border-slate-700">
                        <Link href={"/login"}>Contact Us</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

