/**
 * @route /step-2
 * @title AofL::Step 2
 * @prerender false
 */
import {template} from './template';
import AoflElement from '@aofl/web-components/aofl-element';
import styles from './template.css';

/**
 *
 * @extends {AoflElement}
 */
class Step2 extends AoflElement {
  /**
   *
   * Creates an instance of Step2.
   */
  constructor() {
    super();
    this.todos = [];
    this.todoDescription = '';
    this.idIncrementer = 0;
    this.todosCount = 0;
    this.editingTodoId;
  }

  /**
   * @readonly
   */
  static get properties() {
    return {
      todosCount: {type: Number, attribute: false},
      todos: {type: Array, attribute: false},
      todoDescription: {type: String, attribute: false},
      editingTodoId: {type: Number, attribute: false}
    };
  }

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
    this.todos = this.todos.concat([{
      id: this.idIncrementer++,
      description: this.todoDescription,
      completed: false
    }]);
    this.todoDescription = '';
    this.todosCount++;
  }

  /**
   *
   * @param {Number} id
   * @param {Boolean} completed
   */
  toggleTodo(id, completed) {
    if (completed === true) {
      this.todosCount--;
    } else {
      this.todosCount++;
    }
    this.todos = this.todos.map((todo) => todo.id === id ?
    {...todo, completed} :
    todo);
  }

  /**
   *
   * @param {Number} id
   */
  removeTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.todosCount--;
  }

  /**
   *
   * @param {Event} e
   * @param {Number} id
   */
  toggleEditableTodo(e, id) {
    e.preventDefault();
    this.editingTodoId = id;
  }

  /**
   *
   * @param {Event} e
   * @param {Number} id
   */
  updateTodo(e, id) {
    e.preventDefault();
    let description = e.target.value;
    this.todos = this.todos.map((todo) => todo.id === id ?
    {...todo, description} :
    todo);
  }

  /**
   *
   */
  updated() {
    if (this.editingTodoId !== undefined) {
      // let's make sure the input field is focused..
      this.shadowRoot.querySelector(`#todo-input-${this.editingTodoId}`).focus();
    }
  }

  /**
   *
   * @readonly
   */
  static get is() {
    return 'step-2';
  }

  /**
   *
   * @return {Object}
   */
  render() {
    return super.render(template, [styles]);
  }
}

customElements.define(Step2.is, Step2);

export default Step2;
