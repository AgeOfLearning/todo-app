# TODO App Tutorial

The purpose of this tutorial is to demonstrate features of the AofL JS framework. In this tutorial we will use the CLI tool, data store and form validation.

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
Next we'll add markup for the view. AofL JS uses "lit-html" for templating and the `static get properties` method is used by "lit-html" to decide which property changes should update the view. Let's add a list for the todo items and a form to enter them in `/routes/home/template.js`.

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

The template file exports a tempate function which returns a lit-html template. It receieves two arguments `ctx` and `html`, the latter is the method lit-html uses to render the template and the former is the context of our home page component. The template maps our todos in un ordered list and provides a simple form for adding todos and binds the form's input value to the component's `todoDescription` property.

_`@submit` and `@input` are "lit-html" syntax for corresponding DOM event listeners._

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

_The code for this section is in `routes/step-2` folder in the todo app repo._

### Features


At this point we have a crude todo list app. Let's add some additional functionality to make it more useful. In this step we'll add the ability to toggle the list items as completed/uncompleted, plus the ability to remove and edit the todo items. We'll start by adding a toggle method on or HomePage component

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

The method will take the todo id, and the new toggle state. We increment or decrement the todosCount according to the new toggle state then assign `this.todos` with a new array mapped from the previous one which updates the "complete" property of the todo item matching the passed id.

Now let's add a checkbox input for each todo item and bind the `@click` event to this method.

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
/* routes/home/template.css */
...
.completed {
  text-decoration: line-through;
  font-style: italic;
}
...
```

Great! We can toggle our todo items complete and uncomplete! Let's go further and add the option to remove todo items. We will add a method in the HomePage component to remove the items, then add a delete button in the template and bind the click event on that button to the `removeTodo` method.

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

Finally let's add the ability to edit the existing todo items.

An intuitive way to make the items editable from a user standpoint would be to double click the todo item to make it editable. To do so we'll need a way to toggle the todo item to be editable as well as a method for actually updating the value. We'll require an `editingTodoId` property that will hold the id of the current todo being edited and create a `toggleEditableTodo` method to toggle that value.

Below are snippets of the updated component and template files.

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
Let's add a simple style rule for our forms so that they're inlined.

```css
/* routes/home/template.css */
...
form {
  display: inline-block;
}
...
```

So alot more going on here.

In the component:

- We added `editingTodoId` as a property.
- We added the `toggleEditableTodo` method.
- We added the `updateTodo` method.
- We used the `updated` lit-html lifecycle hook to focus the input for current editing todo since autofocus only works on page load.

In the template:

 - We iterate each todo item and check whether or not this item is being edited.
 - We use a ternary conditional to check if we are editing this item or not.
 - If not we show the item as it was before, else we show the inlined edit todo form.
 - We bind the `@dblclick` on the todo item `<span>` to our `toggleEditableTodo` method so double clicking an item will make editable.
 - We bind the edit input `@blur` event to our `toggleEditableTodo` method so if the input loses focus it will toggle the todo item back.
 - We bind the `@submit` event on the form to our `toggleEditableTodo` method so that hitting "enter" will also toggle the todo item back.
 - We bind the `@input` event on the edit input field to our `updateTodo` method, which instantly updates the todo item as it's being typed.


At this point we have an ugly but functional todo list application. We still need to add filters for completed/uncompleted items and we should start thinking about the structure of the application and how we can improve it.


## Step 3

_The code for this section is in `routes/step-3` folder in the todo app repo._

### Architecture

Currently all the application and view logic is housed in the HomePage component which, violates the SoC (Separation of Concerns) principle and makes the source code harder to reason about. We can improve this by separating web components for the add todo form and the filters we're going to add.

This raises an important question. How are the separate components going to share state with one another? For example if we have an `<add-todo>` component and we add a new todo, how do we get that state update "the new todo item" to the HomePage component which displays all the todo items? You could bind the `todos` array via an attribute on the add-todo component, or use a pub sub pattern or something similar but these tend to unpredicatble state as mutable data objects can be changed by any one component or module at any given time and debugging such issues becomes very difficult. A better solution is to use a single state of truth in the form of a data store. So we'll use [@aofl/store](https://github.com/AgeOfLearning/aofl/tree/master/aofl-js-packages/store) to share state in the application as well as house methods which update state. This will keep our state predictable and more manageable.


Start by installing `@aofl/store`, `@aofl/map-state-properties-mixin` and `@aofl/object-utils`
```bash
npm i -S @aofl/store @aofl/map-state-properties-mixin @aofl/object-utils
```
- @aofl/store is our data store implementation.
- @aofl/map-state-properties-mixin is used to connect our components to the store. It abstracts subscribing and unsubscribing to/from the store based on the component's life cycle.
- @aofl/object-utils provides a `deepAssign` method, which does deep copy / merging of objects.

Okay we'll get back to the store in a moment, for now let's create our new components.

First create a modules directory in `/routes/home` to house all our components.

```bash
mkdir routes/home/modules
```

We can use the cli tool to generate the components we need.

```bash
npx aofl g c routes/home/modules/add-todo
npx aofl g c routes/home/modules/todo-filters
```
Let's start with add todo and move over the markup we're currently using in `routes/home/template.js` to `/routes/home/modules/add-todo/template.js`.

```javascript
// routes/home/modules/add-todo/templates.js

