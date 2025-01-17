let colorBtn = document.querySelectorAll(".filter_color");
let mainContainer = document.querySelector(".main_container");
let body = document.body;
let plusButton = document.querySelector(".fa-plus");
let deleteState = false;
let editState = false;
let lite_theme = true;
let modalState = false;
let crossButton = document.querySelector(".fa-times");
let uifn = new ShortUniqueId();
let all_task = document.querySelector(".all_task");






//Tool Tip Text
tippy('.filter_color', {
    content: "Click on color to filter the tasks",
    theme: 'light'
});

tippy(".all_task", {
    content: "Click to show all tasks",
    theme: 'light'
});

tippy(".fa-times", {
    content: "Click to deleteTasks",
    theme: "light",
});

tippy(".fa-plus", {
    content: "Click to add a task",
    theme: "light",
});
tippy(".fa-sun",{
    content: "Click to change themes",
})
tippy(".fa-trash",{
    content: "Click to Delete All Tasks",
})


let taskArr = [];

if (localStorage.getItem("allTask")) {
    taskArr = JSON.parse(localStorage.getItem("allTask"));
    // UI
    for (let i = 0; i < taskArr.length; i++) {
        let {
            id,
            color,
            task,
            theme
        } = taskArr[i];
        createTask(color, task, false, id);
    }
}


//Handle Themes
let main_container = document.querySelector(".main_container");
let toolbar = document.querySelector(".toolbar");
let theme_container = document.querySelector(".theme_container");
theme_container.addEventListener("click", () => {
    if (lite_theme == false) {
        theme_container.children[0].classList.remove("fa-moon");
        theme_container.children[0].classList.add("fa-sun");
        lite_theme = true;
        toolbar.style.backgroundColor = "#2d3436";
        main_container.style.backgroundColor = "#ecf0f1";
    } else {
        theme_container.children[0].classList.remove("fa-sun");
        theme_container.children[0].classList.add("fa-moon");
        lite_theme = false;
        toolbar.style.backgroundColor = "#ecf0f1";
        main_container.style.backgroundColor = "#2d3436";
    }

})


all_task.addEventListener("click", () => {
    let taskContainer = document.querySelectorAll(".task_container")
    taskContainer.forEach(item => {
        item.style.display = "block";
    })
})

for (let i = 0; i < colorBtn.length; i++) {
    colorBtn[i].addEventListener("click", function (e) {
        let color = colorBtn[i].classList[1];
        let taskContainer = document.querySelectorAll(".task_container")
        taskContainer.forEach(item => {
            if (item.children[0].classList[1] == color) {
                item.style.display = "block";
                // mainContainer.style.backgroundColor =color;
            } else {
                item.style.display = "none";
            }
        })
    })
}


//Delete all Task icon 

let delete_all_task_icon = document.querySelector(".fa-trash");

delete_all_task_icon.addEventListener("click", () => {
    let taskContainer = document.querySelectorAll(".task_container");
    if (modalState == false) {
        if (taskContainer.length == 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No Tasks to Delete',
            })
        } else {
            Swal.fire({
                title: 'This will delete all tasks',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete All!'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire(
                        'Deleted!',
                        `All Tasks Were deleted`,
                        'success'
                    )
                    // taskContainer.remove();
                    localStorage.clear();
                    taskContainer.forEach(item => {
                        item.remove();
                    })

                }
            })
        }
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please Close add Task Box First',
        })
    }



})



plusButton.addEventListener("click", createModal);
crossButton.addEventListener("click", setDeleteState);


function createModal() {
    let modalcontainer = document.querySelector(".modal_container");
    if (modalcontainer == null) {
        let modalcontainer = document.createElement("div");
        modalcontainer.setAttribute("class", "modal_container");
        modalcontainer.innerHTML = `<div class="input_container">
        <textarea class="modal_input" 
        placeholder="Enter Your text"></textarea>
        <div class="input_cont_contro"
">
    <i class="fas fa-check add_ticket"></i>
     <i class="fas fa-times close_modal"></i>
    </div>
    </div>
    <div class="modal_filter_container">
        <div class="filter red"></div>
        <div class="filter yellow"></div>
        <div class="filter green"></div>
        <div class="filter black"></div>
    </div>`;
        body.appendChild(modalcontainer);
        handleModal(modalcontainer);
        let textArea = modalcontainer.querySelector(".modal_input");
        textArea.value = "";
        modalState = true;
        console.log(modalState);
    }


}

function handleModal(modal_container) {
    let cColor = "black";
    let modalFilters = document.querySelectorAll(".modal_filter_container .filter");
    modalFilters[3].classList.add("border");
    for (let i = 0; i < modalFilters.length; i++) {
        modalFilters[i].addEventListener("click", function () {
            modalFilters.forEach((filter) => {
                filter.classList.remove("border");
            })
            modalFilters[i].classList.add("border")
            cColor = modalFilters[i].classList[1];
            console.log("current color of task", cColor);

        })
    }
    let textArea = document.querySelector(".modal_input");
    let add_tick_icon = document.querySelector(".add_ticket");
    let close_modal_icon = document.querySelector(".close_modal")

    close_modal_icon.addEventListener("click", () => {
        if (textArea.value != "") {
            Swal.fire({
                title: 'Do you want to save the changes?',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: `Save`,
                denyButtonText: `Don't save`,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    Swal.fire('Saved!', '', 'success')
                    modal_container.remove();
                    modalState = false;
                    createTask(cColor, textArea.value, true);
                } else if (result.isDenied) {
                    Swal.fire('Changes are not saved', '', 'info')
                    modal_container.remove();
                    modalState = false;
                }
            })
        } else {
            modal_container.remove();
            modalState = false;
        }
    })


    add_tick_icon.addEventListener("click", function (e) {
        if (textArea.value != "") {
            console.log("Task ", textArea.value, "color ", cColor);
            modal_container.remove();
            modalState = false;
            createTask(cColor, textArea.value, true);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Enter The Task Please!',
            })
        }
    })

}




