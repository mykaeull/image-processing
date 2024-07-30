"use client";

import useImageUploaderContext from "@/app/contexts/ImageUploaderContext";
import { laplacianFilter } from "@/app/utils/filters/laplacian";
import React, { useState } from "react";
import "./index.scss";
import FunctionsOption from "../FunctionsOption";

const FunctionsSelect = ({ options }) => {
    const [showFilters, setShowFilters] = useState(false);

    const { canvasRef, imageSrc, history, setHistory, setFileName, fileName } =
        useImageUploaderContext();

    const disabled = imageSrc === null ? true : false;

    async function send(message, canloadImage = true, data = undefined) {
        const obj = {
            message,
            data,
        };

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            mode: "cors",
            body: JSON.stringify(obj),
        };

        fetch("http://localhost:4000/", options)
            .then((response) => response.json())
            .then((response) => {});
    }

    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(err);
            img.src = src;
        });
    };

    const applyFilter = (transformationStr, fields) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        // const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // const pixels = imageData.data;
        // const filteredPixels = filterFunction(
        //     pixels,
        //     canvas.width,
        //     canvas.height
        // );

        // for (let i = 0; i < pixels.length; i++) {
        //     imageData.data[i] = filteredPixels[i];
        // }

        let transformationStrFormatted = transformationStr;

        for (let i = 1; i <= fields.length; i++) {
            transformationStrFormatted = transformationStrFormatted.replace(
                `param${i}`,
                `${fields[i - 1]}`
            );
        }

        send(transformationStrFormatted);

        const currentFileName = transformationStrFormatted
            .split(" ")
            .slice(-1)[0];

        setFileName(currentFileName);

        const currentFileNamePath = `http://localhost:4000/${currentFileName}`;

        const tryLoadImage = async () => {
            try {
                const data = await loadImage(currentFileNamePath);
                ctx.drawImage(data, 0, 0);
                const imageData = ctx.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
                ctx.putImageData(imageData, 0, 0);
                setHistory([...history, currentFileName]);
            } catch {
                await tryLoadImage();
            }
        };

        tryLoadImage();
    };

    const handleFilterClick = (transformationStr, fields) => {
        applyFilter(transformationStr, fields);
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
                Transformations
            </button>
            {showFilters && (
                <div className="filter-options">
                    {options.map((op, i) => (
                        <FunctionsOption
                            key={i}
                            option={op}
                            handleFilterClick={handleFilterClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FunctionsSelect;
