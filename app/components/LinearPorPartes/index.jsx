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

function getPoints(points, canvas) {
    const curPoints = points.map((p) => [p[0], canvas.height - p[1]]);

    let factorX = 254 / canvas.width;
    let factorY = 254 / canvas.height;

    return curPoints.map((p) => {
        return [Math.round(p[0] * factorX), Math.round(p[1] * factorY)];
    });
}

function apply(points, canvas, fileName) {
    points = getPoints(points, canvas);

    let command = `python filters.py 26 ${fileName} ${points.length} `;

    for (let e of points) {
        command = command + e + " ";
    }

    const outName = generateHash(8);
    command = command + outName;

    send(command);
    console.log(command);
    return outName;
}

const LinearPorPartes = ({ setShowModal, showModal, ...props }) => {
    const { canvasRef, imageSrc, history, setHistory, setFileName, fileName } =
        useImageUploaderContext();

    const localCanvas = useRef(null);
    const [points, setPoints] = useState([
        [0, 399, 0],
        [399, 0, 1],
    ]);

    useEffect(() => {
        if (!localCanvas.current) return;
        const canvas = localCanvas.current;
        const ctx = canvas.getContext("2d");

        // Definindo o tamanho do canvas
        canvas.width = 400;
        canvas.height = 400;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();

        for (let i = 0; i < points.length - 1; i++) {
            let [x, y] = [points[i][0], points[i][1]];
            let [endx, endy] = [points[i + 1][0], points[i + 1][1]];
            ctx.moveTo(x, y);
            ctx.lineTo(endx, endy);
            ctx.arc(endx, endy, 2, 0, 2 * Math.PI);
        }

        ctx.stroke();
    }, [showModal, points]);

    const handleCanvasClick = (event) => {
        const canvas = localCanvas.current;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        setPoints((prevPoints) => {
            const newPoints = [...prevPoints, [x, y, prevPoints.length]];
            return newPoints.sort((a, b) => a[0] - b[0]);
        });
    };

    const applyFilter = () => {
        const outName = apply(points, localCanvas.current, fileName);

        setFileName(outName);

        const currentFileNamePath = `http://localhost:4000/${outName}`;

        setShowModal(false);

        const tryLoadImage = async () => {
            try {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");
                const data = await loadImage(currentFileNamePath);
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
            style={{ minWidth: "400px", minHeight: "400px" }}
        >
            <Modal.Header>
                <p> Linear por partes </p>
            </Modal.Header>
            <Modal.Content>
                <canvas
                    ref={localCanvas}
                    onClick={handleCanvasClick}
                    style={{
                        width: "400px",
                        height: "400px",
                        backgroundColor: "white",
                    }}
                />
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
                    <button onClick={applyFilter}>Apply</button>
                    <button onClick={() => setShowModal(!showModal)}>
                        Close
                    </button>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        onClick={() =>
                            setPoints([
                                [0, 399, 0],
                                [399, 0, 1],
                            ])
                        }
                    >
                        Clear
                    </button>
                    <button
                        onClick={() => {
                            if (points.length <= 2) return;
                            setPoints((prevPoints) => {
                                const lastPointIndex = prevPoints.length - 1;
                                const newPoints = [
                                    ...prevPoints.filter(
                                        (point) => point[2] != lastPointIndex
                                    ),
                                ];
                                return newPoints;
                            });
                        }}
                    >
                        Undo
                    </button>
                </div>
            </Modal.Footer>
        </Modal.Root>
    );
};

export default LinearPorPartes;
