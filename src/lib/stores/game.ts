import { writable } from 'svelte/store';

export type GameId = 'tetris';

interface GameState {
	open: boolean;
	activeGame: GameId;
}

function createGameStore() {
	const { subscribe, update } = writable<GameState>({
		open: false,
		activeGame: 'tetris',
	});

	return {
		subscribe,
		open: (game: GameId = 'tetris') => update(s => ({ ...s, open: true, activeGame: game })),
		close: () => update(s => ({ ...s, open: false })),
	};
}

export const gameStore = createGameStore();
