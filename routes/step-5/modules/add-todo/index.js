import {storeInstance} from '@aofl/store';
import {mapStatePropertiesMixin} from '@aofl/map-state-properties-mixin';
import {sdoNamespaces} from '../../../../modules/constants-enumerate';
import styles from './template.css';
import template from './template';
import AoflElement from '@aofl/web-components/aofl-element';
import {validationMixin, isRequired} from '@aofl/form-validate';
import {i18nMixin} from '@aofl/i18n-mixin';
import translations from '../../i18n';
/**
 * @summary AddTodo
 * @extends {AoflElement}
 */
class AddTodo extends i18nMixin(validationMixin(mapStatePropertiesMixin(AoflElement))) {
  /**
   * Creates an instance of AddTodo.
   */
  constructor() {
    super();
    this.storeInstance = storeInstance;
    this.todoDescription = '';
    this.validators = {
      todoDescription: {
        isRequired
      }
    };
    this.translations = translations;
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
    this.form.todoDescription.validate();
  }

  /**
   *
   * @param {Event} e
   */
  async addTodo(e) {
    e.preventDefault();
    this.form.validate();

    await this.form.validateComplete;
    console.log('this.form.valid', this.form.valid);
    if (this.form.valid) {
      this.storeInstance.commit({
        namespace: sdoNamespaces.TODOS,
        mutationId: 'insert'
      });
    }
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
    return super.render({
      default: {
        template,
        styles: [styles]
      }
    });
  }
}

window.customElements.define(AddTodo.is, AddTodo);

export default AddTodo;
