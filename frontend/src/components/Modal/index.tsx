import React from "react";

type ModelProps = {
    id: string;
    title: string;
    children: React.ReactNode;
};

const Modal = ({ id, title, children }: ModelProps) => {
    return (
        <dialog id={id} className="modal">
            <div className="modal-box">
                <h3 className="mb-5 text-lg font-bold">{title}</h3>
                {children}
            </div>
        </dialog>
    );
};

export default Modal;
