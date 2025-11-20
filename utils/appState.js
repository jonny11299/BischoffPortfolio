

// Global state that persists across sketches
// will have to include more details that get wiped when selecting a different sketch

export let appState = {
    theme: 'dark',
    soundEnabled: true,
    volume: 50, // integer from 0 to 100
    userName: 'Visitor',
    selectedApp: 'template'
};