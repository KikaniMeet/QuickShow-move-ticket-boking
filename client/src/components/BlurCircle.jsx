import React from "react";

const BlurCircl = ({ top = "auto", left = "auto", right = "auto", bottom = "auto" }) => {
    return (
        <div
            className="absolute -z-50 h-58 w-58 aspect-square rounded-full bg-red-500/20 blur-2xl"
            style={{ top, left, right, bottom }}
        >
        
        </div>
    );
};

export default BlurCircl;
