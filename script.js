// ==================== SIMPLIFIED PRELOADING SYSTEM ====================
let allAssetsLoaded = false;
let assetsLoadedCount = 0;
const assetsToPreload = [];

// Add all assets to preload array
function addAssetsToPreload() {
    // Audio files
    assetsToPreload.push('assets/pouf.mp3');
    assetsToPreload.push('assets/explosion.mp3');
    assetsToPreload.push('assets/foff.mp3');

    // Video (handled separately)

    // Background images
    assetsToPreload.push('assets/backg1.png');
    assetsToPreload.push('assets/backg2.png');

    // Pokemon images
    for (let i = 1; i <= 9; i++) {
        assetsToPreload.push(`assets/pokemon${i}.png`);
    }

    // Cat images
    for (let i = 1; i <= 10; i++) {
        assetsToPreload.push(`cats/cat${i}.png`);
    }

    // Font images
    const letters = ['H', 'A', 'P', 'Y', 'B', 'I', 'R', 'T', 'D'];
    for (let font = 1; font <= 5; font++) {
        letters.forEach(letter => {
            assetsToPreload.push(`font${font}/${letter}${font}.png`);
        });
    }

    console.log(`Will preload ${assetsToPreload.length} assets`);
}

// Asset loaded callback
function assetLoaded() {
    assetsLoadedCount++;
    const percent = Math.min(100, Math.round((assetsLoadedCount / assetsToPreload.length) * 100));

    const loadingText = document.querySelector('.loading-text');
    if (loadingText) {
        loadingText.textContent = `Loading birthday surprise... ${percent}%`;
    }

    if (assetsLoadedCount >= assetsToPreload.length) {
        finishLoading();
    }
}

function finishLoading() {
    allAssetsLoaded = true;
    console.log(`✅ All ${assetsToPreload.length} assets loaded!`);

    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }

        // Enable candles
        document.querySelectorAll('.flame').forEach(flame => {
            flame.style.pointerEvents = 'auto';
        });
    }, 500);
}

// Preload all assets
function preloadAllAssets() {
    addAssetsToPreload();

    console.log(`Starting to preload ${assetsToPreload.length} assets...`);

    // Preload audio files (special handling)
    const audioFiles = ['assets/pouf.mp3', 'assets/explosion.mp3', 'assets/foff.mp3'];
    audioFiles.forEach(file => {
        const audio = new Audio();
        audio.src = file;
        audio.preload = 'auto';
        audio.oncanplaythrough = assetLoaded;
        audio.onerror = assetLoaded;
    });

    // Preload video
    const video = document.getElementById('explosion-video');
    if (video) {
        video.oncanplaythrough = assetLoaded;
        video.onerror = assetLoaded;
    }

    // Preload all images
    assetsToPreload.forEach(src => {
        // Skip audio files (already handled)
        if (src.includes('.mp3')) return;

        const img = new Image();
        img.onload = assetLoaded;
        img.onerror = assetLoaded;
        img.src = src;
    });
}
// Constants
const TOTAL_FLAMES = document.querySelectorAll('.flame').length;
const TOTAL_POKEMON = 9;
const TOTAL_CATS = 10; // Assuming you have cat1.png to cat10.png
const MAX_PER_POKEMON = 2;
const POKEMON_POSITIONS = [
    { top: '16%', left: '3%' }, { top: '27%', left: '24%' }, { top: '40%', left: '16%' },
    { top: '55%', left: '6%' }, { top: '80%', left: '9%' }, { top: '19%', right: '3%' },
    { top: '30%', right: '14%' }, { top: '47%', right: '32%' }, { top: '60%', right: '4%' },
    { top: '75%', right: '12%' }, { top: '69%', left: '24%' }, { top: '13%', left: '35%' },
    { top: '12%', left: '58%' }, { top: '77.33%', left: '61%' }, { top: '12%', left: '80%' },
    { bottom: '3%', left: '20%' }, { bottom: '4%', left: '35%' }, { bottom: '3%', left: '50%' },
    { top: '52%', left: '34%' }, { top: '55%', left: '78%' }
];

// State variables
let flamesOut = 0;
let titleAnimationInterval = null;
let catSpinningInterval = null;
let secondPhaseActive = false;

