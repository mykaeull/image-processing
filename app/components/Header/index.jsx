"use client";

import React from "react";
import FunctionsSelect from "../FunctionsSelect";
import "./index.scss";
import useImageUploaderContext from "@/app/contexts/ImageUploaderContext";
import { laplacianFilter } from "@/app/utils/filters/laplacian";

function generateHash(length = 8) {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let hash = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        hash += characters[randomIndex];
    }
    return hash + ".jpg";
}

const Header = () => {
    const { imageSrc, undoChange, fileName } = useImageUploaderContext();

    const transformationsOptions = [
        {
            name: "Sepia",
            transformationStr: `python filters.py 0 ${fileName} ${generateHash()}`,
            fields: [],
        },
        {
            name: "Escala de cinza",
            transformationStr: `python filters.py 1 ${fileName} ${generateHash()}`,
            fields: [],
        },
        {
            name: "Gamma",
            transformationStr: `python filters.py 5 ${fileName} param1 param2 ${generateHash()}`,
            fields: [0.2, 10.0],
        },
    ];

    const disabled = imageSrc === null ? true : false;

    return (
        <header className="header">
            <FunctionsSelect text="Filters" options={transformationsOptions} />
            <button
                disabled={disabled}
                style={{ cursor: disabled ? "not-allowed" : "pointer" }}
                onClick={undoChange}
            >
                Undo Changes
            </button>
        </header>
    );
};

export default Header;
