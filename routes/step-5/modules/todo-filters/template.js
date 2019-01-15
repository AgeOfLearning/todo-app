import {until} from 'lit-html/directives/until';

export default (ctx, html) => html`
  <button class="${ctx.filterState === '' ? 'selected' : ''}" @click="${(e) => ctx.clearFilter()}">${until(ctx.__('<tt-cF2gf405>', 'Show All'))}</button>
  <button class="${ctx.filterState === 'completed' ? 'selected' : ''}" @click="${(e) => ctx.filterCompleted()}">${until(ctx.__('<tt-ROGvM4zZ>', 'Show Remaining'))}</button>
  <button class="${ctx.filterState === 'incomplete' ? 'selected' : ''}" @click="${(e) => ctx.filterIncomplete()}">${until(ctx.__('<tt-eNjszQ3d>', 'Show Completed'))}</button>
`;