// Initialize coordinate HUD
document.addEventListener('DOMContentLoaded', function() {
    // Start preloading
    preloadAllAssets();

    // Initialize HUD
    const coordHUD = document.getElementById('coord-hud') || createCoordHUD();

    // Disable candles until assets are loaded
    document.querySelectorAll('.flame').forEach(flame => {
        flame.style.pointerEvents = 'none';
        flame.style.cursor = 'wait';
    });

    // Check if assets are already loaded (cached)
    setTimeout(() => {
        if (assetsLoadedCount > 0 && !allAssetsLoaded) {
            // Some assets loaded, show progress
        } else if (!allAssetsLoaded) {
            // Force enable after 5 seconds max (for slow connections)
            setTimeout(() => {
                if (!allAssetsLoaded) {
                    console.warn('Forcing enable after timeout');
                    allAssetsLoaded = true;
                    assetLoaded(); // Trigger final load
                }
            }, 5000);
        }
    }, 1000);
});


// Event Listeners
document.addEventListener('mousemove', updateCoordHUD);
document.addEventListener('click', copyCoordinates);

// Audio Functions
function playSound(elementId) {
    const sound = document.getElementById(elementId);
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log('Audio play failed:', e));
    }
}

// Main Functions
function blow(flame) {
    if (!allAssetsLoaded) {
        console.log('Please wait, still loading assets...');
        return;
    }

    playSound('pouf-sound');
    createSmokeEffect(flame);
    flame.style.display = 'none';

    if (++flamesOut === TOTAL_FLAMES) {
        setTimeout(startCelebration, 400);
    }
}

function createSmokeEffect(flame) {
    const smoke = document.createElement('div');
    smoke.className = 'smoke';
    smoke.style.left = flame.style.left;
    smoke.style.top = flame.style.top;
    flame.parentElement.appendChild(smoke);
}

function startCelebration() {
    // Double-check that critical assets are loaded
    if (!allAssetsLoaded) {
        console.warn('Assets not fully loaded, delaying celebration...');
        setTimeout(startCelebration, 500);
        return;
    }

    const celebrationLayer = document.getElementById('celebration-layer');
    const instructions = document.querySelectorAll('.instruction');

    celebrationLayer.style.display = 'flex';
    instructions.forEach(inst => inst.style.display = 'none');

    // Show transition text first
    showTransitionText();

    // Then show the main celebration after delay
    setTimeout(() => {
        showMainCelebration();
    }, 500);
}

