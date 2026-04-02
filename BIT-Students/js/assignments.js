// Assignment Tracking Functionality
document.addEventListener('DOMContentLoaded', function() {
    initAssignmentForm();
    renderAssignmentList();
    initAssignmentFilters();
});

function initAssignmentForm() {
    const form = document.getElementById('assignment-form');
    const remindersList = document.getElementById('reminders-list');
    
    // Add reminder buttons
    document.querySelectorAll('.add-reminder-btn').forEach(button => {
        button.addEventListener('click', function() {
            const days = parseInt(this.getAttribute('data-days'));
            addReminder(days);
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const assignment = {
            id: Date.now(), // Simple ID generation
            title: document.getElementById('assignment-title').value,
            subject: document.getElementById('assignment-subject').value,
            dueDate: document.getElementById('assignment-due-date').value,
            priority: document.getElementById('assignment-priority').value,
            description: document.getElementById('assignment-description').value,
            status: 'not-started',
            progress: 0,
            reminders: Array.from(remindersList.children).map(item => parseInt(item.getAttribute('data-days')))
        };
        
        saveAssignment(assignment);
        form.reset();
        remindersList.innerHTML = '';
        document.getElementById('assignment-modal').classList.remove('active');
        
        // Refresh the assignment list
        renderAssignmentList();
        renderUpcomingAssignments();
    });
}

function addReminder(days) {
    const remindersList = document.getElementById('reminders-list');
    
    // Check if reminder already exists
    if (Array.from(remindersList.children).some(item => parseInt(item.getAttribute('data-days')) === days)) {
        return;
    }
    
    const reminderTag = document.createElement('div');
    reminderTag.className = 'reminder-tag';
    reminderTag.setAttribute('data-days', days);
    reminderTag.innerHTML = `
        ${days} day${days !== 1 ? 's' : ''} before
        <span class="remove-reminder"><i class="fas fa-times"></i></span>
    `;
    
    remindersList.appendChild(reminderTag);
    
    // Add remove functionality
    reminderTag.querySelector('.remove-reminder').addEventListener('click', function() {
        reminderTag.remove();
    });
}

function saveAssignment(assignment) {
    const assignments = JSON.parse(localStorage.getItem('assignments')) || [];
    assignments.push(assignment);
    localStorage.setItem('assignments', JSON.stringify(assignments));
}

function renderAssignmentList() {
    const assignments = JSON.parse(localStorage.getItem('assignments')) || [];
    const assignmentList = document.getElementById('assignment-list');
    
    // Clear existing items
    assignmentList.innerHTML = '';
    
    if (assignments.length === 0) {
        assignmentList.innerHTML = '<div class="empty-state"><i class="fas fa-clipboard-list"></i><p>No assignments yet</p></div>';
        return;
    }
    
    assignments.forEach(assignment => {
        const dueDate = new Date(assignment.dueDate);
        const daysUntilDue = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
        
        const assignmentItem = document.createElement('div');
        assignmentItem.className = 'assignment-item slide-in';
        assignmentItem.setAttribute('data-id', assignment.id);
        assignmentItem.innerHTML = `
            <div class="assignment-item-header">
                <div class="assignment-title">${assignment.title}</div>
                <div class="assignment-due-date">Due: ${dueDate.toLocaleDateString()}</div>
                <div class="assignment-priority priority-${assignment.priority}">${assignment.priority.toUpperCase()}</div>
            </div>
            <div class="assignment-subject">${formatSubject(assignment.subject)}</div>
            <div class="assignment-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${assignment.progress}%"></div>
                </div>
            </div>
        `;
        
        assignmentList.appendChild(assignmentItem);
        
        // Add click event to show details
        assignmentItem.addEventListener('click', function() {
            showAssignmentDetails(assignment);
        });
    });
}

function formatSubject(subject) {
    const subjects = {
        'math': 'Mathematics',
        'science': 'Science',
        'english': 'English',
        'history': 'History',
        'other': 'Other'
    };
    
    return subjects[subject] || subject;
}

function showAssignmentDetails(assignment) {
    const detailsContainer = document.getElementById('assignment-details');
    const dueDate = new Date(assignment.dueDate);
    const daysUntilDue = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
    
    detailsContainer.innerHTML = `
        <h2>${assignment.title}</h2>
        <div class="detail-row">
            <span class="detail-label">Subject:</span>
            <span class="detail-value">${formatSubject(assignment.subject)}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Due Date:</span>
            <span class="detail-value">${dueDate.toLocaleString()}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Days Left:</span>
            <span class="detail-value">${daysUntilDue}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Priority:</span>
            <span class="detail-value priority-${assignment.priority}">${assignment.priority.toUpperCase()}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Status:</span>
            <span class="detail-value">${assignment.status.replace('-', ' ').toUpperCase()}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Progress:</span>
            <span class="detail-value">${assignment.progress}%</span>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${assignment.progress}%"></div>
        </div>
        <div class="detail-description">
            <h3>Description</h3>
            <p>${assignment.description || 'No description provided.'}</p>
        </div>
        <div class="detail-actions">
            <button class="primary-btn edit-assignment" data-id="${assignment.id}"><i class="fas fa-edit"></i> Edit</button>
            <button class="secondary-btn delete-assignment" data-id="${assignment.id}"><i class="fas fa-trash"></i> Delete</button>
        </div>
    `;
    
    // Add edit and delete functionality
    detailsContainer.querySelector('.edit-assignment').addEventListener('click', function() {
        editAssignment(assignment.id);
    });
    
    detailsContainer.querySelector('.delete-assignment').addEventListener('click', function() {
        deleteAssignment(assignment.id);
    });
}

function editAssignment(id) {
    const assignments = JSON.parse(localStorage.getItem('assignments')) || [];
    const assignment = assignments.find(a => a.id === id);
    
    if (!assignment) return;
    
    // Fill the form with assignment data
    document.getElementById('assignment-title').value = assignment.title;
    document.getElementById('assignment-subject').value = assignment.subject;
    document.getElementById('assignment-due-date').value = assignment.dueDate;
    document.getElementById('assignment-priority').value = assignment.priority;
    document.getElementById('assignment-description').value = assignment.description || '';
    
    // Add reminders
    const remindersList = document.getElementById('reminders-list');
    remindersList.innerHTML = '';
    assignment.reminders.forEach(days => {
        addReminder(days);
    });
    
    // Open the modal
    document.getElementById('assignment-modal').classList.add('active');
    document.getElementById('modal-title').textContent = 'Edit Assignment';
    
    // Update form submission to handle edit
    const form = document.getElementById('assignment-form');
    form.onsubmit = function(e) {
        e.preventDefault();
        
        // Update assignment
        assignment.title = document.getElementById('assignment-title').value;
        assignment.subject = document.getElementById('assignment-subject').value;
        assignment.dueDate = document.getElementById('assignment-due-date').value;
        assignment.priority = document.getElementById('assignment-priority').value;
        assignment.description = document.getElementById('assignment-description').value;
        assignment.reminders = Array.from(remindersList.children).map(item => parseInt(item.getAttribute('data-days')));
        
        // Save back to localStorage
        localStorage.setItem('assignments', JSON.stringify(assignments));
        
        // Reset form and close modal
        form.reset();
        remindersList.innerHTML = '';
        document.getElementById('assignment-modal').classList.remove('active');
        document.getElementById('modal-title').textContent = 'Add New Assignment';
        
        // Refresh the UI
        renderAssignmentList();
        renderUpcomingAssignments();
        
        // Reset form handler to default
        form.onsubmit = function(e) {
            e.preventDefault();
            
            const newAssignment = {
                id: Date.now(),
                title: document.getElementById('assignment-title').value,
                subject: document.getElementById('assignment-subject').value,
                dueDate: document.getElementById('assignment-due-date').value,
                priority: document.getElementById('assignment-priority').value,
                description: document.getElementById('assignment-description').value,
                status: 'not-started',
                progress: 0,
                reminders: Array.from(remindersList.children).map(item => parseInt(item.getAttribute('data-days')))
            };
            
            saveAssignment(newAssignment);
            form.reset();
            remindersList.innerHTML = '';
            document.getElementById('assignment-modal').classList.remove('active');
            
            renderAssignmentList();
            renderUpcomingAssignments();
        };
    };
}

function deleteAssignment(id) {
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    
    const assignments = JSON.parse(localStorage.getItem('assignments')) || [];
    const updatedAssignments = assignments.filter(a => a.id !== id);
    
    localStorage.setItem('assignments', JSON.stringify(updatedAssignments));
    
    // Refresh the UI
    renderAssignmentList();
    renderUpcomingAssignments();
    
    // Clear details view
    document.getElementById('assignment-details').innerHTML = `
        <div class="empty-state">
            <i class="fas fa-clipboard-list"></i>
            <p>Select an assignment to view details</p>
        </div>
    `;
}

function initAssignmentFilters() {
    const subjectFilter = document.getElementById('subject-filter');
    const priorityFilter = document.getElementById('priority-filter');
    const statusFilter = document.getElementById('status-filter');
    
    // Add event listeners to all filters
    [subjectFilter, priorityFilter, statusFilter].forEach(filter => {
        filter.addEventListener('change', function() {
            filterAssignments();
        });
    });
}

function filterAssignments() {
    const subject = document.getElementById('subject-filter').value;
    const priority = document.getElementById('priority-filter').value;
    const status = document.getElementById('status-filter').value;
    
    const assignments = JSON.parse(localStorage.getItem('assignments')) || [];
    
    const filtered = assignments.filter(assignment => {
        return (subject === 'all' || assignment.subject === subject) &&
               (priority === 'all' || assignment.priority === priority) &&
               (status === 'all' || assignment.status === status);
    });
    
    renderFilteredAssignments(filtered);
}

function renderFilteredAssignments(filteredAssignments) {
    const assignmentList = document.getElementById('assignment-list');
    
    // Clear existing items
    assignmentList.innerHTML = '';
    
    if (filteredAssignments.length === 0) {
        assignmentList.innerHTML = '<div class="empty-state"><i class="fas fa-clipboard-list"></i><p>No assignments match your filters</p></div>';
        return;
    }
    
    filteredAssignments.forEach(assignment => {
        const dueDate = new Date(assignment.dueDate);
        
        const assignmentItem = document.createElement('div');
        assignmentItem.className = 'assignment-item';
        assignmentItem.setAttribute('data-id', assignment.id);
        assignmentItem.innerHTML = `
            <div class="assignment-item-header">
                <div class="assignment-title">${assignment.title}</div>
                <div class="assignment-due-date">Due: ${dueDate.toLocaleDateString()}</div>
                <div class="assignment-priority priority-${assignment.priority}">${assignment.priority.toUpperCase()}</div>
            </div>
            <div class="assignment-subject">${formatSubject(assignment.subject)}</div>
            <div class="assignment-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${assignment.progress}%"></div>
                </div>
            </div>
        `;
        
        assignmentList.appendChild(assignmentItem);
        
        // Add click event to show details
        assignmentItem.addEventListener('click', function() {
            showAssignmentDetails(assignment);
        });
    });
}