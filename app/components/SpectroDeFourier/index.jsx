"use client";

import React, { useState, useEffect, useRef } from "react";
import useImageUploaderContext from "@/app/contexts/ImageUploaderContext";
import Modal from "@/app/components/Modal";
import send from "@/app/utils/send";
import generateHash from "@/app/utils/hash";

const distance2D = (p1, p2) => {
    return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
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

function getBlackCanvas(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    const data = ctx.createImageData(width, height);
    for (let i = 0; i < data.data.length; i += 4) {
        data.data[i] = 0;
        data.data[i + 1] = 0;
        data.data[i + 2] = 0;
        data.data[i + 3] = 255;
    }
    ctx.putImageData(data, 0, 0);
    return canvas;
}

function getPixels(canvas) {
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return imageData.data;
}

function loadSpectre(fileName) {
    const outName = generateHash(8);
    let command = `python filters.py 24 ${fileName} ${outName}`;

    send(command);
    return outName;
}

const SpectroFourier = ({ setShowModal, showModal, ...props }) => {
    const localCanvas = useRef(null);
    const { canvasRef, imageSrc, history, setHistory, setFileName, fileName } =
        useImageUploaderContext();

    const [points, setPoints] = useState([]);
    const [mouseDown, setMouseDown] = useState(false);
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (!showModal) return;

        const canvas = localCanvas.current;
        setImage(canvas);

        setPoints([]);

        const outName = loadSpectre(fileName);

        const currentFileNamePath = `http://localhost:4000/${outName}`;

        const tryLoadImage = async () => {
            try {
                const canvas = localCanvas.current;
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
            } catch {
                setTimeout(() => {
                    tryLoadImage();
                }, 1000);
            }
        };

        tryLoadImage();
    }, [showModal]);

    const noMouseMoveHandler = (event) => {
        if (!mouseDown) return;
        const canvas = localCanvas.current;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        let lastPoint = null;
        if (points.length) {
            lastPoint = points.slice(-1)[0];
        }

        if (lastPoint && distance2D([x, y], lastPoint) < 1) return;

        // ctx.save();
        ctx.moveTo(x, y);
        ctx.arc(x, y, 2, 0, 4 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
        // ctx.restore();

        setPoints((prevPoints) => {
            const newPoints = [...prevPoints, [x, y]];
            return newPoints;
        });
    };

    const generateBlackCanvas = () => {
        const newCanvas = getBlackCanvas(
            localCanvas.current.width,
            localCanvas.current.height
        );

        const ctx = newCanvas.getContext("2d");

        for (const point of points) {
            const [x, y] = point;
            ctx.moveTo(x, y);
            ctx.arc(x, y, 2, 0, 4 * Math.PI);
            ctx.fillStyle = "white";
            ctx.fill();
        }

        const imageData = ctx.getImageData(
            0,
            0,
            newCanvas.width,
            newCanvas.height
        );

        const pxs = [];

        for (let x = 0; x < newCanvas.width; x++) {
            let row = [];
            for (let y = 0; y < newCanvas.height; y++) {
                const i = (y * newCanvas.width + x) * 4;
                const r = imageData.data[i];
                row.push(r > 0 ? 0 : 1);
            }
            pxs.push(row);
        }

        const outName = generateHash(8);

        send(`python filters.py 25 ${fileName} ${outName}`, true, {
            pixels: pxs,
            width: newCanvas.width,
            height: newCanvas.height,
        });

        setFileName(outName);

        const currentFileNamePath = `http://localhost:4000/${outName}`;

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

        //localCanvas.current.getContext("2d").putImageData(imageData, 0, 0);
        // localCanvas.current = newCanvas;
    };

    return (
        <Modal.Root
            showModal={showModal}
            style={{ minWidth: "600px", minHeight: "300px" }}
        >
            <Modal.Header>
                <p> Spectro de Fourier </p>
            </Modal.Header>
            <Modal.Content
                style={{ display: "flex", justifyContent: "center" }}
            >
                <div>
                    <canvas
                        ref={localCanvas}
                        onMouseDown={() => setMouseDown(true)}
                        onMouseUp={() => setMouseDown(false)}
                        onMouseLeave={() => setMouseDown(false)}
                        onMouseMove={noMouseMoveHandler}
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
                    <button
                        onClick={() => {
                            generateBlackCanvas();
                            setShowModal(false);
                        }}
                    >
                        Apply
                    </button>
                    <button onClick={() => setShowModal(!showModal)}>
                        Close
                    </button>
                </div>
            </Modal.Footer>
        </Modal.Root>
    );
};

export default SpectroFourier;