function showTransitionText() {
    const transitionText = document.getElementById('transition-text');
    if (!transitionText) return;

    const messages = [
        "Blow me now"
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    transitionText.textContent = randomMessage;

    // Show and then hide the transition text
    setTimeout(() => {
        transitionText.style.display = 'none';
    }, 600);
}

function showMainCelebration() {
    initAnimatedTitle("HAPPY BIRTHDAY NERD");
    spawnPokemon();
    launchConfetti();

    setTimeout(triggerBombEffect, 3000);
}

function launchConfetti() {
    confetti({
        particleCount: 300,
        spread: 270,
        origin: { y: 0.6 }
    });
}

function initAnimatedTitle(text) {
    const container = document.getElementById('ransom-title');
    if (!container) return;

    container.innerHTML = '';

    const chars = text.split('');
    const charElements = [];

    chars.forEach(char => {
        if (char === ' ') {
            const breakDiv = document.createElement('div');
            breakDiv.className = 'break';
            container.appendChild(breakDiv);
            return;
        }

        const img = createRansomChar(char);
        container.appendChild(img);
        charElements.push({ element: img, char });
    });

    // Make title visible
    container.classList.add('visible');

    clearTitleAnimation();
    titleAnimationInterval = setInterval(() => animateChars(charElements), 500);
}

function createRansomChar(char) {
    const img = document.createElement('img');
    img.className = 'ransom-char';
    updateCharImage(img, char);
    img.style.transform = `rotate(${Math.random() * 10 - 5}deg)`;
    return img;
}

function updateCharImage(img, char) {
    const randomFont = Math.floor(Math.random() * 5) + 1;
    img.src = `font${randomFont}/${char}${randomFont}.png`;
    img.style.transform = `rotate(${Math.random() * 12 - 6}deg)`;
}

function animateChars(charElements) {
    charElements.forEach(item => updateCharImage(item.element, item.char));
}

function clearTitleAnimation() {
    if (titleAnimationInterval) {
        clearInterval(titleAnimationInterval);
        titleAnimationInterval = null;
    }
}

function spawnPokemon() {
    const container = document.getElementById('pokemon-stamps');
    if (!container) return;

    container.innerHTML = '';

    // Create pokemonCount array with proper size (1-based indexing)
    const pokemonCount = new Array(TOTAL_POKEMON + 1).fill(0);

    console.log(`Total pokemon: ${TOTAL_POKEMON}, Positions: ${POKEMON_POSITIONS.length}`);

    POKEMON_POSITIONS.forEach((pos, index) => {
        const pokemonId = getRandomPokemonId(pokemonCount, index);
        console.log(`Position ${index}: Selected pokemon ${pokemonId}`);

        const img = createPokemonSticker(pokemonId, pos, index);
        container.appendChild(img);
        pokemonCount[pokemonId]++;
    });

    console.log('Final pokemon distribution:', pokemonCount);
}

function getRandomPokemonId(countArray, positionIndex) {
    // FIX: For positions beyond 18 (9 pokemon * 2 each = 18), allow any pokemon
    if (positionIndex >= 18) {
        console.log(`Position ${positionIndex}: Beyond limit, picking any pokemon`);
        return Math.floor(Math.random() * TOTAL_POKEMON) + 1;
    }

    // First, check if there are any pokemon that haven't reached the limit
    const availablePokemon = [];
    for (let i = 1; i <= TOTAL_POKEMON; i++) {
        if (countArray[i] < MAX_PER_POKEMON) {
            availablePokemon.push(i);
        }
    }

    if (availablePokemon.length === 0) {
        // This shouldn't happen for positions 0-17, but just in case
        console.warn(`Position ${positionIndex}: All pokemon reached max count, picking random`);
        return Math.floor(Math.random() * TOTAL_POKEMON) + 1;
    }

    // Pick a random pokemon from available ones
    return availablePokemon[Math.floor(Math.random() * availablePokemon.length)];
}

function createPokemonSticker(id, position, delayIndex) {
    const img = document.createElement('img');
    img.src = `assets/pokemon${id}.png`;
    img.className = 'pokemon-sticker';
    Object.assign(img.style, position);
    img.style.animationDelay = `${delayIndex * 0.15}s`;

    // Add error handling for missing images
    img.onerror = function() {
        console.error(`Failed to load pokemon image: assets/pokemon${id}.png`);
        this.style.display = 'none';
    };

    return img;
}

function triggerBombEffect() {
    clearTitleAnimation();

    const ransomTitle = document.getElementById('ransom-title');
    if (ransomTitle) {
        ransomTitle.classList.remove('visible');
        ransomTitle.style.opacity = '0';
    }

    const explosion = document.getElementById('explosion-video');
    if (!explosion) return;

    // Ensure video is fully loaded
    if (explosion.readyState < 3) { // 3 = HAVE_FUTURE_DATA, 4 = HAVE_ENOUGH_DATA
        console.log('Video still loading, waiting...');
        explosion.oncanplay = function() {
            explosion.oncanplay = null;
            playExplosion();
        };
    } else {
        playExplosion();
    }

    function playExplosion() {
        explosion.style.display = 'block';
        explosion.currentTime = 0;

        // Play explosion sound
        playSound('explosion-sound');

        // Add shake effect
        document.body.classList.add('shake');

        explosion.onended = () => {
            explosion.style.display = 'none';
            document.body.classList.remove('shake');

            // Switch to second background and start cat animation
            switchToSecondBackground();
            spawnCats();

            // After 3 seconds, make pokemons spin too
            setTimeout(() => {
                startPokemonSpin();
                secondPhaseActive = true;
            }, 3000);
        };

        explosion.play().catch(e => {
            console.warn('Explosion video failed to play:', e);
            // Fallback: if video fails, still continue with other effects
            explosion.onended();
        });
    }

    // Play foff sound after explosion
    setTimeout(() => {
        playSound('foff-sound');
    }, 400);
}

function switchToSecondBackground() {
    const bg1 = document.querySelector('.bg-design-1');
    const bg2 = document.querySelector('.bg-design-2');

    if (bg1 && bg2) {
        bg1.classList.remove('active');
        bg2.classList.add('active');
    }
}

function spawnCats() {
    const container = document.getElementById('cats-container');
    if (!container) return;

    container.innerHTML = '';

    const totalCats = 36;
    const catIds = Array.from({length: 10}, (_, i) => i + 1);

    // Create a balanced distribution of cat images
    const catDistribution = [];
    const catsPerImage = Math.floor(totalCats / catIds.length);
    const extraCats = totalCats % catIds.length;

    // Fill the distribution array
    catIds.forEach((catId, index) => {
        const count = catsPerImage + (index < extraCats ? 1 : 0);
        for (let i = 0; i < count; i++) {
            catDistribution.push(catId);
        }
    });

    // Shuffle the distribution
    shuffleArray(catDistribution);

    // ==================== RECTANGLE BOUNDARY COORDINATES ====================
    // Define rectangle corners (in percentages of screen)
    const rectangleBoundary = {
        topLeft: { x: 5, y: 5 },     // 5% from left, 5% from top
        topRight: { x: 95, y: 5 },   // 95% from left, 5% from top
        bottomLeft: { x: 5, y: 80 },  // 5% from left, 80% from top (MAX BOTTOM)
        bottomRight: { x: 95, y: 80 } // 95% from left, 80% from top (MAX BOTTOM)
    };

    // Alternative: Just set max bottom
    const MAX_BOTTOM = 80; // Cats won't go below 80% from top

    // Calculate matrix cell positions with random offsets
    const rows = 6;
    const cols = 6;

    // PADDING adjusted to stay within rectangle
    const horizontalPadding = 5; // 5% padding (stays within 5-95%)
    const verticalPadding = 5;   // 5% padding (stays within 5-80%)

    // Available width/height within rectangle
    const availableWidth = rectangleBoundary.bottomRight.x - rectangleBoundary.topLeft.x;  // 90% width
    const availableHeight = MAX_BOTTOM - rectangleBoundary.topLeft.y;  // 75% height

    // Spacing within available area
    const cellWidth = availableWidth / cols;
    const cellHeight = availableHeight / rows;

    // Create cat stickers for each grid cell with random offsets
    for (let i = 0; i < totalCats; i++) {
        const catId = catDistribution[i];

        // Calculate which row and column this cat is in
        const row = Math.floor(i / cols);
        const col = i % cols;

        // Calculate base position (center of each cell)
        const baseX = rectangleBoundary.topLeft.x + (col * cellWidth) + (cellWidth / 2);
        const baseY = rectangleBoundary.topLeft.y + (row * cellHeight) + (cellHeight / 2);

        // Add random offset between 0.5% and 2% in both directions
        const getRandomOffset = () => {
            const sign = Math.random() > 0.5 ? 1 : -1;
            const magnitude = (Math.random() * 1.5) + 0.5; // 0.5 to 2.0
            return sign * magnitude;
        };

        const offsetX = getRandomOffset();
        const offsetY = getRandomOffset();

        // Final position with offset, constrained to rectangle
        let finalX = baseX + offsetX;
        let finalY = baseY + offsetY;

        // Ensure position stays within rectangle bounds
        finalX = Math.max(rectangleBoundary.topLeft.x, Math.min(rectangleBoundary.bottomRight.x, finalX));
        finalY = Math.max(rectangleBoundary.topLeft.y, Math.min(MAX_BOTTOM, finalY));

        // Create position object for this cat
        const position = {
            left: `${finalX}%`,
            top: `${finalY}%`
        };

        const cat = createCatSticker(catId, i, position);
        container.appendChild(cat);
    }

    // Start chaotic random animation
    startCatMatrixAnimation();

    // Add an extra layer of chaos by randomly pulsing all cats
    setInterval(() => {
        if (Math.random() > 0.7) {
            document.querySelectorAll('.cat-sticker').forEach(cat => {
                cat.style.animationPlayState = 'running';
                const randomScale = (Math.random() * 4) + 0.1;
                const currentTransform = cat.style.transform || '';
                cat.style.transform = currentTransform.replace(/scale\([^)]*\)/, '') + ` scale(${randomScale})`;
                cat.style.filter += ' brightness(3) saturate(3)';
                setTimeout(() => {
                    cat.style.filter = cat.style.filter.replace(/ brightness\([^)]*\) saturate\([^)]*\)/, '');
                    cat.style.transform = currentTransform;
                }, 150);
            });
        }
    }, 1500);
}

