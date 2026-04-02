// Data Storage and Management
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Error saving to localStorage:', e);
        return false;
    }
}

function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Error loading from localStorage:', e);
        return null;
    }
}

function clearLocalStorage() {
    localStorage.clear();
}

// Assignment-specific functions
function saveAssignment(assignment) {
    const assignments = loadFromLocalStorage('assignments') || [];
    assignments.push(assignment);
    return saveToLocalStorage('assignments', assignments);
}

function getAssignments() {
    return loadFromLocalStorage('assignments') || [];
}

function updateAssignment(updatedAssignment) {
    const assignments = getAssignments();
    const index = assignments.findIndex(a => a.id === updatedAssignment.id);
    
    if (index !== -1) {
        assignments[index] = updatedAssignment;
        return saveToLocalStorage('assignments', assignments);
    }
    
    return false;
}

function deleteAssignment(id) {
    const assignments = getAssignments();
    const updatedAssignments = assignments.filter(a => a.id !== id);
    return saveToLocalStorage('assignments', updatedAssignments);
}

// Pomodoro session tracking
function savePomodoroSession(session) {
    const sessions = loadFromLocalStorage('pomodoroSessions') || [];
    sessions.push(session);
    return saveToLocalStorage('pomodoroSessions', sessions);
}

function getPomodoroSessions() {
    return loadFromLocalStorage('pomodoroSessions') || [];
}