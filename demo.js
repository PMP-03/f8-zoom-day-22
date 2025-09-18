const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const openModal = $(".add-btn");
const closeModal = $(".modal-close");
const cancelModal = $(".btn-cancel");
const addTaskModal = $("#addTaskModal");
const todoAppForm = $(".todo-app-form");
const todoList = $("#todoList");
const formTitle = addTaskModal.querySelector(".modal-title");
const btnPrimary = addTaskModal.querySelector(".btn-primary");
const tabList = $(".tab-list");
const searchInput = $(".search-input");
let editIndex = null;

const todoTasks = JSON.parse(localStorage.getItem("Todo Tasks")) ?? [];

searchInput.oninput = function(event){
    const searchValue = event.target.value.trim();

    const filteredTasks = todoTasks.filter( task =>{
        return task.title.includes(searchValue) || task.description.includes(searchValue);
    } )

    if(filteredTasks.length === 0){
        todoList.innerHTML = `<p>Không tìm thấy công việc nào.</p>`;
        return;
    };

    renderTasks(filteredTasks)
}

tabList.onclick = function (event){
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

        renderTasks(todoTasks)
    }
    if(activeTasks){
        activeTasks.classList.add("active");

        const activeTasksFilter = todoTasks.filter( task => {
             return !task.isCompleted;
        });

        renderTasks(activeTasksFilter)
    }
    if(completeTask){
        completeTask.classList.add("active");
        
        const completeTaskFilter = todoTasks.filter( task => {
             return task.isCompleted;
        });

        renderTasks(completeTaskFilter)
    }

}

openModal.onclick = openForm;
closeModal.onclick = closeForm;
cancelModal.onclick = closeForm;

function openForm(){
    addTaskModal.className = "modal-overlay show";

    setTimeout(() => {
        const todoInput = $(".form-input");
        todoInput.focus();
    }, 100)
    
}
function closeForm(){
    addTaskModal.className = "modal-overlay";

    if(formTitle){
        formTitle.textContent = formTitle.dataset.origin || formTitle.textContent;
        delete formTitle.dataset.origin;
    }
    if(btnPrimary){
        btnPrimary.textContent = btnPrimary.dataset.origin || btnPrimary.textContent;
        delete btnPrimary.dataset.origin;
    }
    // reset form ve mac dinh
    setTimeout( () => {
        addTaskModal.querySelector(".modal").scrollTop = 0;
        todoAppForm.reset();
    }, 500)
    
}

todoList.onclick = function(event){
    const isEditBtn = event.target.closest('.edit-btn');
    const deleteBtn = event.target.closest('.delete-btn');
    const completeBtn = event.target.closest('.complete-btn');

    if(isEditBtn){
        // lay vi tri index tu dataset
        const tasksIndex = isEditBtn.dataset.index;
        // lay key, value cua todoTasks tai tasksIndex
        const task = todoTasks[tasksIndex];

        editIndex = tasksIndex;

        // lay key value
        for (const key in task) {
            const value = task[key];
            const input = $(`[name="${key}"]`)
            
            if(input){
                input.value = value
            }
            
        }
        // thay doi title
        if(formTitle){
            formTitle.dataset.origin = formTitle.textContent;
            formTitle.textContent = "Edit Task";
        }
        if(btnPrimary){
            btnPrimary.dataset.origin = btnPrimary.textContent;
            btnPrimary.textContent = "Save Task";
        }
        

        // console.log(todoTasks[tasksIndex])

        openForm();
    }
    if(deleteBtn){
         // lay vi tri index tu dataset
        const tasksIndex = deleteBtn.dataset.index;
        // lay key, value cua todoTasks tai tasksIndex
        const task = todoTasks[tasksIndex];

        if(confirm(`Ban chac chan muon xoa cong viec "${task.title}"?`)){
            todoTasks.slice(tasksIndex, 1);
            saveTodoTasks();
            renderTasks(todoTasks);
        }

    }
    if(completeBtn){
        // lay vi tri index tu dataset
        const tasksIndex = completeBtn.dataset.index;
        // lay key, value cua todoTasks tai tasksIndex
        const task = todoTasks[tasksIndex];

        task.isCompleted = !task.isCompleted;
        saveTodoTasks();
        renderTasks(todoTasks);
    }


}

todoAppForm.onsubmit = function (event){
    event.preventDefault();

    // lay toan bo du lieu trong form
    const formData = Object.fromEntries(new FormData(todoAppForm))
    formData.isCompleted = false;
    // them todo tasks
    if(editIndex !== null){
        todoTasks[editIndex] = formData;
        editIndex = null;
    }else{
        todoTasks.unshift(formData);
    };


    saveTodoTasks();
    todoAppForm.reset();
    closeForm();
    renderTasks(todoTasks);
}

function saveTodoTasks(){
    // luu todo task vao localStorage
    localStorage.setItem("Todo Tasks", JSON.stringify(todoTasks));
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
    }).join("");
    
    todoList.innerHTML = html;
}

renderTasks(todoTasks);

function escapeHTML(html){
    const div = document.createElement("div");
    div.textContent = html;
    return div.innerHTML;
}
