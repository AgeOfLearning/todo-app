import {until} from 'lit-html/directives/until';

// console.log('asyncAppend', asyncAppend);
export default (ctx, html) => html`
  <form @submit=${(e) => ctx.addTodo(e)}>
    <input
      type="text"
      autofocus
      autocomplete="off"
      placeholder="${asyncAppend(html`I need to...`)}"
      .value=${ctx.todoDescription}
      @input=${(e) => ctx.onTodoInput(e)}>
    <button type="submit" ?disabled=${!ctx.form.valid}>${until(ctx.__('<tt-mNs8bpRy>', 'Add'))}</button>
    ${ctx.form.todoDescription.isRequired.valid ? '' : html`
      <p>${until(ctx.__('<tt-47xN0HE7>', 'Description is required'))}</p>
    `}
  </form>
`;
