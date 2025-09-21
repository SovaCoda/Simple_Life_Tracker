(function() {
    'use strict';
    
    var lifeTotals = {
        player1: 40,
        player2: 40,
        player3: 40,
        player4: 40
    };
    
    var playerNames = {
        player1: 'Player 1',
        player2: 'Player 2',
        player3: 'Player 3',
        player4: 'Player 4'
    };
    
    var playerColors = {
        player1: 'green',
        player2: 'red',
        player3: 'blue',
        player4: 'yellow'
    };
    
    var playerCounters = {
        player1: { 
            commander: { from2: 0, from3: 0, from4: 0 }, 
            poison: 0, 
            energy: 0 
        },
        player2: { 
            commander: { from1: 0, from3: 0, from4: 0 }, 
            poison: 0, 
            energy: 0 
        },
        player3: { 
            commander: { from1: 0, from2: 0, from4: 0 }, 
            poison: 0, 
            energy: 0 
        },
        player4: { 
            commander: { from1: 0, from2: 0, from3: 0 }, 
            poison: 0, 
            energy: 0 
        }
    };
    
    var colorDefinitions = {
        green: {
            primary: '#10b981',
            saturated: '#059669',
            muted: '#065f46',
            panel: '#064e3b',
            border: '#047857'
        },
        red: {
            primary: '#ef4444',
            saturated: '#dc2626',
            muted: '#991b1b',
            panel: '#7f1d1d',
            border: '#b91c1c'
        },
        blue: {
            primary: '#3b82f6',
            saturated: '#2563eb',
            muted: '#1e40af',
            panel: '#1e3a8a',
            border: '#1d4ed8'
        },
        yellow: {
            primary: '#eab308',
            saturated: '#ca8a04',
            muted: '#a16207',
            panel: '#854d0e',
            border: '#b45309'
        },
        black: {
            primary: '#6b7280',
            saturated: '#4b5563',
            muted: '#374151',
            panel: '#1f2937',
            border: '#374151'
        }
    };
    
    var STORAGE_KEY = 'mtg-commander-life-tracker';
    var NAMES_STORAGE_KEY = 'mtg-commander-player-names';
    var COLORS_STORAGE_KEY = 'mtg-commander-player-colors';
    var COUNTERS_STORAGE_KEY = 'mtg-commander-player-counters';
    
    var dinoSoundFiles = [];
    
    function loadDinoSounds() {
        var possibleFiles = [
            'roar1.mp3', 'roar2.mp3', 'roar3.mp3',
            'growl1.wav', 'growl2.wav', 'growl3.wav',
            't_rex.mp3', 'raptor_call.ogg', 'triceratops.wav',
            'dino_roar_1.mp3', 'dino_roar_2.mp3', 'dino_growl.mp3',
            'roar.mp3', 'growl.mp3', 'dinosaur.mp3'
        ];
        
        dinoSoundFiles = possibleFiles.slice();
    }
    
    function playDinoSound() {
        try {
            var randomIndex = Math.floor(Math.random() * dinoSoundFiles.length);
            var selectedFile = dinoSoundFiles[randomIndex];
            
            var audio = new Audio('audio/' + selectedFile);
            audio.volume = 0.7;
            
            audio.play().catch(function(error) {
                console.log('Audio play failed for', selectedFile, ':', error);
                var nextIndex = (randomIndex + 1) % dinoSoundFiles.length;
                var nextFile = dinoSoundFiles[nextIndex];
                var fallbackAudio = new Audio('audio/' + nextFile);
                fallbackAudio.volume = 0.7;
                fallbackAudio.play().catch(function(fallbackError) {
                    console.log('Fallback audio also failed:', fallbackError);
                });
            });
            
        } catch (e) {
            console.log('Error playing dinosaur sound:', e);
        }
    }
    
    function init() {
        // Register Service Worker for PWA functionality
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                        console.log('ServiceWorker registration successful');
                    })
                    .catch(function(err) {
                        console.log('ServiceWorker registration failed: ', err);
                    });
            });
        }
        
        loadLifeTotals();
        loadPlayerNames();
        loadPlayerColors();
        loadPlayerCounters();
        loadDinoSounds();
        updateDisplay();
        updatePlayerNames();
        updatePlayerColors();
        updatePlayerCounters();
        updateDinoButtons();
        setupEventListeners();
    }
    
    function loadLifeTotals() {
        try {
            var stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                var parsed = JSON.parse(stored);
                if (parsed.player1 !== undefined) lifeTotals.player1 = parsed.player1;
                if (parsed.player2 !== undefined) lifeTotals.player2 = parsed.player2;
                if (parsed.player3 !== undefined) lifeTotals.player3 = parsed.player3;
                if (parsed.player4 !== undefined) lifeTotals.player4 = parsed.player4;
            }
        } catch (e) {
            console.warn('Failed to load life totals from localStorage:', e);
        }
    }
    
    function loadPlayerNames() {
        try {
            var stored = localStorage.getItem(NAMES_STORAGE_KEY);
            if (stored) {
                var parsed = JSON.parse(stored);
                if (parsed.player1 !== undefined) playerNames.player1 = parsed.player1;
                if (parsed.player2 !== undefined) playerNames.player2 = parsed.player2;
                if (parsed.player3 !== undefined) playerNames.player3 = parsed.player3;
                if (parsed.player4 !== undefined) playerNames.player4 = parsed.player4;
            }
        } catch (e) {
            console.warn('Failed to load player names from localStorage:', e);
        }
    }
    
    function loadPlayerColors() {
        try {
            var stored = localStorage.getItem(COLORS_STORAGE_KEY);
            if (stored) {
                var parsed = JSON.parse(stored);
                if (parsed.player1 !== undefined) playerColors.player1 = parsed.player1;
                if (parsed.player2 !== undefined) playerColors.player2 = parsed.player2;
                if (parsed.player3 !== undefined) playerColors.player3 = parsed.player3;
                if (parsed.player4 !== undefined) playerColors.player4 = parsed.player4;
            }
        } catch (e) {
            console.warn('Failed to load player colors from localStorage:', e);
        }
    }
    
    function loadPlayerCounters() {
        try {
            var stored = localStorage.getItem(COUNTERS_STORAGE_KEY);
            if (stored) {
                var parsed = JSON.parse(stored);
                for (var playerKey in playerCounters) {
                    if (parsed[playerKey]) {
                        // Handle commander damage (new structure)
                        if (parsed[playerKey].commander) {
                            if (typeof parsed[playerKey].commander === 'object') {
                                // New structure with from1, from2, etc.
                                for (var fromKey in parsed[playerKey].commander) {
                                    if (playerCounters[playerKey].commander[fromKey] !== undefined) {
                                        playerCounters[playerKey].commander[fromKey] = parsed[playerKey].commander[fromKey];
                                    }
                                }
                            } else {
                                // Old structure - convert to new structure
                                var oldValue = parsed[playerKey].commander;
                                playerCounters[playerKey].commander = { from1: 0, from2: 0, from3: 0, from4: 0 };
                                // Distribute old value to first available slot
                                for (var fromKey in playerCounters[playerKey].commander) {
                                    if (playerCounters[playerKey].commander[fromKey] !== undefined) {
                                        playerCounters[playerKey].commander[fromKey] = oldValue;
                                        break;
                                    }
                                }
                            }
                        }
                        if (parsed[playerKey].poison !== undefined) playerCounters[playerKey].poison = parsed[playerKey].poison;
                        if (parsed[playerKey].energy !== undefined) playerCounters[playerKey].energy = parsed[playerKey].energy;
                    }
                }
            }
        } catch (e) {
            console.warn('Failed to load player counters from localStorage:', e);
        }
    }
    
    function saveLifeTotals() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(lifeTotals));
        } catch (e) {
            console.warn('Failed to save life totals to localStorage:', e);
        }
    }
    
    function savePlayerNames() {
        try {
            localStorage.setItem(NAMES_STORAGE_KEY, JSON.stringify(playerNames));
        } catch (e) {
            console.warn('Failed to save player names to localStorage:', e);
        }
    }
    
    function savePlayerColors() {
        try {
            localStorage.setItem(COLORS_STORAGE_KEY, JSON.stringify(playerColors));
        } catch (e) {
            console.warn('Failed to save player colors to localStorage:', e);
        }
    }
    
    function savePlayerCounters() {
        try {
            localStorage.setItem(COUNTERS_STORAGE_KEY, JSON.stringify(playerCounters));
        } catch (e) {
            console.warn('Failed to save player counters to localStorage:', e);
        }
    }
    
    function updateDisplay() {
        var player1Element = document.getElementById('life1');
        var player2Element = document.getElementById('life2');
        var player3Element = document.getElementById('life3');
        var player4Element = document.getElementById('life4');
        
        if (player1Element) player1Element.textContent = lifeTotals.player1;
        if (player2Element) player2Element.textContent = lifeTotals.player2;
        if (player3Element) player3Element.textContent = lifeTotals.player3;
        if (player4Element) player4Element.textContent = lifeTotals.player4;
    }
    
    function updatePlayerNames() {
        var name1Element = document.getElementById('name1');
        var name2Element = document.getElementById('name2');
        var name3Element = document.getElementById('name3');
        var name4Element = document.getElementById('name4');
        
        if (name1Element) name1Element.textContent = playerNames.player1;
        if (name2Element) name2Element.textContent = playerNames.player2;
        if (name3Element) name3Element.textContent = playerNames.player3;
        if (name4Element) name4Element.textContent = playerNames.player4;
    }
    
    function updatePlayerColors() {
        for (var i = 1; i <= 4; i++) {
            var playerKey = 'player' + i;
            var colorKey = playerColors[playerKey];
            var colors = colorDefinitions[colorKey];
            
            var lifeDisplay = document.getElementById('life' + i);
            var plusButton = document.querySelector('[data-player="' + i + '"][data-action="plus"]:not([data-counter])');
            var minusButton = document.querySelector('[data-player="' + i + '"][data-action="minus"]:not([data-counter])');
            
            if (lifeDisplay) {
                lifeDisplay.style.color = colors.primary;
            }
            
            if (plusButton) {
                plusButton.style.backgroundColor = colors.saturated;
                plusButton.style.borderColor = colors.saturated;
            }
            
            if (minusButton) {
                minusButton.style.backgroundColor = colors.muted;
                minusButton.style.borderColor = colors.muted;
            }
            
            // Update commander damage counter colors
            updateCommanderDamageColors(i, colors);
        }
    }
    
    function updateCommanderDamageColors(playerNum, colors) {
        // Update commander damage counters for this player
        for (var fromPlayer = 1; fromPlayer <= 4; fromPlayer++) {
            if (fromPlayer !== playerNum) {
                var fromPlayerColors = colorDefinitions[playerColors['player' + fromPlayer]];
                
                // Update plus buttons (use the "from" player's saturated color)
                var plusButtons = document.querySelectorAll('[data-player="' + playerNum + '"][data-counter="commander"][data-from="' + fromPlayer + '"][data-action="plus"]');
                for (var i = 0; i < plusButtons.length; i++) {
                    plusButtons[i].style.backgroundColor = fromPlayerColors.saturated;
                    plusButtons[i].style.borderColor = fromPlayerColors.saturated;
                }
                
                // Update minus buttons (use the "from" player's muted color)
                var minusButtons = document.querySelectorAll('[data-player="' + playerNum + '"][data-counter="commander"][data-from="' + fromPlayer + '"][data-action="minus"]');
                for (var i = 0; i < minusButtons.length; i++) {
                    minusButtons[i].style.backgroundColor = fromPlayerColors.muted;
                    minusButtons[i].style.borderColor = fromPlayerColors.muted;
                }
            }
        }
    }
    
    function updatePlayerCounters() {
        for (var i = 1; i <= 4; i++) {
            var playerKey = 'player' + i;
            var counters = playerCounters[playerKey];
            
            // Update commander damage from each other player
            for (var j = 1; j <= 4; j++) {
                if (i !== j) {
                    var fromKey = 'from' + j;
                    var commanderElement = document.getElementById('commander' + i + 'from' + j);
                    if (commanderElement && counters.commander[fromKey] !== undefined) {
                        commanderElement.textContent = counters.commander[fromKey];
                    }
                }
            }
            
            // Update poison and energy
            var poisonElement = document.getElementById('poison' + i);
            var energyElement = document.getElementById('energy' + i);
            
            if (poisonElement) poisonElement.textContent = counters.poison;
            if (energyElement) energyElement.textContent = counters.energy;
        }
    }
    
    function updateDinoButtons() {
        // Hide all dino buttons first
        var allDinoButtons = document.querySelectorAll('.dino-btn');
        for (var i = 0; i < allDinoButtons.length; i++) {
            allDinoButtons[i].classList.add('hidden');
        }
        
        // Show dino button only for player named "Houston"
        for (var playerKey in playerNames) {
            if (playerNames[playerKey] === 'Houston') {
                var playerNum = playerKey.replace('player', '');
                var dinoButton = document.querySelector('.dino-btn[data-player="' + playerNum + '"]');
                if (dinoButton) {
                    dinoButton.classList.remove('hidden');
                }
            }
        }
    }
    
    function adjustLife(player, action) {
        var playerKey = 'player' + player;
        var currentLife = lifeTotals[playerKey];
        var newLife;
        
        if (action === 'plus') {
            newLife = currentLife + 1;
        } else if (action === 'minus') {
            newLife = currentLife - 1;
        } else {
            return;
        }
        
        lifeTotals[playerKey] = newLife;
        
        updateDisplay();
        
        saveLifeTotals();
    }
    
    function adjustCounter(player, counterType, action, fromPlayer) {
        var playerKey = 'player' + player;
        var newValue;
        
        if (counterType === 'commander' && fromPlayer) {
            // Handle commander damage from specific player
            var fromKey = 'from' + fromPlayer;
            var currentValue = playerCounters[playerKey][counterType][fromKey];
            
            if (action === 'plus') {
                newValue = currentValue + 1;
            } else if (action === 'minus') {
                newValue = Math.max(0, currentValue - 1); // Don't go below 0
            } else {
                return;
            }
            
            playerCounters[playerKey][counterType][fromKey] = newValue;
        } else {
            // Handle poison and energy (simple counters)
            var currentValue = playerCounters[playerKey][counterType];
            
            if (action === 'plus') {
                newValue = currentValue + 1;
            } else if (action === 'minus') {
                newValue = Math.max(0, currentValue - 1); // Don't go below 0
            } else {
                return;
            }
            
            playerCounters[playerKey][counterType] = newValue;
        }
        
        updatePlayerCounters();
        savePlayerCounters();
    }
    
    function togglePlayerMenu(playerNum) {
        var menuOptions = document.getElementById('player' + playerNum + 'MenuOptions');
        if (menuOptions) {
            menuOptions.classList.toggle('hidden');
        }
    }
    
    function closeAllPlayerMenus() {
        for (var i = 1; i <= 4; i++) {
            var menuOptions = document.getElementById('player' + i + 'MenuOptions');
            if (menuOptions) {
                menuOptions.classList.add('hidden');
            }
        }
    }
    
    function editPlayerName(player) {
        var playerKey = 'player' + player;
        var currentName = playerNames[playerKey];
        var newName = prompt('Enter new name for ' + currentName + ':', currentName);
        
        if (newName !== null && newName.trim() !== '') {
            playerNames[playerKey] = newName.trim();
            updatePlayerNames();
            updateDinoButtons();
            savePlayerNames();
        }
    }
    
    function resetAllCounters() {
        if (confirm('Are you sure you want to reset all life totals to 40?')) {
            lifeTotals.player1 = 40;
            lifeTotals.player2 = 40;
            lifeTotals.player3 = 40;
            lifeTotals.player4 = 40;
            
            updateDisplay();
            saveLifeTotals();
        }
    }

    function resetPlayerNames() {
        playerNames.player1 = 'Player 1';
        playerNames.player2 = 'Player 2';
        playerNames.player3 = 'Player 3';
        playerNames.player4 = 'Player 4';
        updatePlayerNames();
        updateDinoButtons();
        savePlayerNames();
    }
    
    function resetPlayerColors() {
        // Assign unique colors to each player
        var availableColors = ['green', 'red', 'blue', 'yellow', 'black'];
        playerColors.player1 = availableColors[0];
        playerColors.player2 = availableColors[1];
        playerColors.player3 = availableColors[2];
        playerColors.player4 = availableColors[3];
        updatePlayerColors();
        savePlayerColors();
    }
    
    function resetPlayerCounters() {
        for (var playerKey in playerCounters) {
            // Reset commander damage from each other player
            for (var fromKey in playerCounters[playerKey].commander) {
                playerCounters[playerKey].commander[fromKey] = 0;
            }
            playerCounters[playerKey].poison = 0;
            playerCounters[playerKey].energy = 0;
        }
        updatePlayerCounters();
        savePlayerCounters();
    }
    
    function toggleMenu() {
        var menuOptions = document.getElementById('menuOptions');
        if (menuOptions) {
            menuOptions.classList.toggle('hidden');
        }
    }
    
    function closeMenu() {
        var menuOptions = document.getElementById('menuOptions');
        if (menuOptions) {
            menuOptions.classList.add('hidden');
        }
    }
    
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            // Enter fullscreen
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
        closeMenu();
    }
    
    function showBackgrounds() {
        // Remove any existing color picker
        var existingPicker = document.getElementById('colorPickerModal');
        if (existingPicker) {
            existingPicker.remove();
        }
        
        var colorPickerHtml = '<div id="colorPickerModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; display: flex; align-items: center; justify-content: center;">' +
            '<div style="background: #2d2d2d; border: 2px solid #4b5563; border-radius: 8px; padding: 20px; max-width: 400px; width: 90%;">' +
            '<h3 style="color: white; margin: 0 0 20px 0; text-align: center;">Player Colors</h3>' +
            '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">';
        
        var availableColors = ['green', 'red', 'blue', 'yellow', 'black'];
        var colorNames = { green: 'Green', red: 'Red', blue: 'Blue', yellow: 'Yellow', black: 'Black' };
        
        for (var i = 1; i <= 4; i++) {
            colorPickerHtml += '<div style="text-align: center;">' +
                '<div style="color: white; margin-bottom: 5px; font-weight: bold;">' + playerNames['player' + i] + '</div>' +
                '<div style="display: flex; gap: 5px; justify-content: center;">';
            
            for (var j = 0; j < availableColors.length; j++) {
                var color = availableColors[j];
                var isSelected = playerColors['player' + i] === color;
                var isAvailable = isColorAvailable(color, 'player' + i);
                
                var buttonStyle = 'width: 30px; height: 30px; border-radius: 50%; background: ' + colorDefinitions[color].primary + '; ';
                var borderStyle = isSelected ? 'border: 3px solid white;' : 'border: 1px solid #4b5563;';
                var cursorStyle = isAvailable ? 'cursor: pointer;' : 'cursor: not-allowed; opacity: 0.5;';
                var transitionStyle = 'transition: all 0.2s;';
                
                var title = isAvailable ? colorNames[color] : colorNames[color] + ' (Taken)';
                
                colorPickerHtml += '<button data-player="' + i + '" data-color="' + color + '" data-available="' + isAvailable + '" style="' +
                    buttonStyle + borderStyle + cursorStyle + transitionStyle + '" title="' + title + '"></button>';
            }
            
            colorPickerHtml += '</div></div>';
        }
        
        colorPickerHtml += '</div>' +
            '<div style="text-align: center; margin-top: 20px;">' +
            '<button id="closeColorPicker" style="background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-right: 10px;">Close</button>' +
            '<button id="resetColors" style="background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Reset Colors</button>' +
            '</div></div></div>';
        
        document.body.insertAdjacentHTML('beforeend', colorPickerHtml);
        
        // Add event listeners for the color picker
        setupColorPickerEvents();
        closeMenu();
    }
    
    function setupColorPickerEvents() {
        // Color selection buttons
        var colorButtons = document.querySelectorAll('#colorPickerModal button[data-player]');
        for (var i = 0; i < colorButtons.length; i++) {
            colorButtons[i].addEventListener('click', function() {
                var isAvailable = this.getAttribute('data-available') === 'true';
                if (!isAvailable) {
                    return; // Don't allow clicking on unavailable colors
                }
                
                var playerNum = parseInt(this.getAttribute('data-player'));
                var color = this.getAttribute('data-color');
                changePlayerColor(playerNum, color);
            });
        }
        
        // Close button
        var closeBtn = document.getElementById('closeColorPicker');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeColorPicker);
        }
        
        // Reset button
        var resetBtn = document.getElementById('resetColors');
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                resetPlayerColors();
                closeColorPicker();
            });
        }
        
        // Close on background click
        var modal = document.getElementById('colorPickerModal');
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeColorPicker();
                }
            });
        }
    }
    
    function isColorAvailable(color, excludePlayer) {
        for (var playerKey in playerColors) {
            if (playerKey !== excludePlayer && playerColors[playerKey] === color) {
                return false;
            }
        }
        return true;
    }
    
    function changePlayerColor(playerNum, color) {
        var playerKey = 'player' + playerNum;
        var currentColor = playerColors[playerKey];
        
        // Check if color is available
        if (!isColorAvailable(color, playerKey)) {
            return; // Don't change if color is already taken
        }
        
        playerColors[playerKey] = color;
        updatePlayerColors();
        savePlayerColors();
        
        // Update the color picker to show new selection
        var colorPicker = document.getElementById('colorPickerModal');
        if (colorPicker) {
            colorPicker.remove();
            showBackgrounds();
        }
    }
    
    function closeColorPicker() {
        var colorPicker = document.getElementById('colorPickerModal');
        if (colorPicker) {
            colorPicker.remove();
        }
    }
    
    function setupEventListeners() {
        // Only target main life counter buttons (exclude counter menu buttons)
        var buttons = document.querySelectorAll('button[data-player][data-action]:not([data-counter])');
        
        for (var i = 0; i < buttons.length; i++) {
            var button = buttons[i];
            var player = button.getAttribute('data-player');
            var action = button.getAttribute('data-action');
            
            if ('ontouchstart' in window) {
                button.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    var targetPlayer = this.getAttribute('data-player');
                    var targetAction = this.getAttribute('data-action');
                    adjustLife(targetPlayer, targetAction);
                }, { passive: false });
            } else {
                button.addEventListener('click', function() {
                    var targetPlayer = this.getAttribute('data-player');
                    var targetAction = this.getAttribute('data-action');
                    adjustLife(targetPlayer, targetAction);
                });
            }
        }
        
        // Handle individual dino buttons for each player
        var dinoButtons = document.querySelectorAll('.dino-btn');
        for (var i = 0; i < dinoButtons.length; i++) {
            var dinoBtn = dinoButtons[i];
            if ('ontouchstart' in window) {
                dinoBtn.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    playDinoSound();
                }, { passive: false });
            } else {
                dinoBtn.addEventListener('click', function() {
                    playDinoSound();
                });
            }
        }
        
        // Handle edit name buttons
        var editButtons = document.querySelectorAll('.edit-name-btn');
        for (var i = 0; i < editButtons.length; i++) {
            var editBtn = editButtons[i];
            var player = editBtn.getAttribute('data-player');
            
            if ('ontouchstart' in window) {
                editBtn.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    var targetPlayer = this.getAttribute('data-player');
                    editPlayerName(targetPlayer);
                }, { passive: false });
            } else {
                editBtn.addEventListener('click', function() {
                    var targetPlayer = this.getAttribute('data-player');
                    editPlayerName(targetPlayer);
                });
            }
        }
        
        // Handle hamburger menu button
        var hamburgerBtn = document.getElementById('hamburgerBtn');
        if (hamburgerBtn) {
            if ('ontouchstart' in window) {
                hamburgerBtn.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    toggleMenu();
                }, { passive: false });
            } else {
                hamburgerBtn.addEventListener('click', function() {
                    toggleMenu();
                });
            }
        }
        
        // Handle reset all button in menu
        var resetAllBtn = document.getElementById('resetAllBtn');
        if (resetAllBtn) {
            if ('ontouchstart' in window) {
                resetAllBtn.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    resetAllCounters();
                    resetPlayerNames();
                    resetPlayerColors();
                    resetPlayerCounters();
                    closeMenu();
                }, { passive: false });
            } else {
                resetAllBtn.addEventListener('click', function() {
                    resetAllCounters();
                    resetPlayerNames();
                    resetPlayerColors();
                    resetPlayerCounters();
                    closeMenu();
                });
            }
        }
        
        // Handle fullscreen button in menu
        var fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            if ('ontouchstart' in window) {
                fullscreenBtn.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    toggleFullscreen();
                }, { passive: false });
            } else {
                fullscreenBtn.addEventListener('click', function() {
                    toggleFullscreen();
                });
            }
        }
        
        // Handle backgrounds button in menu
        var backgroundsBtn = document.getElementById('backgroundsBtn');
        if (backgroundsBtn) {
            if ('ontouchstart' in window) {
                backgroundsBtn.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    showBackgrounds();
                }, { passive: false });
            } else {
                backgroundsBtn.addEventListener('click', function() {
                    showBackgrounds();
                });
            }
        }
        
        // Handle player menu buttons
        for (var i = 1; i <= 4; i++) {
            var playerMenuBtn = document.getElementById('player' + i + 'MenuBtn');
            if (playerMenuBtn) {
                if ('ontouchstart' in window) {
                    playerMenuBtn.addEventListener('touchstart', function(e) {
                        e.preventDefault();
                        var playerNum = parseInt(this.id.replace('player', '').replace('MenuBtn', ''));
                        togglePlayerMenu(playerNum);
                    }, { passive: false });
                } else {
                    playerMenuBtn.addEventListener('click', function() {
                        var playerNum = parseInt(this.id.replace('player', '').replace('MenuBtn', ''));
                        togglePlayerMenu(playerNum);
                    });
                }
            }
        }
        
        // Handle counter buttons
        var counterButtons = document.querySelectorAll('button[data-counter]');
        for (var i = 0; i < counterButtons.length; i++) {
            var button = counterButtons[i];
            var player = button.getAttribute('data-player');
            var counter = button.getAttribute('data-counter');
            var action = button.getAttribute('data-action');
            var fromPlayer = button.getAttribute('data-from');
            
            if ('ontouchstart' in window) {
                button.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    var targetPlayer = this.getAttribute('data-player');
                    var targetCounter = this.getAttribute('data-counter');
                    var targetAction = this.getAttribute('data-action');
                    var targetFromPlayer = this.getAttribute('data-from');
                    adjustCounter(targetPlayer, targetCounter, targetAction, targetFromPlayer);
                }, { passive: false });
            } else {
                button.addEventListener('click', function() {
                    var targetPlayer = this.getAttribute('data-player');
                    var targetCounter = this.getAttribute('data-counter');
                    var targetAction = this.getAttribute('data-action');
                    var targetFromPlayer = this.getAttribute('data-from');
                    adjustCounter(targetPlayer, targetCounter, targetAction, targetFromPlayer);
                });
            }
        }
        
        // Close menus when clicking/tapping outside
        function handleOutsideClick(e) {
            var hamburgerMenu = document.getElementById('hamburgerBtn');
            var menuOptions = document.getElementById('menuOptions');
            
            // Close main hamburger menu
            if (hamburgerMenu && menuOptions && 
                !hamburgerMenu.contains(e.target) && 
                !menuOptions.contains(e.target)) {
                closeMenu();
            }
            
            // Close player menus when clicking outside
            var clickedInsidePlayerMenu = false;
            for (var i = 1; i <= 4; i++) {
                var playerMenuBtn = document.getElementById('player' + i + 'MenuBtn');
                var playerMenuOptions = document.getElementById('player' + i + 'MenuOptions');
                
                if (playerMenuBtn && playerMenuOptions && 
                    (playerMenuBtn.contains(e.target) || playerMenuOptions.contains(e.target))) {
                    clickedInsidePlayerMenu = true;
                    break;
                }
            }
            
            if (!clickedInsidePlayerMenu) {
                closeAllPlayerMenus();
            }
        }
        
        // Add both click and touchstart event listeners
        document.addEventListener('click', handleOutsideClick);
        document.addEventListener('touchstart', handleOutsideClick, { passive: true });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();