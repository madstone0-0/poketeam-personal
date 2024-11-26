import React from "react";

const Input = ({ type, id, Icon, placeholder, value, onChange, extra = [] }) => (
    <label className="flex gap-2 items-center input input-bordered">
        <Icon />
        <input
            value={value}
            onChange={onChange}
            id={id}
            name={id}
            type={type}
            className="grow"
            placeholder={placeholder}
        />
        {...extra}
    </label>
);

export default Input;
