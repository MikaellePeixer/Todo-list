// Seleciona elementos do DOM
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const tasksCounter = document.getElementById('tasks-counter');
const filterButtons = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed');

// Array para armazenar as tarefas
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Função para salvar tarefas no localStorage
const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Função para criar elemento de tarefa
const createTaskElement = (task) => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.setAttribute('data-id', task.id);

    li.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
        <span class="task-text">${task.text}</span>
        <button class="delete-btn">
            <i class="fas fa-trash"></i>
        </button>
    `;

    // Adiciona event listeners
    const checkbox = li.querySelector('.task-checkbox');
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    return li;
};

// Função para renderizar tarefas
const renderTasks = (filteredTasks = tasks) => {
    taskList.innerHTML = '';
    filteredTasks.forEach(task => {
        taskList.appendChild(createTaskElement(task));
    });
    updateTasksCounter();
};

// Função para adicionar nova tarefa
const addTask = (text) => {
    const task = {
        id: Date.now(),
        text,
        completed: false
    };
    
    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = '';
};

// Função para alternar estado da tarefa
const toggleTask = (id) => {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
};

// Função para deletar tarefa
const deleteTask = (id) => {
    const li = document.querySelector(`[data-id="${id}"]`);
    li.classList.add('fade-out');
    
    setTimeout(() => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }, 300);
};

// Função para atualizar contador de tarefas
const updateTasksCounter = () => {
    const pendingTasks = tasks.filter(task => !task.completed).length;
    tasksCounter.textContent = `${pendingTasks} tarefa${pendingTasks !== 1 ? 's' : ''} restante${pendingTasks !== 1 ? 's' : ''}`;
};

// Event Listeners
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (text) {
        addTask(text);
    }
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove classe active de todos os botões
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');
        let filteredTasks = tasks;

        switch (filter) {
            case 'pending':
                filteredTasks = tasks.filter(task => !task.completed);
                break;
            case 'completed':
                filteredTasks = tasks.filter(task => task.completed);
                break;
        }

        renderTasks(filteredTasks);
    });
});

clearCompletedBtn.addEventListener('click', () => {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
});

// Inicialização
renderTasks();