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
