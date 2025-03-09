import { type } from "os";

// Base types already defined
export type MoveFetchRes = {
    move: {
        name: string;
        url: string;
    };
};

export type StatFetchRes = {
    base_stat: number;
    effort: number;
    stat: {
        name: string;
        url: string;
    };
};

export type Type = {
    name: string;
    url: string;
};

export type Sprites = {
    front_default?: string;
    front_shiny?: string;
    front_female?: string;
    front_shiny_female?: string;
    back_default?: string;
    back_shiny?: string;
    back_female?: string;
    back_shiny_female?: string;
};

// New types to represent the expanded structure
export type NameUrlPair = {
    name: string;
    url: string;
};

export type Ability = {
    is_hidden: boolean;
    slot: number;
    ability: NameUrlPair;
};

export type GameIndex = {
    game_index: number;
    version: NameUrlPair;
};

export type VersionDetail = {
    rarity: number;
    version: NameUrlPair;
};

export type HeldItem = {
    item: NameUrlPair;
    version_details: VersionDetail[];
};

export type MoveLearnMethod = {
    level_learned_at: number;
    version_group: NameUrlPair;
    move_learn_method: NameUrlPair;
};

export type MoveDetail = {
    move: NameUrlPair;
    version_group_details: MoveLearnMethod[];
};

export type DreamWorld = {
    front_default: string | null;
    front_female: string | null;
};

export type Home = {
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
};

export type OfficialArtwork = {
    front_default: string | null;
    front_shiny: string | null;
};

export type Showdown = {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
};

export type Other = {
    dream_world: DreamWorld;
    home: Home;
    "official-artwork": OfficialArtwork;
    showdown: Showdown;
};

export type RedBlue = {
    back_default: string | null;
    back_gray: string | null;
    front_default: string | null;
    front_gray: string | null;
};

export type Yellow = {
    back_default: string | null;
    back_gray: string | null;
    front_default: string | null;
    front_gray: string | null;
};

export type GenerationI = {
    "red-blue": RedBlue;
    yellow: Yellow;
};

export type Crystal = {
    back_default: string | null;
    back_shiny: string | null;
    front_default: string | null;
    front_shiny: string | null;
};

export type Gold = {
    back_default: string | null;
    back_shiny: string | null;
    front_default: string | null;
    front_shiny: string | null;
};

export type Silver = {
    back_default: string | null;
    back_shiny: string | null;
    front_default: string | null;
    front_shiny: string | null;
};

export type GenerationII = {
    crystal: Crystal;
    gold: Gold;
    silver: Silver;
};

export type Emerald = {
    front_default: string | null;
    front_shiny: string | null;
};

export type FireredLeafgreen = {
    back_default: string | null;
    back_shiny: string | null;
    front_default: string | null;
    front_shiny: string | null;
};

export type RubySapphire = {
    back_default: string | null;
    back_shiny: string | null;
    front_default: string | null;
    front_shiny: string | null;
};

export type GenerationIII = {
    emerald: Emerald;
    "firered-leafgreen": FireredLeafgreen;
    "ruby-sapphire": RubySapphire;
};

export type DiamondPearl = {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
};

export type HeartgoldSoulsilver = {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
};

export type Platinum = {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
};

export type GenerationIV = {
    "diamond-pearl": DiamondPearl;
    "heartgold-soulsilver": HeartgoldSoulsilver;
    platinum: Platinum;
};

export type Animated = {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
};

export type BlackWhite = {
    animated: Animated;
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
};

export type GenerationV = {
    "black-white": BlackWhite;
};

export type OmegarubyAlphasapphire = {
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
};

export type XY = {
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
};

export type GenerationVI = {
    "omegaruby-alphasapphire": OmegarubyAlphasapphire;
    "x-y": XY;
};

export type Icons = {
    front_default: string | null;
    front_female: string | null;
};

export type UltraSunUltraMoon = {
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
};

export type GenerationVII = {
    icons: Icons;
    "ultra-sun-ultra-moon": UltraSunUltraMoon;
};

export type GenerationVIII = {
    icons: Icons;
};

export type Versions = {
    "generation-i": GenerationI;
    "generation-ii": GenerationII;
    "generation-iii": GenerationIII;
    "generation-iv": GenerationIV;
    "generation-v": GenerationV;
    "generation-vi": GenerationVI;
    "generation-vii": GenerationVII;
    "generation-viii": GenerationVIII;
};

export type ExtendedSprites = Sprites & {
    other: Other;
    versions: Versions;
};

export type Cries = {
    latest: string;
    legacy: string;
};

export type GenerationInfo = {
    name: string;
    url: string;
};

export type TypeWithSlot = {
    slot: number;
    type: Type;
};

export type PastType = {
    generation: GenerationInfo;
    types: TypeWithSlot[];
};

export type PokemonList = {
    name: string;
    url: string;
};

export type FetchedList = { count: number; next?: string; prev?: string; results: PokemonList[] };

export type MoveInfo = {
    name: string;
    id: number;
    pp: number;
    type: {
        name: string;
        url: string;
    };
};

export type FetchedPokemon = {
    id: number;
    name: string;
    base_experience: number;
    height: number;
    is_default: boolean;
    order: number;
    weight: number;
    abilities: Ability[];
    forms: NameUrlPair[];
    game_indices: GameIndex[];
    held_items: HeldItem[];
    location_area_encounters: string;
    moves: MoveDetail[];
    species: NameUrlPair;
    sprites: ExtendedSprites;
    cries: Cries;
    stats: StatFetchRes[];
    types: [TypeWithSlot?, TypeWithSlot?];
    past_types: PastType[];
};
