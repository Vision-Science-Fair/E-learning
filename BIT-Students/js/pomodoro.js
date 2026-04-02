// Pomodoro Timer Functionality
document.addEventListener('DOMContentLoaded', function() {
    initPomodoroTimer();
});

function initPomodoroTimer() {
    let timer;
    let timeLeft = 25 * 60; // 25 minutes in seconds
    let currentMode = 'focus';
    let isRunning = false;
    let autoStart = true;
    
    const timerDisplay = document.getElementById('timer');
    const startButton = document.getElementById('start-timer');
    const pauseButton = document.getElementById('pause-timer');
    const resetButton = document.getElementById('reset-timer');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const focusLengthInput = document.getElementById('focus-length');
    const shortBreakInput = document.getElementById('short-break-length');
    const longBreakInput = document.getElementById('long-break-length');
    const autoStartCheckbox = document.getElementById('auto-start');
    const distractionLog = document.getElementById('distraction-log');
    const logDistractionButton = document.getElementById('log-distraction');
    
    // Initialize timer display
    updateTimerDisplay();
    
    // Event listeners
    startButton.addEventListener('click', startTimer);
    pauseButton.addEventListener('click', pauseTimer);
    resetButton.addEventListener('click', resetTimer);
    
    modeButtons.forEach(button => {
        button.addEventListener('click', function() {
            switchMode(this.getAttribute('data-mode'));
        });
    });
    
    // Settings changes
    focusLengthInput.addEventListener('change', function() {
        if (currentMode === 'focus' && !isRunning) {
            timeLeft = this.value * 60;
            updateTimerDisplay();
        }
    });
    
    shortBreakInput.addEventListener('change', function() {
        if (currentMode === 'short-break' && !isRunning) {
            timeLeft = this.value * 60;
            updateTimerDisplay();
        }
    });
    
    longBreakInput.addEventListener('change', function() {
        if (currentMode === 'long-break' && !isRunning) {
            timeLeft = this.value * 60;
            updateTimerDisplay();
        }
    });
    
    autoStartCheckbox.addEventListener('change', function() {
        autoStart = this.checked;
    });
    
    // Distraction logging
    logDistractionButton.addEventListener('click', function() {
        const now = new Date();
        const distractionItem = document.createElement('div');
        distractionItem.className = 'log-entry';
        distractionItem.innerHTML = `
            <span class="log-time">${now.toLocaleTimeString()}</span>
            <span class="log-message">Distraction recorded during ${currentMode.replace('-', ' ')} session</span>
        `;
        
        if (distractionLog.firstChild && distractionLog.firstChild.classList.contains('empty-message')) {
            distractionLog.innerHTML = '';
        }
        
        distractionLog.appendChild(distractionItem);
        
        // Create notification
        createNotification({
            title: 'Distraction Logged',
            message: 'Try to stay focused!',
            time: now
        });
    });
    
    function startTimer() {
        if (isRunning) return;
        
        isRunning = true;
        startButton.disabled = true;
        pauseButton.disabled = false;
        
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                timerComplete();
            }
        }, 1000);
    }
    
    function pauseTimer() {
        if (!isRunning) return;
        
        clearInterval(timer);
        isRunning = false;
        startButton.disabled = false;
        pauseButton.disabled = true;
    }
    
    function resetTimer() {
        pauseTimer();
        
        switch (currentMode) {
            case 'focus':
                timeLeft = focusLengthInput.value * 60;
                break;
            case 'short-break':
                timeLeft = shortBreakInput.value * 60;
                break;
            case 'long-break':
                timeLeft = longBreakInput.value * 60;
                break;
        }
        
        updateTimerDisplay();
    }
    
    function switchMode(mode) {
        currentMode = mode;
        
        // Update active button
        modeButtons.forEach(button => {
            button.classList.remove('active');
            if (button.getAttribute('data-mode') === mode) {
                button.classList.add('active');
            }
        });
        
        // Set time based on mode
        switch (mode) {
            case 'focus':
                timeLeft = focusLengthInput.value * 60;
                break;
            case 'short-break':
                timeLeft = shortBreakInput.value * 60;
                break;
            case 'long-break':
                timeLeft = longBreakInput.value * 60;
                break;
        }
        
        // Reset timer if not running
        if (!isRunning) {
            updateTimerDisplay();
        }
        
        // If auto-start is enabled and timer was running, restart with new mode
        if (autoStart && isRunning) {
            pauseTimer();
            startTimer();
        }
    }
    
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    function timerComplete() {
        isRunning = false;
        startButton.disabled = false;
        pauseButton.disabled = true;
        
        // Play sound
        playTimerSound();
        
        // Show notification
        const message = currentMode === 'focus' 
            ? 'Focus session complete! Time for a break.' 
            : 'Break time over! Ready to focus again?';
        
        createNotification({
            title: 'Timer Complete',
            message: message,
            time: new Date()
        });
        
        // Auto-switch mode if enabled
        if (autoStart) {
            const nextMode = currentMode === 'focus' ? 'short-break' : 'focus';
            switchMode(nextMode);
            startTimer();
        }
    }
    
    function playTimerSound() {
        const audio = new Audio('assets/timer-complete.mp3');
        audio.play().catch(e => console.log('Audio playback failed:', e));
    }
}