/**
 * @route /step-5
 * @title AofL::Step 5
 * @prerender false
 */
import './modules/todos-sdo';
import {storeInstance} from '@aofl/store';
import {mapStatePropertiesMixin} from '@aofl/map-state-properties-mixin';
import {sdoNamespaces} from '../../modules/constants-enumerate';
import {template} from './template';
import AoflElement from '@aofl/web-components/aofl-element';
import styles from './template.css';
import {i18nMixin} from '@aofl/i18n-mixin';
import translations from './i18n';

/**
 *
 * @extends {AoflElement}
 */
class Step5 extends i18nMixin(mapStatePropertiesMixin(AoflElement)) {
  /**
   *
   * Creates an instance of Step5.
   */
  constructor() {
    super();
    this.storeInstance = storeInstance;
    this.editingTodoId;
    this.translations = translations;
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
    return 'step-5';
  }

  /**
   *
   */
  toggleLang() {
    const lang = document.documentElement.getAttribute('lang');
    if (lang === 'en-US') {
      document.documentElement.setAttribute('lang', 'es-US');
    } else {
      document.documentElement.setAttribute('lang', 'en-US');
    }
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
    this.todos = state.$filteredTodos;
    this.todosCount = state.$todosCount;
  }

  /**
   *
   * @return {Object}
   */
  render() {
    return super.render({
      default: {
        template,
        styles: [styles]
      }
    });
  }
}

customElements.define(Step5.is, Step5);

export default Step5;
