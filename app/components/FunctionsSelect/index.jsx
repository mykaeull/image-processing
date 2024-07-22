"use client";

import useImageUploaderContext from "@/app/contexts/ImageUploaderContext";
import { laplacianFilter } from "@/app/utils/filters/laplacian";
import React, { useState } from "react";
import "./index.scss";

const FunctionsSelect = ({ text, options }) => {
    const [showFilters, setShowFilters] = useState(false);

    const { canvasRef, imageSrc, history, setHistory } =
        useImageUploaderContext();

    const disabled = imageSrc === null ? true : false;

    const applyFilter = (filterFunction) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        const filteredPixels = filterFunction(
            pixels,
            canvas.width,
            canvas.height
        );

        for (let i = 0; i < pixels.length; i++) {
            imageData.data[i] = filteredPixels[i];
        }

        ctx.putImageData(imageData, 0, 0);
        setHistory([
            ...history,
            ctx.getImageData(0, 0, canvas.width, canvas.height),
        ]);
    };

    const handleFilterClick = (filterFunction) => {
        applyFilter(filterFunction);
        setShowFilters(false);
    };

    return (
        <div className="filter-container">
            <button
                className="filter-text"
                onClick={() => setShowFilters(!showFilters)}
                disabled={disabled}
                style={{ cursor: disabled ? "not-allowed" : "pointer" }}
            >
                {text}
            </button>
            {showFilters && (
                <div className="filter-options">
                    {options.map((op) => (
                        <button
                            key={op.name}
                            onClick={() => handleFilterClick(op.filterFn)}
                            className="filter-option-button"
                        >
                            {op.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FunctionsSelect;
