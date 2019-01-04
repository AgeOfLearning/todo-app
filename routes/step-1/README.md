# TODO App Tutorial

The purpose of this tutorial is to demonstrate features of the AofL JS framework. In this tutorial we will use the CLI tool, data store, form validation, and as a bonus we'll even implement localization.

## Requirements

A User should be able to ...

1. add new items
1. toggle items complete/incomplete
1. filter items by completed, not completed
1. remove the filter
1. see the count of incomplete items

## Init Project

Let's start by installing the starter app.

<!-- prettier-ignore -->
```bash
npx aofl init todo-app
cd todo-app
```

_You can also follow along with the source code from this repo: https://github.com/AgeOfLearning/todo-app.<br>
Each section will have a corresponding branch that you can checkout_

## Getting started

_The code for this section is in `routes/step-1` folder in the todo app repo referenced above_

We'll startout with a naive approach without a store for state or form validation so we can learn the simple concepts first and layer up the complexity as required. We'll still need to think about the state though. For now let's just add `filteredTodos`, `todosCount` and `todoDescription` properties to our home page component and initialize those default values in the constructor. We choose the `filteredTodos` name since later we will add the option of filtering the todos. The `todoDescription` will hold the text value of the current todo in our add todo form.

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
    this.filteredTodos = [];
    this.todoDescription = '';
    this.todosCount = 0;
  }

  /**
   * @readonly
   */
  static get properties() {
    return {
      todosCount: {type: Number, attribute: false},
      filteredTodos: {type: Array, attribute: false},
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
      ${ctx.filteredTodos.map((todo) =>html`<li>${todo.description}</li>`)}
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

The template file exports a tempate function which returns a lit-html template. It receieves two arguments `ctx` and `html`, the latter is the method lit-html uses to render the template and the former is the context of our home page component. The template maps our filteredTodos in un ordered list and provides a simple form for adding todos and maps the form's input value to the component's `todoDescription` property.

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
    this.filteredTodos = [];
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
    this.filteredTodos = this.filteredTodos.concat([{
      id: this.idIncrementer,
      description: this.todoDescription
    }]);
    this.todoDescription = '';
    this.todosCount++;
  }
  ...
}
```

Congrats! At this point we have a working todo list, albeit a crude one. Let's go over the methods we've written. The `onTodoInput` method simply captures the input value from the passed Event object and assigns it to the `todoDescription` property. The `addTodo` method prevents the default form submission behavior and assigns `filteredTodos` a new array which merges the previous array with a new array containing the new todo object which, consists of an incrementing id and the `todoDescription`. We also increment the `todosCount` and reset the `todoDescription` to an empty string. Also take note that we declared and initialized `idIncrementor` in the contstructor.

Now do the following to see the progress:<br>
`npm run start:dev`

_Enter a few todos and you should see something like this:_
![image](https://user-images.githubusercontent.com/441559/50664395-c6056f00-0f61-11e9-9353-df1eb6d7175b.png)

That's it for step one!

