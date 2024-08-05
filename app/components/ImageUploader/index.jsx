"use client";

import React, { useRef, useState } from "react";
import "./index.scss";
import { GrGallery } from "react-icons/gr";
import useImageUploaderContext from "@/app/contexts/ImageUploaderContext";

const ImageUploader = () => {
    const {
        fileInputRef,
        canvasRef,
        imageSrc,
        setImageSrc,
        setHistory,
        setFileName,
        fileName,
    } = useImageUploaderContext();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === "image/jpeg") {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageSrc(e.target.result);
                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");
                const image = new Image();
                image.src = e.target.result;

                image.onload = () => {
                    canvas.width  = image.width;
                    canvas.height = image.height;
                    console.log(image.width, image.height);
                    ctx.drawImage(image, 0, 0);

                    setHistory([file.name]);

                    const imageData = ctx.getImageData(
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );
                    const pixels = imageData.data;

                    // console.log(pixels);
                };
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please select an image file (png or jpg).");
        }
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    return (
        <>
            {!imageSrc && <h3>Select an image to start</h3>}
            <div
                onClick={handleClick}
                className="image-upload-container"
                style={{
                    border: imageSrc ? "none" : "1px solid gray",
                    backgroundColor: imageSrc ? null : "#313131",
                }}
            >
                <input
                    type="file"
                    accept="image/jpeg"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    style={{ display: "none" }}
                />
                {!imageSrc && <GrGallery size={48} />}
                <canvas
                    ref={canvasRef}
                    style={{
                        display: imageSrc ? "block" : "none",
                        // width: "100%",
                        // height: "100%",
                        objectFit: "contain",
                    }}
                />
            </div>
        </>
    );
};

export default ImageUploader;
