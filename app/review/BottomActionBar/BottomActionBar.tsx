import React from "react";
import {Button} from "@/components/Button/Button";
import {Tooltip, TooltipContent, TooltipTrigger} from "@radix-ui/react-tooltip";

interface BottomActionBarProps {
    hasBlockingIssues: boolean;
    onUpload?: () => void;
    onSubmit?: () => void;
}

export function BottomActionBar({onUpload, onSubmit, hasBlockingIssues}: BottomActionBarProps) {
    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-50 flex w-full items-center justify-end gap-3 border-t border-gray-200 bg-white px-6 py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
            <Button variant="secondary" onClick={onUpload}>
                Upload new version
            </Button>

            {hasBlockingIssues ? (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span>
                            <Button variant="primary" disabled>
                                Submit
                            </Button>
                        </span>
                    </TooltipTrigger>

                    <TooltipContent
                        side="top"
                        sideOffset={8}
                        className="z-50 rounded-md bg-gray-900 px-3 py-2 text-sm text-white shadow-lg"
                    >
                        All Critical and Major issues must be resolved
                    </TooltipContent>
                </Tooltip>
            ) : (
                <Button variant="primary" onClick={onSubmit}>
                    Submit
                </Button>
            )}
        </div>
    );
}