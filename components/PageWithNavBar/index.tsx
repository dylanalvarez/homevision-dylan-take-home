"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

type PageWithNavbarProps = {
    children: React.ReactNode;
    navbarContent?: React.ReactNode;
};

export default function PageWithNavbar({
                                           children,
                                           navbarContent = <></>,
                                       }: PageWithNavbarProps) {
    return (
        <div className="min-h-screen bg-gray-100">
            <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-gray-200">
                <div className="h-full px-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/">
                            <Image
                                src="/HomeVision_Logo.svg"
                                alt="HomeVision Logo"
                                width={120}
                                height={32}
                                priority
                            />
                        </Link>
                    </div>

                    <div className="flex items-center">
                        {navbarContent}
                    </div>
                </div>
            </header>

            <main className="pt-14">
                {children}
            </main>
        </div>
    );
}