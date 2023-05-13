localStorage.setItem("todoList", JSON.stringify([]));

var priorityMap = {
  high: "High priority",
  medium: "Medium priority",
  low: "Low priority",
};

function parseTodoList() {
  return JSON.parse(localStorage.getItem("todoList"));
}

function removeAllChildOfTable() {
  const todoTable = document.getElementById("todo-table");
  while (todoTable.firstChild) {
    todoTable.removeChild(todoTable.lastChild);
  }
}

function onCheckCell(el) {
  const rowEl = el.parentElement.parentElement;
  const id = rowEl.id;
  const cssClass = el.checked ? "text-cell completed-task" : "text-cell";
  const todoList = parseTodoList();
  todoList.some((record) => {
    if (record.id == id) {
      record.completed = el.checked;
    }
    return record.id == id;
  });
  localStorage.setItem("todoList", JSON.stringify(todoList));
  rowEl.childNodes[1].setAttribute("class", cssClass);
  updateCompleted();
  updatePending();
}

function createTableRow(record) {
  const priority = priorityMap[record.priority];
  const taskTextClass = record.completed
    ? "text-cell completed-task"
    : "text-cell";
  const checkBoxEl = record.completed
    ? '<input type="checkbox" onclick="onCheckCell(this)" checked />'
    : '<input type="checkbox" onclick="onCheckCell(this)" />';
  const newRow = document.createElement("tr");
  newRow.setAttribute("class", "todo-table-row displayFlex");
  newRow.setAttribute("id", record.id);

  const checkCell = document.createElement("td");
  checkCell.setAttribute("class", "check-cell");
  checkCell.innerHTML = checkBoxEl;

  const textCell = document.createElement("td");
  textCell.setAttribute("class", taskTextClass);
  textCell.textContent = record.task;

  const priorityCell = document.createElement("td");
  priorityCell.setAttribute("class", "priority-cell");
  priorityCell.innerHTML =
    "<div class='displayFlex alignCenter'> <div class='" +
    record.priority +
    "'></div> <div class='" +
    record.priority +
    "-text'>" +
    priority +
    "</div></div>";

  const deleteCell = document.createElement("td");
  deleteCell.setAttribute("class", "delete-cell");
  deleteCell.innerHTML =
    '<i class="fa-solid fa-trash-can light-delete" onclick="onDeleteTodo(this)"></i>';

  newRow.appendChild(checkCell);
  newRow.appendChild(textCell);
  newRow.appendChild(priorityCell);
  newRow.appendChild(deleteCell);
  return newRow;
}

function updateTable() {
  const todoList = parseTodoList();
  const todoTable = document.getElementById("todo-table");

  // Remove children before update table with new data
  removeAllChildOfTable();

  // Add new rows to table as per data
  todoList.forEach(function (record) {
    const rowEl = createTableRow(record);
    todoTable.appendChild(rowEl);
  });
}

function onSubmit(form) {
  const todoList = parseTodoList();
  const sortValue = document.getElementById("sort-menu").value;
  const todoItem = {
    task: form.todoInput.value,
    priority: form.priorityMenu.value,
    completed: false,
    id: new Date().getTime(),
  };

  todoList.push(todoItem);
  localStorage.setItem("todoList", JSON.stringify(todoList));
  const sortedList = sortTodoList(sortValue);
  localStorage.setItem("todoList", JSON.stringify(sortedList));
  updateTable();
  updateTotal();
  updatePending();
  updateCompleted();
  return false;
}

function onSortChange(e) {
  const sortedList = sortTodoList(e.value);
  localStorage.setItem("todoList", JSON.stringify(sortedList));
  updateTable();
}

function onTaskEnter(e) {
  const submitButton = document.getElementById("todo-submit-button");
  submitButton.disabled = !e.value;
}

function onDeleteTodo(el) {
  const rowEl = el.parentElement.parentElement;
  const id = rowEl.id;
  const todoList = parseTodoList();
  const index = todoList.findIndex((record) => record.id == id);
  todoList.splice(index, 1);
  localStorage.setItem("todoList", JSON.stringify(todoList));
  updateTable();
  updateTotal();
  updatePending();
  updateCompleted();
}

function sortTodoList(value) {
  const todoList = parseTodoList();
  return todoList.sort((a, b) => {
    switch (value) {
      case "high-priority":
        if (a.priority === "high") {
          return -1;
        } else if (b.priority === "high") {
          return 1;
        } else {
          return 0;
        }
      case "low-priority":
        if (a.priority === "low") {
          return -1;
        } else if (b.priority === "low") {
          return 1;
        } else {
          return 0;
        }
      case "medium-priority":
        if (a.priority === "medium") {
          return -1;
        } else if (b.priority === "medium") {
          return 1;
        } else {
          return 0;
        }
      case "completed":
        if (a.completed) {
          return -1;
        } else if (b.completed) {
          return 1;
        } else {
          return 0;
        }
      default:
        return 0;
    }
  });
}

function updateTotal() {
  const totalInfoEl = document.getElementById("total-info");
  const todoList = parseTodoList();
  totalInfoEl.innerHTML = "TOTAL: " + todoList.length;
}

function updatePending() {
  const pendingInfoEl = document.getElementById("pending-info");
  const todoList = parseTodoList();
  let count = 0;
  todoList.forEach((record) => {
    if (!record.completed) {
      count = count + 1;
    }
  });
  pendingInfoEl.innerHTML = "PENDING: " + count;
}

function updateCompleted() {
  const completedInfoEl = document.getElementById("completed-info");
  const todoList = parseTodoList();
  let count = 0;
  todoList.forEach((record) => {
    if (record.completed) {
      count = count + 1;
    }
  });
  completedInfoEl.innerHTML = "COMPLETED: " + count;
}
