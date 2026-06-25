import React from "react";
import Link from "next/link";
import PageWithNavbar from "@/components/PageWithNavBar";

export default function Home() {
    return (
        <PageWithNavbar>
            <div className="flex mt-32 items-center justify-center">
                <Link
                    href="/review"
                    className="rounded-lg bg-blue-600 px-6 py-3 text-lg font-medium text-white shadow-sm transition hover:bg-blue-700"
                >
                    Review PDF file
                </Link>
            </div>
        </PageWithNavbar>
    );
}