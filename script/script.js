// Toggle mode for light and dark theme  // 

const doc = document.body;
const toggleBtn = document.querySelector(".toggle");
const leftBox = document.querySelector(".left");
const main = document.querySelector(".taskflow");
const subhead = document.querySelector(".productivity");
const info = document.querySelector(".view");
const searchEngine = document.querySelector(".search input");
const inputBox = document.querySelector(".input");
const inputField = document.querySelectorAll(".input input");
const dates = document.querySelector(".dates");
const container = document.querySelectorAll("conts");
let cardbg = "#E9EAEE";
let cardColor = "white";


let darkMode = true; toggleBtn.addEventListener("click", () => {
    darkMode = !darkMode; if (!darkMode) {
        doc.style.backgroundColor = "#F5F7FB";
        leftBox.style.backgroundColor = "#E9EAEE";
        main.style.color = "black";
        subhead.style.color = "black";
        info.style.color = "black";
        dates.style.color = "black";
        searchEngine.style.color = "black";

        searchEngine.style.backgroundColor = "#DDDFE2";
        inputBox.style.backgroundColor = "#E9EAEE";
        inputField.forEach(e => {
            e.style.backgroundColor = "#DDDFE2";
            e.style.color = "black";
        });
        cardBg = "#E9EAEE";
        cardText = "black";;

    }
    else {
        doc.style.backgroundColor = "#0B1020";
        leftBox.style.backgroundColor = "#191E2D";
        main.style.color = "white";
        subhead.style.color = "white";
        info.style.color = "white";
        dates.style.color = "white";
        searchEngine.style.color = "white";
        searchEngine.style.backgroundColor = "#272B39";
        inputBox.style.backgroundColor = "#191E2D";
        inputField.forEach(e => {
            e.style.backgroundColor = "#272B39";
            e.style.color = "white";
        });
        cardBg = "#191E2D";
        cardText = "white";

    }
    renderTasks();
});
// ending of toggle mode


// for displaying time
const now = new Date(); dates.innerHTML = now.toLocaleString();






// Card and their functionality
const taskContainer = document.querySelector("#taskContainer");
const addTaskBtn = document.querySelector(".task");
const searchInput = document.querySelector(".search");

let allTodos = JSON.parse(localStorage.getItem("allTodos")) || [];
let currentFilter = "all";
let searchQuery = "";

// save data into local storage
function saveData() {
    localStorage.setItem("allTodos", JSON.stringify(allTodos));
    renderTasks();
}

// count cards WebTransportDatagramDuplexStream,pending and done
function updateCounts() {
    document.querySelector("#totalCount").innerText = allTodos.length;
    document.querySelector("#doneCount").innerText = allTodos.filter(t => t.completed).length;
    document.querySelector("#pendingCount").innerText =
        allTodos.filter(t => !t.completed).length;
}

// functionality of active, pinned, completed and archieved button
function renderTasks() {
    taskContainer.innerHTML = "";

    // logics
    let tasks = [...allTodos];

    if (currentFilter === "active") {
        tasks = tasks.filter(t => !t.completed && !t.archived);
    }
    else if (currentFilter === "completed") {
        tasks = tasks.filter(t => t.completed && !t.archived);
    }
    else if (currentFilter === "pinned") {
        tasks = tasks.filter(t => t.pinned && !t.archived && !t.completed);
    }
    else if (currentFilter === "archived") {
        tasks = tasks.filter(t => t.archived);
    }
    else {
        // ALL view
        tasks = tasks.filter(t => !t.archived && !t.completed);
    }

    // search functionality
    if (searchQuery) {
        tasks = tasks.filter(t =>
            (t.title + " " + t.subtasks).toLowerCase().includes(searchQuery)
        );
    }

    // pinned first

    tasks.sort((a, b) => b.pinned - a.pinned);

    tasks.forEach(task => {
        const card = document.createElement("div");

        if (task.pinned) {
            card.style.border = darkMode
                ? "2px solid white"
                : "2px solid black";
        } else {
            card.style.border = "none";
        }

        let pinBorder = task.pinned
            ? (darkMode ? "border-2 border-white" : "border-2 border-black border-solid")
            : "";

        card.className = `
             p-3 rounded-lg mt-4 hover:shadow-lg transition-all duration-200
            ${pinBorder}
        `;

        card.innerHTML = ` 
            <h3 class="${task.completed ? "line-through opacity-60" : ""}">
                ${task.title}
            </h3>
            <p>${task.description}</p>
            <p>${task.date || ""}</p>
            <p>${task.subtasks || ""}</p>
            
            <div class="card-btns flex gap-2 justify-center mt-2 w-full flex-row bg-[#191E2D] text-xs">
                <button class="task-btn done transition-transform duration-150 active:scale-90 rounded-lg p-1 bg-[#272B39] w-1/5">✔ ${task.completed ? "Undo" : "Done"}</button>
                <button class="task-btn pin transition-transform duration-150 active:scale-90 rounded-lg p-1 bg-[#272B39] w-1/5">📌 ${task.pinned ? "Unpin" : "Pin"}</button>
                <button class="task-btn archive transition-transform duration-150 active:scale-90 rounded-lg p-1 bg-[#272B39] w-1/5">📦 ${task.archived ? "Unarchive" : "Archive"}</button>
                <button class="task-btn delete transition-transform duration-150 active:scale-90 rounded-lg p-1 bg-[#272B39] w-1/5">🗑 Delete</button>
            </div>
        `;
        const btnDiv = card.querySelector(".card-btns");

        btnDiv.style.backgroundColor = darkMode ? "#191E2D" : "#E9EAEE";
        card.querySelectorAll(".task-btn").forEach(btn => {
            btn.style.backgroundColor = darkMode ? "#272B39" : "#DDDFE2";
            btn.style.color = darkMode ? "white" : "black";
        });


        card.style.backgroundColor = darkMode ? "#191E2D" : "#E9EAEE";
        card.style.color = darkMode ? "white" : "black";

        // Task completed
        card.querySelector(".done").addEventListener("click", () => {
            task.completed = !task.completed;
            saveData();
        });

        // pin and unpin card
        card.querySelector(".pin").addEventListener("click", () => {
            task.pinned = !task.pinned;
            saveData();
        });

        // archieve card
        card.querySelector(".archive").addEventListener("click", () => {
            task.archived = !task.archived;

            saveData(); 
        });

        // delete card and data from local storage
        card.querySelector(".delete").addEventListener("click", () => {
            allTodos = allTodos.filter(t => t.id !== task.id);
            saveData();
        });

        taskContainer.appendChild(card);
    });

    updateCounts();



}

// Add task using button
addTaskBtn.addEventListener("click", () => {
    const title = document.querySelector(".title").value;

    if (!title) return alert("Title required");

    allTodos.push({
        id: Date.now(),
        title,
        description: document.querySelector(".description").value,
        date: document.querySelector(".date").value,
        tags: document.querySelector(".tags").value,
        subtasks: document.querySelector(".subtask").value,
        pinned: false,
        completed: false,
        archived: false
    });

    saveData();
    document.querySelector(".title").value = "";
    document.querySelector(".description").value = "";
    document.querySelector(".date").value = "";
    document.querySelector(".tags").value = "";
    document.querySelector(".subtask").value = "";
});

// filter button
document.querySelectorAll(".filterBtn").forEach(btn => {
    btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// search
searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderTasks();
});


renderTasks();