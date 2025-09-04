const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const openModal = $(".add-btn");
const modalClose = $(".modal-close");
const btnCancel = $(".btn-cancel");
const addTaskModal = $("#addTaskModal");
const todoAppForm = $(".todo-app-form");

const todoTasks = JSON.parse(localStorage.getItem("todo Tasks")) ?? [];

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
    // lay toan bo du lieu trong form
    const newTask = Object.fromEntries(new FormData(todoAppForm));
    newTask.isCompleted == false;

    // them todo tasks
    todoTasks.unshift(newTask);
    // luu todo task vao localStorage
    localStorage.setItem('todo Tasks', JSON.stringify(todoTasks))
    // reset form
    todoAppForm.reset();
    closeModal();
    renderTasks(todoTasks);
}

function renderTasks(tasks){
    const todoList = $("#todoList");
    if(!tasks.length){
        todoList.innerHTML = `<p>Chua co cong viec nao</p>`;
        return;
    }
    const html = todoTasks.map( task => {
        return `
        <div class="task-card ${task.color} ${task.isCompleted ? 'completed' : ''}">
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
                                ${task.isCompleted ? 'Mark as Active' : 'Mark as Completed'}
                            </div>
                            <div class="dropdown-item delete">
                                <i class="fa-solid fa-trash fa-icon"></i>
                                Delete
                            </div>
                        </div>
                    </button>
                </div>
                <p class="task-description">${task.description}</p>
                <div class="task-time">${task.start_Time} - ${task.end_Time}</div>
            </div>
        `
    }).join("")
    
    todoList.innerHTML = html;
}

renderTasks(todoTasks);