export default (context, html) => html`
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
`;
```
In the HomePage template we'll import the add-todo component and replace the code we copied over to the add-todo component with the `<add-todo>` component tag.

```javascript
// routes/home/template.js

import './modules/add-todo';

export const template = (ctx, html) => html`
  <h1>Todos</h1>
  ...
  <add-todo></add-todo>
  <br>
  <p>Remaining todos: ${ctx.todosCount}</p>
  ...
```

Now if we visit our localhost site we'll see that the application is no longer working. That's because the methods from the HomePage component are missing in the AddTodo component. Moving them over alone however won't work, since they relied on HomePage component properties for state. This is where the store comes in. Instead of working directly on the HomePage's properties we'll use the store to manage the state of the application.

First we'll create a new store instance and pass it a SDO (State Definition Object).

The SDO is an object the defines the data structure and provides mutation and decorator methods that will update and decorate the state as necessary.

Let's add a todos-sdo directory in `routes/home/modules`.

```bash
mkdir routes/home/modules/todos-sdo
```

Next let's write the sdo

```javascript
// routes/home/modules/todos-sdo/index.js

import {storeInstance} from '@aofl/store';
import {sdoNamespaces} from '../../../../modules/constants-enumerate';
import {deepAssign} from '@aofl/object-utils';

let idIncrementer = 0;
const sdo = {
  namespace: sdoNamespaces.TODOS,
  mutations: {
    init(payload = {}) {
      return Object.assign({
        todos: [],
        description: ''
      }, payload);
    },
    updateTodoDescription(subState, description) {
      return Object.assign({}, subState, {
        description
      });
    },
    insert(subState) {
      return Object.assign({}, subState, {
        todos: [
          ...subState.todos,
          {
            id: idIncrementer++,
            description: subState.description,
            completed: false
          }
        ],
        description: '' // reset desciption to an empty string
      });
    }
  },
  decorators: [
    function $todosCount(_nextState) {
      return deepAssign(_nextState, sdoNamespaces.TODOS, {
        $todosCount: _nextState[sdoNamespaces.TODOS].todos.filter((todo) => !todo.completed).length
      });
    }
  ]
};

storeInstance.addState(sdo);

```

We start by importing the store instance from @aofl/store, a contstant enumerate object that we'll use to store the namespace for the application and a helper method for deep object copying that we'll use in decorator methods. We initialize the application state with `todos` and `description`, then set our mutation methods for adding new todo items and for storing the current todo description. We have a single decorator for the `$todosCount`. Decorators should add/modify properties to the state based on the state changes from the mutation methods. E.g. When the todos array is updated so is the `$todosCount`. Prefixing decorator properties with `$` is just a recommended practice. The mutation methods are given the sub state which will be the state for the given namespace, but decorators are given the entire state tree, which is why the `deepAssign` method is used there.

From here we need to update HomePage component and template to remove the methods for adding new todos, storing the current description and move those event handlers to the new AddForm component. We will also need to import the store instance to the HomePage component and use the store's state for `todos` and `todosCount`. We'll use a mixin `@aofl/map-state-properties-mixin` to help update the template based on state changes.

Here's the updated HomePage component:

```javascript
// routes/home/index.js

/**
 * @route /
 * @title AofL::Home
 * @prerender false
 */
import './modules/todos-sdo';
import {storeInstance} from '@aofl/store';
import {mapStatePropertiesMixin} from '@aofl/map-state-properties-mixin';
import {sdoNamespaces} from '../../modules/constants-enumerate';
import {template} from './template';
import AoflElement from '@aofl/web-components/aofl-element';
import styles from './template.css';


/**
 *
 * @extends {AoflElement}
 */
class HomePage extends mapStatePropertiesMixin(AoflElement) {
  /**
   *
   * Creates an instance of HomePage.
   */
  constructor() {
    super();
    this.storeInstance = storeInstance;
    this.editingTodoId;
  }

  /**
   * @readonly
   */
  static get properties() {
    return {
      todosCount: {type: Number, attribute: false},
      todos: {type: Array, attribute: false},
      editingTodoId: {type: Number, attribute: false}
    };
  }

  /**
   *
   * @readonly
   */
  static get is() {
    return 'home-page';
  }

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
    this.todos = this.todos.map((todo) => todo.id === id ?
    {...todo, completed} :
    todo);
  }

  /**
   *
   * @param {Number} id
   */
  removeTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.todosCount--;
  }

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
   *
   */
  updated() {
    if (this.editingTodoId !== undefined) {
      // let's make sure the input field is focused..
      this.shadowRoot.querySelector(`#todo-input-${this.editingTodoId}`).focus();
    }
  }

  /**
   *
   */
  mapStateProperties() {
    const state = this.storeInstance.getState()[sdoNamespaces.TODOS];
    this.todos = state.todos;
    this.todosCount = state.$todosCount;
  }

  /**
   *
   * @return {Object}
   */
  render() {
    return super.render(template, [styles]);
  }
}

customElements.define(HomePage.is, HomePage);

export default HomePage;

```

Now let's update the AddForm component to handle the add todo fom events and link it with the store.

```javascript
import {storeInstance} from '@aofl/store';
import {mapStatePropertiesMixin} from '@aofl/map-state-properties-mixin';
import {sdoNamespaces} from '../../../../modules/constants-enumerate';
import styles from './template.css';
import template from './template';
import AoflElement from '@aofl/web-components/aofl-element';

/**
 * @summary AddTodo
 * @extends {AoflElement}
 */
class AddTodo extends mapStatePropertiesMixin(AoflElement) {
  /**
   * Creates an instance of AddTodo.
   */
  constructor() {
    super();
    this.storeInstance = storeInstance;
    this.todoDescription = '';
  }

  /**
   * @readonly
   */
  static get is() {
    return 'add-todo';
  }

  /**
   * @readonly
   */
  static get properties() {
    return {
      todoDescription: {type: String, attribute: false}
    };
  }

  /**
   *
   * @param {Event} e
   */
  onTodoInput(e) {
    this.storeInstance.commit({
      namespace: sdoNamespaces.TODOS,
      mutationId: 'updateTodoDescription',
      payload: e.target.value
    });
  }

  /**
   *
   * @param {Event} e
   */
  addTodo(e) {
    e.preventDefault();
    this.storeInstance.commit({
      namespace: sdoNamespaces.TODOS,
      mutationId: 'insert'
    });
  }

  /**
   *
   */
  mapStateProperties() {
    const state = this.storeInstance.getState()[sdoNamespaces.TODOS];
    this.todoDescription = state.description;
  }
  /**
   *
   * @return {Object}
   */
  render() {
    return super.render(template, [styles]);
  }
}

window.customElements.define(AddTodo.is, AddTodo);

export default AddTodo;
```

Great! At this point the form should be working again. Still much to do. We also need to update the edit and remove methods to use the store as well. Let's add the store methods in the SDO's mutation object  for updating todo completion, editing the description and removing todo items.

```javascript
// routes/home/modules/todos-sdo/index.js
...
updateTodoCompletion(subState, {id, completed}) {
  return Object.assign({}, subState, {
    todos: subState.todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          completed
        };
      } else {
        return todo;
      }
    })
  });
},
editTodoDescription(subState, {id, description}) {
  return Object.assign({}, subState, {
    todos: subState.todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          description
        };
      } else {
        return todo;
      }
    })
  });
},
remove(subState, id) {
  return Object.assign({}, subState, {
    todos: subState.todos.filter((todo) => todo.id !== id)
  });
}
...
```

Now update the HomePage component event handlers to use the store.

```javascript
// routes/home/index.js
...
/**
 *
 * @param {Number} id
 * @param {Boolean} completed
 */
toggleTodo(id, completed) {
  this.storeInstance.commit({
    namespace: sdoNamespaces.TODOS,
    mutationId: 'updateTodoCompletion',
    payload: {
      id,
      completed
    }
  });
}

