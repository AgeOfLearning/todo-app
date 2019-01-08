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


## Step 3

### Architecture

At this point we should really start thinking about the structure of the application. Perhaps we start by separating concerns for different parts of the application. For example we can create separate web components for the add todo form and the filters we're going to add. This raises an impoortant point in the architecture of the application, how are the separate components going to communicate the different states they're in with one another? For example if we have an AddForm component and we add a new todo, how do we get that state update "the new todo item" to the HomePage component which displays all the todo items? You could bind the `todos` array via an attribute on the add-form component, or use a pub sub pattern but these tend to lead to unpredicatble state as mutable data objects can be mutated by any one componenet at any time. A better solution is to use a single state of truth in the form of a data store. So we'll use [@aofl/store](https://github.com/AgeOfLearning/aofl/tree/master/aofl-js-packages/store) to share state in the application as well as house any methods updating the state. This will keep our state predictable and more manageable.


Start by installing @aofl/store and @aofl/map-state-properties-mixin
```bash
npm i -S @aofl/store @aofl/map-state-properties-mixin @aofl/object-utils
```
- @aofl/store is our data store implementation.
- @aofl/map-state-properties-mixin is used to connect our components to store. It abstracts subscribing and unsubscribing to/from store based on the component's life cycle.

Okay we'll get back to the store in a moment, for now let's create our new components

First creates a modules directory in `/routes/home` to house all our components

```bash
mkdir routes/home/modules
```

Now create the components we need
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
Now update the home page component template.

```javascript
// routes/home/template.js

import './modules/add-todo';

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
              tabindex="1"
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
  <add-todo></add-todo>
  <br>
  <p>Remaining todos: ${ctx.todosCount}</p>
```

Note that we've imported the add-todo component and replaced the code we copied over to the add-form component with the add-form component tag.

Now if we visit our localhost site we'll see that the application is no longer working. That's because the methods from the HomePage component are missing in the AddTodo component. Moving them over alone however won't work, since they relied on HomePage component properties for state. This is where the store comes in. Instead of working directly on the HomePage's properties we'll use the store for all the properties we previously stored in the HomePage component.

First we'll create a new store instance and pass it a SDO (State Definition Object), which will descibe the data structure and house the mutation methods that will work on that data. Then we can commit data to the store which will accessible from any component.

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

We start by importing the store instance from @aofl/store, a contstant enumerate object that we'll use to store the namespace for the application in the state object and a helper method for deep object assignment that we'll use in the decorator methods. We initialize the application state with `todos` and `description`, then set our mutation methods for adding new todo items and for storing the current todo description. We have a single decorator for the `$todosCount`. Decorators should add/modify properties to the state based on the state changes from the mutation methods. E.g. When the todos array is updated so is the `$todosCount`. Prefixing decorator properties with `$` is just a recommended practice. The mutation methods are given the sub state which will be the state for the given namespace, but decorators are given the entire state tree, which is why the `deepAssign` method is used there.

From here we need to update HomePage component and template to remove the methods for adding new todos and storing the current description and move those event handlers to the new AddForm component. We will also need to import the store instance to the HomePage component and use the store's state for `todos` and `todosCount`. We'll use a mixin `@aofl/map-state-properties-mixin` to help update the template based on state changes.

First we need to add `@aofl/map-state-properties-mixin` to the project

```bash
npm i -S @aofl/map-state-properties-mixin
```

Now the updates to the HomePage component:
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

Great! At this point the form should be working again. Still much to do. We need to also update the edit and remove methods to use the store as well.

Let's add the store methods in the mutations object in the SDO for updating todo completion, editing the description and removing todo items:

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

Awesome! Everything should be working at this point. Hopefully by now you're starting to see the development flow. Everything starts from the strucure of the application state and corresponding mutation methods which is defined in one or more SDO's. Components are informed by and listen to changes to the state and update their views as neccessary. The components are also responsible for event handling and and committing to the store as necessary.

Let's finish the application by adding our completed/uncompleted filters and styling.

```javascript
// /routes/home/modules/todo-filters/index.js

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
// /routes/home/modules/todo-filters/template.js
export default (ctx, html) => html`
  <button class="${ctx.filterState === '' ? 'selected' : ''}" @click="${(e) => ctx.clearFilter()}">Show All</button>
  <button class="${ctx.filterState === 'completed' ? 'selected' : ''}" @click="${(e) => ctx.filterCompleted()}">Show Remaining</button>
  <button class="${ctx.filterState === 'incomplete' ? 'selected' : ''}" @click="${(e) => ctx.filterIncomplete()}">Show Completed</button>
`;
```

Now when approaching the state, we see that if we toggle between complete and incomplete todo items, we'll need to keep intact the entire `todos` array. Really all we're updating is the filter type. So we have a "filter" state property that will affect how the todo items are displayed. A perfect job for a decorator. We'll create a `$filteredTodos()` decorator method that will create a `$filteredTodos` property on the state object based on what filter is currenlty selected. It will default to the full `todos` array if none is chosen. We'll then update the HomePage component to use the `$filteredTodos` array instead of the `todos`.

```javascript
// routes/home/modules/todos-sdo/index.js
...
mutations: {
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
Wow! You've done it! Great job. We'll wrap up the last step of the tutorial with some notes and styling.
