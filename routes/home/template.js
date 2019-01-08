import '../../modules/link-to-element';

export default (context, html) => html`
  <h1>Welcome to the AofL JS Todo app tutorial</h1>
  <p>This repo provides source code for the todo app tutorial <a href="https://ageoflearning.github.io/aofl/#/v1.x/todo-app/index">here</a>. It is also provided in this repo's <b>README.md</b>.<br>
  Below are links to the state of the app in each stage of the tutorial</p>
  <ul>
    <li><link-to href="/step-1">Step one (Naive approach)</link-to></li>
    <li><link-to href="/step-2">Step two (Main features)</link-to></li>
    <li><link-to href="/step-3">Step three (Architecture)</link-to></li>
  </ul>
`;
