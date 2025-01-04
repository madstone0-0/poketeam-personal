import { prettyPrint } from "./utils.js";

export const customLogger = (message: string, ...rest: string[]) => {
    console.log(message, ...rest);
};
