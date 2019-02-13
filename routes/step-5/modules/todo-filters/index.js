import styles from './template.css';
import template from './template';
import AoflElement from '@aofl/web-components/aofl-element';
import {sdoNamespaces} from '../../../../modules/constants-enumerate';
import {storeInstance} from '@aofl/store';
import {mapStatePropertiesMixin} from '@aofl/map-state-properties-mixin';
import {i18nMixin} from '@aofl/i18n-mixin';
import translations from '../../i18n';

/**
 * @summary TodoFilters
 * @extends {AoflElement}
 */
class TodoFilters extends i18nMixin(mapStatePropertiesMixin(AoflElement)) {
  /**
   * Creates an instance of TodoFilters.
   */
  constructor() {
    super();
    this.filterState = '';
    this.storeInstance = storeInstance;
    this.translations = translations;
  }

  /**
   *
   */
  static get properties() {
    return {
      filterState: {type: String}
    };
  }

  /**
   *
   */
  clearFilter() {
    storeInstance.commit({
      namespace: sdoNamespaces.TODOS,
      mutationId: 'removeFilter'
    });
  }

  /**
   *
   */
  filterCompleted() {
    storeInstance.commit({
      namespace: sdoNamespaces.TODOS,
      mutationId: 'filterCompleted'
    });
  }

  /**
   *
   */
  filterIncomplete() {
    storeInstance.commit({
      namespace: sdoNamespaces.TODOS,
      mutationId: 'filterIncomplete'
    });
  }

  /**
   *
   */
  mapStateProperties() {
    const state = this.storeInstance.getState();
    this.filterState = state[sdoNamespaces.TODOS].filter;
  }

  /**
   * @readonly
   */
  static get is() {
    return 'todo-filters-step-5';
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

window.customElements.define(TodoFilters.is, TodoFilters);

export default TodoFilters;
