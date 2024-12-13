import React from "react";

const Input = ({ type, id, Icon, placeholder, className = "", value, onChange, extra = [] }) => (
    <label className="flex gap-2 items-center input input-bordered">
        {Icon && <Icon />}
        <input
            value={value}
            onChange={onChange}
            id={id}
            name={id}
            type={type}
            className={`grow ${className}`}
            placeholder={placeholder}
        />
        {...extra}
    </label>
);

export default Input;
