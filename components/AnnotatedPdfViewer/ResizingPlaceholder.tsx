import React from "react";

interface ResizingPlaceholderProps {
    width: number;
}

export function ResizingPlaceholder({width}: ResizingPlaceholderProps): React.ReactElement {
    return (
        <div className="fixed top-0 h-screen bg-gray-300 z-10 flex justify-center" style={{width: `${width}px`}}></div>
    );
}
