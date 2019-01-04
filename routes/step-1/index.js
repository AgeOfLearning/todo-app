/**
 * @route /step-1
 * @title AofL::Step 1
 * @prerender false
 */
import {template} from './template';
import AoflElement from '@aofl/web-components/aofl-element';
import styles from './template.css';

/**
 *
 * @extends {AoflElement}
 */
class Step1 extends AoflElement {
  /**
   *
   * Creates an instance of Step1.
   */
  constructor() {
    super();
    this.todos = [];
    this.todoDescription = '';
    this.idIncrementer = 0;
    this.todosCount = 0;
  }

  /**
   * @readonly
   */
  static get properties() {
    return {
      todosCount: {type: Number, attribute: false},
      todos: {type: Array, attribute: false},
      todoDescription: {type: String, attribute: false}
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
      id: this.idIncrementer,
      description: this.todoDescription
    }]);
    this.todoDescription = '';
    this.todosCount++;
  }


  /**
   *
   * @readonly
   */
  static get is() {
    return 'step-1';
  }

  /**
   *
   * @return {Object}
   */
  render() {
    return super.render(template, [styles]);
  }
}

customElements.define(Step1.is, Step1);

export default Step1;
