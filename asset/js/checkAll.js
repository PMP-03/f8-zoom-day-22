const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const checkAll = $("#checkAll")
const checkRows = $$(".check-row")

// check all
checkAll.addEventListener("change", function(){
    checkRows.forEach(row => {
        row.checked = checkAll.checked
    })
})

// kiem tra tat ca duoc check chua 
checkRows.forEach(row => {
    row.addEventListener("change", function(){
        const total = checkRows.length;

        const checkedCount = Array.from(checkRows).filter(c => c.checked).length;
        // kiem tra tat ca duoc check
        if(total === checkedCount){
            checkAll.checked = true;
            checkAll.indeterminate = false;
        }
        // kiem tra checkbox duoc check nhung khong phai tat ca 
        else if(checkedCount > 0 && checkedCount < total){
            checkAll.indeterminate = true;
        }
        else{
            checkAll.checked = false
            checkAll.indeterminate = false;
        }
        
    })
})