// Helper function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createCatSticker(id, index, position) {
    const img = document.createElement('img');
    img.src = `cats/cat${id}.png`;
    img.className = 'cat-sticker';

    // Use absolute positioning instead of grid
    img.style.position = 'absolute';
    img.style.left = position.left;
    img.style.top = position.top;
    img.style.transform = 'translate(-50%, -50%)'; // Center on the position

    // More extreme and varied chaotic spin styles
    const spinTypes = ['extreme-pulse', 'rapid-pulse', 'explosive-pulse', 'chaotic', 'wobble', 'bounce-flip', 'shake'];
    const spinType = spinTypes[Math.floor(Math.random() * spinTypes.length)];
    if (spinType) {
        img.classList.add(spinType);
    }

    // Even more extreme size variations
    const sizeVariation = (Math.random() * 100) + 30; // 30% to 130% of original size
    const baseSize = 80; // Base size in pixels
    const finalSize = (baseSize * sizeVariation) / 100;
    img.style.width = `${finalSize}px`;
    img.style.height = 'auto';
    img.style.minWidth = '40px'; // Minimum size
    img.style.maxWidth = '150px'; // Maximum size

    // Random animation delay for staggered effect
    const delay = (Math.random() * 0.5); // 0 to 0.5 seconds (even shorter delays)
    img.style.animationDelay = `${delay}s`;

    // Much faster animation durations (more chaotic)
    const duration = (Math.random() * 0.8) + 0.3; // 0.3 to 1.1 seconds (much faster)
    img.style.animationDuration = `${duration}s`;

    // Add random animation iteration count for more chaos
    img.style.animationIterationCount = 'infinite';

    // Add extreme random filter effects for more chaos
    const hueRotate = Math.random() * 360;
    const brightness = (Math.random() * 1.5) + 0.5; // 0.5 to 2.0 (more extreme)
    const contrast = (Math.random() * 1.5) + 0.5; // 0.5 to 2.0 (more extreme)
    const saturate = (Math.random() * 2) + 0.5; // 0.5 to 2.5
    img.style.filter = `hue-rotate(${hueRotate}deg) brightness(${brightness}) contrast(${contrast}) saturate(${saturate})`;

    // Store original position for hover effects
    const originalLeft = parseFloat(position.left);
    const originalTop = parseFloat(position.top);

    // Add hover effect with EXTREME changes
    img.addEventListener('mouseenter', () => {
        if (!secondPhaseActive) return;
        // Move more on hover for more interactivity
        const hoverOffsetX = (Math.random() * 4) - 2; // -2% to +2%
        const hoverOffsetY = (Math.random() * 4) - 2; // -2% to +2%

        img.style.left = `${originalLeft + hoverOffsetX}%`;
        img.style.top = `${originalTop + hoverOffsetY}%`;
        img.style.transform = 'translate(-50%, -50%) scale(3)';
        img.style.filter = `hue-rotate(${hueRotate + 180}deg) brightness(3) contrast(3) saturate(3)`;
        img.style.transition = 'all 0.1s ease';
        img.style.zIndex = '1000';
    });

    img.addEventListener('mouseleave', () => {
        img.style.left = `${originalLeft}%`;
        img.style.top = `${originalTop}%`;
        img.style.transform = 'translate(-50%, -50%)';
        img.style.filter = `hue-rotate(${hueRotate}deg) brightness(${brightness}) contrast(${contrast}) saturate(${saturate})`;
        img.style.zIndex = 'auto';
    });

    // Add error handling
    img.onerror = function() {
        console.error(`Failed to load cat image: cats/cat${id}.png`);
        this.style.display = 'none';
    };

    return img;
}

