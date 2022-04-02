/**
 * It must be used on a nav component or list group.
 * Scrollspy requires position: relative; on the element you’re spying on, usually the <body>.
 * Anchors (<a>) are required and must point to an element with that id.
 * exemple : data-spy="scroll" data-target=".navbar" data-offset="0" tabindex="0"
 */

const Default = {
  offset: 0,
  method: "",
  target: "",
};

const DefaultType = {
  offset: "number",
  method: "string",
  target: "(string|element)",
};

const typeCheckConfig = (config, configTypes) => {
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
      throw new TypeError(
        `Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`
      );
    }
  });
};

class ScrollSpy {
  constructor(element, config) {
    this._element = element;
    this._config = this._getConfig(config);
    this._scrollElement =
      this._element.tagName === "BODY" ? window : this._element;
    this._scrollHeight = 0;
    this._targetLinks = [];
    this._hrefLinks = [];
    // debugger;
    this._sortTargetLinks();
    this._findElementChildren();
    window.onscroll = () => {
      this.engineProcess();
    };
  }

  engineProcess() {
    const items = this._findElementChildren();

    items.forEach((item) => {
      const scrollTop = this._getTop() + this._config.offset;
      const scrollHeight = this._getHeight();
      const maxScroll = this._config.offset + scrollHeight - this._getOffset();

      let top = window.scrollY;
      let offset = item.offsetTop;
      let height = item.offsetHeight;
      let id = item.getAttribute("id");

      if (top >= offset && top < offset + height) {
        // if (scrollTop >= scrollHeight && scrollHeight < maxScroll) {
        this._clear();
        document
          .querySelector(`${this._config.target} a[href*="${id}"]`)
          .classList.add("active");
      }
    });
  }

  _clear() {
    const navLinks = this._targetLinks;
    navLinks.forEach((link) => {
      if (link.classList.contains("active")) {
        link.classList.remove("active");
      }
      return;
    });
  }

  _getConfig(config) {
    config = {
      ...Default,
      ...(typeof config === "object" && config ? config : {}),
    };

    typeCheckConfig(config, DefaultType);

    return config;
  }

  _getTop() {
    return this._scrollElement === window
      ? this._scrollElement.pageYOffset
      : this._scrollElement.scrollTop;
  }

  _getHeight() {
    return this._scrollElement === window
      ? Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight
        )
      : this._scrollElement.offsetHeight;
    // this._scrollElement.offsetHeight ||
    // Math.max(
    //   document.body.scrollHeight,
    //   document.documentElement.scrollHeight
    // )
  }

  _getOffset() {
    return this._scrollElement === window
      ? window.innerHeight
      : this._scrollElement.getBoundingClientRect().height;
  }

  _sortTargetLinks() {
    const target = Element.prototype.querySelector.call(
      document.documentElement,
      this._config.target
    );
    if (target.hasChildNodes()) {
      const links = target.querySelectorAll("a");
      links.forEach((link) => {
        this._hrefLinks.push(link.getAttribute("href"));
        this._targetLinks.push(link);
      });
    }
  }

  _findElementChildren() {
    const hrefs = this._hrefLinks;
    const items = [];
    hrefs.map((href) => {
      if (href.indexOf("#") >= 0 && href.indexOf("#") === 0)
        items.push(document.getElementById(href.substr(1)));
    });
    return items;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-spy]").forEach((spy) => {
    new ScrollSpy(spy, {
      method: spy.getAttribute("data-spy"),
      target: spy.getAttribute("data-target"),
      offset: parseFloat(spy.getAttribute("data-offset")),
    });
  });
});
