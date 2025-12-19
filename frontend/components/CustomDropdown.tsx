"use client";

import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";

interface DropdownOption {
  value: string;
  label: string;
  group?: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const CustomDropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  disabled = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);
  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase()) ||
      opt.value.toLowerCase().includes(search.toLowerCase())
  );

  // Group options by group name
  const groupedOptions: { [key: string]: DropdownOption[] } = {};
  filteredOptions.forEach((opt) => {
    const groupName = opt.group || "Other";
    if (!groupedOptions[groupName]) {
      groupedOptions[groupName] = [];
    }
    groupedOptions[groupName].push(opt);
  });

  return (
    <div className={className}>
      {label && (
        <label className="block mb-2 text-sm text-gray-300">{label}</label>
      )}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={clsx(
            "w-full p-3 rounded-md border text-left flex items-center justify-between",
            "bg-white/10 border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]",
            "transition disabled:opacity-50 disabled:cursor-not-allowed",
            isOpen && "border-[#7C3AED] ring-2 ring-[#7C3AED]"
          )}
        >
          <span className={selectedOption ? "text-white" : "text-gray-400"}>
            {selectedOption?.label || placeholder}
          </span>
          <svg
            className={clsx(
              "w-5 h-5 transition-transform",
              isOpen && "rotate-180"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#1F2937] border border-white/20 rounded-md shadow-lg z-50">
            {/* Search input */}
            {filteredOptions.length > 5 && (
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border-b border-white/10 bg-white/5 text-white placeholder-gray-500 focus:outline-none text-sm"
              />
            )}

            {/* Options list */}
            <div className="max-h-60 overflow-y-auto">
              {Object.keys(groupedOptions).length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-400 text-center">
                  No options found
                </div>
              ) : (
                Object.entries(groupedOptions).map(([group, opts]) => (
                  <div key={group}>
                    {group !== "Other" && (
                      <div className="px-3 py-2 text-xs font-semibold text-gray-400 bg-white/5 border-b border-white/10">
                        {group}
                      </div>
                    )}
                    {opts.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          onChange(option.value);
                          setIsOpen(false);
                          setSearch("");
                        }}
                        className={clsx(
                          "w-full px-3 py-2 text-left text-sm transition",
                          value === option.value
                            ? "bg-[#7C3AED]/30 text-[#7C3AED] font-medium"
                            : "text-gray-300 hover:bg-white/10"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDropdown;
