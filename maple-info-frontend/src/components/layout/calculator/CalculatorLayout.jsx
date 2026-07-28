// src/components/layout/calculator/CalculatorLayout.jsx
import React from 'react';
import './CalculatorShared.css';

const CalculatorLayout = ({ title, icon, children }) => {
    return (
        <div className="calc-page-wrapper">
            <div className="calc-main-container">
                <h2 className="calc-header">
                    <span>{icon}</span> {title}
                </h2>
                <div className="calc-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CalculatorLayout;