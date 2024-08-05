"use client";

import React, { useState, useRef } from "react";
import FunctionsSelect from "../FunctionsSelect";
import "./index.scss";
import useImageUploaderContext from "@/app/contexts/ImageUploaderContext";
import LinearPorPartes from "@/app/components/LinearPorPartes";
import SpectroFourier from "@/app/components/SpectroDeFourier";
import ChromaKey from "@/app/components/ChromaKey";
import EditKernel from "@/app/components/EditKernel";
import generateHash from "@/app/utils/hash";

const Header = () => {
    const { imageSrc, undoChange, fileName, canvasRef } =
        useImageUploaderContext();
    const [showModal, setShowModal] = useState(false);
    const [showModalSpectro, setShowModalSpectro] = useState(false);
    const [showModalChroma, setShowModalChroma] = useState(false);
    const [showModalKernel, setShowModalKernel] = useState(false);

    const transformationsOptions = [
        {
            name: "Sepia",
            transformationStr: `python filters.py 0 ${fileName} ${generateHash()}`,
            fields: [],
            tooltipContents: [],
        },
        {
            name: "Escala de cinza Ponderada",
            transformationStr: `python filters.py 1 ${fileName} ${generateHash()}`,
            fields: [],
            tooltipContents: [],
        },
        {
            name: "Escala de cinza Simples",
            transformationStr: `python filters.py 1 ${fileName} true ${generateHash()}`,
            fields: [],
            tooltipContents: [],
        },
        {
            name: "Log",
            transformationStr: `python filters.py 4 ${fileName} param1 ${generateHash()}`,
            fields: [100],
            tooltipContents: ["constante"],
        },
        {
            name: "Negativo",
            transformationStr: `python filters.py 2 ${fileName} ${generateHash()}`,
            fields: [],
            tooltipContents: [],
        },
        {
            name: "Detecção de borda",
            transformationStr: `python filters.py 3 ${fileName} ${generateHash()}`,
            fields: [],
            tooltipContents: [],
        },
        {
            name: "Gamma",
            transformationStr: `python filters.py 5 ${fileName} param1 param2 ${generateHash()}`,
            fields: [0.2, 10.0],
            tooltipContents: ["gama", "constante"],
        },
        {
            name: "SobelX",
            transformationStr: `python filters.py 6 ${fileName} ${generateHash()}`,
            fields: [],
            tooltipContents: [],
        },
        {
            name: "SobelY",
            transformationStr: `python filters.py 7 ${fileName} ${generateHash()}`,
            fields: [],
            tooltipContents: [],
        },
        {
            name: "Ajuste Brilho",
            transformationStr: `python filters.py 9 ${fileName} param1 ${generateHash()}`,
            fields: [20],
            tooltipContents: ["fator de ajuste"],
        },
        {
            name: "Ajuste Saturação",
            transformationStr: `python filters.py 10 ${fileName} param1 ${generateHash()}`,
            fields: [50],
            tooltipContents: ["fator de ajuste"],
        },
        {
            name: "Ajuste Matiz",
            transformationStr: `python filters.py 11 ${fileName} param1 ${generateHash()}`,
            fields: [50],
            tooltipContents: ["fator de ajuste"],
        },
        {
            name: "Filtro Média",
            transformationStr: `python filters.py 12 ${fileName} param1 ${generateHash()}`,
            fields: [5],
            tooltipContents: ["dimensão do kernel"],
        },
        {
            name: "Filtro Gauss",
            transformationStr: `python filters.py 13 ${fileName} param1 ${generateHash()}`,
            fields: [5],
            tooltipContents: ["dimensão do kernel"],
        },
        {
            name: "Filtro Mediana",
            transformationStr: `python filters.py 14 ${fileName} param1 ${generateHash()}`,
            fields: [5],
            tooltipContents: ["dimensão do kernel"],
        },
        {
            name: "Aguçamento de Laplace",
            transformationStr: `python filters.py 15 ${fileName} ${generateHash()}`,
            fields: [],
            tooltipContents: [],
        },
        {
            name: "High Boost",
            transformationStr: `python filters.py 16 ${fileName} param1 ${generateHash()}`,
            fields: [5],
            tooltipContents: ["dimensão do kernel"],
        },
        {
            name: "Ajuste Canal",
            transformationStr: `python filters.py 17 ${fileName} param1 param2 ${generateHash()}`,
            fields: [100, 0],
            tooltipContents: ["ajuste", "canal (r=0, g=1, b=2)"],
        },
        {
            name: "Threshold",
            transformationStr: `python filters.py 18 ${fileName} param1 ${generateHash()}`,
            fields: [100],
            tooltipContents: ["thresh"],
        },
        {
            name: "Histograma escala de cinza",
            transformationStr: `python filters.py 19 ${fileName} ${generateHash()}`,
            fields: [],
            tooltipContents: [],
        },
        {
            name: "Histograma RGB",
            transformationStr: `python filters.py 20 ${fileName} ${generateHash()}`,
            fields: [],
            tooltipContents: [],
            load_image: false,
        },
        {
            name: "Equalização Histograma Escala de Cinza",
            transformationStr: `python filters.py 21 ${fileName} ${generateHash()}`,
            fields: [],
            tooltipContents: [],
        },
        {
            name: "Equalização Histograma RGB",
            transformationStr: `python filters.py 22 ${fileName} ${generateHash()}`,
            fields: [],
            tooltipContents: [],
        },
        {
            name: "RGB para HSV",
            transformationStr: `python filters.py 27 ${fileName} ${generateHash()}`,
            fields: [],
            tooltipContents: [],
        },
    ];

    const disabled = imageSrc === null ? true : false;

    return (
        <header className="header">
            <LinearPorPartes
                setShowModal={setShowModal}
                showModal={showModal}
                mainCanvas={canvasRef}
            />
            <EditKernel
                setShowModal={setShowModalKernel}
                showModal={showModalKernel}
                mainCanvas={canvasRef}
            />
            <SpectroFourier
                setShowModal={setShowModalSpectro}
                showModal={showModalSpectro}
                mainCanvas={canvasRef}
            />
            <ChromaKey
                setShowModal={setShowModalChroma}
                showModal={showModalChroma}
                mainCanvas={canvasRef}
            />
            <div style={{ display: "flex", gap: "10px" }}>
                <FunctionsSelect
                    text="Filters"
                    options={transformationsOptions}
                />
                <button
                    disabled={disabled}
                    style={{ cursor: disabled ? "not-allowed" : "pointer" }}
                    onClick={() => setShowModal(!showModal)}
                >
                    Linear por partes
                </button>
                <button
                    disabled={disabled}
                    style={{ cursor: disabled ? "not-allowed" : "pointer" }}
                    onClick={() => setShowModalSpectro(!showModalSpectro)}
                >
                    Spectro de Fourier
                </button>
                <button
                    disabled={disabled}
                    style={{ cursor: disabled ? "not-allowed" : "pointer" }}
                    onClick={() => setShowModalChroma(!showModalChroma)}
                >
                    Chroma Key
                </button>
                <button
                    disabled={disabled}
                    style={{ cursor: disabled ? "not-allowed" : "pointer" }}
                    onClick={() => setShowModalKernel(!showModalKernel)}
                >
                    Kernel Editável
                </button>
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
