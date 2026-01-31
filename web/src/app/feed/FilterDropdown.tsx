"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import styles from "./FilterDropdown.module.css";
import { ChevronDownIcon } from "../components/Icons";

interface FilterDropdownProps {
    options: string[];
    selectedValue: string | null;
    onSelect: (value: string | null) => void;
    placeholder: string;
    icon: ReactNode;
    allLabel: string;
    rightAction?: ReactNode;
}

export default function FilterDropdown({
    options,
    selectedValue,
    onSelect,
    placeholder,
    icon,
    allLabel,
    rightAction
}: FilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchMode, setSearchMode] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    // Focus turns on search mode
    const handleFocus = () => {
        setIsOpen(true);
        setSearchMode(true);
        setInputValue("");
    };

    // Select turns off search mode
    const handleSelect = (val: string | null) => {
        onSelect(val);
        setIsOpen(false);
        setSearchMode(false);
    };

    // Handle click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchMode(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options.filter(opt =>
        opt.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
        <div className={styles.container} ref={containerRef}>
            <div className={styles.inputWrapper}>
                {/* Render Icon and Value overlay when NOT searching */}
                {!searchMode && (
                    <div className={styles.displayOverlay} onClick={handleFocus}>
                        <span className={styles.iconWrapper}>{icon}</span>
                        <span className={styles.displayText}>
                            {selectedValue || allLabel}
                        </span>
                    </div>
                )}

                <input
                    className={`${styles.input} ${!searchMode ? styles.hiddenInput : ''}`}
                    value={inputValue}
                    type="text"
                    placeholder={searchMode ? "Type to search..." : ""}
                    onFocus={handleFocus}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                {rightAction ? (
                    <span className={styles.rightActionWrapper}>{rightAction}</span>
                ) : (
                    <span className={styles.chevron}><ChevronDownIcon /></span>
                )}
            </div>

            {isOpen && (
                <div className={styles.dropdownMenu}>
                    {(!inputValue || allLabel.toLowerCase().includes(inputValue.toLowerCase())) && (
                        <div
                            className={styles.dropdownItem}
                            onMouseDown={() => handleSelect(null)}
                        >
                            <span className={styles.iconWrapper}>{icon}</span> {allLabel}
                        </div>
                    )}

                    {filteredOptions.length > 0 ? (
                        filteredOptions.map(opt => (
                            <div
                                key={opt}
                                className={styles.dropdownItem}
                                onMouseDown={() => handleSelect(opt)}
                            >
                                {opt}
                            </div>
                        ))
                    ) : (
                        (!inputValue || !allLabel.toLowerCase().includes(inputValue.toLowerCase())) && (
                            <div className={styles.noResults}>No matches found</div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}
