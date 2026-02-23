import {create} from "zustand";

interface CardsStore {
    cardsFlipped: boolean;
    toggleCardsFlip: () => void;
}

export const useCardsStore = create<CardsStore>(set => ({
    cardsFlipped: false,
    toggleCardsFlip: () => set(state => ({cardsFlipped: !state.cardsFlipped})),
}));
