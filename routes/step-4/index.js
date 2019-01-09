/**
 * @route /step-4
 * @title AofL::Step 4
 * @prerender false
 */
import './modules/todos-sdo';
import {storeInstance} from '@aofl/store';
import {mapStatePropertiesMixin} from '@aofl/map-state-properties-mixin';
import {sdoNamespaces} from '../../modules/constants-enumerate';
import {template} from './template';
import AoflElement from '@aofl/web-components/aofl-element';
import styles from './template.css';


/**
 *
 * @extends {AoflElement}
 */
class Step4 extends mapStatePropertiesMixin(AoflElement) {
  /**
   *
   * Creates an instance of Step4.
   */
  constructor() {
    super();
    this.storeInstance = storeInstance;
    this.editingTodoId;
  }

  /**
   * @readonly
   */
  static get properties() {
    return {
      todosCount: {type: Number, attribute: false},
      todos: {type: Array, attribute: false},
      editingTodoId: {type: Number, attribute: false}
    };
  }

  /**
   *
   * @readonly
   */
  static get is() {
    return 'step-4';
  }

  /**
   *
   * @param {Number} id
   * @param {Boolean} completed
   */
  toggleTodo(id, completed) {
    this.storeInstance.commit({
      namespace: sdoNamespaces.TODOS,
      mutationId: 'updateTodoCompletion',
      payload: {
        id,
        completed
      }
    });
  }

  /**
   *
   * @param {Number} id
   */
  removeTodo(id) {
    this.storeInstance.commit({
      namespace: sdoNamespaces.TODOS,
      mutationId: 'remove',
      payload: id
    });
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
    this.storeInstance.commit({
      namespace: sdoNamespaces.TODOS,
      mutationId: 'editTodoDescription',
      payload: {
        id,
        description
      }
    });
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
   */
  mapStateProperties() {
    const state = this.storeInstance.getState()[sdoNamespaces.TODOS];
    console.log(state);
    this.todos = state.$filteredTodos;
    this.todosCount = state.$todosCount;
  }

  /**
   *
   * @return {Object}
   */
  render() {
    return super.render(template, [styles]);
  }
}

customElements.define(Step4.is, Step4);

export default Step4;
