import React from "react";
import { ChangeHandler } from "../../types";

type InputProps<V = string | number | readonly string[] | undefined> = {
    type?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>["type"];
    id?: string;
    Icon?: React.FC;
    placeholder?: string;
    className?: string;
    labelClassname?: string;
    extra?: React.ReactNode[];
    inputExtra?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>[];
    value: V;
    name?: string;
    onChange: ChangeHandler<HTMLInputElement>;
};

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
        name,
    }: InputProps) => (
        <label className={`flex gap-2 items-center input input-bordered ${labelClassname}`}>
            {Icon && <Icon />}
            <input
                value={value}
                onChange={onChange}
                id={id}
                name={name ? name : id}
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
