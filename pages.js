import { game, initGame } from "./pages/game.js"
import { initMainMenu, mainMenu } from "./pages/mainMenu.js"
import { initScores, scores } from "./pages/scores.js"
import { animationViewer, initAnimationViewer } from "./utilityPages/viewAnimations.js"
import { assetsViewer, initAssetsViewer } from "./utilityPages/viewAssets.js"

// fps of the game
// also you can set fps individualy for every page
const fps = 144

export const pages = [
    {
        name: 'mainMenu',
        func: mainMenu,
        fps: fps,
        init: initMainMenu
    },
    {
        name: 'game',
        func: game,
        fps: fps,
        init: initGame
    },
    {
        name: 'scores',
        func: scores,
        fps: fps,
        init: initScores
    },

    /// utility pages
    {
        name: 'utility-asset-viewer',
        func: assetsViewer,
        fps: fps,
        init: () => { initAssetsViewer() }
    },
    {
        name: 'utility-animation-viewer',
        func: () => { animationViewer() },
        fps: fps,
        init: () => { initAnimationViewer() }
    }
]