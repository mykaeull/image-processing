"use client";

import React from "react";
import styles from './styles.module.css'

const Root = ({children, className, style, showModal}) => {
    return (
        <div className={`${styles.container} ${className}`} style={{...style, display: showModal ? 'block' : 'none'}}>
            {children}
        </div>
    )
}

export default Root;