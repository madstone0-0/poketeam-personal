const TypeBadge = ({ type }: { type?: string }) => {
    const mapTypeToColor = (type?: string) => {
        switch (type) {
            case "normal":
                return "bg-gray-400";
            case "fire":
                return "bg-red-600";
            case "water":
                return "bg-blue-600";
            case "electric":
                return "bg-yellow-600";
            case "grass":
                return "bg-green-600";
            case "ice":
                return "bg-blue-300";
            case "fighting":
                return "bg-red-800";
            case "poison":
                return "bg-purple-600";
            case "ground":
                return "bg-yellow-800";
            case "flying":
                return "bg-blue-400";
            case "psychic":
                return "bg-purple-400";
            case "bug":
                return "bg-green-400";
            case "rock":
                return "bg-yellow-700";
            case "ghost":
                return "bg-purple-800";
            case "dragon":
                return "bg-blue-800";
            case "dark":
                return "bg-gray-800";
            case "steel":
                return "bg-gray-600";
            case "fairy":
                return "bg-pink-400";
            default:
                return "bg-gray-700";
        }
    };

    const formatType = (type?: string) => {
        if (type === null || type === undefined) {
            return "???";
        }

        return type.toUpperCase();
    };

    return (
        <div className={`badge rounded-none text-white badge-outline ${mapTypeToColor(type)}`}>{formatType(type)}</div>
    );
};

export default TypeBadge;
