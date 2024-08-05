"use client";

import React from "react";
import styles from './styles.module.css'

const Content = ({ children, className, style, ...props }) => {
    return (
        <div className={`${styles.content} ${className}`} style={style} {...props}>
            {children}
        </div>
    )
}

export default Content;