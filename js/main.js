// DOM элементы
const newNoteButton = document.querySelector(".todo__newnote");
const cancelButton = document.querySelector(".cancel-btn");
const popup = document.querySelector(".modal-overlay");
const input = document.querySelector(".note__input");
const addButton = document.querySelector(".apply-btn");
const todoList = document.querySelector(".todo__list");
const empty = document.querySelector(".todo__empty");
const searchInput = document.querySelector(".todo__search");
const modeButton = document.querySelector(".todo__mode");
const body = document.querySelector("body");
const detLight = document.querySelector(".det__light");
const detDark = document.querySelector(".det__dark");
const filterButton = document.querySelector(".todo__filter");
const filterPopup = document.querySelector(".filter__popup");
const filterButtons = document.querySelectorAll(".filter__button");
const filterArrow = document.querySelector(".filter__arrow");
const filterText = document.querySelector(".todo__filter__text");

// Состояние приложения
let isDarkMode = false;
let tasks = [];
let currentFilter = localStorage.getItem("currentFilter") || "ВСЕ";
let isEditing = false;
let currentEditId = null;

// Иконки SVG
const icons = {
    darkMode: `
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.1249 0.548798C11.3387 0.917354 11.321 1.3762 11.0791 1.72705C10.3455 2.79152 9.91599 4.08062 9.91599 5.47334C9.91599 9.12428 12.8757 12.084 16.5266 12.084C17.9194 12.084 19.2085 11.6545 20.2729 10.9208C20.6238 10.6791 21.0826 10.6613 21.4512 10.8751C21.8197 11.089 22.0319 11.4962 21.9961 11.9208C21.5191 17.567 16.7867 22 11.0178 22C4.93282 22 0 17.0672 0 10.9822C0 5.21328 4.43301 0.480873 10.0792 0.00392422C10.5038 -0.0319387 10.911 0.180242 11.1249 0.548798ZM8.17985 2.63461C4.70452 3.81573 2.20355 7.10732 2.20355 10.9822C2.20355 15.8502 6.14981 19.7964 11.0178 19.7964C14.8927 19.7964 18.1843 17.2955 19.3654 13.8202C18.4741 14.1232 17.5191 14.2875 16.5266 14.2875C11.6587 14.2875 7.71244 10.3413 7.71244 5.47334C7.71244 4.48086 7.87682 3.52582 8.17985 2.63461Z" fill="#F7F7F7"/>
    </svg>
    `,
    lightMode: `
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.1576 1.15764C12.1576 0.518299 11.6394 0 11 0C10.3606 0 9.84235 0.518299 9.84235 1.15764V1.73887C9.84235 2.37822 10.3606 2.89651 11 2.89651C11.6394 2.89651 12.1576 2.37822 12.1576 1.73887V1.15764ZM18.7782 4.85893C19.2302 4.40683 19.2302 3.67386 18.7782 3.22177C18.3261 2.76969 17.5931 2.76969 17.141 3.22177L16.73 3.63282C16.2779 4.08492 16.2779 4.81789 16.73 5.26998C17.182 5.72206 17.915 5.72206 18.3671 5.26998L18.7782 4.85893ZM4.85889 3.22184C4.40681 2.76976 3.67383 2.76976 3.22175 3.22184C2.76967 3.67393 2.76967 4.4069 3.22175 4.859L3.63273 5.26998C4.08483 5.72206 4.8178 5.72206 5.26989 5.26998C5.72197 4.81789 5.72197 4.08492 5.26989 3.63282L4.85889 3.22184ZM1.15764 9.84235C0.518299 9.84235 0 10.3606 0 11C0 11.6394 0.518299 12.1576 1.15764 12.1576H1.73884C2.37819 12.1576 2.89648 11.6394 2.89648 11C2.89648 10.3606 2.37819 9.84235 1.73884 9.84235H1.15764ZM20.2611 9.84235C19.6217 9.84235 19.1035 10.3606 19.1035 11C19.1035 11.6394 19.6217 12.1576 20.2611 12.1576H20.8424C21.4817 12.1576 22 11.6394 22 11C22 10.3606 21.4817 9.84235 20.8424 9.84235H20.2611ZM5.26989 18.3672C5.72197 17.9151 5.72197 17.1821 5.26989 16.7301C4.8178 16.2779 4.08483 16.2779 3.63273 16.7301L3.22177 17.141C2.76968 17.5931 2.76968 18.3261 3.22176 18.7782C3.67385 19.2302 4.40682 19.2302 4.85892 18.7782L5.26989 18.3672ZM18.3671 16.7301C17.915 16.2779 17.182 16.2779 16.73 16.7301C16.2779 17.1821 16.2779 17.9151 16.73 18.3672L17.1409 18.7782C17.5931 19.2303 18.326 19.2303 18.7782 18.7782C19.2302 18.3261 19.2302 17.5932 18.7782 17.141L18.3671 16.7301ZM12.1576 20.2611C12.1576 19.6217 11.6394 19.1035 11 19.1035C10.3606 19.1035 9.84235 19.6217 9.84235 20.2611V20.8424C9.84235 21.4817 10.3606 22 11 22C11.6394 22 12.1576 21.4817 12.1576 20.8424V20.2611ZM6.36943 11C6.36943 8.4426 8.4426 6.36943 11 6.36943C13.5573 6.36943 15.6305 8.4426 15.6305 11C15.6305 13.5573 13.5573 15.6305 11 15.6305C8.4426 15.6305 6.36943 13.5573 6.36943 11ZM11 4.05415C7.1639 4.05415 4.05415 7.1639 4.05415 11C4.05415 14.8361 7.1639 17.9458 11 17.9458C14.8361 17.9458 17.9458 14.8361 17.9458 11C17.9458 7.1639 14.8361 4.05415 11 4.05415Z" fill="#F7F7F7"/>
    </svg>
    `,
    edit: `
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.5 10.16L0.5 13.5L3.83 13.5L10.5 6.82L12.9 4.43L12.9 4.43C13.23 4.1 13.39 3.94 13.45 3.75C13.51 3.58 13.51 3.4 13.45 3.23C13.39 3.04 13.23 2.87 12.9 2.54L11.45 1.09C11.12 0.76 10.95 0.6 10.76 0.54C10.59 0.48 10.41 0.48 10.25 0.54C10.06 0.6 9.89 0.76 9.56 1.09L9.56 1.1L7.17 3.49L0.5 10.16ZM7.17 3.49L10.5 6.82" stroke="#CDCDCD" stroke-opacity="1" stroke-width="1" stroke-linejoin="round"/>
    </svg>
    `,
    delete: `
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.87414 6.61505C1.80712 5.74386 2.49595 5 3.36971 5H10.63C11.5039 5 12.1927 5.74385 12.1257 6.61505L11.6064 13.365C11.5463 14.1465 10.8946 14.75 10.1108 14.75H3.88894C3.10514 14.75 2.45348 14.1465 2.39336 13.365L1.87414 6.61505Z" stroke="#CDCDCD"/>
        <path d="M12.625 2.75H1.375" stroke="#CDCDCD" stroke-linecap="round"/>
        <path d="M5.5 1.25C5.5 0.83579 5.83577 0.5 6.25 0.5H7.75C8.16422 0.5 8.5 0.83579 8.5 1.25V2.75H5.5V1.25Z" stroke="#CDCDCD"/>
        <path d="M8.5 8V11.75" stroke="#CDCDCD" stroke-linecap="round"/>
        <path d="M5.5 8V11.75" stroke="#CDCDCD" stroke-linecap="round"/>
    </svg>
    `,
};

