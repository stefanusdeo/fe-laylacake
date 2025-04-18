import Link from "next/link"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowLeft, Mail } from "lucide-react"
import { LuGlobeLock } from "react-icons/lu";

export default function ForbiddenPage() {
    const router = useRouter()

    const goBack = () => {
        router.back()
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="container flex max-w-md flex-col items-center justify-center gap-6 px-4 py-16 text-center">
                <div className="rounded-full bg-orange-400/20 p-6">
                    <LuGlobeLock className="h-16 w-16 text-orange-400" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">403</h1>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">Access Denied</h2>
                <p className="text-slate-600 dark:text-slate-400">
                    You don’t have permission to view this page. Please contact the administrator if you believe this is an error.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                    <Button onClick={goBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go Back
                    </Button>
                </div>
            </div>
        </div>
    )
}
