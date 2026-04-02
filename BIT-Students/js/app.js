// Main Application Script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavigation();
    initDarkMode();
    initModals();
    initDashboard();
    
    // Load sample data for demonstration
    loadSampleData();
    
    // Check for notifications every minute
    setInterval(checkReminders, 60000);
});

function initNavigation() {
    const navItems = document.querySelectorAll('.sidebar nav li');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(navItem => navItem.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Hide all content sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show the corresponding content section
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

function initDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const darkModeStylesheet = document.getElementById('dark-mode');
    
    // Check for saved user preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        darkModeStylesheet.disabled = false;
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }
    
    darkModeToggle.addEventListener('click', function() {
        if (darkModeStylesheet.disabled) {
            darkModeStylesheet.disabled = false;
            localStorage.setItem('darkMode', 'enabled');
            this.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        } else {
            darkModeStylesheet.disabled = true;
            localStorage.setItem('darkMode', 'disabled');
            this.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
        }
    });
}

function initModals() {
    const modal = document.getElementById('assignment-modal');
    const openModalBtn = document.getElementById('new-assignment-btn');
    const closeModalBtn = document.querySelector('.close-modal');
    
    openModalBtn.addEventListener('click', function() {
        modal.classList.add('active');
    });
    
    closeModalBtn.addEventListener('click', function() {
        modal.classList.remove('active');
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Quick add assignment from dashboard
    document.getElementById('quick-add-assignment').addEventListener('click', function() {
        modal.classList.add('active');
    });
}

function initDashboard() {
    // Initialize progress chart
    const ctx = document.getElementById('progress-chart').getContext('2d');
    const progressChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'In Progress', 'Not Started'],
            datasets: [{
                data: [25, 15, 10],
                backgroundColor: [
                    '#2ecc71',
                    '#f39c12',
                    '#e74c3c'
                ],
                borderWidth: 0
            }]
        },
        options: {
            cutoutPercentage: 70,
            legend: {
                position: 'bottom'
            }
        }
    });
    
    // Quick start pomodoro
    document.getElementById('quick-start-pomodoro').addEventListener('click', function() {
        // Switch to pomodoro tab and start timer
        document.querySelector('.sidebar nav li[data-section="pomodoro"]').click();
        document.getElementById('start-timer').click();
    });
}

function loadSampleData() {
    // Sample assignments
    const assignments = [
        {
            id: 1,
            title: 'Math Homework - Chapter 5',
            subject: 'math',
            dueDate: '2023-06-15T23:59',
            priority: 'high',
            description: 'Complete all problems on page 125-128',
            status: 'in-progress',
            progress: 60,
            reminders: [1, 3]
        },
        {
            id: 2,
            title: 'Science Lab Report',
            subject: 'science',
            dueDate: '2023-06-18T23:59',
            priority: 'medium',
            description: 'Write conclusion for last week\'s experiment',
            status: 'not-started',
            progress: 0,
            reminders: [3, 7]
        },
        {
            id: 3,
            title: 'History Essay',
            subject: 'history',
            dueDate: '2023-06-20T23:59',
            priority: 'high',
            description: '5-page essay on Industrial Revolution',
            status: 'not-started',
            progress: 10,
            reminders: [7]
        },
        {
            id: 4,
            title: 'English Reading',
            subject: 'english',
            dueDate: '2023-06-12T23:59',
            priority: 'low',
            description: 'Read chapters 3-5 of To Kill a Mockingbird',
            status: 'completed',
            progress: 100,
            reminders: []
        }
    ];
    
    // Save to localStorage
    localStorage.setItem('assignments', JSON.stringify(assignments));
    
    // Load into UI
    renderUpcomingAssignments();
}

function renderUpcomingAssignments() {
    const assignments = JSON.parse(localStorage.getItem('assignments')) || [];
    const upcomingList = document.getElementById('upcoming-list');
    
    // Clear existing items
    upcomingList.innerHTML = '';
    
    // Sort by due date (soonest first)
    const sortedAssignments = [...assignments].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    // Display top 5 upcoming
    const upcomingToShow = sortedAssignments.slice(0, 5);
    
    if (upcomingToShow.length === 0) {
        upcomingList.innerHTML = '<li>No upcoming assignments</li>';
        return;
    }
    
    upcomingToShow.forEach(assignment => {
        const dueDate = new Date(assignment.dueDate);
        const daysUntilDue = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
        
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="assignment-name">${assignment.title}</span>
            <span class="due-date">Due in ${daysUntilDue} days</span>
            <span class="priority-${assignment.priority}">${assignment.priority.toUpperCase()}</span>
        `;
        
        upcomingList.appendChild(li);
    });
}

function checkReminders() {
    const assignments = JSON.parse(localStorage.getItem('assignments')) || [];
    const now = new Date();
    
    assignments.forEach(assignment => {
        const dueDate = new Date(assignment.dueDate);
        const timeUntilDue = dueDate - now;
        const daysUntilDue = Math.ceil(timeUntilDue / (1000 * 60 * 60 * 24));
        
        // Check if any reminder matches the days until due
        assignment.reminders.forEach(reminderDays => {
            if (daysUntilDue === reminderDays) {
                createNotification({
                    title: 'Assignment Reminder',
                    message: `${assignment.title} is due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`,
                    time: new Date()
                });
            }
        });
    });
}

function createNotification(notification) {
    const notificationList = document.getElementById('notification-list');
    const emptyState = notificationList.querySelector('.empty-notifications');
    
    // Remove empty state if it exists
    if (emptyState) {
        emptyState.remove();
    }
    
    const notificationItem = document.createElement('div');
    notificationItem.className = 'notification-item fade-in';
    notificationItem.innerHTML = `
        <div class="notification-title">${notification.title}</div>
        <div class="notification-message">${notification.message}</div>
        <div class="notification-time">${formatTime(notification.time)}</div>
    `;
    
    // Add to top of list
    notificationList.insertBefore(notificationItem, notificationList.firstChild);
    
    // Update notification count
    updateNotificationCount();
    
    // Show notification center if hidden
    document.querySelector('.notification-center').classList.add('active');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        notificationItem.classList.add('fade-out');
        setTimeout(() => {
            notificationItem.remove();
            updateNotificationCount();
            
            // Hide notification center if no more notifications
            if (notificationList.children.length === 0) {
                document.querySelector('.notification-center').classList.remove('active');
                notificationList.innerHTML = `
                    <div class="empty-notifications">
                        <i class="fas fa-bell-slash"></i>
                        <p>No new notifications</p>
                    </div>
                `;
            }
        }, 300);
    }, 5000);
}

function updateNotificationCount() {
    const notificationList = document.getElementById('notification-list');
    const count = notificationList.querySelectorAll('.notification-item').length;
    document.getElementById('notification-count').textContent = count;
}

function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}