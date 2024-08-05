"use client";

import React, { useState } from "react";
import "./index.scss";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap.css";

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
                        <Tooltip
                            key={i}
                            // trigger={["hover"]}
                            placement="top"
                            overlay={<span>{option.tooltipContents[i]}</span>}
                        >
                            <input
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
                        </Tooltip>
                    ))}
                </div>
            )}
        </>
    );
};

export default FunctionsOption;
