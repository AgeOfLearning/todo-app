import './modules/add-todo';
import './modules/todo-filters';

export const template = (ctx, html) => html`
  <h1>Todos</h1>
  <todo-filters></todo-filters>
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

  <!-- This is not part of tutorial -->
  <a href="/step-4">Go to step 4</a>
`;