function startCatMatrixAnimation() {
    const cats = document.querySelectorAll('.cat-sticker');

    catSpinningInterval = setInterval(() => {
        cats.forEach(cat => {
            // Higher chance to change (70% instead of 50%)
            if (Math.random() > 0.3) {
                // Much faster animation durations
                const newDuration = (Math.random() * 0.7) + 0.2; // 0.2 to 0.9 seconds
                cat.style.animationDuration = `${newDuration}s`;

                // Change animation type more frequently (60% chance)
                if (Math.random() > 0.4) {
                    const spinTypes = ['extreme-pulse', 'rapid-pulse', 'explosive-pulse', 'chaotic', 'wobble', 'bounce-flip', 'shake'];
                    const newSpinType = spinTypes[Math.floor(Math.random() * spinTypes.length)];

                    // Remove all animation classes
                    cat.classList.remove('extreme-pulse', 'rapid-pulse', 'explosive-pulse', 'spin-reverse', 'spin-fast', 'chaotic', 'wobble', 'bounce-flip', 'shake');

                    // Add new animation class
                    cat.classList.add(newSpinType);
                }

                // Randomly change size (50% chance) - MORE EXTREME
                if (Math.random() > 0.5) {
                    const newSize = (Math.random() * 100) + 30;
                    const baseSize = 80;
                    const finalSize = (baseSize * newSize) / 100;
                    cat.style.width = `${finalSize}px`;
                    cat.style.transition = 'width 0.3s ease';
                }

                // Randomly jiggle position (50% chance) - LARGER movements
                if (Math.random() > 0.5) {
                    const currentLeft = parseFloat(cat.style.left);
                    const currentTop = parseFloat(cat.style.top);

                    // Get new random offset between 1% and 5% (larger movements)
                    const getRandomOffset = () => {
                        const sign = Math.random() > 0.5 ? 1 : -1;
                        const magnitude = (Math.random() * 4) + 1; // 1% to 5%
                        return sign * magnitude;
                    };

                    const offsetX = getRandomOffset();
                    const offsetY = getRandomOffset();

                    // Allow cats to go beyond screen bounds (negative and >100%)
                    const newLeft = currentLeft + offsetX;
                    const newTop = currentTop + offsetY;

                    cat.style.left = `${newLeft}%`;
                    cat.style.top = `${newTop}%`;
                    cat.style.transition = 'left 0.4s ease, top 0.4s ease';
                }

                // Randomly change filter effects (50% chance) - MORE EXTREME
                if (Math.random() > 0.5) {
                    const hueRotate = Math.random() * 720; // 0 to 720 degrees
                    const brightness = (Math.random() * 2) + 0.3; // 0.3 to 2.3
                    const contrast = (Math.random() * 2) + 0.3; // 0.3 to 2.3
                    const saturate = (Math.random() * 3) + 0.3; // 0.3 to 3.3
                    cat.style.filter = `hue-rotate(${hueRotate}deg) brightness(${brightness}) contrast(${contrast}) saturate(${saturate})`;
                    cat.style.transition = 'filter 0.3s ease';
                }
            }
        });
    }, 500); // Check every 0.5 seconds for more chaos
}