modeButton.innerHTML = icons.darkMode;

// Функции приложения
const updateTheme = () => {
    if (isDarkMode) {
    modeButton.innerHTML = icons.lightMode;
    body.classList.add("dark");
    detLight.classList.add("hidden");
    detDark.classList.remove("hidden");
    } else {
    modeButton.innerHTML = icons.darkMode;
    body.classList.remove("dark");
    detLight.classList.remove("hidden");
    detDark.classList.add("hidden");
    }
};

const saveToLocalStorage = () => {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
    localStorage.setItem("darkMode", isDarkMode);
};

const filterTasks = (tasksToFilter) => {
    switch (currentFilter) {
    case "ГОТОВО":
        return tasksToFilter.filter((task) => task.completed);
    case "НЕГОТОВО":
        return tasksToFilter.filter((task) => !task.completed);
    default:
        return tasksToFilter;
    }
};

const showEmptyMessage = () => {
    const hasTasks = tasks.length > 0;
    const hasFilteredTasks = filterTasks(tasks).length > 0;

    if (!hasTasks || !hasFilteredTasks) {
    empty.classList.remove("hidden");
    todoList.classList.add("hidden");
    } else {
    empty.classList.add("hidden");
    todoList.classList.remove("hidden");
    }
};

const createTaskElement = (task) => {
    const li = document.createElement("li");
    li.className = "todo__item";
    li.dataset.id = task.id;

    const label = document.createElement("label");
    label.className = "custom__checkbox no__select";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "real__checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    saveToLocalStorage();
    renderTasks();
    });

    const fakeCheckbox = document.createElement("span");
    fakeCheckbox.className = "fake__checkbox";

    const taskText = document.createElement("span");
    taskText.className = "task__text";
    taskText.textContent = task.text;

    const changeButton = document.createElement("button");
    changeButton.className = "todo__change";
    changeButton.innerHTML = icons.edit;

    changeButton.addEventListener("click", () => {
    popup.style.display = "flex";
    input.value = task.text;
    isEditing = true;
    currentEditId = task.id;
    });

    const delButton = document.createElement("button");
    delButton.className = "todo__delete";
    delButton.innerHTML = icons.delete;

    delButton.addEventListener("click", () => {
    tasks = tasks.filter((t) => t.id !== task.id);
    saveToLocalStorage();
    renderTasks();
    });

    label.append(checkbox, fakeCheckbox, taskText, changeButton, delButton);
    li.append(label);

    return li;
};

