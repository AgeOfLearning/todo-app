# TODO App Tutorial

The purpose of this tutorial is to demonstrate features of the AofL JS framework. In this tutorial we will use the CLI tool, data store, form validation, and as a bonus we'll even implement localization.

## Requirements

A User should be able to ...

1. Add new items
1. Toggle items complete/incomplete
1. Filter items by completed, not completed and all
1. See the count of incomplete items
1. Edit items

## Init Project

Let's start by installing the starter app.

<!-- prettier-ignore -->
```bash
npx aofl init todo-app
cd todo-app
```

_You can also follow along with the source code from this repo: https://github.com/AgeOfLearning/todo-app.<br>
Each section will have a corresponding route corresponding to each stage of the tutorial._

## Step 1

### Naive approach

_The code for this section is in `routes/step-1` folder in the todo app repo referenced above._

We'll start with a naive approach without a store for state or form validation so we can learn the simple concepts first and layer up the complexity as required. We'll still need to think about the state though. For now let's just add the `todos`, `todosCount` and `todoDescription` properties to our home page component and initialize those default values in the constructor. The `todoDescription` will hold the text value of the current todo in our add todo form.

<!-- prettier-ignore -->
```javascript
// routes/home/index.js
...
class HomePage extends AoflElement {
  /**
   *
   * Creates an instance of HomePage.
   */
  constructor() {
    super();
    this.todos = [];
    this.todoDescription = '';
    this.todosCount = 0;
  }

  /**
   * @readonly
   */
  static get properties() {
    return {
      todosCount: {type: Number, attribute: false},
      todos: {type: Array, attribute: false},
      todoDescription: {type: String, attribute: false}
    };
  }
  ...
}
```

Next let's build the view. We'll need a list for the todo items and a form to enter new todos. Let's add the markup in `/routes/home/template.js`. This markup is rendered by lit-html, which is essentially JavaScript template literals that are rendered to HTML.

```javascript
  // routes/home/template.js
  export const template = (ctx, html) => html`
    <h1>Todos</h1>
    <ul>
      ${ctx.todos.map((todo) => html`<li>${todo.description}</li>`)}
    </ul>
    <form @submit=${(e) => ctx.addTodo(e)}>
      <input
        type="text"
        autofocus
        autocomplete="off"
        placeholder="I need to..."
        .value=${ctx.todoDescription}
        @input=${(e) => ctx.onTodoInput(e)}>
      <button type="submit">Add</button>
    </form>
    <br>
    <p>Total todos: ${ctx.todosCount}</p>
  `;
```

The template file exports a tempate function which returns a lit-html template. It receieves two arguments `ctx` and `html`, the latter is the method lit-html uses to render the template and the former is the context of our home page component. The template maps our todos in un ordered list and provides a simple form for adding todos and maps the form's input value to the component's `todoDescription` property.

_`@submit` and `@input` are `lit-html` syntax for corresponding DOM event listeners._

Now that we have a view we need to build the event handlers referenced in the template `addTodo(e)` and `onTodoInput(e)` in our home page component.

```javascript
// routes/home/index.js
...
class HomePage extends AoflElement {
  /**
   *
   * Creates an instance of HomePage.
   */
  constructor() {
    super();
    this.todos = [];
    this.todoDescription = '';
    this.todosCount = 0;
    this.idIncrementor = 0;
  }
  ...
   /**
   *
   * @param {Event} e
   */
  onTodoInput(e) {
    this.todoDescription = e.target.value;
  }

  /**
   *
   * @param {Event} e
   */
  addTodo(e) {
    e.preventDefault();
    this.todos = this.todos.concat([{
      id: this.idIncrementer,
      description: this.todoDescription
    }]);
    this.todoDescription = '';
    this.todosCount++;
  }
  ...
}
```

