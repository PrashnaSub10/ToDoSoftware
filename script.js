// Select elements
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");
const taskList = document.getElementById("taskList");

// Set the minimum date for scheduling
const today = new Date().toISOString().split("T")[0];
taskDate.setAttribute("min", today);

// Tasks array to store tasks
let tasks = [];

// Load tasks from cookies
function loadTasksFromCookies() {
  const cookie = document.cookie.split("; ").find(row => row.startsWith("tasks="));
  if (cookie) {
    const tasksData = cookie.split("=")[1];
    tasks = JSON.parse(decodeURIComponent(tasksData));
    sortTasks(); // Sort tasks after loading
    renderTasks();
  }
}

// Save tasks to cookies
function saveTasksToCookies() {
  const tasksData = encodeURIComponent(JSON.stringify(tasks));
  document.cookie = `tasks=${tasksData}; path=/; max-age=31536000`; // 1 year expiration
}

// Add task
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskText = taskInput.value.trim();
  const dueDate = taskDate.value;
  const dueTime = taskTime.value;

  if (taskText && dueDate && dueTime) {
    const task = {
      id: Date.now(),
      text: taskText,
      date: dueDate,
      time: dueTime,
      completed: false,
    };

    tasks.push(task);
    sortTasks(); // Sort tasks after adding a new one
    renderTasks();
    saveTasksToCookies();
    taskForm.reset();
  }
});

// Sort tasks by Date and Time
function sortTasks() {
  tasks.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA - dateB; // Sort in ascending order (earlier tasks first)
  });
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const listItem = document.createElement("li");
    listItem.className = `list-group-item ${task.completed ? "completed" : ""}`;
    listItem.innerHTML = `
      <div>
        <strong>${task.text}</strong>
        <small class="text-muted"> | Due: ${task.date} at ${task.time}</small>
      </div>
      <div>
        <button class="btn btn-sm btn-primary" onclick="toggleComplete(${task.id})">Complete</button>
        <button class="btn btn-sm btn-warning" onclick="editTask(${task.id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;
    taskList.appendChild(listItem);
  });
}

// Toggle completion
function toggleComplete(taskId) {
  tasks = tasks.map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );
  sortTasks(); // Re-sort tasks after completion toggle
  renderTasks();
  saveTasksToCookies();
}

// Edit task
function editTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    taskInput.value = task.text;
    taskDate.value = task.date;
    taskTime.value = task.time;
    deleteTask(taskId);
  }
}

// Delete task
function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  sortTasks(); // Re-sort tasks after deletion
  renderTasks();
  saveTasksToCookies();
}

// Function to display heart and firework animation
function showHeartAnimation() {
  // Create heart animation container
  const animationContainer = document.createElement('div');
  animationContainer.className = 'heart-animation-container';

  // Add SVG and firework elements
  animationContainer.innerHTML = `
    <svg class="heart-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path
        class="heart-path"
        d="M50 30
           C20 0, 0 30, 50 90
           C100 30, 80 0, 50 30"
        fill="none"
        stroke="#ff1493"
        stroke-width="4"
      />
    </svg>
    <div class="firework"></div>
  `;

  // Append to body
  document.body.appendChild(animationContainer);

  // Remove the animation after it completes
  setTimeout(() => {
    animationContainer.remove();
  }, 2500); // Total animation time: 1.5s (heart) + 0.8s (firework)
}

// Trigger animation only on task completion
function toggleComplete(taskId) {
  // Update the task completion status
  tasks = tasks.map(task =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );

  // Sort, render, and save tasks
  sortTasks();
  renderTasks();
  saveTasksToCookies();

  // Trigger heart animation only if task is now marked as completed
  const completedTask = tasks.find(task => task.id === taskId);
  if (completedTask && completedTask.completed) {
    showHeartAnimation();
  }
}

// Initialize app with loadTasksFromCookies()
loadTasksFromCookies();
