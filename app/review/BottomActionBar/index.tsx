import React from "react";
import {Button} from "@/components/Button";

interface BottomActionBarProps {
    hasIssues: boolean;
    onUpload?: () => void;
    onSubmit?: () => void;
}

export function BottomActionBar({onUpload, onSubmit, hasIssues}: BottomActionBarProps) {
    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-50 flex w-full items-center justify-end gap-3 border-t border-gray-200 bg-white px-6 py-4 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
            <Button variant="secondary" onClick={onUpload}>
                Upload new version
            </Button>
            {!hasIssues && <Button variant="primary" onClick={onSubmit}>
                Submit
            </Button>}
        </div>
    );
}