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
  <p>Remaining todos: ${ctx.todosCount}</p>

  <!-- This is not part of tutorial -->
  <!--<a href="/step-3">Go to step 3</a>-->
`;