function startPokemonSpin() {
    const pokemons = document.querySelectorAll('.pokemon-sticker');

    pokemons.forEach(pokemon => {
        pokemon.classList.add('spinning');

        // Faster animation for pokemons too
        const duration = (Math.random() * 1) + 1.5; // 1.5 to 2.5 seconds
        pokemon.style.animationDuration = `0.4s, 2s, ${duration}s`;

        // Add chaotic effects to pokemons too
        if (Math.random() > 0.5) {
            pokemon.style.animation = `popIn 0.4s ease-out forwards, float 2s ease-in-out infinite, spinAndScale ${duration}s ease-in-out infinite`;
        }

        // Add hover effect for pokemons with more chaos
        pokemon.addEventListener('mouseenter', () => {
            pokemon.style.transform = 'scale(1.5) rotate(180deg)';
            pokemon.style.filter = 'hue-rotate(180deg) brightness(1.5)';
            pokemon.style.transition = 'all 0.2s ease';
            pokemon.style.zIndex = '100';
        });

        pokemon.addEventListener('mouseleave', () => {
            pokemon.style.transform = '';
            pokemon.style.filter = '';
            pokemon.style.zIndex = 'auto';
        });
    });

    // Make pokemons move more frequently and chaotically
    if (!secondPhaseActive) {
        setInterval(() => {
            pokemons.forEach(pokemon => {
                // Higher chance to move (50% instead of 30%)
                if (Math.random() > 0.5) {
                    // Move within a larger radius for more chaos
                    const currentLeft = parseFloat(pokemon.style.left) || 50;
                    const currentTop = parseFloat(pokemon.style.top) || 50;

                    const offsetX = (Math.random() * 30) - 15; // -15% to +15% (more movement)
                    const offsetY = (Math.random() * 30) - 15;

                    const newLeft = Math.max(5, Math.min(95, currentLeft + offsetX));
                    const newTop = Math.max(5, Math.min(95, currentTop + offsetY));

                    pokemon.style.left = `${newLeft}%`;
                    pokemon.style.top = `${newTop}%`;

                    // Faster transition
                    pokemon.style.transition = 'all 0.5s ease';

                    // Add random rotation during movement
                    const randomRotate = Math.random() * 360;
                    pokemon.style.transform = `rotate(${randomRotate}deg)`;
                }

                // Occasionally change animation properties (30% chance)
                if (Math.random() > 0.7) {
                    const newDuration = (Math.random() * 1) + 1.5;
                    pokemon.style.animationDuration = `0.4s, 2s, ${newDuration}s`;
                }
            });
        }, 1500); // Check every 1.5 seconds (instead of 3) for more chaos
    }

    secondPhaseActive = true;
}