const renderTasks = () => {
    todoList.innerHTML = "";
    const filteredTasks = filterTasks(tasks);

    if (filteredTasks.length === 0) {
    showEmptyMessage();
    return;
    }

    filteredTasks.forEach((task) => {
    todoList.append(createTaskElement(task));
    });

    showEmptyMessage();
};

const updateFilter = (filterType) => {
    currentFilter = filterType;
    filterText.textContent = currentFilter;
    localStorage.setItem("currentFilter", currentFilter);
    renderTasks();
};

// Инициализация приложения
const init = () => {
  // Загрузка темы
    filterArrow.style.display = 'inline-block';
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme !== null) {
    isDarkMode = savedTheme === "true";
    updateTheme();
    }

  // Загрузка задач
    const savedTasks = localStorage.getItem("todoTasks");
    if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    renderTasks();
    }

  // Установка текущего фильтра
    updateFilter(currentFilter);
};

// Обработчики событий
modeButton.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    saveToLocalStorage();
    updateTheme();
});

newNoteButton.addEventListener("click", () => {
    popup.style.display = "flex";
    input.focus();
});

cancelButton.addEventListener("click", () => {
    popup.style.display = "none";
    input.value = "";
    isEditing = false;
    currentEditId = null;
});

addButton.addEventListener("click", () => {
    const inputText = input.value.trim();
    if (!inputText) return;

    if (isEditing) {
    const taskToEdit = tasks.find((task) => task.id === currentEditId);
    if (taskToEdit) {
        taskToEdit.text = inputText;
    }
    } else {
    tasks.push({
        id: Date.now(),
        text: inputText,
        completed: false,
    });
    }

    saveToLocalStorage();
    input.value = "";
    popup.style.display = "none";
    isEditing = false;
    currentEditId = null;
    renderTasks();
});

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
    addButton.click();
    }
});

searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    if (!query) {
    renderTasks();
    return;
    }

    const filtered = tasks.filter((task) =>
    task.text.toLowerCase().includes(query)
    );

    todoList.innerHTML = "";
    filtered.forEach((task) => {
    todoList.append(createTaskElement(task));
    });
});

filterButton.addEventListener('click', (e) => {
    e.stopPropagation();
    filterPopup.classList.toggle('active');
    filterArrow.classList.toggle('rotated');
});

document.addEventListener('click', () => {
    filterPopup.classList.remove('active');
    filterArrow.classList.remove('rotated');
});

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
    updateFilter(button.textContent);
    filterPopup.classList.remove("active");
    filterArrow.classList.remove("rotated");
    });
});

// Запуск приложения
init();
