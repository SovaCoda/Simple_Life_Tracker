(function() {
    'use strict';
    
    var lifeTotals = {
        player1: 40,
        player2: 40,
        player3: 40,
        player4: 40
    };
    
    var STORAGE_KEY = 'mtg-commander-life-tracker';
    
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
        loadLifeTotals();
        loadDinoSounds();
        updateDisplay();
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
    
    function saveLifeTotals() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(lifeTotals));
        } catch (e) {
            console.warn('Failed to save life totals to localStorage:', e);
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
    
    function setupEventListeners() {
        var buttons = document.querySelectorAll('.life-btn');
        
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
        
        var dinoBtn = document.getElementById('dinoBtn');
        if (dinoBtn) {
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
        
        var resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            if ('ontouchstart' in window) {
                resetBtn.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    resetAllCounters();
                }, { passive: false });
            } else {
                resetBtn.addEventListener('click', function() {
                    resetAllCounters();
                });
            }
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();