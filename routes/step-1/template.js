export const template = (ctx, html) => html`
  <h1>Todos</h1>
  <ul>
    ${ctx.todos.map((todo) =>html`<li>${todo.description}</li>`)}
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

  <!-- This is not part of tutorial -->
  <a href="/step-2">Go to step 2</a>
`;
