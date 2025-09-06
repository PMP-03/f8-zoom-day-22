const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const openModal = $(".add-btn");
const modalClose = $(".modal-close");
const btnCancel = $(".btn-cancel");
const addTaskModal = $("#addTaskModal");
const todoAppForm = $(".todo-app-form");
const todoList = $("#todoList");
const searchInput = $(".search-input");
const btnPrimary = addTaskModal.querySelector(".btn-primary") ;
const formTitle = addTaskModal.querySelector(".modal-title") ;
let editIndex = null;

// onchange
searchInput.oninput = function (event){
    console.log(event.target.value.trim())
}

const todoTasks = JSON.parse(localStorage.getItem("todo Tasks")) ?? [];

function openFormModal (){
    addTaskModal.className = "modal-overlay show";
    setTimeout(() => {
        const todoInput = $(".form-input");
        todoInput.focus();
    }, 100);
}
openModal.onclick = openFormModal;
function closeForm (){
    addTaskModal.className = "modal-overlay";

    const formTitle = addTaskModal.querySelector(".modal-title") ;
        if(formTitle){
            formTitle.textContent = formTitle.dataset.original || formTitle.textContent;
            delete formTitle.dataset.original;
        }
    
        if(btnPrimary){
            btnPrimary.textContent = btnPrimary.dataset.original || formTitle.textContent;
            delete  btnPrimary.dataset.original;
        }
        // Xoa bo editIndex
        editIndex = null;

        setTimeout(() => {
            addTaskModal.querySelector(".modal").scrollTop = 0;
        }, 1000);
        // reset form ve mac dinh
        // todoAppForm.reset();
}
modalClose.onclick = closeForm;
btnCancel.onclick = closeForm;

// lay cac nut trong dropdown-menu
todoList.onclick = (event) => {
    const isEditBtn = event.target.closest('.edit-btn');
    const deleteBtn = event.target.closest('.delete-btn');
    const completeBtn = event.target.closest('.complete-btn');
    if(isEditBtn){
        // lay data-index cua tu thuoc tich data-index
        const tasksIndex = isEditBtn.dataset.index;
        // lay key: value cua todoTasks
        const task = todoTasks[tasksIndex];

        editIndex = tasksIndex;
        console.log(editIndex)
        // lap key value
        for(const key in task){
            const value = task[key];
            const input = $(`[name="${key}"]`)
            if(input){
                input.value = value;
            }
        }
        
        if(formTitle){
            formTitle.dataset.original = formTitle.textContent;
            formTitle.textContent = "Edit Tasks"
        }

        // const btnPrimary = addTaskModal.querySelector(".btn-primary") ;
        if(btnPrimary){
            btnPrimary.dataset.original = btnPrimary.textContent;
            btnPrimary.textContent = "Save Tasks"
        }
        // console.log(formTitle)
        openFormModal();
    }
    if(deleteBtn){
        // lay data-index cua tu thuoc tich data-index
        const tasksIndex = deleteBtn.dataset.index;
        // lay key: value cua todoTasks
        const task = todoTasks[tasksIndex];
        if(confirm(`Ban chac chan muon xoa cong viec "${task.title}"?`)){
            todoTasks.splice(tasksIndex, 1);
            saveTodoTasks();
            renderTasks(todoTasks);
        }
    }
    if(completeBtn){
        const tasksIndex = completeBtn.dataset.index;
        const task = todoTasks[tasksIndex];

        task.isCompleted = !task.isCompleted;
        saveTodoTasks();
        renderTasks(todoTasks);
    }
}

todoAppForm.onsubmit = function(event){
    event.preventDefault();
    // lay toan bo du lieu trong form
    const formData = Object.fromEntries(new FormData(todoAppForm));
    formData.isCompleted == false;

    // neu co editIndex thuc hien logic sua
    if(editIndex){
        todoTasks[editIndex] = formData;
    }else{
        // them todo tasks
        todoTasks.unshift(formData);
       
    }
    saveTodoTasks()
    // reset form
    todoAppForm.reset();
    closeForm();
    renderTasks();
}

function saveTodoTasks (){
    // luu todo task vao localStorage
    localStorage.setItem('todo Tasks', JSON.stringify(todoTasks));
}

function renderTasks(){
    // kiem tra tasks co ton tai khong
    if(!todoTasks.length){
        todoList.innerHTML = `<p>Chua co cong viec nao</p>`;
        return;
    }
    const html = todoTasks.map( (task, index) => {
        return `
        <div class="task-card ${task.color} ${task.isCompleted ? 'completed' : ''}">
                <div class="task-header">
                    <h3 class="task-title">${task.title}</h3>
                    <button class="task-menu">
                        <i class="fa-solid fa-ellipsis fa-icon"></i>
                        <div class="dropdown-menu">
                            <div class="dropdown-item edit-btn" data-index = "${index}">
                                <i class="fa-solid fa-pen-to-square fa-icon"></i>
                                Edit
                            </div>
                            <div class="dropdown-item complete complete-btn" data-index = "${index}">
                                <i class="fa-solid fa-check fa-icon"></i>
                                ${task.isCompleted ? 'Mark as Active' : 'Mark as Completed'}
                            </div>
                            <div class="dropdown-item delete delete-btn" data-index = "${index}">
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

renderTasks();

// const editBtns = $$(".edit-btn");
// console.log(editBtns);


