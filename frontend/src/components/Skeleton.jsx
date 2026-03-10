import React from 'react';

const Skeleton = ({ className, variant = 'rect' }) => {
    const baseClasses = "animate-pulse bg-slate-200";
    const variantClasses = {
        rect: "rounded-2xl",
        circle: "rounded-full",
        text: "rounded-lg h-4 w-full"
    };

    return (
        <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
    );
};

export default Skeleton;
