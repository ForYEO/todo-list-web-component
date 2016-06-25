! (function() {
	var ToDoListProto = Object.create(HTMLDivElement.prototype);
	Object.defineProperty(ToDoListProto, "keyPrefix", { value: "itemsFor" });

	var localDocument = document.currentScript.ownerDocument;
	var template = localDocument.querySelector('#todoListTemplate');

	ToDoListProto.createdCallback = function () {
		var root = this.createShadowRoot();
		root.appendChild(template.content.cloneNode(true));
		var controlId = this.id;

		ToDoListProto.init(root, controlId);
	};

	ToDoListProto.init = function (root, controlId) {
		this.controls = ToDoListProto.initControls(root);

		ToDoListProto.setId(controlId, this.controls.controlId);

		var tasks = ToDoListProto.loadTasks(controlId);
		ToDoListProto.restoreTasks(tasks, this.controls);
		ToDoListProto.saveTasks(controlId, tasks);

		ToDoListProto.wireEvents(controlId, this.controls, tasks);
	};

	ToDoListProto.initControls = function (root) {
		var controls = {};

		controls.root = root;
		controls.addTaskButton = root.querySelector(".add-task"); 
		controls.taskTitleTextBox = root.querySelector(".task-title");
		controls.tasksList = root.querySelector(".tasks");
		controls.controlId = root.querySelector(".control-id");

		return controls;
	};

	ToDoListProto.wireEvents = function (id, controls, tasks) {
		controls.addTaskButton.addEventListener("click", function (e) {
			var taskId = (id + "_task" + new Date().getTime());

			var task = {
				id: taskId,
				text: controls.taskTitleTextBox.value
			}

			tasks.push(task);

			ToDoListProto.addItem(task, controls);
			ToDoListProto.saveTasks(id, tasks);
		})
	};

	ToDoListProto.setId = function (id, controlId) {
		if (id == null || id.length == 0) {
			id = "unique" + new Date().getTime();
		}

		controlId.innerHTML = id;
	};

	ToDoListProto.addItem = function (task, controls) {
		var item = document.createElement("todo-item");

		item.setAttribute("id", task.id);
		item.setAttribute("data-task", JSON.stringify(task));

		document.addEventListener("delete-task", function(e) {
			//var itemToRemove = controls.tasksList.querySelector("#" + JSON.parse(e.detail).id);
			var itemToRemove = e.srcElement.activeElement.querySelector("todo-list::shadow #" + JSON.parse(e.detail).id)

			if(itemToRemove != null) {
				controls.tasksList.removeChild(itemToRemove);
			}

			var tasks = ToDoListProto.loadTasks(controls.controlId.innerText);
			ToDoListProto.removeItem(controls.controlId.innerText, tasks, JSON.parse(e.detail));
			ToDoListProto.saveTasks(controls.controlId.innerText, tasks);

			e.stopImmediatePropagation();
		});

		controls.tasksList.appendChild(item);
		controls.taskTitleTextBox.value = "";
	};

	ToDoListProto.removeItem = function (id, tasks, task) {
		var index = -1;

		for(var i = 0; i < tasks.length; i++) {
			if(tasks[i].id == task.id) {
				index = i;
				break;
			}
		}

		if(index == -1) {
			return;
		}

		tasks.splice(index, 1);
	};

	ToDoListProto.loadTasks = function (id) {
		if(id == null || id.length == 0 || id.startsWith("unique")) {
			return [];
		}

		var data = localStorage.getItem(ToDoListProto.keyPrefix + id);
		if(data == null) {
			return [];
		}

		return JSON.parse(data);
	}

	ToDoListProto.restoreTasks = function (tasks, controls) {
		for(var i = 0; i < tasks.length; i++) {
			var task = tasks[i];
			ToDoListProto.addItem(task, controls);
		}
	};

	ToDoListProto.saveTasks = function (id, tasks) {
		if(id == null || id.length == 0 || id.startsWith("unique")) {
			return;
		}

		localStorage.setItem(ToDoListProto.keyPrefix + id, JSON.stringify(tasks));	
	};

	var ToDoList = document.registerElement("todo-list", {
		prototype: ToDoListProto
	});
})();