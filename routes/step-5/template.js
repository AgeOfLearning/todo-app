import './modules/add-todo';
import './modules/todo-filters';
import {until} from 'lit-html/directives/until';

export const template = (ctx, html) => html`
  <h1>${until(ctx.__('<tt-oqTGNagV>', 'Todos'))}</h1>
  <todo-filters-step-5></todo-filters-step-5>
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
  <add-todo-step-5></add-todo-step-5>
  <br>
  <p>${until(ctx._r(ctx.__('<tt-1bod6V5J>', 'Remaining todos: %r1%'), ctx.todosCount))}</p>
  <button @click="${() => ctx.toggleLang()}">En/Es</button>
`;
