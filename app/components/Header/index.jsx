"use client";

import React from "react";
import FunctionsSelect from "../FunctionsSelect";
import "./index.scss";
import useImageUploaderContext from "@/app/contexts/ImageUploaderContext";
import { laplacianFilter } from "@/app/utils/filters/laplacian";

const filtersOptions = [
    {
        name: "laplacian",
        filterFn: laplacianFilter,
    },
];

const Header = () => {
    const { imageSrc, undoChange } = useImageUploaderContext();

    const disabled = imageSrc === null ? true : false;

    return (
        <header className="header">
            <div className="right-content">
                <FunctionsSelect text="Filters" options={filtersOptions} />
            </div>
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
