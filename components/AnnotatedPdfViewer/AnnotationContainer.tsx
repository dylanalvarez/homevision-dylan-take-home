import React from "react";

interface AnnotationContainerProps {
    children: React.ReactNode;
    width: number;
}

export function AnnotationContainer({children, width}: AnnotationContainerProps): React.ReactElement {
    return (
        <div className="bg-white" style={{width: `${width}px`}}>
            {children}
        </div>
    );
}
