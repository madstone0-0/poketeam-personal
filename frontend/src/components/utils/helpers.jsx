import { Heart, Swords, Shield, Sparkle, ShieldPlus, ChevronsUp } from "lucide-react";

export const mapStatName = (name) => {
    switch (name) {
        case "hp":
            return "HP";
        case "attack":
            return "Attack";
        case "defense":
            return "Defense";
        case "spattack":
            return "Sp. Atk";
        case "spdefense":
            return "Sp. Def";
        case "speed":
            return "Speed";
        default:
            return "Unknown";
    }
};

export const mapStatToIcon = (name) => {
    const resDiv = (Icon, name, colorClass = "text-red-500", size = 20) => (
        <div className={`flex w-1/2 flex-row align-middle items-center`}>
            <Icon className={`${colorClass} mr-2`} size={size} /> {mapStatName(name)}
        </div>
    );

    switch (name) {
        case "hp":
            return resDiv(Heart, name);
        case "attack":
            return resDiv(Swords, name);
        case "defense":
            return resDiv(Shield, name);
        case "spattack":
            return resDiv(Sparkle, name);
        case "spdefense":
            return resDiv(ShieldPlus, name);
        case "speed":
            return resDiv(ChevronsUp, name);
    }
};
