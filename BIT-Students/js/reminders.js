// Reminder and Notification System
document.addEventListener('DOMContentLoaded', function() {
    initNotificationCenter();
});

function initNotificationCenter() {
    const notificationCenter = document.querySelector('.notification-center');
    
    // Click anywhere outside to hide notifications
    document.addEventListener('click', function(event) {
        if (!notificationCenter.contains(event.target) {
            notificationCenter.classList.remove('active');
        }
    });
    
    // Check for reminders on load
    checkReminders();
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
        
        // Create urgent notification if due today or overdue
        if (daysUntilDue === 0) {
            createNotification({
                title: 'Assignment Due Today',
                message: `${assignment.title} is due today!`,
                time: new Date()
            });
        } else if (daysUntilDue < 0) {
            createNotification({
                title: 'Assignment Overdue',
                message: `${assignment.title} is overdue by ${Math.abs(daysUntilDue)} day${daysUntilDue !== -1 ? 's' : ''}`,
                time: new Date()
            });
        }
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