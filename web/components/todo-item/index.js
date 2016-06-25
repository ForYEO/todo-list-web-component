! (function() {
	var ToDoItemProto = Object.create(HTMLDivElement.prototype);

	var localDocument = document.currentScript.ownerDocument;
	var template = localDocument.querySelector('#todoItemTemplate');

	ToDoItemProto.attributeChangedCallback = function(attrName, oldVal, newVal) { 
		if(attrName == "data-task") {
			var root = this.createShadowRoot();
			root.appendChild(template.content.cloneNode(true));

			var data = JSON.parse(newVal);
			ToDoItemProto.init(root, data);
		}
	};

	ToDoItemProto.init = function (root, data) {
		ToDoItemProto.wireEvents(ToDoItemProto.initControls(root, data), data);
	};

	ToDoItemProto.initControls = function (root, data) {
		var controls = {};

		controls.taskTextLabel = root.querySelector(".task-text");
		controls.taskTextLabel.innerHTML = data.text

		controls.deleteTaskButton = root.querySelector(".delete-task");

		return controls;
	};

	ToDoItemProto.wireEvents = function (controls, data) {
		controls.deleteTaskButton.addEventListener("click", function () {
			var event = new CustomEvent("delete-task", { "detail": JSON.stringify(data) });
			document.dispatchEvent(event);
		});
	};

	var ToDoItem = document.registerElement("todo-item", {
		prototype: ToDoItemProto
	});
})();