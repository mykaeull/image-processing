"use client";

import React, { useState, useEffect, useRef } from "react";
import useImageUploaderContext from "@/app/contexts/ImageUploaderContext";
import Modal from "@/app/components/Modal";
import send from "@/app/utils/send";
import generateHash from "@/app/utils/hash";

const loadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = src;
    });
};

const ChromaKey = ({ setShowModal, showModal, ...props }) => {
    const { canvasRef, imageSrc, history, setHistory, setFileName, fileName } =
        useImageUploaderContext();

    const [backFileName, setBackFileName] = useState("");
    const [distance, setDistance] = useState(50);
    const [red, setRed] = useState(0);
    const [green, setGreen] = useState(255);
    const [blue, setBlue] = useState(0);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        console.log(file);
        setBackFileName(file.name);
    };

    const apply = () => {
        const outName = generateHash(8);
        let command = `python filters.py 8 ${fileName} ${backFileName} ${distance} ${red} ${green} ${blue} ${outName}`;
        send(command);

        const currentFileNamePath = `http://localhost:4000/${outName}`;

        setFileName(outName);

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
                <p> Chroma Key </p>
            </Modal.Header>
            <Modal.Content
                style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                }}
            >
                <div>
                    <p> Selecione a imagem de background </p>
                    <input
                        style={{ marginTop: "10px" }}
                        type="file"
                        accept="image/jpeg"
                        onChange={handleFileChange}
                    />
                </div>

                <div style={{ marginTop: "30px" }}>
                    <p> Red </p>
                    <input
                        style={{ marginTop: "10px" }}
                        type="number"
                        value={red}
                        onChange={(e) => setRed(e.target.value)}
                    />
                    <p> Green </p>
                    <input
                        style={{ marginTop: "10px" }}
                        type="number"
                        value={green}
                        onChange={(e) => setGreen(e.target.value)}
                    />
                    <p> Blue </p>
                    <input
                        style={{ marginTop: "10px" }}
                        type="number"
                        value={blue}
                        onChange={(e) => setBlue(e.target.value)}
                    />
                </div>

                <div style={{ marginTop: "30px" }}>
                    <p> Distância </p>
                    <input
                        style={{ marginTop: "10px" }}
                        type="number"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                    />
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

export default ChromaKey;
