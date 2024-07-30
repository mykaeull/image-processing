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
    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);

    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(err);
            img.src = src;
        });
    };

    const undoChange = () => {
        if (history.length > 1) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            history.pop();

            const currentFileName = history[history.length - 1];

            setFileName(currentFileName);

            const currentFileNamePath = `http://localhost:4000/${currentFileName}`;

            loadImage(currentFileNamePath).then((data) => {
                ctx.drawImage(data, 0, 0);
                const imageData = ctx.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
                ctx.putImageData(imageData, 0, 0);
                setHistory([...history]);
            });
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
                fileName,
                setFileName,
            }}
        >
            {children}
        </ImageUploaderContext.Provider>
    );
}

export default useImageUploaderContext;
