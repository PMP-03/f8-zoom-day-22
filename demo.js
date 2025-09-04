const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const openModal = $(".add-btn");
const modalClose = $(".modal-close");
const btnCancel = $(".btn-cancel");
const addTaskModal = $("#addTaskModal");
const todoAppForm = $(".todo-app-form");
const taskGrid = $(".task-grid");
const addTaskCard = $(".task-card");

console.log(taskGrid)


// const isCompleted = $("#taskTitle");
const todoTasks = [];


openModal.onclick = function(event){
    addTaskModal.className = "modal-overlay show";
    setTimeout(() => {
        const todoInput = $(".form-input");
        todoInput.focus();
    }, 100);
}
function closeModal (event){
    addTaskModal.className = "modal-overlay"
}
modalClose.onclick = closeModal;
btnCancel.onclick = closeModal;


todoAppForm.onsubmit = function(event){
    event.preventDefault();

    const taskTitle = $("#taskTitle").value.trim();
    const taskDescription = $("#taskDescription").value.trim();
    const taskCategory = $("#taskCategory").value;
    const taskPriority = $("#taskPriority").value;
    const startTime = $("#startTime").value;
    const endTime = $("#endTime").value;
    const taskDate = $("#taskDate").value;
    const taskColor = $("#taskColor").value;

    const newTask = {
        title: taskTitle,
        description: taskDescription,
        category: taskCategory,
        priority: taskPriority,
        startTime: startTime,
        endTime: endTime,
        DueDate: taskDate,
        cardColor: taskColor,
        cardColor: taskColor,
        isCompleted: false
    };

    todoTasks.unshift(newTask);
    console.log('Task data:', todoTasks);

    todoAppForm.reset()
    addTaskModal.className = "modal-overlay"
    renderTasks()

    // console.log(taskTitle);
    // console.log(taskDescription);
    // console.log(taskCategory);
    // console.log(taskPriority);
    // console.log(startTime);
    // console.log(endTime);
    // console.log(taskDate);
    // console.log(taskColor);
}

function renderTasks(){
    const html = todoTasks.map( task => {
        return `
        <div class="task-card ${task.cardColor} ${task.isCompleted}">
                <div class="task-header">
                    <h3 class="task-title">${task.title}</h3>
                    <button class="task-menu">
                        <i class="fa-solid fa-ellipsis fa-icon"></i>
                        <div class="dropdown-menu">
                            <div class="dropdown-item">
                                <i class="fa-solid fa-pen-to-square fa-icon"></i>
                                Edit
                            </div>
                            <div class="dropdown-item complete">
                                <i class="fa-solid fa-check fa-icon"></i>
                                Mark as Active
                            </div>
                            <div class="dropdown-item delete">
                                <i class="fa-solid fa-trash fa-icon"></i>
                                Delete
                            </div>
                        </div>
                    </button>
                </div>
                <p class="task-description">${task.description}</p>
                <div class="task-time">${task.startTime} AM - ${task.endTime} PM</div>
            </div>
        `
    }).join("")
    taskGrid.innerHTML = html;
}