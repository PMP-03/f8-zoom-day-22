const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const openModal = $(".add-btn");
const modalClose = $(".modal-close");
const btnCancel = $(".btn-cancel");
const addTaskModal = $("#addTaskModal");
const todoAppForm = $(".todo-app-form");
const todoList = $("#todoList");
const searchInput = $(".search-input");
const tabList = $(".tab-list");
const btnPrimary = addTaskModal.querySelector(".btn-primary") ;
const formTitle = addTaskModal.querySelector(".modal-title") ;
let editIndex = null;

const todoTasks = JSON.parse(localStorage.getItem("TodoTasks")) ?? [];

tabList.onclick = function(event){
    const allTasks = event.target.closest('.all-tasks');
    const activeTasks = event.target.closest('.active-tasks');
    const completeTask = event.target.closest('.completed-btn');

    const btnTabs = tabList.querySelectorAll('.tab-button');
    // Xoa class active
    btnTabs.forEach( tab => {
        tab.classList.remove("active");
    })

    if(allTasks){
        allTasks.classList.add("active");
        renderTasks(todoTasks);
    }
    if(activeTasks){
        activeTasks.classList.add("active");
        const activeTasksFilter = todoTasks.filter( task => {
            return !task.isCompleted;
        })
        renderTasks(activeTasksFilter);
    }
    if(completeTask){
        completeTask.classList.add("active");
        const completeTaskFilter = todoTasks.filter( task => {
            return task.isCompleted;
        })
        renderTasks(completeTaskFilter);
    }

    return;
}

// loại bỏ dấu ở chữ
function removeVietnameseTones(str) {
    return str
        .normalize("NFD")                       // tách dấu ra khỏi ký tự gốc
        .replace(/[\u0300-\u036f]/g, "")       // xóa các dấu
        .replace(/đ/g, "d").replace(/Đ/g, "D") // thay đ -> d
        .toLowerCase();
}

// searchInput
searchInput.oninput = function (event){
    const searchValue = removeVietnameseTones(event.target.value.trim());

    if (!searchValue) {
        renderTasks(todoTasks); 
        return;
    }

    const filteredTasks = todoTasks.filter( task => {
        const title = removeVietnameseTones(task.title);
        const description = removeVietnameseTones(task.description);

        return (title.includes(searchValue) || description.includes(searchValue));
    });

    if(filteredTasks.length === 0){
        todoList.innerHTML = `<p>Không tìm thấy công việc nào.</p>`;
        return;
    };
    renderTasks(filteredTasks);
};

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

        if(formTitle){
            setTimeout(() => {
                formTitle.textContent = formTitle.dataset.original || formTitle.textContent;
                delete formTitle.dataset.original;
            }, 500);
        }
    
        if(btnPrimary){
            setTimeout(() => {
                 btnPrimary.textContent = btnPrimary.dataset.original || formTitle.textContent;
            delete  btnPrimary.dataset.original;
            }, 500);
        }
        // Xoa bo editIndex
        editIndex = null;

        setTimeout(() => {
            addTaskModal.querySelector(".modal").scrollTop = 0;
            // reset form ve mac dinh  
            todoAppForm.reset();
        }, 500);
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

        if(btnPrimary){
            btnPrimary.dataset.original = btnPrimary.textContent;
            btnPrimary.textContent = "Save Tasks"
        }
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
    formData.isCompleted = false;

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
    renderTasks(todoTasks);
}

function saveTodoTasks (){
    // luu todo task vao localStorage
    localStorage.setItem('TodoTasks', JSON.stringify(todoTasks));
}

function renderTasks(tasks){
    // kiem tra tasks co ton tai khong
    if(!tasks.length){
        todoList.innerHTML = `<p>Chưa có công việc nào.</p>`;
        return;
    }
    const html = tasks.map( (task, index) => {
        return `
        <div class="task-card ${escapeHTML(task.color)} ${task.isCompleted ? 'completed' : ''}">
                <div class="task-header">
                    <h3 class="task-title">${escapeHTML(task.title)}</h3>
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
                <p class="task-description">${escapeHTML(task.description)}</p>
                <div class="task-time">${escapeHTML(task.start_Time)} - ${escapeHTML(task.end_Time)}</div>
            </div>
        `
    }).join("")
    
    todoList.innerHTML = html;
}

renderTasks(todoTasks);

function escapeHTML(html){
    const div = document.createElement("div");
    div.textContent = html;
    return div.innerHTML;
}
