import usePersistentStore from "../stores/persistentStore";

export const useSettings = () => {
    const options = usePersistentStore((state) => state.options);
    const updateOptions = usePersistentStore((state) => state.updateOptions);

    return { options, updateOptions };
};
