import {storeInstance} from '@aofl/store';
import {mapStatePropertiesMixin} from '@aofl/map-state-properties-mixin';
import {sdoNamespaces} from '../../../../modules/constants-enumerate';
import styles from './template.css';
import template from './template';
import AoflElement from '@aofl/web-components/aofl-element';

/**
 * @summary AddTodo
 * @extends {AoflElement}
 */
class AddTodo extends mapStatePropertiesMixin(AoflElement) {
  /**
   * Creates an instance of AddTodo.
   */
  constructor() {
    super();
    this.storeInstance = storeInstance;
    this.todoDescription = '';
  }

  /**
   * @readonly
   */
  static get is() {
    return 'add-todo';
  }

  /**
   * @readonly
   */
  static get properties() {
    return {
      todoDescription: {type: String, attribute: false}
    };
  }

  /**
   *
   * @param {Event} e
   */
  onTodoInput(e) {
    this.storeInstance.commit({
      namespace: sdoNamespaces.TODOS,
      mutationId: 'updateTodoDescription',
      payload: e.target.value
    });
  }

  /**
   *
   * @param {Event} e
   */
  addTodo(e) {
    e.preventDefault();
    this.storeInstance.commit({
      namespace: sdoNamespaces.TODOS,
      mutationId: 'insert'
    });
  }

  /**
   *
   */
  mapStateProperties() {
    const state = this.storeInstance.getState()[sdoNamespaces.TODOS];
    this.todoDescription = state.description;
  }
  /**
   *
   * @return {Object}
   */
  render() {
    return super.render(template, [styles]);
  }
}

window.customElements.define(AddTodo.is, AddTodo);

export default AddTodo;
