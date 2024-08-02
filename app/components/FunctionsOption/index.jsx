"use client";

import React, { useState } from "react";
import "./index.scss";

const FunctionsOption = ({ option, handleFilterClick }) => {
    const [fields, setFields] = useState(option.fields);

    return (
        <>
            {fields.length === 0 ? (
                <button
                    key={option.name}
                    onClick={() =>
                        handleFilterClick(option.transformationStr, fields)
                    }
                    className="filter-option-button"
                >
                    {option.name}
                </button>
            ) : (
                <div className="filter-section">
                    <button
                        key={option.name}
                        onClick={() =>
                            handleFilterClick(option.transformationStr, fields)
                        }
                        className="filter-option-button"
                    >
                        {option.name}
                    </button>
                    {fields.map((field, i) => (
                        <input
                            key={i}
                            value={field}
                            type="number"
                            step="0.1"
                            onChange={(e) => {
                                const newFields = [...fields];
                                newFields[i] = parseFloat(e.target.value);
                                setFields(newFields);
                            }}
                            className="filter-input"
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default FunctionsOption;
