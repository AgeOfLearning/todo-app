/**
 * @route /
 * @title AofL::Home
 * @prerender false
 */
import styles from './template.css';
import template from './template';
import AoflElement from '@aofl/web-components/aofl-element';

/**
 * @summary Home Page
 * @extends {AoflElement}
 */
class HomePage extends AoflElement {
  /**
   * Creates an instance of Home.
   */
  constructor() {
    super();
  }

  /**
   * @readonly
   */
  static get is() {
    return 'home-page';
  }

  /**
   *
   * @return {Object}
   */
  render() {
    return super.render(template, [styles]);
  }
}

window.customElements.define(HomePage.is, HomePage);

export default HomePage;
