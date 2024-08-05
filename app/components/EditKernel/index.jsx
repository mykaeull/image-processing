"use client";

import React, { useState, useEffect, useRef } from "react";
import useImageUploaderContext from "@/app/contexts/ImageUploaderContext";
import Modal from "@/app/components/Modal";
import send from "@/app/utils/send";
import generateHash from "@/app/utils/hash";

const getDefaultValues = (odd) => {
    const result = [];
    for (let i = 0; i < odd; i++) {
        for (let j = 0; j < odd; j++) {
            result.push(i + j);
        }
    }

    return result;
};

const generateDynamicInputs = (oddNumber, states, setStates) => {
    let HTMLElements = [];
    for (let i = 0; i < oddNumber; i++) {
        let elements = [];
        for (let j = 0; j < oddNumber; j++) {
            elements.push(
                <input
                    key={i + j}
                    style={{ width: "50px" }}
                    type="number"
                    value={states[i * oddNumber + j]}
                    onChange={() => {
                        let newStates = [...states];
                        newStates[i * oddNumber + j] = event.target.value;
                        setStates(newStates);
                    }}
                ></input>
            );
        }

        HTMLElements.push(
            <div key={i} style={{ display: "flex", gap: "5px" }}>
                {...elements}
            </div>
        );
    }

    return HTMLElements;
};

const loadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = src;
    });
};

const EditKernel = ({ setShowModal, showModal, ...props }) => {
    const { canvasRef, imageSrc, history, setHistory, setFileName, fileName } =
        useImageUploaderContext();

    const [kernelSize, setKernelSize] = useState(3);
    const [states, setStates] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8]);

    const apply = () => {
        const outName = generateHash(8);
        let command = `python filters.py 23 ${fileName} ${kernelSize} `;

        for (let i = 0; i < states.length; i++) {
            command += `${states[i]} `;
        }

        command += outName;

        send(command);

        const currentFileNamePath = `http://localhost:4000/${outName}`;

        setFileName(outName);

        setShowModal(false);

        const tryLoadImage = async () => {
            try {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");

                const data = await loadImage(currentFileNamePath);

                canvas.width = data.width;
                canvas.height = data.height;

                ctx.drawImage(data, 0, 0);

                const imageData = ctx.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
                ctx.putImageData(imageData, 0, 0);
                setHistory([...history, outName]);
            } catch {
                setTimeout(() => {
                    tryLoadImage();
                }, 1000);
            }
        };

        tryLoadImage();
    };

    return (
        <Modal.Root
            showModal={showModal}
            style={{ minWidth: "300px", height: "fit-content" }}
        >
            <Modal.Header>
                <p> Convolução Genérica </p>
            </Modal.Header>
            <Modal.Content
                style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                    }}
                >
                    <p> Dimensão do Kernel </p>
                    <input
                        style={{ marginTop: "10px", width: "50px" }}
                        type="number"
                        value={kernelSize}
                        min="3"
                        step="2"
                        onChange={() => {
                            if (event.target.value % 2 === 0) {
                                alert("Apenas números impares são permitidos");
                            } else if (event.target.value > 9) {
                                alert("O tamanho máximo do Kernel deve ser 9");
                            } else if (event.target.value < 3) {
                                alert("O tamanho mínimo do Kernel deve ser 3");
                            } else {
                                setKernelSize(event.target.value);
                                setStates(getDefaultValues(event.target.value));
                            }
                        }}
                    />
                </div>

                <div
                    style={{
                        marginTop: "30px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "5px",
                    }}
                >
                    {generateDynamicInputs(kernelSize, states, setStates)}
                </div>
            </Modal.Content>
            <Modal.Footer
                style={{
                    display: "flex",
                    flexDirection: "row-reverse",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row-reverse",
                        width: "100%",
                        gap: "10px",
                    }}
                >
                    <button onClick={apply}>Apply</button>
                    <button onClick={() => setShowModal(!showModal)}>
                        Close
                    </button>
                </div>
            </Modal.Footer>
        </Modal.Root>
    );
};

export default EditKernel;