function createTask(color, task, flag, id) {
    let taskContainer = document.createElement("div");
    taskContainer.setAttribute("class", "task_container");
    let uid = id || uifn();
    taskContainer.innerHTML = `<div class="task_filter ${color}"></div>
    <div class="task_desc_container">
        <h3 class="uid">#${uid}</h3>
        <div class="task_desc" contentEditable="false">${task}</div>
    </div>
</div ><div class ="lock" id ="edit_lock"><i class="fas fa-lock"></i></div>
`;

    mainContainer.appendChild(taskContainer);
    let taskFilter = taskContainer.querySelector(".task_filter");
    if (flag == true) {
        // console.log(uid);
        let obj = {
            "task": task,
            "id": `${uid}`,
            "color": color
        };
        taskArr.push(obj);
        let finalArr = JSON.stringify(taskArr);
        localStorage.setItem("allTask", finalArr);
    }
    taskFilter.addEventListener("click", changeColor)

    tippy(".task_container .task_filter", {
        content: "Click to change task color",
        theme: "light",
    });


    taskContainer.addEventListener("click", deleteTask);
    let taskDesc = taskContainer.querySelector(".task_desc");
    taskDesc.addEventListener("keyup", editTask);

    let lockElem = taskContainer.querySelectorAll(".lock")
    tippy('#edit_lock', {
        content: "Click on lock to edit the tasks",
        theme: 'light',
    })
    lockElem.forEach(item => {
        item.addEventListener("click", (e) => {
            // console.log(item.children[0].classList[1])
            if (editState == false) {
                item.children[0].classList.remove("fa-lock");
                item.children[0].classList.add("fa-lock-open");
                taskDesc.setAttribute("contentEditable", "true");
                editState = true;
            } else {
                item.children[0].classList.remove("fa-lock-open");
                item.children[0].classList.add("fa-lock");
                taskDesc.setAttribute("contentEditable", "false");
                editState = false;
            }
        })


    })

}

function changeColor(e) {
    let taskFilter = e.currentTarget;
    let taskContainer = taskFilter.parentNode;
    let colors = ["red", "yellow", "green", "black"];
    let cColor = taskFilter.classList[1];
    let idx = colors.indexOf(cColor);
    let newColorIdx = (idx + 1) % 4;
    taskFilter.classList.remove(cColor);
    taskFilter.classList.add(colors[newColorIdx]);
    let taskDesc = taskContainer.querySelector(".task_desc");
    let uidElem = taskDesc.parentNode.children[0];
    let uid = uidElem.innerText.split("#")[1];
    for (let i = 0; i < taskArr.length; i++) {
        let {
            id
        } = taskArr[i];
        console.log(id, uid);
        if (id == uid) {
            taskArr[i].color = taskFilter.classList[1];
            let finalTaskArr = JSON.stringify(taskArr);
            localStorage.setItem("allTask", finalTaskArr);

            break;
        }
    }

}

function deleteTask(e) {
    let taskContainer = e.currentTarget;
    let uidElem = taskContainer.querySelector(".uid");
    let uid = uidElem.innerText.split("#")[1];
    if (deleteState == true) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Deleted!',
                    `Task with ID ${uid} was successfully deleted`,
                    'success'
                )

                if (deleteState == true) {
                    // taskContainer.remove();
                    for (let i = 0; i < taskArr.length; i++) {
                        let {
                            id
                        } = taskArr[i];
                        console.log(id, uid);
                        if (id == uid) {
                            taskArr.splice(i, 1);
                            let finalTaskArr = JSON.stringify(taskArr);
                            localStorage.setItem("allTask", finalTaskArr);
                            taskContainer.remove();
                            break;
                        }
                    }
                }
            }
        })
    }
}

// function deleteTask(e) {
//     let taskContainer = e.currentTarget;
//     if (deleteState == true) {
//         // taskContainer.remove();
//         let uidElem = taskContainer.querySelector(".uid");
//         let uid = uidElem.innerText.split("#")[1];
//         for (let i = 0; i < taskArr.length; i++) {
//             let {
//                 id
//             } = taskArr[i];
//             console.log(id, uid);
//             if (id == uid) {
//                 taskArr.splice(i, 1);
//                 let finalTaskArr = JSON.stringify(taskArr);
//                 localStorage.setItem("allTask", finalTaskArr);
//                 taskContainer.remove();
//                 break;
//             }
//         }
//     }
// }

function editTask(e) {
    let taskDesc = e.currentTarget;
    let uidElem = taskDesc.parentNode.children[0];
    let uid = uidElem.innerText.split("#")[1];
    for (let i = 0; i < taskArr.length; i++) {
        let {
            id
        } = taskArr[i];
        console.log(id, uid);
        if (id == uid) {
            taskArr[i].task = taskDesc.innerText
            let finalTaskArr = JSON.stringify(taskArr);
            localStorage.setItem("allTask", finalTaskArr);
            break;
        }
    }
}

function setDeleteState(e) {

    let crossButton = e.currentTarget;
    let parent = crossButton.parentNode;
    if (modalState == false) {
        if (deleteState == false) {
            parent.classList.add("active");
            Swal.fire({
                title: 'Delete State On',
                text: "Click on Task to delete it",
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
            })
        } else {
            parent.classList.remove("active");
            Swal.fire({
                title: 'Delete State Off',
                text: "Click on X icon to turn it back on",
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
            })
        }
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please Close add Task Box First',
        })
    }

    deleteState = !deleteState;

}