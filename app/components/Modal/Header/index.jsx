"use client";

import React from "react";
import styles from './styles.module.css'

const Header = ({ children, className, ...props }) => {
    return (
        <div className={`${styles.header} ${className}`} {...props}>
            {children}
        </div>
    )
}

export default Header;