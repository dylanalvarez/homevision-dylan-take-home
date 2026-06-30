import React from "react";
import Link from "next/link";
import PageWithNavbar from "@/components/PageWithNavBar/PageWithNavBar";
import {Button} from "@/components/Button/Button";

export default function Home() {
    return (
        <PageWithNavbar>
            <div className="flex mt-32 items-center justify-center flex-col space-y-4">
                <div className="text-gray-900">example_document.pdf</div>
                <Link href="/review" passHref>
                    <Button variant="primary">
                        Review PDF file
                    </Button>
                </Link>
            </div>
        </PageWithNavbar>
    );
}