Congrats! At this point we have a working todo list, albeit a crude one. Let's go over the methods we've written. The `onTodoInput` method simply captures the input value from the passed Event object and assigns it to the `todoDescription` property. The `addTodo` method prevents the default form submission behavior and assigns `todos` a new array which merges the previous array with a new array containing the new todo object which, consists of an incrementing id and the `todoDescription`. We also increment the `todosCount` and reset the `todoDescription` to an empty string. Also take note that we declared and initialized `idIncrementor` in the contstructor.

Now do the following to see the progress:<br>
`npm run start:dev`

_Enter a few todos and you should see something like this:_
![image](https://user-images.githubusercontent.com/441559/50664395-c6056f00-0f61-11e9-9353-df1eb6d7175b.png)


## Step 2

### Features

_The code for this section is in `routes/step-2` folder in the todo app repo referenced above._

At this point we have a crude todo list app. Let's add some additional functionality to make it more useful. In this step we'll add the ability to toggle the the list items completed/uncompleted, plus the ability to remove and edit the todo items. Let's start by adding the toggle method on or HomePage component

```javascript
// routes/home/index.js
class HomePage extends AoflElement {
  ...
  /**
   *
   * @param {Number} id
   * @param {Boolean} completed
   */
  toggleTodo(id, completed) {
    if (completed === true) {
      this.todosCount--;
    } else {
      this.todosCount++;
    }
    this.todos = this.todos.map((todo) => todo.id === id ? {...todo, completed} : todo);
  }
  ...
```

The method will take the todo id, and the new toggle state. We increment or decrement the todosCount according to the new toggle state then assign `this.todos` with a new array mapped from the previous one which updates the `complete` property of the todo item matching the passed id.

Now let's add a checkbox input for each todo item and bind the event handler to this method.

```javascript
// routes/home/template.js
export const template = (ctx, html) => html`
  <h1>Todos</h1>
  <ul>
    ${ctx.todos.map((todo) => html`
      <li>
        <input type="checkbox" @click=${(e) => ctx.toggleTodo(todo.id, !todo.completed)} ?checked=${todo.completed}>
        <span class="${todo.completed ? 'completed' : ''}">${todo.description}</span>
      </li>
    `)}
  </ul>
 ...
```

We've also bound the state of the checkbox with the completed state of the todo item with `?checked=${todo.completed}` as well as added a span with an optional "completed" class to wrap the todo item. This will allow us to style it differently when an item is completed. For now let's add css for that class to make the todo italic with a line through it when it's completed.

```css
/* /routes/home/template.css */
...
.completed {
  text-decoration: line-through;
  font-style: italic;
}
...
```

Great! We can toggle our todo items complete and uncomplete! Let's go further and add the option to remove todo items. Again we will add a method in the HomePage component to remove the items, then add a delete button in the template then bind the click event on that button with our remove method.


```javascript
// routes/home/index.js
class HomePage extends AoflElement {
  ...
  /**
   *
   * @param {Number} id
   */
  removeTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.todosCount--;
  }
  ...
```
The `removeTodo` method accepts an id argument and simply filters through all the todo items which do match the given id. It also decrements the `todoscount`.

```javascript
// routes/home/template.js
export const template = (ctx, html) => html`
  <h1>Todos</h1>
  <ul>
    ${ctx.todos.map((todo) => html`
      <li>
        <input type="checkbox" @click=${(e) => ctx.toggleTodo(todo.id, !todo.completed)} ?checked=${todo.completed}>
        <span class="${todo.completed ? 'completed' : ''}">${todo.description}</span>
        <button class="remove" @click=${(e) => ctx.removeTodo(todo.id)}>Delete</button>
      </li>
    `)}
  </ul>
 ...
```

Above we've added a remove button and bound the click event with our HomePage component's removeTodo method. Right now it doesn't look pretty but should work.

Finally let's add the ability to edit the existing todo items. We'll follow the same pattern. Create the method which handles the state of the todo items in the HomePage component then add the view elements and view logic in the template.

```javascript
  // routes/home/index.js
  class HomePage extends AoflElement {
    /**
     *
     * Creates an instance of HomePage.
     */
    constructor() {
      super();
      this.todos = [];
      this.todoDescription = '';
      this.todosCount = 0;
      this.editingTodoId;
    }

    /**
     * @readonly
     */
    static get properties() {
      return {
        todosCount: {type: Number, attribute: false},
        todos: {type: Array, attribute: false},
        todoDescription: {type: String, attribute: false},
        editingTodoId: {type: Number, attribute: false}
      };
    }
    ...
    /**
     *
     * @param {Event} e
     * @param {Number} id
     */
    toggleEditableTodo(e, id) {
      e.preventDefault();
      this.editingTodoId = id;
    }

    /**
     *
     * @param {Event} e
     * @param {Number} id
     */
    updateTodo(e, id) {
      e.preventDefault();
      let description = e.target.value;
      this.todos = this.todos.map((todo) => todo.id === id ?
      {...todo, description} :
      todo);
    }

    /**
     * Lit Element Life cycle hook.
     * Called after the view is updated.
     */
    updated() {
      if (this.editingTodoId !== undefined) {
        // let's make sure the input field is focused..
        this.shadowRoot.querySelector(`#todo-input-${this.editingTodoId}`).focus();
      }
    }
  ...
