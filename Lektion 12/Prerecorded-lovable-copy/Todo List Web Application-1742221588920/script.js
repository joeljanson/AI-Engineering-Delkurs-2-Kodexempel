// script.js

// --- Variables ---
let tasks = []; // Array to store task objects
let currentFilter = 'all'; // Current filter status ('all', 'active', 'completed')

// --- Functions ---

// Function to generate a unique Task ID (example using timestamp)
function generateTaskId() {
    return Date.now().toString();
}

// Function to load tasks from local storage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    } else {
        tasks = []; // Initialize tasks to an empty array if no tasks are in localStorage
    }
}

// Function to save tasks to local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to render the task list based on current tasks array and filter
function renderTaskList() {
    const tasksUl = document.getElementById('tasks-ul');
    tasksUl.innerHTML = ''; // Clear the content

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true; // Default to all
    });

    filteredTasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.classList.add('task-item');
        if (task.completed) {
            listItem.classList.add('completed');
        }
        listItem.dataset.taskId = task.id;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('task-checkbox');
        checkbox.checked = task.completed;
        listItem.appendChild(checkbox);

        const taskTextSpan = document.createElement('span');
        taskTextSpan.classList.add('task-text');
        taskTextSpan.contentEditable = 'true';
        taskTextSpan.textContent = task.text;
        listItem.appendChild(taskTextSpan);

        const prioritySpan = document.createElement('span');
        prioritySpan.classList.add('task-priority');
        prioritySpan.classList.add(task.priority);
        prioritySpan.textContent = `Priority: ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`;
        listItem.appendChild(prioritySpan);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = 'Delete';
        listItem.appendChild(deleteButton);

        tasksUl.appendChild(listItem);
    });
}

// Function to add a new task
function addTask() {
    const taskInput = document.getElementById('task-input');
    const prioritySelect = document.getElementById('priority-select');
    const taskDescription = taskInput.value.trim();
    const taskPriority = prioritySelect.value;

    if (taskDescription !== '') {
        const newTask = {
            id: generateTaskId(),
            text: taskDescription,
            completed: false,
            priority: taskPriority
        };
        tasks.push(newTask);
        saveTasks();
        renderTaskList();
        taskInput.value = ''; // Clear the input field
    }
}

// Function to toggle task completion status
function toggleComplete(taskId) {
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            task.completed = !task.completed;
        }
        return task;
    });
    saveTasks();
    renderTaskList();
}

// Function to delete a task
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTaskList();
}

// Function to edit task text
function editTask(taskId, newText) {
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            task.text = newText;
        }
        return task;
    });
    saveTasks();
    renderTaskList();
}

// Function to filter tasks based on status (all, active, completed)
function filterTasks(filterType) {
    currentFilter = filterType;

    // Update active filter button
    document.querySelectorAll('.filter-button').forEach(button => {
        button.classList.remove('active-filter');
    });
    document.getElementById(`filter-${filterType}`).classList.add('active-filter');

    renderTaskList();
}

// --- Event Listeners ---

// Event listener for "Add Task" button
document.getElementById('add-task-button').addEventListener('click', addTask);

// Event listeners for filter buttons
document.getElementById('filter-all').addEventListener('click', () => filterTasks('all'));
document.getElementById('filter-active').addEventListener('click', () => filterTasks('active'));
document.getElementById('filter-completed').addEventListener('click', () => filterTasks('completed'));

// Event listener for task list (using event delegation for dynamic elements)
document.getElementById('tasks-ul').addEventListener('change', function(event) {
    if (event.target.classList.contains('task-checkbox')) {
        // Handle checkbox change (toggle complete)
        toggleComplete(event.target.closest('.task-item').dataset.taskId);
    }
});

document.getElementById('tasks-ul').addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-button')) {
        // Handle delete button click
        deleteTask(event.target.closest('.task-item').dataset.taskId);
    }
});

document.getElementById('tasks-ul').addEventListener('blur', function(event) {
    if (event.target.classList.contains('task-text')) {
        // Handle task text edit on blur
        editTask(event.target.closest('.task-item').dataset.taskId, event.target.textContent);
    }
}, true); // Use capturing for blur event on contenteditable span


// --- Initialization ---
// Load tasks from local storage and render task list on page load
loadTasks();
renderTaskList();