// Clean up intervals when page is hidden
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        clearTitleAnimation();
        if (catSpinningInterval) {
            clearInterval(catSpinningInterval);
            catSpinningInterval = null;
        }
    }
});

// Coordinate Utilities
function updateCoordHUD(e) {
    const x = ((e.clientX / window.innerWidth) * 100).toFixed(2);
    const y = ((e.clientY / window.innerHeight) * 100).toFixed(2);
    coordHUD.textContent = `left: ${x}% | top: ${y}%`;
}

function copyCoordinates(e) {
    const x = ((e.clientX / window.innerWidth) * 100).toFixed(2);
    const y = ((e.clientY / window.innerHeight) * 100).toFixed(2);
    const text = `{ top: '${y}%', left: '${x}%' },`;

    navigator.clipboard.writeText(text).then(() => {
        coordHUD.textContent = `COPIED → ${text}`;
        setTimeout(() => updateCoordHUD(e), 1000);
    }).catch(e => console.error('Failed to copy:', e));
}

window.addEventListener('load', function() {
    console.log('Page fully loaded');
    // Enable candles after 2 seconds minimum
    setTimeout(() => {
        document.querySelectorAll('.flame').forEach(flame => {
            flame.style.pointerEvents = 'auto';
            flame.style.cursor = 'pointer';
        });
    }, 2000);
});



// Add this near your other state variables
let backButtonAdded = false;

// Add this function to show the back button
function showBackToCakeButton() {
    const backButton = document.getElementById('back-to-cake-btn');
    if (!backButton) return;

    // Add click event listener if not already added
    if (!backButton.hasAttribute('data-listener-added')) {
        backButton.addEventListener('click', resetToCakePage);
        backButton.setAttribute('data-listener-added', 'true');
    }

    // Show the button with animation
    setTimeout(() => {
        backButton.classList.add('visible');
        backButton.classList.add('pulse'); // Optional pulsing effect
    }, 500);

    backButtonAdded = true;
}

