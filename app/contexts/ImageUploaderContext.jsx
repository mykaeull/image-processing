"use client";

import React, { createContext, useContext, useRef, useState } from "react";

const ImageUploaderContext = createContext();

function useImageUploaderContext() {
    const context = useContext(ImageUploaderContext);
    return context;
}

export function ImageUploaderProvider({ children }) {
    const [imageSrc, setImageSrc] = useState(null);
    const [history, setHistory] = useState([]);
    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);

    const undoChange = () => {
        if (history.length > 1) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            history.pop();
            ctx.putImageData(history[history.length - 1], 0, 0);
            setHistory([...history]);
        }
    };

    return (
        <ImageUploaderContext.Provider
            value={{
                fileInputRef,
                canvasRef,
                imageSrc,
                setImageSrc,
                history,
                setHistory,
                undoChange,
            }}
        >
            {children}
        </ImageUploaderContext.Provider>
    );
}

export default useImageUploaderContext;