```

An intuitive way to make the items editable from a user standpoint would be to double click the todo item which would make the item editable. So we'll need a way to toggle the item to be editable as well as a method for actually updating the value. We add an `editingTodoId` property that will hold the id of the todo item we're currently editing which, will be toggled by the `toggleEditableTodo` method. We also make use of the `updated` lit element lifecycle hook to find the edit input field for the given todo item and make sure its focused. Finally we have the `updateTodo` method which will update the todo item's description value.

Now on to the template.

```javascript
  // routes/home/template.js
  export const template = (ctx, html) => html`
  <h1>Todos</h1>
  <ul>
    ${ctx.todos.map((todo) => html`
      <li>
        <input type="checkbox" @click=${(e) => ctx.toggleTodo(todo.id, !todo.completed)} ?checked=${todo.completed}>
        ${ctx.editingTodoId !== undefined && ctx.editingTodoId === todo.id ? html`
          <form @submit=${(e) => ctx.toggleEditableTodo(e)}>
            <input
              type="text"
              id="todo-input-${todo.id}"
              .value=${todo.description}
              @blur=${(e) => ctx.toggleEditableTodo(e)}
              @input=${(e) => ctx.updateTodo(e, todo.id)}
            >
          </form>
        ` : html`
          <span
            @dblclick=${(e) => ctx.toggleEditableTodo(e, todo.id)}
            class="${todo.completed ? 'completed' : ''}"
          >
            ${todo.description}
          </span>
        `}
        <button class="remove" @click=${(e) => ctx.removeTodo(todo.id)}>Delete</button>
      </li>
    `)}
  </ul>
```
Lastly let's add a simple style rule for our forms so that they're inlined.

```css
/* /routes/home/template.css */
...
form {
  display: inline-block;
}
...
```

So alot more going on here. For each todo item we need to check whether or not this item is being edited. We use a ternary conditional to check if we are editing this item or not. If not we show the item as it was before, we do however add a `@dblclick` event handler to the span wrapping the todo description and bind it to our `toggleEditableTodo` method, passing the event and the todo id. If we are editing, we display a form with a text input that has the current todo item's description value as a default. There are two events handled by the input element, `@blur` maps to the `toggleEditableTodo` and `@input` which maps to our `updateTodo` method. Finally the form also binds `@submit` event handler to the `toggleEditableTodo` method as well, both passing only the event and no todo id, therefore toggling off the editable view. Note we also added an id to each todo edit input, we use this in our `updated` lifecycle hook to focus the element when we toggle the edit form, since autofocus only works on page load.

At this point we have an ugly but functional todo list application. We still need to add filters for completed/uncompleted items and we need to think about our source code as things are getting a bit bloated. In the next step we'll add the filters, but think about the structure of the application and how we can improve it.
