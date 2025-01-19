import { appendFile, realpath } from "fs/promises";
import PokemonService from "./services/PokemonService.js";
import { exit } from "process";

(async () => {
    try {
        console.log("Building cache...\n");
        await PokemonService.buildCache();
        console.log("Finished building cache writing to log...");

        await appendFile(
            `${await realpath("./")}/cache_build.log`,
            `${new Date(Date.now()).toISOString()} - Cache successfully built\n`,
        );
        console.log("Finished writing log");
        exit(0);
    } catch (e) {
        console.log(`Cache build failed -> ${e}`);
        await appendFile(
            `${await realpath("./")}/cache_build_error.log`,
            `${new Date(Date.now()).toISOString()} - ${e}\n`,
        );
    }
})();
