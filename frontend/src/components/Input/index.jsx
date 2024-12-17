import React from "react";

const Input = React.memo(
    ({
        type,
        id,
        Icon,
        placeholder,
        className = "",
        labelClassname = "",
        value,
        onChange,
        extra = [],
        inputExtra = [],
    }) => (
        <label className={`flex gap-2 items-center input input-bordered ${labelClassname}`}>
            {Icon && <Icon />}
            <input
                value={value}
                onChange={onChange}
                id={id}
                name={id}
                type={type}
                className={`grow ${className}`}
                placeholder={placeholder}
                {...inputExtra}
            />
            {...extra}
        </label>
    ),
);

export default Input;