/**
 *
 * @param {Number} id
 */
removeTodo(id) {
  this.storeInstance.commit({
    namespace: sdoNamespaces.TODOS,
    mutationId: 'remove',
    payload: id
  });
}

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
  this.storeInstance.commit({
    namespace: sdoNamespaces.TODOS,
    mutationId: 'editTodoDescription',
    payload: {
      id,
      description
    }
  });
}
...
```

Awesome! Everything should be working at this point. Hopefully by now you're getting a feel for the development flow. Now let's add the completed/uncompleted filters.

Update the TodoFilters component and template:

```javascript
// routes/home/modules/todo-filters/index.js

import styles from './template.css';
import template from './template';
import AoflElement from '@aofl/web-components/aofl-element';
import {sdoNamespaces} from '../../../../modules/constants-enumerate';
import {storeInstance} from '@aofl/store';
import {mapStatePropertiesMixin} from '@aofl/map-state-properties-mixin';

/**
 * @summary TodoFilters
 * @extends {AoflElement}
 */
class TodoFilters extends mapStatePropertiesMixin(AoflElement) {
  /**
   * Creates an instance of TodoFilters.
   */
  constructor() {
    super();
    this.filterState = '';
    this.storeInstance = storeInstance;
  }

  /**
   *
   */
  static get properties() {
    return {
      filterState: {type: String}
    };
  }

  /**
   *
   */
  clearFilter() {
    storeInstance.commit({
      namespace: sdoNamespaces.TODOS,
      mutationId: 'removeFilter'
    });
  }

  /**
   *
   */
  filterCompleted() {
    storeInstance.commit({
      namespace: sdoNamespaces.TODOS,
      mutationId: 'filterCompleted'
    });
  }

  /**
   *
   */
  filterIncomplete() {
    storeInstance.commit({
      namespace: sdoNamespaces.TODOS,
      mutationId: 'filterIncomplete'
    });
  }

  /**
   *
   */
  mapStateProperties() {
    const state = this.storeInstance.getState();
    this.filterState = state[sdoNamespaces.TODOS].filter;
  }

  /**
   * @readonly
   */
  static get is() {
    return 'todo-filters';
  }

  /**
   *
   * @return {Object}
   */
  render() {
    return super.render(template, [styles]);
  }
}

window.customElements.define(TodoFilters.is, TodoFilters);

export default TodoFilters;

```

```javascript
// routes/home/modules/todo-filters/template.js

export default (ctx, html) => html`
  <button class="${ctx.filterState === '' ? 'selected' : ''}" @click="${(e) => ctx.clearFilter()}">Show All</button>
  <button class="${ctx.filterState === 'completed' ? 'selected' : ''}" @click="${(e) => ctx.filterCompleted()}">Show Remaining</button>
  <button class="${ctx.filterState === 'incomplete' ? 'selected' : ''}" @click="${(e) => ctx.filterIncomplete()}">Show Completed</button>
`;
```
In the TodoFilters component we have a couple of event handler methods that run respective store commits and in the template we have a simple set of `<button>` tags that bind `@click` events to those methods.

Now when approaching the state, we see that if we toggle between complete and incomplete todo items, we'll need to keep intact the original `todos` array. When a filter button is clicked we'll update the `filter` property in our state object and from that state change we'll create a new filtered todos array, this is exactly what decorator methods are designed for. We'll create a `$filteredTodos()` decorator method that will create a `$filteredTodos` property on the state object based on what filter is currently selected. It will default to the full `todos` array if none is chosen, then we'll update the HomePage component to use the `$filteredTodos` array instead of the `todos`.

Here's the updated SDO:

```javascript
// routes/home/modules/todos-sdo/index.js
...
const sdo = {
  namespace: sdoNamespaces.TODOS,
  mutations: {
    init(payload = {}) {
      return Object.assign({
        todos: [],
        description: '',
        filter: ''
      }, payload);
    },
    ...
    filterCompleted(subState) {
      return Object.assign({}, subState, {
        filter: 'completed'
      });
    },
    filterIncomplete(subState) {
      return Object.assign({}, subState, {
        filter: 'incomplete'
      });
    },
    removeFilter(subState) {
      return Object.assign({}, subState, {
        filter: ''
      });
    }
  },
  decorators: [
    function $todosCount(_nextState) {
      return deepAssign(_nextState, sdoNamespaces.TODOS, {
        $todosCount: _nextState[sdoNamespaces.TODOS].todos.filter((todo) => !todo.completed).length
      });
    },
    function $filteredTodos(_nextState) {
      const state = storeInstance.getState();
      let nextState = _nextState;

      if (typeof nextState[sdoNamespaces.TODOS].$filteredTodos === 'undefined' || // first run?
      nextState[sdoNamespaces.TODOS] !== state[sdoNamespaces.TODOS]) {
        let $filteredTodos = [...nextState[sdoNamespaces.TODOS].todos];

        if (nextState[sdoNamespaces.TODOS].filter === 'completed') {
          $filteredTodos = nextState[sdoNamespaces.TODOS].todos
          .filter((todo) => todo.completed === false);
        } else if (nextState[sdoNamespaces.TODOS].filter === 'incomplete') {
          $filteredTodos = nextState[sdoNamespaces.TODOS].todos
          .filter((todo) => todo.completed === true);
        }

        nextState = deepAssign(nextState, sdoNamespaces.TODOS, {
          $filteredTodos
        });
      }
      return nextState;
    }
  ]
}
...
```

Now update HomePage component to use `$filteredTodos`

```javascript
// routes/home/index.js
...
/**
 *
 */
