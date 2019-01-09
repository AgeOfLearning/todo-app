export default (ctx, html) => html`
  <button class="${ctx.filterState === '' ? 'selected' : ''}" @click="${(e) => ctx.clearFilter()}">Show All</button>
  <button class="${ctx.filterState === 'completed' ? 'selected' : ''}" @click="${(e) => ctx.filterCompleted()}">Show Remaining</button>
  <button class="${ctx.filterState === 'incomplete' ? 'selected' : ''}" @click="${(e) => ctx.filterIncomplete()}">Show Completed</button>
`;