// Add this function to reset to cake page
function resetToCakePage() {
    console.log('Resetting to cake page...');

    // Reset all state variables
    flamesOut = 0;
    secondPhaseActive = false;

    // Clear intervals
    clearTitleAnimation();
    if (catSpinningInterval) {
        clearInterval(catSpinningInterval);
        catSpinningInterval = null;
    }

    // Stop any animations
    document.querySelectorAll('.cat-sticker, .pokemon-sticker').forEach(el => {
        el.style.animation = 'none';
    });

    // Hide celebration layer
    const celebrationLayer = document.getElementById('celebration-layer');
    if (celebrationLayer) {
        celebrationLayer.style.display = 'none';
    }

    // Show instructions
    document.querySelectorAll('.instruction').forEach(inst => {
        inst.style.display = 'block';
    });

    // Reset background to first one
    const bg1 = document.querySelector('.bg-design-1');
    const bg2 = document.querySelector('.bg-design-2');
    if (bg1 && bg2) {
        bg1.classList.add('active');
        bg2.classList.remove('active');
    }

    // Reset candles (flames)
    document.querySelectorAll('.flame').forEach(flame => {
        flame.style.display = 'block';
    });

    // Clear pokemon and cats
    const pokemonContainer = document.getElementById('pokemon-stamps');
    const catsContainer = document.getElementById('cats-container');
    if (pokemonContainer) pokemonContainer.innerHTML = '';
    if (catsContainer) catsContainer.innerHTML = '';

    // Hide ransom title
    const ransomTitle = document.getElementById('ransom-title');
    if (ransomTitle) {
        ransomTitle.classList.remove('visible');
        ransomTitle.innerHTML = '';
    }

    // Hide back button
    const backButton = document.getElementById('back-to-cake-btn');
    if (backButton) {
        backButton.classList.remove('visible');
        backButton.classList.remove('pulse');
    }

    // Reset transition text
    const transitionText = document.getElementById('transition-text');
    if (transitionText) {
        transitionText.style.display = 'none';
        transitionText.textContent = '';
    }

    // Play a sound for feedback (optional)
    playSound('pouf-sound');

    console.log('Reset complete!');
}

// Modify your startPokemonSpin function to show the button
function startPokemonSpin() {
    const pokemons = document.querySelectorAll('.pokemon-sticker');

    pokemons.forEach(pokemon => {
        pokemon.classList.add('spinning');

        // Faster animation for pokemons too
        const duration = (Math.random() * 1) + 1.5; // 1.5 to 2.5 seconds
        pokemon.style.animationDuration = `0.4s, 2s, ${duration}s`;

        // Add chaotic effects to pokemons too
        if (Math.random() > 0.5) {
            pokemon.style.animation = `popIn 0.4s ease-out forwards, float 2s ease-in-out infinite, spinAndScale ${duration}s ease-in-out infinite`;
        }

        // Add hover effect for pokemons with more chaos
        pokemon.addEventListener('mouseenter', () => {
            pokemon.style.transform = 'scale(1.5) rotate(180deg)';
            pokemon.style.filter = 'hue-rotate(180deg) brightness(1.5)';
            pokemon.style.transition = 'all 0.2s ease';
            pokemon.style.zIndex = '100';
        });

        pokemon.addEventListener('mouseleave', () => {
            pokemon.style.transform = '';
            pokemon.style.filter = '';
            pokemon.style.zIndex = 'auto';
        });
    });

    // Make pokemons move more frequently and chaotically
    if (!secondPhaseActive) {
        setInterval(() => {
            pokemons.forEach(pokemon => {
                // Higher chance to move (50% instead of 30%)
                if (Math.random() > 0.5) {
                    // Move within a larger radius for more chaos
                    const currentLeft = parseFloat(pokemon.style.left) || 50;
                    const currentTop = parseFloat(pokemon.style.top) || 50;

                    const offsetX = (Math.random() * 30) - 15; // -15% to +15% (more movement)
                    const offsetY = (Math.random() * 30) - 15;

                    const newLeft = Math.max(5, Math.min(95, currentLeft + offsetX));
                    const newTop = Math.max(5, Math.min(95, currentTop + offsetY));

                    pokemon.style.left = `${newLeft}%`;
                    pokemon.style.top = `${newTop}%`;

                    // Faster transition
                    pokemon.style.transition = 'all 0.5s ease';

                    // Add random rotation during movement
                    const randomRotate = Math.random() * 360;
                    pokemon.style.transform = `rotate(${randomRotate}deg)`;
                }

                // Occasionally change animation properties (30% chance)
                if (Math.random() > 0.7) {
                    const newDuration = (Math.random() * 1) + 1.5;
                    pokemon.style.animationDuration = `0.4s, 2s, ${newDuration}s`;
                }
            });
        }, 1500); // Check every 1.5 seconds (instead of 3) for more chaos
    }

    secondPhaseActive = true;

    // ADD THIS: Show the back button after pokemon start spinning
    setTimeout(() => {
        showBackToCakeButton();
    }, 1000); // Show button 1 second after pokemon start spinning
}