mapStateProperties() {
  const state = this.storeInstance.getState()[sdoNamespaces.TODOS];
  this.todos = state.$filteredTodos;
  this.todosCount = state.$todosCount;
}
...
```
That wraps up step 3 of the tutorial. In the last step we'll add simple form validation and styling to improve the interface.

## Step 4

_The code for this section is in `routes/step-4` folder in the todo app repo._

Let's start with styling so we have something better to look at!

Update the following template.css files:

```css
/* routes/home/template.css */

:host {
  display: block;
  padding: 3em;
  max-width: 600px;
}

.completed {
  text-decoration: line-through;
  font-style: italic;
}

ul {
  padding: 0;
  margin: 0;
  margin-top: 2em;
}

li {
  list-style: none;
  cursor: pointer;
}

li span.desc {
  vertical-align: top;
}

li .remove svg {
  vertical-align: top;
  position: relative;
  vertical-align: top;
  top: 5px;
}

li .remove svg:hover {
  fill: red;
}


form {
  display: inline-block;
}

input[type="text"] {
  border: 0px;
  border-bottom: 1px solid #ccc;
  padding: .25em;
  position: relative;
  top: -5px;
}

input[type="text"]:focus {
  outline: 0px;
}
```

```css
/* routes/home/modules/add-todo/template.css */

:host {
  display: inline-block;
  position: relative;
  width: 100%;
}

input {
  height: 45px;
  width: 100%;
  padding: 5px;
  line-height: 45px;
  font-size: 17px;
  margin: 0;
  border: 0px;
  border-bottom: 1px solid #ccc;
}

input:focus {
  outline: 0px;
  border-bottom: 1px solid #333;
}

button {
  height: 45px;
  line-height: 45px;
  padding: 0 .5em;
  margin: 0;
  position: absolute;
  background: transparent;
  top: 0px;
  right: 0px;
  border: 0px;
}
```

```css
/* routes/home/modules/todo-filters.css */

:host {
  display: inline-block;
}

button {
  padding: .5em;
  border: 1px solid #333;
}

.selected {
  background: #333;
  color: white;
}

button:focus {
  outline: 0;
}
```

Now let's update our HomePage template to use some nice svg icons in place of the default checkbox input and delete buttons.

```javascript
// routes/home/template.js

import './modules/add-todo';
import './modules/todo-filters';

export const template = (ctx, html) => html`
  <h1>Todos</h1>
  <todo-filters></todo-filters>
  <ul>
    ${ctx.todos.map((todo) => html`
      <li>
      <span @click="${(e) => ctx.toggleTodo(todo.id, !todo.completed)}">
          ${todo.completed ? html`<i class="checked"><svg focusable="false" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M10.9854 15.0752l-3.546-3.58 1.066-1.056 2.486 2.509 4.509-4.509 1.06 1.061-5.575 5.575zm1.015-12.075c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9z"></path></svg></i>`
          : html`<i class="unchecked"><svg focusable="false" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill-rule="evenodd"><path d="M12 20c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8m0-17c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9"></path></g></svg></i>`}
        </span>
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
            class="${todo.completed ? 'completed' : ''} desc"
          >
            ${todo.description}
          </span>
        `}
        <span class="remove" @click="${(e) => ctx.removeTodo(todo.id)}">&nbsp; &nbsp;
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/></svg>
        </span>
      </li>
    `)}
  </ul>
  <add-todo></add-todo>
  <br>
  <p>Remaining todos: ${ctx.todosCount}</p>

  <!-- This is not part of tutorial -->
  <a href="/step-4">Go to step 4</a>
