/**
 * It must be used on a nav component or list group.
 * Scrollspy requires position: relative; on the element you’re spying on, usually the <body>.
 * exemple : data-spy="scroll" data-target=".navbar" data-offset="0" tabindex="0"
 *    Anchors (<a>) are required and must point to an element with that id.
 */

class ScrollSpy {
  constructor(element, options) {
    this.element = element;
    this.scrollableElement =
      this.element.tagName === "BODY" ? window : this.element;
    this.options = this.getOptions(options);
    this.childrenElements = [];
    this.init();

    // this.element.addEventListener("scroll", this.init());
    // debugger;
  }

  init() {
    this.findAnchors();
    this.activeLinkIntersectionObserver();
    this.targetLinks.forEach((link) => {
      link.addEventListener("click", this.scrollToAnchor.bind(this));
    });
  }
  /**
   * Changes the appearance of the navigation bar based on the position of the target element's scroll
   * Uses the observe intersection to determine the scroll position of the target element
   * Change l'apparence de la barre de navigation en fonction de la position de défilement de l'élément cible
   * Utilise l'intersection observer pour déterminer la position du scroll de l'élément cible
   * @param {HTMLElement} element
   * @private
   * @memberof Spy
   * @method _addClassActive
   * @returns {void}
   * @todo : ajouter la classe active au lien qui est en cours de défilement
   * @todo : supprime la classe active au lien qui est en cours de défilement
   */
  activeLinkIntersectionObserver() {
    this._getChildrenElements(this.element);
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.targetLinks.forEach((link) => {
            if (link.getAttribute("href").substr(1) === entry.target.id) {
              this._addClassActive(link);
            } else {
              this._removeClassActive(link);
            }
          });
        }
      });
    }, options);

    this.childrenElements.forEach((element) => {
      observer.observe(element);
    });
  }
  /**
   * Get the configuration options passed through the data-spy attribute
   * Récupère les options de configuration passées en paramètre dans l'attribut data-spy
   * @param {Object} options
   * @returns {Object}
   * @private
   * @memberof Spy
   * @method getOptions
   */
  getOptions(config) {
    const Default = {
      spy: "",
      target: "",
      offset: 0,
    };

    const DefaultType = {
      spy: "string",
      target: "(string|element)",
      offset: "number",
    };

    const { offset } = config;
    let offsetNumber = parseInt(offset, 10); // offset must be a number

    config = {
      ...config,
      offset: isNaN(offsetNumber) ? Default.offset : offsetNumber,
    };

    return this._typeCheckConfig(config, Default, DefaultType);
  }
  /**
   * Get the target element from the href attribute of the link element
   * Récupère les élements cible dont l'attribut id est égal à l'attribut href du lien
   * @private
   * @memberof Spy
   * @method _getChildrenElements
   * @returns {void}
   */
  _getChildrenElements() {
    const items = this.childrenElements;
    this.hrefLinks.forEach((href) => {
      const item = document.getElementById(href);
      items.push(item);
    });
  }
  /**
   * Allows to scroll to the target element
   * Permet de faire défiler jusqu'à l'élément cible
   * @param {Event} event
   * @memberof Spy
   * @method scrollToAnchor
   * @private
   * @returns {void}
   */
  scrollToAnchor(event) {
    event.preventDefault();
    // this._removeClassActive(this.targetLinks);
    // this._addClassActive(event.target);
    const target = this._getElementAttributHref(event.currentTarget);
    const targetElement = this._getTargetElement(target);
    const targetPosition = this._getTargetPosition(targetElement);
    const parentPosition = this._getTargetPosition(this.element);
    const scrollPosition = targetPosition - parentPosition;
    this._;
    this.scrollableElement.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    });
    this.activeLinkIntersectionObserver();
  }
  /**
   * Returns the relative position at the top of the target element
   * Renvoie la position relative du haut de l'élément cible
   * @param {HTMLElement} element
   * @private
   * @memberof Spy
   * @method _getTargetPosition
   * @returns {number}
   */
  _getScrollOffset(element) {
    return element.getBoundingClientRect().top;
  }
  /**
   * Retrieves the height (in pixels) of the visible part of the navigation window by including, if displayed, the horizontal scroll bar.
   * Récupère la hauteur (en pixels) de la partie visible de la fenêtre de navigation en incluant, si elle est affichée, la barre de défilement horizontale.
   * @param {HTMLElement} element
   * @private
   * @memberof Spy
   * @method _getNavigationWindowHeight
   * @returns {number}
   */
  _getinnerHeightOffset(element) {
    return element === window
      ? window.innerHeight
      : element.getBoundingClientRect().height;
  }
  /**
   * Returns the scroll height of the target element
   * Renvoie la hauteur de défilement de l'élément cible
   * @param {HTMLElement} element
   * @private
   * @memberof Spy
   * @method _getTargetPosition
   * @returns {number}
   */
  _getScrollHeight(element) {
    return element === window
      ? Math.max(
          // Math.max() renvoie le plus grand nombre dans un tableau
          document.body.scrollHeight,
          document.documentElement.scrollHeight
        )
      : element.scrollHeight;
  }
  /**
   * Get the anchors & the target links of the nav or "list-group" component
   * Retourne les liens et les href du composant "nav" ou de la "list group"
   * @returns {Array}
   * @memberof Spy
   * @method findAnchors
   * @private
   */
  findAnchors() {
    this.targetLinks = [];
    this.hrefLinks = [];
    const target = this.options.target;
    const nav = document.querySelector(target);
    const links = nav.querySelectorAll("a");
    links.forEach((link) => {
      if (
        link.getAttribute("href").length > 1 &&
        link.getAttribute("href").startsWith("#")
      ) {
        this.targetLinks.push(link);
        this.hrefLinks.push(this._getElementAttributHref(link).substr(1));
      }
    });
  }
  /**
   * Add the active class to the link
   * Ajoute la classe active au lien
   * @param {HTMLElement} link
   * @private
   * @memberof Spy
   * @method _addClassActive
   * @returns {void}
   */
  _addClassActive(element) {
    element.classList.add("active");
  }
  /**
   * Remove the active class from the links
   * Supprime la classe active des liens
   * @param {HTMLElement} links
   * @private
   * @memberof Spy
   * @method _removeClassActive
   * @returns {void}
   */
  _removeClassActive(element) {
    element.classList.remove("active");
  }
  /**
   * Get the href of the links
   * récupére le href d'un lien
   * @param {HTMLElement} link
   * @returns {String}
   * @private
   * @memberof Spy
   * @method _getElementAttributHref
   */
  _getElementAttributHref(link) {
    return link.getAttribute("href");
  }
  /**
   * Find the target element
   * Trouve l'élement cible
   * @param {String} target
   * @returns {HTMLElement}
   * @private
   * @memberof Spy
   * @method _getTargetElement
   */
  _getTargetElement(target) {
    return this.element.querySelector(target);
  }
  /**
   * offsetTop returns the distance between the top of the element and the top of the parent
   * offsetTop retourne la distance entre l'élément courant et le haut du nœud offsetParent
   * @param {HTMLElement} element
   * @returns {Number}
   * @private
   * @memberof Spy
   * @method _getTargetPosition
   */
  _getTargetPosition(element) {
    return element.offsetTop;
  }
  /**
   * Check the type of the configuration options passed through the data-spy attribute
   * Vérifie que les options passées en paramètre sont bien des types attendus
   * @param {Object} config
   * @param {Object} defaultConfig
   * @param {Object} defaultTypeConfig
   * @returns {Object}
   * @memberof Spy
   */
  _typeCheckConfig(config = {}, configDefault = {}, configTypes = {}) {
    // Shoutout AngusCroll (https://goo.gl/pxwQGp)
    const toType = (obj) => {
      if (obj === null || obj === undefined) {
        return `${obj}`;
      }

      return {}.toString
        .call(obj)
        .match(/\s([a-z]+)/i)[1]
        .toLowerCase();
    };

    const isElement = (obj) => {
      if (!obj || typeof obj !== "object") {
        return false;
      }

      return typeof obj.nodeType !== "undefined";
    };

    Object.keys(configTypes).forEach((property) => {
      const expectedTypes = configTypes[property];
      const value = config[property];
      const valueType = value && isElement(value) ? "element" : toType(value);

      if (!new RegExp(expectedTypes).test(valueType)) {
        config = {
          ...config,
          [property]: configDefault[property],
        };
      } else {
        config = {
          ...config,
          [property]: value,
        };
      }
    });
    return config;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-spy]").forEach((element) => {
    new ScrollSpy(element, element.dataset);
  });
});
