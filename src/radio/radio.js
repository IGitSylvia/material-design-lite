/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * The MaterialRadio class wraps a Material Design radio component.
 *
 * @export
 */
class MaterialRadio extends MaterialComponent {
  /**
   * Initialize radio from a DOM node.
   *
   * @param {Element} root The element being upgraded.
   */
  constructor(root) {
    super(root);

    // Look for required sub-nodes in the root's DOM.
    this.input_ = root.querySelector(`.${MaterialRadio.classes_.INPUT}`);
    if (!this.input_) {
      throw new Error(
          `MaterialRadio missing ${MaterialRadio.classes_.INPUT} node.`);
    }

    // Initialize event listeners.
    this.changeListener_ = this.onChange_.bind(this);
    this.focusListener_ =
        () => this.root_.classList.add(MaterialRadio.classes_.IS_FOCUSED);
    this.blurListener_ =
        () => this.root_.classList.remove(MaterialRadio.classes_.IS_FOCUSED);
    this.mouseUpListener_ = this.blur_.bind(this);

    // Finalize initialization.
    this.init_();
  }

  /**
   * String constants used in this component.
   *
   * @override
   * @protected
   */
  static get strings_() {
    return {
      CLASS_NAME: 'MaterialRadio'
    };
  }

  /**
   * CSS classes used in this component.
   *
   * @override
   * @protected
   */
  static get classes_() {
    return {
      ROOT: 'mdl-radio',
      JS: 'mdl-js-radio',
      INPUT: 'mdl-radio__input',

      IS_FOCUSED: 'is-focused',
      IS_DISABLED: 'is-disabled',
      IS_CHECKED: 'is-checked',
      IS_UPGRADED: 'is-upgraded'
    };
  }

  /**
   * Attach all listeners to the DOM.
   *
   * @override
   * @export
   */
  addEventListeners() {
    this.input_.addEventListener('change', this.changeListener_);
    this.input_.addEventListener('focus', this.focusListener_);
    this.input_.addEventListener('blur', this.blurListener_);
    this.root_.addEventListener('mouseup', this.mouseUpListener_);
  }

  /**
   * Remove all listeners from the DOM.
   *
   * @override
   * @export
   */
  removeEventListeners() {
    this.input_.removeEventListener('change', this.changeListener_);
    this.input_.removeEventListener('focus', this.focusListener_);
    this.input_.removeEventListener('blur', this.blurListener_);
    this.root_.removeEventListener('mouseup', this.mouseUpListener_);
  }

  /**
   * Set "checked" value on radio.
   *
   * @param {boolean} value The value to set the property to.
   * @export
   */
  set checked(value) {
    this.input_.checked = value;
    this.refresh();
  }

  /**
   * Return "checked" value on radio.
   *
   * @return {boolean} The current value of the property.
   * @export
   */
  get checked() {
    return this.input_.checked;
  }

  /**
   * Disable / enable the radio component.
   *
   * @param {boolean} value The value to set the property to.
   * @export
   */
  set disabled(value) {
    this.input_.disabled = value;
    this.refresh();
  }

  /**
   * Return whether the radio component is disabled or enabled.
   *
   * @return {boolean} The current value of the property.
   * @export
   */
  get disabled() {
    return this.input_.disabled;
  }

  /**
   * Run a visual refresh on the component, in case it's gone out of sync.
   *
   * @override
   * @export
   */
  refresh() {
    this.checkDisabled_();
    this.checkToggleState_();
  }

  /**
   * Add blur.
   *
   * @private
   */
  blur_() {
    requestAnimationFrame(() => this.input_.blur());
  }

  /**
   * Update all radio buttons on the page.
   *
   * Since other radio buttons don't get change events, we need to look for
   * them to refresh their appearance.
   * @private
   */
  onChange_() {
    let radios = document.querySelectorAll(`.${MaterialRadio.classes_.JS}`);
    for (let i = 0; i < radios.length; i++) {
      let input = radios[i].querySelector(`.${MaterialRadio.classes_.INPUT}`);
      // Different name == different group, so no point updating those.
      if (input &&
          input.getAttribute('name') === this.input_.getAttribute('name')) {
        radios[i][MaterialRadio.strings_.CLASS_NAME].refresh();
      }
    }
  }

  /**
   * Check the input's toggle state and update display.
   *
   * @private
   */
  checkToggleState_() {
    if (this.input_.checked) {
      this.root_.classList.add(MaterialRadio.classes_.IS_CHECKED);
    } else {
      this.root_.classList.remove(MaterialRadio.classes_.IS_CHECKED);
    }
  }

  /**
   * Check the input's disabled state and update display.
   *
   * @private
   */
  checkDisabled_() {
    if (this.input_.disabled) {
      this.root_.classList.add(MaterialRadio.classes_.IS_DISABLED);
    } else {
      this.root_.classList.remove(MaterialRadio.classes_.IS_DISABLED);
    }
  }
}

// Initialize all self-managed components in the document.
MaterialRadio.initComponents(document);