`;
```

Now let's finish the application by adding form validation. Currently you are able to enter an empty value for a todo item. To fix that we'll add a validation mixin from `@aofl/form-validate`, add some validation logic and update the view to reflect the form's validation.

First we'll install `@aofl/form-validate`
```bash
npm i -S @aofl/form-validate
```

Now let's implement the validation mixin to the AddTodo component.

```javascript
// routes/home/modules/add-todo/index.js

import {storeInstance} from '@aofl/store';
import {mapStatePropertiesMixin} from '@aofl/map-state-properties-mixin';
import {sdoNamespaces} from '../../../../modules/constants-enumerate';
import styles from './template.css';
import template from './template';
import AoflElement from '@aofl/web-components/aofl-element';
import {validationMixin, isRequired} from '@aofl/form-validate';

/**
 * @summary AddTodo
 * @extends {AoflElement}
 */
class AddTodo extends validationMixin(mapStatePropertiesMixin(AoflElement)) {
  /**
   * Creates an instance of AddTodo.
   */
  constructor() {
    super();
    this.storeInstance = storeInstance;
    this.todoDescription = '';
    this.validators = {
      todoDescription: {
        isRequired
      }
    };
  }

  /**
   * @readonly
   */
  static get is() {
    return 'add-todo';
  }

  /**
   * @readonly
   */
  static get properties() {
    return {
      todoDescription: {type: String, attribute: false}
    };
  }

  /**
   *
   * @param {Event} e
   */
  onTodoInput(e) {
    this.storeInstance.commit({
      namespace: sdoNamespaces.TODOS,
      mutationId: 'updateTodoDescription',
      payload: e.target.value
    });
    this.form.todoDescription.validate();
  }

  /**
   *
   * @param {Event} e
   */
  async addTodo(e) {
    e.preventDefault();
    this.form.validate();

    await this.form.validateComplete;

    if (this.form.valid) {
      this.storeInstance.commit({
        namespace: sdoNamespaces.TODOS,
        mutationId: 'insert'
      });
    }
  }

  /**
   *
   */
  mapStateProperties() {
    const state = this.storeInstance.getState()[sdoNamespaces.TODOS];
    this.todoDescription = state.description;
  }
  /**
   *
   * @return {Object}
   */
  render() {
    return super.render(template, [styles]);
  }
}

window.customElements.define(AddTodo.is, AddTodo);

export default AddTodo;
```

Here we mixin the `validationMixin` and use a built in `isRequired` validation method to make sure the given field of interest is not empty. We setup a validation object `this.validators` which describes what component properties to validate and what validation methods to use. Here we just use the build `isRequired` method. We run validation in the `@input` event handler and verify form validation in the `@submit` event handler. Now let's update the view to reflect when the form is invalid.

We'll toggle the disabled attribute on the add button as needed and add a custom message when the user attempts to enter an empty todo item.

```javascript
// routes/home/modules/add-todo/template.js

export default (ctx, html) => html`
  <form @submit=${(e) => ctx.addTodo(e)}>
    <input
      type="text"
      autofocus
      autocomplete="off"
      placeholder="I need to..."
      .value=${ctx.todoDescription}
      @input=${(e) => ctx.onTodoInput(e)}>
    <button type="submit" ?disabled=${!ctx.form.valid}>Add</button>
    ${ctx.form.todoDescription.isRequired.valid ? '' : html`
      <p>Description is required</p>
    `}
  </form>
`;
```

Congratulations :)

Let's recap what we achieved here. We started an AofL JS project from scratch and initally built the application entirely in the HomePage component. As the features and project size increased we refactored it to use specialized components and a central state with `@aofl/store`. We setup a SDO (State Definition Object) based on the application's requirements, and subscribed our components to state changes with `@aofl/map-state-properties-mixin`. We finished up by adding form validation with the help of `@aofl/form-validate`.

We have separated presentation and business logic and our components are merely proxies between different APIs. Inputs and buttons allow our components to get data from the user the same way our components can make calls to web-services to retrieve information. In this uni-directional flow of data we always commit the raw data, regardless of its source, to the data store and use decorators to process the raw data for the presentation layer. The decorated data is then mapped to the components' template.
