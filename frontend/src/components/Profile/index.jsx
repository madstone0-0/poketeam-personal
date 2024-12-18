import React from "react";
import { createPortal } from "react-dom";
import Modal from "../Modal";
import useStore from "../stores";
import { useSettings } from "../utils/hooks";
import { useForm } from "@tanstack/react-form";
import { useSnackbar } from "notistack";
import Input from "../Input";
import { updateUser } from "../utils/api";

const Profile = ({ user }) => {
    const reset = useStore((state) => state.reset);
    const username = user.username;
    const { enqueueSnackbar } = useSnackbar();

    const handleConfirmation = (callback) => {
        const modal = document.getElementById("confirmSaveModal");
        const yesButton = modal.querySelector("#yesButton");
        const cancelButton = modal.querySelector("#cancelButton");

        yesButton.onclick = () => {
            modal.close();
            callback();
        };

        cancelButton.onclick = () => {
            modal.close();
        };

        modal.showModal();
    };

    const detailsForm = useForm({
        defaultValues: {
            uid: user.uid,
            fname: user.fname,
            lname: user.lname,
            username: user.username,
            email: user.email,
            is_admin: user.is_admin ? 1 : 0,
        },
        onSubmit: async ({ value }) => {
            handleConfirmation(async () => {
                try {
                    const res = await updateUser(value);
                    reset({
                        fname: value.fname,
                        lname: value.lname,
                        username: value.username,
                        email: value.email,
                        is_admin: value.is_admin ? 1 : 0,
                    });
                    detailsForm.setFieldValue("fname", value.fname);
                    detailsForm.setFieldValue("lname", value.lname);
                    detailsForm.setFieldValue("username", value.username);
                    detailsForm.setFieldValue("email", value.email);
                    detailsForm.setFieldValue("is_admin", value.is_admin ? 1 : 0);
                    enqueueSnackbar(res.msg, { variant: "success" });
                } catch (error) {
                    console.error({ error });
                    enqueueSnackbar(error.message, { variant: "error" });
                }
            });
        },
    });

    return (
        <>
            <div className="flex flex-col items-center">
                <div className="avatar placeholder">
                    <div className="w-10 rounded-full bg-neutral text-neutral-content">
                        <span className="text-3xl">{username ? username[0].toUpperCase() : "U"}</span>
                    </div>
                </div>
                <h1 className="text-xl font-bold md:text-3xl">
                    Welcome, {user.fname} {user.lname}
                </h1>
                <div className="m-5 w-full shadow-xl card bg-base-100">
                    <div className="card-body">
                        <h1 className="text-xl font-bold text-center md:text-3xl card-title">Details</h1>
                        <form
                            className="flex flex-col items-center space-y-3 w-full h-full form-control"
                            onSubmit={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                detailsForm.handleSubmit();
                            }}
                        >
                            <detailsForm.Field
                                name="fname"
                                children={(field) => (
                                    <Input
                                        labelClassname="w-1/2"
                                        className="w-1/2"
                                        Icon={() => <h1 className="font-bold">First Name</h1>}
                                        name={field.name}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                )}
                            />

                            <detailsForm.Field
                                name="lname"
                                children={(field) => (
                                    <Input
                                        labelClassname="w-1/2"
                                        className="w-1/2"
                                        Icon={() => <h1 className="font-bold">Last Name</h1>}
                                        name={field.name}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                )}
                            />

                            <detailsForm.Field
                                name="email"
                                children={(field) => (
                                    <Input
                                        labelClassname="w-1/2"
                                        className="w-1/2"
                                        Icon={() => <h1 className="font-bold">Email</h1>}
                                        name={field.name}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                )}
                            />

                            <detailsForm.Field
                                name="username"
                                children={(field) => (
                                    <Input
                                        labelClassname="w-1/2"
                                        className="w-1/2"
                                        Icon={() => <h1 className="font-bold">Username</h1>}
                                        name={field.name}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                )}
                            />

                            <button type="submit" className="mt-4 w-1/2 text-xl btn btn-primary">
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            {createPortal(
                <Modal id="confirmSaveModal" title="Are you Sure?">
                    <p className="py-4">Are you sure you want to save your changes?</p>
                    <div className="modal-action">
                        <button id="yesButton" className="btn btn-error">
                            Yes
                        </button>
                        <button id="cancelButton" className="btn btn-ghost">
                            No
                        </button>
                    </div>
                </Modal>,
                document.body,
            )}
        </>
    );
};

export default Profile;
