"use client";

import React from "react";
import styles from './styles.module.css'

const Footer = ({ children, style, className, ...props }) => {
    return (
        <div className={`${styles.footer} ${className}`} style={style} {...props}>
            {children}
        </div>
    )
}

export default Footer;