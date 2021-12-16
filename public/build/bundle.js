
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_custom_element_data(node, prop, value) {
        if (prop in node) {
            node[prop] = typeof node[prop] === 'boolean' && value === '' ? true : value;
        }
        else {
            attr(node, prop, value);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var EOL = {},
        EOF = {},
        QUOTE = 34,
        NEWLINE = 10,
        RETURN = 13;

    function objectConverter(columns) {
      return new Function("d", "return {" + columns.map(function(name, i) {
        return JSON.stringify(name) + ": d[" + i + "] || \"\"";
      }).join(",") + "}");
    }

    function customConverter(columns, f) {
      var object = objectConverter(columns);
      return function(row, i) {
        return f(object(row), i, columns);
      };
    }

    // Compute unique columns in order of discovery.
    function inferColumns(rows) {
      var columnSet = Object.create(null),
          columns = [];

      rows.forEach(function(row) {
        for (var column in row) {
          if (!(column in columnSet)) {
            columns.push(columnSet[column] = column);
          }
        }
      });

      return columns;
    }

    function pad(value, width) {
      var s = value + "", length = s.length;
      return length < width ? new Array(width - length + 1).join(0) + s : s;
    }

    function formatYear(year) {
      return year < 0 ? "-" + pad(-year, 6)
        : year > 9999 ? "+" + pad(year, 6)
        : pad(year, 4);
    }

    function formatDate(date) {
      var hours = date.getUTCHours(),
          minutes = date.getUTCMinutes(),
          seconds = date.getUTCSeconds(),
          milliseconds = date.getUTCMilliseconds();
      return isNaN(date) ? "Invalid Date"
          : formatYear(date.getUTCFullYear()) + "-" + pad(date.getUTCMonth() + 1, 2) + "-" + pad(date.getUTCDate(), 2)
          + (milliseconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "." + pad(milliseconds, 3) + "Z"
          : seconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "Z"
          : minutes || hours ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + "Z"
          : "");
    }

    function dsv(delimiter) {
      var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
          DELIMITER = delimiter.charCodeAt(0);

      function parse(text, f) {
        var convert, columns, rows = parseRows(text, function(row, i) {
          if (convert) return convert(row, i - 1);
          columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
        });
        rows.columns = columns || [];
        return rows;
      }

      function parseRows(text, f) {
        var rows = [], // output rows
            N = text.length,
            I = 0, // current character index
            n = 0, // current line number
            t, // current token
            eof = N <= 0, // current token followed by EOF?
            eol = false; // current token followed by EOL?

        // Strip the trailing newline.
        if (text.charCodeAt(N - 1) === NEWLINE) --N;
        if (text.charCodeAt(N - 1) === RETURN) --N;

        function token() {
          if (eof) return EOF;
          if (eol) return eol = false, EOL;

          // Unescape quotes.
          var i, j = I, c;
          if (text.charCodeAt(j) === QUOTE) {
            while (I++ < N && text.charCodeAt(I) !== QUOTE || text.charCodeAt(++I) === QUOTE);
            if ((i = I) >= N) eof = true;
            else if ((c = text.charCodeAt(I++)) === NEWLINE) eol = true;
            else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
            return text.slice(j + 1, i - 1).replace(/""/g, "\"");
          }

          // Find next delimiter or newline.
          while (I < N) {
            if ((c = text.charCodeAt(i = I++)) === NEWLINE) eol = true;
            else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
            else if (c !== DELIMITER) continue;
            return text.slice(j, i);
          }

          // Return last token before EOF.
          return eof = true, text.slice(j, N);
        }

        while ((t = token()) !== EOF) {
          var row = [];
          while (t !== EOL && t !== EOF) row.push(t), t = token();
          if (f && (row = f(row, n++)) == null) continue;
          rows.push(row);
        }

        return rows;
      }

      function preformatBody(rows, columns) {
        return rows.map(function(row) {
          return columns.map(function(column) {
            return formatValue(row[column]);
          }).join(delimiter);
        });
      }

      function format(rows, columns) {
        if (columns == null) columns = inferColumns(rows);
        return [columns.map(formatValue).join(delimiter)].concat(preformatBody(rows, columns)).join("\n");
      }

      function formatBody(rows, columns) {
        if (columns == null) columns = inferColumns(rows);
        return preformatBody(rows, columns).join("\n");
      }

      function formatRows(rows) {
        return rows.map(formatRow).join("\n");
      }

      function formatRow(row) {
        return row.map(formatValue).join(delimiter);
      }

      function formatValue(value) {
        return value == null ? ""
            : value instanceof Date ? formatDate(value)
            : reFormat.test(value += "") ? "\"" + value.replace(/"/g, "\"\"") + "\""
            : value;
      }

      return {
        parse: parse,
        parseRows: parseRows,
        format: format,
        formatBody: formatBody,
        formatRows: formatRows,
        formatRow: formatRow,
        formatValue: formatValue
      };
    }

    var csv = dsv(",");

    var csvParse = csv.parse;

    function autoType(object) {
      for (var key in object) {
        var value = object[key].trim(), number, m;
        if (!value) value = null;
        else if (value === "true") value = true;
        else if (value === "false") value = false;
        else if (value === "NaN") value = NaN;
        else if (!isNaN(number = +value)) value = number;
        else if (m = value.match(/^([-+]\d{2})?\d{4}(-\d{2}(-\d{2})?)?(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?(Z|[-+]\d{2}:\d{2})?)?$/)) {
          if (fixtz && !!m[4] && !m[7]) value = value.replace(/-/g, "/").replace(/T/, " ");
          value = new Date(value);
        }
        else continue;
        object[key] = value;
      }
      return object;
    }

    // https://github.com/d3/d3-dsv/issues/45
    const fixtz = new Date("2019-01-01T00:00").getHours() || new Date("2019-07-01T00:00").getHours();

    function setColors(themes, theme) {
      for (let color in themes[theme]) {
        document.documentElement.style.setProperty('--' + color, themes[theme][color]);
      }
    }

    async function getData(url) {
      let response = await fetch(url);
      let string = await response.text();
    	let data = await csvParse(string, autoType);
      return data;
    }

    function getMotion() {
      let mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)"); // Check if browser prefers reduced motion
    	return !mediaQuery || mediaQuery.matches ? false : true; // return true for motion, false for no motion
    }

    // CORE CONFIG

    const themes = {
      'light': {
        'text': '#222',
        'muted': '#777',
        'pale': '#f0f0f0',
        'background': '#fff'
      },
      'dark': {
        'text': '#fff',
        'muted': '#bbb',
        'pale': '#333',
        'background': '#222'
      }
    };

    const colors = [
    	[166,206,227],
    	[31,120,180],
    	[178,223,138],
    	[51,160,44],
    	[251,154,153],
    	[227,26,28],
    	[253,191,111],
    	[255,127,0],
    	[202,178,214],
    	[106,61,154],
    	[255,255,153],
    	[177,89,40]
    ];

    const players = [
    	"Lamar Jackson",
    	"Justin Jefferson",
    	"Devin Singletary",
    	"Dallas Goedert",
    	"JaMarr Chase",
    	"DeVonta Smith",
    	"Van Jefferson Jr",
    	"Odell Beckham Jr",
    	"Saquon Barkley",
    	"AJ Dillon",
    	"Miles Sanders",
    	"Nick Folk"
    ];

    /* src/layout/Header.svelte generated by Svelte v3.44.1 */
    const file$o = "src/layout/Header.svelte";

    function create_fragment$p(ctx) {
    	let header;
    	let div1;
    	let div0;
    	let header_style_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);

    	const block = {
    		c: function create() {
    			header = element("header");
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			toggle_class(div0, "center", /*center*/ ctx[1]);
    			add_location(div0, file$o, 35, 2, 816);
    			attr_dev(div1, "class", "v-padded col-wide middle svelte-19u0sv3");
    			set_style(div1, "position", "relative");
    			toggle_class(div1, "short", /*short*/ ctx[2]);
    			toggle_class(div1, "height-full", !/*short*/ ctx[2]);
    			add_location(div1, file$o, 34, 1, 709);
    			attr_dev(header, "style", header_style_value = "color: " + themes[/*theme*/ ctx[0]]['text'] + "; background-color: " + themes[/*theme*/ ctx[0]]['background'] + "; " + /*style*/ ctx[3]);
    			attr_dev(header, "class", "svelte-19u0sv3");
    			toggle_class(header, "short", /*short*/ ctx[2]);
    			add_location(header, file$o, 33, 0, 590);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div1);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
    						null
    					);
    				}
    			}

    			if (dirty & /*center*/ 2) {
    				toggle_class(div0, "center", /*center*/ ctx[1]);
    			}

    			if (dirty & /*short*/ 4) {
    				toggle_class(div1, "short", /*short*/ ctx[2]);
    			}

    			if (dirty & /*short*/ 4) {
    				toggle_class(div1, "height-full", !/*short*/ ctx[2]);
    			}

    			if (!current || dirty & /*theme, style*/ 9 && header_style_value !== (header_style_value = "color: " + themes[/*theme*/ ctx[0]]['text'] + "; background-color: " + themes[/*theme*/ ctx[0]]['background'] + "; " + /*style*/ ctx[3])) {
    				attr_dev(header, "style", header_style_value);
    			}

    			if (dirty & /*short*/ 4) {
    				toggle_class(header, "short", /*short*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, ['default']);
    	let { theme = getContext('theme') } = $$props;
    	let { bgimage = null } = $$props;
    	let { bgfixed = false } = $$props;
    	let { center = true } = $$props;
    	let { short = false } = $$props;
    	let style = '';

    	if (bgimage) {
    		style += `background-image: url(${bgimage});`;
    	} else {
    		style += 'background-image: none;';
    	}

    	if (bgfixed) {
    		style += ' background-attachment: fixed;';
    	}

    	const writable_props = ['theme', 'bgimage', 'bgfixed', 'center', 'short'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('theme' in $$props) $$invalidate(0, theme = $$props.theme);
    		if ('bgimage' in $$props) $$invalidate(4, bgimage = $$props.bgimage);
    		if ('bgfixed' in $$props) $$invalidate(5, bgfixed = $$props.bgfixed);
    		if ('center' in $$props) $$invalidate(1, center = $$props.center);
    		if ('short' in $$props) $$invalidate(2, short = $$props.short);
    		if ('$$scope' in $$props) $$invalidate(6, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		themes,
    		getContext,
    		theme,
    		bgimage,
    		bgfixed,
    		center,
    		short,
    		style
    	});

    	$$self.$inject_state = $$props => {
    		if ('theme' in $$props) $$invalidate(0, theme = $$props.theme);
    		if ('bgimage' in $$props) $$invalidate(4, bgimage = $$props.bgimage);
    		if ('bgfixed' in $$props) $$invalidate(5, bgfixed = $$props.bgfixed);
    		if ('center' in $$props) $$invalidate(1, center = $$props.center);
    		if ('short' in $$props) $$invalidate(2, short = $$props.short);
    		if ('style' in $$props) $$invalidate(3, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [theme, center, short, style, bgimage, bgfixed, $$scope, slots];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {
    			theme: 0,
    			bgimage: 4,
    			bgfixed: 5,
    			center: 1,
    			short: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get theme() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set theme(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bgimage() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bgimage(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bgfixed() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bgfixed(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get center() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set center(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get short() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set short(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/layout/Section.svelte generated by Svelte v3.44.1 */
    const file$n = "src/layout/Section.svelte";

    function create_fragment$o(ctx) {
    	let section;
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			section = element("section");
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "col-wide");
    			add_location(div, file$n, 8, 1, 239);
    			set_style(section, "color", themes[/*theme*/ ctx[0]]['text']);
    			set_style(section, "background-color", themes[/*theme*/ ctx[0]]['background']);
    			add_location(section, file$n, 7, 0, 140);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*theme*/ 1) {
    				set_style(section, "color", themes[/*theme*/ ctx[0]]['text']);
    			}

    			if (!current || dirty & /*theme*/ 1) {
    				set_style(section, "background-color", themes[/*theme*/ ctx[0]]['background']);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Section', slots, ['default']);
    	let { theme = getContext('theme') } = $$props;
    	const writable_props = ['theme'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Section> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('theme' in $$props) $$invalidate(0, theme = $$props.theme);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ themes, getContext, theme });

    	$$self.$inject_state = $$props => {
    		if ('theme' in $$props) $$invalidate(0, theme = $$props.theme);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [theme, $$scope, slots];
    }

    class Section extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, { theme: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Section",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get theme() {
    		throw new Error("<Section>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set theme(value) {
    		throw new Error("<Section>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/layout/Scroller.svelte generated by Svelte v3.44.1 */

    const { window: window_1 } = globals;
    const file$m = "src/layout/Scroller.svelte";
    const get_foreground_slot_changes = dirty => ({});
    const get_foreground_slot_context = ctx => ({});
    const get_background_slot_changes = dirty => ({});
    const get_background_slot_context = ctx => ({});

    function create_fragment$n(ctx) {
    	let svelte_scroller_outer;
    	let svelte_scroller_background_container;
    	let svelte_scroller_background;
    	let t;
    	let svelte_scroller_foreground;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[18]);
    	const background_slot_template = /*#slots*/ ctx[17].background;
    	const background_slot = create_slot(background_slot_template, ctx, /*$$scope*/ ctx[16], get_background_slot_context);
    	const foreground_slot_template = /*#slots*/ ctx[17].foreground;
    	const foreground_slot = create_slot(foreground_slot_template, ctx, /*$$scope*/ ctx[16], get_foreground_slot_context);

    	const block = {
    		c: function create() {
    			svelte_scroller_outer = element("svelte-scroller-outer");
    			svelte_scroller_background_container = element("svelte-scroller-background-container");
    			svelte_scroller_background = element("svelte-scroller-background");
    			if (background_slot) background_slot.c();
    			t = space();
    			svelte_scroller_foreground = element("svelte-scroller-foreground");
    			if (foreground_slot) foreground_slot.c();
    			set_custom_element_data(svelte_scroller_background, "class", "svelte-3stote");
    			add_location(svelte_scroller_background, file$m, 184, 2, 4832);
    			set_custom_element_data(svelte_scroller_background_container, "class", "background-container svelte-3stote");
    			add_location(svelte_scroller_background_container, file$m, 183, 1, 4737);
    			set_custom_element_data(svelte_scroller_foreground, "class", "svelte-3stote");
    			add_location(svelte_scroller_foreground, file$m, 189, 1, 4999);
    			set_custom_element_data(svelte_scroller_outer, "class", "svelte-3stote");
    			toggle_class(svelte_scroller_outer, "splitscreen", /*splitscreen*/ ctx[0]);
    			add_location(svelte_scroller_outer, file$m, 182, 0, 4675);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svelte_scroller_outer, anchor);
    			append_dev(svelte_scroller_outer, svelte_scroller_background_container);
    			append_dev(svelte_scroller_background_container, svelte_scroller_background);

    			if (background_slot) {
    				background_slot.m(svelte_scroller_background, null);
    			}

    			/*svelte_scroller_background_binding*/ ctx[19](svelte_scroller_background);
    			/*svelte_scroller_background_container_binding*/ ctx[20](svelte_scroller_background_container);
    			append_dev(svelte_scroller_outer, t);
    			append_dev(svelte_scroller_outer, svelte_scroller_foreground);

    			if (foreground_slot) {
    				foreground_slot.m(svelte_scroller_foreground, null);
    			}

    			/*svelte_scroller_foreground_binding*/ ctx[21](svelte_scroller_foreground);
    			/*svelte_scroller_outer_binding*/ ctx[22](svelte_scroller_outer);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window_1, "resize", /*onwindowresize*/ ctx[18]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (background_slot) {
    				if (background_slot.p && (!current || dirty[0] & /*$$scope*/ 65536)) {
    					update_slot_base(
    						background_slot,
    						background_slot_template,
    						ctx,
    						/*$$scope*/ ctx[16],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[16])
    						: get_slot_changes(background_slot_template, /*$$scope*/ ctx[16], dirty, get_background_slot_changes),
    						get_background_slot_context
    					);
    				}
    			}

    			if (foreground_slot) {
    				if (foreground_slot.p && (!current || dirty[0] & /*$$scope*/ 65536)) {
    					update_slot_base(
    						foreground_slot,
    						foreground_slot_template,
    						ctx,
    						/*$$scope*/ ctx[16],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[16])
    						: get_slot_changes(foreground_slot_template, /*$$scope*/ ctx[16], dirty, get_foreground_slot_changes),
    						get_foreground_slot_context
    					);
    				}
    			}

    			if (dirty[0] & /*splitscreen*/ 1) {
    				toggle_class(svelte_scroller_outer, "splitscreen", /*splitscreen*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(background_slot, local);
    			transition_in(foreground_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(background_slot, local);
    			transition_out(foreground_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svelte_scroller_outer);
    			if (background_slot) background_slot.d(detaching);
    			/*svelte_scroller_background_binding*/ ctx[19](null);
    			/*svelte_scroller_background_container_binding*/ ctx[20](null);
    			if (foreground_slot) foreground_slot.d(detaching);
    			/*svelte_scroller_foreground_binding*/ ctx[21](null);
    			/*svelte_scroller_outer_binding*/ ctx[22](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const handlers = [];
    let manager;

    if (typeof window !== 'undefined') {
    	const run_all = () => handlers.forEach(fn => fn());
    	window.addEventListener('scroll', run_all);
    	window.addEventListener('resize', run_all);
    }

    if (typeof IntersectionObserver !== 'undefined') {
    	const map = new Map();

    	const observer = new IntersectionObserver((entries, observer) => {
    			entries.forEach(entry => {
    				const update = map.get(entry.target);
    				const index = handlers.indexOf(update);

    				if (entry.isIntersecting) {
    					if (index === -1) handlers.push(update);
    				} else {
    					update();
    					if (index !== -1) handlers.splice(index, 1);
    				}
    			});
    		},
    	{
    			rootMargin: '400px 0px', // TODO why 400?
    			
    		});

    	manager = {
    		add: ({ outer, update }) => {
    			const { top, bottom } = outer.getBoundingClientRect();
    			if (top < window.innerHeight && bottom > 0) handlers.push(update);
    			map.set(outer, update);
    			observer.observe(outer);
    		},
    		remove: ({ outer, update }) => {
    			const index = handlers.indexOf(update);
    			if (index !== -1) handlers.splice(index, 1);
    			map.delete(outer);
    			observer.unobserve(outer);
    		}
    	};
    } else {
    	manager = {
    		add: ({ update }) => {
    			handlers.push(update);
    		},
    		remove: ({ update }) => {
    			const index = handlers.indexOf(update);
    			if (index !== -1) handlers.splice(index, 1);
    		}
    	};
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let top_px;
    	let bottom_px;
    	let threshold_px;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Scroller', slots, ['background','foreground']);
    	let { top = 0 } = $$props;
    	let { bottom = 1 } = $$props;
    	let { threshold = 0.5 } = $$props;
    	let { query = 'section' } = $$props;
    	let { parallax = false } = $$props;
    	let { index = 0 } = $$props;
    	let { count = 0 } = $$props;
    	let { offset = 0 } = $$props;
    	let { progress = 0 } = $$props;
    	let { visible = false } = $$props;
    	let { splitscreen = false } = $$props;
    	let outer;
    	let bgContainer; // IE patch. Container binding to update inline style
    	let foreground;
    	let background;
    	let left;
    	let sections;
    	let wh = 0;
    	let fixed;
    	let offset_top;
    	let width = 1;
    	let height;
    	let inverted;

    	onMount(() => {
    		sections = foreground.querySelectorAll(query);
    		$$invalidate(7, count = sections.length);
    		update();
    		const scroller = { outer, update };
    		manager.add(scroller);
    		return () => manager.remove(scroller);
    	});

    	// IE patch. BG container style (fixed/unfixed) set via function
    	function setFixed() {
    		if (bgContainer) {
    			let style = `position: ${fixed ? 'fixed' : 'absolute'}; top: 0; transform: translate(0, ${offset_top}px); width: ${width}px; z-index: ${inverted ? 3 : 1};`;
    			$$invalidate(3, bgContainer.style.cssText = style, bgContainer);
    		}
    	}

    	function update() {
    		if (!foreground) return;

    		// re-measure outer container
    		const bcr = outer.getBoundingClientRect();

    		left = bcr.left;
    		width = bcr.right - bcr.left;

    		// determine fix state
    		const fg = foreground.getBoundingClientRect();

    		const bg = background.getBoundingClientRect();
    		$$invalidate(10, visible = fg.top < wh && fg.bottom > 0);
    		const foreground_height = fg.bottom - fg.top;
    		const background_height = bg.bottom - bg.top;
    		const available_space = bottom_px - top_px;
    		$$invalidate(9, progress = (top_px - fg.top) / (foreground_height - available_space));

    		if (progress <= 0) {
    			offset_top = 0;

    			if (fixed) {
    				fixed = false;
    				setFixed();
    			} // Non-IE specific patch to avoid setting style repeatedly
    		} else if (progress >= 1) {
    			offset_top = parallax
    			? foreground_height - background_height
    			: foreground_height - available_space;

    			if (fixed) {
    				fixed = false;
    				setFixed();
    			}
    		} else {
    			offset_top = parallax
    			? Math.round(top_px - progress * (background_height - available_space))
    			: top_px;

    			if (!fixed) {
    				fixed = true;
    				setFixed();
    			}
    		}

    		for ($$invalidate(6, index = 0); index < sections.length; $$invalidate(6, index += 1)) {
    			const section = sections[index];
    			const { top } = section.getBoundingClientRect();
    			const next = sections[index + 1];
    			const bottom = next ? next.getBoundingClientRect().top : fg.bottom;
    			$$invalidate(8, offset = (threshold_px - top) / (bottom - top));
    			if (bottom >= threshold_px) break;
    		}
    	}

    	const writable_props = [
    		'top',
    		'bottom',
    		'threshold',
    		'query',
    		'parallax',
    		'index',
    		'count',
    		'offset',
    		'progress',
    		'visible',
    		'splitscreen'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Scroller> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(1, wh = window_1.innerHeight);
    	}

    	function svelte_scroller_background_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			background = $$value;
    			$$invalidate(5, background);
    		});
    	}

    	function svelte_scroller_background_container_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			bgContainer = $$value;
    			$$invalidate(3, bgContainer);
    		});
    	}

    	function svelte_scroller_foreground_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			foreground = $$value;
    			$$invalidate(4, foreground);
    		});
    	}

    	function svelte_scroller_outer_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			outer = $$value;
    			$$invalidate(2, outer);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('top' in $$props) $$invalidate(11, top = $$props.top);
    		if ('bottom' in $$props) $$invalidate(12, bottom = $$props.bottom);
    		if ('threshold' in $$props) $$invalidate(13, threshold = $$props.threshold);
    		if ('query' in $$props) $$invalidate(14, query = $$props.query);
    		if ('parallax' in $$props) $$invalidate(15, parallax = $$props.parallax);
    		if ('index' in $$props) $$invalidate(6, index = $$props.index);
    		if ('count' in $$props) $$invalidate(7, count = $$props.count);
    		if ('offset' in $$props) $$invalidate(8, offset = $$props.offset);
    		if ('progress' in $$props) $$invalidate(9, progress = $$props.progress);
    		if ('visible' in $$props) $$invalidate(10, visible = $$props.visible);
    		if ('splitscreen' in $$props) $$invalidate(0, splitscreen = $$props.splitscreen);
    		if ('$$scope' in $$props) $$invalidate(16, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		handlers,
    		manager,
    		onMount,
    		top,
    		bottom,
    		threshold,
    		query,
    		parallax,
    		index,
    		count,
    		offset,
    		progress,
    		visible,
    		splitscreen,
    		outer,
    		bgContainer,
    		foreground,
    		background,
    		left,
    		sections,
    		wh,
    		fixed,
    		offset_top,
    		width,
    		height,
    		inverted,
    		setFixed,
    		update,
    		threshold_px,
    		top_px,
    		bottom_px
    	});

    	$$self.$inject_state = $$props => {
    		if ('top' in $$props) $$invalidate(11, top = $$props.top);
    		if ('bottom' in $$props) $$invalidate(12, bottom = $$props.bottom);
    		if ('threshold' in $$props) $$invalidate(13, threshold = $$props.threshold);
    		if ('query' in $$props) $$invalidate(14, query = $$props.query);
    		if ('parallax' in $$props) $$invalidate(15, parallax = $$props.parallax);
    		if ('index' in $$props) $$invalidate(6, index = $$props.index);
    		if ('count' in $$props) $$invalidate(7, count = $$props.count);
    		if ('offset' in $$props) $$invalidate(8, offset = $$props.offset);
    		if ('progress' in $$props) $$invalidate(9, progress = $$props.progress);
    		if ('visible' in $$props) $$invalidate(10, visible = $$props.visible);
    		if ('splitscreen' in $$props) $$invalidate(0, splitscreen = $$props.splitscreen);
    		if ('outer' in $$props) $$invalidate(2, outer = $$props.outer);
    		if ('bgContainer' in $$props) $$invalidate(3, bgContainer = $$props.bgContainer);
    		if ('foreground' in $$props) $$invalidate(4, foreground = $$props.foreground);
    		if ('background' in $$props) $$invalidate(5, background = $$props.background);
    		if ('left' in $$props) left = $$props.left;
    		if ('sections' in $$props) sections = $$props.sections;
    		if ('wh' in $$props) $$invalidate(1, wh = $$props.wh);
    		if ('fixed' in $$props) fixed = $$props.fixed;
    		if ('offset_top' in $$props) offset_top = $$props.offset_top;
    		if ('width' in $$props) width = $$props.width;
    		if ('height' in $$props) height = $$props.height;
    		if ('inverted' in $$props) inverted = $$props.inverted;
    		if ('threshold_px' in $$props) threshold_px = $$props.threshold_px;
    		if ('top_px' in $$props) top_px = $$props.top_px;
    		if ('bottom_px' in $$props) bottom_px = $$props.bottom_px;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*top, wh*/ 2050) {
    			top_px = Math.round(top * wh);
    		}

    		if ($$self.$$.dirty[0] & /*bottom, wh*/ 4098) {
    			bottom_px = Math.round(bottom * wh);
    		}

    		if ($$self.$$.dirty[0] & /*threshold, wh*/ 8194) {
    			threshold_px = Math.round(threshold * wh);
    		}

    		if ($$self.$$.dirty[0] & /*top, bottom, threshold, parallax*/ 47104) {
    			(update());
    		}
    	};

    	return [
    		splitscreen,
    		wh,
    		outer,
    		bgContainer,
    		foreground,
    		background,
    		index,
    		count,
    		offset,
    		progress,
    		visible,
    		top,
    		bottom,
    		threshold,
    		query,
    		parallax,
    		$$scope,
    		slots,
    		onwindowresize,
    		svelte_scroller_background_binding,
    		svelte_scroller_background_container_binding,
    		svelte_scroller_foreground_binding,
    		svelte_scroller_outer_binding
    	];
    }

    class Scroller extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$n,
    			create_fragment$n,
    			safe_not_equal,
    			{
    				top: 11,
    				bottom: 12,
    				threshold: 13,
    				query: 14,
    				parallax: 15,
    				index: 6,
    				count: 7,
    				offset: 8,
    				progress: 9,
    				visible: 10,
    				splitscreen: 0
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Scroller",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get top() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set top(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bottom() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bottom(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get threshold() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set threshold(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get query() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set query(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get parallax() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set parallax(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get count() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set count(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get offset() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set offset(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get progress() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set progress(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get visible() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visible(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get splitscreen() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set splitscreen(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/layout/Filler.svelte generated by Svelte v3.44.1 */
    const file$l = "src/layout/Filler.svelte";

    function create_fragment$m(ctx) {
    	let section;
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			section = element("section");
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "middle svelte-1odf9sx");
    			toggle_class(div, "center", /*center*/ ctx[1]);
    			toggle_class(div, "col-medium", !/*wide*/ ctx[2]);
    			toggle_class(div, "col-wide", /*wide*/ ctx[2]);
    			toggle_class(div, "height-full", !/*short*/ ctx[3]);
    			toggle_class(div, "short", /*short*/ ctx[3]);
    			add_location(div, file$l, 20, 1, 404);
    			set_style(section, "color", themes[/*theme*/ ctx[0]]['text']);
    			set_style(section, "background-color", themes[/*theme*/ ctx[0]]['background']);
    			attr_dev(section, "class", "svelte-1odf9sx");
    			add_location(section, file$l, 19, 0, 304);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (dirty & /*center*/ 2) {
    				toggle_class(div, "center", /*center*/ ctx[1]);
    			}

    			if (dirty & /*wide*/ 4) {
    				toggle_class(div, "col-medium", !/*wide*/ ctx[2]);
    			}

    			if (dirty & /*wide*/ 4) {
    				toggle_class(div, "col-wide", /*wide*/ ctx[2]);
    			}

    			if (dirty & /*short*/ 8) {
    				toggle_class(div, "height-full", !/*short*/ ctx[3]);
    			}

    			if (dirty & /*short*/ 8) {
    				toggle_class(div, "short", /*short*/ ctx[3]);
    			}

    			if (!current || dirty & /*theme*/ 1) {
    				set_style(section, "color", themes[/*theme*/ ctx[0]]['text']);
    			}

    			if (!current || dirty & /*theme*/ 1) {
    				set_style(section, "background-color", themes[/*theme*/ ctx[0]]['background']);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Filler', slots, ['default']);
    	let { theme = getContext('theme') } = $$props;
    	let { center = true } = $$props;
    	let { wide = false } = $$props;
    	let { short = false } = $$props;
    	const writable_props = ['theme', 'center', 'wide', 'short'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Filler> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('theme' in $$props) $$invalidate(0, theme = $$props.theme);
    		if ('center' in $$props) $$invalidate(1, center = $$props.center);
    		if ('wide' in $$props) $$invalidate(2, wide = $$props.wide);
    		if ('short' in $$props) $$invalidate(3, short = $$props.short);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		themes,
    		getContext,
    		theme,
    		center,
    		wide,
    		short
    	});

    	$$self.$inject_state = $$props => {
    		if ('theme' in $$props) $$invalidate(0, theme = $$props.theme);
    		if ('center' in $$props) $$invalidate(1, center = $$props.center);
    		if ('wide' in $$props) $$invalidate(2, wide = $$props.wide);
    		if ('short' in $$props) $$invalidate(3, short = $$props.short);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [theme, center, wide, short, $$scope, slots];
    }

    class Filler extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { theme: 0, center: 1, wide: 2, short: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Filler",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get theme() {
    		throw new Error("<Filler>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set theme(value) {
    		throw new Error("<Filler>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get center() {
    		throw new Error("<Filler>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set center(value) {
    		throw new Error("<Filler>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get wide() {
    		throw new Error("<Filler>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set wide(value) {
    		throw new Error("<Filler>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get short() {
    		throw new Error("<Filler>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set short(value) {
    		throw new Error("<Filler>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/layout/Divider.svelte generated by Svelte v3.44.1 */
    const file$k = "src/layout/Divider.svelte";

    // (13:4) {:else}
    function create_else_block$2(ctx) {
    	let hr_1;

    	const block = {
    		c: function create() {
    			hr_1 = element("hr");
    			set_style(hr_1, "color", themes[/*theme*/ ctx[0]]['muted']);
    			set_style(hr_1, "border", "none");
    			attr_dev(hr_1, "class", "svelte-1l2to1w");
    			add_location(hr_1, file$k, 13, 4, 369);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, hr_1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*theme*/ 1) {
    				set_style(hr_1, "color", themes[/*theme*/ ctx[0]]['muted']);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(hr_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(13:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (11:4) {#if hr}
    function create_if_block$f(ctx) {
    	let hr_1;

    	const block = {
    		c: function create() {
    			hr_1 = element("hr");
    			set_style(hr_1, "color", themes[/*theme*/ ctx[0]]['muted']);
    			attr_dev(hr_1, "class", "svelte-1l2to1w");
    			add_location(hr_1, file$k, 11, 4, 307);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, hr_1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*theme*/ 1) {
    				set_style(hr_1, "color", themes[/*theme*/ ctx[0]]['muted']);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(hr_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$f.name,
    		type: "if",
    		source: "(11:4) {#if hr}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let section;
    	let div;

    	function select_block_type(ctx, dirty) {
    		if (/*hr*/ ctx[1]) return create_if_block$f;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "col-medium");
    			add_location(div, file$k, 9, 1, 265);
    			set_style(section, "color", themes[/*theme*/ ctx[0]]['text']);
    			set_style(section, "background-color", themes[/*theme*/ ctx[0]]['background']);
    			add_location(section, file$k, 8, 0, 165);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div);
    			if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}

    			if (dirty & /*theme*/ 1) {
    				set_style(section, "color", themes[/*theme*/ ctx[0]]['text']);
    			}

    			if (dirty & /*theme*/ 1) {
    				set_style(section, "background-color", themes[/*theme*/ ctx[0]]['background']);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Divider', slots, []);
    	let { theme = getContext('theme') } = $$props;
    	let { hr = true } = $$props;
    	const writable_props = ['theme', 'hr'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Divider> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('theme' in $$props) $$invalidate(0, theme = $$props.theme);
    		if ('hr' in $$props) $$invalidate(1, hr = $$props.hr);
    	};

    	$$self.$capture_state = () => ({ themes, getContext, theme, hr });

    	$$self.$inject_state = $$props => {
    		if ('theme' in $$props) $$invalidate(0, theme = $$props.theme);
    		if ('hr' in $$props) $$invalidate(1, hr = $$props.hr);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [theme, hr];
    }

    class Divider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { theme: 0, hr: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Divider",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get theme() {
    		throw new Error("<Divider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set theme(value) {
    		throw new Error("<Divider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hr() {
    		throw new Error("<Divider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hr(value) {
    		throw new Error("<Divider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    /* --------------------------------------------
     *
     * Return a truthy value if is zero
     *
     * --------------------------------------------
     */
    function canBeZero (val) {
    	if (val === 0) {
    		return true;
    	}
    	return val;
    }

    function makeAccessor (acc) {
    	if (!canBeZero(acc)) return null;
    	if (Array.isArray(acc)) {
    		return d => acc.map(k => {
    			return typeof k !== 'function' ? d[k] : k(d);
    		});
    	} else if (typeof acc !== 'function') { // eslint-disable-line no-else-return
    		return d => d[acc];
    	}
    	return acc;
    }

    /* --------------------------------------------
     *
     * Remove undefined fields from an object
     *
     * --------------------------------------------
     */

    // From Object.fromEntries polyfill https://github.com/tc39/proposal-object-from-entries/blob/master/polyfill.js#L1
    function fromEntries(iter) {
    	const obj = {};

    	for (const pair of iter) {
    		if (Object(pair) !== pair) {
    			throw new TypeError("iterable for fromEntries should yield objects");
    		}

    		// Consistency with Map: contract is that entry has "0" and "1" keys, not
    		// that it is an array or iterable.

    		const { "0": key, "1": val } = pair;

    		Object.defineProperty(obj, key, {
    			configurable: true,
    			enumerable: true,
    			writable: true,
    			value: val,
    		});
    	}

    	return obj;
    }

    function filterObject (obj, comparisonObj = {}) {
    	return fromEntries(Object.entries(obj).filter(([key, value]) => {
    		return value !== undefined
    			&& comparisonObj[key] === undefined;
    	}));
    }

    /* --------------------------------------------
     *
     * Calculate the extents of desired fields
     * For example, a fields object like this:
     * `{'x': d => d.x, 'y': d => d.y}`
     * For data like this:
     * [{ x: 0, y: -10 }, { x: 10, y: 0 }, { x: 5, y: 10 }]
     * Returns an object like:
     * `{ x: [0, 10], y: [-10, 10] }`
     *
     * --------------------------------------------
     */
    function calcExtents (data, fields) {
    	if (!Array.isArray(data)) {
    		throw new TypeError('The first argument of calcExtents() must be an array.');
    	}

    	if (
    		Array.isArray(fields)
    		|| fields === undefined
    		|| fields === null
    	) {
    		throw new TypeError('The second argument of calcExtents() must be an '
    		+ 'object with field names as keys as accessor functions as values.');
    	}

    	const extents = {};

    	const keys = Object.keys(fields);
    	const kl = keys.length;
    	let i;
    	let j;
    	let k;
    	let s;
    	let min;
    	let max;
    	let acc;
    	let val;

    	const dl = data.length;
    	for (i = 0; i < kl; i += 1) {
    		s = keys[i];
    		acc = fields[s];
    		min = null;
    		max = null;
    		for (j = 0; j < dl; j += 1) {
    			val = acc(data[j]);
    			if (Array.isArray(val)) {
    				const vl = val.length;
    				for (k = 0; k < vl; k += 1) {
    					if (val[k] !== undefined && val[k] !== null && Number.isNaN(val[k]) === false) {
    						if (min === null || val[k] < min) {
    							min = val[k];
    						}
    						if (max === null || val[k] > max) {
    							max = val[k];
    						}
    					}
    				}
    			} else if (val !== undefined && val !== null && Number.isNaN(val) === false) {
    				if (min === null || val < min) {
    					min = val;
    				}
    				if (max === null || val > max) {
    					max = val;
    				}
    			}
    		}
    		extents[s] = [min, max];
    	}

    	return extents;
    }

    /* --------------------------------------------
     * If we have a domain from settings, fill in
     * any null values with ones from our measured extents
     * otherwise, return the measured extent
     */
    function partialDomain (domain = [], directive) {
    	if (Array.isArray(directive) === true) {
    		return directive.map((d, i) => {
    			if (d === null) {
    				return domain[i];
    			}
    			return d;
    		});
    	}
    	return domain;
    }

    function calcDomain (s) {
    	return function domainCalc ([$extents, $domain]) {
    		return $extents ? partialDomain($extents[s], $domain) : $domain;
    	};
    }

    function ascending(a, b) {
      return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function bisector(f) {
      let delta = f;
      let compare = f;

      if (f.length === 1) {
        delta = (d, x) => f(d) - x;
        compare = ascendingComparator(f);
      }

      function left(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        while (lo < hi) {
          const mid = (lo + hi) >>> 1;
          if (compare(a[mid], x) < 0) lo = mid + 1;
          else hi = mid;
        }
        return lo;
      }

      function right(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        while (lo < hi) {
          const mid = (lo + hi) >>> 1;
          if (compare(a[mid], x) > 0) hi = mid;
          else lo = mid + 1;
        }
        return lo;
      }

      function center(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        const i = left(a, x, lo, hi - 1);
        return i > lo && delta(a[i - 1], x) > -delta(a[i], x) ? i - 1 : i;
      }

      return {left, center, right};
    }

    function ascendingComparator(f) {
      return (d, x) => ascending(f(d), x);
    }

    function number$1(x) {
      return x === null ? NaN : +x;
    }

    const ascendingBisect = bisector(ascending);
    const bisectRight = ascendingBisect.right;
    bisector(number$1).center;
    var bisect = bisectRight;

    var e10 = Math.sqrt(50),
        e5 = Math.sqrt(10),
        e2 = Math.sqrt(2);

    function ticks(start, stop, count) {
      var reverse,
          i = -1,
          n,
          ticks,
          step;

      stop = +stop, start = +start, count = +count;
      if (start === stop && count > 0) return [start];
      if (reverse = stop < start) n = start, start = stop, stop = n;
      if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

      if (step > 0) {
        let r0 = Math.round(start / step), r1 = Math.round(stop / step);
        if (r0 * step < start) ++r0;
        if (r1 * step > stop) --r1;
        ticks = new Array(n = r1 - r0 + 1);
        while (++i < n) ticks[i] = (r0 + i) * step;
      } else {
        step = -step;
        let r0 = Math.round(start * step), r1 = Math.round(stop * step);
        if (r0 / step < start) ++r0;
        if (r1 / step > stop) --r1;
        ticks = new Array(n = r1 - r0 + 1);
        while (++i < n) ticks[i] = (r0 + i) / step;
      }

      if (reverse) ticks.reverse();

      return ticks;
    }

    function tickIncrement(start, stop, count) {
      var step = (stop - start) / Math.max(0, count),
          power = Math.floor(Math.log(step) / Math.LN10),
          error = step / Math.pow(10, power);
      return power >= 0
          ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
          : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
    }

    function tickStep(start, stop, count) {
      var step0 = Math.abs(stop - start) / Math.max(0, count),
          step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
          error = step0 / step1;
      if (error >= e10) step1 *= 10;
      else if (error >= e5) step1 *= 5;
      else if (error >= e2) step1 *= 2;
      return stop < start ? -step1 : step1;
    }

    function initRange(domain, range) {
      switch (arguments.length) {
        case 0: break;
        case 1: this.range(domain); break;
        default: this.range(range).domain(domain); break;
      }
      return this;
    }

    function define(constructor, factory, prototype) {
      constructor.prototype = factory.prototype = prototype;
      prototype.constructor = constructor;
    }

    function extend(parent, definition) {
      var prototype = Object.create(parent.prototype);
      for (var key in definition) prototype[key] = definition[key];
      return prototype;
    }

    function Color() {}

    var darker = 0.7;
    var brighter = 1 / darker;

    var reI = "\\s*([+-]?\\d+)\\s*",
        reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
        reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
        reHex = /^#([0-9a-f]{3,8})$/,
        reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
        reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
        reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
        reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
        reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
        reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

    var named = {
      aliceblue: 0xf0f8ff,
      antiquewhite: 0xfaebd7,
      aqua: 0x00ffff,
      aquamarine: 0x7fffd4,
      azure: 0xf0ffff,
      beige: 0xf5f5dc,
      bisque: 0xffe4c4,
      black: 0x000000,
      blanchedalmond: 0xffebcd,
      blue: 0x0000ff,
      blueviolet: 0x8a2be2,
      brown: 0xa52a2a,
      burlywood: 0xdeb887,
      cadetblue: 0x5f9ea0,
      chartreuse: 0x7fff00,
      chocolate: 0xd2691e,
      coral: 0xff7f50,
      cornflowerblue: 0x6495ed,
      cornsilk: 0xfff8dc,
      crimson: 0xdc143c,
      cyan: 0x00ffff,
      darkblue: 0x00008b,
      darkcyan: 0x008b8b,
      darkgoldenrod: 0xb8860b,
      darkgray: 0xa9a9a9,
      darkgreen: 0x006400,
      darkgrey: 0xa9a9a9,
      darkkhaki: 0xbdb76b,
      darkmagenta: 0x8b008b,
      darkolivegreen: 0x556b2f,
      darkorange: 0xff8c00,
      darkorchid: 0x9932cc,
      darkred: 0x8b0000,
      darksalmon: 0xe9967a,
      darkseagreen: 0x8fbc8f,
      darkslateblue: 0x483d8b,
      darkslategray: 0x2f4f4f,
      darkslategrey: 0x2f4f4f,
      darkturquoise: 0x00ced1,
      darkviolet: 0x9400d3,
      deeppink: 0xff1493,
      deepskyblue: 0x00bfff,
      dimgray: 0x696969,
      dimgrey: 0x696969,
      dodgerblue: 0x1e90ff,
      firebrick: 0xb22222,
      floralwhite: 0xfffaf0,
      forestgreen: 0x228b22,
      fuchsia: 0xff00ff,
      gainsboro: 0xdcdcdc,
      ghostwhite: 0xf8f8ff,
      gold: 0xffd700,
      goldenrod: 0xdaa520,
      gray: 0x808080,
      green: 0x008000,
      greenyellow: 0xadff2f,
      grey: 0x808080,
      honeydew: 0xf0fff0,
      hotpink: 0xff69b4,
      indianred: 0xcd5c5c,
      indigo: 0x4b0082,
      ivory: 0xfffff0,
      khaki: 0xf0e68c,
      lavender: 0xe6e6fa,
      lavenderblush: 0xfff0f5,
      lawngreen: 0x7cfc00,
      lemonchiffon: 0xfffacd,
      lightblue: 0xadd8e6,
      lightcoral: 0xf08080,
      lightcyan: 0xe0ffff,
      lightgoldenrodyellow: 0xfafad2,
      lightgray: 0xd3d3d3,
      lightgreen: 0x90ee90,
      lightgrey: 0xd3d3d3,
      lightpink: 0xffb6c1,
      lightsalmon: 0xffa07a,
      lightseagreen: 0x20b2aa,
      lightskyblue: 0x87cefa,
      lightslategray: 0x778899,
      lightslategrey: 0x778899,
      lightsteelblue: 0xb0c4de,
      lightyellow: 0xffffe0,
      lime: 0x00ff00,
      limegreen: 0x32cd32,
      linen: 0xfaf0e6,
      magenta: 0xff00ff,
      maroon: 0x800000,
      mediumaquamarine: 0x66cdaa,
      mediumblue: 0x0000cd,
      mediumorchid: 0xba55d3,
      mediumpurple: 0x9370db,
      mediumseagreen: 0x3cb371,
      mediumslateblue: 0x7b68ee,
      mediumspringgreen: 0x00fa9a,
      mediumturquoise: 0x48d1cc,
      mediumvioletred: 0xc71585,
      midnightblue: 0x191970,
      mintcream: 0xf5fffa,
      mistyrose: 0xffe4e1,
      moccasin: 0xffe4b5,
      navajowhite: 0xffdead,
      navy: 0x000080,
      oldlace: 0xfdf5e6,
      olive: 0x808000,
      olivedrab: 0x6b8e23,
      orange: 0xffa500,
      orangered: 0xff4500,
      orchid: 0xda70d6,
      palegoldenrod: 0xeee8aa,
      palegreen: 0x98fb98,
      paleturquoise: 0xafeeee,
      palevioletred: 0xdb7093,
      papayawhip: 0xffefd5,
      peachpuff: 0xffdab9,
      peru: 0xcd853f,
      pink: 0xffc0cb,
      plum: 0xdda0dd,
      powderblue: 0xb0e0e6,
      purple: 0x800080,
      rebeccapurple: 0x663399,
      red: 0xff0000,
      rosybrown: 0xbc8f8f,
      royalblue: 0x4169e1,
      saddlebrown: 0x8b4513,
      salmon: 0xfa8072,
      sandybrown: 0xf4a460,
      seagreen: 0x2e8b57,
      seashell: 0xfff5ee,
      sienna: 0xa0522d,
      silver: 0xc0c0c0,
      skyblue: 0x87ceeb,
      slateblue: 0x6a5acd,
      slategray: 0x708090,
      slategrey: 0x708090,
      snow: 0xfffafa,
      springgreen: 0x00ff7f,
      steelblue: 0x4682b4,
      tan: 0xd2b48c,
      teal: 0x008080,
      thistle: 0xd8bfd8,
      tomato: 0xff6347,
      turquoise: 0x40e0d0,
      violet: 0xee82ee,
      wheat: 0xf5deb3,
      white: 0xffffff,
      whitesmoke: 0xf5f5f5,
      yellow: 0xffff00,
      yellowgreen: 0x9acd32
    };

    define(Color, color, {
      copy: function(channels) {
        return Object.assign(new this.constructor, this, channels);
      },
      displayable: function() {
        return this.rgb().displayable();
      },
      hex: color_formatHex, // Deprecated! Use color.formatHex.
      formatHex: color_formatHex,
      formatHsl: color_formatHsl,
      formatRgb: color_formatRgb,
      toString: color_formatRgb
    });

    function color_formatHex() {
      return this.rgb().formatHex();
    }

    function color_formatHsl() {
      return hslConvert(this).formatHsl();
    }

    function color_formatRgb() {
      return this.rgb().formatRgb();
    }

    function color(format) {
      var m, l;
      format = (format + "").trim().toLowerCase();
      return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
          : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
          : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
          : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
          : null) // invalid hex
          : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
          : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
          : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
          : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
          : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
          : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
          : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
          : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
          : null;
    }

    function rgbn(n) {
      return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
    }

    function rgba(r, g, b, a) {
      if (a <= 0) r = g = b = NaN;
      return new Rgb(r, g, b, a);
    }

    function rgbConvert(o) {
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Rgb;
      o = o.rgb();
      return new Rgb(o.r, o.g, o.b, o.opacity);
    }

    function rgb$1(r, g, b, opacity) {
      return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
    }

    function Rgb(r, g, b, opacity) {
      this.r = +r;
      this.g = +g;
      this.b = +b;
      this.opacity = +opacity;
    }

    define(Rgb, rgb$1, extend(Color, {
      brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      rgb: function() {
        return this;
      },
      displayable: function() {
        return (-0.5 <= this.r && this.r < 255.5)
            && (-0.5 <= this.g && this.g < 255.5)
            && (-0.5 <= this.b && this.b < 255.5)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      hex: rgb_formatHex, // Deprecated! Use color.formatHex.
      formatHex: rgb_formatHex,
      formatRgb: rgb_formatRgb,
      toString: rgb_formatRgb
    }));

    function rgb_formatHex() {
      return "#" + hex(this.r) + hex(this.g) + hex(this.b);
    }

    function rgb_formatRgb() {
      var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
      return (a === 1 ? "rgb(" : "rgba(")
          + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.b) || 0))
          + (a === 1 ? ")" : ", " + a + ")");
    }

    function hex(value) {
      value = Math.max(0, Math.min(255, Math.round(value) || 0));
      return (value < 16 ? "0" : "") + value.toString(16);
    }

    function hsla(h, s, l, a) {
      if (a <= 0) h = s = l = NaN;
      else if (l <= 0 || l >= 1) h = s = NaN;
      else if (s <= 0) h = NaN;
      return new Hsl(h, s, l, a);
    }

    function hslConvert(o) {
      if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Hsl;
      if (o instanceof Hsl) return o;
      o = o.rgb();
      var r = o.r / 255,
          g = o.g / 255,
          b = o.b / 255,
          min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          h = NaN,
          s = max - min,
          l = (max + min) / 2;
      if (s) {
        if (r === max) h = (g - b) / s + (g < b) * 6;
        else if (g === max) h = (b - r) / s + 2;
        else h = (r - g) / s + 4;
        s /= l < 0.5 ? max + min : 2 - max - min;
        h *= 60;
      } else {
        s = l > 0 && l < 1 ? 0 : h;
      }
      return new Hsl(h, s, l, o.opacity);
    }

    function hsl(h, s, l, opacity) {
      return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
    }

    function Hsl(h, s, l, opacity) {
      this.h = +h;
      this.s = +s;
      this.l = +l;
      this.opacity = +opacity;
    }

    define(Hsl, hsl, extend(Color, {
      brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      rgb: function() {
        var h = this.h % 360 + (this.h < 0) * 360,
            s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
            l = this.l,
            m2 = l + (l < 0.5 ? l : 1 - l) * s,
            m1 = 2 * l - m2;
        return new Rgb(
          hsl2rgb$1(h >= 240 ? h - 240 : h + 120, m1, m2),
          hsl2rgb$1(h, m1, m2),
          hsl2rgb$1(h < 120 ? h + 240 : h - 120, m1, m2),
          this.opacity
        );
      },
      displayable: function() {
        return (0 <= this.s && this.s <= 1 || isNaN(this.s))
            && (0 <= this.l && this.l <= 1)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      formatHsl: function() {
        var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
        return (a === 1 ? "hsl(" : "hsla(")
            + (this.h || 0) + ", "
            + (this.s || 0) * 100 + "%, "
            + (this.l || 0) * 100 + "%"
            + (a === 1 ? ")" : ", " + a + ")");
      }
    }));

    /* From FvD 13.37, CSS Color Module Level 3 */
    function hsl2rgb$1(h, m1, m2) {
      return (h < 60 ? m1 + (m2 - m1) * h / 60
          : h < 180 ? m2
          : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
          : m1) * 255;
    }

    var constant = x => () => x;

    function linear$2(a, d) {
      return function(t) {
        return a + t * d;
      };
    }

    function exponential(a, b, y) {
      return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
        return Math.pow(a + t * b, y);
      };
    }

    function gamma(y) {
      return (y = +y) === 1 ? nogamma : function(a, b) {
        return b - a ? exponential(a, b, y) : constant(isNaN(a) ? b : a);
      };
    }

    function nogamma(a, b) {
      var d = b - a;
      return d ? linear$2(a, d) : constant(isNaN(a) ? b : a);
    }

    var rgb = (function rgbGamma(y) {
      var color = gamma(y);

      function rgb(start, end) {
        var r = color((start = rgb$1(start)).r, (end = rgb$1(end)).r),
            g = color(start.g, end.g),
            b = color(start.b, end.b),
            opacity = nogamma(start.opacity, end.opacity);
        return function(t) {
          start.r = r(t);
          start.g = g(t);
          start.b = b(t);
          start.opacity = opacity(t);
          return start + "";
        };
      }

      rgb.gamma = rgbGamma;

      return rgb;
    })(1);

    function numberArray(a, b) {
      if (!b) b = [];
      var n = a ? Math.min(b.length, a.length) : 0,
          c = b.slice(),
          i;
      return function(t) {
        for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;
        return c;
      };
    }

    function isNumberArray(x) {
      return ArrayBuffer.isView(x) && !(x instanceof DataView);
    }

    function genericArray(a, b) {
      var nb = b ? b.length : 0,
          na = a ? Math.min(nb, a.length) : 0,
          x = new Array(na),
          c = new Array(nb),
          i;

      for (i = 0; i < na; ++i) x[i] = interpolate(a[i], b[i]);
      for (; i < nb; ++i) c[i] = b[i];

      return function(t) {
        for (i = 0; i < na; ++i) c[i] = x[i](t);
        return c;
      };
    }

    function date(a, b) {
      var d = new Date;
      return a = +a, b = +b, function(t) {
        return d.setTime(a * (1 - t) + b * t), d;
      };
    }

    function interpolateNumber(a, b) {
      return a = +a, b = +b, function(t) {
        return a * (1 - t) + b * t;
      };
    }

    function object(a, b) {
      var i = {},
          c = {},
          k;

      if (a === null || typeof a !== "object") a = {};
      if (b === null || typeof b !== "object") b = {};

      for (k in b) {
        if (k in a) {
          i[k] = interpolate(a[k], b[k]);
        } else {
          c[k] = b[k];
        }
      }

      return function(t) {
        for (k in i) c[k] = i[k](t);
        return c;
      };
    }

    var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
        reB = new RegExp(reA.source, "g");

    function zero(b) {
      return function() {
        return b;
      };
    }

    function one(b) {
      return function(t) {
        return b(t) + "";
      };
    }

    function string(a, b) {
      var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
          am, // current match in a
          bm, // current match in b
          bs, // string preceding current number in b, if any
          i = -1, // index in s
          s = [], // string constants and placeholders
          q = []; // number interpolators

      // Coerce inputs to strings.
      a = a + "", b = b + "";

      // Interpolate pairs of numbers in a & b.
      while ((am = reA.exec(a))
          && (bm = reB.exec(b))) {
        if ((bs = bm.index) > bi) { // a string precedes the next number in b
          bs = b.slice(bi, bs);
          if (s[i]) s[i] += bs; // coalesce with previous string
          else s[++i] = bs;
        }
        if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
          if (s[i]) s[i] += bm; // coalesce with previous string
          else s[++i] = bm;
        } else { // interpolate non-matching numbers
          s[++i] = null;
          q.push({i: i, x: interpolateNumber(am, bm)});
        }
        bi = reB.lastIndex;
      }

      // Add remains of b.
      if (bi < b.length) {
        bs = b.slice(bi);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }

      // Special optimization for only a single match.
      // Otherwise, interpolate each of the numbers and rejoin the string.
      return s.length < 2 ? (q[0]
          ? one(q[0].x)
          : zero(b))
          : (b = q.length, function(t) {
              for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
              return s.join("");
            });
    }

    function interpolate(a, b) {
      var t = typeof b, c;
      return b == null || t === "boolean" ? constant(b)
          : (t === "number" ? interpolateNumber
          : t === "string" ? ((c = color(b)) ? (b = c, rgb) : string)
          : b instanceof color ? rgb
          : b instanceof Date ? date
          : isNumberArray(b) ? numberArray
          : Array.isArray(b) ? genericArray
          : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
          : interpolateNumber)(a, b);
    }

    function interpolateRound(a, b) {
      return a = +a, b = +b, function(t) {
        return Math.round(a * (1 - t) + b * t);
      };
    }

    function constants(x) {
      return function() {
        return x;
      };
    }

    function number(x) {
      return +x;
    }

    var unit = [0, 1];

    function identity$2(x) {
      return x;
    }

    function normalize(a, b) {
      return (b -= (a = +a))
          ? function(x) { return (x - a) / b; }
          : constants(isNaN(b) ? NaN : 0.5);
    }

    function clamper(a, b) {
      var t;
      if (a > b) t = a, a = b, b = t;
      return function(x) { return Math.max(a, Math.min(b, x)); };
    }

    // normalize(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
    // interpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding range value x in [a,b].
    function bimap(domain, range, interpolate) {
      var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
      if (d1 < d0) d0 = normalize(d1, d0), r0 = interpolate(r1, r0);
      else d0 = normalize(d0, d1), r0 = interpolate(r0, r1);
      return function(x) { return r0(d0(x)); };
    }

    function polymap(domain, range, interpolate) {
      var j = Math.min(domain.length, range.length) - 1,
          d = new Array(j),
          r = new Array(j),
          i = -1;

      // Reverse descending domains.
      if (domain[j] < domain[0]) {
        domain = domain.slice().reverse();
        range = range.slice().reverse();
      }

      while (++i < j) {
        d[i] = normalize(domain[i], domain[i + 1]);
        r[i] = interpolate(range[i], range[i + 1]);
      }

      return function(x) {
        var i = bisect(domain, x, 1, j) - 1;
        return r[i](d[i](x));
      };
    }

    function copy(source, target) {
      return target
          .domain(source.domain())
          .range(source.range())
          .interpolate(source.interpolate())
          .clamp(source.clamp())
          .unknown(source.unknown());
    }

    function transformer() {
      var domain = unit,
          range = unit,
          interpolate$1 = interpolate,
          transform,
          untransform,
          unknown,
          clamp = identity$2,
          piecewise,
          output,
          input;

      function rescale() {
        var n = Math.min(domain.length, range.length);
        if (clamp !== identity$2) clamp = clamper(domain[0], domain[n - 1]);
        piecewise = n > 2 ? polymap : bimap;
        output = input = null;
        return scale;
      }

      function scale(x) {
        return x == null || isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform), range, interpolate$1)))(transform(clamp(x)));
      }

      scale.invert = function(y) {
        return clamp(untransform((input || (input = piecewise(range, domain.map(transform), interpolateNumber)))(y)));
      };

      scale.domain = function(_) {
        return arguments.length ? (domain = Array.from(_, number), rescale()) : domain.slice();
      };

      scale.range = function(_) {
        return arguments.length ? (range = Array.from(_), rescale()) : range.slice();
      };

      scale.rangeRound = function(_) {
        return range = Array.from(_), interpolate$1 = interpolateRound, rescale();
      };

      scale.clamp = function(_) {
        return arguments.length ? (clamp = _ ? true : identity$2, rescale()) : clamp !== identity$2;
      };

      scale.interpolate = function(_) {
        return arguments.length ? (interpolate$1 = _, rescale()) : interpolate$1;
      };

      scale.unknown = function(_) {
        return arguments.length ? (unknown = _, scale) : unknown;
      };

      return function(t, u) {
        transform = t, untransform = u;
        return rescale();
      };
    }

    function continuous() {
      return transformer()(identity$2, identity$2);
    }

    function formatDecimal(x) {
      return Math.abs(x = Math.round(x)) >= 1e21
          ? x.toLocaleString("en").replace(/,/g, "")
          : x.toString(10);
    }

    // Computes the decimal coefficient and exponent of the specified number x with
    // significant digits p, where x is positive and p is in [1, 21] or undefined.
    // For example, formatDecimalParts(1.23) returns ["123", 0].
    function formatDecimalParts(x, p) {
      if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
      var i, coefficient = x.slice(0, i);

      // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
      // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
      return [
        coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
        +x.slice(i + 1)
      ];
    }

    function exponent(x) {
      return x = formatDecimalParts(Math.abs(x)), x ? x[1] : NaN;
    }

    function formatGroup(grouping, thousands) {
      return function(value, width) {
        var i = value.length,
            t = [],
            j = 0,
            g = grouping[0],
            length = 0;

        while (i > 0 && g > 0) {
          if (length + g + 1 > width) g = Math.max(1, width - length);
          t.push(value.substring(i -= g, i + g));
          if ((length += g + 1) > width) break;
          g = grouping[j = (j + 1) % grouping.length];
        }

        return t.reverse().join(thousands);
      };
    }

    function formatNumerals(numerals) {
      return function(value) {
        return value.replace(/[0-9]/g, function(i) {
          return numerals[+i];
        });
      };
    }

    // [[fill]align][sign][symbol][0][width][,][.precision][~][type]
    var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

    function formatSpecifier(specifier) {
      if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
      var match;
      return new FormatSpecifier({
        fill: match[1],
        align: match[2],
        sign: match[3],
        symbol: match[4],
        zero: match[5],
        width: match[6],
        comma: match[7],
        precision: match[8] && match[8].slice(1),
        trim: match[9],
        type: match[10]
      });
    }

    formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

    function FormatSpecifier(specifier) {
      this.fill = specifier.fill === undefined ? " " : specifier.fill + "";
      this.align = specifier.align === undefined ? ">" : specifier.align + "";
      this.sign = specifier.sign === undefined ? "-" : specifier.sign + "";
      this.symbol = specifier.symbol === undefined ? "" : specifier.symbol + "";
      this.zero = !!specifier.zero;
      this.width = specifier.width === undefined ? undefined : +specifier.width;
      this.comma = !!specifier.comma;
      this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
      this.trim = !!specifier.trim;
      this.type = specifier.type === undefined ? "" : specifier.type + "";
    }

    FormatSpecifier.prototype.toString = function() {
      return this.fill
          + this.align
          + this.sign
          + this.symbol
          + (this.zero ? "0" : "")
          + (this.width === undefined ? "" : Math.max(1, this.width | 0))
          + (this.comma ? "," : "")
          + (this.precision === undefined ? "" : "." + Math.max(0, this.precision | 0))
          + (this.trim ? "~" : "")
          + this.type;
    };

    // Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
    function formatTrim(s) {
      out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
        switch (s[i]) {
          case ".": i0 = i1 = i; break;
          case "0": if (i0 === 0) i0 = i; i1 = i; break;
          default: if (!+s[i]) break out; if (i0 > 0) i0 = 0; break;
        }
      }
      return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
    }

    var prefixExponent;

    function formatPrefixAuto(x, p) {
      var d = formatDecimalParts(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1],
          i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
          n = coefficient.length;
      return i === n ? coefficient
          : i > n ? coefficient + new Array(i - n + 1).join("0")
          : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
          : "0." + new Array(1 - i).join("0") + formatDecimalParts(x, Math.max(0, p + i - 1))[0]; // less than 1y!
    }

    function formatRounded(x, p) {
      var d = formatDecimalParts(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1];
      return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
          : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
          : coefficient + new Array(exponent - coefficient.length + 2).join("0");
    }

    var formatTypes = {
      "%": (x, p) => (x * 100).toFixed(p),
      "b": (x) => Math.round(x).toString(2),
      "c": (x) => x + "",
      "d": formatDecimal,
      "e": (x, p) => x.toExponential(p),
      "f": (x, p) => x.toFixed(p),
      "g": (x, p) => x.toPrecision(p),
      "o": (x) => Math.round(x).toString(8),
      "p": (x, p) => formatRounded(x * 100, p),
      "r": formatRounded,
      "s": formatPrefixAuto,
      "X": (x) => Math.round(x).toString(16).toUpperCase(),
      "x": (x) => Math.round(x).toString(16)
    };

    function identity$1(x) {
      return x;
    }

    var map = Array.prototype.map,
        prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

    function formatLocale(locale) {
      var group = locale.grouping === undefined || locale.thousands === undefined ? identity$1 : formatGroup(map.call(locale.grouping, Number), locale.thousands + ""),
          currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "",
          currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "",
          decimal = locale.decimal === undefined ? "." : locale.decimal + "",
          numerals = locale.numerals === undefined ? identity$1 : formatNumerals(map.call(locale.numerals, String)),
          percent = locale.percent === undefined ? "%" : locale.percent + "",
          minus = locale.minus === undefined ? "−" : locale.minus + "",
          nan = locale.nan === undefined ? "NaN" : locale.nan + "";

      function newFormat(specifier) {
        specifier = formatSpecifier(specifier);

        var fill = specifier.fill,
            align = specifier.align,
            sign = specifier.sign,
            symbol = specifier.symbol,
            zero = specifier.zero,
            width = specifier.width,
            comma = specifier.comma,
            precision = specifier.precision,
            trim = specifier.trim,
            type = specifier.type;

        // The "n" type is an alias for ",g".
        if (type === "n") comma = true, type = "g";

        // The "" type, and any invalid type, is an alias for ".12~g".
        else if (!formatTypes[type]) precision === undefined && (precision = 12), trim = true, type = "g";

        // If zero fill is specified, padding goes after sign and before digits.
        if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

        // Compute the prefix and suffix.
        // For SI-prefix, the suffix is lazily computed.
        var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
            suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";

        // What format function should we use?
        // Is this an integer type?
        // Can this type generate exponential notation?
        var formatType = formatTypes[type],
            maybeSuffix = /[defgprs%]/.test(type);

        // Set the default precision if not specified,
        // or clamp the specified precision to the supported range.
        // For significant precision, it must be in [1, 21].
        // For fixed precision, it must be in [0, 20].
        precision = precision === undefined ? 6
            : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
            : Math.max(0, Math.min(20, precision));

        function format(value) {
          var valuePrefix = prefix,
              valueSuffix = suffix,
              i, n, c;

          if (type === "c") {
            valueSuffix = formatType(value) + valueSuffix;
            value = "";
          } else {
            value = +value;

            // Determine the sign. -0 is not less than 0, but 1 / -0 is!
            var valueNegative = value < 0 || 1 / value < 0;

            // Perform the initial formatting.
            value = isNaN(value) ? nan : formatType(Math.abs(value), precision);

            // Trim insignificant zeros.
            if (trim) value = formatTrim(value);

            // If a negative value rounds to zero after formatting, and no explicit positive sign is requested, hide the sign.
            if (valueNegative && +value === 0 && sign !== "+") valueNegative = false;

            // Compute the prefix and suffix.
            valuePrefix = (valueNegative ? (sign === "(" ? sign : minus) : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
            valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

            // Break the formatted value into the integer “value” part that can be
            // grouped, and fractional or exponential “suffix” part that is not.
            if (maybeSuffix) {
              i = -1, n = value.length;
              while (++i < n) {
                if (c = value.charCodeAt(i), 48 > c || c > 57) {
                  valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                  value = value.slice(0, i);
                  break;
                }
              }
            }
          }

          // If the fill character is not "0", grouping is applied before padding.
          if (comma && !zero) value = group(value, Infinity);

          // Compute the padding.
          var length = valuePrefix.length + value.length + valueSuffix.length,
              padding = length < width ? new Array(width - length + 1).join(fill) : "";

          // If the fill character is "0", grouping is applied after padding.
          if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

          // Reconstruct the final output based on the desired alignment.
          switch (align) {
            case "<": value = valuePrefix + value + valueSuffix + padding; break;
            case "=": value = valuePrefix + padding + value + valueSuffix; break;
            case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
            default: value = padding + valuePrefix + value + valueSuffix; break;
          }

          return numerals(value);
        }

        format.toString = function() {
          return specifier + "";
        };

        return format;
      }

      function formatPrefix(specifier, value) {
        var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
            e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
            k = Math.pow(10, -e),
            prefix = prefixes[8 + e / 3];
        return function(value) {
          return f(k * value) + prefix;
        };
      }

      return {
        format: newFormat,
        formatPrefix: formatPrefix
      };
    }

    var locale;
    var format;
    var formatPrefix;

    defaultLocale({
      thousands: ",",
      grouping: [3],
      currency: ["$", ""]
    });

    function defaultLocale(definition) {
      locale = formatLocale(definition);
      format = locale.format;
      formatPrefix = locale.formatPrefix;
      return locale;
    }

    function precisionFixed(step) {
      return Math.max(0, -exponent(Math.abs(step)));
    }

    function precisionPrefix(step, value) {
      return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
    }

    function precisionRound(step, max) {
      step = Math.abs(step), max = Math.abs(max) - step;
      return Math.max(0, exponent(max) - exponent(step)) + 1;
    }

    function tickFormat(start, stop, count, specifier) {
      var step = tickStep(start, stop, count),
          precision;
      specifier = formatSpecifier(specifier == null ? ",f" : specifier);
      switch (specifier.type) {
        case "s": {
          var value = Math.max(Math.abs(start), Math.abs(stop));
          if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
          return formatPrefix(specifier, value);
        }
        case "":
        case "e":
        case "g":
        case "p":
        case "r": {
          if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
          break;
        }
        case "f":
        case "%": {
          if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
          break;
        }
      }
      return format(specifier);
    }

    function linearish(scale) {
      var domain = scale.domain;

      scale.ticks = function(count) {
        var d = domain();
        return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
      };

      scale.tickFormat = function(count, specifier) {
        var d = domain();
        return tickFormat(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
      };

      scale.nice = function(count) {
        if (count == null) count = 10;

        var d = domain();
        var i0 = 0;
        var i1 = d.length - 1;
        var start = d[i0];
        var stop = d[i1];
        var prestep;
        var step;
        var maxIter = 10;

        if (stop < start) {
          step = start, start = stop, stop = step;
          step = i0, i0 = i1, i1 = step;
        }
        
        while (maxIter-- > 0) {
          step = tickIncrement(start, stop, count);
          if (step === prestep) {
            d[i0] = start;
            d[i1] = stop;
            return domain(d);
          } else if (step > 0) {
            start = Math.floor(start / step) * step;
            stop = Math.ceil(stop / step) * step;
          } else if (step < 0) {
            start = Math.ceil(start * step) / step;
            stop = Math.floor(stop * step) / step;
          } else {
            break;
          }
          prestep = step;
        }

        return scale;
      };

      return scale;
    }

    function linear$1() {
      var scale = continuous();

      scale.copy = function() {
        return copy(scale, linear$1());
      };

      initRange.apply(scale, arguments);

      return linearish(scale);
    }

    function transformPow(exponent) {
      return function(x) {
        return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
      };
    }

    function transformSqrt(x) {
      return x < 0 ? -Math.sqrt(-x) : Math.sqrt(x);
    }

    function transformSquare(x) {
      return x < 0 ? -x * x : x * x;
    }

    function powish(transform) {
      var scale = transform(identity$2, identity$2),
          exponent = 1;

      function rescale() {
        return exponent === 1 ? transform(identity$2, identity$2)
            : exponent === 0.5 ? transform(transformSqrt, transformSquare)
            : transform(transformPow(exponent), transformPow(1 / exponent));
      }

      scale.exponent = function(_) {
        return arguments.length ? (exponent = +_, rescale()) : exponent;
      };

      return linearish(scale);
    }

    function pow$1() {
      var scale = powish(transformer());

      scale.copy = function() {
        return copy(scale, pow$1()).exponent(scale.exponent());
      };

      initRange.apply(scale, arguments);

      return scale;
    }

    function sqrt() {
      return pow$1.apply(null, arguments).exponent(0.5);
    }

    var defaultScales = {
    	x: linear$1,
    	y: linear$1,
    	z: linear$1,
    	r: sqrt
    };

    /* --------------------------------------------
     *
     * Determine whether a scale is a log, symlog, power or other
     * This is not meant to be exhaustive of all the different types of
     * scales in d3-scale and focuses on continuous scales
     *
     * --------------------------------------------
     */
    function findScaleType(scale) {
    	if (scale.constant) {
    		return 'symlog';
    	}
    	if (scale.base) {
    		return 'log';
    	}
    	if (scale.exponent) {
    		if (scale.exponent() === 0.5) {
    			return 'sqrt';
    		}
    		return 'pow';
    	}
    	return 'other';
    }

    function identity (d) {
    	return d;
    }

    function log(sign) {
    	return x => Math.log(sign * x);
    }

    function exp(sign) {
    	return x => sign * Math.exp(x);
    }

    function symlog(c) {
    	return x => Math.sign(x) * Math.log1p(Math.abs(x / c));
    }

    function symexp(c) {
    	return x => Math.sign(x) * Math.expm1(Math.abs(x)) * c;
    }

    function pow(exponent) {
    	return function powFn(x) {
    		return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
    	};
    }

    function getPadFunctions(scale) {
    	const scaleType = findScaleType(scale);

    	if (scaleType === 'log') {
    		const sign = Math.sign(scale.domain()[0]);
    		return { lift: log(sign), ground: exp(sign), scaleType };
    	}
    	if (scaleType === 'pow') {
    		const exponent = 1;
    		return { lift: pow(exponent), ground: pow(1 / exponent), scaleType };
    	}
    	if (scaleType === 'sqrt') {
    		const exponent = 0.5;
    		return { lift: pow(exponent), ground: pow(1 / exponent), scaleType };
    	}
    	if (scaleType === 'symlog') {
    		const constant = 1;
    		return { lift: symlog(constant), ground: symexp(constant), scaleType };
    	}

    	return { lift: identity, ground: identity, scaleType };
    }

    /* --------------------------------------------
     *
     * Returns a modified scale domain by in/decreasing
     * the min/max by taking the desired difference
     * in pixels and converting it to units of data.
     * Returns an array that you can set as the new domain.
     * Padding contributed by @veltman.
     * See here for discussion of transforms: https://github.com/d3/d3-scale/issues/150
     *
     * --------------------------------------------
     */

    function padScale (scale, padding) {
    	if (typeof scale.range !== 'function') {
    		throw new Error('Scale method `range` must be a function');
    	}
    	if (typeof scale.domain !== 'function') {
    		throw new Error('Scale method `domain` must be a function');
    	}
    	if (!Array.isArray(padding)) {
    		return scale.domain();
    	}

    	if (scale.domain().length !== 2) {
    		console.warn('[LayerCake] The scale is expected to have a domain of length 2 to use padding. Are you sure you want to use padding? Your scale\'s domain is:', scale.domain());
    	}
    	if (scale.range().length !== 2) {
    		console.warn('[LayerCake] The scale is expected to have a range of length 2 to use padding. Are you sure you want to use padding? Your scale\'s range is:', scale.range());
    	}

    	const { lift, ground } = getPadFunctions(scale);

    	const d0 = scale.domain()[0];

    	const isTime = Object.prototype.toString.call(d0) === '[object Date]';

    	const [d1, d2] = scale.domain().map(d => {
    		return isTime ? lift(d.getTime()) : lift(d);
    	});
    	const [r1, r2] = scale.range();
    	const paddingLeft = padding[0] || 0;
    	const paddingRight = padding[1] || 0;

    	const step = (d2 - d1) / (Math.abs(r2 - r1) - paddingLeft - paddingRight); // Math.abs() to properly handle reversed scales

    	return [d1 - paddingLeft * step, paddingRight * step + d2].map(d => {
    		return isTime ? ground(new Date(d)) : ground(d);
    	});
    }

    /* eslint-disable no-nested-ternary */
    function calcBaseRange(s, width, height, reverse, percentRange) {
    	let min;
    	let max;
    	if (percentRange === true) {
    		min = 0;
    		max = 100;
    	} else {
    		min = s === 'r' ? 1 : 0;
    		max = s === 'y' ? height : s === 'r' ? 25 : width;
    	}
    	return reverse === true ? [max, min] : [min, max];
    }

    function getDefaultRange(s, width, height, reverse, range, percentRange) {
    	return !range
    		? calcBaseRange(s, width, height, reverse, percentRange)
    		: typeof range === 'function'
    			? range({ width, height })
    			: range;
    }

    function createScale (s) {
    	return function scaleCreator ([$scale, $extents, $domain, $padding, $nice, $reverse, $width, $height, $range, $percentScale]) {
    		if ($extents === null) {
    			return null;
    		}

    		const defaultRange = getDefaultRange(s, $width, $height, $reverse, $range, $percentScale);

    		const scale = $scale === defaultScales[s] ? $scale() : $scale.copy();

    		/* --------------------------------------------
    		 * On creation, `$domain` will already have any nulls filled in
    		 * But if we set it via the context it might not, so rerun it through partialDomain
    		 */
    		scale
    			.domain(partialDomain($extents[s], $domain))
    			.range(defaultRange);

    		if ($padding) {
    			scale.domain(padScale(scale, $padding));
    		}

    		if ($nice === true) {
    			if (typeof scale.nice === 'function') {
    				scale.nice();
    			} else {
    				console.error(`[Layer Cake] You set \`${s}Nice: true\` but the ${s}Scale does not have a \`.nice\` method. Ignoring...`);
    			}
    		}

    		return scale;
    	};
    }

    function createGetter ([$acc, $scale]) {
    	return d => {
    		const val = $acc(d);
    		if (Array.isArray(val)) {
    			return val.map(v => $scale(v));
    		}
    		return $scale(val);
    	};
    }

    function getRange([$scale]) {
    	if (typeof $scale === 'function') {
    		if (typeof $scale.range === 'function') {
    			return $scale.range();
    		}
    		console.error('[LayerCake] Your scale doesn\'t have a `.range` method?');
    	}
    	return null;
    }

    var defaultReverses = {
    	x: false,
    	y: true,
    	z: false,
    	r: false
    };

    /* node_modules/layercake/src/LayerCake.svelte generated by Svelte v3.44.1 */

    const { Object: Object_1$9, console: console_1$1 } = globals;
    const file$j = "node_modules/layercake/src/LayerCake.svelte";

    const get_default_slot_changes$4 = dirty => ({
    	element: dirty[0] & /*element*/ 4,
    	width: dirty[0] & /*$width_d*/ 64,
    	height: dirty[0] & /*$height_d*/ 128,
    	aspectRatio: dirty[0] & /*$aspectRatio_d*/ 256,
    	containerWidth: dirty[0] & /*$_containerWidth*/ 512,
    	containerHeight: dirty[0] & /*$_containerHeight*/ 1024
    });

    const get_default_slot_context$4 = ctx => ({
    	element: /*element*/ ctx[2],
    	width: /*$width_d*/ ctx[6],
    	height: /*$height_d*/ ctx[7],
    	aspectRatio: /*$aspectRatio_d*/ ctx[8],
    	containerWidth: /*$_containerWidth*/ ctx[9],
    	containerHeight: /*$_containerHeight*/ ctx[10]
    });

    // (308:0) {#if (ssr === true || typeof window !== 'undefined')}
    function create_if_block$e(ctx) {
    	let div;
    	let div_style_value;
    	let div_resize_listener;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[54].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[53], get_default_slot_context$4);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "layercake-container svelte-vhzpsp");

    			attr_dev(div, "style", div_style_value = "position:" + /*position*/ ctx[5] + "; " + (/*position*/ ctx[5] === 'absolute'
    			? 'top:0;right:0;bottom:0;left:0;'
    			: '') + " " + (/*pointerEvents*/ ctx[4] === false
    			? 'pointer-events:none;'
    			: '') + "");

    			add_render_callback(() => /*div_elementresize_handler*/ ctx[56].call(div));
    			add_location(div, file$j, 308, 1, 9512);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[55](div);
    			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[56].bind(div));
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*element, $width_d, $height_d, $aspectRatio_d, $_containerWidth, $_containerHeight*/ 1988 | dirty[1] & /*$$scope*/ 4194304)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[53],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[53])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[53], dirty, get_default_slot_changes$4),
    						get_default_slot_context$4
    					);
    				}
    			}

    			if (!current || dirty[0] & /*position, pointerEvents*/ 48 && div_style_value !== (div_style_value = "position:" + /*position*/ ctx[5] + "; " + (/*position*/ ctx[5] === 'absolute'
    			? 'top:0;right:0;bottom:0;left:0;'
    			: '') + " " + (/*pointerEvents*/ ctx[4] === false
    			? 'pointer-events:none;'
    			: '') + "")) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[55](null);
    			div_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(308:0) {#if (ssr === true || typeof window !== 'undefined')}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = (/*ssr*/ ctx[3] === true || typeof window !== 'undefined') && create_if_block$e(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*ssr*/ ctx[3] === true || typeof window !== 'undefined') {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*ssr*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$e(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let context;
    	let $width_d;
    	let $height_d;
    	let $aspectRatio_d;
    	let $_containerWidth;
    	let $_containerHeight;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LayerCake', slots, ['default']);
    	let { ssr = false } = $$props;
    	let { pointerEvents = true } = $$props;
    	let { position = 'relative' } = $$props;
    	let { percentRange = false } = $$props;
    	let { width = undefined } = $$props;
    	let { height = undefined } = $$props;
    	let { containerWidth = width || 100 } = $$props;
    	let { containerHeight = height || 100 } = $$props;
    	let { element = undefined } = $$props;
    	let { x = undefined } = $$props;
    	let { y = undefined } = $$props;
    	let { z = undefined } = $$props;
    	let { r = undefined } = $$props;
    	let { custom = {} } = $$props;
    	let { data = [] } = $$props;
    	let { xDomain = undefined } = $$props;
    	let { yDomain = undefined } = $$props;
    	let { zDomain = undefined } = $$props;
    	let { rDomain = undefined } = $$props;
    	let { xNice = false } = $$props;
    	let { yNice = false } = $$props;
    	let { zNice = false } = $$props;
    	let { rNice = false } = $$props;
    	let { xReverse = defaultReverses.x } = $$props;
    	let { yReverse = defaultReverses.y } = $$props;
    	let { zReverse = defaultReverses.z } = $$props;
    	let { rReverse = defaultReverses.r } = $$props;
    	let { xPadding = undefined } = $$props;
    	let { yPadding = undefined } = $$props;
    	let { zPadding = undefined } = $$props;
    	let { rPadding = undefined } = $$props;
    	let { xScale = defaultScales.x } = $$props;
    	let { yScale = defaultScales.y } = $$props;
    	let { zScale = defaultScales.y } = $$props;
    	let { rScale = defaultScales.r } = $$props;
    	let { xRange = undefined } = $$props;
    	let { yRange = undefined } = $$props;
    	let { zRange = undefined } = $$props;
    	let { rRange = undefined } = $$props;
    	let { padding = {} } = $$props;
    	let { extents = {} } = $$props;
    	let { flatData = undefined } = $$props;

    	/* --------------------------------------------
     * Preserve a copy of our passed in settings before we modify them
     * Return this to the user's context so they can reference things if need be
     * Add the active keys since those aren't on our settings object.
     * This is mostly an escape-hatch
     */
    	const config = {};

    	/* --------------------------------------------
     * Make store versions of each parameter
     * Prefix these with `_` to keep things organized
     */
    	const _percentRange = writable();

    	const _containerWidth = writable();
    	validate_store(_containerWidth, '_containerWidth');
    	component_subscribe($$self, _containerWidth, value => $$invalidate(9, $_containerWidth = value));
    	const _containerHeight = writable();
    	validate_store(_containerHeight, '_containerHeight');
    	component_subscribe($$self, _containerHeight, value => $$invalidate(10, $_containerHeight = value));
    	const _x = writable();
    	const _y = writable();
    	const _z = writable();
    	const _r = writable();
    	const _custom = writable();
    	const _data = writable();
    	const _xDomain = writable();
    	const _yDomain = writable();
    	const _zDomain = writable();
    	const _rDomain = writable();
    	const _xNice = writable();
    	const _yNice = writable();
    	const _zNice = writable();
    	const _rNice = writable();
    	const _xReverse = writable();
    	const _yReverse = writable();
    	const _zReverse = writable();
    	const _rReverse = writable();
    	const _xPadding = writable();
    	const _yPadding = writable();
    	const _zPadding = writable();
    	const _rPadding = writable();
    	const _xScale = writable();
    	const _yScale = writable();
    	const _zScale = writable();
    	const _rScale = writable();
    	const _xRange = writable();
    	const _yRange = writable();
    	const _zRange = writable();
    	const _rRange = writable();
    	const _padding = writable();
    	const _flatData = writable();
    	const _extents = writable();
    	const _config = writable(config);

    	/* --------------------------------------------
     * Create derived values
     * Suffix these with `_d`
     */
    	const activeGetters_d = derived([_x, _y, _z, _r], ([$x, $y, $z, $r]) => {
    		const obj = {};

    		if ($x) {
    			obj.x = $x;
    		}

    		if ($y) {
    			obj.y = $y;
    		}

    		if ($z) {
    			obj.z = $z;
    		}

    		if ($r) {
    			obj.r = $r;
    		}

    		return obj;
    	});

    	const padding_d = derived([_padding, _containerWidth, _containerHeight], ([$padding]) => {
    		const defaultPadding = { top: 0, right: 0, bottom: 0, left: 0 };
    		return Object.assign(defaultPadding, $padding);
    	});

    	const box_d = derived([_containerWidth, _containerHeight, padding_d], ([$containerWidth, $containerHeight, $padding]) => {
    		const b = {};
    		b.top = $padding.top;
    		b.right = $containerWidth - $padding.right;
    		b.bottom = $containerHeight - $padding.bottom;
    		b.left = $padding.left;
    		b.width = b.right - b.left;
    		b.height = b.bottom - b.top;

    		if (b.width <= 0) {
    			console.error('[LayerCake] Target div has zero or negative width. Did you forget to set an explicit width in CSS on the container?');
    		}

    		if (b.height <= 0) {
    			console.error('[LayerCake] Target div has zero or negative height. Did you forget to set an explicit height in CSS on the container?');
    		}

    		return b;
    	});

    	const width_d = derived([box_d], ([$box]) => {
    		return $box.width;
    	});

    	validate_store(width_d, 'width_d');
    	component_subscribe($$self, width_d, value => $$invalidate(6, $width_d = value));

    	const height_d = derived([box_d], ([$box]) => {
    		return $box.height;
    	});

    	validate_store(height_d, 'height_d');
    	component_subscribe($$self, height_d, value => $$invalidate(7, $height_d = value));

    	/* --------------------------------------------
     * Calculate extents by taking the extent of the data
     * and filling that in with anything set by the user
     */
    	const extents_d = derived([_flatData, activeGetters_d, _extents], ([$flatData, $activeGetters, $extents]) => {
    		const getters = filterObject($activeGetters, $extents);

    		if (Object.keys(getters).length > 0) {
    			return {
    				...calcExtents($flatData, getters),
    				...$extents
    			};
    		} else {
    			return {};
    		}
    	});

    	const xDomain_d = derived([extents_d, _xDomain], calcDomain('x'));
    	const yDomain_d = derived([extents_d, _yDomain], calcDomain('y'));
    	const zDomain_d = derived([extents_d, _zDomain], calcDomain('z'));
    	const rDomain_d = derived([extents_d, _rDomain], calcDomain('r'));

    	const xScale_d = derived(
    		[
    			_xScale,
    			extents_d,
    			xDomain_d,
    			_xPadding,
    			_xNice,
    			_xReverse,
    			width_d,
    			height_d,
    			_xRange,
    			_percentRange
    		],
    		createScale('x')
    	);

    	const xGet_d = derived([_x, xScale_d], createGetter);

    	const yScale_d = derived(
    		[
    			_yScale,
    			extents_d,
    			yDomain_d,
    			_yPadding,
    			_yNice,
    			_yReverse,
    			width_d,
    			height_d,
    			_yRange,
    			_percentRange
    		],
    		createScale('y')
    	);

    	const yGet_d = derived([_y, yScale_d], createGetter);

    	const zScale_d = derived(
    		[
    			_zScale,
    			extents_d,
    			zDomain_d,
    			_zPadding,
    			_zNice,
    			_zReverse,
    			width_d,
    			height_d,
    			_zRange,
    			_percentRange
    		],
    		createScale('z')
    	);

    	const zGet_d = derived([_z, zScale_d], createGetter);

    	const rScale_d = derived(
    		[
    			_rScale,
    			extents_d,
    			rDomain_d,
    			_rPadding,
    			_rNice,
    			_rReverse,
    			width_d,
    			height_d,
    			_rRange,
    			_percentRange
    		],
    		createScale('r')
    	);

    	const rGet_d = derived([_r, rScale_d], createGetter);
    	const xRange_d = derived([xScale_d], getRange);
    	const yRange_d = derived([yScale_d], getRange);
    	const zRange_d = derived([zScale_d], getRange);
    	const rRange_d = derived([rScale_d], getRange);

    	const aspectRatio_d = derived([width_d, height_d], ([$aspectRatio, $width, $height]) => {
    		return $width / $height;
    	});

    	validate_store(aspectRatio_d, 'aspectRatio_d');
    	component_subscribe($$self, aspectRatio_d, value => $$invalidate(8, $aspectRatio_d = value));

    	const writable_props = [
    		'ssr',
    		'pointerEvents',
    		'position',
    		'percentRange',
    		'width',
    		'height',
    		'containerWidth',
    		'containerHeight',
    		'element',
    		'x',
    		'y',
    		'z',
    		'r',
    		'custom',
    		'data',
    		'xDomain',
    		'yDomain',
    		'zDomain',
    		'rDomain',
    		'xNice',
    		'yNice',
    		'zNice',
    		'rNice',
    		'xReverse',
    		'yReverse',
    		'zReverse',
    		'rReverse',
    		'xPadding',
    		'yPadding',
    		'zPadding',
    		'rPadding',
    		'xScale',
    		'yScale',
    		'zScale',
    		'rScale',
    		'xRange',
    		'yRange',
    		'zRange',
    		'rRange',
    		'padding',
    		'extents',
    		'flatData'
    	];

    	Object_1$9.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<LayerCake> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(2, element);
    		});
    	}

    	function div_elementresize_handler() {
    		containerWidth = this.clientWidth;
    		containerHeight = this.clientHeight;
    		$$invalidate(0, containerWidth);
    		$$invalidate(1, containerHeight);
    	}

    	$$self.$$set = $$props => {
    		if ('ssr' in $$props) $$invalidate(3, ssr = $$props.ssr);
    		if ('pointerEvents' in $$props) $$invalidate(4, pointerEvents = $$props.pointerEvents);
    		if ('position' in $$props) $$invalidate(5, position = $$props.position);
    		if ('percentRange' in $$props) $$invalidate(16, percentRange = $$props.percentRange);
    		if ('width' in $$props) $$invalidate(17, width = $$props.width);
    		if ('height' in $$props) $$invalidate(18, height = $$props.height);
    		if ('containerWidth' in $$props) $$invalidate(0, containerWidth = $$props.containerWidth);
    		if ('containerHeight' in $$props) $$invalidate(1, containerHeight = $$props.containerHeight);
    		if ('element' in $$props) $$invalidate(2, element = $$props.element);
    		if ('x' in $$props) $$invalidate(19, x = $$props.x);
    		if ('y' in $$props) $$invalidate(20, y = $$props.y);
    		if ('z' in $$props) $$invalidate(21, z = $$props.z);
    		if ('r' in $$props) $$invalidate(22, r = $$props.r);
    		if ('custom' in $$props) $$invalidate(23, custom = $$props.custom);
    		if ('data' in $$props) $$invalidate(24, data = $$props.data);
    		if ('xDomain' in $$props) $$invalidate(25, xDomain = $$props.xDomain);
    		if ('yDomain' in $$props) $$invalidate(26, yDomain = $$props.yDomain);
    		if ('zDomain' in $$props) $$invalidate(27, zDomain = $$props.zDomain);
    		if ('rDomain' in $$props) $$invalidate(28, rDomain = $$props.rDomain);
    		if ('xNice' in $$props) $$invalidate(29, xNice = $$props.xNice);
    		if ('yNice' in $$props) $$invalidate(30, yNice = $$props.yNice);
    		if ('zNice' in $$props) $$invalidate(31, zNice = $$props.zNice);
    		if ('rNice' in $$props) $$invalidate(32, rNice = $$props.rNice);
    		if ('xReverse' in $$props) $$invalidate(33, xReverse = $$props.xReverse);
    		if ('yReverse' in $$props) $$invalidate(34, yReverse = $$props.yReverse);
    		if ('zReverse' in $$props) $$invalidate(35, zReverse = $$props.zReverse);
    		if ('rReverse' in $$props) $$invalidate(36, rReverse = $$props.rReverse);
    		if ('xPadding' in $$props) $$invalidate(37, xPadding = $$props.xPadding);
    		if ('yPadding' in $$props) $$invalidate(38, yPadding = $$props.yPadding);
    		if ('zPadding' in $$props) $$invalidate(39, zPadding = $$props.zPadding);
    		if ('rPadding' in $$props) $$invalidate(40, rPadding = $$props.rPadding);
    		if ('xScale' in $$props) $$invalidate(41, xScale = $$props.xScale);
    		if ('yScale' in $$props) $$invalidate(42, yScale = $$props.yScale);
    		if ('zScale' in $$props) $$invalidate(43, zScale = $$props.zScale);
    		if ('rScale' in $$props) $$invalidate(44, rScale = $$props.rScale);
    		if ('xRange' in $$props) $$invalidate(45, xRange = $$props.xRange);
    		if ('yRange' in $$props) $$invalidate(46, yRange = $$props.yRange);
    		if ('zRange' in $$props) $$invalidate(47, zRange = $$props.zRange);
    		if ('rRange' in $$props) $$invalidate(48, rRange = $$props.rRange);
    		if ('padding' in $$props) $$invalidate(49, padding = $$props.padding);
    		if ('extents' in $$props) $$invalidate(50, extents = $$props.extents);
    		if ('flatData' in $$props) $$invalidate(51, flatData = $$props.flatData);
    		if ('$$scope' in $$props) $$invalidate(53, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		writable,
    		derived,
    		makeAccessor,
    		filterObject,
    		calcExtents,
    		calcDomain,
    		createScale,
    		createGetter,
    		getRange,
    		defaultScales,
    		defaultReverses,
    		ssr,
    		pointerEvents,
    		position,
    		percentRange,
    		width,
    		height,
    		containerWidth,
    		containerHeight,
    		element,
    		x,
    		y,
    		z,
    		r,
    		custom,
    		data,
    		xDomain,
    		yDomain,
    		zDomain,
    		rDomain,
    		xNice,
    		yNice,
    		zNice,
    		rNice,
    		xReverse,
    		yReverse,
    		zReverse,
    		rReverse,
    		xPadding,
    		yPadding,
    		zPadding,
    		rPadding,
    		xScale,
    		yScale,
    		zScale,
    		rScale,
    		xRange,
    		yRange,
    		zRange,
    		rRange,
    		padding,
    		extents,
    		flatData,
    		config,
    		_percentRange,
    		_containerWidth,
    		_containerHeight,
    		_x,
    		_y,
    		_z,
    		_r,
    		_custom,
    		_data,
    		_xDomain,
    		_yDomain,
    		_zDomain,
    		_rDomain,
    		_xNice,
    		_yNice,
    		_zNice,
    		_rNice,
    		_xReverse,
    		_yReverse,
    		_zReverse,
    		_rReverse,
    		_xPadding,
    		_yPadding,
    		_zPadding,
    		_rPadding,
    		_xScale,
    		_yScale,
    		_zScale,
    		_rScale,
    		_xRange,
    		_yRange,
    		_zRange,
    		_rRange,
    		_padding,
    		_flatData,
    		_extents,
    		_config,
    		activeGetters_d,
    		padding_d,
    		box_d,
    		width_d,
    		height_d,
    		extents_d,
    		xDomain_d,
    		yDomain_d,
    		zDomain_d,
    		rDomain_d,
    		xScale_d,
    		xGet_d,
    		yScale_d,
    		yGet_d,
    		zScale_d,
    		zGet_d,
    		rScale_d,
    		rGet_d,
    		xRange_d,
    		yRange_d,
    		zRange_d,
    		rRange_d,
    		aspectRatio_d,
    		context,
    		$width_d,
    		$height_d,
    		$aspectRatio_d,
    		$_containerWidth,
    		$_containerHeight
    	});

    	$$self.$inject_state = $$props => {
    		if ('ssr' in $$props) $$invalidate(3, ssr = $$props.ssr);
    		if ('pointerEvents' in $$props) $$invalidate(4, pointerEvents = $$props.pointerEvents);
    		if ('position' in $$props) $$invalidate(5, position = $$props.position);
    		if ('percentRange' in $$props) $$invalidate(16, percentRange = $$props.percentRange);
    		if ('width' in $$props) $$invalidate(17, width = $$props.width);
    		if ('height' in $$props) $$invalidate(18, height = $$props.height);
    		if ('containerWidth' in $$props) $$invalidate(0, containerWidth = $$props.containerWidth);
    		if ('containerHeight' in $$props) $$invalidate(1, containerHeight = $$props.containerHeight);
    		if ('element' in $$props) $$invalidate(2, element = $$props.element);
    		if ('x' in $$props) $$invalidate(19, x = $$props.x);
    		if ('y' in $$props) $$invalidate(20, y = $$props.y);
    		if ('z' in $$props) $$invalidate(21, z = $$props.z);
    		if ('r' in $$props) $$invalidate(22, r = $$props.r);
    		if ('custom' in $$props) $$invalidate(23, custom = $$props.custom);
    		if ('data' in $$props) $$invalidate(24, data = $$props.data);
    		if ('xDomain' in $$props) $$invalidate(25, xDomain = $$props.xDomain);
    		if ('yDomain' in $$props) $$invalidate(26, yDomain = $$props.yDomain);
    		if ('zDomain' in $$props) $$invalidate(27, zDomain = $$props.zDomain);
    		if ('rDomain' in $$props) $$invalidate(28, rDomain = $$props.rDomain);
    		if ('xNice' in $$props) $$invalidate(29, xNice = $$props.xNice);
    		if ('yNice' in $$props) $$invalidate(30, yNice = $$props.yNice);
    		if ('zNice' in $$props) $$invalidate(31, zNice = $$props.zNice);
    		if ('rNice' in $$props) $$invalidate(32, rNice = $$props.rNice);
    		if ('xReverse' in $$props) $$invalidate(33, xReverse = $$props.xReverse);
    		if ('yReverse' in $$props) $$invalidate(34, yReverse = $$props.yReverse);
    		if ('zReverse' in $$props) $$invalidate(35, zReverse = $$props.zReverse);
    		if ('rReverse' in $$props) $$invalidate(36, rReverse = $$props.rReverse);
    		if ('xPadding' in $$props) $$invalidate(37, xPadding = $$props.xPadding);
    		if ('yPadding' in $$props) $$invalidate(38, yPadding = $$props.yPadding);
    		if ('zPadding' in $$props) $$invalidate(39, zPadding = $$props.zPadding);
    		if ('rPadding' in $$props) $$invalidate(40, rPadding = $$props.rPadding);
    		if ('xScale' in $$props) $$invalidate(41, xScale = $$props.xScale);
    		if ('yScale' in $$props) $$invalidate(42, yScale = $$props.yScale);
    		if ('zScale' in $$props) $$invalidate(43, zScale = $$props.zScale);
    		if ('rScale' in $$props) $$invalidate(44, rScale = $$props.rScale);
    		if ('xRange' in $$props) $$invalidate(45, xRange = $$props.xRange);
    		if ('yRange' in $$props) $$invalidate(46, yRange = $$props.yRange);
    		if ('zRange' in $$props) $$invalidate(47, zRange = $$props.zRange);
    		if ('rRange' in $$props) $$invalidate(48, rRange = $$props.rRange);
    		if ('padding' in $$props) $$invalidate(49, padding = $$props.padding);
    		if ('extents' in $$props) $$invalidate(50, extents = $$props.extents);
    		if ('flatData' in $$props) $$invalidate(51, flatData = $$props.flatData);
    		if ('context' in $$props) $$invalidate(52, context = $$props.context);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*x*/ 524288) {
    			if (x) config.x = x;
    		}

    		if ($$self.$$.dirty[0] & /*y*/ 1048576) {
    			if (y) config.y = y;
    		}

    		if ($$self.$$.dirty[0] & /*z*/ 2097152) {
    			if (z) config.z = z;
    		}

    		if ($$self.$$.dirty[0] & /*r*/ 4194304) {
    			if (r) config.r = r;
    		}

    		if ($$self.$$.dirty[0] & /*xDomain*/ 33554432) {
    			if (xDomain) config.xDomain = xDomain;
    		}

    		if ($$self.$$.dirty[0] & /*yDomain*/ 67108864) {
    			if (yDomain) config.yDomain = yDomain;
    		}

    		if ($$self.$$.dirty[0] & /*zDomain*/ 134217728) {
    			if (zDomain) config.zDomain = zDomain;
    		}

    		if ($$self.$$.dirty[0] & /*rDomain*/ 268435456) {
    			if (rDomain) config.rDomain = rDomain;
    		}

    		if ($$self.$$.dirty[1] & /*xRange*/ 16384) {
    			if (xRange) config.xRange = xRange;
    		}

    		if ($$self.$$.dirty[1] & /*yRange*/ 32768) {
    			if (yRange) config.yRange = yRange;
    		}

    		if ($$self.$$.dirty[1] & /*zRange*/ 65536) {
    			if (zRange) config.zRange = zRange;
    		}

    		if ($$self.$$.dirty[1] & /*rRange*/ 131072) {
    			if (rRange) config.rRange = rRange;
    		}

    		if ($$self.$$.dirty[0] & /*percentRange*/ 65536) {
    			_percentRange.set(percentRange);
    		}

    		if ($$self.$$.dirty[0] & /*containerWidth*/ 1) {
    			_containerWidth.set(containerWidth);
    		}

    		if ($$self.$$.dirty[0] & /*containerHeight*/ 2) {
    			_containerHeight.set(containerHeight);
    		}

    		if ($$self.$$.dirty[0] & /*x*/ 524288) {
    			_x.set(makeAccessor(x));
    		}

    		if ($$self.$$.dirty[0] & /*y*/ 1048576) {
    			_y.set(makeAccessor(y));
    		}

    		if ($$self.$$.dirty[0] & /*z*/ 2097152) {
    			_z.set(makeAccessor(z));
    		}

    		if ($$self.$$.dirty[0] & /*r*/ 4194304) {
    			_r.set(makeAccessor(r));
    		}

    		if ($$self.$$.dirty[0] & /*xDomain*/ 33554432) {
    			_xDomain.set(xDomain);
    		}

    		if ($$self.$$.dirty[0] & /*yDomain*/ 67108864) {
    			_yDomain.set(yDomain);
    		}

    		if ($$self.$$.dirty[0] & /*zDomain*/ 134217728) {
    			_zDomain.set(zDomain);
    		}

    		if ($$self.$$.dirty[0] & /*rDomain*/ 268435456) {
    			_rDomain.set(rDomain);
    		}

    		if ($$self.$$.dirty[0] & /*custom*/ 8388608) {
    			_custom.set(custom);
    		}

    		if ($$self.$$.dirty[0] & /*data*/ 16777216) {
    			_data.set(data);
    		}

    		if ($$self.$$.dirty[0] & /*xNice*/ 536870912) {
    			_xNice.set(xNice);
    		}

    		if ($$self.$$.dirty[0] & /*yNice*/ 1073741824) {
    			_yNice.set(yNice);
    		}

    		if ($$self.$$.dirty[1] & /*zNice*/ 1) {
    			_zNice.set(zNice);
    		}

    		if ($$self.$$.dirty[1] & /*rNice*/ 2) {
    			_rNice.set(rNice);
    		}

    		if ($$self.$$.dirty[1] & /*xReverse*/ 4) {
    			_xReverse.set(xReverse);
    		}

    		if ($$self.$$.dirty[1] & /*yReverse*/ 8) {
    			_yReverse.set(yReverse);
    		}

    		if ($$self.$$.dirty[1] & /*zReverse*/ 16) {
    			_zReverse.set(zReverse);
    		}

    		if ($$self.$$.dirty[1] & /*rReverse*/ 32) {
    			_rReverse.set(rReverse);
    		}

    		if ($$self.$$.dirty[1] & /*xPadding*/ 64) {
    			_xPadding.set(xPadding);
    		}

    		if ($$self.$$.dirty[1] & /*yPadding*/ 128) {
    			_yPadding.set(yPadding);
    		}

    		if ($$self.$$.dirty[1] & /*zPadding*/ 256) {
    			_zPadding.set(zPadding);
    		}

    		if ($$self.$$.dirty[1] & /*rPadding*/ 512) {
    			_rPadding.set(rPadding);
    		}

    		if ($$self.$$.dirty[1] & /*xScale*/ 1024) {
    			_xScale.set(xScale);
    		}

    		if ($$self.$$.dirty[1] & /*yScale*/ 2048) {
    			_yScale.set(yScale);
    		}

    		if ($$self.$$.dirty[1] & /*zScale*/ 4096) {
    			_zScale.set(zScale);
    		}

    		if ($$self.$$.dirty[1] & /*rScale*/ 8192) {
    			_rScale.set(rScale);
    		}

    		if ($$self.$$.dirty[1] & /*xRange*/ 16384) {
    			_xRange.set(xRange);
    		}

    		if ($$self.$$.dirty[1] & /*yRange*/ 32768) {
    			_yRange.set(yRange);
    		}

    		if ($$self.$$.dirty[1] & /*zRange*/ 65536) {
    			_zRange.set(zRange);
    		}

    		if ($$self.$$.dirty[1] & /*rRange*/ 131072) {
    			_rRange.set(rRange);
    		}

    		if ($$self.$$.dirty[1] & /*padding*/ 262144) {
    			_padding.set(padding);
    		}

    		if ($$self.$$.dirty[1] & /*extents*/ 524288) {
    			_extents.set(filterObject(extents));
    		}

    		if ($$self.$$.dirty[0] & /*data*/ 16777216 | $$self.$$.dirty[1] & /*flatData*/ 1048576) {
    			_flatData.set(flatData || data);
    		}

    		if ($$self.$$.dirty[1] & /*context*/ 2097152) {
    			setContext('LayerCake', context);
    		}
    	};

    	$$invalidate(52, context = {
    		activeGetters: activeGetters_d,
    		width: width_d,
    		height: height_d,
    		percentRange: _percentRange,
    		aspectRatio: aspectRatio_d,
    		containerWidth: _containerWidth,
    		containerHeight: _containerHeight,
    		x: _x,
    		y: _y,
    		z: _z,
    		r: _r,
    		custom: _custom,
    		data: _data,
    		xNice: _xNice,
    		yNice: _yNice,
    		zNice: _zNice,
    		rNice: _rNice,
    		xReverse: _xReverse,
    		yReverse: _yReverse,
    		zReverse: _zReverse,
    		rReverse: _rReverse,
    		xPadding: _xPadding,
    		yPadding: _yPadding,
    		zPadding: _zPadding,
    		rPadding: _rPadding,
    		padding: padding_d,
    		flatData: _flatData,
    		extents: extents_d,
    		xDomain: xDomain_d,
    		yDomain: yDomain_d,
    		zDomain: zDomain_d,
    		rDomain: rDomain_d,
    		xRange: xRange_d,
    		yRange: yRange_d,
    		zRange: zRange_d,
    		rRange: rRange_d,
    		config: _config,
    		xScale: xScale_d,
    		xGet: xGet_d,
    		yScale: yScale_d,
    		yGet: yGet_d,
    		zScale: zScale_d,
    		zGet: zGet_d,
    		rScale: rScale_d,
    		rGet: rGet_d
    	});

    	return [
    		containerWidth,
    		containerHeight,
    		element,
    		ssr,
    		pointerEvents,
    		position,
    		$width_d,
    		$height_d,
    		$aspectRatio_d,
    		$_containerWidth,
    		$_containerHeight,
    		_containerWidth,
    		_containerHeight,
    		width_d,
    		height_d,
    		aspectRatio_d,
    		percentRange,
    		width,
    		height,
    		x,
    		y,
    		z,
    		r,
    		custom,
    		data,
    		xDomain,
    		yDomain,
    		zDomain,
    		rDomain,
    		xNice,
    		yNice,
    		zNice,
    		rNice,
    		xReverse,
    		yReverse,
    		zReverse,
    		rReverse,
    		xPadding,
    		yPadding,
    		zPadding,
    		rPadding,
    		xScale,
    		yScale,
    		zScale,
    		rScale,
    		xRange,
    		yRange,
    		zRange,
    		rRange,
    		padding,
    		extents,
    		flatData,
    		context,
    		$$scope,
    		slots,
    		div_binding,
    		div_elementresize_handler
    	];
    }

    class LayerCake extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$k,
    			create_fragment$k,
    			safe_not_equal,
    			{
    				ssr: 3,
    				pointerEvents: 4,
    				position: 5,
    				percentRange: 16,
    				width: 17,
    				height: 18,
    				containerWidth: 0,
    				containerHeight: 1,
    				element: 2,
    				x: 19,
    				y: 20,
    				z: 21,
    				r: 22,
    				custom: 23,
    				data: 24,
    				xDomain: 25,
    				yDomain: 26,
    				zDomain: 27,
    				rDomain: 28,
    				xNice: 29,
    				yNice: 30,
    				zNice: 31,
    				rNice: 32,
    				xReverse: 33,
    				yReverse: 34,
    				zReverse: 35,
    				rReverse: 36,
    				xPadding: 37,
    				yPadding: 38,
    				zPadding: 39,
    				rPadding: 40,
    				xScale: 41,
    				yScale: 42,
    				zScale: 43,
    				rScale: 44,
    				xRange: 45,
    				yRange: 46,
    				zRange: 47,
    				rRange: 48,
    				padding: 49,
    				extents: 50,
    				flatData: 51
    			},
    			null,
    			[-1, -1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LayerCake",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get ssr() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ssr(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pointerEvents() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pointerEvents(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get position() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get percentRange() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set percentRange(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerWidth() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerWidth(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerHeight() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerHeight(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get z() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set z(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get r() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set r(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get custom() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set custom(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xDomain() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xDomain(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yDomain() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yDomain(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zDomain() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zDomain(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rDomain() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rDomain(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xNice() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xNice(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yNice() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yNice(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zNice() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zNice(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rNice() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rNice(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xReverse() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xReverse(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yReverse() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yReverse(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zReverse() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zReverse(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rReverse() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rReverse(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xPadding() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xPadding(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yPadding() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yPadding(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zPadding() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zPadding(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rPadding() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rPadding(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xScale() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xScale(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yScale() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yScale(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zScale() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zScale(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rScale() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rScale(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xRange() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xRange(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yRange() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yRange(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zRange() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zRange(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rRange() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rRange(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get padding() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set padding(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get extents() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set extents(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flatData() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flatData(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/layercake/src/layouts/Html.svelte generated by Svelte v3.44.1 */
    const file$i = "node_modules/layercake/src/layouts/Html.svelte";
    const get_default_slot_changes$3 = dirty => ({ element: dirty & /*element*/ 1 });
    const get_default_slot_context$3 = ctx => ({ element: /*element*/ ctx[0] });

    function create_fragment$j(ctx) {
    	let div;
    	let div_style_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], get_default_slot_context$3);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "layercake-layout-html svelte-1bu60uu");
    			attr_dev(div, "style", div_style_value = "top: " + /*$padding*/ ctx[3].top + "px; right:" + /*$padding*/ ctx[3].right + "px; bottom:" + /*$padding*/ ctx[3].bottom + "px; left:" + /*$padding*/ ctx[3].left + "px;" + /*zIndexStyle*/ ctx[1] + /*pointerEventsStyle*/ ctx[2]);
    			add_location(div, file$i, 16, 0, 422);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[9](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, element*/ 129)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, get_default_slot_changes$3),
    						get_default_slot_context$3
    					);
    				}
    			}

    			if (!current || dirty & /*$padding, zIndexStyle, pointerEventsStyle*/ 14 && div_style_value !== (div_style_value = "top: " + /*$padding*/ ctx[3].top + "px; right:" + /*$padding*/ ctx[3].right + "px; bottom:" + /*$padding*/ ctx[3].bottom + "px; left:" + /*$padding*/ ctx[3].left + "px;" + /*zIndexStyle*/ ctx[1] + /*pointerEventsStyle*/ ctx[2])) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[9](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let $padding;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Html', slots, ['default']);
    	let { element = undefined } = $$props;
    	let { zIndex = undefined } = $$props;
    	let { pointerEvents = undefined } = $$props;
    	let zIndexStyle = '';
    	let pointerEventsStyle = '';
    	const { padding } = getContext('LayerCake');
    	validate_store(padding, 'padding');
    	component_subscribe($$self, padding, value => $$invalidate(3, $padding = value));
    	const writable_props = ['element', 'zIndex', 'pointerEvents'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Html> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('element' in $$props) $$invalidate(0, element = $$props.element);
    		if ('zIndex' in $$props) $$invalidate(5, zIndex = $$props.zIndex);
    		if ('pointerEvents' in $$props) $$invalidate(6, pointerEvents = $$props.pointerEvents);
    		if ('$$scope' in $$props) $$invalidate(7, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		element,
    		zIndex,
    		pointerEvents,
    		zIndexStyle,
    		pointerEventsStyle,
    		padding,
    		$padding
    	});

    	$$self.$inject_state = $$props => {
    		if ('element' in $$props) $$invalidate(0, element = $$props.element);
    		if ('zIndex' in $$props) $$invalidate(5, zIndex = $$props.zIndex);
    		if ('pointerEvents' in $$props) $$invalidate(6, pointerEvents = $$props.pointerEvents);
    		if ('zIndexStyle' in $$props) $$invalidate(1, zIndexStyle = $$props.zIndexStyle);
    		if ('pointerEventsStyle' in $$props) $$invalidate(2, pointerEventsStyle = $$props.pointerEventsStyle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*zIndex*/ 32) {
    			$$invalidate(1, zIndexStyle = typeof zIndex !== 'undefined'
    			? `z-index:${zIndex};`
    			: '');
    		}

    		if ($$self.$$.dirty & /*pointerEvents*/ 64) {
    			$$invalidate(2, pointerEventsStyle = pointerEvents === false ? 'pointer-events:none;' : '');
    		}
    	};

    	return [
    		element,
    		zIndexStyle,
    		pointerEventsStyle,
    		$padding,
    		padding,
    		zIndex,
    		pointerEvents,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class Html extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { element: 0, zIndex: 5, pointerEvents: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Html",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get element() {
    		throw new Error("<Html>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<Html>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zIndex() {
    		throw new Error("<Html>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zIndex(value) {
    		throw new Error("<Html>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pointerEvents() {
    		throw new Error("<Html>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pointerEvents(value) {
    		throw new Error("<Html>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/layercake/src/layouts/Svg.svelte generated by Svelte v3.44.1 */
    const file$h = "node_modules/layercake/src/layouts/Svg.svelte";
    const get_default_slot_changes$2 = dirty => ({ element: dirty & /*element*/ 1 });
    const get_default_slot_context$2 = ctx => ({ element: /*element*/ ctx[0] });
    const get_defs_slot_changes = dirty => ({ element: dirty & /*element*/ 1 });
    const get_defs_slot_context = ctx => ({ element: /*element*/ ctx[0] });

    function create_fragment$i(ctx) {
    	let svg;
    	let defs;
    	let g;
    	let g_transform_value;
    	let svg_style_value;
    	let current;
    	const defs_slot_template = /*#slots*/ ctx[13].defs;
    	const defs_slot = create_slot(defs_slot_template, ctx, /*$$scope*/ ctx[12], get_defs_slot_context);
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], get_default_slot_context$2);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			defs = svg_element("defs");
    			if (defs_slot) defs_slot.c();
    			g = svg_element("g");
    			if (default_slot) default_slot.c();
    			add_location(defs, file$h, 24, 1, 652);
    			attr_dev(g, "class", "layercake-layout-svg_g");
    			attr_dev(g, "transform", g_transform_value = "translate(" + /*$padding*/ ctx[6].left + ", " + /*$padding*/ ctx[6].top + ")");
    			add_location(g, file$h, 27, 1, 697);
    			attr_dev(svg, "class", "layercake-layout-svg svelte-u84d8d");
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[1]);
    			attr_dev(svg, "width", /*$containerWidth*/ ctx[4]);
    			attr_dev(svg, "height", /*$containerHeight*/ ctx[5]);
    			attr_dev(svg, "style", svg_style_value = "" + (/*zIndexStyle*/ ctx[2] + /*pointerEventsStyle*/ ctx[3]));
    			add_location(svg, file$h, 16, 0, 487);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, defs);

    			if (defs_slot) {
    				defs_slot.m(defs, null);
    			}

    			append_dev(svg, g);

    			if (default_slot) {
    				default_slot.m(g, null);
    			}

    			/*svg_binding*/ ctx[14](svg);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (defs_slot) {
    				if (defs_slot.p && (!current || dirty & /*$$scope, element*/ 4097)) {
    					update_slot_base(
    						defs_slot,
    						defs_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(defs_slot_template, /*$$scope*/ ctx[12], dirty, get_defs_slot_changes),
    						get_defs_slot_context
    					);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, element*/ 4097)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, get_default_slot_changes$2),
    						get_default_slot_context$2
    					);
    				}
    			}

    			if (!current || dirty & /*$padding*/ 64 && g_transform_value !== (g_transform_value = "translate(" + /*$padding*/ ctx[6].left + ", " + /*$padding*/ ctx[6].top + ")")) {
    				attr_dev(g, "transform", g_transform_value);
    			}

    			if (!current || dirty & /*viewBox*/ 2) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[1]);
    			}

    			if (!current || dirty & /*$containerWidth*/ 16) {
    				attr_dev(svg, "width", /*$containerWidth*/ ctx[4]);
    			}

    			if (!current || dirty & /*$containerHeight*/ 32) {
    				attr_dev(svg, "height", /*$containerHeight*/ ctx[5]);
    			}

    			if (!current || dirty & /*zIndexStyle, pointerEventsStyle*/ 12 && svg_style_value !== (svg_style_value = "" + (/*zIndexStyle*/ ctx[2] + /*pointerEventsStyle*/ ctx[3]))) {
    				attr_dev(svg, "style", svg_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(defs_slot, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(defs_slot, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (defs_slot) defs_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			/*svg_binding*/ ctx[14](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let $containerWidth;
    	let $containerHeight;
    	let $padding;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Svg', slots, ['defs','default']);
    	let { element = undefined } = $$props;
    	let { viewBox = undefined } = $$props;
    	let { zIndex = undefined } = $$props;
    	let { pointerEvents = undefined } = $$props;
    	let zIndexStyle = '';
    	let pointerEventsStyle = '';
    	const { containerWidth, containerHeight, padding } = getContext('LayerCake');
    	validate_store(containerWidth, 'containerWidth');
    	component_subscribe($$self, containerWidth, value => $$invalidate(4, $containerWidth = value));
    	validate_store(containerHeight, 'containerHeight');
    	component_subscribe($$self, containerHeight, value => $$invalidate(5, $containerHeight = value));
    	validate_store(padding, 'padding');
    	component_subscribe($$self, padding, value => $$invalidate(6, $padding = value));
    	const writable_props = ['element', 'viewBox', 'zIndex', 'pointerEvents'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Svg> was created with unknown prop '${key}'`);
    	});

    	function svg_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('element' in $$props) $$invalidate(0, element = $$props.element);
    		if ('viewBox' in $$props) $$invalidate(1, viewBox = $$props.viewBox);
    		if ('zIndex' in $$props) $$invalidate(10, zIndex = $$props.zIndex);
    		if ('pointerEvents' in $$props) $$invalidate(11, pointerEvents = $$props.pointerEvents);
    		if ('$$scope' in $$props) $$invalidate(12, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		element,
    		viewBox,
    		zIndex,
    		pointerEvents,
    		zIndexStyle,
    		pointerEventsStyle,
    		containerWidth,
    		containerHeight,
    		padding,
    		$containerWidth,
    		$containerHeight,
    		$padding
    	});

    	$$self.$inject_state = $$props => {
    		if ('element' in $$props) $$invalidate(0, element = $$props.element);
    		if ('viewBox' in $$props) $$invalidate(1, viewBox = $$props.viewBox);
    		if ('zIndex' in $$props) $$invalidate(10, zIndex = $$props.zIndex);
    		if ('pointerEvents' in $$props) $$invalidate(11, pointerEvents = $$props.pointerEvents);
    		if ('zIndexStyle' in $$props) $$invalidate(2, zIndexStyle = $$props.zIndexStyle);
    		if ('pointerEventsStyle' in $$props) $$invalidate(3, pointerEventsStyle = $$props.pointerEventsStyle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*zIndex*/ 1024) {
    			$$invalidate(2, zIndexStyle = typeof zIndex !== 'undefined'
    			? `z-index:${zIndex};`
    			: '');
    		}

    		if ($$self.$$.dirty & /*pointerEvents*/ 2048) {
    			$$invalidate(3, pointerEventsStyle = pointerEvents === false ? 'pointer-events:none;' : '');
    		}
    	};

    	return [
    		element,
    		viewBox,
    		zIndexStyle,
    		pointerEventsStyle,
    		$containerWidth,
    		$containerHeight,
    		$padding,
    		containerWidth,
    		containerHeight,
    		padding,
    		zIndex,
    		pointerEvents,
    		$$scope,
    		slots,
    		svg_binding
    	];
    }

    class Svg extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
    			element: 0,
    			viewBox: 1,
    			zIndex: 10,
    			pointerEvents: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Svg",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get element() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zIndex() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zIndex(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pointerEvents() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pointerEvents(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/layercake/src/layouts/Webgl.svelte generated by Svelte v3.44.1 */
    const file$g = "node_modules/layercake/src/layouts/Webgl.svelte";

    const get_default_slot_changes$1 = dirty => ({
    	element: dirty & /*element*/ 2,
    	context: dirty & /*context*/ 1
    });

    const get_default_slot_context$1 = ctx => ({
    	element: /*element*/ ctx[1],
    	context: /*context*/ ctx[0]
    });

    function create_fragment$h(ctx) {
    	let canvas;
    	let canvas_style_value;
    	let t;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context$1);

    	const block = {
    		c: function create() {
    			canvas = element("canvas");
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(canvas, "class", "layercake-layout-webgl");
    			attr_dev(canvas, "style", canvas_style_value = "width:100%;height:100%;top: " + /*$padding*/ ctx[4].top + "px; right:" + /*$padding*/ ctx[4].right + "px; bottom:" + /*$padding*/ ctx[4].bottom + "px; left:" + /*$padding*/ ctx[4].left + "px;position:absolute;" + /*zIndexStyle*/ ctx[2] + /*pointerEventsStyle*/ ctx[3]);
    			add_location(canvas, file$g, 42, 0, 1037);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, canvas, anchor);
    			/*canvas_binding*/ ctx[11](canvas);
    			insert_dev(target, t, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$padding, zIndexStyle, pointerEventsStyle*/ 28 && canvas_style_value !== (canvas_style_value = "width:100%;height:100%;top: " + /*$padding*/ ctx[4].top + "px; right:" + /*$padding*/ ctx[4].right + "px; bottom:" + /*$padding*/ ctx[4].bottom + "px; left:" + /*$padding*/ ctx[4].left + "px;position:absolute;" + /*zIndexStyle*/ ctx[2] + /*pointerEventsStyle*/ ctx[3])) {
    				attr_dev(canvas, "style", canvas_style_value);
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, element, context*/ 515)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, get_default_slot_changes$1),
    						get_default_slot_context$1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(canvas);
    			/*canvas_binding*/ ctx[11](null);
    			if (detaching) detach_dev(t);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let $padding;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Webgl', slots, ['default']);
    	let { contextAttributes = undefined } = $$props;
    	let { zIndex = undefined } = $$props;
    	let { pointerEvents = undefined } = $$props;
    	let { element = undefined } = $$props;
    	let testGl;
    	let { context = undefined } = $$props;
    	let zIndexStyle = '';
    	let pointerEventsStyle = '';
    	const { padding } = getContext('LayerCake');
    	validate_store(padding, 'padding');
    	component_subscribe($$self, padding, value => $$invalidate(4, $padding = value));
    	const cntxt = { gl: writable({}) };

    	onMount(() => {
    		/* --------------------------------------------
     * Try to find a working webgl context
     */
    		const contexts = ['webgl', 'experimental-webgl', 'moz-webgl', 'webkit-3d'];

    		for (let j = 0; j < contexts.length; j++) {
    			testGl = element.getContext(contexts[j], contextAttributes);

    			if (testGl) {
    				$$invalidate(0, context = testGl);
    				break;
    			}
    		}
    	});

    	setContext('gl', cntxt);
    	const writable_props = ['contextAttributes', 'zIndex', 'pointerEvents', 'element', 'context'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Webgl> was created with unknown prop '${key}'`);
    	});

    	function canvas_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(1, element);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('contextAttributes' in $$props) $$invalidate(6, contextAttributes = $$props.contextAttributes);
    		if ('zIndex' in $$props) $$invalidate(7, zIndex = $$props.zIndex);
    		if ('pointerEvents' in $$props) $$invalidate(8, pointerEvents = $$props.pointerEvents);
    		if ('element' in $$props) $$invalidate(1, element = $$props.element);
    		if ('context' in $$props) $$invalidate(0, context = $$props.context);
    		if ('$$scope' in $$props) $$invalidate(9, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onMount,
    		setContext,
    		writable,
    		contextAttributes,
    		zIndex,
    		pointerEvents,
    		element,
    		testGl,
    		context,
    		zIndexStyle,
    		pointerEventsStyle,
    		padding,
    		cntxt,
    		$padding
    	});

    	$$self.$inject_state = $$props => {
    		if ('contextAttributes' in $$props) $$invalidate(6, contextAttributes = $$props.contextAttributes);
    		if ('zIndex' in $$props) $$invalidate(7, zIndex = $$props.zIndex);
    		if ('pointerEvents' in $$props) $$invalidate(8, pointerEvents = $$props.pointerEvents);
    		if ('element' in $$props) $$invalidate(1, element = $$props.element);
    		if ('testGl' in $$props) testGl = $$props.testGl;
    		if ('context' in $$props) $$invalidate(0, context = $$props.context);
    		if ('zIndexStyle' in $$props) $$invalidate(2, zIndexStyle = $$props.zIndexStyle);
    		if ('pointerEventsStyle' in $$props) $$invalidate(3, pointerEventsStyle = $$props.pointerEventsStyle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*zIndex*/ 128) {
    			$$invalidate(2, zIndexStyle = typeof zIndex !== 'undefined'
    			? `z-index:${zIndex};`
    			: '');
    		}

    		if ($$self.$$.dirty & /*pointerEvents*/ 256) {
    			$$invalidate(3, pointerEventsStyle = pointerEvents === false ? 'pointer-events:none;' : '');
    		}

    		if ($$self.$$.dirty & /*context*/ 1) {
    			cntxt.gl.set(context);
    		}
    	};

    	return [
    		context,
    		element,
    		zIndexStyle,
    		pointerEventsStyle,
    		$padding,
    		padding,
    		contextAttributes,
    		zIndex,
    		pointerEvents,
    		$$scope,
    		slots,
    		canvas_binding
    	];
    }

    class Webgl extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {
    			contextAttributes: 6,
    			zIndex: 7,
    			pointerEvents: 8,
    			element: 1,
    			context: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Webgl",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get contextAttributes() {
    		throw new Error("<Webgl>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set contextAttributes(value) {
    		throw new Error("<Webgl>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zIndex() {
    		throw new Error("<Webgl>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zIndex(value) {
    		throw new Error("<Webgl>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pointerEvents() {
    		throw new Error("<Webgl>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pointerEvents(value) {
    		throw new Error("<Webgl>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<Webgl>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<Webgl>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get context() {
    		throw new Error("<Webgl>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set context(value) {
    		throw new Error("<Webgl>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, basedir, module) {
    	return module = {
    	  path: basedir,
    	  exports: {},
    	  require: function (path, base) {
          return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
        }
    	}, fn(module, module.exports), module.exports;
    }

    function commonjsRequire () {
    	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
    }

    var regl = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
        module.exports = factory() ;
    }(commonjsGlobal, (function () {
    var isTypedArray = function (x) {
      return (
        x instanceof Uint8Array ||
        x instanceof Uint16Array ||
        x instanceof Uint32Array ||
        x instanceof Int8Array ||
        x instanceof Int16Array ||
        x instanceof Int32Array ||
        x instanceof Float32Array ||
        x instanceof Float64Array ||
        x instanceof Uint8ClampedArray
      )
    };

    var extend = function (base, opts) {
      var keys = Object.keys(opts);
      for (var i = 0; i < keys.length; ++i) {
        base[keys[i]] = opts[keys[i]];
      }
      return base
    };

    // Error checking and parameter validation.
    //
    // Statements for the form `check.someProcedure(...)` get removed by
    // a browserify transform for optimized/minified bundles.
    //
    /* globals atob */
    var endl = '\n';

    // only used for extracting shader names.  if atob not present, then errors
    // will be slightly crappier
    function decodeB64 (str) {
      if (typeof atob !== 'undefined') {
        return atob(str)
      }
      return 'base64:' + str
    }

    function raise (message) {
      var error = new Error('(regl) ' + message);
      console.error(error);
      throw error
    }

    function check (pred, message) {
      if (!pred) {
        raise(message);
      }
    }

    function encolon (message) {
      if (message) {
        return ': ' + message
      }
      return ''
    }

    function checkParameter (param, possibilities, message) {
      if (!(param in possibilities)) {
        raise('unknown parameter (' + param + ')' + encolon(message) +
              '. possible values: ' + Object.keys(possibilities).join());
      }
    }

    function checkIsTypedArray (data, message) {
      if (!isTypedArray(data)) {
        raise(
          'invalid parameter type' + encolon(message) +
          '. must be a typed array');
      }
    }

    function standardTypeEh (value, type) {
      switch (type) {
        case 'number': return typeof value === 'number'
        case 'object': return typeof value === 'object'
        case 'string': return typeof value === 'string'
        case 'boolean': return typeof value === 'boolean'
        case 'function': return typeof value === 'function'
        case 'undefined': return typeof value === 'undefined'
        case 'symbol': return typeof value === 'symbol'
      }
    }

    function checkTypeOf (value, type, message) {
      if (!standardTypeEh(value, type)) {
        raise(
          'invalid parameter type' + encolon(message) +
          '. expected ' + type + ', got ' + (typeof value));
      }
    }

    function checkNonNegativeInt (value, message) {
      if (!((value >= 0) &&
            ((value | 0) === value))) {
        raise('invalid parameter type, (' + value + ')' + encolon(message) +
              '. must be a nonnegative integer');
      }
    }

    function checkOneOf (value, list, message) {
      if (list.indexOf(value) < 0) {
        raise('invalid value' + encolon(message) + '. must be one of: ' + list);
      }
    }

    var constructorKeys = [
      'gl',
      'canvas',
      'container',
      'attributes',
      'pixelRatio',
      'extensions',
      'optionalExtensions',
      'profile',
      'onDone'
    ];

    function checkConstructor (obj) {
      Object.keys(obj).forEach(function (key) {
        if (constructorKeys.indexOf(key) < 0) {
          raise('invalid regl constructor argument "' + key + '". must be one of ' + constructorKeys);
        }
      });
    }

    function leftPad (str, n) {
      str = str + '';
      while (str.length < n) {
        str = ' ' + str;
      }
      return str
    }

    function ShaderFile () {
      this.name = 'unknown';
      this.lines = [];
      this.index = {};
      this.hasErrors = false;
    }

    function ShaderLine (number, line) {
      this.number = number;
      this.line = line;
      this.errors = [];
    }

    function ShaderError (fileNumber, lineNumber, message) {
      this.file = fileNumber;
      this.line = lineNumber;
      this.message = message;
    }

    function guessCommand () {
      var error = new Error();
      var stack = (error.stack || error).toString();
      var pat = /compileProcedure.*\n\s*at.*\((.*)\)/.exec(stack);
      if (pat) {
        return pat[1]
      }
      var pat2 = /compileProcedure.*\n\s*at\s+(.*)(\n|$)/.exec(stack);
      if (pat2) {
        return pat2[1]
      }
      return 'unknown'
    }

    function guessCallSite () {
      var error = new Error();
      var stack = (error.stack || error).toString();
      var pat = /at REGLCommand.*\n\s+at.*\((.*)\)/.exec(stack);
      if (pat) {
        return pat[1]
      }
      var pat2 = /at REGLCommand.*\n\s+at\s+(.*)\n/.exec(stack);
      if (pat2) {
        return pat2[1]
      }
      return 'unknown'
    }

    function parseSource (source, command) {
      var lines = source.split('\n');
      var lineNumber = 1;
      var fileNumber = 0;
      var files = {
        unknown: new ShaderFile(),
        0: new ShaderFile()
      };
      files.unknown.name = files[0].name = command || guessCommand();
      files.unknown.lines.push(new ShaderLine(0, ''));
      for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];
        var parts = /^\s*#\s*(\w+)\s+(.+)\s*$/.exec(line);
        if (parts) {
          switch (parts[1]) {
            case 'line':
              var lineNumberInfo = /(\d+)(\s+\d+)?/.exec(parts[2]);
              if (lineNumberInfo) {
                lineNumber = lineNumberInfo[1] | 0;
                if (lineNumberInfo[2]) {
                  fileNumber = lineNumberInfo[2] | 0;
                  if (!(fileNumber in files)) {
                    files[fileNumber] = new ShaderFile();
                  }
                }
              }
              break
            case 'define':
              var nameInfo = /SHADER_NAME(_B64)?\s+(.*)$/.exec(parts[2]);
              if (nameInfo) {
                files[fileNumber].name = (nameInfo[1]
                  ? decodeB64(nameInfo[2])
                  : nameInfo[2]);
              }
              break
          }
        }
        files[fileNumber].lines.push(new ShaderLine(lineNumber++, line));
      }
      Object.keys(files).forEach(function (fileNumber) {
        var file = files[fileNumber];
        file.lines.forEach(function (line) {
          file.index[line.number] = line;
        });
      });
      return files
    }

    function parseErrorLog (errLog) {
      var result = [];
      errLog.split('\n').forEach(function (errMsg) {
        if (errMsg.length < 5) {
          return
        }
        var parts = /^ERROR:\s+(\d+):(\d+):\s*(.*)$/.exec(errMsg);
        if (parts) {
          result.push(new ShaderError(
            parts[1] | 0,
            parts[2] | 0,
            parts[3].trim()));
        } else if (errMsg.length > 0) {
          result.push(new ShaderError('unknown', 0, errMsg));
        }
      });
      return result
    }

    function annotateFiles (files, errors) {
      errors.forEach(function (error) {
        var file = files[error.file];
        if (file) {
          var line = file.index[error.line];
          if (line) {
            line.errors.push(error);
            file.hasErrors = true;
            return
          }
        }
        files.unknown.hasErrors = true;
        files.unknown.lines[0].errors.push(error);
      });
    }

    function checkShaderError (gl, shader, source, type, command) {
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        var errLog = gl.getShaderInfoLog(shader);
        var typeName = type === gl.FRAGMENT_SHADER ? 'fragment' : 'vertex';
        checkCommandType(source, 'string', typeName + ' shader source must be a string', command);
        var files = parseSource(source, command);
        var errors = parseErrorLog(errLog);
        annotateFiles(files, errors);

        Object.keys(files).forEach(function (fileNumber) {
          var file = files[fileNumber];
          if (!file.hasErrors) {
            return
          }

          var strings = [''];
          var styles = [''];

          function push (str, style) {
            strings.push(str);
            styles.push(style || '');
          }

          push('file number ' + fileNumber + ': ' + file.name + '\n', 'color:red;text-decoration:underline;font-weight:bold');

          file.lines.forEach(function (line) {
            if (line.errors.length > 0) {
              push(leftPad(line.number, 4) + '|  ', 'background-color:yellow; font-weight:bold');
              push(line.line + endl, 'color:red; background-color:yellow; font-weight:bold');

              // try to guess token
              var offset = 0;
              line.errors.forEach(function (error) {
                var message = error.message;
                var token = /^\s*'(.*)'\s*:\s*(.*)$/.exec(message);
                if (token) {
                  var tokenPat = token[1];
                  message = token[2];
                  switch (tokenPat) {
                    case 'assign':
                      tokenPat = '=';
                      break
                  }
                  offset = Math.max(line.line.indexOf(tokenPat, offset), 0);
                } else {
                  offset = 0;
                }

                push(leftPad('| ', 6));
                push(leftPad('^^^', offset + 3) + endl, 'font-weight:bold');
                push(leftPad('| ', 6));
                push(message + endl, 'font-weight:bold');
              });
              push(leftPad('| ', 6) + endl);
            } else {
              push(leftPad(line.number, 4) + '|  ');
              push(line.line + endl, 'color:red');
            }
          });
          if (typeof document !== 'undefined' && !window.chrome) {
            styles[0] = strings.join('%c');
            console.log.apply(console, styles);
          } else {
            console.log(strings.join(''));
          }
        });

        check.raise('Error compiling ' + typeName + ' shader, ' + files[0].name);
      }
    }

    function checkLinkError (gl, program, fragShader, vertShader, command) {
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        var errLog = gl.getProgramInfoLog(program);
        var fragParse = parseSource(fragShader, command);
        var vertParse = parseSource(vertShader, command);

        var header = 'Error linking program with vertex shader, "' +
          vertParse[0].name + '", and fragment shader "' + fragParse[0].name + '"';

        if (typeof document !== 'undefined') {
          console.log('%c' + header + endl + '%c' + errLog,
            'color:red;text-decoration:underline;font-weight:bold',
            'color:red');
        } else {
          console.log(header + endl + errLog);
        }
        check.raise(header);
      }
    }

    function saveCommandRef (object) {
      object._commandRef = guessCommand();
    }

    function saveDrawCommandInfo (opts, uniforms, attributes, stringStore) {
      saveCommandRef(opts);

      function id (str) {
        if (str) {
          return stringStore.id(str)
        }
        return 0
      }
      opts._fragId = id(opts.static.frag);
      opts._vertId = id(opts.static.vert);

      function addProps (dict, set) {
        Object.keys(set).forEach(function (u) {
          dict[stringStore.id(u)] = true;
        });
      }

      var uniformSet = opts._uniformSet = {};
      addProps(uniformSet, uniforms.static);
      addProps(uniformSet, uniforms.dynamic);

      var attributeSet = opts._attributeSet = {};
      addProps(attributeSet, attributes.static);
      addProps(attributeSet, attributes.dynamic);

      opts._hasCount = (
        'count' in opts.static ||
        'count' in opts.dynamic ||
        'elements' in opts.static ||
        'elements' in opts.dynamic);
    }

    function commandRaise (message, command) {
      var callSite = guessCallSite();
      raise(message +
        ' in command ' + (command || guessCommand()) +
        (callSite === 'unknown' ? '' : ' called from ' + callSite));
    }

    function checkCommand (pred, message, command) {
      if (!pred) {
        commandRaise(message, command || guessCommand());
      }
    }

    function checkParameterCommand (param, possibilities, message, command) {
      if (!(param in possibilities)) {
        commandRaise(
          'unknown parameter (' + param + ')' + encolon(message) +
          '. possible values: ' + Object.keys(possibilities).join(),
          command || guessCommand());
      }
    }

    function checkCommandType (value, type, message, command) {
      if (!standardTypeEh(value, type)) {
        commandRaise(
          'invalid parameter type' + encolon(message) +
          '. expected ' + type + ', got ' + (typeof value),
          command || guessCommand());
      }
    }

    function checkOptional (block) {
      block();
    }

    function checkFramebufferFormat (attachment, texFormats, rbFormats) {
      if (attachment.texture) {
        checkOneOf(
          attachment.texture._texture.internalformat,
          texFormats,
          'unsupported texture format for attachment');
      } else {
        checkOneOf(
          attachment.renderbuffer._renderbuffer.format,
          rbFormats,
          'unsupported renderbuffer format for attachment');
      }
    }

    var GL_CLAMP_TO_EDGE = 0x812F;

    var GL_NEAREST = 0x2600;
    var GL_NEAREST_MIPMAP_NEAREST = 0x2700;
    var GL_LINEAR_MIPMAP_NEAREST = 0x2701;
    var GL_NEAREST_MIPMAP_LINEAR = 0x2702;
    var GL_LINEAR_MIPMAP_LINEAR = 0x2703;

    var GL_BYTE = 5120;
    var GL_UNSIGNED_BYTE = 5121;
    var GL_SHORT = 5122;
    var GL_UNSIGNED_SHORT = 5123;
    var GL_INT = 5124;
    var GL_UNSIGNED_INT = 5125;
    var GL_FLOAT = 5126;

    var GL_UNSIGNED_SHORT_4_4_4_4 = 0x8033;
    var GL_UNSIGNED_SHORT_5_5_5_1 = 0x8034;
    var GL_UNSIGNED_SHORT_5_6_5 = 0x8363;
    var GL_UNSIGNED_INT_24_8_WEBGL = 0x84FA;

    var GL_HALF_FLOAT_OES = 0x8D61;

    var TYPE_SIZE = {};

    TYPE_SIZE[GL_BYTE] =
    TYPE_SIZE[GL_UNSIGNED_BYTE] = 1;

    TYPE_SIZE[GL_SHORT] =
    TYPE_SIZE[GL_UNSIGNED_SHORT] =
    TYPE_SIZE[GL_HALF_FLOAT_OES] =
    TYPE_SIZE[GL_UNSIGNED_SHORT_5_6_5] =
    TYPE_SIZE[GL_UNSIGNED_SHORT_4_4_4_4] =
    TYPE_SIZE[GL_UNSIGNED_SHORT_5_5_5_1] = 2;

    TYPE_SIZE[GL_INT] =
    TYPE_SIZE[GL_UNSIGNED_INT] =
    TYPE_SIZE[GL_FLOAT] =
    TYPE_SIZE[GL_UNSIGNED_INT_24_8_WEBGL] = 4;

    function pixelSize (type, channels) {
      if (type === GL_UNSIGNED_SHORT_5_5_5_1 ||
          type === GL_UNSIGNED_SHORT_4_4_4_4 ||
          type === GL_UNSIGNED_SHORT_5_6_5) {
        return 2
      } else if (type === GL_UNSIGNED_INT_24_8_WEBGL) {
        return 4
      } else {
        return TYPE_SIZE[type] * channels
      }
    }

    function isPow2 (v) {
      return !(v & (v - 1)) && (!!v)
    }

    function checkTexture2D (info, mipData, limits) {
      var i;
      var w = mipData.width;
      var h = mipData.height;
      var c = mipData.channels;

      // Check texture shape
      check(w > 0 && w <= limits.maxTextureSize &&
            h > 0 && h <= limits.maxTextureSize,
      'invalid texture shape');

      // check wrap mode
      if (info.wrapS !== GL_CLAMP_TO_EDGE || info.wrapT !== GL_CLAMP_TO_EDGE) {
        check(isPow2(w) && isPow2(h),
          'incompatible wrap mode for texture, both width and height must be power of 2');
      }

      if (mipData.mipmask === 1) {
        if (w !== 1 && h !== 1) {
          check(
            info.minFilter !== GL_NEAREST_MIPMAP_NEAREST &&
            info.minFilter !== GL_NEAREST_MIPMAP_LINEAR &&
            info.minFilter !== GL_LINEAR_MIPMAP_NEAREST &&
            info.minFilter !== GL_LINEAR_MIPMAP_LINEAR,
            'min filter requires mipmap');
        }
      } else {
        // texture must be power of 2
        check(isPow2(w) && isPow2(h),
          'texture must be a square power of 2 to support mipmapping');
        check(mipData.mipmask === (w << 1) - 1,
          'missing or incomplete mipmap data');
      }

      if (mipData.type === GL_FLOAT) {
        if (limits.extensions.indexOf('oes_texture_float_linear') < 0) {
          check(info.minFilter === GL_NEAREST && info.magFilter === GL_NEAREST,
            'filter not supported, must enable oes_texture_float_linear');
        }
        check(!info.genMipmaps,
          'mipmap generation not supported with float textures');
      }

      // check image complete
      var mipimages = mipData.images;
      for (i = 0; i < 16; ++i) {
        if (mipimages[i]) {
          var mw = w >> i;
          var mh = h >> i;
          check(mipData.mipmask & (1 << i), 'missing mipmap data');

          var img = mipimages[i];

          check(
            img.width === mw &&
            img.height === mh,
            'invalid shape for mip images');

          check(
            img.format === mipData.format &&
            img.internalformat === mipData.internalformat &&
            img.type === mipData.type,
            'incompatible type for mip image');

          if (img.compressed) ; else if (img.data) {
            // check(img.data.byteLength === mw * mh *
            // Math.max(pixelSize(img.type, c), img.unpackAlignment),
            var rowSize = Math.ceil(pixelSize(img.type, c) * mw / img.unpackAlignment) * img.unpackAlignment;
            check(img.data.byteLength === rowSize * mh,
              'invalid data for image, buffer size is inconsistent with image format');
          } else if (img.element) ; else if (img.copy) ;
        } else if (!info.genMipmaps) {
          check((mipData.mipmask & (1 << i)) === 0, 'extra mipmap data');
        }
      }

      if (mipData.compressed) {
        check(!info.genMipmaps,
          'mipmap generation for compressed images not supported');
      }
    }

    function checkTextureCube (texture, info, faces, limits) {
      var w = texture.width;
      var h = texture.height;
      var c = texture.channels;

      // Check texture shape
      check(
        w > 0 && w <= limits.maxTextureSize && h > 0 && h <= limits.maxTextureSize,
        'invalid texture shape');
      check(
        w === h,
        'cube map must be square');
      check(
        info.wrapS === GL_CLAMP_TO_EDGE && info.wrapT === GL_CLAMP_TO_EDGE,
        'wrap mode not supported by cube map');

      for (var i = 0; i < faces.length; ++i) {
        var face = faces[i];
        check(
          face.width === w && face.height === h,
          'inconsistent cube map face shape');

        if (info.genMipmaps) {
          check(!face.compressed,
            'can not generate mipmap for compressed textures');
          check(face.mipmask === 1,
            'can not specify mipmaps and generate mipmaps');
        }

        var mipmaps = face.images;
        for (var j = 0; j < 16; ++j) {
          var img = mipmaps[j];
          if (img) {
            var mw = w >> j;
            var mh = h >> j;
            check(face.mipmask & (1 << j), 'missing mipmap data');
            check(
              img.width === mw &&
              img.height === mh,
              'invalid shape for mip images');
            check(
              img.format === texture.format &&
              img.internalformat === texture.internalformat &&
              img.type === texture.type,
              'incompatible type for mip image');

            if (img.compressed) ; else if (img.data) {
              check(img.data.byteLength === mw * mh *
                Math.max(pixelSize(img.type, c), img.unpackAlignment),
              'invalid data for image, buffer size is inconsistent with image format');
            } else if (img.element) ; else if (img.copy) ;
          }
        }
      }
    }

    var check$1 = extend(check, {
      optional: checkOptional,
      raise: raise,
      commandRaise: commandRaise,
      command: checkCommand,
      parameter: checkParameter,
      commandParameter: checkParameterCommand,
      constructor: checkConstructor,
      type: checkTypeOf,
      commandType: checkCommandType,
      isTypedArray: checkIsTypedArray,
      nni: checkNonNegativeInt,
      oneOf: checkOneOf,
      shaderError: checkShaderError,
      linkError: checkLinkError,
      callSite: guessCallSite,
      saveCommandRef: saveCommandRef,
      saveDrawInfo: saveDrawCommandInfo,
      framebufferFormat: checkFramebufferFormat,
      guessCommand: guessCommand,
      texture2D: checkTexture2D,
      textureCube: checkTextureCube
    });

    var VARIABLE_COUNTER = 0;

    var DYN_FUNC = 0;
    var DYN_CONSTANT = 5;
    var DYN_ARRAY = 6;

    function DynamicVariable (type, data) {
      this.id = (VARIABLE_COUNTER++);
      this.type = type;
      this.data = data;
    }

    function escapeStr (str) {
      return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
    }

    function splitParts (str) {
      if (str.length === 0) {
        return []
      }

      var firstChar = str.charAt(0);
      var lastChar = str.charAt(str.length - 1);

      if (str.length > 1 &&
          firstChar === lastChar &&
          (firstChar === '"' || firstChar === "'")) {
        return ['"' + escapeStr(str.substr(1, str.length - 2)) + '"']
      }

      var parts = /\[(false|true|null|\d+|'[^']*'|"[^"]*")\]/.exec(str);
      if (parts) {
        return (
          splitParts(str.substr(0, parts.index))
            .concat(splitParts(parts[1]))
            .concat(splitParts(str.substr(parts.index + parts[0].length)))
        )
      }

      var subparts = str.split('.');
      if (subparts.length === 1) {
        return ['"' + escapeStr(str) + '"']
      }

      var result = [];
      for (var i = 0; i < subparts.length; ++i) {
        result = result.concat(splitParts(subparts[i]));
      }
      return result
    }

    function toAccessorString (str) {
      return '[' + splitParts(str).join('][') + ']'
    }

    function defineDynamic (type, data) {
      return new DynamicVariable(type, toAccessorString(data + ''))
    }

    function isDynamic (x) {
      return (typeof x === 'function' && !x._reglType) || (x instanceof DynamicVariable)
    }

    function unbox (x, path) {
      if (typeof x === 'function') {
        return new DynamicVariable(DYN_FUNC, x)
      } else if (typeof x === 'number' || typeof x === 'boolean') {
        return new DynamicVariable(DYN_CONSTANT, x)
      } else if (Array.isArray(x)) {
        return new DynamicVariable(DYN_ARRAY, x.map(function (y, i) { return unbox(y, path + '[' + i + ']') }))
      } else if (x instanceof DynamicVariable) {
        return x
      }
      check$1(false, 'invalid option type in uniform ' + path);
    }

    var dynamic = {
      DynamicVariable: DynamicVariable,
      define: defineDynamic,
      isDynamic: isDynamic,
      unbox: unbox,
      accessor: toAccessorString
    };

    /* globals requestAnimationFrame, cancelAnimationFrame */
    var raf = {
      next: typeof requestAnimationFrame === 'function'
        ? function (cb) { return requestAnimationFrame(cb) }
        : function (cb) { return setTimeout(cb, 16) },
      cancel: typeof cancelAnimationFrame === 'function'
        ? function (raf) { return cancelAnimationFrame(raf) }
        : clearTimeout
    };

    /* globals performance */
    var clock = (typeof performance !== 'undefined' && performance.now)
        ? function () { return performance.now() }
        : function () { return +(new Date()) };

    function createStringStore () {
      var stringIds = { '': 0 };
      var stringValues = [''];
      return {
        id: function (str) {
          var result = stringIds[str];
          if (result) {
            return result
          }
          result = stringIds[str] = stringValues.length;
          stringValues.push(str);
          return result
        },

        str: function (id) {
          return stringValues[id]
        }
      }
    }

    // Context and canvas creation helper functions
    function createCanvas (element, onDone, pixelRatio) {
      var canvas = document.createElement('canvas');
      extend(canvas.style, {
        border: 0,
        margin: 0,
        padding: 0,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      });
      element.appendChild(canvas);

      if (element === document.body) {
        canvas.style.position = 'absolute';
        extend(element.style, {
          margin: 0,
          padding: 0
        });
      }

      function resize () {
        var w = window.innerWidth;
        var h = window.innerHeight;
        if (element !== document.body) {
          var bounds = canvas.getBoundingClientRect();
          w = bounds.right - bounds.left;
          h = bounds.bottom - bounds.top;
        }
        canvas.width = pixelRatio * w;
        canvas.height = pixelRatio * h;
      }

      var resizeObserver;
      if (element !== document.body && typeof ResizeObserver === 'function') {
        // ignore 'ResizeObserver' is not defined
        // eslint-disable-next-line
        resizeObserver = new ResizeObserver(function () {
          // setTimeout to avoid flicker
          setTimeout(resize);
        });
        resizeObserver.observe(element);
      } else {
        window.addEventListener('resize', resize, false);
      }

      function onDestroy () {
        if (resizeObserver) {
          resizeObserver.disconnect();
        } else {
          window.removeEventListener('resize', resize);
        }
        element.removeChild(canvas);
      }

      resize();

      return {
        canvas: canvas,
        onDestroy: onDestroy
      }
    }

    function createContext (canvas, contextAttributes) {
      function get (name) {
        try {
          return canvas.getContext(name, contextAttributes)
        } catch (e) {
          return null
        }
      }
      return (
        get('webgl') ||
        get('experimental-webgl') ||
        get('webgl-experimental')
      )
    }

    function isHTMLElement (obj) {
      return (
        typeof obj.nodeName === 'string' &&
        typeof obj.appendChild === 'function' &&
        typeof obj.getBoundingClientRect === 'function'
      )
    }

    function isWebGLContext (obj) {
      return (
        typeof obj.drawArrays === 'function' ||
        typeof obj.drawElements === 'function'
      )
    }

    function parseExtensions (input) {
      if (typeof input === 'string') {
        return input.split()
      }
      check$1(Array.isArray(input), 'invalid extension array');
      return input
    }

    function getElement (desc) {
      if (typeof desc === 'string') {
        check$1(typeof document !== 'undefined', 'not supported outside of DOM');
        return document.querySelector(desc)
      }
      return desc
    }

    function parseArgs (args_) {
      var args = args_ || {};
      var element, container, canvas, gl;
      var contextAttributes = {};
      var extensions = [];
      var optionalExtensions = [];
      var pixelRatio = (typeof window === 'undefined' ? 1 : window.devicePixelRatio);
      var profile = false;
      var onDone = function (err) {
        if (err) {
          check$1.raise(err);
        }
      };
      var onDestroy = function () {};
      if (typeof args === 'string') {
        check$1(
          typeof document !== 'undefined',
          'selector queries only supported in DOM enviroments');
        element = document.querySelector(args);
        check$1(element, 'invalid query string for element');
      } else if (typeof args === 'object') {
        if (isHTMLElement(args)) {
          element = args;
        } else if (isWebGLContext(args)) {
          gl = args;
          canvas = gl.canvas;
        } else {
          check$1.constructor(args);
          if ('gl' in args) {
            gl = args.gl;
          } else if ('canvas' in args) {
            canvas = getElement(args.canvas);
          } else if ('container' in args) {
            container = getElement(args.container);
          }
          if ('attributes' in args) {
            contextAttributes = args.attributes;
            check$1.type(contextAttributes, 'object', 'invalid context attributes');
          }
          if ('extensions' in args) {
            extensions = parseExtensions(args.extensions);
          }
          if ('optionalExtensions' in args) {
            optionalExtensions = parseExtensions(args.optionalExtensions);
          }
          if ('onDone' in args) {
            check$1.type(
              args.onDone, 'function',
              'invalid or missing onDone callback');
            onDone = args.onDone;
          }
          if ('profile' in args) {
            profile = !!args.profile;
          }
          if ('pixelRatio' in args) {
            pixelRatio = +args.pixelRatio;
            check$1(pixelRatio > 0, 'invalid pixel ratio');
          }
        }
      } else {
        check$1.raise('invalid arguments to regl');
      }

      if (element) {
        if (element.nodeName.toLowerCase() === 'canvas') {
          canvas = element;
        } else {
          container = element;
        }
      }

      if (!gl) {
        if (!canvas) {
          check$1(
            typeof document !== 'undefined',
            'must manually specify webgl context outside of DOM environments');
          var result = createCanvas(container || document.body, onDone, pixelRatio);
          if (!result) {
            return null
          }
          canvas = result.canvas;
          onDestroy = result.onDestroy;
        }
        // workaround for chromium bug, premultiplied alpha value is platform dependent
        if (contextAttributes.premultipliedAlpha === undefined) contextAttributes.premultipliedAlpha = true;
        gl = createContext(canvas, contextAttributes);
      }

      if (!gl) {
        onDestroy();
        onDone('webgl not supported, try upgrading your browser or graphics drivers http://get.webgl.org');
        return null
      }

      return {
        gl: gl,
        canvas: canvas,
        container: container,
        extensions: extensions,
        optionalExtensions: optionalExtensions,
        pixelRatio: pixelRatio,
        profile: profile,
        onDone: onDone,
        onDestroy: onDestroy
      }
    }

    function createExtensionCache (gl, config) {
      var extensions = {};

      function tryLoadExtension (name_) {
        check$1.type(name_, 'string', 'extension name must be string');
        var name = name_.toLowerCase();
        var ext;
        try {
          ext = extensions[name] = gl.getExtension(name);
        } catch (e) {}
        return !!ext
      }

      for (var i = 0; i < config.extensions.length; ++i) {
        var name = config.extensions[i];
        if (!tryLoadExtension(name)) {
          config.onDestroy();
          config.onDone('"' + name + '" extension is not supported by the current WebGL context, try upgrading your system or a different browser');
          return null
        }
      }

      config.optionalExtensions.forEach(tryLoadExtension);

      return {
        extensions: extensions,
        restore: function () {
          Object.keys(extensions).forEach(function (name) {
            if (extensions[name] && !tryLoadExtension(name)) {
              throw new Error('(regl): error restoring extension ' + name)
            }
          });
        }
      }
    }

    function loop (n, f) {
      var result = Array(n);
      for (var i = 0; i < n; ++i) {
        result[i] = f(i);
      }
      return result
    }

    var GL_BYTE$1 = 5120;
    var GL_UNSIGNED_BYTE$2 = 5121;
    var GL_SHORT$1 = 5122;
    var GL_UNSIGNED_SHORT$1 = 5123;
    var GL_INT$1 = 5124;
    var GL_UNSIGNED_INT$1 = 5125;
    var GL_FLOAT$2 = 5126;

    function nextPow16 (v) {
      for (var i = 16; i <= (1 << 28); i *= 16) {
        if (v <= i) {
          return i
        }
      }
      return 0
    }

    function log2 (v) {
      var r, shift;
      r = (v > 0xFFFF) << 4;
      v >>>= r;
      shift = (v > 0xFF) << 3;
      v >>>= shift; r |= shift;
      shift = (v > 0xF) << 2;
      v >>>= shift; r |= shift;
      shift = (v > 0x3) << 1;
      v >>>= shift; r |= shift;
      return r | (v >> 1)
    }

    function createPool () {
      var bufferPool = loop(8, function () {
        return []
      });

      function alloc (n) {
        var sz = nextPow16(n);
        var bin = bufferPool[log2(sz) >> 2];
        if (bin.length > 0) {
          return bin.pop()
        }
        return new ArrayBuffer(sz)
      }

      function free (buf) {
        bufferPool[log2(buf.byteLength) >> 2].push(buf);
      }

      function allocType (type, n) {
        var result = null;
        switch (type) {
          case GL_BYTE$1:
            result = new Int8Array(alloc(n), 0, n);
            break
          case GL_UNSIGNED_BYTE$2:
            result = new Uint8Array(alloc(n), 0, n);
            break
          case GL_SHORT$1:
            result = new Int16Array(alloc(2 * n), 0, n);
            break
          case GL_UNSIGNED_SHORT$1:
            result = new Uint16Array(alloc(2 * n), 0, n);
            break
          case GL_INT$1:
            result = new Int32Array(alloc(4 * n), 0, n);
            break
          case GL_UNSIGNED_INT$1:
            result = new Uint32Array(alloc(4 * n), 0, n);
            break
          case GL_FLOAT$2:
            result = new Float32Array(alloc(4 * n), 0, n);
            break
          default:
            return null
        }
        if (result.length !== n) {
          return result.subarray(0, n)
        }
        return result
      }

      function freeType (array) {
        free(array.buffer);
      }

      return {
        alloc: alloc,
        free: free,
        allocType: allocType,
        freeType: freeType
      }
    }

    var pool = createPool();

    // zero pool for initial zero data
    pool.zero = createPool();

    var GL_SUBPIXEL_BITS = 0x0D50;
    var GL_RED_BITS = 0x0D52;
    var GL_GREEN_BITS = 0x0D53;
    var GL_BLUE_BITS = 0x0D54;
    var GL_ALPHA_BITS = 0x0D55;
    var GL_DEPTH_BITS = 0x0D56;
    var GL_STENCIL_BITS = 0x0D57;

    var GL_ALIASED_POINT_SIZE_RANGE = 0x846D;
    var GL_ALIASED_LINE_WIDTH_RANGE = 0x846E;

    var GL_MAX_TEXTURE_SIZE = 0x0D33;
    var GL_MAX_VIEWPORT_DIMS = 0x0D3A;
    var GL_MAX_VERTEX_ATTRIBS = 0x8869;
    var GL_MAX_VERTEX_UNIFORM_VECTORS = 0x8DFB;
    var GL_MAX_VARYING_VECTORS = 0x8DFC;
    var GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS = 0x8B4D;
    var GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS = 0x8B4C;
    var GL_MAX_TEXTURE_IMAGE_UNITS = 0x8872;
    var GL_MAX_FRAGMENT_UNIFORM_VECTORS = 0x8DFD;
    var GL_MAX_CUBE_MAP_TEXTURE_SIZE = 0x851C;
    var GL_MAX_RENDERBUFFER_SIZE = 0x84E8;

    var GL_VENDOR = 0x1F00;
    var GL_RENDERER = 0x1F01;
    var GL_VERSION = 0x1F02;
    var GL_SHADING_LANGUAGE_VERSION = 0x8B8C;

    var GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT = 0x84FF;

    var GL_MAX_COLOR_ATTACHMENTS_WEBGL = 0x8CDF;
    var GL_MAX_DRAW_BUFFERS_WEBGL = 0x8824;

    var GL_TEXTURE_2D = 0x0DE1;
    var GL_TEXTURE_CUBE_MAP = 0x8513;
    var GL_TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515;
    var GL_TEXTURE0 = 0x84C0;
    var GL_RGBA = 0x1908;
    var GL_FLOAT$1 = 0x1406;
    var GL_UNSIGNED_BYTE$1 = 0x1401;
    var GL_FRAMEBUFFER = 0x8D40;
    var GL_FRAMEBUFFER_COMPLETE = 0x8CD5;
    var GL_COLOR_ATTACHMENT0 = 0x8CE0;
    var GL_COLOR_BUFFER_BIT$1 = 0x4000;

    var wrapLimits = function (gl, extensions) {
      var maxAnisotropic = 1;
      if (extensions.ext_texture_filter_anisotropic) {
        maxAnisotropic = gl.getParameter(GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT);
      }

      var maxDrawbuffers = 1;
      var maxColorAttachments = 1;
      if (extensions.webgl_draw_buffers) {
        maxDrawbuffers = gl.getParameter(GL_MAX_DRAW_BUFFERS_WEBGL);
        maxColorAttachments = gl.getParameter(GL_MAX_COLOR_ATTACHMENTS_WEBGL);
      }

      // detect if reading float textures is available (Safari doesn't support)
      var readFloat = !!extensions.oes_texture_float;
      if (readFloat) {
        var readFloatTexture = gl.createTexture();
        gl.bindTexture(GL_TEXTURE_2D, readFloatTexture);
        gl.texImage2D(GL_TEXTURE_2D, 0, GL_RGBA, 1, 1, 0, GL_RGBA, GL_FLOAT$1, null);

        var fbo = gl.createFramebuffer();
        gl.bindFramebuffer(GL_FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, readFloatTexture, 0);
        gl.bindTexture(GL_TEXTURE_2D, null);

        if (gl.checkFramebufferStatus(GL_FRAMEBUFFER) !== GL_FRAMEBUFFER_COMPLETE) readFloat = false;

        else {
          gl.viewport(0, 0, 1, 1);
          gl.clearColor(1.0, 0.0, 0.0, 1.0);
          gl.clear(GL_COLOR_BUFFER_BIT$1);
          var pixels = pool.allocType(GL_FLOAT$1, 4);
          gl.readPixels(0, 0, 1, 1, GL_RGBA, GL_FLOAT$1, pixels);

          if (gl.getError()) readFloat = false;
          else {
            gl.deleteFramebuffer(fbo);
            gl.deleteTexture(readFloatTexture);

            readFloat = pixels[0] === 1.0;
          }

          pool.freeType(pixels);
        }
      }

      // detect non power of two cube textures support (IE doesn't support)
      var isIE = typeof navigator !== 'undefined' && (/MSIE/.test(navigator.userAgent) || /Trident\//.test(navigator.appVersion) || /Edge/.test(navigator.userAgent));

      var npotTextureCube = true;

      if (!isIE) {
        var cubeTexture = gl.createTexture();
        var data = pool.allocType(GL_UNSIGNED_BYTE$1, 36);
        gl.activeTexture(GL_TEXTURE0);
        gl.bindTexture(GL_TEXTURE_CUBE_MAP, cubeTexture);
        gl.texImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X, 0, GL_RGBA, 3, 3, 0, GL_RGBA, GL_UNSIGNED_BYTE$1, data);
        pool.freeType(data);
        gl.bindTexture(GL_TEXTURE_CUBE_MAP, null);
        gl.deleteTexture(cubeTexture);
        npotTextureCube = !gl.getError();
      }

      return {
        // drawing buffer bit depth
        colorBits: [
          gl.getParameter(GL_RED_BITS),
          gl.getParameter(GL_GREEN_BITS),
          gl.getParameter(GL_BLUE_BITS),
          gl.getParameter(GL_ALPHA_BITS)
        ],
        depthBits: gl.getParameter(GL_DEPTH_BITS),
        stencilBits: gl.getParameter(GL_STENCIL_BITS),
        subpixelBits: gl.getParameter(GL_SUBPIXEL_BITS),

        // supported extensions
        extensions: Object.keys(extensions).filter(function (ext) {
          return !!extensions[ext]
        }),

        // max aniso samples
        maxAnisotropic: maxAnisotropic,

        // max draw buffers
        maxDrawbuffers: maxDrawbuffers,
        maxColorAttachments: maxColorAttachments,

        // point and line size ranges
        pointSizeDims: gl.getParameter(GL_ALIASED_POINT_SIZE_RANGE),
        lineWidthDims: gl.getParameter(GL_ALIASED_LINE_WIDTH_RANGE),
        maxViewportDims: gl.getParameter(GL_MAX_VIEWPORT_DIMS),
        maxCombinedTextureUnits: gl.getParameter(GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS),
        maxCubeMapSize: gl.getParameter(GL_MAX_CUBE_MAP_TEXTURE_SIZE),
        maxRenderbufferSize: gl.getParameter(GL_MAX_RENDERBUFFER_SIZE),
        maxTextureUnits: gl.getParameter(GL_MAX_TEXTURE_IMAGE_UNITS),
        maxTextureSize: gl.getParameter(GL_MAX_TEXTURE_SIZE),
        maxAttributes: gl.getParameter(GL_MAX_VERTEX_ATTRIBS),
        maxVertexUniforms: gl.getParameter(GL_MAX_VERTEX_UNIFORM_VECTORS),
        maxVertexTextureUnits: gl.getParameter(GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS),
        maxVaryingVectors: gl.getParameter(GL_MAX_VARYING_VECTORS),
        maxFragmentUniforms: gl.getParameter(GL_MAX_FRAGMENT_UNIFORM_VECTORS),

        // vendor info
        glsl: gl.getParameter(GL_SHADING_LANGUAGE_VERSION),
        renderer: gl.getParameter(GL_RENDERER),
        vendor: gl.getParameter(GL_VENDOR),
        version: gl.getParameter(GL_VERSION),

        // quirks
        readFloat: readFloat,
        npotTextureCube: npotTextureCube
      }
    };

    function isNDArrayLike (obj) {
      return (
        !!obj &&
        typeof obj === 'object' &&
        Array.isArray(obj.shape) &&
        Array.isArray(obj.stride) &&
        typeof obj.offset === 'number' &&
        obj.shape.length === obj.stride.length &&
        (Array.isArray(obj.data) ||
          isTypedArray(obj.data)))
    }

    var values = function (obj) {
      return Object.keys(obj).map(function (key) { return obj[key] })
    };

    var flattenUtils = {
      shape: arrayShape$1,
      flatten: flattenArray
    };

    function flatten1D (array, nx, out) {
      for (var i = 0; i < nx; ++i) {
        out[i] = array[i];
      }
    }

    function flatten2D (array, nx, ny, out) {
      var ptr = 0;
      for (var i = 0; i < nx; ++i) {
        var row = array[i];
        for (var j = 0; j < ny; ++j) {
          out[ptr++] = row[j];
        }
      }
    }

    function flatten3D (array, nx, ny, nz, out, ptr_) {
      var ptr = ptr_;
      for (var i = 0; i < nx; ++i) {
        var row = array[i];
        for (var j = 0; j < ny; ++j) {
          var col = row[j];
          for (var k = 0; k < nz; ++k) {
            out[ptr++] = col[k];
          }
        }
      }
    }

    function flattenRec (array, shape, level, out, ptr) {
      var stride = 1;
      for (var i = level + 1; i < shape.length; ++i) {
        stride *= shape[i];
      }
      var n = shape[level];
      if (shape.length - level === 4) {
        var nx = shape[level + 1];
        var ny = shape[level + 2];
        var nz = shape[level + 3];
        for (i = 0; i < n; ++i) {
          flatten3D(array[i], nx, ny, nz, out, ptr);
          ptr += stride;
        }
      } else {
        for (i = 0; i < n; ++i) {
          flattenRec(array[i], shape, level + 1, out, ptr);
          ptr += stride;
        }
      }
    }

    function flattenArray (array, shape, type, out_) {
      var sz = 1;
      if (shape.length) {
        for (var i = 0; i < shape.length; ++i) {
          sz *= shape[i];
        }
      } else {
        sz = 0;
      }
      var out = out_ || pool.allocType(type, sz);
      switch (shape.length) {
        case 0:
          break
        case 1:
          flatten1D(array, shape[0], out);
          break
        case 2:
          flatten2D(array, shape[0], shape[1], out);
          break
        case 3:
          flatten3D(array, shape[0], shape[1], shape[2], out, 0);
          break
        default:
          flattenRec(array, shape, 0, out, 0);
      }
      return out
    }

    function arrayShape$1 (array_) {
      var shape = [];
      for (var array = array_; array.length; array = array[0]) {
        shape.push(array.length);
      }
      return shape
    }

    var arrayTypes =  {
    	"[object Int8Array]": 5120,
    	"[object Int16Array]": 5122,
    	"[object Int32Array]": 5124,
    	"[object Uint8Array]": 5121,
    	"[object Uint8ClampedArray]": 5121,
    	"[object Uint16Array]": 5123,
    	"[object Uint32Array]": 5125,
    	"[object Float32Array]": 5126,
    	"[object Float64Array]": 5121,
    	"[object ArrayBuffer]": 5121
    };

    var int8 = 5120;
    var int16 = 5122;
    var int32 = 5124;
    var uint8 = 5121;
    var uint16 = 5123;
    var uint32 = 5125;
    var float = 5126;
    var float32 = 5126;
    var glTypes = {
    	int8: int8,
    	int16: int16,
    	int32: int32,
    	uint8: uint8,
    	uint16: uint16,
    	uint32: uint32,
    	float: float,
    	float32: float32
    };

    var dynamic$1 = 35048;
    var stream = 35040;
    var usageTypes = {
    	dynamic: dynamic$1,
    	stream: stream,
    	"static": 35044
    };

    var arrayFlatten = flattenUtils.flatten;
    var arrayShape = flattenUtils.shape;

    var GL_STATIC_DRAW = 0x88E4;
    var GL_STREAM_DRAW = 0x88E0;

    var GL_UNSIGNED_BYTE$3 = 5121;
    var GL_FLOAT$3 = 5126;

    var DTYPES_SIZES = [];
    DTYPES_SIZES[5120] = 1; // int8
    DTYPES_SIZES[5122] = 2; // int16
    DTYPES_SIZES[5124] = 4; // int32
    DTYPES_SIZES[5121] = 1; // uint8
    DTYPES_SIZES[5123] = 2; // uint16
    DTYPES_SIZES[5125] = 4; // uint32
    DTYPES_SIZES[5126] = 4; // float32

    function typedArrayCode (data) {
      return arrayTypes[Object.prototype.toString.call(data)] | 0
    }

    function copyArray (out, inp) {
      for (var i = 0; i < inp.length; ++i) {
        out[i] = inp[i];
      }
    }

    function transpose (
      result, data, shapeX, shapeY, strideX, strideY, offset) {
      var ptr = 0;
      for (var i = 0; i < shapeX; ++i) {
        for (var j = 0; j < shapeY; ++j) {
          result[ptr++] = data[strideX * i + strideY * j + offset];
        }
      }
    }

    function wrapBufferState (gl, stats, config, destroyBuffer) {
      var bufferCount = 0;
      var bufferSet = {};

      function REGLBuffer (type) {
        this.id = bufferCount++;
        this.buffer = gl.createBuffer();
        this.type = type;
        this.usage = GL_STATIC_DRAW;
        this.byteLength = 0;
        this.dimension = 1;
        this.dtype = GL_UNSIGNED_BYTE$3;

        this.persistentData = null;

        if (config.profile) {
          this.stats = { size: 0 };
        }
      }

      REGLBuffer.prototype.bind = function () {
        gl.bindBuffer(this.type, this.buffer);
      };

      REGLBuffer.prototype.destroy = function () {
        destroy(this);
      };

      var streamPool = [];

      function createStream (type, data) {
        var buffer = streamPool.pop();
        if (!buffer) {
          buffer = new REGLBuffer(type);
        }
        buffer.bind();
        initBufferFromData(buffer, data, GL_STREAM_DRAW, 0, 1, false);
        return buffer
      }

      function destroyStream (stream$$1) {
        streamPool.push(stream$$1);
      }

      function initBufferFromTypedArray (buffer, data, usage) {
        buffer.byteLength = data.byteLength;
        gl.bufferData(buffer.type, data, usage);
      }

      function initBufferFromData (buffer, data, usage, dtype, dimension, persist) {
        var shape;
        buffer.usage = usage;
        if (Array.isArray(data)) {
          buffer.dtype = dtype || GL_FLOAT$3;
          if (data.length > 0) {
            var flatData;
            if (Array.isArray(data[0])) {
              shape = arrayShape(data);
              var dim = 1;
              for (var i = 1; i < shape.length; ++i) {
                dim *= shape[i];
              }
              buffer.dimension = dim;
              flatData = arrayFlatten(data, shape, buffer.dtype);
              initBufferFromTypedArray(buffer, flatData, usage);
              if (persist) {
                buffer.persistentData = flatData;
              } else {
                pool.freeType(flatData);
              }
            } else if (typeof data[0] === 'number') {
              buffer.dimension = dimension;
              var typedData = pool.allocType(buffer.dtype, data.length);
              copyArray(typedData, data);
              initBufferFromTypedArray(buffer, typedData, usage);
              if (persist) {
                buffer.persistentData = typedData;
              } else {
                pool.freeType(typedData);
              }
            } else if (isTypedArray(data[0])) {
              buffer.dimension = data[0].length;
              buffer.dtype = dtype || typedArrayCode(data[0]) || GL_FLOAT$3;
              flatData = arrayFlatten(
                data,
                [data.length, data[0].length],
                buffer.dtype);
              initBufferFromTypedArray(buffer, flatData, usage);
              if (persist) {
                buffer.persistentData = flatData;
              } else {
                pool.freeType(flatData);
              }
            } else {
              check$1.raise('invalid buffer data');
            }
          }
        } else if (isTypedArray(data)) {
          buffer.dtype = dtype || typedArrayCode(data);
          buffer.dimension = dimension;
          initBufferFromTypedArray(buffer, data, usage);
          if (persist) {
            buffer.persistentData = new Uint8Array(new Uint8Array(data.buffer));
          }
        } else if (isNDArrayLike(data)) {
          shape = data.shape;
          var stride = data.stride;
          var offset = data.offset;

          var shapeX = 0;
          var shapeY = 0;
          var strideX = 0;
          var strideY = 0;
          if (shape.length === 1) {
            shapeX = shape[0];
            shapeY = 1;
            strideX = stride[0];
            strideY = 0;
          } else if (shape.length === 2) {
            shapeX = shape[0];
            shapeY = shape[1];
            strideX = stride[0];
            strideY = stride[1];
          } else {
            check$1.raise('invalid shape');
          }

          buffer.dtype = dtype || typedArrayCode(data.data) || GL_FLOAT$3;
          buffer.dimension = shapeY;

          var transposeData = pool.allocType(buffer.dtype, shapeX * shapeY);
          transpose(transposeData,
            data.data,
            shapeX, shapeY,
            strideX, strideY,
            offset);
          initBufferFromTypedArray(buffer, transposeData, usage);
          if (persist) {
            buffer.persistentData = transposeData;
          } else {
            pool.freeType(transposeData);
          }
        } else if (data instanceof ArrayBuffer) {
          buffer.dtype = GL_UNSIGNED_BYTE$3;
          buffer.dimension = dimension;
          initBufferFromTypedArray(buffer, data, usage);
          if (persist) {
            buffer.persistentData = new Uint8Array(new Uint8Array(data));
          }
        } else {
          check$1.raise('invalid buffer data');
        }
      }

      function destroy (buffer) {
        stats.bufferCount--;

        // remove attribute link
        destroyBuffer(buffer);

        var handle = buffer.buffer;
        check$1(handle, 'buffer must not be deleted already');
        gl.deleteBuffer(handle);
        buffer.buffer = null;
        delete bufferSet[buffer.id];
      }

      function createBuffer (options, type, deferInit, persistent) {
        stats.bufferCount++;

        var buffer = new REGLBuffer(type);
        bufferSet[buffer.id] = buffer;

        function reglBuffer (options) {
          var usage = GL_STATIC_DRAW;
          var data = null;
          var byteLength = 0;
          var dtype = 0;
          var dimension = 1;
          if (Array.isArray(options) ||
              isTypedArray(options) ||
              isNDArrayLike(options) ||
              options instanceof ArrayBuffer) {
            data = options;
          } else if (typeof options === 'number') {
            byteLength = options | 0;
          } else if (options) {
            check$1.type(
              options, 'object',
              'buffer arguments must be an object, a number or an array');

            if ('data' in options) {
              check$1(
                data === null ||
                Array.isArray(data) ||
                isTypedArray(data) ||
                isNDArrayLike(data),
                'invalid data for buffer');
              data = options.data;
            }

            if ('usage' in options) {
              check$1.parameter(options.usage, usageTypes, 'invalid buffer usage');
              usage = usageTypes[options.usage];
            }

            if ('type' in options) {
              check$1.parameter(options.type, glTypes, 'invalid buffer type');
              dtype = glTypes[options.type];
            }

            if ('dimension' in options) {
              check$1.type(options.dimension, 'number', 'invalid dimension');
              dimension = options.dimension | 0;
            }

            if ('length' in options) {
              check$1.nni(byteLength, 'buffer length must be a nonnegative integer');
              byteLength = options.length | 0;
            }
          }

          buffer.bind();
          if (!data) {
            // #475
            if (byteLength) gl.bufferData(buffer.type, byteLength, usage);
            buffer.dtype = dtype || GL_UNSIGNED_BYTE$3;
            buffer.usage = usage;
            buffer.dimension = dimension;
            buffer.byteLength = byteLength;
          } else {
            initBufferFromData(buffer, data, usage, dtype, dimension, persistent);
          }

          if (config.profile) {
            buffer.stats.size = buffer.byteLength * DTYPES_SIZES[buffer.dtype];
          }

          return reglBuffer
        }

        function setSubData (data, offset) {
          check$1(offset + data.byteLength <= buffer.byteLength,
            'invalid buffer subdata call, buffer is too small. ' + ' Can\'t write data of size ' + data.byteLength + ' starting from offset ' + offset + ' to a buffer of size ' + buffer.byteLength);

          gl.bufferSubData(buffer.type, offset, data);
        }

        function subdata (data, offset_) {
          var offset = (offset_ || 0) | 0;
          var shape;
          buffer.bind();
          if (isTypedArray(data) || data instanceof ArrayBuffer) {
            setSubData(data, offset);
          } else if (Array.isArray(data)) {
            if (data.length > 0) {
              if (typeof data[0] === 'number') {
                var converted = pool.allocType(buffer.dtype, data.length);
                copyArray(converted, data);
                setSubData(converted, offset);
                pool.freeType(converted);
              } else if (Array.isArray(data[0]) || isTypedArray(data[0])) {
                shape = arrayShape(data);
                var flatData = arrayFlatten(data, shape, buffer.dtype);
                setSubData(flatData, offset);
                pool.freeType(flatData);
              } else {
                check$1.raise('invalid buffer data');
              }
            }
          } else if (isNDArrayLike(data)) {
            shape = data.shape;
            var stride = data.stride;

            var shapeX = 0;
            var shapeY = 0;
            var strideX = 0;
            var strideY = 0;
            if (shape.length === 1) {
              shapeX = shape[0];
              shapeY = 1;
              strideX = stride[0];
              strideY = 0;
            } else if (shape.length === 2) {
              shapeX = shape[0];
              shapeY = shape[1];
              strideX = stride[0];
              strideY = stride[1];
            } else {
              check$1.raise('invalid shape');
            }
            var dtype = Array.isArray(data.data)
              ? buffer.dtype
              : typedArrayCode(data.data);

            var transposeData = pool.allocType(dtype, shapeX * shapeY);
            transpose(transposeData,
              data.data,
              shapeX, shapeY,
              strideX, strideY,
              data.offset);
            setSubData(transposeData, offset);
            pool.freeType(transposeData);
          } else {
            check$1.raise('invalid data for buffer subdata');
          }
          return reglBuffer
        }

        if (!deferInit) {
          reglBuffer(options);
        }

        reglBuffer._reglType = 'buffer';
        reglBuffer._buffer = buffer;
        reglBuffer.subdata = subdata;
        if (config.profile) {
          reglBuffer.stats = buffer.stats;
        }
        reglBuffer.destroy = function () { destroy(buffer); };

        return reglBuffer
      }

      function restoreBuffers () {
        values(bufferSet).forEach(function (buffer) {
          buffer.buffer = gl.createBuffer();
          gl.bindBuffer(buffer.type, buffer.buffer);
          gl.bufferData(
            buffer.type, buffer.persistentData || buffer.byteLength, buffer.usage);
        });
      }

      if (config.profile) {
        stats.getTotalBufferSize = function () {
          var total = 0;
          // TODO: Right now, the streams are not part of the total count.
          Object.keys(bufferSet).forEach(function (key) {
            total += bufferSet[key].stats.size;
          });
          return total
        };
      }

      return {
        create: createBuffer,

        createStream: createStream,
        destroyStream: destroyStream,

        clear: function () {
          values(bufferSet).forEach(destroy);
          streamPool.forEach(destroy);
        },

        getBuffer: function (wrapper) {
          if (wrapper && wrapper._buffer instanceof REGLBuffer) {
            return wrapper._buffer
          }
          return null
        },

        restore: restoreBuffers,

        _initBuffer: initBufferFromData
      }
    }

    var points = 0;
    var point = 0;
    var lines = 1;
    var line = 1;
    var triangles = 4;
    var triangle = 4;
    var primTypes = {
    	points: points,
    	point: point,
    	lines: lines,
    	line: line,
    	triangles: triangles,
    	triangle: triangle,
    	"line loop": 2,
    	"line strip": 3,
    	"triangle strip": 5,
    	"triangle fan": 6
    };

    var GL_POINTS = 0;
    var GL_LINES = 1;
    var GL_TRIANGLES = 4;

    var GL_BYTE$2 = 5120;
    var GL_UNSIGNED_BYTE$4 = 5121;
    var GL_SHORT$2 = 5122;
    var GL_UNSIGNED_SHORT$2 = 5123;
    var GL_INT$2 = 5124;
    var GL_UNSIGNED_INT$2 = 5125;

    var GL_ELEMENT_ARRAY_BUFFER = 34963;

    var GL_STREAM_DRAW$1 = 0x88E0;
    var GL_STATIC_DRAW$1 = 0x88E4;

    function wrapElementsState (gl, extensions, bufferState, stats) {
      var elementSet = {};
      var elementCount = 0;

      var elementTypes = {
        'uint8': GL_UNSIGNED_BYTE$4,
        'uint16': GL_UNSIGNED_SHORT$2
      };

      if (extensions.oes_element_index_uint) {
        elementTypes.uint32 = GL_UNSIGNED_INT$2;
      }

      function REGLElementBuffer (buffer) {
        this.id = elementCount++;
        elementSet[this.id] = this;
        this.buffer = buffer;
        this.primType = GL_TRIANGLES;
        this.vertCount = 0;
        this.type = 0;
      }

      REGLElementBuffer.prototype.bind = function () {
        this.buffer.bind();
      };

      var bufferPool = [];

      function createElementStream (data) {
        var result = bufferPool.pop();
        if (!result) {
          result = new REGLElementBuffer(bufferState.create(
            null,
            GL_ELEMENT_ARRAY_BUFFER,
            true,
            false)._buffer);
        }
        initElements(result, data, GL_STREAM_DRAW$1, -1, -1, 0, 0);
        return result
      }

      function destroyElementStream (elements) {
        bufferPool.push(elements);
      }

      function initElements (
        elements,
        data,
        usage,
        prim,
        count,
        byteLength,
        type) {
        elements.buffer.bind();
        var dtype;
        if (data) {
          var predictedType = type;
          if (!type && (
            !isTypedArray(data) ||
             (isNDArrayLike(data) && !isTypedArray(data.data)))) {
            predictedType = extensions.oes_element_index_uint
              ? GL_UNSIGNED_INT$2
              : GL_UNSIGNED_SHORT$2;
          }
          bufferState._initBuffer(
            elements.buffer,
            data,
            usage,
            predictedType,
            3);
        } else {
          gl.bufferData(GL_ELEMENT_ARRAY_BUFFER, byteLength, usage);
          elements.buffer.dtype = dtype || GL_UNSIGNED_BYTE$4;
          elements.buffer.usage = usage;
          elements.buffer.dimension = 3;
          elements.buffer.byteLength = byteLength;
        }

        dtype = type;
        if (!type) {
          switch (elements.buffer.dtype) {
            case GL_UNSIGNED_BYTE$4:
            case GL_BYTE$2:
              dtype = GL_UNSIGNED_BYTE$4;
              break

            case GL_UNSIGNED_SHORT$2:
            case GL_SHORT$2:
              dtype = GL_UNSIGNED_SHORT$2;
              break

            case GL_UNSIGNED_INT$2:
            case GL_INT$2:
              dtype = GL_UNSIGNED_INT$2;
              break

            default:
              check$1.raise('unsupported type for element array');
          }
          elements.buffer.dtype = dtype;
        }
        elements.type = dtype;

        // Check oes_element_index_uint extension
        check$1(
          dtype !== GL_UNSIGNED_INT$2 ||
          !!extensions.oes_element_index_uint,
          '32 bit element buffers not supported, enable oes_element_index_uint first');

        // try to guess default primitive type and arguments
        var vertCount = count;
        if (vertCount < 0) {
          vertCount = elements.buffer.byteLength;
          if (dtype === GL_UNSIGNED_SHORT$2) {
            vertCount >>= 1;
          } else if (dtype === GL_UNSIGNED_INT$2) {
            vertCount >>= 2;
          }
        }
        elements.vertCount = vertCount;

        // try to guess primitive type from cell dimension
        var primType = prim;
        if (prim < 0) {
          primType = GL_TRIANGLES;
          var dimension = elements.buffer.dimension;
          if (dimension === 1) primType = GL_POINTS;
          if (dimension === 2) primType = GL_LINES;
          if (dimension === 3) primType = GL_TRIANGLES;
        }
        elements.primType = primType;
      }

      function destroyElements (elements) {
        stats.elementsCount--;

        check$1(elements.buffer !== null, 'must not double destroy elements');
        delete elementSet[elements.id];
        elements.buffer.destroy();
        elements.buffer = null;
      }

      function createElements (options, persistent) {
        var buffer = bufferState.create(null, GL_ELEMENT_ARRAY_BUFFER, true);
        var elements = new REGLElementBuffer(buffer._buffer);
        stats.elementsCount++;

        function reglElements (options) {
          if (!options) {
            buffer();
            elements.primType = GL_TRIANGLES;
            elements.vertCount = 0;
            elements.type = GL_UNSIGNED_BYTE$4;
          } else if (typeof options === 'number') {
            buffer(options);
            elements.primType = GL_TRIANGLES;
            elements.vertCount = options | 0;
            elements.type = GL_UNSIGNED_BYTE$4;
          } else {
            var data = null;
            var usage = GL_STATIC_DRAW$1;
            var primType = -1;
            var vertCount = -1;
            var byteLength = 0;
            var dtype = 0;
            if (Array.isArray(options) ||
                isTypedArray(options) ||
                isNDArrayLike(options)) {
              data = options;
            } else {
              check$1.type(options, 'object', 'invalid arguments for elements');
              if ('data' in options) {
                data = options.data;
                check$1(
                  Array.isArray(data) ||
                    isTypedArray(data) ||
                    isNDArrayLike(data),
                  'invalid data for element buffer');
              }
              if ('usage' in options) {
                check$1.parameter(
                  options.usage,
                  usageTypes,
                  'invalid element buffer usage');
                usage = usageTypes[options.usage];
              }
              if ('primitive' in options) {
                check$1.parameter(
                  options.primitive,
                  primTypes,
                  'invalid element buffer primitive');
                primType = primTypes[options.primitive];
              }
              if ('count' in options) {
                check$1(
                  typeof options.count === 'number' && options.count >= 0,
                  'invalid vertex count for elements');
                vertCount = options.count | 0;
              }
              if ('type' in options) {
                check$1.parameter(
                  options.type,
                  elementTypes,
                  'invalid buffer type');
                dtype = elementTypes[options.type];
              }
              if ('length' in options) {
                byteLength = options.length | 0;
              } else {
                byteLength = vertCount;
                if (dtype === GL_UNSIGNED_SHORT$2 || dtype === GL_SHORT$2) {
                  byteLength *= 2;
                } else if (dtype === GL_UNSIGNED_INT$2 || dtype === GL_INT$2) {
                  byteLength *= 4;
                }
              }
            }
            initElements(
              elements,
              data,
              usage,
              primType,
              vertCount,
              byteLength,
              dtype);
          }

          return reglElements
        }

        reglElements(options);

        reglElements._reglType = 'elements';
        reglElements._elements = elements;
        reglElements.subdata = function (data, offset) {
          buffer.subdata(data, offset);
          return reglElements
        };
        reglElements.destroy = function () {
          destroyElements(elements);
        };

        return reglElements
      }

      return {
        create: createElements,
        createStream: createElementStream,
        destroyStream: destroyElementStream,
        getElements: function (elements) {
          if (typeof elements === 'function' &&
              elements._elements instanceof REGLElementBuffer) {
            return elements._elements
          }
          return null
        },
        clear: function () {
          values(elementSet).forEach(destroyElements);
        }
      }
    }

    var FLOAT = new Float32Array(1);
    var INT = new Uint32Array(FLOAT.buffer);

    var GL_UNSIGNED_SHORT$4 = 5123;

    function convertToHalfFloat (array) {
      var ushorts = pool.allocType(GL_UNSIGNED_SHORT$4, array.length);

      for (var i = 0; i < array.length; ++i) {
        if (isNaN(array[i])) {
          ushorts[i] = 0xffff;
        } else if (array[i] === Infinity) {
          ushorts[i] = 0x7c00;
        } else if (array[i] === -Infinity) {
          ushorts[i] = 0xfc00;
        } else {
          FLOAT[0] = array[i];
          var x = INT[0];

          var sgn = (x >>> 31) << 15;
          var exp = ((x << 1) >>> 24) - 127;
          var frac = (x >> 13) & ((1 << 10) - 1);

          if (exp < -24) {
            // round non-representable denormals to 0
            ushorts[i] = sgn;
          } else if (exp < -14) {
            // handle denormals
            var s = -14 - exp;
            ushorts[i] = sgn + ((frac + (1 << 10)) >> s);
          } else if (exp > 15) {
            // round overflow to +/- Infinity
            ushorts[i] = sgn + 0x7c00;
          } else {
            // otherwise convert directly
            ushorts[i] = sgn + ((exp + 15) << 10) + frac;
          }
        }
      }

      return ushorts
    }

    function isArrayLike (s) {
      return Array.isArray(s) || isTypedArray(s)
    }

    var isPow2$1 = function (v) {
      return !(v & (v - 1)) && (!!v)
    };

    var GL_COMPRESSED_TEXTURE_FORMATS = 0x86A3;

    var GL_TEXTURE_2D$1 = 0x0DE1;
    var GL_TEXTURE_CUBE_MAP$1 = 0x8513;
    var GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 = 0x8515;

    var GL_RGBA$1 = 0x1908;
    var GL_ALPHA = 0x1906;
    var GL_RGB = 0x1907;
    var GL_LUMINANCE = 0x1909;
    var GL_LUMINANCE_ALPHA = 0x190A;

    var GL_RGBA4 = 0x8056;
    var GL_RGB5_A1 = 0x8057;
    var GL_RGB565 = 0x8D62;

    var GL_UNSIGNED_SHORT_4_4_4_4$1 = 0x8033;
    var GL_UNSIGNED_SHORT_5_5_5_1$1 = 0x8034;
    var GL_UNSIGNED_SHORT_5_6_5$1 = 0x8363;
    var GL_UNSIGNED_INT_24_8_WEBGL$1 = 0x84FA;

    var GL_DEPTH_COMPONENT = 0x1902;
    var GL_DEPTH_STENCIL = 0x84F9;

    var GL_SRGB_EXT = 0x8C40;
    var GL_SRGB_ALPHA_EXT = 0x8C42;

    var GL_HALF_FLOAT_OES$1 = 0x8D61;

    var GL_COMPRESSED_RGB_S3TC_DXT1_EXT = 0x83F0;
    var GL_COMPRESSED_RGBA_S3TC_DXT1_EXT = 0x83F1;
    var GL_COMPRESSED_RGBA_S3TC_DXT3_EXT = 0x83F2;
    var GL_COMPRESSED_RGBA_S3TC_DXT5_EXT = 0x83F3;

    var GL_COMPRESSED_RGB_ATC_WEBGL = 0x8C92;
    var GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL = 0x8C93;
    var GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL = 0x87EE;

    var GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8C00;
    var GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 0x8C01;
    var GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8C02;
    var GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8C03;

    var GL_COMPRESSED_RGB_ETC1_WEBGL = 0x8D64;

    var GL_UNSIGNED_BYTE$5 = 0x1401;
    var GL_UNSIGNED_SHORT$3 = 0x1403;
    var GL_UNSIGNED_INT$3 = 0x1405;
    var GL_FLOAT$4 = 0x1406;

    var GL_TEXTURE_WRAP_S = 0x2802;
    var GL_TEXTURE_WRAP_T = 0x2803;

    var GL_REPEAT = 0x2901;
    var GL_CLAMP_TO_EDGE$1 = 0x812F;
    var GL_MIRRORED_REPEAT = 0x8370;

    var GL_TEXTURE_MAG_FILTER = 0x2800;
    var GL_TEXTURE_MIN_FILTER = 0x2801;

    var GL_NEAREST$1 = 0x2600;
    var GL_LINEAR = 0x2601;
    var GL_NEAREST_MIPMAP_NEAREST$1 = 0x2700;
    var GL_LINEAR_MIPMAP_NEAREST$1 = 0x2701;
    var GL_NEAREST_MIPMAP_LINEAR$1 = 0x2702;
    var GL_LINEAR_MIPMAP_LINEAR$1 = 0x2703;

    var GL_GENERATE_MIPMAP_HINT = 0x8192;
    var GL_DONT_CARE = 0x1100;
    var GL_FASTEST = 0x1101;
    var GL_NICEST = 0x1102;

    var GL_TEXTURE_MAX_ANISOTROPY_EXT = 0x84FE;

    var GL_UNPACK_ALIGNMENT = 0x0CF5;
    var GL_UNPACK_FLIP_Y_WEBGL = 0x9240;
    var GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241;
    var GL_UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243;

    var GL_BROWSER_DEFAULT_WEBGL = 0x9244;

    var GL_TEXTURE0$1 = 0x84C0;

    var MIPMAP_FILTERS = [
      GL_NEAREST_MIPMAP_NEAREST$1,
      GL_NEAREST_MIPMAP_LINEAR$1,
      GL_LINEAR_MIPMAP_NEAREST$1,
      GL_LINEAR_MIPMAP_LINEAR$1
    ];

    var CHANNELS_FORMAT = [
      0,
      GL_LUMINANCE,
      GL_LUMINANCE_ALPHA,
      GL_RGB,
      GL_RGBA$1
    ];

    var FORMAT_CHANNELS = {};
    FORMAT_CHANNELS[GL_LUMINANCE] =
    FORMAT_CHANNELS[GL_ALPHA] =
    FORMAT_CHANNELS[GL_DEPTH_COMPONENT] = 1;
    FORMAT_CHANNELS[GL_DEPTH_STENCIL] =
    FORMAT_CHANNELS[GL_LUMINANCE_ALPHA] = 2;
    FORMAT_CHANNELS[GL_RGB] =
    FORMAT_CHANNELS[GL_SRGB_EXT] = 3;
    FORMAT_CHANNELS[GL_RGBA$1] =
    FORMAT_CHANNELS[GL_SRGB_ALPHA_EXT] = 4;

    function objectName (str) {
      return '[object ' + str + ']'
    }

    var CANVAS_CLASS = objectName('HTMLCanvasElement');
    var OFFSCREENCANVAS_CLASS = objectName('OffscreenCanvas');
    var CONTEXT2D_CLASS = objectName('CanvasRenderingContext2D');
    var BITMAP_CLASS = objectName('ImageBitmap');
    var IMAGE_CLASS = objectName('HTMLImageElement');
    var VIDEO_CLASS = objectName('HTMLVideoElement');

    var PIXEL_CLASSES = Object.keys(arrayTypes).concat([
      CANVAS_CLASS,
      OFFSCREENCANVAS_CLASS,
      CONTEXT2D_CLASS,
      BITMAP_CLASS,
      IMAGE_CLASS,
      VIDEO_CLASS
    ]);

    // for every texture type, store
    // the size in bytes.
    var TYPE_SIZES = [];
    TYPE_SIZES[GL_UNSIGNED_BYTE$5] = 1;
    TYPE_SIZES[GL_FLOAT$4] = 4;
    TYPE_SIZES[GL_HALF_FLOAT_OES$1] = 2;

    TYPE_SIZES[GL_UNSIGNED_SHORT$3] = 2;
    TYPE_SIZES[GL_UNSIGNED_INT$3] = 4;

    var FORMAT_SIZES_SPECIAL = [];
    FORMAT_SIZES_SPECIAL[GL_RGBA4] = 2;
    FORMAT_SIZES_SPECIAL[GL_RGB5_A1] = 2;
    FORMAT_SIZES_SPECIAL[GL_RGB565] = 2;
    FORMAT_SIZES_SPECIAL[GL_DEPTH_STENCIL] = 4;

    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_S3TC_DXT1_EXT] = 0.5;
    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_S3TC_DXT1_EXT] = 0.5;
    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_S3TC_DXT3_EXT] = 1;
    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_S3TC_DXT5_EXT] = 1;

    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_ATC_WEBGL] = 0.5;
    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL] = 1;
    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL] = 1;

    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG] = 0.5;
    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG] = 0.25;
    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG] = 0.5;
    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG] = 0.25;

    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_ETC1_WEBGL] = 0.5;

    function isNumericArray (arr) {
      return (
        Array.isArray(arr) &&
        (arr.length === 0 ||
        typeof arr[0] === 'number'))
    }

    function isRectArray (arr) {
      if (!Array.isArray(arr)) {
        return false
      }
      var width = arr.length;
      if (width === 0 || !isArrayLike(arr[0])) {
        return false
      }
      return true
    }

    function classString (x) {
      return Object.prototype.toString.call(x)
    }

    function isCanvasElement (object) {
      return classString(object) === CANVAS_CLASS
    }

    function isOffscreenCanvas (object) {
      return classString(object) === OFFSCREENCANVAS_CLASS
    }

    function isContext2D (object) {
      return classString(object) === CONTEXT2D_CLASS
    }

    function isBitmap (object) {
      return classString(object) === BITMAP_CLASS
    }

    function isImageElement (object) {
      return classString(object) === IMAGE_CLASS
    }

    function isVideoElement (object) {
      return classString(object) === VIDEO_CLASS
    }

    function isPixelData (object) {
      if (!object) {
        return false
      }
      var className = classString(object);
      if (PIXEL_CLASSES.indexOf(className) >= 0) {
        return true
      }
      return (
        isNumericArray(object) ||
        isRectArray(object) ||
        isNDArrayLike(object))
    }

    function typedArrayCode$1 (data) {
      return arrayTypes[Object.prototype.toString.call(data)] | 0
    }

    function convertData (result, data) {
      var n = data.length;
      switch (result.type) {
        case GL_UNSIGNED_BYTE$5:
        case GL_UNSIGNED_SHORT$3:
        case GL_UNSIGNED_INT$3:
        case GL_FLOAT$4:
          var converted = pool.allocType(result.type, n);
          converted.set(data);
          result.data = converted;
          break

        case GL_HALF_FLOAT_OES$1:
          result.data = convertToHalfFloat(data);
          break

        default:
          check$1.raise('unsupported texture type, must specify a typed array');
      }
    }

    function preConvert (image, n) {
      return pool.allocType(
        image.type === GL_HALF_FLOAT_OES$1
          ? GL_FLOAT$4
          : image.type, n)
    }

    function postConvert (image, data) {
      if (image.type === GL_HALF_FLOAT_OES$1) {
        image.data = convertToHalfFloat(data);
        pool.freeType(data);
      } else {
        image.data = data;
      }
    }

    function transposeData (image, array, strideX, strideY, strideC, offset) {
      var w = image.width;
      var h = image.height;
      var c = image.channels;
      var n = w * h * c;
      var data = preConvert(image, n);

      var p = 0;
      for (var i = 0; i < h; ++i) {
        for (var j = 0; j < w; ++j) {
          for (var k = 0; k < c; ++k) {
            data[p++] = array[strideX * j + strideY * i + strideC * k + offset];
          }
        }
      }

      postConvert(image, data);
    }

    function getTextureSize (format, type, width, height, isMipmap, isCube) {
      var s;
      if (typeof FORMAT_SIZES_SPECIAL[format] !== 'undefined') {
        // we have a special array for dealing with weird color formats such as RGB5A1
        s = FORMAT_SIZES_SPECIAL[format];
      } else {
        s = FORMAT_CHANNELS[format] * TYPE_SIZES[type];
      }

      if (isCube) {
        s *= 6;
      }

      if (isMipmap) {
        // compute the total size of all the mipmaps.
        var total = 0;

        var w = width;
        while (w >= 1) {
          // we can only use mipmaps on a square image,
          // so we can simply use the width and ignore the height:
          total += s * w * w;
          w /= 2;
        }
        return total
      } else {
        return s * width * height
      }
    }

    function createTextureSet (
      gl, extensions, limits, reglPoll, contextState, stats, config) {
      // -------------------------------------------------------
      // Initialize constants and parameter tables here
      // -------------------------------------------------------
      var mipmapHint = {
        "don't care": GL_DONT_CARE,
        'dont care': GL_DONT_CARE,
        'nice': GL_NICEST,
        'fast': GL_FASTEST
      };

      var wrapModes = {
        'repeat': GL_REPEAT,
        'clamp': GL_CLAMP_TO_EDGE$1,
        'mirror': GL_MIRRORED_REPEAT
      };

      var magFilters = {
        'nearest': GL_NEAREST$1,
        'linear': GL_LINEAR
      };

      var minFilters = extend({
        'mipmap': GL_LINEAR_MIPMAP_LINEAR$1,
        'nearest mipmap nearest': GL_NEAREST_MIPMAP_NEAREST$1,
        'linear mipmap nearest': GL_LINEAR_MIPMAP_NEAREST$1,
        'nearest mipmap linear': GL_NEAREST_MIPMAP_LINEAR$1,
        'linear mipmap linear': GL_LINEAR_MIPMAP_LINEAR$1
      }, magFilters);

      var colorSpace = {
        'none': 0,
        'browser': GL_BROWSER_DEFAULT_WEBGL
      };

      var textureTypes = {
        'uint8': GL_UNSIGNED_BYTE$5,
        'rgba4': GL_UNSIGNED_SHORT_4_4_4_4$1,
        'rgb565': GL_UNSIGNED_SHORT_5_6_5$1,
        'rgb5 a1': GL_UNSIGNED_SHORT_5_5_5_1$1
      };

      var textureFormats = {
        'alpha': GL_ALPHA,
        'luminance': GL_LUMINANCE,
        'luminance alpha': GL_LUMINANCE_ALPHA,
        'rgb': GL_RGB,
        'rgba': GL_RGBA$1,
        'rgba4': GL_RGBA4,
        'rgb5 a1': GL_RGB5_A1,
        'rgb565': GL_RGB565
      };

      var compressedTextureFormats = {};

      if (extensions.ext_srgb) {
        textureFormats.srgb = GL_SRGB_EXT;
        textureFormats.srgba = GL_SRGB_ALPHA_EXT;
      }

      if (extensions.oes_texture_float) {
        textureTypes.float32 = textureTypes.float = GL_FLOAT$4;
      }

      if (extensions.oes_texture_half_float) {
        textureTypes['float16'] = textureTypes['half float'] = GL_HALF_FLOAT_OES$1;
      }

      if (extensions.webgl_depth_texture) {
        extend(textureFormats, {
          'depth': GL_DEPTH_COMPONENT,
          'depth stencil': GL_DEPTH_STENCIL
        });

        extend(textureTypes, {
          'uint16': GL_UNSIGNED_SHORT$3,
          'uint32': GL_UNSIGNED_INT$3,
          'depth stencil': GL_UNSIGNED_INT_24_8_WEBGL$1
        });
      }

      if (extensions.webgl_compressed_texture_s3tc) {
        extend(compressedTextureFormats, {
          'rgb s3tc dxt1': GL_COMPRESSED_RGB_S3TC_DXT1_EXT,
          'rgba s3tc dxt1': GL_COMPRESSED_RGBA_S3TC_DXT1_EXT,
          'rgba s3tc dxt3': GL_COMPRESSED_RGBA_S3TC_DXT3_EXT,
          'rgba s3tc dxt5': GL_COMPRESSED_RGBA_S3TC_DXT5_EXT
        });
      }

      if (extensions.webgl_compressed_texture_atc) {
        extend(compressedTextureFormats, {
          'rgb atc': GL_COMPRESSED_RGB_ATC_WEBGL,
          'rgba atc explicit alpha': GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL,
          'rgba atc interpolated alpha': GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL
        });
      }

      if (extensions.webgl_compressed_texture_pvrtc) {
        extend(compressedTextureFormats, {
          'rgb pvrtc 4bppv1': GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG,
          'rgb pvrtc 2bppv1': GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG,
          'rgba pvrtc 4bppv1': GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG,
          'rgba pvrtc 2bppv1': GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG
        });
      }

      if (extensions.webgl_compressed_texture_etc1) {
        compressedTextureFormats['rgb etc1'] = GL_COMPRESSED_RGB_ETC1_WEBGL;
      }

      // Copy over all texture formats
      var supportedCompressedFormats = Array.prototype.slice.call(
        gl.getParameter(GL_COMPRESSED_TEXTURE_FORMATS));
      Object.keys(compressedTextureFormats).forEach(function (name) {
        var format = compressedTextureFormats[name];
        if (supportedCompressedFormats.indexOf(format) >= 0) {
          textureFormats[name] = format;
        }
      });

      var supportedFormats = Object.keys(textureFormats);
      limits.textureFormats = supportedFormats;

      // associate with every format string its
      // corresponding GL-value.
      var textureFormatsInvert = [];
      Object.keys(textureFormats).forEach(function (key) {
        var val = textureFormats[key];
        textureFormatsInvert[val] = key;
      });

      // associate with every type string its
      // corresponding GL-value.
      var textureTypesInvert = [];
      Object.keys(textureTypes).forEach(function (key) {
        var val = textureTypes[key];
        textureTypesInvert[val] = key;
      });

      var magFiltersInvert = [];
      Object.keys(magFilters).forEach(function (key) {
        var val = magFilters[key];
        magFiltersInvert[val] = key;
      });

      var minFiltersInvert = [];
      Object.keys(minFilters).forEach(function (key) {
        var val = minFilters[key];
        minFiltersInvert[val] = key;
      });

      var wrapModesInvert = [];
      Object.keys(wrapModes).forEach(function (key) {
        var val = wrapModes[key];
        wrapModesInvert[val] = key;
      });

      // colorFormats[] gives the format (channels) associated to an
      // internalformat
      var colorFormats = supportedFormats.reduce(function (color, key) {
        var glenum = textureFormats[key];
        if (glenum === GL_LUMINANCE ||
            glenum === GL_ALPHA ||
            glenum === GL_LUMINANCE ||
            glenum === GL_LUMINANCE_ALPHA ||
            glenum === GL_DEPTH_COMPONENT ||
            glenum === GL_DEPTH_STENCIL ||
            (extensions.ext_srgb &&
                    (glenum === GL_SRGB_EXT ||
                     glenum === GL_SRGB_ALPHA_EXT))) {
          color[glenum] = glenum;
        } else if (glenum === GL_RGB5_A1 || key.indexOf('rgba') >= 0) {
          color[glenum] = GL_RGBA$1;
        } else {
          color[glenum] = GL_RGB;
        }
        return color
      }, {});

      function TexFlags () {
        // format info
        this.internalformat = GL_RGBA$1;
        this.format = GL_RGBA$1;
        this.type = GL_UNSIGNED_BYTE$5;
        this.compressed = false;

        // pixel storage
        this.premultiplyAlpha = false;
        this.flipY = false;
        this.unpackAlignment = 1;
        this.colorSpace = GL_BROWSER_DEFAULT_WEBGL;

        // shape info
        this.width = 0;
        this.height = 0;
        this.channels = 0;
      }

      function copyFlags (result, other) {
        result.internalformat = other.internalformat;
        result.format = other.format;
        result.type = other.type;
        result.compressed = other.compressed;

        result.premultiplyAlpha = other.premultiplyAlpha;
        result.flipY = other.flipY;
        result.unpackAlignment = other.unpackAlignment;
        result.colorSpace = other.colorSpace;

        result.width = other.width;
        result.height = other.height;
        result.channels = other.channels;
      }

      function parseFlags (flags, options) {
        if (typeof options !== 'object' || !options) {
          return
        }

        if ('premultiplyAlpha' in options) {
          check$1.type(options.premultiplyAlpha, 'boolean',
            'invalid premultiplyAlpha');
          flags.premultiplyAlpha = options.premultiplyAlpha;
        }

        if ('flipY' in options) {
          check$1.type(options.flipY, 'boolean',
            'invalid texture flip');
          flags.flipY = options.flipY;
        }

        if ('alignment' in options) {
          check$1.oneOf(options.alignment, [1, 2, 4, 8],
            'invalid texture unpack alignment');
          flags.unpackAlignment = options.alignment;
        }

        if ('colorSpace' in options) {
          check$1.parameter(options.colorSpace, colorSpace,
            'invalid colorSpace');
          flags.colorSpace = colorSpace[options.colorSpace];
        }

        if ('type' in options) {
          var type = options.type;
          check$1(extensions.oes_texture_float ||
            !(type === 'float' || type === 'float32'),
          'you must enable the OES_texture_float extension in order to use floating point textures.');
          check$1(extensions.oes_texture_half_float ||
            !(type === 'half float' || type === 'float16'),
          'you must enable the OES_texture_half_float extension in order to use 16-bit floating point textures.');
          check$1(extensions.webgl_depth_texture ||
            !(type === 'uint16' || type === 'uint32' || type === 'depth stencil'),
          'you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures.');
          check$1.parameter(type, textureTypes,
            'invalid texture type');
          flags.type = textureTypes[type];
        }

        var w = flags.width;
        var h = flags.height;
        var c = flags.channels;
        var hasChannels = false;
        if ('shape' in options) {
          check$1(Array.isArray(options.shape) && options.shape.length >= 2,
            'shape must be an array');
          w = options.shape[0];
          h = options.shape[1];
          if (options.shape.length === 3) {
            c = options.shape[2];
            check$1(c > 0 && c <= 4, 'invalid number of channels');
            hasChannels = true;
          }
          check$1(w >= 0 && w <= limits.maxTextureSize, 'invalid width');
          check$1(h >= 0 && h <= limits.maxTextureSize, 'invalid height');
        } else {
          if ('radius' in options) {
            w = h = options.radius;
            check$1(w >= 0 && w <= limits.maxTextureSize, 'invalid radius');
          }
          if ('width' in options) {
            w = options.width;
            check$1(w >= 0 && w <= limits.maxTextureSize, 'invalid width');
          }
          if ('height' in options) {
            h = options.height;
            check$1(h >= 0 && h <= limits.maxTextureSize, 'invalid height');
          }
          if ('channels' in options) {
            c = options.channels;
            check$1(c > 0 && c <= 4, 'invalid number of channels');
            hasChannels = true;
          }
        }
        flags.width = w | 0;
        flags.height = h | 0;
        flags.channels = c | 0;

        var hasFormat = false;
        if ('format' in options) {
          var formatStr = options.format;
          check$1(extensions.webgl_depth_texture ||
            !(formatStr === 'depth' || formatStr === 'depth stencil'),
          'you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures.');
          check$1.parameter(formatStr, textureFormats,
            'invalid texture format');
          var internalformat = flags.internalformat = textureFormats[formatStr];
          flags.format = colorFormats[internalformat];
          if (formatStr in textureTypes) {
            if (!('type' in options)) {
              flags.type = textureTypes[formatStr];
            }
          }
          if (formatStr in compressedTextureFormats) {
            flags.compressed = true;
          }
          hasFormat = true;
        }

        // Reconcile channels and format
        if (!hasChannels && hasFormat) {
          flags.channels = FORMAT_CHANNELS[flags.format];
        } else if (hasChannels && !hasFormat) {
          if (flags.channels !== CHANNELS_FORMAT[flags.format]) {
            flags.format = flags.internalformat = CHANNELS_FORMAT[flags.channels];
          }
        } else if (hasFormat && hasChannels) {
          check$1(
            flags.channels === FORMAT_CHANNELS[flags.format],
            'number of channels inconsistent with specified format');
        }
      }

      function setFlags (flags) {
        gl.pixelStorei(GL_UNPACK_FLIP_Y_WEBGL, flags.flipY);
        gl.pixelStorei(GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL, flags.premultiplyAlpha);
        gl.pixelStorei(GL_UNPACK_COLORSPACE_CONVERSION_WEBGL, flags.colorSpace);
        gl.pixelStorei(GL_UNPACK_ALIGNMENT, flags.unpackAlignment);
      }

      // -------------------------------------------------------
      // Tex image data
      // -------------------------------------------------------
      function TexImage () {
        TexFlags.call(this);

        this.xOffset = 0;
        this.yOffset = 0;

        // data
        this.data = null;
        this.needsFree = false;

        // html element
        this.element = null;

        // copyTexImage info
        this.needsCopy = false;
      }

      function parseImage (image, options) {
        var data = null;
        if (isPixelData(options)) {
          data = options;
        } else if (options) {
          check$1.type(options, 'object', 'invalid pixel data type');
          parseFlags(image, options);
          if ('x' in options) {
            image.xOffset = options.x | 0;
          }
          if ('y' in options) {
            image.yOffset = options.y | 0;
          }
          if (isPixelData(options.data)) {
            data = options.data;
          }
        }

        check$1(
          !image.compressed ||
          data instanceof Uint8Array,
          'compressed texture data must be stored in a uint8array');

        if (options.copy) {
          check$1(!data, 'can not specify copy and data field for the same texture');
          var viewW = contextState.viewportWidth;
          var viewH = contextState.viewportHeight;
          image.width = image.width || (viewW - image.xOffset);
          image.height = image.height || (viewH - image.yOffset);
          image.needsCopy = true;
          check$1(image.xOffset >= 0 && image.xOffset < viewW &&
                image.yOffset >= 0 && image.yOffset < viewH &&
                image.width > 0 && image.width <= viewW &&
                image.height > 0 && image.height <= viewH,
          'copy texture read out of bounds');
        } else if (!data) {
          image.width = image.width || 1;
          image.height = image.height || 1;
          image.channels = image.channels || 4;
        } else if (isTypedArray(data)) {
          image.channels = image.channels || 4;
          image.data = data;
          if (!('type' in options) && image.type === GL_UNSIGNED_BYTE$5) {
            image.type = typedArrayCode$1(data);
          }
        } else if (isNumericArray(data)) {
          image.channels = image.channels || 4;
          convertData(image, data);
          image.alignment = 1;
          image.needsFree = true;
        } else if (isNDArrayLike(data)) {
          var array = data.data;
          if (!Array.isArray(array) && image.type === GL_UNSIGNED_BYTE$5) {
            image.type = typedArrayCode$1(array);
          }
          var shape = data.shape;
          var stride = data.stride;
          var shapeX, shapeY, shapeC, strideX, strideY, strideC;
          if (shape.length === 3) {
            shapeC = shape[2];
            strideC = stride[2];
          } else {
            check$1(shape.length === 2, 'invalid ndarray pixel data, must be 2 or 3D');
            shapeC = 1;
            strideC = 1;
          }
          shapeX = shape[0];
          shapeY = shape[1];
          strideX = stride[0];
          strideY = stride[1];
          image.alignment = 1;
          image.width = shapeX;
          image.height = shapeY;
          image.channels = shapeC;
          image.format = image.internalformat = CHANNELS_FORMAT[shapeC];
          image.needsFree = true;
          transposeData(image, array, strideX, strideY, strideC, data.offset);
        } else if (isCanvasElement(data) || isOffscreenCanvas(data) || isContext2D(data)) {
          if (isCanvasElement(data) || isOffscreenCanvas(data)) {
            image.element = data;
          } else {
            image.element = data.canvas;
          }
          image.width = image.element.width;
          image.height = image.element.height;
          image.channels = 4;
        } else if (isBitmap(data)) {
          image.element = data;
          image.width = data.width;
          image.height = data.height;
          image.channels = 4;
        } else if (isImageElement(data)) {
          image.element = data;
          image.width = data.naturalWidth;
          image.height = data.naturalHeight;
          image.channels = 4;
        } else if (isVideoElement(data)) {
          image.element = data;
          image.width = data.videoWidth;
          image.height = data.videoHeight;
          image.channels = 4;
        } else if (isRectArray(data)) {
          var w = image.width || data[0].length;
          var h = image.height || data.length;
          var c = image.channels;
          if (isArrayLike(data[0][0])) {
            c = c || data[0][0].length;
          } else {
            c = c || 1;
          }
          var arrayShape = flattenUtils.shape(data);
          var n = 1;
          for (var dd = 0; dd < arrayShape.length; ++dd) {
            n *= arrayShape[dd];
          }
          var allocData = preConvert(image, n);
          flattenUtils.flatten(data, arrayShape, '', allocData);
          postConvert(image, allocData);
          image.alignment = 1;
          image.width = w;
          image.height = h;
          image.channels = c;
          image.format = image.internalformat = CHANNELS_FORMAT[c];
          image.needsFree = true;
        }

        if (image.type === GL_FLOAT$4) {
          check$1(limits.extensions.indexOf('oes_texture_float') >= 0,
            'oes_texture_float extension not enabled');
        } else if (image.type === GL_HALF_FLOAT_OES$1) {
          check$1(limits.extensions.indexOf('oes_texture_half_float') >= 0,
            'oes_texture_half_float extension not enabled');
        }

        // do compressed texture  validation here.
      }

      function setImage (info, target, miplevel) {
        var element = info.element;
        var data = info.data;
        var internalformat = info.internalformat;
        var format = info.format;
        var type = info.type;
        var width = info.width;
        var height = info.height;

        setFlags(info);

        if (element) {
          gl.texImage2D(target, miplevel, format, format, type, element);
        } else if (info.compressed) {
          gl.compressedTexImage2D(target, miplevel, internalformat, width, height, 0, data);
        } else if (info.needsCopy) {
          reglPoll();
          gl.copyTexImage2D(
            target, miplevel, format, info.xOffset, info.yOffset, width, height, 0);
        } else {
          gl.texImage2D(target, miplevel, format, width, height, 0, format, type, data || null);
        }
      }

      function setSubImage (info, target, x, y, miplevel) {
        var element = info.element;
        var data = info.data;
        var internalformat = info.internalformat;
        var format = info.format;
        var type = info.type;
        var width = info.width;
        var height = info.height;

        setFlags(info);

        if (element) {
          gl.texSubImage2D(
            target, miplevel, x, y, format, type, element);
        } else if (info.compressed) {
          gl.compressedTexSubImage2D(
            target, miplevel, x, y, internalformat, width, height, data);
        } else if (info.needsCopy) {
          reglPoll();
          gl.copyTexSubImage2D(
            target, miplevel, x, y, info.xOffset, info.yOffset, width, height);
        } else {
          gl.texSubImage2D(
            target, miplevel, x, y, width, height, format, type, data);
        }
      }

      // texImage pool
      var imagePool = [];

      function allocImage () {
        return imagePool.pop() || new TexImage()
      }

      function freeImage (image) {
        if (image.needsFree) {
          pool.freeType(image.data);
        }
        TexImage.call(image);
        imagePool.push(image);
      }

      // -------------------------------------------------------
      // Mip map
      // -------------------------------------------------------
      function MipMap () {
        TexFlags.call(this);

        this.genMipmaps = false;
        this.mipmapHint = GL_DONT_CARE;
        this.mipmask = 0;
        this.images = Array(16);
      }

      function parseMipMapFromShape (mipmap, width, height) {
        var img = mipmap.images[0] = allocImage();
        mipmap.mipmask = 1;
        img.width = mipmap.width = width;
        img.height = mipmap.height = height;
        img.channels = mipmap.channels = 4;
      }

      function parseMipMapFromObject (mipmap, options) {
        var imgData = null;
        if (isPixelData(options)) {
          imgData = mipmap.images[0] = allocImage();
          copyFlags(imgData, mipmap);
          parseImage(imgData, options);
          mipmap.mipmask = 1;
        } else {
          parseFlags(mipmap, options);
          if (Array.isArray(options.mipmap)) {
            var mipData = options.mipmap;
            for (var i = 0; i < mipData.length; ++i) {
              imgData = mipmap.images[i] = allocImage();
              copyFlags(imgData, mipmap);
              imgData.width >>= i;
              imgData.height >>= i;
              parseImage(imgData, mipData[i]);
              mipmap.mipmask |= (1 << i);
            }
          } else {
            imgData = mipmap.images[0] = allocImage();
            copyFlags(imgData, mipmap);
            parseImage(imgData, options);
            mipmap.mipmask = 1;
          }
        }
        copyFlags(mipmap, mipmap.images[0]);

        // For textures of the compressed format WEBGL_compressed_texture_s3tc
        // we must have that
        //
        // "When level equals zero width and height must be a multiple of 4.
        // When level is greater than 0 width and height must be 0, 1, 2 or a multiple of 4. "
        //
        // but we do not yet support having multiple mipmap levels for compressed textures,
        // so we only test for level zero.

        if (
          mipmap.compressed &&
          (
            mipmap.internalformat === GL_COMPRESSED_RGB_S3TC_DXT1_EXT ||
            mipmap.internalformat === GL_COMPRESSED_RGBA_S3TC_DXT1_EXT ||
            mipmap.internalformat === GL_COMPRESSED_RGBA_S3TC_DXT3_EXT ||
            mipmap.internalformat === GL_COMPRESSED_RGBA_S3TC_DXT5_EXT
          )
        ) {
          check$1(mipmap.width % 4 === 0 && mipmap.height % 4 === 0,
            'for compressed texture formats, mipmap level 0 must have width and height that are a multiple of 4');
        }
      }

      function setMipMap (mipmap, target) {
        var images = mipmap.images;
        for (var i = 0; i < images.length; ++i) {
          if (!images[i]) {
            return
          }
          setImage(images[i], target, i);
        }
      }

      var mipPool = [];

      function allocMipMap () {
        var result = mipPool.pop() || new MipMap();
        TexFlags.call(result);
        result.mipmask = 0;
        for (var i = 0; i < 16; ++i) {
          result.images[i] = null;
        }
        return result
      }

      function freeMipMap (mipmap) {
        var images = mipmap.images;
        for (var i = 0; i < images.length; ++i) {
          if (images[i]) {
            freeImage(images[i]);
          }
          images[i] = null;
        }
        mipPool.push(mipmap);
      }

      // -------------------------------------------------------
      // Tex info
      // -------------------------------------------------------
      function TexInfo () {
        this.minFilter = GL_NEAREST$1;
        this.magFilter = GL_NEAREST$1;

        this.wrapS = GL_CLAMP_TO_EDGE$1;
        this.wrapT = GL_CLAMP_TO_EDGE$1;

        this.anisotropic = 1;

        this.genMipmaps = false;
        this.mipmapHint = GL_DONT_CARE;
      }

      function parseTexInfo (info, options) {
        if ('min' in options) {
          var minFilter = options.min;
          check$1.parameter(minFilter, minFilters);
          info.minFilter = minFilters[minFilter];
          if (MIPMAP_FILTERS.indexOf(info.minFilter) >= 0 && !('faces' in options)) {
            info.genMipmaps = true;
          }
        }

        if ('mag' in options) {
          var magFilter = options.mag;
          check$1.parameter(magFilter, magFilters);
          info.magFilter = magFilters[magFilter];
        }

        var wrapS = info.wrapS;
        var wrapT = info.wrapT;
        if ('wrap' in options) {
          var wrap = options.wrap;
          if (typeof wrap === 'string') {
            check$1.parameter(wrap, wrapModes);
            wrapS = wrapT = wrapModes[wrap];
          } else if (Array.isArray(wrap)) {
            check$1.parameter(wrap[0], wrapModes);
            check$1.parameter(wrap[1], wrapModes);
            wrapS = wrapModes[wrap[0]];
            wrapT = wrapModes[wrap[1]];
          }
        } else {
          if ('wrapS' in options) {
            var optWrapS = options.wrapS;
            check$1.parameter(optWrapS, wrapModes);
            wrapS = wrapModes[optWrapS];
          }
          if ('wrapT' in options) {
            var optWrapT = options.wrapT;
            check$1.parameter(optWrapT, wrapModes);
            wrapT = wrapModes[optWrapT];
          }
        }
        info.wrapS = wrapS;
        info.wrapT = wrapT;

        if ('anisotropic' in options) {
          var anisotropic = options.anisotropic;
          check$1(typeof anisotropic === 'number' &&
             anisotropic >= 1 && anisotropic <= limits.maxAnisotropic,
          'aniso samples must be between 1 and ');
          info.anisotropic = options.anisotropic;
        }

        if ('mipmap' in options) {
          var hasMipMap = false;
          switch (typeof options.mipmap) {
            case 'string':
              check$1.parameter(options.mipmap, mipmapHint,
                'invalid mipmap hint');
              info.mipmapHint = mipmapHint[options.mipmap];
              info.genMipmaps = true;
              hasMipMap = true;
              break

            case 'boolean':
              hasMipMap = info.genMipmaps = options.mipmap;
              break

            case 'object':
              check$1(Array.isArray(options.mipmap), 'invalid mipmap type');
              info.genMipmaps = false;
              hasMipMap = true;
              break

            default:
              check$1.raise('invalid mipmap type');
          }
          if (hasMipMap && !('min' in options)) {
            info.minFilter = GL_NEAREST_MIPMAP_NEAREST$1;
          }
        }
      }

      function setTexInfo (info, target) {
        gl.texParameteri(target, GL_TEXTURE_MIN_FILTER, info.minFilter);
        gl.texParameteri(target, GL_TEXTURE_MAG_FILTER, info.magFilter);
        gl.texParameteri(target, GL_TEXTURE_WRAP_S, info.wrapS);
        gl.texParameteri(target, GL_TEXTURE_WRAP_T, info.wrapT);
        if (extensions.ext_texture_filter_anisotropic) {
          gl.texParameteri(target, GL_TEXTURE_MAX_ANISOTROPY_EXT, info.anisotropic);
        }
        if (info.genMipmaps) {
          gl.hint(GL_GENERATE_MIPMAP_HINT, info.mipmapHint);
          gl.generateMipmap(target);
        }
      }

      // -------------------------------------------------------
      // Full texture object
      // -------------------------------------------------------
      var textureCount = 0;
      var textureSet = {};
      var numTexUnits = limits.maxTextureUnits;
      var textureUnits = Array(numTexUnits).map(function () {
        return null
      });

      function REGLTexture (target) {
        TexFlags.call(this);
        this.mipmask = 0;
        this.internalformat = GL_RGBA$1;

        this.id = textureCount++;

        this.refCount = 1;

        this.target = target;
        this.texture = gl.createTexture();

        this.unit = -1;
        this.bindCount = 0;

        this.texInfo = new TexInfo();

        if (config.profile) {
          this.stats = { size: 0 };
        }
      }

      function tempBind (texture) {
        gl.activeTexture(GL_TEXTURE0$1);
        gl.bindTexture(texture.target, texture.texture);
      }

      function tempRestore () {
        var prev = textureUnits[0];
        if (prev) {
          gl.bindTexture(prev.target, prev.texture);
        } else {
          gl.bindTexture(GL_TEXTURE_2D$1, null);
        }
      }

      function destroy (texture) {
        var handle = texture.texture;
        check$1(handle, 'must not double destroy texture');
        var unit = texture.unit;
        var target = texture.target;
        if (unit >= 0) {
          gl.activeTexture(GL_TEXTURE0$1 + unit);
          gl.bindTexture(target, null);
          textureUnits[unit] = null;
        }
        gl.deleteTexture(handle);
        texture.texture = null;
        texture.params = null;
        texture.pixels = null;
        texture.refCount = 0;
        delete textureSet[texture.id];
        stats.textureCount--;
      }

      extend(REGLTexture.prototype, {
        bind: function () {
          var texture = this;
          texture.bindCount += 1;
          var unit = texture.unit;
          if (unit < 0) {
            for (var i = 0; i < numTexUnits; ++i) {
              var other = textureUnits[i];
              if (other) {
                if (other.bindCount > 0) {
                  continue
                }
                other.unit = -1;
              }
              textureUnits[i] = texture;
              unit = i;
              break
            }
            if (unit >= numTexUnits) {
              check$1.raise('insufficient number of texture units');
            }
            if (config.profile && stats.maxTextureUnits < (unit + 1)) {
              stats.maxTextureUnits = unit + 1; // +1, since the units are zero-based
            }
            texture.unit = unit;
            gl.activeTexture(GL_TEXTURE0$1 + unit);
            gl.bindTexture(texture.target, texture.texture);
          }
          return unit
        },

        unbind: function () {
          this.bindCount -= 1;
        },

        decRef: function () {
          if (--this.refCount <= 0) {
            destroy(this);
          }
        }
      });

      function createTexture2D (a, b) {
        var texture = new REGLTexture(GL_TEXTURE_2D$1);
        textureSet[texture.id] = texture;
        stats.textureCount++;

        function reglTexture2D (a, b) {
          var texInfo = texture.texInfo;
          TexInfo.call(texInfo);
          var mipData = allocMipMap();

          if (typeof a === 'number') {
            if (typeof b === 'number') {
              parseMipMapFromShape(mipData, a | 0, b | 0);
            } else {
              parseMipMapFromShape(mipData, a | 0, a | 0);
            }
          } else if (a) {
            check$1.type(a, 'object', 'invalid arguments to regl.texture');
            parseTexInfo(texInfo, a);
            parseMipMapFromObject(mipData, a);
          } else {
            // empty textures get assigned a default shape of 1x1
            parseMipMapFromShape(mipData, 1, 1);
          }

          if (texInfo.genMipmaps) {
            mipData.mipmask = (mipData.width << 1) - 1;
          }
          texture.mipmask = mipData.mipmask;

          copyFlags(texture, mipData);

          check$1.texture2D(texInfo, mipData, limits);
          texture.internalformat = mipData.internalformat;

          reglTexture2D.width = mipData.width;
          reglTexture2D.height = mipData.height;

          tempBind(texture);
          setMipMap(mipData, GL_TEXTURE_2D$1);
          setTexInfo(texInfo, GL_TEXTURE_2D$1);
          tempRestore();

          freeMipMap(mipData);

          if (config.profile) {
            texture.stats.size = getTextureSize(
              texture.internalformat,
              texture.type,
              mipData.width,
              mipData.height,
              texInfo.genMipmaps,
              false);
          }
          reglTexture2D.format = textureFormatsInvert[texture.internalformat];
          reglTexture2D.type = textureTypesInvert[texture.type];

          reglTexture2D.mag = magFiltersInvert[texInfo.magFilter];
          reglTexture2D.min = minFiltersInvert[texInfo.minFilter];

          reglTexture2D.wrapS = wrapModesInvert[texInfo.wrapS];
          reglTexture2D.wrapT = wrapModesInvert[texInfo.wrapT];

          return reglTexture2D
        }

        function subimage (image, x_, y_, level_) {
          check$1(!!image, 'must specify image data');

          var x = x_ | 0;
          var y = y_ | 0;
          var level = level_ | 0;

          var imageData = allocImage();
          copyFlags(imageData, texture);
          imageData.width = 0;
          imageData.height = 0;
          parseImage(imageData, image);
          imageData.width = imageData.width || ((texture.width >> level) - x);
          imageData.height = imageData.height || ((texture.height >> level) - y);

          check$1(
            texture.type === imageData.type &&
            texture.format === imageData.format &&
            texture.internalformat === imageData.internalformat,
            'incompatible format for texture.subimage');
          check$1(
            x >= 0 && y >= 0 &&
            x + imageData.width <= texture.width &&
            y + imageData.height <= texture.height,
            'texture.subimage write out of bounds');
          check$1(
            texture.mipmask & (1 << level),
            'missing mipmap data');
          check$1(
            imageData.data || imageData.element || imageData.needsCopy,
            'missing image data');

          tempBind(texture);
          setSubImage(imageData, GL_TEXTURE_2D$1, x, y, level);
          tempRestore();

          freeImage(imageData);

          return reglTexture2D
        }

        function resize (w_, h_) {
          var w = w_ | 0;
          var h = (h_ | 0) || w;
          if (w === texture.width && h === texture.height) {
            return reglTexture2D
          }

          reglTexture2D.width = texture.width = w;
          reglTexture2D.height = texture.height = h;

          tempBind(texture);

          for (var i = 0; texture.mipmask >> i; ++i) {
            var _w = w >> i;
            var _h = h >> i;
            if (!_w || !_h) break
            gl.texImage2D(
              GL_TEXTURE_2D$1,
              i,
              texture.format,
              _w,
              _h,
              0,
              texture.format,
              texture.type,
              null);
          }
          tempRestore();

          // also, recompute the texture size.
          if (config.profile) {
            texture.stats.size = getTextureSize(
              texture.internalformat,
              texture.type,
              w,
              h,
              false,
              false);
          }

          return reglTexture2D
        }

        reglTexture2D(a, b);

        reglTexture2D.subimage = subimage;
        reglTexture2D.resize = resize;
        reglTexture2D._reglType = 'texture2d';
        reglTexture2D._texture = texture;
        if (config.profile) {
          reglTexture2D.stats = texture.stats;
        }
        reglTexture2D.destroy = function () {
          texture.decRef();
        };

        return reglTexture2D
      }

      function createTextureCube (a0, a1, a2, a3, a4, a5) {
        var texture = new REGLTexture(GL_TEXTURE_CUBE_MAP$1);
        textureSet[texture.id] = texture;
        stats.cubeCount++;

        var faces = new Array(6);

        function reglTextureCube (a0, a1, a2, a3, a4, a5) {
          var i;
          var texInfo = texture.texInfo;
          TexInfo.call(texInfo);
          for (i = 0; i < 6; ++i) {
            faces[i] = allocMipMap();
          }

          if (typeof a0 === 'number' || !a0) {
            var s = (a0 | 0) || 1;
            for (i = 0; i < 6; ++i) {
              parseMipMapFromShape(faces[i], s, s);
            }
          } else if (typeof a0 === 'object') {
            if (a1) {
              parseMipMapFromObject(faces[0], a0);
              parseMipMapFromObject(faces[1], a1);
              parseMipMapFromObject(faces[2], a2);
              parseMipMapFromObject(faces[3], a3);
              parseMipMapFromObject(faces[4], a4);
              parseMipMapFromObject(faces[5], a5);
            } else {
              parseTexInfo(texInfo, a0);
              parseFlags(texture, a0);
              if ('faces' in a0) {
                var faceInput = a0.faces;
                check$1(Array.isArray(faceInput) && faceInput.length === 6,
                  'cube faces must be a length 6 array');
                for (i = 0; i < 6; ++i) {
                  check$1(typeof faceInput[i] === 'object' && !!faceInput[i],
                    'invalid input for cube map face');
                  copyFlags(faces[i], texture);
                  parseMipMapFromObject(faces[i], faceInput[i]);
                }
              } else {
                for (i = 0; i < 6; ++i) {
                  parseMipMapFromObject(faces[i], a0);
                }
              }
            }
          } else {
            check$1.raise('invalid arguments to cube map');
          }

          copyFlags(texture, faces[0]);
          check$1.optional(function () {
            if (!limits.npotTextureCube) {
              check$1(isPow2$1(texture.width) && isPow2$1(texture.height), 'your browser does not support non power or two texture dimensions');
            }
          });

          if (texInfo.genMipmaps) {
            texture.mipmask = (faces[0].width << 1) - 1;
          } else {
            texture.mipmask = faces[0].mipmask;
          }

          check$1.textureCube(texture, texInfo, faces, limits);
          texture.internalformat = faces[0].internalformat;

          reglTextureCube.width = faces[0].width;
          reglTextureCube.height = faces[0].height;

          tempBind(texture);
          for (i = 0; i < 6; ++i) {
            setMipMap(faces[i], GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + i);
          }
          setTexInfo(texInfo, GL_TEXTURE_CUBE_MAP$1);
          tempRestore();

          if (config.profile) {
            texture.stats.size = getTextureSize(
              texture.internalformat,
              texture.type,
              reglTextureCube.width,
              reglTextureCube.height,
              texInfo.genMipmaps,
              true);
          }

          reglTextureCube.format = textureFormatsInvert[texture.internalformat];
          reglTextureCube.type = textureTypesInvert[texture.type];

          reglTextureCube.mag = magFiltersInvert[texInfo.magFilter];
          reglTextureCube.min = minFiltersInvert[texInfo.minFilter];

          reglTextureCube.wrapS = wrapModesInvert[texInfo.wrapS];
          reglTextureCube.wrapT = wrapModesInvert[texInfo.wrapT];

          for (i = 0; i < 6; ++i) {
            freeMipMap(faces[i]);
          }

          return reglTextureCube
        }

        function subimage (face, image, x_, y_, level_) {
          check$1(!!image, 'must specify image data');
          check$1(typeof face === 'number' && face === (face | 0) &&
            face >= 0 && face < 6, 'invalid face');

          var x = x_ | 0;
          var y = y_ | 0;
          var level = level_ | 0;

          var imageData = allocImage();
          copyFlags(imageData, texture);
          imageData.width = 0;
          imageData.height = 0;
          parseImage(imageData, image);
          imageData.width = imageData.width || ((texture.width >> level) - x);
          imageData.height = imageData.height || ((texture.height >> level) - y);

          check$1(
            texture.type === imageData.type &&
            texture.format === imageData.format &&
            texture.internalformat === imageData.internalformat,
            'incompatible format for texture.subimage');
          check$1(
            x >= 0 && y >= 0 &&
            x + imageData.width <= texture.width &&
            y + imageData.height <= texture.height,
            'texture.subimage write out of bounds');
          check$1(
            texture.mipmask & (1 << level),
            'missing mipmap data');
          check$1(
            imageData.data || imageData.element || imageData.needsCopy,
            'missing image data');

          tempBind(texture);
          setSubImage(imageData, GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + face, x, y, level);
          tempRestore();

          freeImage(imageData);

          return reglTextureCube
        }

        function resize (radius_) {
          var radius = radius_ | 0;
          if (radius === texture.width) {
            return
          }

          reglTextureCube.width = texture.width = radius;
          reglTextureCube.height = texture.height = radius;

          tempBind(texture);
          for (var i = 0; i < 6; ++i) {
            for (var j = 0; texture.mipmask >> j; ++j) {
              gl.texImage2D(
                GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + i,
                j,
                texture.format,
                radius >> j,
                radius >> j,
                0,
                texture.format,
                texture.type,
                null);
            }
          }
          tempRestore();

          if (config.profile) {
            texture.stats.size = getTextureSize(
              texture.internalformat,
              texture.type,
              reglTextureCube.width,
              reglTextureCube.height,
              false,
              true);
          }

          return reglTextureCube
        }

        reglTextureCube(a0, a1, a2, a3, a4, a5);

        reglTextureCube.subimage = subimage;
        reglTextureCube.resize = resize;
        reglTextureCube._reglType = 'textureCube';
        reglTextureCube._texture = texture;
        if (config.profile) {
          reglTextureCube.stats = texture.stats;
        }
        reglTextureCube.destroy = function () {
          texture.decRef();
        };

        return reglTextureCube
      }

      // Called when regl is destroyed
      function destroyTextures () {
        for (var i = 0; i < numTexUnits; ++i) {
          gl.activeTexture(GL_TEXTURE0$1 + i);
          gl.bindTexture(GL_TEXTURE_2D$1, null);
          textureUnits[i] = null;
        }
        values(textureSet).forEach(destroy);

        stats.cubeCount = 0;
        stats.textureCount = 0;
      }

      if (config.profile) {
        stats.getTotalTextureSize = function () {
          var total = 0;
          Object.keys(textureSet).forEach(function (key) {
            total += textureSet[key].stats.size;
          });
          return total
        };
      }

      function restoreTextures () {
        for (var i = 0; i < numTexUnits; ++i) {
          var tex = textureUnits[i];
          if (tex) {
            tex.bindCount = 0;
            tex.unit = -1;
            textureUnits[i] = null;
          }
        }

        values(textureSet).forEach(function (texture) {
          texture.texture = gl.createTexture();
          gl.bindTexture(texture.target, texture.texture);
          for (var i = 0; i < 32; ++i) {
            if ((texture.mipmask & (1 << i)) === 0) {
              continue
            }
            if (texture.target === GL_TEXTURE_2D$1) {
              gl.texImage2D(GL_TEXTURE_2D$1,
                i,
                texture.internalformat,
                texture.width >> i,
                texture.height >> i,
                0,
                texture.internalformat,
                texture.type,
                null);
            } else {
              for (var j = 0; j < 6; ++j) {
                gl.texImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + j,
                  i,
                  texture.internalformat,
                  texture.width >> i,
                  texture.height >> i,
                  0,
                  texture.internalformat,
                  texture.type,
                  null);
              }
            }
          }
          setTexInfo(texture.texInfo, texture.target);
        });
      }

      function refreshTextures () {
        for (var i = 0; i < numTexUnits; ++i) {
          var tex = textureUnits[i];
          if (tex) {
            tex.bindCount = 0;
            tex.unit = -1;
            textureUnits[i] = null;
          }
          gl.activeTexture(GL_TEXTURE0$1 + i);
          gl.bindTexture(GL_TEXTURE_2D$1, null);
          gl.bindTexture(GL_TEXTURE_CUBE_MAP$1, null);
        }
      }

      return {
        create2D: createTexture2D,
        createCube: createTextureCube,
        clear: destroyTextures,
        getTexture: function (wrapper) {
          return null
        },
        restore: restoreTextures,
        refresh: refreshTextures
      }
    }

    var GL_RENDERBUFFER = 0x8D41;

    var GL_RGBA4$1 = 0x8056;
    var GL_RGB5_A1$1 = 0x8057;
    var GL_RGB565$1 = 0x8D62;
    var GL_DEPTH_COMPONENT16 = 0x81A5;
    var GL_STENCIL_INDEX8 = 0x8D48;
    var GL_DEPTH_STENCIL$1 = 0x84F9;

    var GL_SRGB8_ALPHA8_EXT = 0x8C43;

    var GL_RGBA32F_EXT = 0x8814;

    var GL_RGBA16F_EXT = 0x881A;
    var GL_RGB16F_EXT = 0x881B;

    var FORMAT_SIZES = [];

    FORMAT_SIZES[GL_RGBA4$1] = 2;
    FORMAT_SIZES[GL_RGB5_A1$1] = 2;
    FORMAT_SIZES[GL_RGB565$1] = 2;

    FORMAT_SIZES[GL_DEPTH_COMPONENT16] = 2;
    FORMAT_SIZES[GL_STENCIL_INDEX8] = 1;
    FORMAT_SIZES[GL_DEPTH_STENCIL$1] = 4;

    FORMAT_SIZES[GL_SRGB8_ALPHA8_EXT] = 4;
    FORMAT_SIZES[GL_RGBA32F_EXT] = 16;
    FORMAT_SIZES[GL_RGBA16F_EXT] = 8;
    FORMAT_SIZES[GL_RGB16F_EXT] = 6;

    function getRenderbufferSize (format, width, height) {
      return FORMAT_SIZES[format] * width * height
    }

    var wrapRenderbuffers = function (gl, extensions, limits, stats, config) {
      var formatTypes = {
        'rgba4': GL_RGBA4$1,
        'rgb565': GL_RGB565$1,
        'rgb5 a1': GL_RGB5_A1$1,
        'depth': GL_DEPTH_COMPONENT16,
        'stencil': GL_STENCIL_INDEX8,
        'depth stencil': GL_DEPTH_STENCIL$1
      };

      if (extensions.ext_srgb) {
        formatTypes['srgba'] = GL_SRGB8_ALPHA8_EXT;
      }

      if (extensions.ext_color_buffer_half_float) {
        formatTypes['rgba16f'] = GL_RGBA16F_EXT;
        formatTypes['rgb16f'] = GL_RGB16F_EXT;
      }

      if (extensions.webgl_color_buffer_float) {
        formatTypes['rgba32f'] = GL_RGBA32F_EXT;
      }

      var formatTypesInvert = [];
      Object.keys(formatTypes).forEach(function (key) {
        var val = formatTypes[key];
        formatTypesInvert[val] = key;
      });

      var renderbufferCount = 0;
      var renderbufferSet = {};

      function REGLRenderbuffer (renderbuffer) {
        this.id = renderbufferCount++;
        this.refCount = 1;

        this.renderbuffer = renderbuffer;

        this.format = GL_RGBA4$1;
        this.width = 0;
        this.height = 0;

        if (config.profile) {
          this.stats = { size: 0 };
        }
      }

      REGLRenderbuffer.prototype.decRef = function () {
        if (--this.refCount <= 0) {
          destroy(this);
        }
      };

      function destroy (rb) {
        var handle = rb.renderbuffer;
        check$1(handle, 'must not double destroy renderbuffer');
        gl.bindRenderbuffer(GL_RENDERBUFFER, null);
        gl.deleteRenderbuffer(handle);
        rb.renderbuffer = null;
        rb.refCount = 0;
        delete renderbufferSet[rb.id];
        stats.renderbufferCount--;
      }

      function createRenderbuffer (a, b) {
        var renderbuffer = new REGLRenderbuffer(gl.createRenderbuffer());
        renderbufferSet[renderbuffer.id] = renderbuffer;
        stats.renderbufferCount++;

        function reglRenderbuffer (a, b) {
          var w = 0;
          var h = 0;
          var format = GL_RGBA4$1;

          if (typeof a === 'object' && a) {
            var options = a;
            if ('shape' in options) {
              var shape = options.shape;
              check$1(Array.isArray(shape) && shape.length >= 2,
                'invalid renderbuffer shape');
              w = shape[0] | 0;
              h = shape[1] | 0;
            } else {
              if ('radius' in options) {
                w = h = options.radius | 0;
              }
              if ('width' in options) {
                w = options.width | 0;
              }
              if ('height' in options) {
                h = options.height | 0;
              }
            }
            if ('format' in options) {
              check$1.parameter(options.format, formatTypes,
                'invalid renderbuffer format');
              format = formatTypes[options.format];
            }
          } else if (typeof a === 'number') {
            w = a | 0;
            if (typeof b === 'number') {
              h = b | 0;
            } else {
              h = w;
            }
          } else if (!a) {
            w = h = 1;
          } else {
            check$1.raise('invalid arguments to renderbuffer constructor');
          }

          // check shape
          check$1(
            w > 0 && h > 0 &&
            w <= limits.maxRenderbufferSize && h <= limits.maxRenderbufferSize,
            'invalid renderbuffer size');

          if (w === renderbuffer.width &&
              h === renderbuffer.height &&
              format === renderbuffer.format) {
            return
          }

          reglRenderbuffer.width = renderbuffer.width = w;
          reglRenderbuffer.height = renderbuffer.height = h;
          renderbuffer.format = format;

          gl.bindRenderbuffer(GL_RENDERBUFFER, renderbuffer.renderbuffer);
          gl.renderbufferStorage(GL_RENDERBUFFER, format, w, h);

          check$1(
            gl.getError() === 0,
            'invalid render buffer format');

          if (config.profile) {
            renderbuffer.stats.size = getRenderbufferSize(renderbuffer.format, renderbuffer.width, renderbuffer.height);
          }
          reglRenderbuffer.format = formatTypesInvert[renderbuffer.format];

          return reglRenderbuffer
        }

        function resize (w_, h_) {
          var w = w_ | 0;
          var h = (h_ | 0) || w;

          if (w === renderbuffer.width && h === renderbuffer.height) {
            return reglRenderbuffer
          }

          // check shape
          check$1(
            w > 0 && h > 0 &&
            w <= limits.maxRenderbufferSize && h <= limits.maxRenderbufferSize,
            'invalid renderbuffer size');

          reglRenderbuffer.width = renderbuffer.width = w;
          reglRenderbuffer.height = renderbuffer.height = h;

          gl.bindRenderbuffer(GL_RENDERBUFFER, renderbuffer.renderbuffer);
          gl.renderbufferStorage(GL_RENDERBUFFER, renderbuffer.format, w, h);

          check$1(
            gl.getError() === 0,
            'invalid render buffer format');

          // also, recompute size.
          if (config.profile) {
            renderbuffer.stats.size = getRenderbufferSize(
              renderbuffer.format, renderbuffer.width, renderbuffer.height);
          }

          return reglRenderbuffer
        }

        reglRenderbuffer(a, b);

        reglRenderbuffer.resize = resize;
        reglRenderbuffer._reglType = 'renderbuffer';
        reglRenderbuffer._renderbuffer = renderbuffer;
        if (config.profile) {
          reglRenderbuffer.stats = renderbuffer.stats;
        }
        reglRenderbuffer.destroy = function () {
          renderbuffer.decRef();
        };

        return reglRenderbuffer
      }

      if (config.profile) {
        stats.getTotalRenderbufferSize = function () {
          var total = 0;
          Object.keys(renderbufferSet).forEach(function (key) {
            total += renderbufferSet[key].stats.size;
          });
          return total
        };
      }

      function restoreRenderbuffers () {
        values(renderbufferSet).forEach(function (rb) {
          rb.renderbuffer = gl.createRenderbuffer();
          gl.bindRenderbuffer(GL_RENDERBUFFER, rb.renderbuffer);
          gl.renderbufferStorage(GL_RENDERBUFFER, rb.format, rb.width, rb.height);
        });
        gl.bindRenderbuffer(GL_RENDERBUFFER, null);
      }

      return {
        create: createRenderbuffer,
        clear: function () {
          values(renderbufferSet).forEach(destroy);
        },
        restore: restoreRenderbuffers
      }
    };

    // We store these constants so that the minifier can inline them
    var GL_FRAMEBUFFER$1 = 0x8D40;
    var GL_RENDERBUFFER$1 = 0x8D41;

    var GL_TEXTURE_2D$2 = 0x0DE1;
    var GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 = 0x8515;

    var GL_COLOR_ATTACHMENT0$1 = 0x8CE0;
    var GL_DEPTH_ATTACHMENT = 0x8D00;
    var GL_STENCIL_ATTACHMENT = 0x8D20;
    var GL_DEPTH_STENCIL_ATTACHMENT = 0x821A;

    var GL_FRAMEBUFFER_COMPLETE$1 = 0x8CD5;
    var GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 0x8CD6;
    var GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 0x8CD7;
    var GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 0x8CD9;
    var GL_FRAMEBUFFER_UNSUPPORTED = 0x8CDD;

    var GL_HALF_FLOAT_OES$2 = 0x8D61;
    var GL_UNSIGNED_BYTE$6 = 0x1401;
    var GL_FLOAT$5 = 0x1406;

    var GL_RGB$1 = 0x1907;
    var GL_RGBA$2 = 0x1908;

    var GL_DEPTH_COMPONENT$1 = 0x1902;

    var colorTextureFormatEnums = [
      GL_RGB$1,
      GL_RGBA$2
    ];

    // for every texture format, store
    // the number of channels
    var textureFormatChannels = [];
    textureFormatChannels[GL_RGBA$2] = 4;
    textureFormatChannels[GL_RGB$1] = 3;

    // for every texture type, store
    // the size in bytes.
    var textureTypeSizes = [];
    textureTypeSizes[GL_UNSIGNED_BYTE$6] = 1;
    textureTypeSizes[GL_FLOAT$5] = 4;
    textureTypeSizes[GL_HALF_FLOAT_OES$2] = 2;

    var GL_RGBA4$2 = 0x8056;
    var GL_RGB5_A1$2 = 0x8057;
    var GL_RGB565$2 = 0x8D62;
    var GL_DEPTH_COMPONENT16$1 = 0x81A5;
    var GL_STENCIL_INDEX8$1 = 0x8D48;
    var GL_DEPTH_STENCIL$2 = 0x84F9;

    var GL_SRGB8_ALPHA8_EXT$1 = 0x8C43;

    var GL_RGBA32F_EXT$1 = 0x8814;

    var GL_RGBA16F_EXT$1 = 0x881A;
    var GL_RGB16F_EXT$1 = 0x881B;

    var colorRenderbufferFormatEnums = [
      GL_RGBA4$2,
      GL_RGB5_A1$2,
      GL_RGB565$2,
      GL_SRGB8_ALPHA8_EXT$1,
      GL_RGBA16F_EXT$1,
      GL_RGB16F_EXT$1,
      GL_RGBA32F_EXT$1
    ];

    var statusCode = {};
    statusCode[GL_FRAMEBUFFER_COMPLETE$1] = 'complete';
    statusCode[GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT] = 'incomplete attachment';
    statusCode[GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS] = 'incomplete dimensions';
    statusCode[GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT] = 'incomplete, missing attachment';
    statusCode[GL_FRAMEBUFFER_UNSUPPORTED] = 'unsupported';

    function wrapFBOState (
      gl,
      extensions,
      limits,
      textureState,
      renderbufferState,
      stats) {
      var framebufferState = {
        cur: null,
        next: null,
        dirty: false,
        setFBO: null
      };

      var colorTextureFormats = ['rgba'];
      var colorRenderbufferFormats = ['rgba4', 'rgb565', 'rgb5 a1'];

      if (extensions.ext_srgb) {
        colorRenderbufferFormats.push('srgba');
      }

      if (extensions.ext_color_buffer_half_float) {
        colorRenderbufferFormats.push('rgba16f', 'rgb16f');
      }

      if (extensions.webgl_color_buffer_float) {
        colorRenderbufferFormats.push('rgba32f');
      }

      var colorTypes = ['uint8'];
      if (extensions.oes_texture_half_float) {
        colorTypes.push('half float', 'float16');
      }
      if (extensions.oes_texture_float) {
        colorTypes.push('float', 'float32');
      }

      function FramebufferAttachment (target, texture, renderbuffer) {
        this.target = target;
        this.texture = texture;
        this.renderbuffer = renderbuffer;

        var w = 0;
        var h = 0;
        if (texture) {
          w = texture.width;
          h = texture.height;
        } else if (renderbuffer) {
          w = renderbuffer.width;
          h = renderbuffer.height;
        }
        this.width = w;
        this.height = h;
      }

      function decRef (attachment) {
        if (attachment) {
          if (attachment.texture) {
            attachment.texture._texture.decRef();
          }
          if (attachment.renderbuffer) {
            attachment.renderbuffer._renderbuffer.decRef();
          }
        }
      }

      function incRefAndCheckShape (attachment, width, height) {
        if (!attachment) {
          return
        }
        if (attachment.texture) {
          var texture = attachment.texture._texture;
          var tw = Math.max(1, texture.width);
          var th = Math.max(1, texture.height);
          check$1(tw === width && th === height,
            'inconsistent width/height for supplied texture');
          texture.refCount += 1;
        } else {
          var renderbuffer = attachment.renderbuffer._renderbuffer;
          check$1(
            renderbuffer.width === width && renderbuffer.height === height,
            'inconsistent width/height for renderbuffer');
          renderbuffer.refCount += 1;
        }
      }

      function attach (location, attachment) {
        if (attachment) {
          if (attachment.texture) {
            gl.framebufferTexture2D(
              GL_FRAMEBUFFER$1,
              location,
              attachment.target,
              attachment.texture._texture.texture,
              0);
          } else {
            gl.framebufferRenderbuffer(
              GL_FRAMEBUFFER$1,
              location,
              GL_RENDERBUFFER$1,
              attachment.renderbuffer._renderbuffer.renderbuffer);
          }
        }
      }

      function parseAttachment (attachment) {
        var target = GL_TEXTURE_2D$2;
        var texture = null;
        var renderbuffer = null;

        var data = attachment;
        if (typeof attachment === 'object') {
          data = attachment.data;
          if ('target' in attachment) {
            target = attachment.target | 0;
          }
        }

        check$1.type(data, 'function', 'invalid attachment data');

        var type = data._reglType;
        if (type === 'texture2d') {
          texture = data;
          check$1(target === GL_TEXTURE_2D$2);
        } else if (type === 'textureCube') {
          texture = data;
          check$1(
            target >= GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 &&
            target < GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 + 6,
            'invalid cube map target');
        } else if (type === 'renderbuffer') {
          renderbuffer = data;
          target = GL_RENDERBUFFER$1;
        } else {
          check$1.raise('invalid regl object for attachment');
        }

        return new FramebufferAttachment(target, texture, renderbuffer)
      }

      function allocAttachment (
        width,
        height,
        isTexture,
        format,
        type) {
        if (isTexture) {
          var texture = textureState.create2D({
            width: width,
            height: height,
            format: format,
            type: type
          });
          texture._texture.refCount = 0;
          return new FramebufferAttachment(GL_TEXTURE_2D$2, texture, null)
        } else {
          var rb = renderbufferState.create({
            width: width,
            height: height,
            format: format
          });
          rb._renderbuffer.refCount = 0;
          return new FramebufferAttachment(GL_RENDERBUFFER$1, null, rb)
        }
      }

      function unwrapAttachment (attachment) {
        return attachment && (attachment.texture || attachment.renderbuffer)
      }

      function resizeAttachment (attachment, w, h) {
        if (attachment) {
          if (attachment.texture) {
            attachment.texture.resize(w, h);
          } else if (attachment.renderbuffer) {
            attachment.renderbuffer.resize(w, h);
          }
          attachment.width = w;
          attachment.height = h;
        }
      }

      var framebufferCount = 0;
      var framebufferSet = {};

      function REGLFramebuffer () {
        this.id = framebufferCount++;
        framebufferSet[this.id] = this;

        this.framebuffer = gl.createFramebuffer();
        this.width = 0;
        this.height = 0;

        this.colorAttachments = [];
        this.depthAttachment = null;
        this.stencilAttachment = null;
        this.depthStencilAttachment = null;
      }

      function decFBORefs (framebuffer) {
        framebuffer.colorAttachments.forEach(decRef);
        decRef(framebuffer.depthAttachment);
        decRef(framebuffer.stencilAttachment);
        decRef(framebuffer.depthStencilAttachment);
      }

      function destroy (framebuffer) {
        var handle = framebuffer.framebuffer;
        check$1(handle, 'must not double destroy framebuffer');
        gl.deleteFramebuffer(handle);
        framebuffer.framebuffer = null;
        stats.framebufferCount--;
        delete framebufferSet[framebuffer.id];
      }

      function updateFramebuffer (framebuffer) {
        var i;

        gl.bindFramebuffer(GL_FRAMEBUFFER$1, framebuffer.framebuffer);
        var colorAttachments = framebuffer.colorAttachments;
        for (i = 0; i < colorAttachments.length; ++i) {
          attach(GL_COLOR_ATTACHMENT0$1 + i, colorAttachments[i]);
        }
        for (i = colorAttachments.length; i < limits.maxColorAttachments; ++i) {
          gl.framebufferTexture2D(
            GL_FRAMEBUFFER$1,
            GL_COLOR_ATTACHMENT0$1 + i,
            GL_TEXTURE_2D$2,
            null,
            0);
        }

        gl.framebufferTexture2D(
          GL_FRAMEBUFFER$1,
          GL_DEPTH_STENCIL_ATTACHMENT,
          GL_TEXTURE_2D$2,
          null,
          0);
        gl.framebufferTexture2D(
          GL_FRAMEBUFFER$1,
          GL_DEPTH_ATTACHMENT,
          GL_TEXTURE_2D$2,
          null,
          0);
        gl.framebufferTexture2D(
          GL_FRAMEBUFFER$1,
          GL_STENCIL_ATTACHMENT,
          GL_TEXTURE_2D$2,
          null,
          0);

        attach(GL_DEPTH_ATTACHMENT, framebuffer.depthAttachment);
        attach(GL_STENCIL_ATTACHMENT, framebuffer.stencilAttachment);
        attach(GL_DEPTH_STENCIL_ATTACHMENT, framebuffer.depthStencilAttachment);

        // Check status code
        var status = gl.checkFramebufferStatus(GL_FRAMEBUFFER$1);
        if (!gl.isContextLost() && status !== GL_FRAMEBUFFER_COMPLETE$1) {
          check$1.raise('framebuffer configuration not supported, status = ' +
            statusCode[status]);
        }

        gl.bindFramebuffer(GL_FRAMEBUFFER$1, framebufferState.next ? framebufferState.next.framebuffer : null);
        framebufferState.cur = framebufferState.next;

        // FIXME: Clear error code here.  This is a work around for a bug in
        // headless-gl
        gl.getError();
      }

      function createFBO (a0, a1) {
        var framebuffer = new REGLFramebuffer();
        stats.framebufferCount++;

        function reglFramebuffer (a, b) {
          var i;

          check$1(framebufferState.next !== framebuffer,
            'can not update framebuffer which is currently in use');

          var width = 0;
          var height = 0;

          var needsDepth = true;
          var needsStencil = true;

          var colorBuffer = null;
          var colorTexture = true;
          var colorFormat = 'rgba';
          var colorType = 'uint8';
          var colorCount = 1;

          var depthBuffer = null;
          var stencilBuffer = null;
          var depthStencilBuffer = null;
          var depthStencilTexture = false;

          if (typeof a === 'number') {
            width = a | 0;
            height = (b | 0) || width;
          } else if (!a) {
            width = height = 1;
          } else {
            check$1.type(a, 'object', 'invalid arguments for framebuffer');
            var options = a;

            if ('shape' in options) {
              var shape = options.shape;
              check$1(Array.isArray(shape) && shape.length >= 2,
                'invalid shape for framebuffer');
              width = shape[0];
              height = shape[1];
            } else {
              if ('radius' in options) {
                width = height = options.radius;
              }
              if ('width' in options) {
                width = options.width;
              }
              if ('height' in options) {
                height = options.height;
              }
            }

            if ('color' in options ||
                'colors' in options) {
              colorBuffer =
                options.color ||
                options.colors;
              if (Array.isArray(colorBuffer)) {
                check$1(
                  colorBuffer.length === 1 || extensions.webgl_draw_buffers,
                  'multiple render targets not supported');
              }
            }

            if (!colorBuffer) {
              if ('colorCount' in options) {
                colorCount = options.colorCount | 0;
                check$1(colorCount > 0, 'invalid color buffer count');
              }

              if ('colorTexture' in options) {
                colorTexture = !!options.colorTexture;
                colorFormat = 'rgba4';
              }

              if ('colorType' in options) {
                colorType = options.colorType;
                if (!colorTexture) {
                  if (colorType === 'half float' || colorType === 'float16') {
                    check$1(extensions.ext_color_buffer_half_float,
                      'you must enable EXT_color_buffer_half_float to use 16-bit render buffers');
                    colorFormat = 'rgba16f';
                  } else if (colorType === 'float' || colorType === 'float32') {
                    check$1(extensions.webgl_color_buffer_float,
                      'you must enable WEBGL_color_buffer_float in order to use 32-bit floating point renderbuffers');
                    colorFormat = 'rgba32f';
                  }
                } else {
                  check$1(extensions.oes_texture_float ||
                    !(colorType === 'float' || colorType === 'float32'),
                  'you must enable OES_texture_float in order to use floating point framebuffer objects');
                  check$1(extensions.oes_texture_half_float ||
                    !(colorType === 'half float' || colorType === 'float16'),
                  'you must enable OES_texture_half_float in order to use 16-bit floating point framebuffer objects');
                }
                check$1.oneOf(colorType, colorTypes, 'invalid color type');
              }

              if ('colorFormat' in options) {
                colorFormat = options.colorFormat;
                if (colorTextureFormats.indexOf(colorFormat) >= 0) {
                  colorTexture = true;
                } else if (colorRenderbufferFormats.indexOf(colorFormat) >= 0) {
                  colorTexture = false;
                } else {
                  check$1.optional(function () {
                    if (colorTexture) {
                      check$1.oneOf(
                        options.colorFormat, colorTextureFormats,
                        'invalid color format for texture');
                    } else {
                      check$1.oneOf(
                        options.colorFormat, colorRenderbufferFormats,
                        'invalid color format for renderbuffer');
                    }
                  });
                }
              }
            }

            if ('depthTexture' in options || 'depthStencilTexture' in options) {
              depthStencilTexture = !!(options.depthTexture ||
                options.depthStencilTexture);
              check$1(!depthStencilTexture || extensions.webgl_depth_texture,
                'webgl_depth_texture extension not supported');
            }

            if ('depth' in options) {
              if (typeof options.depth === 'boolean') {
                needsDepth = options.depth;
              } else {
                depthBuffer = options.depth;
                needsStencil = false;
              }
            }

            if ('stencil' in options) {
              if (typeof options.stencil === 'boolean') {
                needsStencil = options.stencil;
              } else {
                stencilBuffer = options.stencil;
                needsDepth = false;
              }
            }

            if ('depthStencil' in options) {
              if (typeof options.depthStencil === 'boolean') {
                needsDepth = needsStencil = options.depthStencil;
              } else {
                depthStencilBuffer = options.depthStencil;
                needsDepth = false;
                needsStencil = false;
              }
            }
          }

          // parse attachments
          var colorAttachments = null;
          var depthAttachment = null;
          var stencilAttachment = null;
          var depthStencilAttachment = null;

          // Set up color attachments
          if (Array.isArray(colorBuffer)) {
            colorAttachments = colorBuffer.map(parseAttachment);
          } else if (colorBuffer) {
            colorAttachments = [parseAttachment(colorBuffer)];
          } else {
            colorAttachments = new Array(colorCount);
            for (i = 0; i < colorCount; ++i) {
              colorAttachments[i] = allocAttachment(
                width,
                height,
                colorTexture,
                colorFormat,
                colorType);
            }
          }

          check$1(extensions.webgl_draw_buffers || colorAttachments.length <= 1,
            'you must enable the WEBGL_draw_buffers extension in order to use multiple color buffers.');
          check$1(colorAttachments.length <= limits.maxColorAttachments,
            'too many color attachments, not supported');

          width = width || colorAttachments[0].width;
          height = height || colorAttachments[0].height;

          if (depthBuffer) {
            depthAttachment = parseAttachment(depthBuffer);
          } else if (needsDepth && !needsStencil) {
            depthAttachment = allocAttachment(
              width,
              height,
              depthStencilTexture,
              'depth',
              'uint32');
          }

          if (stencilBuffer) {
            stencilAttachment = parseAttachment(stencilBuffer);
          } else if (needsStencil && !needsDepth) {
            stencilAttachment = allocAttachment(
              width,
              height,
              false,
              'stencil',
              'uint8');
          }

          if (depthStencilBuffer) {
            depthStencilAttachment = parseAttachment(depthStencilBuffer);
          } else if (!depthBuffer && !stencilBuffer && needsStencil && needsDepth) {
            depthStencilAttachment = allocAttachment(
              width,
              height,
              depthStencilTexture,
              'depth stencil',
              'depth stencil');
          }

          check$1(
            (!!depthBuffer) + (!!stencilBuffer) + (!!depthStencilBuffer) <= 1,
            'invalid framebuffer configuration, can specify exactly one depth/stencil attachment');

          var commonColorAttachmentSize = null;

          for (i = 0; i < colorAttachments.length; ++i) {
            incRefAndCheckShape(colorAttachments[i], width, height);
            check$1(!colorAttachments[i] ||
              (colorAttachments[i].texture &&
                colorTextureFormatEnums.indexOf(colorAttachments[i].texture._texture.format) >= 0) ||
              (colorAttachments[i].renderbuffer &&
                colorRenderbufferFormatEnums.indexOf(colorAttachments[i].renderbuffer._renderbuffer.format) >= 0),
            'framebuffer color attachment ' + i + ' is invalid');

            if (colorAttachments[i] && colorAttachments[i].texture) {
              var colorAttachmentSize =
                  textureFormatChannels[colorAttachments[i].texture._texture.format] *
                  textureTypeSizes[colorAttachments[i].texture._texture.type];

              if (commonColorAttachmentSize === null) {
                commonColorAttachmentSize = colorAttachmentSize;
              } else {
                // We need to make sure that all color attachments have the same number of bitplanes
                // (that is, the same numer of bits per pixel)
                // This is required by the GLES2.0 standard. See the beginning of Chapter 4 in that document.
                check$1(commonColorAttachmentSize === colorAttachmentSize,
                  'all color attachments much have the same number of bits per pixel.');
              }
            }
          }
          incRefAndCheckShape(depthAttachment, width, height);
          check$1(!depthAttachment ||
            (depthAttachment.texture &&
              depthAttachment.texture._texture.format === GL_DEPTH_COMPONENT$1) ||
            (depthAttachment.renderbuffer &&
              depthAttachment.renderbuffer._renderbuffer.format === GL_DEPTH_COMPONENT16$1),
          'invalid depth attachment for framebuffer object');
          incRefAndCheckShape(stencilAttachment, width, height);
          check$1(!stencilAttachment ||
            (stencilAttachment.renderbuffer &&
              stencilAttachment.renderbuffer._renderbuffer.format === GL_STENCIL_INDEX8$1),
          'invalid stencil attachment for framebuffer object');
          incRefAndCheckShape(depthStencilAttachment, width, height);
          check$1(!depthStencilAttachment ||
            (depthStencilAttachment.texture &&
              depthStencilAttachment.texture._texture.format === GL_DEPTH_STENCIL$2) ||
            (depthStencilAttachment.renderbuffer &&
              depthStencilAttachment.renderbuffer._renderbuffer.format === GL_DEPTH_STENCIL$2),
          'invalid depth-stencil attachment for framebuffer object');

          // decrement references
          decFBORefs(framebuffer);

          framebuffer.width = width;
          framebuffer.height = height;

          framebuffer.colorAttachments = colorAttachments;
          framebuffer.depthAttachment = depthAttachment;
          framebuffer.stencilAttachment = stencilAttachment;
          framebuffer.depthStencilAttachment = depthStencilAttachment;

          reglFramebuffer.color = colorAttachments.map(unwrapAttachment);
          reglFramebuffer.depth = unwrapAttachment(depthAttachment);
          reglFramebuffer.stencil = unwrapAttachment(stencilAttachment);
          reglFramebuffer.depthStencil = unwrapAttachment(depthStencilAttachment);

          reglFramebuffer.width = framebuffer.width;
          reglFramebuffer.height = framebuffer.height;

          updateFramebuffer(framebuffer);

          return reglFramebuffer
        }

        function resize (w_, h_) {
          check$1(framebufferState.next !== framebuffer,
            'can not resize a framebuffer which is currently in use');

          var w = Math.max(w_ | 0, 1);
          var h = Math.max((h_ | 0) || w, 1);
          if (w === framebuffer.width && h === framebuffer.height) {
            return reglFramebuffer
          }

          // resize all buffers
          var colorAttachments = framebuffer.colorAttachments;
          for (var i = 0; i < colorAttachments.length; ++i) {
            resizeAttachment(colorAttachments[i], w, h);
          }
          resizeAttachment(framebuffer.depthAttachment, w, h);
          resizeAttachment(framebuffer.stencilAttachment, w, h);
          resizeAttachment(framebuffer.depthStencilAttachment, w, h);

          framebuffer.width = reglFramebuffer.width = w;
          framebuffer.height = reglFramebuffer.height = h;

          updateFramebuffer(framebuffer);

          return reglFramebuffer
        }

        reglFramebuffer(a0, a1);

        return extend(reglFramebuffer, {
          resize: resize,
          _reglType: 'framebuffer',
          _framebuffer: framebuffer,
          destroy: function () {
            destroy(framebuffer);
            decFBORefs(framebuffer);
          },
          use: function (block) {
            framebufferState.setFBO({
              framebuffer: reglFramebuffer
            }, block);
          }
        })
      }

      function createCubeFBO (options) {
        var faces = Array(6);

        function reglFramebufferCube (a) {
          var i;

          check$1(faces.indexOf(framebufferState.next) < 0,
            'can not update framebuffer which is currently in use');

          var params = {
            color: null
          };

          var radius = 0;

          var colorBuffer = null;
          var colorFormat = 'rgba';
          var colorType = 'uint8';
          var colorCount = 1;

          if (typeof a === 'number') {
            radius = a | 0;
          } else if (!a) {
            radius = 1;
          } else {
            check$1.type(a, 'object', 'invalid arguments for framebuffer');
            var options = a;

            if ('shape' in options) {
              var shape = options.shape;
              check$1(
                Array.isArray(shape) && shape.length >= 2,
                'invalid shape for framebuffer');
              check$1(
                shape[0] === shape[1],
                'cube framebuffer must be square');
              radius = shape[0];
            } else {
              if ('radius' in options) {
                radius = options.radius | 0;
              }
              if ('width' in options) {
                radius = options.width | 0;
                if ('height' in options) {
                  check$1(options.height === radius, 'must be square');
                }
              } else if ('height' in options) {
                radius = options.height | 0;
              }
            }

            if ('color' in options ||
                'colors' in options) {
              colorBuffer =
                options.color ||
                options.colors;
              if (Array.isArray(colorBuffer)) {
                check$1(
                  colorBuffer.length === 1 || extensions.webgl_draw_buffers,
                  'multiple render targets not supported');
              }
            }

            if (!colorBuffer) {
              if ('colorCount' in options) {
                colorCount = options.colorCount | 0;
                check$1(colorCount > 0, 'invalid color buffer count');
              }

              if ('colorType' in options) {
                check$1.oneOf(
                  options.colorType, colorTypes,
                  'invalid color type');
                colorType = options.colorType;
              }

              if ('colorFormat' in options) {
                colorFormat = options.colorFormat;
                check$1.oneOf(
                  options.colorFormat, colorTextureFormats,
                  'invalid color format for texture');
              }
            }

            if ('depth' in options) {
              params.depth = options.depth;
            }

            if ('stencil' in options) {
              params.stencil = options.stencil;
            }

            if ('depthStencil' in options) {
              params.depthStencil = options.depthStencil;
            }
          }

          var colorCubes;
          if (colorBuffer) {
            if (Array.isArray(colorBuffer)) {
              colorCubes = [];
              for (i = 0; i < colorBuffer.length; ++i) {
                colorCubes[i] = colorBuffer[i];
              }
            } else {
              colorCubes = [ colorBuffer ];
            }
          } else {
            colorCubes = Array(colorCount);
            var cubeMapParams = {
              radius: radius,
              format: colorFormat,
              type: colorType
            };
            for (i = 0; i < colorCount; ++i) {
              colorCubes[i] = textureState.createCube(cubeMapParams);
            }
          }

          // Check color cubes
          params.color = Array(colorCubes.length);
          for (i = 0; i < colorCubes.length; ++i) {
            var cube = colorCubes[i];
            check$1(
              typeof cube === 'function' && cube._reglType === 'textureCube',
              'invalid cube map');
            radius = radius || cube.width;
            check$1(
              cube.width === radius && cube.height === radius,
              'invalid cube map shape');
            params.color[i] = {
              target: GL_TEXTURE_CUBE_MAP_POSITIVE_X$2,
              data: colorCubes[i]
            };
          }

          for (i = 0; i < 6; ++i) {
            for (var j = 0; j < colorCubes.length; ++j) {
              params.color[j].target = GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 + i;
            }
            // reuse depth-stencil attachments across all cube maps
            if (i > 0) {
              params.depth = faces[0].depth;
              params.stencil = faces[0].stencil;
              params.depthStencil = faces[0].depthStencil;
            }
            if (faces[i]) {
              (faces[i])(params);
            } else {
              faces[i] = createFBO(params);
            }
          }

          return extend(reglFramebufferCube, {
            width: radius,
            height: radius,
            color: colorCubes
          })
        }

        function resize (radius_) {
          var i;
          var radius = radius_ | 0;
          check$1(radius > 0 && radius <= limits.maxCubeMapSize,
            'invalid radius for cube fbo');

          if (radius === reglFramebufferCube.width) {
            return reglFramebufferCube
          }

          var colors = reglFramebufferCube.color;
          for (i = 0; i < colors.length; ++i) {
            colors[i].resize(radius);
          }

          for (i = 0; i < 6; ++i) {
            faces[i].resize(radius);
          }

          reglFramebufferCube.width = reglFramebufferCube.height = radius;

          return reglFramebufferCube
        }

        reglFramebufferCube(options);

        return extend(reglFramebufferCube, {
          faces: faces,
          resize: resize,
          _reglType: 'framebufferCube',
          destroy: function () {
            faces.forEach(function (f) {
              f.destroy();
            });
          }
        })
      }

      function restoreFramebuffers () {
        framebufferState.cur = null;
        framebufferState.next = null;
        framebufferState.dirty = true;
        values(framebufferSet).forEach(function (fb) {
          fb.framebuffer = gl.createFramebuffer();
          updateFramebuffer(fb);
        });
      }

      return extend(framebufferState, {
        getFramebuffer: function (object) {
          if (typeof object === 'function' && object._reglType === 'framebuffer') {
            var fbo = object._framebuffer;
            if (fbo instanceof REGLFramebuffer) {
              return fbo
            }
          }
          return null
        },
        create: createFBO,
        createCube: createCubeFBO,
        clear: function () {
          values(framebufferSet).forEach(destroy);
        },
        restore: restoreFramebuffers
      })
    }

    var GL_FLOAT$6 = 5126;
    var GL_ARRAY_BUFFER$1 = 34962;
    var GL_ELEMENT_ARRAY_BUFFER$1 = 34963;

    var VAO_OPTIONS = [
      'attributes',
      'elements',
      'offset',
      'count',
      'primitive',
      'instances'
    ];

    function AttributeRecord () {
      this.state = 0;

      this.x = 0.0;
      this.y = 0.0;
      this.z = 0.0;
      this.w = 0.0;

      this.buffer = null;
      this.size = 0;
      this.normalized = false;
      this.type = GL_FLOAT$6;
      this.offset = 0;
      this.stride = 0;
      this.divisor = 0;
    }

    function wrapAttributeState (
      gl,
      extensions,
      limits,
      stats,
      bufferState,
      elementState,
      drawState) {
      var NUM_ATTRIBUTES = limits.maxAttributes;
      var attributeBindings = new Array(NUM_ATTRIBUTES);
      for (var i = 0; i < NUM_ATTRIBUTES; ++i) {
        attributeBindings[i] = new AttributeRecord();
      }
      var vaoCount = 0;
      var vaoSet = {};

      var state = {
        Record: AttributeRecord,
        scope: {},
        state: attributeBindings,
        currentVAO: null,
        targetVAO: null,
        restore: extVAO() ? restoreVAO : function () {},
        createVAO: createVAO,
        getVAO: getVAO,
        destroyBuffer: destroyBuffer,
        setVAO: extVAO() ? setVAOEXT : setVAOEmulated,
        clear: extVAO() ? destroyVAOEXT : function () {}
      };

      function destroyBuffer (buffer) {
        for (var i = 0; i < attributeBindings.length; ++i) {
          var record = attributeBindings[i];
          if (record.buffer === buffer) {
            gl.disableVertexAttribArray(i);
            record.buffer = null;
          }
        }
      }

      function extVAO () {
        return extensions.oes_vertex_array_object
      }

      function extInstanced () {
        return extensions.angle_instanced_arrays
      }

      function getVAO (vao) {
        if (typeof vao === 'function' && vao._vao) {
          return vao._vao
        }
        return null
      }

      function setVAOEXT (vao) {
        if (vao === state.currentVAO) {
          return
        }
        var ext = extVAO();
        if (vao) {
          ext.bindVertexArrayOES(vao.vao);
        } else {
          ext.bindVertexArrayOES(null);
        }
        state.currentVAO = vao;
      }

      function setVAOEmulated (vao) {
        if (vao === state.currentVAO) {
          return
        }
        if (vao) {
          vao.bindAttrs();
        } else {
          var exti = extInstanced();
          for (var i = 0; i < attributeBindings.length; ++i) {
            var binding = attributeBindings[i];
            if (binding.buffer) {
              gl.enableVertexAttribArray(i);
              binding.buffer.bind();
              gl.vertexAttribPointer(i, binding.size, binding.type, binding.normalized, binding.stride, binding.offfset);
              if (exti && binding.divisor) {
                exti.vertexAttribDivisorANGLE(i, binding.divisor);
              }
            } else {
              gl.disableVertexAttribArray(i);
              gl.vertexAttrib4f(i, binding.x, binding.y, binding.z, binding.w);
            }
          }
          if (drawState.elements) {
            gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER$1, drawState.elements.buffer.buffer);
          } else {
            gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER$1, null);
          }
        }
        state.currentVAO = vao;
      }

      function destroyVAOEXT () {
        values(vaoSet).forEach(function (vao) {
          vao.destroy();
        });
      }

      function REGLVAO () {
        this.id = ++vaoCount;
        this.attributes = [];
        this.elements = null;
        this.ownsElements = false;
        this.count = 0;
        this.offset = 0;
        this.instances = -1;
        this.primitive = 4;
        var extension = extVAO();
        if (extension) {
          this.vao = extension.createVertexArrayOES();
        } else {
          this.vao = null;
        }
        vaoSet[this.id] = this;
        this.buffers = [];
      }

      REGLVAO.prototype.bindAttrs = function () {
        var exti = extInstanced();
        var attributes = this.attributes;
        for (var i = 0; i < attributes.length; ++i) {
          var attr = attributes[i];
          if (attr.buffer) {
            gl.enableVertexAttribArray(i);
            gl.bindBuffer(GL_ARRAY_BUFFER$1, attr.buffer.buffer);
            gl.vertexAttribPointer(i, attr.size, attr.type, attr.normalized, attr.stride, attr.offset);
            if (exti && attr.divisor) {
              exti.vertexAttribDivisorANGLE(i, attr.divisor);
            }
          } else {
            gl.disableVertexAttribArray(i);
            gl.vertexAttrib4f(i, attr.x, attr.y, attr.z, attr.w);
          }
        }
        for (var j = attributes.length; j < NUM_ATTRIBUTES; ++j) {
          gl.disableVertexAttribArray(j);
        }
        var elements = elementState.getElements(this.elements);
        if (elements) {
          gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER$1, elements.buffer.buffer);
        } else {
          gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER$1, null);
        }
      };

      REGLVAO.prototype.refresh = function () {
        var ext = extVAO();
        if (ext) {
          ext.bindVertexArrayOES(this.vao);
          this.bindAttrs();
          state.currentVAO = null;
          ext.bindVertexArrayOES(null);
        }
      };

      REGLVAO.prototype.destroy = function () {
        if (this.vao) {
          var extension = extVAO();
          if (this === state.currentVAO) {
            state.currentVAO = null;
            extension.bindVertexArrayOES(null);
          }
          extension.deleteVertexArrayOES(this.vao);
          this.vao = null;
        }
        if (this.ownsElements) {
          this.elements.destroy();
          this.elements = null;
          this.ownsElements = false;
        }
        if (vaoSet[this.id]) {
          delete vaoSet[this.id];
          stats.vaoCount -= 1;
        }
      };

      function restoreVAO () {
        var ext = extVAO();
        if (ext) {
          values(vaoSet).forEach(function (vao) {
            vao.refresh();
          });
        }
      }

      function createVAO (_attr) {
        var vao = new REGLVAO();
        stats.vaoCount += 1;

        function updateVAO (options) {
          var attributes;
          if (Array.isArray(options)) {
            attributes = options;
            if (vao.elements && vao.ownsElements) {
              vao.elements.destroy();
            }
            vao.elements = null;
            vao.ownsElements = false;
            vao.offset = 0;
            vao.count = 0;
            vao.instances = -1;
            vao.primitive = 4;
          } else {
            check$1(typeof options === 'object', 'invalid arguments for create vao');
            check$1('attributes' in options, 'must specify attributes for vao');
            if (options.elements) {
              var elements = options.elements;
              if (vao.ownsElements) {
                if (typeof elements === 'function' && elements._reglType === 'elements') {
                  vao.elements.destroy();
                  vao.ownsElements = false;
                } else {
                  vao.elements(elements);
                  vao.ownsElements = false;
                }
              } else if (elementState.getElements(options.elements)) {
                vao.elements = options.elements;
                vao.ownsElements = false;
              } else {
                vao.elements = elementState.create(options.elements);
                vao.ownsElements = true;
              }
            } else {
              vao.elements = null;
              vao.ownsElements = false;
            }
            attributes = options.attributes;

            // set default vao
            vao.offset = 0;
            vao.count = -1;
            vao.instances = -1;
            vao.primitive = 4;

            // copy element properties
            if (vao.elements) {
              vao.count = vao.elements._elements.vertCount;
              vao.primitive = vao.elements._elements.primType;
            }

            if ('offset' in options) {
              vao.offset = options.offset | 0;
            }
            if ('count' in options) {
              vao.count = options.count | 0;
            }
            if ('instances' in options) {
              vao.instances = options.instances | 0;
            }
            if ('primitive' in options) {
              check$1(options.primitive in primTypes, 'bad primitive type: ' + options.primitive);
              vao.primitive = primTypes[options.primitive];
            }

            check$1.optional(() => {
              var keys = Object.keys(options);
              for (var i = 0; i < keys.length; ++i) {
                check$1(VAO_OPTIONS.indexOf(keys[i]) >= 0, 'invalid option for vao: "' + keys[i] + '" valid options are ' + VAO_OPTIONS);
              }
            });
            check$1(Array.isArray(attributes), 'attributes must be an array');
          }

          check$1(attributes.length < NUM_ATTRIBUTES, 'too many attributes');
          check$1(attributes.length > 0, 'must specify at least one attribute');

          var bufUpdated = {};
          var nattributes = vao.attributes;
          nattributes.length = attributes.length;
          for (var i = 0; i < attributes.length; ++i) {
            var spec = attributes[i];
            var rec = nattributes[i] = new AttributeRecord();
            var data = spec.data || spec;
            if (Array.isArray(data) || isTypedArray(data) || isNDArrayLike(data)) {
              var buf;
              if (vao.buffers[i]) {
                buf = vao.buffers[i];
                if (isTypedArray(data) && buf._buffer.byteLength >= data.byteLength) {
                  buf.subdata(data);
                } else {
                  buf.destroy();
                  vao.buffers[i] = null;
                }
              }
              if (!vao.buffers[i]) {
                buf = vao.buffers[i] = bufferState.create(spec, GL_ARRAY_BUFFER$1, false, true);
              }
              rec.buffer = bufferState.getBuffer(buf);
              rec.size = rec.buffer.dimension | 0;
              rec.normalized = false;
              rec.type = rec.buffer.dtype;
              rec.offset = 0;
              rec.stride = 0;
              rec.divisor = 0;
              rec.state = 1;
              bufUpdated[i] = 1;
            } else if (bufferState.getBuffer(spec)) {
              rec.buffer = bufferState.getBuffer(spec);
              rec.size = rec.buffer.dimension | 0;
              rec.normalized = false;
              rec.type = rec.buffer.dtype;
              rec.offset = 0;
              rec.stride = 0;
              rec.divisor = 0;
              rec.state = 1;
            } else if (bufferState.getBuffer(spec.buffer)) {
              rec.buffer = bufferState.getBuffer(spec.buffer);
              rec.size = ((+spec.size) || rec.buffer.dimension) | 0;
              rec.normalized = !!spec.normalized || false;
              if ('type' in spec) {
                check$1.parameter(spec.type, glTypes, 'invalid buffer type');
                rec.type = glTypes[spec.type];
              } else {
                rec.type = rec.buffer.dtype;
              }
              rec.offset = (spec.offset || 0) | 0;
              rec.stride = (spec.stride || 0) | 0;
              rec.divisor = (spec.divisor || 0) | 0;
              rec.state = 1;

              check$1(rec.size >= 1 && rec.size <= 4, 'size must be between 1 and 4');
              check$1(rec.offset >= 0, 'invalid offset');
              check$1(rec.stride >= 0 && rec.stride <= 255, 'stride must be between 0 and 255');
              check$1(rec.divisor >= 0, 'divisor must be positive');
              check$1(!rec.divisor || !!extensions.angle_instanced_arrays, 'ANGLE_instanced_arrays must be enabled to use divisor');
            } else if ('x' in spec) {
              check$1(i > 0, 'first attribute must not be a constant');
              rec.x = +spec.x || 0;
              rec.y = +spec.y || 0;
              rec.z = +spec.z || 0;
              rec.w = +spec.w || 0;
              rec.state = 2;
            } else {
              check$1(false, 'invalid attribute spec for location ' + i);
            }
          }

          // retire unused buffers
          for (var j = 0; j < vao.buffers.length; ++j) {
            if (!bufUpdated[j] && vao.buffers[j]) {
              vao.buffers[j].destroy();
              vao.buffers[j] = null;
            }
          }

          vao.refresh();
          return updateVAO
        }

        updateVAO.destroy = function () {
          for (var j = 0; j < vao.buffers.length; ++j) {
            if (vao.buffers[j]) {
              vao.buffers[j].destroy();
            }
          }
          vao.buffers.length = 0;

          if (vao.ownsElements) {
            vao.elements.destroy();
            vao.elements = null;
            vao.ownsElements = false;
          }

          vao.destroy();
        };

        updateVAO._vao = vao;
        updateVAO._reglType = 'vao';

        return updateVAO(_attr)
      }

      return state
    }

    var GL_FRAGMENT_SHADER = 35632;
    var GL_VERTEX_SHADER = 35633;

    var GL_ACTIVE_UNIFORMS = 0x8B86;
    var GL_ACTIVE_ATTRIBUTES = 0x8B89;

    function wrapShaderState (gl, stringStore, stats, config) {
      // ===================================================
      // glsl compilation and linking
      // ===================================================
      var fragShaders = {};
      var vertShaders = {};

      function ActiveInfo (name, id, location, info) {
        this.name = name;
        this.id = id;
        this.location = location;
        this.info = info;
      }

      function insertActiveInfo (list, info) {
        for (var i = 0; i < list.length; ++i) {
          if (list[i].id === info.id) {
            list[i].location = info.location;
            return
          }
        }
        list.push(info);
      }

      function getShader (type, id, command) {
        var cache = type === GL_FRAGMENT_SHADER ? fragShaders : vertShaders;
        var shader = cache[id];

        if (!shader) {
          var source = stringStore.str(id);
          shader = gl.createShader(type);
          gl.shaderSource(shader, source);
          gl.compileShader(shader);
          check$1.shaderError(gl, shader, source, type, command);
          cache[id] = shader;
        }

        return shader
      }

      // ===================================================
      // program linking
      // ===================================================
      var programCache = {};
      var programList = [];

      var PROGRAM_COUNTER = 0;

      function REGLProgram (fragId, vertId) {
        this.id = PROGRAM_COUNTER++;
        this.fragId = fragId;
        this.vertId = vertId;
        this.program = null;
        this.uniforms = [];
        this.attributes = [];
        this.refCount = 1;

        if (config.profile) {
          this.stats = {
            uniformsCount: 0,
            attributesCount: 0
          };
        }
      }

      function linkProgram (desc, command, attributeLocations) {
        var i, info;

        // -------------------------------
        // compile & link
        // -------------------------------
        var fragShader = getShader(GL_FRAGMENT_SHADER, desc.fragId);
        var vertShader = getShader(GL_VERTEX_SHADER, desc.vertId);

        var program = desc.program = gl.createProgram();
        gl.attachShader(program, fragShader);
        gl.attachShader(program, vertShader);
        if (attributeLocations) {
          for (i = 0; i < attributeLocations.length; ++i) {
            var binding = attributeLocations[i];
            gl.bindAttribLocation(program, binding[0], binding[1]);
          }
        }

        gl.linkProgram(program);
        check$1.linkError(
          gl,
          program,
          stringStore.str(desc.fragId),
          stringStore.str(desc.vertId),
          command);

        // -------------------------------
        // grab uniforms
        // -------------------------------
        var numUniforms = gl.getProgramParameter(program, GL_ACTIVE_UNIFORMS);
        if (config.profile) {
          desc.stats.uniformsCount = numUniforms;
        }
        var uniforms = desc.uniforms;
        for (i = 0; i < numUniforms; ++i) {
          info = gl.getActiveUniform(program, i);
          if (info) {
            if (info.size > 1) {
              for (var j = 0; j < info.size; ++j) {
                var name = info.name.replace('[0]', '[' + j + ']');
                insertActiveInfo(uniforms, new ActiveInfo(
                  name,
                  stringStore.id(name),
                  gl.getUniformLocation(program, name),
                  info));
              }
            }
            var uniName = info.name;
            if (info.size > 1) {
              uniName = uniName.replace('[0]', '');
            }
            insertActiveInfo(uniforms, new ActiveInfo(
              uniName,
              stringStore.id(uniName),
              gl.getUniformLocation(program, uniName),
              info));
          }
        }

        // -------------------------------
        // grab attributes
        // -------------------------------
        var numAttributes = gl.getProgramParameter(program, GL_ACTIVE_ATTRIBUTES);
        if (config.profile) {
          desc.stats.attributesCount = numAttributes;
        }

        var attributes = desc.attributes;
        for (i = 0; i < numAttributes; ++i) {
          info = gl.getActiveAttrib(program, i);
          if (info) {
            insertActiveInfo(attributes, new ActiveInfo(
              info.name,
              stringStore.id(info.name),
              gl.getAttribLocation(program, info.name),
              info));
          }
        }
      }

      if (config.profile) {
        stats.getMaxUniformsCount = function () {
          var m = 0;
          programList.forEach(function (desc) {
            if (desc.stats.uniformsCount > m) {
              m = desc.stats.uniformsCount;
            }
          });
          return m
        };

        stats.getMaxAttributesCount = function () {
          var m = 0;
          programList.forEach(function (desc) {
            if (desc.stats.attributesCount > m) {
              m = desc.stats.attributesCount;
            }
          });
          return m
        };
      }

      function restoreShaders () {
        fragShaders = {};
        vertShaders = {};
        for (var i = 0; i < programList.length; ++i) {
          linkProgram(programList[i], null, programList[i].attributes.map(function (info) {
            return [info.location, info.name]
          }));
        }
      }

      return {
        clear: function () {
          var deleteShader = gl.deleteShader.bind(gl);
          values(fragShaders).forEach(deleteShader);
          fragShaders = {};
          values(vertShaders).forEach(deleteShader);
          vertShaders = {};

          programList.forEach(function (desc) {
            gl.deleteProgram(desc.program);
          });
          programList.length = 0;
          programCache = {};

          stats.shaderCount = 0;
        },

        program: function (vertId, fragId, command, attribLocations) {
          check$1.command(vertId >= 0, 'missing vertex shader', command);
          check$1.command(fragId >= 0, 'missing fragment shader', command);

          var cache = programCache[fragId];
          if (!cache) {
            cache = programCache[fragId] = {};
          }
          var prevProgram = cache[vertId];
          if (prevProgram) {
            prevProgram.refCount++;
            if (!attribLocations) {
              return prevProgram
            }
          }
          var program = new REGLProgram(fragId, vertId);
          stats.shaderCount++;
          linkProgram(program, command, attribLocations);
          if (!prevProgram) {
            cache[vertId] = program;
          }
          programList.push(program);
          return extend(program, {
            destroy: function () {
              program.refCount--;
              if (program.refCount <= 0) {
                gl.deleteProgram(program.program);
                var idx = programList.indexOf(program);
                programList.splice(idx, 1);
                stats.shaderCount--;
              }
              // no program is linked to this vert anymore
              if (cache[program.vertId].refCount <= 0) {
                gl.deleteShader(vertShaders[program.vertId]);
                delete vertShaders[program.vertId];
                delete programCache[program.fragId][program.vertId];
              }
              // no program is linked to this frag anymore
              if (!Object.keys(programCache[program.fragId]).length) {
                gl.deleteShader(fragShaders[program.fragId]);
                delete fragShaders[program.fragId];
                delete programCache[program.fragId];
              }
            }
          })
        },

        restore: restoreShaders,

        shader: getShader,

        frag: -1,
        vert: -1
      }
    }

    var GL_RGBA$3 = 6408;
    var GL_UNSIGNED_BYTE$7 = 5121;
    var GL_PACK_ALIGNMENT = 0x0D05;
    var GL_FLOAT$7 = 0x1406; // 5126

    function wrapReadPixels (
      gl,
      framebufferState,
      reglPoll,
      context,
      glAttributes,
      extensions,
      limits) {
      function readPixelsImpl (input) {
        var type;
        if (framebufferState.next === null) {
          check$1(
            glAttributes.preserveDrawingBuffer,
            'you must create a webgl context with "preserveDrawingBuffer":true in order to read pixels from the drawing buffer');
          type = GL_UNSIGNED_BYTE$7;
        } else {
          check$1(
            framebufferState.next.colorAttachments[0].texture !== null,
            'You cannot read from a renderbuffer');
          type = framebufferState.next.colorAttachments[0].texture._texture.type;

          check$1.optional(function () {
            if (extensions.oes_texture_float) {
              check$1(
                type === GL_UNSIGNED_BYTE$7 || type === GL_FLOAT$7,
                'Reading from a framebuffer is only allowed for the types \'uint8\' and \'float\'');

              if (type === GL_FLOAT$7) {
                check$1(limits.readFloat, 'Reading \'float\' values is not permitted in your browser. For a fallback, please see: https://www.npmjs.com/package/glsl-read-float');
              }
            } else {
              check$1(
                type === GL_UNSIGNED_BYTE$7,
                'Reading from a framebuffer is only allowed for the type \'uint8\'');
            }
          });
        }

        var x = 0;
        var y = 0;
        var width = context.framebufferWidth;
        var height = context.framebufferHeight;
        var data = null;

        if (isTypedArray(input)) {
          data = input;
        } else if (input) {
          check$1.type(input, 'object', 'invalid arguments to regl.read()');
          x = input.x | 0;
          y = input.y | 0;
          check$1(
            x >= 0 && x < context.framebufferWidth,
            'invalid x offset for regl.read');
          check$1(
            y >= 0 && y < context.framebufferHeight,
            'invalid y offset for regl.read');
          width = (input.width || (context.framebufferWidth - x)) | 0;
          height = (input.height || (context.framebufferHeight - y)) | 0;
          data = input.data || null;
        }

        // sanity check input.data
        if (data) {
          if (type === GL_UNSIGNED_BYTE$7) {
            check$1(
              data instanceof Uint8Array,
              'buffer must be \'Uint8Array\' when reading from a framebuffer of type \'uint8\'');
          } else if (type === GL_FLOAT$7) {
            check$1(
              data instanceof Float32Array,
              'buffer must be \'Float32Array\' when reading from a framebuffer of type \'float\'');
          }
        }

        check$1(
          width > 0 && width + x <= context.framebufferWidth,
          'invalid width for read pixels');
        check$1(
          height > 0 && height + y <= context.framebufferHeight,
          'invalid height for read pixels');

        // Update WebGL state
        reglPoll();

        // Compute size
        var size = width * height * 4;

        // Allocate data
        if (!data) {
          if (type === GL_UNSIGNED_BYTE$7) {
            data = new Uint8Array(size);
          } else if (type === GL_FLOAT$7) {
            data = data || new Float32Array(size);
          }
        }

        // Type check
        check$1.isTypedArray(data, 'data buffer for regl.read() must be a typedarray');
        check$1(data.byteLength >= size, 'data buffer for regl.read() too small');

        // Run read pixels
        gl.pixelStorei(GL_PACK_ALIGNMENT, 4);
        gl.readPixels(x, y, width, height, GL_RGBA$3,
          type,
          data);

        return data
      }

      function readPixelsFBO (options) {
        var result;
        framebufferState.setFBO({
          framebuffer: options.framebuffer
        }, function () {
          result = readPixelsImpl(options);
        });
        return result
      }

      function readPixels (options) {
        if (!options || !('framebuffer' in options)) {
          return readPixelsImpl(options)
        } else {
          return readPixelsFBO(options)
        }
      }

      return readPixels
    }

    function slice (x) {
      return Array.prototype.slice.call(x)
    }

    function join (x) {
      return slice(x).join('')
    }

    function createEnvironment () {
      // Unique variable id counter
      var varCounter = 0;

      // Linked values are passed from this scope into the generated code block
      // Calling link() passes a value into the generated scope and returns
      // the variable name which it is bound to
      var linkedNames = [];
      var linkedValues = [];
      function link (value) {
        for (var i = 0; i < linkedValues.length; ++i) {
          if (linkedValues[i] === value) {
            return linkedNames[i]
          }
        }

        var name = 'g' + (varCounter++);
        linkedNames.push(name);
        linkedValues.push(value);
        return name
      }

      // create a code block
      function block () {
        var code = [];
        function push () {
          code.push.apply(code, slice(arguments));
        }

        var vars = [];
        function def () {
          var name = 'v' + (varCounter++);
          vars.push(name);

          if (arguments.length > 0) {
            code.push(name, '=');
            code.push.apply(code, slice(arguments));
            code.push(';');
          }

          return name
        }

        return extend(push, {
          def: def,
          toString: function () {
            return join([
              (vars.length > 0 ? 'var ' + vars.join(',') + ';' : ''),
              join(code)
            ])
          }
        })
      }

      function scope () {
        var entry = block();
        var exit = block();

        var entryToString = entry.toString;
        var exitToString = exit.toString;

        function save (object, prop) {
          exit(object, prop, '=', entry.def(object, prop), ';');
        }

        return extend(function () {
          entry.apply(entry, slice(arguments));
        }, {
          def: entry.def,
          entry: entry,
          exit: exit,
          save: save,
          set: function (object, prop, value) {
            save(object, prop);
            entry(object, prop, '=', value, ';');
          },
          toString: function () {
            return entryToString() + exitToString()
          }
        })
      }

      function conditional () {
        var pred = join(arguments);
        var thenBlock = scope();
        var elseBlock = scope();

        var thenToString = thenBlock.toString;
        var elseToString = elseBlock.toString;

        return extend(thenBlock, {
          then: function () {
            thenBlock.apply(thenBlock, slice(arguments));
            return this
          },
          else: function () {
            elseBlock.apply(elseBlock, slice(arguments));
            return this
          },
          toString: function () {
            var elseClause = elseToString();
            if (elseClause) {
              elseClause = 'else{' + elseClause + '}';
            }
            return join([
              'if(', pred, '){',
              thenToString(),
              '}', elseClause
            ])
          }
        })
      }

      // procedure list
      var globalBlock = block();
      var procedures = {};
      function proc (name, count) {
        var args = [];
        function arg () {
          var name = 'a' + args.length;
          args.push(name);
          return name
        }

        count = count || 0;
        for (var i = 0; i < count; ++i) {
          arg();
        }

        var body = scope();
        var bodyToString = body.toString;

        var result = procedures[name] = extend(body, {
          arg: arg,
          toString: function () {
            return join([
              'function(', args.join(), '){',
              bodyToString(),
              '}'
            ])
          }
        });

        return result
      }

      function compile () {
        var code = ['"use strict";',
          globalBlock,
          'return {'];
        Object.keys(procedures).forEach(function (name) {
          code.push('"', name, '":', procedures[name].toString(), ',');
        });
        code.push('}');
        var src = join(code)
          .replace(/;/g, ';\n')
          .replace(/}/g, '}\n')
          .replace(/{/g, '{\n');
        var proc = Function.apply(null, linkedNames.concat(src));
        return proc.apply(null, linkedValues)
      }

      return {
        global: globalBlock,
        link: link,
        block: block,
        proc: proc,
        scope: scope,
        cond: conditional,
        compile: compile
      }
    }

    // "cute" names for vector components
    var CUTE_COMPONENTS = 'xyzw'.split('');

    var GL_UNSIGNED_BYTE$8 = 5121;

    var ATTRIB_STATE_POINTER = 1;
    var ATTRIB_STATE_CONSTANT = 2;

    var DYN_FUNC$1 = 0;
    var DYN_PROP$1 = 1;
    var DYN_CONTEXT$1 = 2;
    var DYN_STATE$1 = 3;
    var DYN_THUNK = 4;
    var DYN_CONSTANT$1 = 5;
    var DYN_ARRAY$1 = 6;

    var S_DITHER = 'dither';
    var S_BLEND_ENABLE = 'blend.enable';
    var S_BLEND_COLOR = 'blend.color';
    var S_BLEND_EQUATION = 'blend.equation';
    var S_BLEND_FUNC = 'blend.func';
    var S_DEPTH_ENABLE = 'depth.enable';
    var S_DEPTH_FUNC = 'depth.func';
    var S_DEPTH_RANGE = 'depth.range';
    var S_DEPTH_MASK = 'depth.mask';
    var S_COLOR_MASK = 'colorMask';
    var S_CULL_ENABLE = 'cull.enable';
    var S_CULL_FACE = 'cull.face';
    var S_FRONT_FACE = 'frontFace';
    var S_LINE_WIDTH = 'lineWidth';
    var S_POLYGON_OFFSET_ENABLE = 'polygonOffset.enable';
    var S_POLYGON_OFFSET_OFFSET = 'polygonOffset.offset';
    var S_SAMPLE_ALPHA = 'sample.alpha';
    var S_SAMPLE_ENABLE = 'sample.enable';
    var S_SAMPLE_COVERAGE = 'sample.coverage';
    var S_STENCIL_ENABLE = 'stencil.enable';
    var S_STENCIL_MASK = 'stencil.mask';
    var S_STENCIL_FUNC = 'stencil.func';
    var S_STENCIL_OPFRONT = 'stencil.opFront';
    var S_STENCIL_OPBACK = 'stencil.opBack';
    var S_SCISSOR_ENABLE = 'scissor.enable';
    var S_SCISSOR_BOX = 'scissor.box';
    var S_VIEWPORT = 'viewport';

    var S_PROFILE = 'profile';

    var S_FRAMEBUFFER = 'framebuffer';
    var S_VERT = 'vert';
    var S_FRAG = 'frag';
    var S_ELEMENTS = 'elements';
    var S_PRIMITIVE = 'primitive';
    var S_COUNT = 'count';
    var S_OFFSET = 'offset';
    var S_INSTANCES = 'instances';
    var S_VAO = 'vao';

    var SUFFIX_WIDTH = 'Width';
    var SUFFIX_HEIGHT = 'Height';

    var S_FRAMEBUFFER_WIDTH = S_FRAMEBUFFER + SUFFIX_WIDTH;
    var S_FRAMEBUFFER_HEIGHT = S_FRAMEBUFFER + SUFFIX_HEIGHT;
    var S_VIEWPORT_WIDTH = S_VIEWPORT + SUFFIX_WIDTH;
    var S_VIEWPORT_HEIGHT = S_VIEWPORT + SUFFIX_HEIGHT;
    var S_DRAWINGBUFFER = 'drawingBuffer';
    var S_DRAWINGBUFFER_WIDTH = S_DRAWINGBUFFER + SUFFIX_WIDTH;
    var S_DRAWINGBUFFER_HEIGHT = S_DRAWINGBUFFER + SUFFIX_HEIGHT;

    var NESTED_OPTIONS = [
      S_BLEND_FUNC,
      S_BLEND_EQUATION,
      S_STENCIL_FUNC,
      S_STENCIL_OPFRONT,
      S_STENCIL_OPBACK,
      S_SAMPLE_COVERAGE,
      S_VIEWPORT,
      S_SCISSOR_BOX,
      S_POLYGON_OFFSET_OFFSET
    ];

    var GL_ARRAY_BUFFER$2 = 34962;
    var GL_ELEMENT_ARRAY_BUFFER$2 = 34963;

    var GL_FRAGMENT_SHADER$1 = 35632;
    var GL_VERTEX_SHADER$1 = 35633;

    var GL_TEXTURE_2D$3 = 0x0DE1;
    var GL_TEXTURE_CUBE_MAP$2 = 0x8513;

    var GL_CULL_FACE = 0x0B44;
    var GL_BLEND = 0x0BE2;
    var GL_DITHER = 0x0BD0;
    var GL_STENCIL_TEST = 0x0B90;
    var GL_DEPTH_TEST = 0x0B71;
    var GL_SCISSOR_TEST = 0x0C11;
    var GL_POLYGON_OFFSET_FILL = 0x8037;
    var GL_SAMPLE_ALPHA_TO_COVERAGE = 0x809E;
    var GL_SAMPLE_COVERAGE = 0x80A0;

    var GL_FLOAT$8 = 5126;
    var GL_FLOAT_VEC2 = 35664;
    var GL_FLOAT_VEC3 = 35665;
    var GL_FLOAT_VEC4 = 35666;
    var GL_INT$3 = 5124;
    var GL_INT_VEC2 = 35667;
    var GL_INT_VEC3 = 35668;
    var GL_INT_VEC4 = 35669;
    var GL_BOOL = 35670;
    var GL_BOOL_VEC2 = 35671;
    var GL_BOOL_VEC3 = 35672;
    var GL_BOOL_VEC4 = 35673;
    var GL_FLOAT_MAT2 = 35674;
    var GL_FLOAT_MAT3 = 35675;
    var GL_FLOAT_MAT4 = 35676;
    var GL_SAMPLER_2D = 35678;
    var GL_SAMPLER_CUBE = 35680;

    var GL_TRIANGLES$1 = 4;

    var GL_FRONT = 1028;
    var GL_BACK = 1029;
    var GL_CW = 0x0900;
    var GL_CCW = 0x0901;
    var GL_MIN_EXT = 0x8007;
    var GL_MAX_EXT = 0x8008;
    var GL_ALWAYS = 519;
    var GL_KEEP = 7680;
    var GL_ZERO = 0;
    var GL_ONE = 1;
    var GL_FUNC_ADD = 0x8006;
    var GL_LESS = 513;

    var GL_FRAMEBUFFER$2 = 0x8D40;
    var GL_COLOR_ATTACHMENT0$2 = 0x8CE0;

    var blendFuncs = {
      '0': 0,
      '1': 1,
      'zero': 0,
      'one': 1,
      'src color': 768,
      'one minus src color': 769,
      'src alpha': 770,
      'one minus src alpha': 771,
      'dst color': 774,
      'one minus dst color': 775,
      'dst alpha': 772,
      'one minus dst alpha': 773,
      'constant color': 32769,
      'one minus constant color': 32770,
      'constant alpha': 32771,
      'one minus constant alpha': 32772,
      'src alpha saturate': 776
    };

    // There are invalid values for srcRGB and dstRGB. See:
    // https://www.khronos.org/registry/webgl/specs/1.0/#6.13
    // https://github.com/KhronosGroup/WebGL/blob/0d3201f5f7ec3c0060bc1f04077461541f1987b9/conformance-suites/1.0.3/conformance/misc/webgl-specific.html#L56
    var invalidBlendCombinations = [
      'constant color, constant alpha',
      'one minus constant color, constant alpha',
      'constant color, one minus constant alpha',
      'one minus constant color, one minus constant alpha',
      'constant alpha, constant color',
      'constant alpha, one minus constant color',
      'one minus constant alpha, constant color',
      'one minus constant alpha, one minus constant color'
    ];

    var compareFuncs = {
      'never': 512,
      'less': 513,
      '<': 513,
      'equal': 514,
      '=': 514,
      '==': 514,
      '===': 514,
      'lequal': 515,
      '<=': 515,
      'greater': 516,
      '>': 516,
      'notequal': 517,
      '!=': 517,
      '!==': 517,
      'gequal': 518,
      '>=': 518,
      'always': 519
    };

    var stencilOps = {
      '0': 0,
      'zero': 0,
      'keep': 7680,
      'replace': 7681,
      'increment': 7682,
      'decrement': 7683,
      'increment wrap': 34055,
      'decrement wrap': 34056,
      'invert': 5386
    };

    var shaderType = {
      'frag': GL_FRAGMENT_SHADER$1,
      'vert': GL_VERTEX_SHADER$1
    };

    var orientationType = {
      'cw': GL_CW,
      'ccw': GL_CCW
    };

    function isBufferArgs (x) {
      return Array.isArray(x) ||
        isTypedArray(x) ||
        isNDArrayLike(x)
    }

    // Make sure viewport is processed first
    function sortState (state) {
      return state.sort(function (a, b) {
        if (a === S_VIEWPORT) {
          return -1
        } else if (b === S_VIEWPORT) {
          return 1
        }
        return (a < b) ? -1 : 1
      })
    }

    function Declaration (thisDep, contextDep, propDep, append) {
      this.thisDep = thisDep;
      this.contextDep = contextDep;
      this.propDep = propDep;
      this.append = append;
    }

    function isStatic (decl) {
      return decl && !(decl.thisDep || decl.contextDep || decl.propDep)
    }

    function createStaticDecl (append) {
      return new Declaration(false, false, false, append)
    }

    function createDynamicDecl (dyn, append) {
      var type = dyn.type;
      if (type === DYN_FUNC$1) {
        var numArgs = dyn.data.length;
        return new Declaration(
          true,
          numArgs >= 1,
          numArgs >= 2,
          append)
      } else if (type === DYN_THUNK) {
        var data = dyn.data;
        return new Declaration(
          data.thisDep,
          data.contextDep,
          data.propDep,
          append)
      } else if (type === DYN_CONSTANT$1) {
        return new Declaration(
          false,
          false,
          false,
          append)
      } else if (type === DYN_ARRAY$1) {
        var thisDep = false;
        var contextDep = false;
        var propDep = false;
        for (var i = 0; i < dyn.data.length; ++i) {
          var subDyn = dyn.data[i];
          if (subDyn.type === DYN_PROP$1) {
            propDep = true;
          } else if (subDyn.type === DYN_CONTEXT$1) {
            contextDep = true;
          } else if (subDyn.type === DYN_STATE$1) {
            thisDep = true;
          } else if (subDyn.type === DYN_FUNC$1) {
            thisDep = true;
            var subArgs = subDyn.data;
            if (subArgs >= 1) {
              contextDep = true;
            }
            if (subArgs >= 2) {
              propDep = true;
            }
          } else if (subDyn.type === DYN_THUNK) {
            thisDep = thisDep || subDyn.data.thisDep;
            contextDep = contextDep || subDyn.data.contextDep;
            propDep = propDep || subDyn.data.propDep;
          }
        }
        return new Declaration(
          thisDep,
          contextDep,
          propDep,
          append)
      } else {
        return new Declaration(
          type === DYN_STATE$1,
          type === DYN_CONTEXT$1,
          type === DYN_PROP$1,
          append)
      }
    }

    var SCOPE_DECL = new Declaration(false, false, false, function () {});

    function reglCore (
      gl,
      stringStore,
      extensions,
      limits,
      bufferState,
      elementState,
      textureState,
      framebufferState,
      uniformState,
      attributeState,
      shaderState,
      drawState,
      contextState,
      timer,
      config) {
      var AttributeRecord = attributeState.Record;

      var blendEquations = {
        'add': 32774,
        'subtract': 32778,
        'reverse subtract': 32779
      };
      if (extensions.ext_blend_minmax) {
        blendEquations.min = GL_MIN_EXT;
        blendEquations.max = GL_MAX_EXT;
      }

      var extInstancing = extensions.angle_instanced_arrays;
      var extDrawBuffers = extensions.webgl_draw_buffers;
      var extVertexArrays = extensions.oes_vertex_array_object;

      // ===================================================
      // ===================================================
      // WEBGL STATE
      // ===================================================
      // ===================================================
      var currentState = {
        dirty: true,
        profile: config.profile
      };
      var nextState = {};
      var GL_STATE_NAMES = [];
      var GL_FLAGS = {};
      var GL_VARIABLES = {};

      function propName (name) {
        return name.replace('.', '_')
      }

      function stateFlag (sname, cap, init) {
        var name = propName(sname);
        GL_STATE_NAMES.push(sname);
        nextState[name] = currentState[name] = !!init;
        GL_FLAGS[name] = cap;
      }

      function stateVariable (sname, func, init) {
        var name = propName(sname);
        GL_STATE_NAMES.push(sname);
        if (Array.isArray(init)) {
          currentState[name] = init.slice();
          nextState[name] = init.slice();
        } else {
          currentState[name] = nextState[name] = init;
        }
        GL_VARIABLES[name] = func;
      }

      // Dithering
      stateFlag(S_DITHER, GL_DITHER);

      // Blending
      stateFlag(S_BLEND_ENABLE, GL_BLEND);
      stateVariable(S_BLEND_COLOR, 'blendColor', [0, 0, 0, 0]);
      stateVariable(S_BLEND_EQUATION, 'blendEquationSeparate',
        [GL_FUNC_ADD, GL_FUNC_ADD]);
      stateVariable(S_BLEND_FUNC, 'blendFuncSeparate',
        [GL_ONE, GL_ZERO, GL_ONE, GL_ZERO]);

      // Depth
      stateFlag(S_DEPTH_ENABLE, GL_DEPTH_TEST, true);
      stateVariable(S_DEPTH_FUNC, 'depthFunc', GL_LESS);
      stateVariable(S_DEPTH_RANGE, 'depthRange', [0, 1]);
      stateVariable(S_DEPTH_MASK, 'depthMask', true);

      // Color mask
      stateVariable(S_COLOR_MASK, S_COLOR_MASK, [true, true, true, true]);

      // Face culling
      stateFlag(S_CULL_ENABLE, GL_CULL_FACE);
      stateVariable(S_CULL_FACE, 'cullFace', GL_BACK);

      // Front face orientation
      stateVariable(S_FRONT_FACE, S_FRONT_FACE, GL_CCW);

      // Line width
      stateVariable(S_LINE_WIDTH, S_LINE_WIDTH, 1);

      // Polygon offset
      stateFlag(S_POLYGON_OFFSET_ENABLE, GL_POLYGON_OFFSET_FILL);
      stateVariable(S_POLYGON_OFFSET_OFFSET, 'polygonOffset', [0, 0]);

      // Sample coverage
      stateFlag(S_SAMPLE_ALPHA, GL_SAMPLE_ALPHA_TO_COVERAGE);
      stateFlag(S_SAMPLE_ENABLE, GL_SAMPLE_COVERAGE);
      stateVariable(S_SAMPLE_COVERAGE, 'sampleCoverage', [1, false]);

      // Stencil
      stateFlag(S_STENCIL_ENABLE, GL_STENCIL_TEST);
      stateVariable(S_STENCIL_MASK, 'stencilMask', -1);
      stateVariable(S_STENCIL_FUNC, 'stencilFunc', [GL_ALWAYS, 0, -1]);
      stateVariable(S_STENCIL_OPFRONT, 'stencilOpSeparate',
        [GL_FRONT, GL_KEEP, GL_KEEP, GL_KEEP]);
      stateVariable(S_STENCIL_OPBACK, 'stencilOpSeparate',
        [GL_BACK, GL_KEEP, GL_KEEP, GL_KEEP]);

      // Scissor
      stateFlag(S_SCISSOR_ENABLE, GL_SCISSOR_TEST);
      stateVariable(S_SCISSOR_BOX, 'scissor',
        [0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight]);

      // Viewport
      stateVariable(S_VIEWPORT, S_VIEWPORT,
        [0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight]);

      // ===================================================
      // ===================================================
      // ENVIRONMENT
      // ===================================================
      // ===================================================
      var sharedState = {
        gl: gl,
        context: contextState,
        strings: stringStore,
        next: nextState,
        current: currentState,
        draw: drawState,
        elements: elementState,
        buffer: bufferState,
        shader: shaderState,
        attributes: attributeState.state,
        vao: attributeState,
        uniforms: uniformState,
        framebuffer: framebufferState,
        extensions: extensions,

        timer: timer,
        isBufferArgs: isBufferArgs
      };

      var sharedConstants = {
        primTypes: primTypes,
        compareFuncs: compareFuncs,
        blendFuncs: blendFuncs,
        blendEquations: blendEquations,
        stencilOps: stencilOps,
        glTypes: glTypes,
        orientationType: orientationType
      };

      check$1.optional(function () {
        sharedState.isArrayLike = isArrayLike;
      });

      if (extDrawBuffers) {
        sharedConstants.backBuffer = [GL_BACK];
        sharedConstants.drawBuffer = loop(limits.maxDrawbuffers, function (i) {
          if (i === 0) {
            return [0]
          }
          return loop(i, function (j) {
            return GL_COLOR_ATTACHMENT0$2 + j
          })
        });
      }

      var drawCallCounter = 0;
      function createREGLEnvironment () {
        var env = createEnvironment();
        var link = env.link;
        var global = env.global;
        env.id = drawCallCounter++;

        env.batchId = '0';

        // link shared state
        var SHARED = link(sharedState);
        var shared = env.shared = {
          props: 'a0'
        };
        Object.keys(sharedState).forEach(function (prop) {
          shared[prop] = global.def(SHARED, '.', prop);
        });

        // Inject runtime assertion stuff for debug builds
        check$1.optional(function () {
          env.CHECK = link(check$1);
          env.commandStr = check$1.guessCommand();
          env.command = link(env.commandStr);
          env.assert = function (block, pred, message) {
            block(
              'if(!(', pred, '))',
              this.CHECK, '.commandRaise(', link(message), ',', this.command, ');');
          };

          sharedConstants.invalidBlendCombinations = invalidBlendCombinations;
        });

        // Copy GL state variables over
        var nextVars = env.next = {};
        var currentVars = env.current = {};
        Object.keys(GL_VARIABLES).forEach(function (variable) {
          if (Array.isArray(currentState[variable])) {
            nextVars[variable] = global.def(shared.next, '.', variable);
            currentVars[variable] = global.def(shared.current, '.', variable);
          }
        });

        // Initialize shared constants
        var constants = env.constants = {};
        Object.keys(sharedConstants).forEach(function (name) {
          constants[name] = global.def(JSON.stringify(sharedConstants[name]));
        });

        // Helper function for calling a block
        env.invoke = function (block, x) {
          switch (x.type) {
            case DYN_FUNC$1:
              var argList = [
                'this',
                shared.context,
                shared.props,
                env.batchId
              ];
              return block.def(
                link(x.data), '.call(',
                argList.slice(0, Math.max(x.data.length + 1, 4)),
                ')')
            case DYN_PROP$1:
              return block.def(shared.props, x.data)
            case DYN_CONTEXT$1:
              return block.def(shared.context, x.data)
            case DYN_STATE$1:
              return block.def('this', x.data)
            case DYN_THUNK:
              x.data.append(env, block);
              return x.data.ref
            case DYN_CONSTANT$1:
              return x.data.toString()
            case DYN_ARRAY$1:
              return x.data.map(function (y) {
                return env.invoke(block, y)
              })
          }
        };

        env.attribCache = {};

        var scopeAttribs = {};
        env.scopeAttrib = function (name) {
          var id = stringStore.id(name);
          if (id in scopeAttribs) {
            return scopeAttribs[id]
          }
          var binding = attributeState.scope[id];
          if (!binding) {
            binding = attributeState.scope[id] = new AttributeRecord();
          }
          var result = scopeAttribs[id] = link(binding);
          return result
        };

        return env
      }

      // ===================================================
      // ===================================================
      // PARSING
      // ===================================================
      // ===================================================
      function parseProfile (options) {
        var staticOptions = options.static;
        var dynamicOptions = options.dynamic;

        var profileEnable;
        if (S_PROFILE in staticOptions) {
          var value = !!staticOptions[S_PROFILE];
          profileEnable = createStaticDecl(function (env, scope) {
            return value
          });
          profileEnable.enable = value;
        } else if (S_PROFILE in dynamicOptions) {
          var dyn = dynamicOptions[S_PROFILE];
          profileEnable = createDynamicDecl(dyn, function (env, scope) {
            return env.invoke(scope, dyn)
          });
        }

        return profileEnable
      }

      function parseFramebuffer (options, env) {
        var staticOptions = options.static;
        var dynamicOptions = options.dynamic;

        if (S_FRAMEBUFFER in staticOptions) {
          var framebuffer = staticOptions[S_FRAMEBUFFER];
          if (framebuffer) {
            framebuffer = framebufferState.getFramebuffer(framebuffer);
            check$1.command(framebuffer, 'invalid framebuffer object');
            return createStaticDecl(function (env, block) {
              var FRAMEBUFFER = env.link(framebuffer);
              var shared = env.shared;
              block.set(
                shared.framebuffer,
                '.next',
                FRAMEBUFFER);
              var CONTEXT = shared.context;
              block.set(
                CONTEXT,
                '.' + S_FRAMEBUFFER_WIDTH,
                FRAMEBUFFER + '.width');
              block.set(
                CONTEXT,
                '.' + S_FRAMEBUFFER_HEIGHT,
                FRAMEBUFFER + '.height');
              return FRAMEBUFFER
            })
          } else {
            return createStaticDecl(function (env, scope) {
              var shared = env.shared;
              scope.set(
                shared.framebuffer,
                '.next',
                'null');
              var CONTEXT = shared.context;
              scope.set(
                CONTEXT,
                '.' + S_FRAMEBUFFER_WIDTH,
                CONTEXT + '.' + S_DRAWINGBUFFER_WIDTH);
              scope.set(
                CONTEXT,
                '.' + S_FRAMEBUFFER_HEIGHT,
                CONTEXT + '.' + S_DRAWINGBUFFER_HEIGHT);
              return 'null'
            })
          }
        } else if (S_FRAMEBUFFER in dynamicOptions) {
          var dyn = dynamicOptions[S_FRAMEBUFFER];
          return createDynamicDecl(dyn, function (env, scope) {
            var FRAMEBUFFER_FUNC = env.invoke(scope, dyn);
            var shared = env.shared;
            var FRAMEBUFFER_STATE = shared.framebuffer;
            var FRAMEBUFFER = scope.def(
              FRAMEBUFFER_STATE, '.getFramebuffer(', FRAMEBUFFER_FUNC, ')');

            check$1.optional(function () {
              env.assert(scope,
                '!' + FRAMEBUFFER_FUNC + '||' + FRAMEBUFFER,
                'invalid framebuffer object');
            });

            scope.set(
              FRAMEBUFFER_STATE,
              '.next',
              FRAMEBUFFER);
            var CONTEXT = shared.context;
            scope.set(
              CONTEXT,
              '.' + S_FRAMEBUFFER_WIDTH,
              FRAMEBUFFER + '?' + FRAMEBUFFER + '.width:' +
              CONTEXT + '.' + S_DRAWINGBUFFER_WIDTH);
            scope.set(
              CONTEXT,
              '.' + S_FRAMEBUFFER_HEIGHT,
              FRAMEBUFFER +
              '?' + FRAMEBUFFER + '.height:' +
              CONTEXT + '.' + S_DRAWINGBUFFER_HEIGHT);
            return FRAMEBUFFER
          })
        } else {
          return null
        }
      }

      function parseViewportScissor (options, framebuffer, env) {
        var staticOptions = options.static;
        var dynamicOptions = options.dynamic;

        function parseBox (param) {
          if (param in staticOptions) {
            var box = staticOptions[param];
            check$1.commandType(box, 'object', 'invalid ' + param, env.commandStr);

            var isStatic = true;
            var x = box.x | 0;
            var y = box.y | 0;
            var w, h;
            if ('width' in box) {
              w = box.width | 0;
              check$1.command(w >= 0, 'invalid ' + param, env.commandStr);
            } else {
              isStatic = false;
            }
            if ('height' in box) {
              h = box.height | 0;
              check$1.command(h >= 0, 'invalid ' + param, env.commandStr);
            } else {
              isStatic = false;
            }

            return new Declaration(
              !isStatic && framebuffer && framebuffer.thisDep,
              !isStatic && framebuffer && framebuffer.contextDep,
              !isStatic && framebuffer && framebuffer.propDep,
              function (env, scope) {
                var CONTEXT = env.shared.context;
                var BOX_W = w;
                if (!('width' in box)) {
                  BOX_W = scope.def(CONTEXT, '.', S_FRAMEBUFFER_WIDTH, '-', x);
                }
                var BOX_H = h;
                if (!('height' in box)) {
                  BOX_H = scope.def(CONTEXT, '.', S_FRAMEBUFFER_HEIGHT, '-', y);
                }
                return [x, y, BOX_W, BOX_H]
              })
          } else if (param in dynamicOptions) {
            var dynBox = dynamicOptions[param];
            var result = createDynamicDecl(dynBox, function (env, scope) {
              var BOX = env.invoke(scope, dynBox);

              check$1.optional(function () {
                env.assert(scope,
                  BOX + '&&typeof ' + BOX + '==="object"',
                  'invalid ' + param);
              });

              var CONTEXT = env.shared.context;
              var BOX_X = scope.def(BOX, '.x|0');
              var BOX_Y = scope.def(BOX, '.y|0');
              var BOX_W = scope.def(
                '"width" in ', BOX, '?', BOX, '.width|0:',
                '(', CONTEXT, '.', S_FRAMEBUFFER_WIDTH, '-', BOX_X, ')');
              var BOX_H = scope.def(
                '"height" in ', BOX, '?', BOX, '.height|0:',
                '(', CONTEXT, '.', S_FRAMEBUFFER_HEIGHT, '-', BOX_Y, ')');

              check$1.optional(function () {
                env.assert(scope,
                  BOX_W + '>=0&&' +
                  BOX_H + '>=0',
                  'invalid ' + param);
              });

              return [BOX_X, BOX_Y, BOX_W, BOX_H]
            });
            if (framebuffer) {
              result.thisDep = result.thisDep || framebuffer.thisDep;
              result.contextDep = result.contextDep || framebuffer.contextDep;
              result.propDep = result.propDep || framebuffer.propDep;
            }
            return result
          } else if (framebuffer) {
            return new Declaration(
              framebuffer.thisDep,
              framebuffer.contextDep,
              framebuffer.propDep,
              function (env, scope) {
                var CONTEXT = env.shared.context;
                return [
                  0, 0,
                  scope.def(CONTEXT, '.', S_FRAMEBUFFER_WIDTH),
                  scope.def(CONTEXT, '.', S_FRAMEBUFFER_HEIGHT)]
              })
          } else {
            return null
          }
        }

        var viewport = parseBox(S_VIEWPORT);

        if (viewport) {
          var prevViewport = viewport;
          viewport = new Declaration(
            viewport.thisDep,
            viewport.contextDep,
            viewport.propDep,
            function (env, scope) {
              var VIEWPORT = prevViewport.append(env, scope);
              var CONTEXT = env.shared.context;
              scope.set(
                CONTEXT,
                '.' + S_VIEWPORT_WIDTH,
                VIEWPORT[2]);
              scope.set(
                CONTEXT,
                '.' + S_VIEWPORT_HEIGHT,
                VIEWPORT[3]);
              return VIEWPORT
            });
        }

        return {
          viewport: viewport,
          scissor_box: parseBox(S_SCISSOR_BOX)
        }
      }

      function parseAttribLocations (options, attributes) {
        var staticOptions = options.static;
        var staticProgram =
          typeof staticOptions[S_FRAG] === 'string' &&
          typeof staticOptions[S_VERT] === 'string';
        if (staticProgram) {
          if (Object.keys(attributes.dynamic).length > 0) {
            return null
          }
          var staticAttributes = attributes.static;
          var sAttributes = Object.keys(staticAttributes);
          if (sAttributes.length > 0 && typeof staticAttributes[sAttributes[0]] === 'number') {
            var bindings = [];
            for (var i = 0; i < sAttributes.length; ++i) {
              check$1(typeof staticAttributes[sAttributes[i]] === 'number', 'must specify all vertex attribute locations when using vaos');
              bindings.push([staticAttributes[sAttributes[i]] | 0, sAttributes[i]]);
            }
            return bindings
          }
        }
        return null
      }

      function parseProgram (options, env, attribLocations) {
        var staticOptions = options.static;
        var dynamicOptions = options.dynamic;

        function parseShader (name) {
          if (name in staticOptions) {
            var id = stringStore.id(staticOptions[name]);
            check$1.optional(function () {
              shaderState.shader(shaderType[name], id, check$1.guessCommand());
            });
            var result = createStaticDecl(function () {
              return id
            });
            result.id = id;
            return result
          } else if (name in dynamicOptions) {
            var dyn = dynamicOptions[name];
            return createDynamicDecl(dyn, function (env, scope) {
              var str = env.invoke(scope, dyn);
              var id = scope.def(env.shared.strings, '.id(', str, ')');
              check$1.optional(function () {
                scope(
                  env.shared.shader, '.shader(',
                  shaderType[name], ',',
                  id, ',',
                  env.command, ');');
              });
              return id
            })
          }
          return null
        }

        var frag = parseShader(S_FRAG);
        var vert = parseShader(S_VERT);

        var program = null;
        var progVar;
        if (isStatic(frag) && isStatic(vert)) {
          program = shaderState.program(vert.id, frag.id, null, attribLocations);
          progVar = createStaticDecl(function (env, scope) {
            return env.link(program)
          });
        } else {
          progVar = new Declaration(
            (frag && frag.thisDep) || (vert && vert.thisDep),
            (frag && frag.contextDep) || (vert && vert.contextDep),
            (frag && frag.propDep) || (vert && vert.propDep),
            function (env, scope) {
              var SHADER_STATE = env.shared.shader;
              var fragId;
              if (frag) {
                fragId = frag.append(env, scope);
              } else {
                fragId = scope.def(SHADER_STATE, '.', S_FRAG);
              }
              var vertId;
              if (vert) {
                vertId = vert.append(env, scope);
              } else {
                vertId = scope.def(SHADER_STATE, '.', S_VERT);
              }
              var progDef = SHADER_STATE + '.program(' + vertId + ',' + fragId;
              check$1.optional(function () {
                progDef += ',' + env.command;
              });
              return scope.def(progDef + ')')
            });
        }

        return {
          frag: frag,
          vert: vert,
          progVar: progVar,
          program: program
        }
      }

      function parseDraw (options, env) {
        var staticOptions = options.static;
        var dynamicOptions = options.dynamic;

        // TODO: should use VAO to get default values for offset properties
        // should move vao parse into here and out of the old stuff

        var staticDraw = {};
        var vaoActive = false;

        function parseVAO () {
          if (S_VAO in staticOptions) {
            var vao = staticOptions[S_VAO];
            if (vao !== null && attributeState.getVAO(vao) === null) {
              vao = attributeState.createVAO(vao);
            }

            vaoActive = true;
            staticDraw.vao = vao;

            return createStaticDecl(function (env) {
              var vaoRef = attributeState.getVAO(vao);
              if (vaoRef) {
                return env.link(vaoRef)
              } else {
                return 'null'
              }
            })
          } else if (S_VAO in dynamicOptions) {
            vaoActive = true;
            var dyn = dynamicOptions[S_VAO];
            return createDynamicDecl(dyn, function (env, scope) {
              var vaoRef = env.invoke(scope, dyn);
              return scope.def(env.shared.vao + '.getVAO(' + vaoRef + ')')
            })
          }
          return null
        }

        var vao = parseVAO();

        var elementsActive = false;

        function parseElements () {
          if (S_ELEMENTS in staticOptions) {
            var elements = staticOptions[S_ELEMENTS];
            staticDraw.elements = elements;
            if (isBufferArgs(elements)) {
              var e = staticDraw.elements = elementState.create(elements, true);
              elements = elementState.getElements(e);
              elementsActive = true;
            } else if (elements) {
              elements = elementState.getElements(elements);
              elementsActive = true;
              check$1.command(elements, 'invalid elements', env.commandStr);
            }

            var result = createStaticDecl(function (env, scope) {
              if (elements) {
                var result = env.link(elements);
                env.ELEMENTS = result;
                return result
              }
              env.ELEMENTS = null;
              return null
            });
            result.value = elements;
            return result
          } else if (S_ELEMENTS in dynamicOptions) {
            elementsActive = true;

            var dyn = dynamicOptions[S_ELEMENTS];
            return createDynamicDecl(dyn, function (env, scope) {
              var shared = env.shared;

              var IS_BUFFER_ARGS = shared.isBufferArgs;
              var ELEMENT_STATE = shared.elements;

              var elementDefn = env.invoke(scope, dyn);
              var elements = scope.def('null');
              var elementStream = scope.def(IS_BUFFER_ARGS, '(', elementDefn, ')');

              var ifte = env.cond(elementStream)
                .then(elements, '=', ELEMENT_STATE, '.createStream(', elementDefn, ');')
                .else(elements, '=', ELEMENT_STATE, '.getElements(', elementDefn, ');');

              check$1.optional(function () {
                env.assert(ifte.else,
                  '!' + elementDefn + '||' + elements,
                  'invalid elements');
              });

              scope.entry(ifte);
              scope.exit(
                env.cond(elementStream)
                  .then(ELEMENT_STATE, '.destroyStream(', elements, ');'));

              env.ELEMENTS = elements;

              return elements
            })
          } else if (vaoActive) {
            return new Declaration(
              vao.thisDep,
              vao.contextDep,
              vao.propDep,
              function (env, scope) {
                return scope.def(env.shared.vao + '.currentVAO?' + env.shared.elements + '.getElements(' + env.shared.vao + '.currentVAO.elements):null')
              })
          }
          return null
        }

        var elements = parseElements();

        function parsePrimitive () {
          if (S_PRIMITIVE in staticOptions) {
            var primitive = staticOptions[S_PRIMITIVE];
            staticDraw.primitive = primitive;
            check$1.commandParameter(primitive, primTypes, 'invalid primitve', env.commandStr);
            return createStaticDecl(function (env, scope) {
              return primTypes[primitive]
            })
          } else if (S_PRIMITIVE in dynamicOptions) {
            var dynPrimitive = dynamicOptions[S_PRIMITIVE];
            return createDynamicDecl(dynPrimitive, function (env, scope) {
              var PRIM_TYPES = env.constants.primTypes;
              var prim = env.invoke(scope, dynPrimitive);
              check$1.optional(function () {
                env.assert(scope,
                  prim + ' in ' + PRIM_TYPES,
                  'invalid primitive, must be one of ' + Object.keys(primTypes));
              });
              return scope.def(PRIM_TYPES, '[', prim, ']')
            })
          } else if (elementsActive) {
            if (isStatic(elements)) {
              if (elements.value) {
                return createStaticDecl(function (env, scope) {
                  return scope.def(env.ELEMENTS, '.primType')
                })
              } else {
                return createStaticDecl(function () {
                  return GL_TRIANGLES$1
                })
              }
            } else {
              return new Declaration(
                elements.thisDep,
                elements.contextDep,
                elements.propDep,
                function (env, scope) {
                  var elements = env.ELEMENTS;
                  return scope.def(elements, '?', elements, '.primType:', GL_TRIANGLES$1)
                })
            }
          } else if (vaoActive) {
            return new Declaration(
              vao.thisDep,
              vao.contextDep,
              vao.propDep,
              function (env, scope) {
                return scope.def(env.shared.vao + '.currentVAO?' + env.shared.vao + '.currentVAO.primitive:' + GL_TRIANGLES$1)
              })
          }
          return null
        }

        function parseParam (param, isOffset) {
          if (param in staticOptions) {
            var value = staticOptions[param] | 0;
            if (isOffset) {
              staticDraw.offset = value;
            } else {
              staticDraw.instances = value;
            }
            check$1.command(!isOffset || value >= 0, 'invalid ' + param, env.commandStr);
            return createStaticDecl(function (env, scope) {
              if (isOffset) {
                env.OFFSET = value;
              }
              return value
            })
          } else if (param in dynamicOptions) {
            var dynValue = dynamicOptions[param];
            return createDynamicDecl(dynValue, function (env, scope) {
              var result = env.invoke(scope, dynValue);
              if (isOffset) {
                env.OFFSET = result;
                check$1.optional(function () {
                  env.assert(scope,
                    result + '>=0',
                    'invalid ' + param);
                });
              }
              return result
            })
          } else if (isOffset) {
            if (elementsActive) {
              return createStaticDecl(function (env, scope) {
                env.OFFSET = 0;
                return 0
              })
            } else if (vaoActive) {
              return new Declaration(
                vao.thisDep,
                vao.contextDep,
                vao.propDep,
                function (env, scope) {
                  return scope.def(env.shared.vao + '.currentVAO?' + env.shared.vao + '.currentVAO.offset:0')
                })
            }
          } else if (vaoActive) {
            return new Declaration(
              vao.thisDep,
              vao.contextDep,
              vao.propDep,
              function (env, scope) {
                return scope.def(env.shared.vao + '.currentVAO?' + env.shared.vao + '.currentVAO.instances:-1')
              })
          }
          return null
        }

        var OFFSET = parseParam(S_OFFSET, true);

        function parseVertCount () {
          if (S_COUNT in staticOptions) {
            var count = staticOptions[S_COUNT] | 0;
            staticDraw.count = count;
            check$1.command(
              typeof count === 'number' && count >= 0, 'invalid vertex count', env.commandStr);
            return createStaticDecl(function () {
              return count
            })
          } else if (S_COUNT in dynamicOptions) {
            var dynCount = dynamicOptions[S_COUNT];
            return createDynamicDecl(dynCount, function (env, scope) {
              var result = env.invoke(scope, dynCount);
              check$1.optional(function () {
                env.assert(scope,
                  'typeof ' + result + '==="number"&&' +
                  result + '>=0&&' +
                  result + '===(' + result + '|0)',
                  'invalid vertex count');
              });
              return result
            })
          } else if (elementsActive) {
            if (isStatic(elements)) {
              if (elements) {
                if (OFFSET) {
                  return new Declaration(
                    OFFSET.thisDep,
                    OFFSET.contextDep,
                    OFFSET.propDep,
                    function (env, scope) {
                      var result = scope.def(
                        env.ELEMENTS, '.vertCount-', env.OFFSET);

                      check$1.optional(function () {
                        env.assert(scope,
                          result + '>=0',
                          'invalid vertex offset/element buffer too small');
                      });

                      return result
                    })
                } else {
                  return createStaticDecl(function (env, scope) {
                    return scope.def(env.ELEMENTS, '.vertCount')
                  })
                }
              } else {
                var result = createStaticDecl(function () {
                  return -1
                });
                check$1.optional(function () {
                  result.MISSING = true;
                });
                return result
              }
            } else {
              var variable = new Declaration(
                elements.thisDep || OFFSET.thisDep,
                elements.contextDep || OFFSET.contextDep,
                elements.propDep || OFFSET.propDep,
                function (env, scope) {
                  var elements = env.ELEMENTS;
                  if (env.OFFSET) {
                    return scope.def(elements, '?', elements, '.vertCount-',
                      env.OFFSET, ':-1')
                  }
                  return scope.def(elements, '?', elements, '.vertCount:-1')
                });
              check$1.optional(function () {
                variable.DYNAMIC = true;
              });
              return variable
            }
          } else if (vaoActive) {
            var countVariable = new Declaration(
              vao.thisDep,
              vao.contextDep,
              vao.propDep,
              function (env, scope) {
                return scope.def(env.shared.vao, '.currentVAO?', env.shared.vao, '.currentVAO.count:-1')
              });
            return countVariable
          }
          return null
        }

        var primitive = parsePrimitive();
        var count = parseVertCount();
        var instances = parseParam(S_INSTANCES, false);

        return {
          elements: elements,
          primitive: primitive,
          count: count,
          instances: instances,
          offset: OFFSET,
          vao: vao,

          vaoActive: vaoActive,
          elementsActive: elementsActive,

          // static draw props
          static: staticDraw
        }
      }

      function parseGLState (options, env) {
        var staticOptions = options.static;
        var dynamicOptions = options.dynamic;

        var STATE = {};

        GL_STATE_NAMES.forEach(function (prop) {
          var param = propName(prop);

          function parseParam (parseStatic, parseDynamic) {
            if (prop in staticOptions) {
              var value = parseStatic(staticOptions[prop]);
              STATE[param] = createStaticDecl(function () {
                return value
              });
            } else if (prop in dynamicOptions) {
              var dyn = dynamicOptions[prop];
              STATE[param] = createDynamicDecl(dyn, function (env, scope) {
                return parseDynamic(env, scope, env.invoke(scope, dyn))
              });
            }
          }

          switch (prop) {
            case S_CULL_ENABLE:
            case S_BLEND_ENABLE:
            case S_DITHER:
            case S_STENCIL_ENABLE:
            case S_DEPTH_ENABLE:
            case S_SCISSOR_ENABLE:
            case S_POLYGON_OFFSET_ENABLE:
            case S_SAMPLE_ALPHA:
            case S_SAMPLE_ENABLE:
            case S_DEPTH_MASK:
              return parseParam(
                function (value) {
                  check$1.commandType(value, 'boolean', prop, env.commandStr);
                  return value
                },
                function (env, scope, value) {
                  check$1.optional(function () {
                    env.assert(scope,
                      'typeof ' + value + '==="boolean"',
                      'invalid flag ' + prop, env.commandStr);
                  });
                  return value
                })

            case S_DEPTH_FUNC:
              return parseParam(
                function (value) {
                  check$1.commandParameter(value, compareFuncs, 'invalid ' + prop, env.commandStr);
                  return compareFuncs[value]
                },
                function (env, scope, value) {
                  var COMPARE_FUNCS = env.constants.compareFuncs;
                  check$1.optional(function () {
                    env.assert(scope,
                      value + ' in ' + COMPARE_FUNCS,
                      'invalid ' + prop + ', must be one of ' + Object.keys(compareFuncs));
                  });
                  return scope.def(COMPARE_FUNCS, '[', value, ']')
                })

            case S_DEPTH_RANGE:
              return parseParam(
                function (value) {
                  check$1.command(
                    isArrayLike(value) &&
                    value.length === 2 &&
                    typeof value[0] === 'number' &&
                    typeof value[1] === 'number' &&
                    value[0] <= value[1],
                    'depth range is 2d array',
                    env.commandStr);
                  return value
                },
                function (env, scope, value) {
                  check$1.optional(function () {
                    env.assert(scope,
                      env.shared.isArrayLike + '(' + value + ')&&' +
                      value + '.length===2&&' +
                      'typeof ' + value + '[0]==="number"&&' +
                      'typeof ' + value + '[1]==="number"&&' +
                      value + '[0]<=' + value + '[1]',
                      'depth range must be a 2d array');
                  });

                  var Z_NEAR = scope.def('+', value, '[0]');
                  var Z_FAR = scope.def('+', value, '[1]');
                  return [Z_NEAR, Z_FAR]
                })

            case S_BLEND_FUNC:
              return parseParam(
                function (value) {
                  check$1.commandType(value, 'object', 'blend.func', env.commandStr);
                  var srcRGB = ('srcRGB' in value ? value.srcRGB : value.src);
                  var srcAlpha = ('srcAlpha' in value ? value.srcAlpha : value.src);
                  var dstRGB = ('dstRGB' in value ? value.dstRGB : value.dst);
                  var dstAlpha = ('dstAlpha' in value ? value.dstAlpha : value.dst);
                  check$1.commandParameter(srcRGB, blendFuncs, param + '.srcRGB', env.commandStr);
                  check$1.commandParameter(srcAlpha, blendFuncs, param + '.srcAlpha', env.commandStr);
                  check$1.commandParameter(dstRGB, blendFuncs, param + '.dstRGB', env.commandStr);
                  check$1.commandParameter(dstAlpha, blendFuncs, param + '.dstAlpha', env.commandStr);

                  check$1.command(
                    (invalidBlendCombinations.indexOf(srcRGB + ', ' + dstRGB) === -1),
                    'unallowed blending combination (srcRGB, dstRGB) = (' + srcRGB + ', ' + dstRGB + ')', env.commandStr);

                  return [
                    blendFuncs[srcRGB],
                    blendFuncs[dstRGB],
                    blendFuncs[srcAlpha],
                    blendFuncs[dstAlpha]
                  ]
                },
                function (env, scope, value) {
                  var BLEND_FUNCS = env.constants.blendFuncs;

                  check$1.optional(function () {
                    env.assert(scope,
                      value + '&&typeof ' + value + '==="object"',
                      'invalid blend func, must be an object');
                  });

                  function read (prefix, suffix) {
                    var func = scope.def(
                      '"', prefix, suffix, '" in ', value,
                      '?', value, '.', prefix, suffix,
                      ':', value, '.', prefix);

                    check$1.optional(function () {
                      env.assert(scope,
                        func + ' in ' + BLEND_FUNCS,
                        'invalid ' + prop + '.' + prefix + suffix + ', must be one of ' + Object.keys(blendFuncs));
                    });

                    return func
                  }

                  var srcRGB = read('src', 'RGB');
                  var dstRGB = read('dst', 'RGB');

                  check$1.optional(function () {
                    var INVALID_BLEND_COMBINATIONS = env.constants.invalidBlendCombinations;

                    env.assert(scope,
                      INVALID_BLEND_COMBINATIONS +
                               '.indexOf(' + srcRGB + '+", "+' + dstRGB + ') === -1 ',
                      'unallowed blending combination for (srcRGB, dstRGB)'
                    );
                  });

                  var SRC_RGB = scope.def(BLEND_FUNCS, '[', srcRGB, ']');
                  var SRC_ALPHA = scope.def(BLEND_FUNCS, '[', read('src', 'Alpha'), ']');
                  var DST_RGB = scope.def(BLEND_FUNCS, '[', dstRGB, ']');
                  var DST_ALPHA = scope.def(BLEND_FUNCS, '[', read('dst', 'Alpha'), ']');

                  return [SRC_RGB, DST_RGB, SRC_ALPHA, DST_ALPHA]
                })

            case S_BLEND_EQUATION:
              return parseParam(
                function (value) {
                  if (typeof value === 'string') {
                    check$1.commandParameter(value, blendEquations, 'invalid ' + prop, env.commandStr);
                    return [
                      blendEquations[value],
                      blendEquations[value]
                    ]
                  } else if (typeof value === 'object') {
                    check$1.commandParameter(
                      value.rgb, blendEquations, prop + '.rgb', env.commandStr);
                    check$1.commandParameter(
                      value.alpha, blendEquations, prop + '.alpha', env.commandStr);
                    return [
                      blendEquations[value.rgb],
                      blendEquations[value.alpha]
                    ]
                  } else {
                    check$1.commandRaise('invalid blend.equation', env.commandStr);
                  }
                },
                function (env, scope, value) {
                  var BLEND_EQUATIONS = env.constants.blendEquations;

                  var RGB = scope.def();
                  var ALPHA = scope.def();

                  var ifte = env.cond('typeof ', value, '==="string"');

                  check$1.optional(function () {
                    function checkProp (block, name, value) {
                      env.assert(block,
                        value + ' in ' + BLEND_EQUATIONS,
                        'invalid ' + name + ', must be one of ' + Object.keys(blendEquations));
                    }
                    checkProp(ifte.then, prop, value);

                    env.assert(ifte.else,
                      value + '&&typeof ' + value + '==="object"',
                      'invalid ' + prop);
                    checkProp(ifte.else, prop + '.rgb', value + '.rgb');
                    checkProp(ifte.else, prop + '.alpha', value + '.alpha');
                  });

                  ifte.then(
                    RGB, '=', ALPHA, '=', BLEND_EQUATIONS, '[', value, '];');
                  ifte.else(
                    RGB, '=', BLEND_EQUATIONS, '[', value, '.rgb];',
                    ALPHA, '=', BLEND_EQUATIONS, '[', value, '.alpha];');

                  scope(ifte);

                  return [RGB, ALPHA]
                })

            case S_BLEND_COLOR:
              return parseParam(
                function (value) {
                  check$1.command(
                    isArrayLike(value) &&
                    value.length === 4,
                    'blend.color must be a 4d array', env.commandStr);
                  return loop(4, function (i) {
                    return +value[i]
                  })
                },
                function (env, scope, value) {
                  check$1.optional(function () {
                    env.assert(scope,
                      env.shared.isArrayLike + '(' + value + ')&&' +
                      value + '.length===4',
                      'blend.color must be a 4d array');
                  });
                  return loop(4, function (i) {
                    return scope.def('+', value, '[', i, ']')
                  })
                })

            case S_STENCIL_MASK:
              return parseParam(
                function (value) {
                  check$1.commandType(value, 'number', param, env.commandStr);
                  return value | 0
                },
                function (env, scope, value) {
                  check$1.optional(function () {
                    env.assert(scope,
                      'typeof ' + value + '==="number"',
                      'invalid stencil.mask');
                  });
                  return scope.def(value, '|0')
                })

            case S_STENCIL_FUNC:
              return parseParam(
                function (value) {
                  check$1.commandType(value, 'object', param, env.commandStr);
                  var cmp = value.cmp || 'keep';
                  var ref = value.ref || 0;
                  var mask = 'mask' in value ? value.mask : -1;
                  check$1.commandParameter(cmp, compareFuncs, prop + '.cmp', env.commandStr);
                  check$1.commandType(ref, 'number', prop + '.ref', env.commandStr);
                  check$1.commandType(mask, 'number', prop + '.mask', env.commandStr);
                  return [
                    compareFuncs[cmp],
                    ref,
                    mask
                  ]
                },
                function (env, scope, value) {
                  var COMPARE_FUNCS = env.constants.compareFuncs;
                  check$1.optional(function () {
                    function assert () {
                      env.assert(scope,
                        Array.prototype.join.call(arguments, ''),
                        'invalid stencil.func');
                    }
                    assert(value + '&&typeof ', value, '==="object"');
                    assert('!("cmp" in ', value, ')||(',
                      value, '.cmp in ', COMPARE_FUNCS, ')');
                  });
                  var cmp = scope.def(
                    '"cmp" in ', value,
                    '?', COMPARE_FUNCS, '[', value, '.cmp]',
                    ':', GL_KEEP);
                  var ref = scope.def(value, '.ref|0');
                  var mask = scope.def(
                    '"mask" in ', value,
                    '?', value, '.mask|0:-1');
                  return [cmp, ref, mask]
                })

            case S_STENCIL_OPFRONT:
            case S_STENCIL_OPBACK:
              return parseParam(
                function (value) {
                  check$1.commandType(value, 'object', param, env.commandStr);
                  var fail = value.fail || 'keep';
                  var zfail = value.zfail || 'keep';
                  var zpass = value.zpass || 'keep';
                  check$1.commandParameter(fail, stencilOps, prop + '.fail', env.commandStr);
                  check$1.commandParameter(zfail, stencilOps, prop + '.zfail', env.commandStr);
                  check$1.commandParameter(zpass, stencilOps, prop + '.zpass', env.commandStr);
                  return [
                    prop === S_STENCIL_OPBACK ? GL_BACK : GL_FRONT,
                    stencilOps[fail],
                    stencilOps[zfail],
                    stencilOps[zpass]
                  ]
                },
                function (env, scope, value) {
                  var STENCIL_OPS = env.constants.stencilOps;

                  check$1.optional(function () {
                    env.assert(scope,
                      value + '&&typeof ' + value + '==="object"',
                      'invalid ' + prop);
                  });

                  function read (name) {
                    check$1.optional(function () {
                      env.assert(scope,
                        '!("' + name + '" in ' + value + ')||' +
                        '(' + value + '.' + name + ' in ' + STENCIL_OPS + ')',
                        'invalid ' + prop + '.' + name + ', must be one of ' + Object.keys(stencilOps));
                    });

                    return scope.def(
                      '"', name, '" in ', value,
                      '?', STENCIL_OPS, '[', value, '.', name, ']:',
                      GL_KEEP)
                  }

                  return [
                    prop === S_STENCIL_OPBACK ? GL_BACK : GL_FRONT,
                    read('fail'),
                    read('zfail'),
                    read('zpass')
                  ]
                })

            case S_POLYGON_OFFSET_OFFSET:
              return parseParam(
                function (value) {
                  check$1.commandType(value, 'object', param, env.commandStr);
                  var factor = value.factor | 0;
                  var units = value.units | 0;
                  check$1.commandType(factor, 'number', param + '.factor', env.commandStr);
                  check$1.commandType(units, 'number', param + '.units', env.commandStr);
                  return [factor, units]
                },
                function (env, scope, value) {
                  check$1.optional(function () {
                    env.assert(scope,
                      value + '&&typeof ' + value + '==="object"',
                      'invalid ' + prop);
                  });

                  var FACTOR = scope.def(value, '.factor|0');
                  var UNITS = scope.def(value, '.units|0');

                  return [FACTOR, UNITS]
                })

            case S_CULL_FACE:
              return parseParam(
                function (value) {
                  var face = 0;
                  if (value === 'front') {
                    face = GL_FRONT;
                  } else if (value === 'back') {
                    face = GL_BACK;
                  }
                  check$1.command(!!face, param, env.commandStr);
                  return face
                },
                function (env, scope, value) {
                  check$1.optional(function () {
                    env.assert(scope,
                      value + '==="front"||' +
                      value + '==="back"',
                      'invalid cull.face');
                  });
                  return scope.def(value, '==="front"?', GL_FRONT, ':', GL_BACK)
                })

            case S_LINE_WIDTH:
              return parseParam(
                function (value) {
                  check$1.command(
                    typeof value === 'number' &&
                    value >= limits.lineWidthDims[0] &&
                    value <= limits.lineWidthDims[1],
                    'invalid line width, must be a positive number between ' +
                    limits.lineWidthDims[0] + ' and ' + limits.lineWidthDims[1], env.commandStr);
                  return value
                },
                function (env, scope, value) {
                  check$1.optional(function () {
                    env.assert(scope,
                      'typeof ' + value + '==="number"&&' +
                      value + '>=' + limits.lineWidthDims[0] + '&&' +
                      value + '<=' + limits.lineWidthDims[1],
                      'invalid line width');
                  });

                  return value
                })

            case S_FRONT_FACE:
              return parseParam(
                function (value) {
                  check$1.commandParameter(value, orientationType, param, env.commandStr);
                  return orientationType[value]
                },
                function (env, scope, value) {
                  check$1.optional(function () {
                    env.assert(scope,
                      value + '==="cw"||' +
                      value + '==="ccw"',
                      'invalid frontFace, must be one of cw,ccw');
                  });
                  return scope.def(value + '==="cw"?' + GL_CW + ':' + GL_CCW)
                })

            case S_COLOR_MASK:
              return parseParam(
                function (value) {
                  check$1.command(
                    isArrayLike(value) && value.length === 4,
                    'color.mask must be length 4 array', env.commandStr);
                  return value.map(function (v) { return !!v })
                },
                function (env, scope, value) {
                  check$1.optional(function () {
                    env.assert(scope,
                      env.shared.isArrayLike + '(' + value + ')&&' +
                      value + '.length===4',
                      'invalid color.mask');
                  });
                  return loop(4, function (i) {
                    return '!!' + value + '[' + i + ']'
                  })
                })

            case S_SAMPLE_COVERAGE:
              return parseParam(
                function (value) {
                  check$1.command(typeof value === 'object' && value, param, env.commandStr);
                  var sampleValue = 'value' in value ? value.value : 1;
                  var sampleInvert = !!value.invert;
                  check$1.command(
                    typeof sampleValue === 'number' &&
                    sampleValue >= 0 && sampleValue <= 1,
                    'sample.coverage.value must be a number between 0 and 1', env.commandStr);
                  return [sampleValue, sampleInvert]
                },
                function (env, scope, value) {
                  check$1.optional(function () {
                    env.assert(scope,
                      value + '&&typeof ' + value + '==="object"',
                      'invalid sample.coverage');
                  });
                  var VALUE = scope.def(
                    '"value" in ', value, '?+', value, '.value:1');
                  var INVERT = scope.def('!!', value, '.invert');
                  return [VALUE, INVERT]
                })
          }
        });

        return STATE
      }

      function parseUniforms (uniforms, env) {
        var staticUniforms = uniforms.static;
        var dynamicUniforms = uniforms.dynamic;

        var UNIFORMS = {};

        Object.keys(staticUniforms).forEach(function (name) {
          var value = staticUniforms[name];
          var result;
          if (typeof value === 'number' ||
              typeof value === 'boolean') {
            result = createStaticDecl(function () {
              return value
            });
          } else if (typeof value === 'function') {
            var reglType = value._reglType;
            if (reglType === 'texture2d' ||
                reglType === 'textureCube') {
              result = createStaticDecl(function (env) {
                return env.link(value)
              });
            } else if (reglType === 'framebuffer' ||
                       reglType === 'framebufferCube') {
              check$1.command(value.color.length > 0,
                'missing color attachment for framebuffer sent to uniform "' + name + '"', env.commandStr);
              result = createStaticDecl(function (env) {
                return env.link(value.color[0])
              });
            } else {
              check$1.commandRaise('invalid data for uniform "' + name + '"', env.commandStr);
            }
          } else if (isArrayLike(value)) {
            result = createStaticDecl(function (env) {
              var ITEM = env.global.def('[',
                loop(value.length, function (i) {
                  check$1.command(
                    typeof value[i] === 'number' ||
                    typeof value[i] === 'boolean',
                    'invalid uniform ' + name, env.commandStr);
                  return value[i]
                }), ']');
              return ITEM
            });
          } else {
            check$1.commandRaise('invalid or missing data for uniform "' + name + '"', env.commandStr);
          }
          result.value = value;
          UNIFORMS[name] = result;
        });

        Object.keys(dynamicUniforms).forEach(function (key) {
          var dyn = dynamicUniforms[key];
          UNIFORMS[key] = createDynamicDecl(dyn, function (env, scope) {
            return env.invoke(scope, dyn)
          });
        });

        return UNIFORMS
      }

      function parseAttributes (attributes, env) {
        var staticAttributes = attributes.static;
        var dynamicAttributes = attributes.dynamic;

        var attributeDefs = {};

        Object.keys(staticAttributes).forEach(function (attribute) {
          var value = staticAttributes[attribute];
          var id = stringStore.id(attribute);

          var record = new AttributeRecord();
          if (isBufferArgs(value)) {
            record.state = ATTRIB_STATE_POINTER;
            record.buffer = bufferState.getBuffer(
              bufferState.create(value, GL_ARRAY_BUFFER$2, false, true));
            record.type = 0;
          } else {
            var buffer = bufferState.getBuffer(value);
            if (buffer) {
              record.state = ATTRIB_STATE_POINTER;
              record.buffer = buffer;
              record.type = 0;
            } else {
              check$1.command(typeof value === 'object' && value,
                'invalid data for attribute ' + attribute, env.commandStr);
              if ('constant' in value) {
                var constant = value.constant;
                record.buffer = 'null';
                record.state = ATTRIB_STATE_CONSTANT;
                if (typeof constant === 'number') {
                  record.x = constant;
                } else {
                  check$1.command(
                    isArrayLike(constant) &&
                    constant.length > 0 &&
                    constant.length <= 4,
                    'invalid constant for attribute ' + attribute, env.commandStr);
                  CUTE_COMPONENTS.forEach(function (c, i) {
                    if (i < constant.length) {
                      record[c] = constant[i];
                    }
                  });
                }
              } else {
                if (isBufferArgs(value.buffer)) {
                  buffer = bufferState.getBuffer(
                    bufferState.create(value.buffer, GL_ARRAY_BUFFER$2, false, true));
                } else {
                  buffer = bufferState.getBuffer(value.buffer);
                }
                check$1.command(!!buffer, 'missing buffer for attribute "' + attribute + '"', env.commandStr);

                var offset = value.offset | 0;
                check$1.command(offset >= 0,
                  'invalid offset for attribute "' + attribute + '"', env.commandStr);

                var stride = value.stride | 0;
                check$1.command(stride >= 0 && stride < 256,
                  'invalid stride for attribute "' + attribute + '", must be integer betweeen [0, 255]', env.commandStr);

                var size = value.size | 0;
                check$1.command(!('size' in value) || (size > 0 && size <= 4),
                  'invalid size for attribute "' + attribute + '", must be 1,2,3,4', env.commandStr);

                var normalized = !!value.normalized;

                var type = 0;
                if ('type' in value) {
                  check$1.commandParameter(
                    value.type, glTypes,
                    'invalid type for attribute ' + attribute, env.commandStr);
                  type = glTypes[value.type];
                }

                var divisor = value.divisor | 0;
                check$1.optional(function () {
                  if ('divisor' in value) {
                    check$1.command(divisor === 0 || extInstancing,
                      'cannot specify divisor for attribute "' + attribute + '", instancing not supported', env.commandStr);
                    check$1.command(divisor >= 0,
                      'invalid divisor for attribute "' + attribute + '"', env.commandStr);
                  }

                  var command = env.commandStr;

                  var VALID_KEYS = [
                    'buffer',
                    'offset',
                    'divisor',
                    'normalized',
                    'type',
                    'size',
                    'stride'
                  ];

                  Object.keys(value).forEach(function (prop) {
                    check$1.command(
                      VALID_KEYS.indexOf(prop) >= 0,
                      'unknown parameter "' + prop + '" for attribute pointer "' + attribute + '" (valid parameters are ' + VALID_KEYS + ')',
                      command);
                  });
                });

                record.buffer = buffer;
                record.state = ATTRIB_STATE_POINTER;
                record.size = size;
                record.normalized = normalized;
                record.type = type || buffer.dtype;
                record.offset = offset;
                record.stride = stride;
                record.divisor = divisor;
              }
            }
          }

          attributeDefs[attribute] = createStaticDecl(function (env, scope) {
            var cache = env.attribCache;
            if (id in cache) {
              return cache[id]
            }
            var result = {
              isStream: false
            };
            Object.keys(record).forEach(function (key) {
              result[key] = record[key];
            });
            if (record.buffer) {
              result.buffer = env.link(record.buffer);
              result.type = result.type || (result.buffer + '.dtype');
            }
            cache[id] = result;
            return result
          });
        });

        Object.keys(dynamicAttributes).forEach(function (attribute) {
          var dyn = dynamicAttributes[attribute];

          function appendAttributeCode (env, block) {
            var VALUE = env.invoke(block, dyn);

            var shared = env.shared;
            var constants = env.constants;

            var IS_BUFFER_ARGS = shared.isBufferArgs;
            var BUFFER_STATE = shared.buffer;

            // Perform validation on attribute
            check$1.optional(function () {
              env.assert(block,
                VALUE + '&&(typeof ' + VALUE + '==="object"||typeof ' +
                VALUE + '==="function")&&(' +
                IS_BUFFER_ARGS + '(' + VALUE + ')||' +
                BUFFER_STATE + '.getBuffer(' + VALUE + ')||' +
                BUFFER_STATE + '.getBuffer(' + VALUE + '.buffer)||' +
                IS_BUFFER_ARGS + '(' + VALUE + '.buffer)||' +
                '("constant" in ' + VALUE +
                '&&(typeof ' + VALUE + '.constant==="number"||' +
                shared.isArrayLike + '(' + VALUE + '.constant))))',
                'invalid dynamic attribute "' + attribute + '"');
            });

            // allocate names for result
            var result = {
              isStream: block.def(false)
            };
            var defaultRecord = new AttributeRecord();
            defaultRecord.state = ATTRIB_STATE_POINTER;
            Object.keys(defaultRecord).forEach(function (key) {
              result[key] = block.def('' + defaultRecord[key]);
            });

            var BUFFER = result.buffer;
            var TYPE = result.type;
            block(
              'if(', IS_BUFFER_ARGS, '(', VALUE, ')){',
              result.isStream, '=true;',
              BUFFER, '=', BUFFER_STATE, '.createStream(', GL_ARRAY_BUFFER$2, ',', VALUE, ');',
              TYPE, '=', BUFFER, '.dtype;',
              '}else{',
              BUFFER, '=', BUFFER_STATE, '.getBuffer(', VALUE, ');',
              'if(', BUFFER, '){',
              TYPE, '=', BUFFER, '.dtype;',
              '}else if("constant" in ', VALUE, '){',
              result.state, '=', ATTRIB_STATE_CONSTANT, ';',
              'if(typeof ' + VALUE + '.constant === "number"){',
              result[CUTE_COMPONENTS[0]], '=', VALUE, '.constant;',
              CUTE_COMPONENTS.slice(1).map(function (n) {
                return result[n]
              }).join('='), '=0;',
              '}else{',
              CUTE_COMPONENTS.map(function (name, i) {
                return (
                  result[name] + '=' + VALUE + '.constant.length>' + i +
                  '?' + VALUE + '.constant[' + i + ']:0;'
                )
              }).join(''),
              '}}else{',
              'if(', IS_BUFFER_ARGS, '(', VALUE, '.buffer)){',
              BUFFER, '=', BUFFER_STATE, '.createStream(', GL_ARRAY_BUFFER$2, ',', VALUE, '.buffer);',
              '}else{',
              BUFFER, '=', BUFFER_STATE, '.getBuffer(', VALUE, '.buffer);',
              '}',
              TYPE, '="type" in ', VALUE, '?',
              constants.glTypes, '[', VALUE, '.type]:', BUFFER, '.dtype;',
              result.normalized, '=!!', VALUE, '.normalized;');
            function emitReadRecord (name) {
              block(result[name], '=', VALUE, '.', name, '|0;');
            }
            emitReadRecord('size');
            emitReadRecord('offset');
            emitReadRecord('stride');
            emitReadRecord('divisor');

            block('}}');

            block.exit(
              'if(', result.isStream, '){',
              BUFFER_STATE, '.destroyStream(', BUFFER, ');',
              '}');

            return result
          }

          attributeDefs[attribute] = createDynamicDecl(dyn, appendAttributeCode);
        });

        return attributeDefs
      }

      function parseContext (context) {
        var staticContext = context.static;
        var dynamicContext = context.dynamic;
        var result = {};

        Object.keys(staticContext).forEach(function (name) {
          var value = staticContext[name];
          result[name] = createStaticDecl(function (env, scope) {
            if (typeof value === 'number' || typeof value === 'boolean') {
              return '' + value
            } else {
              return env.link(value)
            }
          });
        });

        Object.keys(dynamicContext).forEach(function (name) {
          var dyn = dynamicContext[name];
          result[name] = createDynamicDecl(dyn, function (env, scope) {
            return env.invoke(scope, dyn)
          });
        });

        return result
      }

      function parseArguments (options, attributes, uniforms, context, env) {
        var staticOptions = options.static;
        var dynamicOptions = options.dynamic;

        check$1.optional(function () {
          var KEY_NAMES = [
            S_FRAMEBUFFER,
            S_VERT,
            S_FRAG,
            S_ELEMENTS,
            S_PRIMITIVE,
            S_OFFSET,
            S_COUNT,
            S_INSTANCES,
            S_PROFILE,
            S_VAO
          ].concat(GL_STATE_NAMES);

          function checkKeys (dict) {
            Object.keys(dict).forEach(function (key) {
              check$1.command(
                KEY_NAMES.indexOf(key) >= 0,
                'unknown parameter "' + key + '"',
                env.commandStr);
            });
          }

          checkKeys(staticOptions);
          checkKeys(dynamicOptions);
        });

        var attribLocations = parseAttribLocations(options, attributes);

        var framebuffer = parseFramebuffer(options);
        var viewportAndScissor = parseViewportScissor(options, framebuffer, env);
        var draw = parseDraw(options, env);
        var state = parseGLState(options, env);
        var shader = parseProgram(options, env, attribLocations);

        function copyBox (name) {
          var defn = viewportAndScissor[name];
          if (defn) {
            state[name] = defn;
          }
        }
        copyBox(S_VIEWPORT);
        copyBox(propName(S_SCISSOR_BOX));

        var dirty = Object.keys(state).length > 0;

        var result = {
          framebuffer: framebuffer,
          draw: draw,
          shader: shader,
          state: state,
          dirty: dirty,
          scopeVAO: null,
          drawVAO: null,
          useVAO: false,
          attributes: {}
        };

        result.profile = parseProfile(options);
        result.uniforms = parseUniforms(uniforms, env);
        result.drawVAO = result.scopeVAO = draw.vao;
        // special case: check if we can statically allocate a vertex array object for this program
        if (!result.drawVAO &&
          shader.program &&
          !attribLocations &&
          extensions.angle_instanced_arrays &&
          draw.static.elements) {
          var useVAO = true;
          var staticBindings = shader.program.attributes.map(function (attr) {
            var binding = attributes.static[attr];
            useVAO = useVAO && !!binding;
            return binding
          });
          if (useVAO && staticBindings.length > 0) {
            var vao = attributeState.getVAO(attributeState.createVAO({
              attributes: staticBindings,
              elements: draw.static.elements
            }));
            result.drawVAO = new Declaration(null, null, null, function (env, scope) {
              return env.link(vao)
            });
            result.useVAO = true;
          }
        }
        if (attribLocations) {
          result.useVAO = true;
        } else {
          result.attributes = parseAttributes(attributes, env);
        }
        result.context = parseContext(context);
        return result
      }

      // ===================================================
      // ===================================================
      // COMMON UPDATE FUNCTIONS
      // ===================================================
      // ===================================================
      function emitContext (env, scope, context) {
        var shared = env.shared;
        var CONTEXT = shared.context;

        var contextEnter = env.scope();

        Object.keys(context).forEach(function (name) {
          scope.save(CONTEXT, '.' + name);
          var defn = context[name];
          var value = defn.append(env, scope);
          if (Array.isArray(value)) {
            contextEnter(CONTEXT, '.', name, '=[', value.join(), '];');
          } else {
            contextEnter(CONTEXT, '.', name, '=', value, ';');
          }
        });

        scope(contextEnter);
      }

      // ===================================================
      // ===================================================
      // COMMON DRAWING FUNCTIONS
      // ===================================================
      // ===================================================
      function emitPollFramebuffer (env, scope, framebuffer, skipCheck) {
        var shared = env.shared;

        var GL = shared.gl;
        var FRAMEBUFFER_STATE = shared.framebuffer;
        var EXT_DRAW_BUFFERS;
        if (extDrawBuffers) {
          EXT_DRAW_BUFFERS = scope.def(shared.extensions, '.webgl_draw_buffers');
        }

        var constants = env.constants;

        var DRAW_BUFFERS = constants.drawBuffer;
        var BACK_BUFFER = constants.backBuffer;

        var NEXT;
        if (framebuffer) {
          NEXT = framebuffer.append(env, scope);
        } else {
          NEXT = scope.def(FRAMEBUFFER_STATE, '.next');
        }

        if (!skipCheck) {
          scope('if(', NEXT, '!==', FRAMEBUFFER_STATE, '.cur){');
        }
        scope(
          'if(', NEXT, '){',
          GL, '.bindFramebuffer(', GL_FRAMEBUFFER$2, ',', NEXT, '.framebuffer);');
        if (extDrawBuffers) {
          scope(EXT_DRAW_BUFFERS, '.drawBuffersWEBGL(',
            DRAW_BUFFERS, '[', NEXT, '.colorAttachments.length]);');
        }
        scope('}else{',
          GL, '.bindFramebuffer(', GL_FRAMEBUFFER$2, ',null);');
        if (extDrawBuffers) {
          scope(EXT_DRAW_BUFFERS, '.drawBuffersWEBGL(', BACK_BUFFER, ');');
        }
        scope(
          '}',
          FRAMEBUFFER_STATE, '.cur=', NEXT, ';');
        if (!skipCheck) {
          scope('}');
        }
      }

      function emitPollState (env, scope, args) {
        var shared = env.shared;

        var GL = shared.gl;

        var CURRENT_VARS = env.current;
        var NEXT_VARS = env.next;
        var CURRENT_STATE = shared.current;
        var NEXT_STATE = shared.next;

        var block = env.cond(CURRENT_STATE, '.dirty');

        GL_STATE_NAMES.forEach(function (prop) {
          var param = propName(prop);
          if (param in args.state) {
            return
          }

          var NEXT, CURRENT;
          if (param in NEXT_VARS) {
            NEXT = NEXT_VARS[param];
            CURRENT = CURRENT_VARS[param];
            var parts = loop(currentState[param].length, function (i) {
              return block.def(NEXT, '[', i, ']')
            });
            block(env.cond(parts.map(function (p, i) {
              return p + '!==' + CURRENT + '[' + i + ']'
            }).join('||'))
              .then(
                GL, '.', GL_VARIABLES[param], '(', parts, ');',
                parts.map(function (p, i) {
                  return CURRENT + '[' + i + ']=' + p
                }).join(';'), ';'));
          } else {
            NEXT = block.def(NEXT_STATE, '.', param);
            var ifte = env.cond(NEXT, '!==', CURRENT_STATE, '.', param);
            block(ifte);
            if (param in GL_FLAGS) {
              ifte(
                env.cond(NEXT)
                  .then(GL, '.enable(', GL_FLAGS[param], ');')
                  .else(GL, '.disable(', GL_FLAGS[param], ');'),
                CURRENT_STATE, '.', param, '=', NEXT, ';');
            } else {
              ifte(
                GL, '.', GL_VARIABLES[param], '(', NEXT, ');',
                CURRENT_STATE, '.', param, '=', NEXT, ';');
            }
          }
        });
        if (Object.keys(args.state).length === 0) {
          block(CURRENT_STATE, '.dirty=false;');
        }
        scope(block);
      }

      function emitSetOptions (env, scope, options, filter) {
        var shared = env.shared;
        var CURRENT_VARS = env.current;
        var CURRENT_STATE = shared.current;
        var GL = shared.gl;
        sortState(Object.keys(options)).forEach(function (param) {
          var defn = options[param];
          if (filter && !filter(defn)) {
            return
          }
          var variable = defn.append(env, scope);
          if (GL_FLAGS[param]) {
            var flag = GL_FLAGS[param];
            if (isStatic(defn)) {
              if (variable) {
                scope(GL, '.enable(', flag, ');');
              } else {
                scope(GL, '.disable(', flag, ');');
              }
            } else {
              scope(env.cond(variable)
                .then(GL, '.enable(', flag, ');')
                .else(GL, '.disable(', flag, ');'));
            }
            scope(CURRENT_STATE, '.', param, '=', variable, ';');
          } else if (isArrayLike(variable)) {
            var CURRENT = CURRENT_VARS[param];
            scope(
              GL, '.', GL_VARIABLES[param], '(', variable, ');',
              variable.map(function (v, i) {
                return CURRENT + '[' + i + ']=' + v
              }).join(';'), ';');
          } else {
            scope(
              GL, '.', GL_VARIABLES[param], '(', variable, ');',
              CURRENT_STATE, '.', param, '=', variable, ';');
          }
        });
      }

      function injectExtensions (env, scope) {
        if (extInstancing) {
          env.instancing = scope.def(
            env.shared.extensions, '.angle_instanced_arrays');
        }
      }

      function emitProfile (env, scope, args, useScope, incrementCounter) {
        var shared = env.shared;
        var STATS = env.stats;
        var CURRENT_STATE = shared.current;
        var TIMER = shared.timer;
        var profileArg = args.profile;

        function perfCounter () {
          if (typeof performance === 'undefined') {
            return 'Date.now()'
          } else {
            return 'performance.now()'
          }
        }

        var CPU_START, QUERY_COUNTER;
        function emitProfileStart (block) {
          CPU_START = scope.def();
          block(CPU_START, '=', perfCounter(), ';');
          if (typeof incrementCounter === 'string') {
            block(STATS, '.count+=', incrementCounter, ';');
          } else {
            block(STATS, '.count++;');
          }
          if (timer) {
            if (useScope) {
              QUERY_COUNTER = scope.def();
              block(QUERY_COUNTER, '=', TIMER, '.getNumPendingQueries();');
            } else {
              block(TIMER, '.beginQuery(', STATS, ');');
            }
          }
        }

        function emitProfileEnd (block) {
          block(STATS, '.cpuTime+=', perfCounter(), '-', CPU_START, ';');
          if (timer) {
            if (useScope) {
              block(TIMER, '.pushScopeStats(',
                QUERY_COUNTER, ',',
                TIMER, '.getNumPendingQueries(),',
                STATS, ');');
            } else {
              block(TIMER, '.endQuery();');
            }
          }
        }

        function scopeProfile (value) {
          var prev = scope.def(CURRENT_STATE, '.profile');
          scope(CURRENT_STATE, '.profile=', value, ';');
          scope.exit(CURRENT_STATE, '.profile=', prev, ';');
        }

        var USE_PROFILE;
        if (profileArg) {
          if (isStatic(profileArg)) {
            if (profileArg.enable) {
              emitProfileStart(scope);
              emitProfileEnd(scope.exit);
              scopeProfile('true');
            } else {
              scopeProfile('false');
            }
            return
          }
          USE_PROFILE = profileArg.append(env, scope);
          scopeProfile(USE_PROFILE);
        } else {
          USE_PROFILE = scope.def(CURRENT_STATE, '.profile');
        }

        var start = env.block();
        emitProfileStart(start);
        scope('if(', USE_PROFILE, '){', start, '}');
        var end = env.block();
        emitProfileEnd(end);
        scope.exit('if(', USE_PROFILE, '){', end, '}');
      }

      function emitAttributes (env, scope, args, attributes, filter) {
        var shared = env.shared;

        function typeLength (x) {
          switch (x) {
            case GL_FLOAT_VEC2:
            case GL_INT_VEC2:
            case GL_BOOL_VEC2:
              return 2
            case GL_FLOAT_VEC3:
            case GL_INT_VEC3:
            case GL_BOOL_VEC3:
              return 3
            case GL_FLOAT_VEC4:
            case GL_INT_VEC4:
            case GL_BOOL_VEC4:
              return 4
            default:
              return 1
          }
        }

        function emitBindAttribute (ATTRIBUTE, size, record) {
          var GL = shared.gl;

          var LOCATION = scope.def(ATTRIBUTE, '.location');
          var BINDING = scope.def(shared.attributes, '[', LOCATION, ']');

          var STATE = record.state;
          var BUFFER = record.buffer;
          var CONST_COMPONENTS = [
            record.x,
            record.y,
            record.z,
            record.w
          ];

          var COMMON_KEYS = [
            'buffer',
            'normalized',
            'offset',
            'stride'
          ];

          function emitBuffer () {
            scope(
              'if(!', BINDING, '.buffer){',
              GL, '.enableVertexAttribArray(', LOCATION, ');}');

            var TYPE = record.type;
            var SIZE;
            if (!record.size) {
              SIZE = size;
            } else {
              SIZE = scope.def(record.size, '||', size);
            }

            scope('if(',
              BINDING, '.type!==', TYPE, '||',
              BINDING, '.size!==', SIZE, '||',
              COMMON_KEYS.map(function (key) {
                return BINDING + '.' + key + '!==' + record[key]
              }).join('||'),
              '){',
              GL, '.bindBuffer(', GL_ARRAY_BUFFER$2, ',', BUFFER, '.buffer);',
              GL, '.vertexAttribPointer(', [
                LOCATION,
                SIZE,
                TYPE,
                record.normalized,
                record.stride,
                record.offset
              ], ');',
              BINDING, '.type=', TYPE, ';',
              BINDING, '.size=', SIZE, ';',
              COMMON_KEYS.map(function (key) {
                return BINDING + '.' + key + '=' + record[key] + ';'
              }).join(''),
              '}');

            if (extInstancing) {
              var DIVISOR = record.divisor;
              scope(
                'if(', BINDING, '.divisor!==', DIVISOR, '){',
                env.instancing, '.vertexAttribDivisorANGLE(', [LOCATION, DIVISOR], ');',
                BINDING, '.divisor=', DIVISOR, ';}');
            }
          }

          function emitConstant () {
            scope(
              'if(', BINDING, '.buffer){',
              GL, '.disableVertexAttribArray(', LOCATION, ');',
              BINDING, '.buffer=null;',
              '}if(', CUTE_COMPONENTS.map(function (c, i) {
                return BINDING + '.' + c + '!==' + CONST_COMPONENTS[i]
              }).join('||'), '){',
              GL, '.vertexAttrib4f(', LOCATION, ',', CONST_COMPONENTS, ');',
              CUTE_COMPONENTS.map(function (c, i) {
                return BINDING + '.' + c + '=' + CONST_COMPONENTS[i] + ';'
              }).join(''),
              '}');
          }

          if (STATE === ATTRIB_STATE_POINTER) {
            emitBuffer();
          } else if (STATE === ATTRIB_STATE_CONSTANT) {
            emitConstant();
          } else {
            scope('if(', STATE, '===', ATTRIB_STATE_POINTER, '){');
            emitBuffer();
            scope('}else{');
            emitConstant();
            scope('}');
          }
        }

        attributes.forEach(function (attribute) {
          var name = attribute.name;
          var arg = args.attributes[name];
          var record;
          if (arg) {
            if (!filter(arg)) {
              return
            }
            record = arg.append(env, scope);
          } else {
            if (!filter(SCOPE_DECL)) {
              return
            }
            var scopeAttrib = env.scopeAttrib(name);
            check$1.optional(function () {
              env.assert(scope,
                scopeAttrib + '.state',
                'missing attribute ' + name);
            });
            record = {};
            Object.keys(new AttributeRecord()).forEach(function (key) {
              record[key] = scope.def(scopeAttrib, '.', key);
            });
          }
          emitBindAttribute(
            env.link(attribute), typeLength(attribute.info.type), record);
        });
      }

      function emitUniforms (env, scope, args, uniforms, filter, isBatchInnerLoop) {
        var shared = env.shared;
        var GL = shared.gl;

        var definedArrUniforms = {};
        var infix;
        for (var i = 0; i < uniforms.length; ++i) {
          var uniform = uniforms[i];
          var name = uniform.name;
          var type = uniform.info.type;
          var size = uniform.info.size;
          var arg = args.uniforms[name];
          if (size > 1) {
            // either foo[n] or foos, avoid define both
            if (!arg) {
              continue
            }
            var arrUniformName = name.replace('[0]', '');
            if (definedArrUniforms[arrUniformName]) {
              continue
            }
            definedArrUniforms[arrUniformName] = 1;
          }
          var UNIFORM = env.link(uniform);
          var LOCATION = UNIFORM + '.location';

          var VALUE;
          if (arg) {
            if (!filter(arg)) {
              continue
            }
            if (isStatic(arg)) {
              var value = arg.value;
              check$1.command(
                value !== null && typeof value !== 'undefined',
                'missing uniform "' + name + '"', env.commandStr);
              if (type === GL_SAMPLER_2D || type === GL_SAMPLER_CUBE) {
                check$1.command(
                  typeof value === 'function' &&
                  ((type === GL_SAMPLER_2D &&
                    (value._reglType === 'texture2d' ||
                    value._reglType === 'framebuffer')) ||
                  (type === GL_SAMPLER_CUBE &&
                    (value._reglType === 'textureCube' ||
                    value._reglType === 'framebufferCube'))),
                  'invalid texture for uniform ' + name, env.commandStr);
                var TEX_VALUE = env.link(value._texture || value.color[0]._texture);
                scope(GL, '.uniform1i(', LOCATION, ',', TEX_VALUE + '.bind());');
                scope.exit(TEX_VALUE, '.unbind();');
              } else if (
                type === GL_FLOAT_MAT2 ||
                type === GL_FLOAT_MAT3 ||
                type === GL_FLOAT_MAT4) {
                check$1.optional(function () {
                  check$1.command(isArrayLike(value),
                    'invalid matrix for uniform ' + name, env.commandStr);
                  check$1.command(
                    (type === GL_FLOAT_MAT2 && value.length === 4) ||
                    (type === GL_FLOAT_MAT3 && value.length === 9) ||
                    (type === GL_FLOAT_MAT4 && value.length === 16),
                    'invalid length for matrix uniform ' + name, env.commandStr);
                });
                var MAT_VALUE = env.global.def('new Float32Array([' +
                  Array.prototype.slice.call(value) + '])');
                var dim = 2;
                if (type === GL_FLOAT_MAT3) {
                  dim = 3;
                } else if (type === GL_FLOAT_MAT4) {
                  dim = 4;
                }
                scope(
                  GL, '.uniformMatrix', dim, 'fv(',
                  LOCATION, ',false,', MAT_VALUE, ');');
              } else {
                switch (type) {
                  case GL_FLOAT$8:
                    if (size === 1) {
                      check$1.commandType(value, 'number', 'uniform ' + name, env.commandStr);
                    } else {
                      check$1.command(
                        isArrayLike(value) && (value.length === size),
                        'uniform ' + name, env.commandStr);
                    }
                    infix = '1f';
                    break
                  case GL_FLOAT_VEC2:
                    check$1.command(
                      isArrayLike(value) && (value.length && value.length % 2 === 0 && value.length <= size * 2),
                      'uniform ' + name, env.commandStr);
                    infix = '2f';
                    break
                  case GL_FLOAT_VEC3:
                    check$1.command(
                      isArrayLike(value) && (value.length && value.length % 3 === 0 && value.length <= size * 3),
                      'uniform ' + name, env.commandStr);
                    infix = '3f';
                    break
                  case GL_FLOAT_VEC4:
                    check$1.command(
                      isArrayLike(value) && (value.length && value.length % 4 === 0 && value.length <= size * 4),
                      'uniform ' + name, env.commandStr);
                    infix = '4f';
                    break
                  case GL_BOOL:
                    if (size === 1) {
                      check$1.commandType(value, 'boolean', 'uniform ' + name, env.commandStr);
                    } else {
                      check$1.command(
                        isArrayLike(value) && (value.length === size),
                        'uniform ' + name, env.commandStr);
                    }
                    infix = '1i';
                    break
                  case GL_INT$3:
                    if (size === 1) {
                      check$1.commandType(value, 'number', 'uniform ' + name, env.commandStr);
                    } else {
                      check$1.command(
                        isArrayLike(value) && (value.length === size),
                        'uniform ' + name, env.commandStr);
                    }
                    infix = '1i';
                    break
                  case GL_BOOL_VEC2:
                    check$1.command(
                      isArrayLike(value) && (value.length && value.length % 2 === 0 && value.length <= size * 2),
                      'uniform ' + name, env.commandStr);
                    infix = '2i';
                    break
                  case GL_INT_VEC2:
                    check$1.command(
                      isArrayLike(value) && (value.length && value.length % 2 === 0 && value.length <= size * 2),
                      'uniform ' + name, env.commandStr);
                    infix = '2i';
                    break
                  case GL_BOOL_VEC3:
                    check$1.command(
                      isArrayLike(value) && (value.length && value.length % 3 === 0 && value.length <= size * 3),
                      'uniform ' + name, env.commandStr);
                    infix = '3i';
                    break
                  case GL_INT_VEC3:
                    check$1.command(
                      isArrayLike(value) && (value.length && value.length % 3 === 0 && value.length <= size * 3),
                      'uniform ' + name, env.commandStr);
                    infix = '3i';
                    break
                  case GL_BOOL_VEC4:
                    check$1.command(
                      isArrayLike(value) && (value.length && value.length % 4 === 0 && value.length <= size * 4),
                      'uniform ' + name, env.commandStr);
                    infix = '4i';
                    break
                  case GL_INT_VEC4:
                    check$1.command(
                      isArrayLike(value) && (value.length && value.length % 4 === 0 && value.length <= size * 4),
                      'uniform ' + name, env.commandStr);
                    infix = '4i';
                    break
                }
                if (size > 1) {
                  infix += 'v';
                  value = env.global.def('[' +
                  Array.prototype.slice.call(value) + ']');
                } else {
                  value = isArrayLike(value) ? Array.prototype.slice.call(value) : value;
                }
                scope(GL, '.uniform', infix, '(', LOCATION, ',',
                  value,
                  ');');
              }
              continue
            } else {
              VALUE = arg.append(env, scope);
            }
          } else {
            if (!filter(SCOPE_DECL)) {
              continue
            }
            VALUE = scope.def(shared.uniforms, '[', stringStore.id(name), ']');
          }

          if (type === GL_SAMPLER_2D) {
            check$1(!Array.isArray(VALUE), 'must specify a scalar prop for textures');
            scope(
              'if(', VALUE, '&&', VALUE, '._reglType==="framebuffer"){',
              VALUE, '=', VALUE, '.color[0];',
              '}');
          } else if (type === GL_SAMPLER_CUBE) {
            check$1(!Array.isArray(VALUE), 'must specify a scalar prop for cube maps');
            scope(
              'if(', VALUE, '&&', VALUE, '._reglType==="framebufferCube"){',
              VALUE, '=', VALUE, '.color[0];',
              '}');
          }

          // perform type validation
          check$1.optional(function () {
            function emitCheck (pred, message) {
              env.assert(scope, pred,
                'bad data or missing for uniform "' + name + '".  ' + message);
            }

            function checkType (type, size) {
              if (size === 1) {
                check$1(!Array.isArray(VALUE), 'must not specify an array type for uniform');
              }
              emitCheck(
                'Array.isArray(' + VALUE + ') && typeof ' + VALUE + '[0]===" ' + type + '"' +
                ' || typeof ' + VALUE + '==="' + type + '"',
                'invalid type, expected ' + type);
            }

            function checkVector (n, type, size) {
              if (Array.isArray(VALUE)) {
                check$1(VALUE.length && VALUE.length % n === 0 && VALUE.length <= n * size, 'must have length of ' + (size === 1 ? '' : 'n * ') + n);
              } else {
                emitCheck(
                  shared.isArrayLike + '(' + VALUE + ')&&' + VALUE + '.length && ' + VALUE + '.length % ' + n + ' === 0' +
                  ' && ' + VALUE + '.length<=' + n * size,
                  'invalid vector, should have length of ' + (size === 1 ? '' : 'n * ') + n, env.commandStr);
              }
            }

            function checkTexture (target) {
              check$1(!Array.isArray(VALUE), 'must not specify a value type');
              emitCheck(
                'typeof ' + VALUE + '==="function"&&' +
                VALUE + '._reglType==="texture' +
                (target === GL_TEXTURE_2D$3 ? '2d' : 'Cube') + '"',
                'invalid texture type', env.commandStr);
            }

            switch (type) {
              case GL_INT$3:
                checkType('number', size);
                break
              case GL_INT_VEC2:
                checkVector(2, 'number', size);
                break
              case GL_INT_VEC3:
                checkVector(3, 'number', size);
                break
              case GL_INT_VEC4:
                checkVector(4, 'number', size);
                break
              case GL_FLOAT$8:
                checkType('number', size);
                break
              case GL_FLOAT_VEC2:
                checkVector(2, 'number', size);
                break
              case GL_FLOAT_VEC3:
                checkVector(3, 'number', size);
                break
              case GL_FLOAT_VEC4:
                checkVector(4, 'number', size);
                break
              case GL_BOOL:
                checkType('boolean', size);
                break
              case GL_BOOL_VEC2:
                checkVector(2, 'boolean', size);
                break
              case GL_BOOL_VEC3:
                checkVector(3, 'boolean', size);
                break
              case GL_BOOL_VEC4:
                checkVector(4, 'boolean', size);
                break
              case GL_FLOAT_MAT2:
                checkVector(4, 'number', size);
                break
              case GL_FLOAT_MAT3:
                checkVector(9, 'number', size);
                break
              case GL_FLOAT_MAT4:
                checkVector(16, 'number', size);
                break
              case GL_SAMPLER_2D:
                checkTexture(GL_TEXTURE_2D$3);
                break
              case GL_SAMPLER_CUBE:
                checkTexture(GL_TEXTURE_CUBE_MAP$2);
                break
            }
          });

          var unroll = 1;
          switch (type) {
            case GL_SAMPLER_2D:
            case GL_SAMPLER_CUBE:
              var TEX = scope.def(VALUE, '._texture');
              scope(GL, '.uniform1i(', LOCATION, ',', TEX, '.bind());');
              scope.exit(TEX, '.unbind();');
              continue

            case GL_INT$3:
            case GL_BOOL:
              infix = '1i';
              break

            case GL_INT_VEC2:
            case GL_BOOL_VEC2:
              infix = '2i';
              unroll = 2;
              break

            case GL_INT_VEC3:
            case GL_BOOL_VEC3:
              infix = '3i';
              unroll = 3;
              break

            case GL_INT_VEC4:
            case GL_BOOL_VEC4:
              infix = '4i';
              unroll = 4;
              break

            case GL_FLOAT$8:
              infix = '1f';
              break

            case GL_FLOAT_VEC2:
              infix = '2f';
              unroll = 2;
              break

            case GL_FLOAT_VEC3:
              infix = '3f';
              unroll = 3;
              break

            case GL_FLOAT_VEC4:
              infix = '4f';
              unroll = 4;
              break

            case GL_FLOAT_MAT2:
              infix = 'Matrix2fv';
              break

            case GL_FLOAT_MAT3:
              infix = 'Matrix3fv';
              break

            case GL_FLOAT_MAT4:
              infix = 'Matrix4fv';
              break
          }

          if (infix.indexOf('Matrix') === -1 && size > 1) {
            infix += 'v';
            unroll = 1;
          }

          if (infix.charAt(0) === 'M') {
            scope(GL, '.uniform', infix, '(', LOCATION, ',');
            var matSize = Math.pow(type - GL_FLOAT_MAT2 + 2, 2);
            var STORAGE = env.global.def('new Float32Array(', matSize, ')');
            if (Array.isArray(VALUE)) {
              scope(
                'false,(',
                loop(matSize, function (i) {
                  return STORAGE + '[' + i + ']=' + VALUE[i]
                }), ',', STORAGE, ')');
            } else {
              scope(
                'false,(Array.isArray(', VALUE, ')||', VALUE, ' instanceof Float32Array)?', VALUE, ':(',
                loop(matSize, function (i) {
                  return STORAGE + '[' + i + ']=' + VALUE + '[' + i + ']'
                }), ',', STORAGE, ')');
            }
            scope(');');
          } else if (unroll > 1) {
            var prev = [];
            var cur = [];
            for (var j = 0; j < unroll; ++j) {
              if (Array.isArray(VALUE)) {
                cur.push(VALUE[j]);
              } else {
                cur.push(scope.def(VALUE + '[' + j + ']'));
              }
              if (isBatchInnerLoop) {
                prev.push(scope.def());
              }
            }
            if (isBatchInnerLoop) {
              scope('if(!', env.batchId, '||', prev.map(function (p, i) {
                return p + '!==' + cur[i]
              }).join('||'), '){', prev.map(function (p, i) {
                return p + '=' + cur[i] + ';'
              }).join(''));
            }
            scope(GL, '.uniform', infix, '(', LOCATION, ',', cur.join(','), ');');
            if (isBatchInnerLoop) {
              scope('}');
            }
          } else {
            check$1(!Array.isArray(VALUE), 'uniform value must not be an array');
            if (isBatchInnerLoop) {
              var prevS = scope.def();
              scope('if(!', env.batchId, '||', prevS, '!==', VALUE, '){',
                prevS, '=', VALUE, ';');
            }
            scope(GL, '.uniform', infix, '(', LOCATION, ',', VALUE, ');');
            if (isBatchInnerLoop) {
              scope('}');
            }
          }
        }
      }

      function emitDraw (env, outer, inner, args) {
        var shared = env.shared;
        var GL = shared.gl;
        var DRAW_STATE = shared.draw;

        var drawOptions = args.draw;

        function emitElements () {
          var defn = drawOptions.elements;
          var ELEMENTS;
          var scope = outer;
          if (defn) {
            if ((defn.contextDep && args.contextDynamic) || defn.propDep) {
              scope = inner;
            }
            ELEMENTS = defn.append(env, scope);
            if (drawOptions.elementsActive) {
              scope(
                'if(' + ELEMENTS + ')' +
                GL + '.bindBuffer(' + GL_ELEMENT_ARRAY_BUFFER$2 + ',' + ELEMENTS + '.buffer.buffer);');
            }
          } else {
            ELEMENTS = scope.def();
            scope(
              ELEMENTS, '=', DRAW_STATE, '.', S_ELEMENTS, ';',
              'if(', ELEMENTS, '){',
              GL, '.bindBuffer(', GL_ELEMENT_ARRAY_BUFFER$2, ',', ELEMENTS, '.buffer.buffer);}',
              'else if(', shared.vao, '.currentVAO){',
              ELEMENTS, '=', env.shared.elements + '.getElements(' + shared.vao, '.currentVAO.elements);',
              (!extVertexArrays ? 'if(' + ELEMENTS + ')' + GL + '.bindBuffer(' + GL_ELEMENT_ARRAY_BUFFER$2 + ',' + ELEMENTS + '.buffer.buffer);' : ''),
              '}');
          }
          return ELEMENTS
        }

        function emitCount () {
          var defn = drawOptions.count;
          var COUNT;
          var scope = outer;
          if (defn) {
            if ((defn.contextDep && args.contextDynamic) || defn.propDep) {
              scope = inner;
            }
            COUNT = defn.append(env, scope);
            check$1.optional(function () {
              if (defn.MISSING) {
                env.assert(outer, 'false', 'missing vertex count');
              }
              if (defn.DYNAMIC) {
                env.assert(scope, COUNT + '>=0', 'missing vertex count');
              }
            });
          } else {
            COUNT = scope.def(DRAW_STATE, '.', S_COUNT);
            check$1.optional(function () {
              env.assert(scope, COUNT + '>=0', 'missing vertex count');
            });
          }
          return COUNT
        }

        var ELEMENTS = emitElements();
        function emitValue (name) {
          var defn = drawOptions[name];
          if (defn) {
            if ((defn.contextDep && args.contextDynamic) || defn.propDep) {
              return defn.append(env, inner)
            } else {
              return defn.append(env, outer)
            }
          } else {
            return outer.def(DRAW_STATE, '.', name)
          }
        }

        var PRIMITIVE = emitValue(S_PRIMITIVE);
        var OFFSET = emitValue(S_OFFSET);

        var COUNT = emitCount();
        if (typeof COUNT === 'number') {
          if (COUNT === 0) {
            return
          }
        } else {
          inner('if(', COUNT, '){');
          inner.exit('}');
        }

        var INSTANCES, EXT_INSTANCING;
        if (extInstancing) {
          INSTANCES = emitValue(S_INSTANCES);
          EXT_INSTANCING = env.instancing;
        }

        var ELEMENT_TYPE = ELEMENTS + '.type';

        var elementsStatic = drawOptions.elements && isStatic(drawOptions.elements) && !drawOptions.vaoActive;

        function emitInstancing () {
          function drawElements () {
            inner(EXT_INSTANCING, '.drawElementsInstancedANGLE(', [
              PRIMITIVE,
              COUNT,
              ELEMENT_TYPE,
              OFFSET + '<<((' + ELEMENT_TYPE + '-' + GL_UNSIGNED_BYTE$8 + ')>>1)',
              INSTANCES
            ], ');');
          }

          function drawArrays () {
            inner(EXT_INSTANCING, '.drawArraysInstancedANGLE(',
              [PRIMITIVE, OFFSET, COUNT, INSTANCES], ');');
          }

          if (ELEMENTS && ELEMENTS !== 'null') {
            if (!elementsStatic) {
              inner('if(', ELEMENTS, '){');
              drawElements();
              inner('}else{');
              drawArrays();
              inner('}');
            } else {
              drawElements();
            }
          } else {
            drawArrays();
          }
        }

        function emitRegular () {
          function drawElements () {
            inner(GL + '.drawElements(' + [
              PRIMITIVE,
              COUNT,
              ELEMENT_TYPE,
              OFFSET + '<<((' + ELEMENT_TYPE + '-' + GL_UNSIGNED_BYTE$8 + ')>>1)'
            ] + ');');
          }

          function drawArrays () {
            inner(GL + '.drawArrays(' + [PRIMITIVE, OFFSET, COUNT] + ');');
          }

          if (ELEMENTS && ELEMENTS !== 'null') {
            if (!elementsStatic) {
              inner('if(', ELEMENTS, '){');
              drawElements();
              inner('}else{');
              drawArrays();
              inner('}');
            } else {
              drawElements();
            }
          } else {
            drawArrays();
          }
        }

        if (extInstancing && (typeof INSTANCES !== 'number' || INSTANCES >= 0)) {
          if (typeof INSTANCES === 'string') {
            inner('if(', INSTANCES, '>0){');
            emitInstancing();
            inner('}else if(', INSTANCES, '<0){');
            emitRegular();
            inner('}');
          } else {
            emitInstancing();
          }
        } else {
          emitRegular();
        }
      }

      function createBody (emitBody, parentEnv, args, program, count) {
        var env = createREGLEnvironment();
        var scope = env.proc('body', count);
        check$1.optional(function () {
          env.commandStr = parentEnv.commandStr;
          env.command = env.link(parentEnv.commandStr);
        });
        if (extInstancing) {
          env.instancing = scope.def(
            env.shared.extensions, '.angle_instanced_arrays');
        }
        emitBody(env, scope, args, program);
        return env.compile().body
      }

      // ===================================================
      // ===================================================
      // DRAW PROC
      // ===================================================
      // ===================================================
      function emitDrawBody (env, draw, args, program) {
        injectExtensions(env, draw);
        if (args.useVAO) {
          if (args.drawVAO) {
            draw(env.shared.vao, '.setVAO(', args.drawVAO.append(env, draw), ');');
          } else {
            draw(env.shared.vao, '.setVAO(', env.shared.vao, '.targetVAO);');
          }
        } else {
          draw(env.shared.vao, '.setVAO(null);');
          emitAttributes(env, draw, args, program.attributes, function () {
            return true
          });
        }
        emitUniforms(env, draw, args, program.uniforms, function () {
          return true
        }, false);
        emitDraw(env, draw, draw, args);
      }

      function emitDrawProc (env, args) {
        var draw = env.proc('draw', 1);

        injectExtensions(env, draw);

        emitContext(env, draw, args.context);
        emitPollFramebuffer(env, draw, args.framebuffer);

        emitPollState(env, draw, args);
        emitSetOptions(env, draw, args.state);

        emitProfile(env, draw, args, false, true);

        var program = args.shader.progVar.append(env, draw);
        draw(env.shared.gl, '.useProgram(', program, '.program);');

        if (args.shader.program) {
          emitDrawBody(env, draw, args, args.shader.program);
        } else {
          draw(env.shared.vao, '.setVAO(null);');
          var drawCache = env.global.def('{}');
          var PROG_ID = draw.def(program, '.id');
          var CACHED_PROC = draw.def(drawCache, '[', PROG_ID, ']');
          draw(
            env.cond(CACHED_PROC)
              .then(CACHED_PROC, '.call(this,a0);')
              .else(
                CACHED_PROC, '=', drawCache, '[', PROG_ID, ']=',
                env.link(function (program) {
                  return createBody(emitDrawBody, env, args, program, 1)
                }), '(', program, ');',
                CACHED_PROC, '.call(this,a0);'));
        }

        if (Object.keys(args.state).length > 0) {
          draw(env.shared.current, '.dirty=true;');
        }
        if (env.shared.vao) {
          draw(env.shared.vao, '.setVAO(null);');
        }
      }

      // ===================================================
      // ===================================================
      // BATCH PROC
      // ===================================================
      // ===================================================

      function emitBatchDynamicShaderBody (env, scope, args, program) {
        env.batchId = 'a1';

        injectExtensions(env, scope);

        function all () {
          return true
        }

        emitAttributes(env, scope, args, program.attributes, all);
        emitUniforms(env, scope, args, program.uniforms, all, false);
        emitDraw(env, scope, scope, args);
      }

      function emitBatchBody (env, scope, args, program) {
        injectExtensions(env, scope);

        var contextDynamic = args.contextDep;

        var BATCH_ID = scope.def();
        var PROP_LIST = 'a0';
        var NUM_PROPS = 'a1';
        var PROPS = scope.def();
        env.shared.props = PROPS;
        env.batchId = BATCH_ID;

        var outer = env.scope();
        var inner = env.scope();

        scope(
          outer.entry,
          'for(', BATCH_ID, '=0;', BATCH_ID, '<', NUM_PROPS, ';++', BATCH_ID, '){',
          PROPS, '=', PROP_LIST, '[', BATCH_ID, '];',
          inner,
          '}',
          outer.exit);

        function isInnerDefn (defn) {
          return ((defn.contextDep && contextDynamic) || defn.propDep)
        }

        function isOuterDefn (defn) {
          return !isInnerDefn(defn)
        }

        if (args.needsContext) {
          emitContext(env, inner, args.context);
        }
        if (args.needsFramebuffer) {
          emitPollFramebuffer(env, inner, args.framebuffer);
        }
        emitSetOptions(env, inner, args.state, isInnerDefn);

        if (args.profile && isInnerDefn(args.profile)) {
          emitProfile(env, inner, args, false, true);
        }

        if (!program) {
          var progCache = env.global.def('{}');
          var PROGRAM = args.shader.progVar.append(env, inner);
          var PROG_ID = inner.def(PROGRAM, '.id');
          var CACHED_PROC = inner.def(progCache, '[', PROG_ID, ']');
          inner(
            env.shared.gl, '.useProgram(', PROGRAM, '.program);',
            'if(!', CACHED_PROC, '){',
            CACHED_PROC, '=', progCache, '[', PROG_ID, ']=',
            env.link(function (program) {
              return createBody(
                emitBatchDynamicShaderBody, env, args, program, 2)
            }), '(', PROGRAM, ');}',
            CACHED_PROC, '.call(this,a0[', BATCH_ID, '],', BATCH_ID, ');');
        } else {
          if (args.useVAO) {
            if (args.drawVAO) {
              if (isInnerDefn(args.drawVAO)) {
                // vao is a prop
                inner(env.shared.vao, '.setVAO(', args.drawVAO.append(env, inner), ');');
              } else {
                // vao is invariant
                outer(env.shared.vao, '.setVAO(', args.drawVAO.append(env, outer), ');');
              }
            } else {
              // scoped vao binding
              outer(env.shared.vao, '.setVAO(', env.shared.vao, '.targetVAO);');
            }
          } else {
            outer(env.shared.vao, '.setVAO(null);');
            emitAttributes(env, outer, args, program.attributes, isOuterDefn);
            emitAttributes(env, inner, args, program.attributes, isInnerDefn);
          }
          emitUniforms(env, outer, args, program.uniforms, isOuterDefn, false);
          emitUniforms(env, inner, args, program.uniforms, isInnerDefn, true);
          emitDraw(env, outer, inner, args);
        }
      }

      function emitBatchProc (env, args) {
        var batch = env.proc('batch', 2);
        env.batchId = '0';

        injectExtensions(env, batch);

        // Check if any context variables depend on props
        var contextDynamic = false;
        var needsContext = true;
        Object.keys(args.context).forEach(function (name) {
          contextDynamic = contextDynamic || args.context[name].propDep;
        });
        if (!contextDynamic) {
          emitContext(env, batch, args.context);
          needsContext = false;
        }

        // framebuffer state affects framebufferWidth/height context vars
        var framebuffer = args.framebuffer;
        var needsFramebuffer = false;
        if (framebuffer) {
          if (framebuffer.propDep) {
            contextDynamic = needsFramebuffer = true;
          } else if (framebuffer.contextDep && contextDynamic) {
            needsFramebuffer = true;
          }
          if (!needsFramebuffer) {
            emitPollFramebuffer(env, batch, framebuffer);
          }
        } else {
          emitPollFramebuffer(env, batch, null);
        }

        // viewport is weird because it can affect context vars
        if (args.state.viewport && args.state.viewport.propDep) {
          contextDynamic = true;
        }

        function isInnerDefn (defn) {
          return (defn.contextDep && contextDynamic) || defn.propDep
        }

        // set webgl options
        emitPollState(env, batch, args);
        emitSetOptions(env, batch, args.state, function (defn) {
          return !isInnerDefn(defn)
        });

        if (!args.profile || !isInnerDefn(args.profile)) {
          emitProfile(env, batch, args, false, 'a1');
        }

        // Save these values to args so that the batch body routine can use them
        args.contextDep = contextDynamic;
        args.needsContext = needsContext;
        args.needsFramebuffer = needsFramebuffer;

        // determine if shader is dynamic
        var progDefn = args.shader.progVar;
        if ((progDefn.contextDep && contextDynamic) || progDefn.propDep) {
          emitBatchBody(
            env,
            batch,
            args,
            null);
        } else {
          var PROGRAM = progDefn.append(env, batch);
          batch(env.shared.gl, '.useProgram(', PROGRAM, '.program);');
          if (args.shader.program) {
            emitBatchBody(
              env,
              batch,
              args,
              args.shader.program);
          } else {
            batch(env.shared.vao, '.setVAO(null);');
            var batchCache = env.global.def('{}');
            var PROG_ID = batch.def(PROGRAM, '.id');
            var CACHED_PROC = batch.def(batchCache, '[', PROG_ID, ']');
            batch(
              env.cond(CACHED_PROC)
                .then(CACHED_PROC, '.call(this,a0,a1);')
                .else(
                  CACHED_PROC, '=', batchCache, '[', PROG_ID, ']=',
                  env.link(function (program) {
                    return createBody(emitBatchBody, env, args, program, 2)
                  }), '(', PROGRAM, ');',
                  CACHED_PROC, '.call(this,a0,a1);'));
          }
        }

        if (Object.keys(args.state).length > 0) {
          batch(env.shared.current, '.dirty=true;');
        }

        if (env.shared.vao) {
          batch(env.shared.vao, '.setVAO(null);');
        }
      }

      // ===================================================
      // ===================================================
      // SCOPE COMMAND
      // ===================================================
      // ===================================================
      function emitScopeProc (env, args) {
        var scope = env.proc('scope', 3);
        env.batchId = 'a2';

        var shared = env.shared;
        var CURRENT_STATE = shared.current;

        emitContext(env, scope, args.context);

        if (args.framebuffer) {
          args.framebuffer.append(env, scope);
        }

        sortState(Object.keys(args.state)).forEach(function (name) {
          var defn = args.state[name];
          var value = defn.append(env, scope);
          if (isArrayLike(value)) {
            value.forEach(function (v, i) {
              scope.set(env.next[name], '[' + i + ']', v);
            });
          } else {
            scope.set(shared.next, '.' + name, value);
          }
        });

        emitProfile(env, scope, args, true, true)

        ;[S_ELEMENTS, S_OFFSET, S_COUNT, S_INSTANCES, S_PRIMITIVE].forEach(
          function (opt) {
            var variable = args.draw[opt];
            if (!variable) {
              return
            }
            scope.set(shared.draw, '.' + opt, '' + variable.append(env, scope));
          });

        Object.keys(args.uniforms).forEach(function (opt) {
          var value = args.uniforms[opt].append(env, scope);
          if (Array.isArray(value)) {
            value = '[' + value.join() + ']';
          }
          scope.set(
            shared.uniforms,
            '[' + stringStore.id(opt) + ']',
            value);
        });

        Object.keys(args.attributes).forEach(function (name) {
          var record = args.attributes[name].append(env, scope);
          var scopeAttrib = env.scopeAttrib(name);
          Object.keys(new AttributeRecord()).forEach(function (prop) {
            scope.set(scopeAttrib, '.' + prop, record[prop]);
          });
        });

        if (args.scopeVAO) {
          scope.set(shared.vao, '.targetVAO', args.scopeVAO.append(env, scope));
        }

        function saveShader (name) {
          var shader = args.shader[name];
          if (shader) {
            scope.set(shared.shader, '.' + name, shader.append(env, scope));
          }
        }
        saveShader(S_VERT);
        saveShader(S_FRAG);

        if (Object.keys(args.state).length > 0) {
          scope(CURRENT_STATE, '.dirty=true;');
          scope.exit(CURRENT_STATE, '.dirty=true;');
        }

        scope('a1(', env.shared.context, ',a0,', env.batchId, ');');
      }

      function isDynamicObject (object) {
        if (typeof object !== 'object' || isArrayLike(object)) {
          return
        }
        var props = Object.keys(object);
        for (var i = 0; i < props.length; ++i) {
          if (dynamic.isDynamic(object[props[i]])) {
            return true
          }
        }
        return false
      }

      function splatObject (env, options, name) {
        var object = options.static[name];
        if (!object || !isDynamicObject(object)) {
          return
        }

        var globals = env.global;
        var keys = Object.keys(object);
        var thisDep = false;
        var contextDep = false;
        var propDep = false;
        var objectRef = env.global.def('{}');
        keys.forEach(function (key) {
          var value = object[key];
          if (dynamic.isDynamic(value)) {
            if (typeof value === 'function') {
              value = object[key] = dynamic.unbox(value);
            }
            var deps = createDynamicDecl(value, null);
            thisDep = thisDep || deps.thisDep;
            propDep = propDep || deps.propDep;
            contextDep = contextDep || deps.contextDep;
          } else {
            globals(objectRef, '.', key, '=');
            switch (typeof value) {
              case 'number':
                globals(value);
                break
              case 'string':
                globals('"', value, '"');
                break
              case 'object':
                if (Array.isArray(value)) {
                  globals('[', value.join(), ']');
                }
                break
              default:
                globals(env.link(value));
                break
            }
            globals(';');
          }
        });

        function appendBlock (env, block) {
          keys.forEach(function (key) {
            var value = object[key];
            if (!dynamic.isDynamic(value)) {
              return
            }
            var ref = env.invoke(block, value);
            block(objectRef, '.', key, '=', ref, ';');
          });
        }

        options.dynamic[name] = new dynamic.DynamicVariable(DYN_THUNK, {
          thisDep: thisDep,
          contextDep: contextDep,
          propDep: propDep,
          ref: objectRef,
          append: appendBlock
        });
        delete options.static[name];
      }

      // ===========================================================================
      // ===========================================================================
      // MAIN DRAW COMMAND
      // ===========================================================================
      // ===========================================================================
      function compileCommand (options, attributes, uniforms, context, stats) {
        var env = createREGLEnvironment();

        // link stats, so that we can easily access it in the program.
        env.stats = env.link(stats);

        // splat options and attributes to allow for dynamic nested properties
        Object.keys(attributes.static).forEach(function (key) {
          splatObject(env, attributes, key);
        });
        NESTED_OPTIONS.forEach(function (name) {
          splatObject(env, options, name);
        });

        var args = parseArguments(options, attributes, uniforms, context, env);

        emitDrawProc(env, args);
        emitScopeProc(env, args);
        emitBatchProc(env, args);

        return extend(env.compile(), {
          destroy: function () {
            args.shader.program.destroy();
          }
        })
      }

      // ===========================================================================
      // ===========================================================================
      // POLL / REFRESH
      // ===========================================================================
      // ===========================================================================
      return {
        next: nextState,
        current: currentState,
        procs: (function () {
          var env = createREGLEnvironment();
          var poll = env.proc('poll');
          var refresh = env.proc('refresh');
          var common = env.block();
          poll(common);
          refresh(common);

          var shared = env.shared;
          var GL = shared.gl;
          var NEXT_STATE = shared.next;
          var CURRENT_STATE = shared.current;

          common(CURRENT_STATE, '.dirty=false;');

          emitPollFramebuffer(env, poll);
          emitPollFramebuffer(env, refresh, null, true);

          // Refresh updates all attribute state changes
          var INSTANCING;
          if (extInstancing) {
            INSTANCING = env.link(extInstancing);
          }

          // update vertex array bindings
          if (extensions.oes_vertex_array_object) {
            refresh(env.link(extensions.oes_vertex_array_object), '.bindVertexArrayOES(null);');
          }
          for (var i = 0; i < limits.maxAttributes; ++i) {
            var BINDING = refresh.def(shared.attributes, '[', i, ']');
            var ifte = env.cond(BINDING, '.buffer');
            ifte.then(
              GL, '.enableVertexAttribArray(', i, ');',
              GL, '.bindBuffer(',
              GL_ARRAY_BUFFER$2, ',',
              BINDING, '.buffer.buffer);',
              GL, '.vertexAttribPointer(',
              i, ',',
              BINDING, '.size,',
              BINDING, '.type,',
              BINDING, '.normalized,',
              BINDING, '.stride,',
              BINDING, '.offset);'
            ).else(
              GL, '.disableVertexAttribArray(', i, ');',
              GL, '.vertexAttrib4f(',
              i, ',',
              BINDING, '.x,',
              BINDING, '.y,',
              BINDING, '.z,',
              BINDING, '.w);',
              BINDING, '.buffer=null;');
            refresh(ifte);
            if (extInstancing) {
              refresh(
                INSTANCING, '.vertexAttribDivisorANGLE(',
                i, ',',
                BINDING, '.divisor);');
            }
          }
          refresh(
            env.shared.vao, '.currentVAO=null;',
            env.shared.vao, '.setVAO(', env.shared.vao, '.targetVAO);');

          Object.keys(GL_FLAGS).forEach(function (flag) {
            var cap = GL_FLAGS[flag];
            var NEXT = common.def(NEXT_STATE, '.', flag);
            var block = env.block();
            block('if(', NEXT, '){',
              GL, '.enable(', cap, ')}else{',
              GL, '.disable(', cap, ')}',
              CURRENT_STATE, '.', flag, '=', NEXT, ';');
            refresh(block);
            poll(
              'if(', NEXT, '!==', CURRENT_STATE, '.', flag, '){',
              block,
              '}');
          });

          Object.keys(GL_VARIABLES).forEach(function (name) {
            var func = GL_VARIABLES[name];
            var init = currentState[name];
            var NEXT, CURRENT;
            var block = env.block();
            block(GL, '.', func, '(');
            if (isArrayLike(init)) {
              var n = init.length;
              NEXT = env.global.def(NEXT_STATE, '.', name);
              CURRENT = env.global.def(CURRENT_STATE, '.', name);
              block(
                loop(n, function (i) {
                  return NEXT + '[' + i + ']'
                }), ');',
                loop(n, function (i) {
                  return CURRENT + '[' + i + ']=' + NEXT + '[' + i + '];'
                }).join(''));
              poll(
                'if(', loop(n, function (i) {
                  return NEXT + '[' + i + ']!==' + CURRENT + '[' + i + ']'
                }).join('||'), '){',
                block,
                '}');
            } else {
              NEXT = common.def(NEXT_STATE, '.', name);
              CURRENT = common.def(CURRENT_STATE, '.', name);
              block(
                NEXT, ');',
                CURRENT_STATE, '.', name, '=', NEXT, ';');
              poll(
                'if(', NEXT, '!==', CURRENT, '){',
                block,
                '}');
            }
            refresh(block);
          });

          return env.compile()
        })(),
        compile: compileCommand
      }
    }

    function stats () {
      return {
        vaoCount: 0,
        bufferCount: 0,
        elementsCount: 0,
        framebufferCount: 0,
        shaderCount: 0,
        textureCount: 0,
        cubeCount: 0,
        renderbufferCount: 0,
        maxTextureUnits: 0
      }
    }

    var GL_QUERY_RESULT_EXT = 0x8866;
    var GL_QUERY_RESULT_AVAILABLE_EXT = 0x8867;
    var GL_TIME_ELAPSED_EXT = 0x88BF;

    var createTimer = function (gl, extensions) {
      if (!extensions.ext_disjoint_timer_query) {
        return null
      }

      // QUERY POOL BEGIN
      var queryPool = [];
      function allocQuery () {
        return queryPool.pop() || extensions.ext_disjoint_timer_query.createQueryEXT()
      }
      function freeQuery (query) {
        queryPool.push(query);
      }
      // QUERY POOL END

      var pendingQueries = [];
      function beginQuery (stats) {
        var query = allocQuery();
        extensions.ext_disjoint_timer_query.beginQueryEXT(GL_TIME_ELAPSED_EXT, query);
        pendingQueries.push(query);
        pushScopeStats(pendingQueries.length - 1, pendingQueries.length, stats);
      }

      function endQuery () {
        extensions.ext_disjoint_timer_query.endQueryEXT(GL_TIME_ELAPSED_EXT);
      }

      //
      // Pending stats pool.
      //
      function PendingStats () {
        this.startQueryIndex = -1;
        this.endQueryIndex = -1;
        this.sum = 0;
        this.stats = null;
      }
      var pendingStatsPool = [];
      function allocPendingStats () {
        return pendingStatsPool.pop() || new PendingStats()
      }
      function freePendingStats (pendingStats) {
        pendingStatsPool.push(pendingStats);
      }
      // Pending stats pool end

      var pendingStats = [];
      function pushScopeStats (start, end, stats) {
        var ps = allocPendingStats();
        ps.startQueryIndex = start;
        ps.endQueryIndex = end;
        ps.sum = 0;
        ps.stats = stats;
        pendingStats.push(ps);
      }

      // we should call this at the beginning of the frame,
      // in order to update gpuTime
      var timeSum = [];
      var queryPtr = [];
      function update () {
        var ptr, i;

        var n = pendingQueries.length;
        if (n === 0) {
          return
        }

        // Reserve space
        queryPtr.length = Math.max(queryPtr.length, n + 1);
        timeSum.length = Math.max(timeSum.length, n + 1);
        timeSum[0] = 0;
        queryPtr[0] = 0;

        // Update all pending timer queries
        var queryTime = 0;
        ptr = 0;
        for (i = 0; i < pendingQueries.length; ++i) {
          var query = pendingQueries[i];
          if (extensions.ext_disjoint_timer_query.getQueryObjectEXT(query, GL_QUERY_RESULT_AVAILABLE_EXT)) {
            queryTime += extensions.ext_disjoint_timer_query.getQueryObjectEXT(query, GL_QUERY_RESULT_EXT);
            freeQuery(query);
          } else {
            pendingQueries[ptr++] = query;
          }
          timeSum[i + 1] = queryTime;
          queryPtr[i + 1] = ptr;
        }
        pendingQueries.length = ptr;

        // Update all pending stat queries
        ptr = 0;
        for (i = 0; i < pendingStats.length; ++i) {
          var stats = pendingStats[i];
          var start = stats.startQueryIndex;
          var end = stats.endQueryIndex;
          stats.sum += timeSum[end] - timeSum[start];
          var startPtr = queryPtr[start];
          var endPtr = queryPtr[end];
          if (endPtr === startPtr) {
            stats.stats.gpuTime += stats.sum / 1e6;
            freePendingStats(stats);
          } else {
            stats.startQueryIndex = startPtr;
            stats.endQueryIndex = endPtr;
            pendingStats[ptr++] = stats;
          }
        }
        pendingStats.length = ptr;
      }

      return {
        beginQuery: beginQuery,
        endQuery: endQuery,
        pushScopeStats: pushScopeStats,
        update: update,
        getNumPendingQueries: function () {
          return pendingQueries.length
        },
        clear: function () {
          queryPool.push.apply(queryPool, pendingQueries);
          for (var i = 0; i < queryPool.length; i++) {
            extensions.ext_disjoint_timer_query.deleteQueryEXT(queryPool[i]);
          }
          pendingQueries.length = 0;
          queryPool.length = 0;
        },
        restore: function () {
          pendingQueries.length = 0;
          queryPool.length = 0;
        }
      }
    };

    var GL_COLOR_BUFFER_BIT = 16384;
    var GL_DEPTH_BUFFER_BIT = 256;
    var GL_STENCIL_BUFFER_BIT = 1024;

    var GL_ARRAY_BUFFER = 34962;

    var CONTEXT_LOST_EVENT = 'webglcontextlost';
    var CONTEXT_RESTORED_EVENT = 'webglcontextrestored';

    var DYN_PROP = 1;
    var DYN_CONTEXT = 2;
    var DYN_STATE = 3;

    function find (haystack, needle) {
      for (var i = 0; i < haystack.length; ++i) {
        if (haystack[i] === needle) {
          return i
        }
      }
      return -1
    }

    function wrapREGL (args) {
      var config = parseArgs(args);
      if (!config) {
        return null
      }

      var gl = config.gl;
      var glAttributes = gl.getContextAttributes();
      var contextLost = gl.isContextLost();

      var extensionState = createExtensionCache(gl, config);
      if (!extensionState) {
        return null
      }

      var stringStore = createStringStore();
      var stats$$1 = stats();
      var extensions = extensionState.extensions;
      var timer = createTimer(gl, extensions);

      var START_TIME = clock();
      var WIDTH = gl.drawingBufferWidth;
      var HEIGHT = gl.drawingBufferHeight;

      var contextState = {
        tick: 0,
        time: 0,
        viewportWidth: WIDTH,
        viewportHeight: HEIGHT,
        framebufferWidth: WIDTH,
        framebufferHeight: HEIGHT,
        drawingBufferWidth: WIDTH,
        drawingBufferHeight: HEIGHT,
        pixelRatio: config.pixelRatio
      };
      var uniformState = {};
      var drawState = {
        elements: null,
        primitive: 4, // GL_TRIANGLES
        count: -1,
        offset: 0,
        instances: -1
      };

      var limits = wrapLimits(gl, extensions);
      var bufferState = wrapBufferState(
        gl,
        stats$$1,
        config,
        destroyBuffer);
      var elementState = wrapElementsState(gl, extensions, bufferState, stats$$1);
      var attributeState = wrapAttributeState(
        gl,
        extensions,
        limits,
        stats$$1,
        bufferState,
        elementState,
        drawState);
      function destroyBuffer (buffer) {
        return attributeState.destroyBuffer(buffer)
      }
      var shaderState = wrapShaderState(gl, stringStore, stats$$1, config);
      var textureState = createTextureSet(
        gl,
        extensions,
        limits,
        function () { core.procs.poll(); },
        contextState,
        stats$$1,
        config);
      var renderbufferState = wrapRenderbuffers(gl, extensions, limits, stats$$1, config);
      var framebufferState = wrapFBOState(
        gl,
        extensions,
        limits,
        textureState,
        renderbufferState,
        stats$$1);
      var core = reglCore(
        gl,
        stringStore,
        extensions,
        limits,
        bufferState,
        elementState,
        textureState,
        framebufferState,
        uniformState,
        attributeState,
        shaderState,
        drawState,
        contextState,
        timer,
        config);
      var readPixels = wrapReadPixels(
        gl,
        framebufferState,
        core.procs.poll,
        contextState,
        glAttributes, extensions, limits);

      var nextState = core.next;
      var canvas = gl.canvas;

      var rafCallbacks = [];
      var lossCallbacks = [];
      var restoreCallbacks = [];
      var destroyCallbacks = [config.onDestroy];

      var activeRAF = null;
      function handleRAF () {
        if (rafCallbacks.length === 0) {
          if (timer) {
            timer.update();
          }
          activeRAF = null;
          return
        }

        // schedule next animation frame
        activeRAF = raf.next(handleRAF);

        // poll for changes
        poll();

        // fire a callback for all pending rafs
        for (var i = rafCallbacks.length - 1; i >= 0; --i) {
          var cb = rafCallbacks[i];
          if (cb) {
            cb(contextState, null, 0);
          }
        }

        // flush all pending webgl calls
        gl.flush();

        // poll GPU timers *after* gl.flush so we don't delay command dispatch
        if (timer) {
          timer.update();
        }
      }

      function startRAF () {
        if (!activeRAF && rafCallbacks.length > 0) {
          activeRAF = raf.next(handleRAF);
        }
      }

      function stopRAF () {
        if (activeRAF) {
          raf.cancel(handleRAF);
          activeRAF = null;
        }
      }

      function handleContextLoss (event) {
        event.preventDefault();

        // set context lost flag
        contextLost = true;

        // pause request animation frame
        stopRAF();

        // lose context
        lossCallbacks.forEach(function (cb) {
          cb();
        });
      }

      function handleContextRestored (event) {
        // clear error code
        gl.getError();

        // clear context lost flag
        contextLost = false;

        // refresh state
        extensionState.restore();
        shaderState.restore();
        bufferState.restore();
        textureState.restore();
        renderbufferState.restore();
        framebufferState.restore();
        attributeState.restore();
        if (timer) {
          timer.restore();
        }

        // refresh state
        core.procs.refresh();

        // restart RAF
        startRAF();

        // restore context
        restoreCallbacks.forEach(function (cb) {
          cb();
        });
      }

      if (canvas) {
        canvas.addEventListener(CONTEXT_LOST_EVENT, handleContextLoss, false);
        canvas.addEventListener(CONTEXT_RESTORED_EVENT, handleContextRestored, false);
      }

      function destroy () {
        rafCallbacks.length = 0;
        stopRAF();

        if (canvas) {
          canvas.removeEventListener(CONTEXT_LOST_EVENT, handleContextLoss);
          canvas.removeEventListener(CONTEXT_RESTORED_EVENT, handleContextRestored);
        }

        shaderState.clear();
        framebufferState.clear();
        renderbufferState.clear();
        attributeState.clear();
        textureState.clear();
        elementState.clear();
        bufferState.clear();

        if (timer) {
          timer.clear();
        }

        destroyCallbacks.forEach(function (cb) {
          cb();
        });
      }

      function compileProcedure (options) {
        check$1(!!options, 'invalid args to regl({...})');
        check$1.type(options, 'object', 'invalid args to regl({...})');

        function flattenNestedOptions (options) {
          var result = extend({}, options);
          delete result.uniforms;
          delete result.attributes;
          delete result.context;
          delete result.vao;

          if ('stencil' in result && result.stencil.op) {
            result.stencil.opBack = result.stencil.opFront = result.stencil.op;
            delete result.stencil.op;
          }

          function merge (name) {
            if (name in result) {
              var child = result[name];
              delete result[name];
              Object.keys(child).forEach(function (prop) {
                result[name + '.' + prop] = child[prop];
              });
            }
          }
          merge('blend');
          merge('depth');
          merge('cull');
          merge('stencil');
          merge('polygonOffset');
          merge('scissor');
          merge('sample');

          if ('vao' in options) {
            result.vao = options.vao;
          }

          return result
        }

        function separateDynamic (object, useArrays) {
          var staticItems = {};
          var dynamicItems = {};
          Object.keys(object).forEach(function (option) {
            var value = object[option];
            if (dynamic.isDynamic(value)) {
              dynamicItems[option] = dynamic.unbox(value, option);
              return
            } else if (useArrays && Array.isArray(value)) {
              for (var i = 0; i < value.length; ++i) {
                if (dynamic.isDynamic(value[i])) {
                  dynamicItems[option] = dynamic.unbox(value, option);
                  return
                }
              }
            }
            staticItems[option] = value;
          });
          return {
            dynamic: dynamicItems,
            static: staticItems
          }
        }

        // Treat context variables separate from other dynamic variables
        var context = separateDynamic(options.context || {}, true);
        var uniforms = separateDynamic(options.uniforms || {}, true);
        var attributes = separateDynamic(options.attributes || {}, false);
        var opts = separateDynamic(flattenNestedOptions(options), false);

        var stats$$1 = {
          gpuTime: 0.0,
          cpuTime: 0.0,
          count: 0
        };

        var compiled = core.compile(opts, attributes, uniforms, context, stats$$1);

        var draw = compiled.draw;
        var batch = compiled.batch;
        var scope = compiled.scope;

        // FIXME: we should modify code generation for batch commands so this
        // isn't necessary
        var EMPTY_ARRAY = [];
        function reserve (count) {
          while (EMPTY_ARRAY.length < count) {
            EMPTY_ARRAY.push(null);
          }
          return EMPTY_ARRAY
        }

        function REGLCommand (args, body) {
          var i;
          if (contextLost) {
            check$1.raise('context lost');
          }
          if (typeof args === 'function') {
            return scope.call(this, null, args, 0)
          } else if (typeof body === 'function') {
            if (typeof args === 'number') {
              for (i = 0; i < args; ++i) {
                scope.call(this, null, body, i);
              }
            } else if (Array.isArray(args)) {
              for (i = 0; i < args.length; ++i) {
                scope.call(this, args[i], body, i);
              }
            } else {
              return scope.call(this, args, body, 0)
            }
          } else if (typeof args === 'number') {
            if (args > 0) {
              return batch.call(this, reserve(args | 0), args | 0)
            }
          } else if (Array.isArray(args)) {
            if (args.length) {
              return batch.call(this, args, args.length)
            }
          } else {
            return draw.call(this, args)
          }
        }

        return extend(REGLCommand, {
          stats: stats$$1,
          destroy: function () {
            compiled.destroy();
          }
        })
      }

      var setFBO = framebufferState.setFBO = compileProcedure({
        framebuffer: dynamic.define.call(null, DYN_PROP, 'framebuffer')
      });

      function clearImpl (_, options) {
        var clearFlags = 0;
        core.procs.poll();

        var c = options.color;
        if (c) {
          gl.clearColor(+c[0] || 0, +c[1] || 0, +c[2] || 0, +c[3] || 0);
          clearFlags |= GL_COLOR_BUFFER_BIT;
        }
        if ('depth' in options) {
          gl.clearDepth(+options.depth);
          clearFlags |= GL_DEPTH_BUFFER_BIT;
        }
        if ('stencil' in options) {
          gl.clearStencil(options.stencil | 0);
          clearFlags |= GL_STENCIL_BUFFER_BIT;
        }

        check$1(!!clearFlags, 'called regl.clear with no buffer specified');
        gl.clear(clearFlags);
      }

      function clear (options) {
        check$1(
          typeof options === 'object' && options,
          'regl.clear() takes an object as input');
        if ('framebuffer' in options) {
          if (options.framebuffer &&
              options.framebuffer_reglType === 'framebufferCube') {
            for (var i = 0; i < 6; ++i) {
              setFBO(extend({
                framebuffer: options.framebuffer.faces[i]
              }, options), clearImpl);
            }
          } else {
            setFBO(options, clearImpl);
          }
        } else {
          clearImpl(null, options);
        }
      }

      function frame (cb) {
        check$1.type(cb, 'function', 'regl.frame() callback must be a function');
        rafCallbacks.push(cb);

        function cancel () {
          // FIXME:  should we check something other than equals cb here?
          // what if a user calls frame twice with the same callback...
          //
          var i = find(rafCallbacks, cb);
          check$1(i >= 0, 'cannot cancel a frame twice');
          function pendingCancel () {
            var index = find(rafCallbacks, pendingCancel);
            rafCallbacks[index] = rafCallbacks[rafCallbacks.length - 1];
            rafCallbacks.length -= 1;
            if (rafCallbacks.length <= 0) {
              stopRAF();
            }
          }
          rafCallbacks[i] = pendingCancel;
        }

        startRAF();

        return {
          cancel: cancel
        }
      }

      // poll viewport
      function pollViewport () {
        var viewport = nextState.viewport;
        var scissorBox = nextState.scissor_box;
        viewport[0] = viewport[1] = scissorBox[0] = scissorBox[1] = 0;
        contextState.viewportWidth =
          contextState.framebufferWidth =
          contextState.drawingBufferWidth =
          viewport[2] =
          scissorBox[2] = gl.drawingBufferWidth;
        contextState.viewportHeight =
          contextState.framebufferHeight =
          contextState.drawingBufferHeight =
          viewport[3] =
          scissorBox[3] = gl.drawingBufferHeight;
      }

      function poll () {
        contextState.tick += 1;
        contextState.time = now();
        pollViewport();
        core.procs.poll();
      }

      function refresh () {
        textureState.refresh();
        pollViewport();
        core.procs.refresh();
        if (timer) {
          timer.update();
        }
      }

      function now () {
        return (clock() - START_TIME) / 1000.0
      }

      refresh();

      function addListener (event, callback) {
        check$1.type(callback, 'function', 'listener callback must be a function');

        var callbacks;
        switch (event) {
          case 'frame':
            return frame(callback)
          case 'lost':
            callbacks = lossCallbacks;
            break
          case 'restore':
            callbacks = restoreCallbacks;
            break
          case 'destroy':
            callbacks = destroyCallbacks;
            break
          default:
            check$1.raise('invalid event, must be one of frame,lost,restore,destroy');
        }

        callbacks.push(callback);
        return {
          cancel: function () {
            for (var i = 0; i < callbacks.length; ++i) {
              if (callbacks[i] === callback) {
                callbacks[i] = callbacks[callbacks.length - 1];
                callbacks.pop();
                return
              }
            }
          }
        }
      }

      var regl = extend(compileProcedure, {
        // Clear current FBO
        clear: clear,

        // Short cuts for dynamic variables
        prop: dynamic.define.bind(null, DYN_PROP),
        context: dynamic.define.bind(null, DYN_CONTEXT),
        this: dynamic.define.bind(null, DYN_STATE),

        // executes an empty draw command
        draw: compileProcedure({}),

        // Resources
        buffer: function (options) {
          return bufferState.create(options, GL_ARRAY_BUFFER, false, false)
        },
        elements: function (options) {
          return elementState.create(options, false)
        },
        texture: textureState.create2D,
        cube: textureState.createCube,
        renderbuffer: renderbufferState.create,
        framebuffer: framebufferState.create,
        framebufferCube: framebufferState.createCube,
        vao: attributeState.createVAO,

        // Expose context attributes
        attributes: glAttributes,

        // Frame rendering
        frame: frame,
        on: addListener,

        // System limits
        limits: limits,
        hasExtension: function (name) {
          return limits.extensions.indexOf(name.toLowerCase()) >= 0
        },

        // Read pixels
        read: readPixels,

        // Destroy regl and all associated resources
        destroy: destroy,

        // Direct GL state manipulation
        _gl: gl,
        _refresh: refresh,

        poll: function () {
          poll();
          if (timer) {
            timer.update();
          }
        },

        // Current time
        now: now,

        // regl Statistics Information
        stats: stats$$1
      });

      config.onDone(null, regl);

      return regl
    }

    return wrapREGL;

    })));

    });

    /*!
     * strip-comments <https://github.com/jonschlinkert/strip-comments>
     *
     * Copyright (c) 2014-2015 Jon Schlinkert.
     * Licensed under the MIT license.
     */

    var reBlock = /\/\*(?!\/)(.|[\r\n]|\n)+?\*\/\n?\n?/gm;
    var reBlockIgnore = /\/\*(?!(\*?\/|\*?\!))(.|[\r\n]|\n)+?\*\/\n?\n?/gm;
    var reLine = /(^|[^\S\n])(?:\/\/)([\s\S]+?)$/gm;
    var reLineIgnore = /(^|[^\S\n])(?:\/\/[^!])([\s\S]+?)$/gm;

    /**
     * Strip all comments
     *
     * @param   {String} `str`  file contents or string to strip.
     * @param   {Object} `opts`  options are passed to `.block`, and `.line`
     * @return  {String} String without comments.
     * @api public
     */

    function strip(str, opts) {
      return str ? strip.block(strip.line(str, opts), opts) : '';
    }

    /**
     * Strip only block comments, optionally leaving protected comments
     * (e.g. `/*!`) intact.
     *
     * @param   {String} `str`  file content or string to strip to
     * @param   {Object} `opts`  if `safe:true`, strip only comments that do not start with `/*!` or `/**!`
     * @return  {String} String without block comments.
     * @api public
     */

    strip.block = function(str, opts) {
      opts = opts || {};
      var re = reBlock; //new RegExp(reBlock + reBlockEnd, 'gm');
      if(opts.safe) {
        re = reBlockIgnore; //new RegExp(reBlockIgnore + reBlockEnd, 'gm');
      }
      return str ? str.replace(re, '') : '';
    };


    /**
     * Strip only line comments
     *
     * @param   {String} `str`  file content or string to strip to
     * @param   {Object} `opts`  if `safe:true`, strip all that not starts with `//!`
     * @return  {String} String without line comments.
     * @api public
     */

    strip.line = function(str, opts) {
      opts = opts || {};
      var re = reLine;
      if(opts.safe) {
        re = reLineIgnore;
      }
      return str ? str.replace(re, '') : '';
    };

    /**
     * Expose `strip`
     */

    var stripComments = strip;

    function lerp(v0, v1, t) {
        return v0*(1-t)+v1*t
    }
    var lerp_1 = lerp;

    function preserveCamelCase(str) {
    	var isLastCharLower = false;

    	for (var i = 0; i < str.length; i++) {
    		var c = str.charAt(i);

    		if (isLastCharLower && (/[a-zA-Z]/).test(c) && c.toUpperCase() === c) {
    			str = str.substr(0, i) + '-' + str.substr(i);
    			isLastCharLower = false;
    			i++;
    		} else {
    			isLastCharLower = (c.toLowerCase() === c);
    		}
    	}

    	return str;
    }

    var camelcase = function () {
    	var str = [].map.call(arguments, function (str) {
    		return str.trim();
    	}).filter(function (str) {
    		return str.length;
    	}).join('-');

    	if (!str.length) {
    		return '';
    	}

    	if (str.length === 1) {
    		return str.toLowerCase();
    	}

    	if (!(/[_.\- ]+/).test(str)) {
    		if (str === str.toUpperCase()) {
    			return str.toLowerCase();
    		}

    		if (str[0] !== str[0].toLowerCase()) {
    			return str[0].toLowerCase() + str.slice(1);
    		}

    		return str;
    	}

    	str = preserveCamelCase(str);

    	return str
    	.replace(/^[_.\- ]+/, '')
    	.toLowerCase()
    	.replace(/[_.\- ]+(\w|$)/g, function (m, p1) {
    		return p1.toUpperCase();
    	});
    };

    function backInOut(t) {
      var s = 1.70158 * 1.525;
      if ((t *= 2) < 1)
        return 0.5 * (t * t * ((s + 1) * t - s))
      return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2)
    }

    var backInOut_1 = backInOut;

    function backIn(t) {
      var s = 1.70158;
      return t * t * ((s + 1) * t - s)
    }

    var backIn_1 = backIn;

    function backOut(t) {
      var s = 1.70158;
      return --t * t * ((s + 1) * t + s) + 1
    }

    var backOut_1 = backOut;

    function bounceOut(t) {
      var a = 4.0 / 11.0;
      var b = 8.0 / 11.0;
      var c = 9.0 / 10.0;

      var ca = 4356.0 / 361.0;
      var cb = 35442.0 / 1805.0;
      var cc = 16061.0 / 1805.0;

      var t2 = t * t;

      return t < a
        ? 7.5625 * t2
        : t < b
          ? 9.075 * t2 - 9.9 * t + 3.4
          : t < c
            ? ca * t2 - cb * t + cc
            : 10.8 * t * t - 20.52 * t + 10.72
    }

    var bounceOut_1 = bounceOut;

    function bounceInOut(t) {
      return t < 0.5
        ? 0.5 * (1.0 - bounceOut_1(1.0 - t * 2.0))
        : 0.5 * bounceOut_1(t * 2.0 - 1.0) + 0.5
    }

    var bounceInOut_1 = bounceInOut;

    function bounceIn(t) {
      return 1.0 - bounceOut_1(1.0 - t)
    }

    var bounceIn_1 = bounceIn;

    function circInOut(t) {
      if ((t *= 2) < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1)
      return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1)
    }

    var circInOut_1 = circInOut;

    function circIn(t) {
      return 1.0 - Math.sqrt(1.0 - t * t)
    }

    var circIn_1 = circIn;

    function circOut(t) {
      return Math.sqrt(1 - ( --t * t ))
    }

    var circOut_1 = circOut;

    function cubicInOut(t) {
      return t < 0.5
        ? 4.0 * t * t * t
        : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0
    }

    var cubicInOut_1 = cubicInOut;

    function cubicIn(t) {
      return t * t * t
    }

    var cubicIn_1 = cubicIn;

    function cubicOut(t) {
      var f = t - 1.0;
      return f * f * f + 1.0
    }

    var cubicOut_1 = cubicOut;

    function elasticInOut(t) {
      return t < 0.5
        ? 0.5 * Math.sin(+13.0 * Math.PI/2 * 2.0 * t) * Math.pow(2.0, 10.0 * (2.0 * t - 1.0))
        : 0.5 * Math.sin(-13.0 * Math.PI/2 * ((2.0 * t - 1.0) + 1.0)) * Math.pow(2.0, -10.0 * (2.0 * t - 1.0)) + 1.0
    }

    var elasticInOut_1 = elasticInOut;

    function elasticIn(t) {
      return Math.sin(13.0 * t * Math.PI/2) * Math.pow(2.0, 10.0 * (t - 1.0))
    }

    var elasticIn_1 = elasticIn;

    function elasticOut(t) {
      return Math.sin(-13.0 * (t + 1.0) * Math.PI/2) * Math.pow(2.0, -10.0 * t) + 1.0
    }

    var elasticOut_1 = elasticOut;

    function expoInOut(t) {
      return (t === 0.0 || t === 1.0)
        ? t
        : t < 0.5
          ? +0.5 * Math.pow(2.0, (20.0 * t) - 10.0)
          : -0.5 * Math.pow(2.0, 10.0 - (t * 20.0)) + 1.0
    }

    var expoInOut_1 = expoInOut;

    function expoIn(t) {
      return t === 0.0 ? t : Math.pow(2.0, 10.0 * (t - 1.0))
    }

    var expoIn_1 = expoIn;

    function expoOut(t) {
      return t === 1.0 ? t : 1.0 - Math.pow(2.0, -10.0 * t)
    }

    var expoOut_1 = expoOut;

    function linear(t) {
      return t
    }

    var linear_1 = linear;

    function quadInOut(t) {
        t /= 0.5;
        if (t < 1) return 0.5*t*t
        t--;
        return -0.5 * (t*(t-2) - 1)
    }

    var quadInOut_1 = quadInOut;

    function quadIn(t) {
      return t * t
    }

    var quadIn_1 = quadIn;

    function quadOut(t) {
      return -t * (t - 2.0)
    }

    var quadOut_1 = quadOut;

    function quarticInOut(t) {
      return t < 0.5
        ? +8.0 * Math.pow(t, 4.0)
        : -8.0 * Math.pow(t - 1.0, 4.0) + 1.0
    }

    var quartInOut = quarticInOut;

    function quarticIn(t) {
      return Math.pow(t, 4.0)
    }

    var quartIn = quarticIn;

    function quarticOut(t) {
      return Math.pow(t - 1.0, 3.0) * (1.0 - t) + 1.0
    }

    var quartOut = quarticOut;

    function qinticInOut(t) {
        if ( ( t *= 2 ) < 1 ) return 0.5 * t * t * t * t * t
        return 0.5 * ( ( t -= 2 ) * t * t * t * t + 2 )
    }

    var quintInOut = qinticInOut;

    function qinticIn(t) {
      return t * t * t * t * t
    }

    var quintIn = qinticIn;

    function qinticOut(t) {
      return --t * t * t * t * t + 1
    }

    var quintOut = qinticOut;

    function sineInOut(t) {
      return -0.5 * (Math.cos(Math.PI*t) - 1)
    }

    var sineInOut_1 = sineInOut;

    function sineIn (t) {
      var v = Math.cos(t * Math.PI * 0.5);
      if (Math.abs(v) < 1e-14) return 1
      else return 1 - v
    }

    var sineIn_1 = sineIn;

    function sineOut(t) {
      return Math.sin(t * Math.PI/2)
    }

    var sineOut_1 = sineOut;

    var eases = {
    	'backInOut': backInOut_1,
    	'backIn': backIn_1,
    	'backOut': backOut_1,
    	'bounceInOut': bounceInOut_1,
    	'bounceIn': bounceIn_1,
    	'bounceOut': bounceOut_1,
    	'circInOut': circInOut_1,
    	'circIn': circIn_1,
    	'circOut': circOut_1,
    	'cubicInOut': cubicInOut_1,
    	'cubicIn': cubicIn_1,
    	'cubicOut': cubicOut_1,
    	'elasticInOut': elasticInOut_1,
    	'elasticIn': elasticIn_1,
    	'elasticOut': elasticOut_1,
    	'expoInOut': expoInOut_1,
    	'expoIn': expoIn_1,
    	'expoOut': expoOut_1,
    	'linear': linear_1,
    	'quadInOut': quadInOut_1,
    	'quadIn': quadIn_1,
    	'quadOut': quadOut_1,
    	'quartInOut': quartInOut,
    	'quartIn': quartIn,
    	'quartOut': quartOut,
    	'quintInOut': quintInOut,
    	'quintIn': quintIn,
    	'quintOut': quintOut,
    	'sineInOut': sineInOut_1,
    	'sineIn': sineIn_1,
    	'sineOut': sineOut_1
    };

    var compiledEasings = "#define GLSLIFY 1\n#ifndef PI\n#define PI 3.141592653589793\n#endif\n\nfloat backOut_1(float t) {\n  float f = t < 0.5\n    ? 2.0 * t\n    : 1.0 - (2.0 * t - 1.0);\n\n  float g = pow(f, 3.0) - f * sin(f * PI);\n\n  return t < 0.5\n    ? 0.5 * g\n    : 0.5 * (1.0 - g) + 0.5;\n}\n\n#ifndef PI\n#define PI 3.141592653589793\n#endif\n\nfloat backIn(float t) {\n  return pow(t, 3.0) - t * sin(t * PI);\n}\n\n#ifndef PI\n#define PI 3.141592653589793\n#endif\n\nfloat backOut_0(float t) {\n  float f = 1.0 - t;\n  return 1.0 - (pow(f, 3.0) - f * sin(f * PI));\n}\n\n#ifndef PI\n#define PI 3.141592653589793\n#endif\n\nfloat bounceOut(float t) {\n  const float a = 4.0 / 11.0;\n  const float b = 8.0 / 11.0;\n  const float c = 9.0 / 10.0;\n\n  const float ca = 4356.0 / 361.0;\n  const float cb = 35442.0 / 1805.0;\n  const float cc = 16061.0 / 1805.0;\n\n  float t2 = t * t;\n\n  return t < a\n    ? 7.5625 * t2\n    : t < b\n      ? 9.075 * t2 - 9.9 * t + 3.4\n      : t < c\n        ? ca * t2 - cb * t + cc\n        : 10.8 * t * t - 20.52 * t + 10.72;\n}\n\nfloat bounceInOut(float t) {\n  return t < 0.5\n    ? 0.5 * (1.0 - bounceOut(1.0 - t * 2.0))\n    : 0.5 * bounceOut(t * 2.0 - 1.0) + 0.5;\n}\n\nfloat bounceIn(float t) {\n  return 1.0 - bounceOut(1.0 - t);\n}\n\nfloat circularInOut(float t) {\n  return t < 0.5\n    ? 0.5 * (1.0 - sqrt(1.0 - 4.0 * t * t))\n    : 0.5 * (sqrt((3.0 - 2.0 * t) * (2.0 * t - 1.0)) + 1.0);\n}\n\nfloat circularIn(float t) {\n  return 1.0 - sqrt(1.0 - t * t);\n}\n\nfloat circularOut(float t) {\n  return sqrt((2.0 - t) * t);\n}\n\nfloat cubicInOut(float t) {\n  return t < 0.5\n    ? 4.0 * t * t * t\n    : 0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;\n}\n\nfloat cubicIn(float t) {\n  return t * t * t;\n}\n\nfloat cubicOut(float t) {\n  float f = t - 1.0;\n  return f * f * f + 1.0;\n}\n\n#ifndef HALF_PI\n#define HALF_PI 1.5707963267948966\n#endif\n\nfloat elasticInOut(float t) {\n  return t < 0.5\n    ? 0.5 * sin(+13.0 * HALF_PI * 2.0 * t) * pow(2.0, 10.0 * (2.0 * t - 1.0))\n    : 0.5 * sin(-13.0 * HALF_PI * ((2.0 * t - 1.0) + 1.0)) * pow(2.0, -10.0 * (2.0 * t - 1.0)) + 1.0;\n}\n\n#ifndef HALF_PI\n#define HALF_PI 1.5707963267948966\n#endif\n\nfloat elasticIn(float t) {\n  return sin(13.0 * t * HALF_PI) * pow(2.0, 10.0 * (t - 1.0));\n}\n\n#ifndef HALF_PI\n#define HALF_PI 1.5707963267948966\n#endif\n\nfloat elasticOut(float t) {\n  return sin(-13.0 * (t + 1.0) * HALF_PI) * pow(2.0, -10.0 * t) + 1.0;\n}\n\nfloat exponentialInOut(float t) {\n  return t == 0.0 || t == 1.0\n    ? t\n    : t < 0.5\n      ? +0.5 * pow(2.0, (20.0 * t) - 10.0)\n      : -0.5 * pow(2.0, 10.0 - (t * 20.0)) + 1.0;\n}\n\nfloat exponentialIn(float t) {\n  return t == 0.0 ? t : pow(2.0, 10.0 * (t - 1.0));\n}\n\nfloat exponentialOut(float t) {\n  return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);\n}\n\nfloat linear(float t) {\n  return t;\n}\n\nfloat quadraticInOut(float t) {\n  float p = 2.0 * t * t;\n  return t < 0.5 ? p : -p + (4.0 * t) - 1.0;\n}\n\nfloat quadraticIn(float t) {\n  return t * t;\n}\n\nfloat quadraticOut(float t) {\n  return -t * (t - 2.0);\n}\n\nfloat quarticInOut(float t) {\n  return t < 0.5\n    ? +8.0 * pow(t, 4.0)\n    : -8.0 * pow(t - 1.0, 4.0) + 1.0;\n}\n\nfloat quarticIn(float t) {\n  return pow(t, 4.0);\n}\n\nfloat quarticOut(float t) {\n  return pow(t - 1.0, 3.0) * (1.0 - t) + 1.0;\n}\n\nfloat qinticInOut(float t) {\n  return t < 0.5\n    ? +16.0 * pow(t, 5.0)\n    : -0.5 * pow(2.0 * t - 2.0, 5.0) + 1.0;\n}\n\nfloat qinticIn(float t) {\n  return pow(t, 5.0);\n}\n\nfloat qinticOut(float t) {\n  return 1.0 - (pow(t - 1.0, 5.0));\n}\n\n#ifndef PI\n#define PI 3.141592653589793\n#endif\n\nfloat sineInOut(float t) {\n  return -0.5 * (cos(PI * t) - 1.0);\n}\n\n#ifndef HALF_PI\n#define HALF_PI 1.5707963267948966\n#endif\n\nfloat sineIn(float t) {\n  return sin((t - 1.0) * HALF_PI) + 1.0;\n}\n\n#ifndef HALF_PI\n#define HALF_PI 1.5707963267948966\n#endif\n\nfloat sineOut(float t) {\n  return sin(t * HALF_PI);\n}";

    var nameMap = [
      ['quad-', 'quadratic-'],
      ['circ-', 'circular-'],
      ['expo-', 'exponential-'],
      ['quart-', 'quartic-'],
      ['quint-', 'quintic-']
    ];

    var getEasingName = function (name) {
      return camelcase(name);
    };

    var getGLSLEasingName = function (name) {
      nameMap.forEach(function (r) {
        name = name.replace(r[0], r[1]);
      });
      return camelcase(name);
    };

    var getEasingFunction = function (name) {
      return eases[camelcase(name)];
    };

    var getShaderEasings = function (name) {
      return compiledEasings;
    };

    var easings = {
      getEasingFunction: getEasingFunction,
      getEasingName: getEasingName,
      getShaderEasings: getShaderEasings,
      getGLSLEasingName: getGLSLEasingName
    };

    var namespace = '_rtb';

    var getPreviousName = function (name, type) {
      return namespace + '_' + type + '_previous_' + name;
    };

    var getCurrentName = function (name, type) {
      return namespace + '_' + type + '_current_' + name;
    };

    var getNextName = function (name, type) {
      return namespace + '_' + type + '_next_' + name;
    };

    var getTimeName = function (name, type) {
      return namespace + '_' + type + '_t_' + name;
    };

    var transformShader = function (name, shader, type, ease) {
      //
      // [X] Strip comments
      // [X] Replace declaration with prev / next / current declarations
      // [X] Initialize timestamp
      // [X] Initialize current in the main() function
      // [X] Replace all old usages with current
      //

      var easingName = easings.getGLSLEasingName(ease);
      var glslEasings = easings.getShaderEasings();

      shader = stripComments(shader);
      var prev = getPreviousName(name, type);
      var next = getNextName(name, type);
      var current = getCurrentName(name, type);
      var t = getTimeName(name, type);

      // first occurence of name:
      var re = new RegExp(';([^;]*' + name + '[^;]*;)');
      var found = shader.match(re);

      if (!found || found.length < 2) {
        return shader;
      }

      var invocation = found[1];
      var prevDeclare = invocation.replace(name, prev);
      var nextDeclare = invocation.replace(name, next);
      var currentDeclare = '\n' + invocation.replace(name, current).replace('attribute', '').replace('uniform', '').trim();
      var timeDeclare = '\nuniform float ' + t + ';';

      var replaceString = prevDeclare + nextDeclare + currentDeclare + timeDeclare;

      shader = shader.replace(invocation, replaceString);

      // add the mix() call
      re = new RegExp('main\\s*\\(\\s*\\)\\s*{');
      found = shader.match(re);

      if (found && found.length) {
        var mixString = current + ' = ' + 'mix(' + prev + ', ' + next + ', ' + easingName + '(' + t + '));';
        shader = shader.replace(found[0], found[0] + '\n  ' + mixString);
      }

      // replace all the old names
      re = new RegExp('\\b' + name + '\\b', 'g');
      shader = shader.replace(re, current);
      shader = glslEasings + '\n' + shader;

      return shader;
    };

    var TweenBuffer = function (data, options) {
      this.data = data;
      this.previousData = data;
      this.options = Object.assign({}, {
        duration: 750,
        ease: 'quad-in-out'
      }, options || {});
    };

    var src = function (regl) {
      var tween = function (commandObject) {
        commandObject.uniforms = commandObject.uniforms || {};
        commandObject.attributes = commandObject.attributes || {};
        commandObject.vert = commandObject.vert || '';
        commandObject.frag = commandObject.frag || '';
        if (!commandObject.vert || !commandObject.frag) {
          throw new Error('Must provide vert and frag shaders!');
        }

        var tweenedProps = {
          uniforms: [],
          attributes: []
        };
        var buffers = {
          uniforms: {},
          attributes: {}
        };
        var tweenBuffers = {
          uniforms: {},
          attributes: {}
        };
        var timers = {
          uniforms: {},
          attributes: {}
        };
        var tweenFlags = {
          uniforms: {},
          attributes: {}
        };
        var startTimes = {
          uniforms: {},
          attributes: {}
        };

        var tweenBufferUpdate = function (data) {
          var timer = timers[this.type][this.key];

          if (timer < 1.0) {
            var eased = easings.getEasingFunction(this.options.ease)(timer);
            var previousData = this.previousData;
            this.previousData = this.data.map(function (d, i) {
              return d.map(function (elt, j) {
                return lerp_1(previousData[i][j], elt, eased);
              });
            });
          } else {
            this.previousData = this.data;
          }

          this.data = data;
          buffers[this.type][this.key].previous({
            usage: 'dynamic',
            data: this.previousData
          });

          buffers[this.type][this.key].next({
            usage: 'dynamic',
            data: data
          });
          tweenFlags[this.type][this.key] = true;
        };

        var initialize = function (type) {
          Object.keys(commandObject[type] || {}).filter(function (key) {
            return commandObject[type][key] instanceof TweenBuffer;
          }).map(function (key) {
            tweenedProps[type].push(key);
            var tweenBuffer = commandObject[type][key];
            tweenBuffer.type = type;
            tweenBuffer.key = key;
            tweenBuffer.update = tweenBufferUpdate;
            tweenBuffers[type][key] = tweenBuffer;
            timers[type][key] = 1.0;
            tweenFlags[type][key] = false;
            buffers[type][key] = {
              previous: regl.buffer({
                usage: 'dynamic',
                data: tweenBuffer.data
              }),
              next: regl.buffer({
                usage: 'dynamic',
                data: tweenBuffer.data
              })
            };
          });
        };

        initialize('attributes');
        initialize('uniforms');

        var transform = function (type) {
          tweenedProps[type].forEach(function (attr) {
            var tweenBuffer = tweenBuffers[type][attr];
            var duration = tweenBuffer.options.duration;
            commandObject.vert = transformShader(attr, commandObject.vert || '', type, tweenBuffer.options.ease);
            delete commandObject.attributes[attr];
            commandObject[type][getPreviousName(attr, type)] = buffers[type][attr].previous;
            commandObject[type][getNextName(attr, type)] = buffers[type][attr].next;
            commandObject.uniforms[getTimeName(attr, type)] = function (context, props, batchId) {
              if (tweenFlags[type][attr]) {
                timers[type][attr] = 0.0;
                startTimes[type][attr] = context.time;
              }

              // we go up to maxT to allow for some random delays
              var startTime = startTimes[type][attr];
              var t = timers[type][attr];
              if (t < 1.0) {
                t = Math.min(1.0, 1000 * (context.time - startTime) / duration);
              }

              timers[type][attr] = t;
              tweenFlags[type][attr] = false;
              return t;
            };
          });
        };

        transform('attributes');
        transform('uniforms');

        return regl(commandObject);
      };

      tween.buffer = function (data, options) {
        return new TweenBuffer(data, options);
      };

      return tween;
    };

    var reglTween = src;

    /* node_modules/@onsvisual/svelte-charts/charts/shared/Scatter.svelte generated by Svelte v3.44.1 */

    function create_fragment$g(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let $gl;
    	let $height;
    	let $width;
    	let $yGet;
    	let $xGet;
    	let $data;
    	let $padding;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Scatter', slots, []);
    	const { data, xGet, yGet, width, height, padding } = getContext('LayerCake');
    	validate_store(data, 'data');
    	component_subscribe($$self, data, value => $$invalidate(19, $data = value));
    	validate_store(xGet, 'xGet');
    	component_subscribe($$self, xGet, value => $$invalidate(18, $xGet = value));
    	validate_store(yGet, 'yGet');
    	component_subscribe($$self, yGet, value => $$invalidate(17, $yGet = value));
    	validate_store(width, 'width');
    	component_subscribe($$self, width, value => $$invalidate(16, $width = value));
    	validate_store(height, 'height');
    	component_subscribe($$self, height, value => $$invalidate(15, $height = value));
    	validate_store(padding, 'padding');
    	component_subscribe($$self, padding, value => $$invalidate(20, $padding = value));
    	const { gl } = getContext('gl');
    	validate_store(gl, 'gl');
    	component_subscribe($$self, gl, value => $$invalidate(14, $gl = value));
    	let { diameter } = $$props;
    	let { colors } = $$props;
    	let { categories } = $$props;
    	let { catKey } = $$props;
    	let { selected } = $$props;
    	let catColors;

    	if (colors && categories && colors.length >= categories.length) {
    		catColors = {};

    		categories.forEach((cat, i) => {
    			catColors[cat] = [colors[i][0] / 255, colors[i][1] / 255, colors[i][2] / 255];
    		});
    	}

    	let regl$1;
    	let tween;
    	let positionBuffer;
    	let drawParticles;
    	let points;
    	let pointColors;

    	function initiate() {
    		// Fix for a positioning discrepancy I can't seem to resolve
    		let xfactor = $width / ($width + $padding.left + $padding.right);

    		let yfactor = $height / ($height + $padding.top + $padding.bottom);

    		// Map intial points from data
    		$$invalidate(13, points = $data.map(d => {
    			let point = [
    				$xGet(d) * xfactor * 2 / $width - 1,
    				-($yGet(d) * yfactor * 2 / $height - 1)
    			];

    			let opacity = 0.8;

    			if (selected) {
    				opacity = d[selected.col] == selected.value ? 1 : 0.02;
    			}

    			return [...point, opacity];
    		}));

    		// Set point colours
    		if (catColors) {
    			pointColors = $data.map(d => {
    				let color = Array.isArray(catColors[d[catKey]])
    				? catColors[d[catKey]]
    				: [0, 0, 0];

    				return color;
    			});
    		} else {
    			let staticColor = [colors[0][0] / 255, colors[0][1] / 255, colors[0][2] / 255];

    			pointColors = $data.map(d => {
    				return staticColor;
    			});
    		}

    		// Set up regl and tween contexts
    		regl$1 = regl({ gl: $gl });

    		regl$1.clear({ color: [0, 0, 0, 0], depth: 1 });
    		tween = reglTween(regl$1);
    		var COUNT = points.length;

    		// Pass in the initial data and optionally provide some customizations to
    		// the interpolation function.
    		$$invalidate(12, positionBuffer = tween.buffer(points, { duration: 1000 }));

    		// Wrap your command in tween() instead of in regl()
    		// A modified regl command is returned.
    		drawParticles = tween({
    			vert: `
precision mediump float;
attribute vec3 position;
attribute vec3 color;
uniform float pointSize;
varying vec3 fragColor;
varying float opacity;

void main() {
  gl_PointSize = pointSize;
  gl_Position = vec4(position[0], position[1], 0, 1);
  fragColor = color;
  opacity = position[2];
}`,
    			frag: `
precision lowp float;
varying vec3 fragColor;
varying float opacity;

void main() {
  if (length(gl_PointCoord.xy - 0.5) > 0.5) {
    discard;
  }
  gl_FragColor = vec4(fragColor, opacity);
}`,
    			attributes: {
    				position: positionBuffer,
    				color: pointColors
    			},
    			uniforms: { pointSize: diameter },
    			blend: {
    				enable: true,
    				func: {
    					srcRGB: 'src alpha',
    					srcAlpha: 'src alpha',
    					dstRGB: 'one minus src alpha',
    					dstAlpha: 'one minus src alpha'
    				}
    			},
    			depth: { enable: false },
    			count: COUNT,
    			primitive: 'points'
    		});

    		regl$1.frame(() => {
    			drawParticles();
    		});
    	}

    	function resize() {
    		if ($gl) {
    			const canvas = $gl.canvas;

    			// Lookup the size the browser is displaying the canvas.
    			const displayWidth = canvas.clientWidth;

    			const displayHeight = canvas.clientHeight;

    			// Check if the canvas is not the same size.
    			if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    				// Make the canvas the same size
    				canvas.width = displayWidth;

    				canvas.height = displayHeight;
    			}

    			$gl.viewport(0, 0, canvas.width, canvas.height);
    		}
    	}

    	const writable_props = ['diameter', 'colors', 'categories', 'catKey', 'selected'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Scatter> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('diameter' in $$props) $$invalidate(7, diameter = $$props.diameter);
    		if ('colors' in $$props) $$invalidate(8, colors = $$props.colors);
    		if ('categories' in $$props) $$invalidate(9, categories = $$props.categories);
    		if ('catKey' in $$props) $$invalidate(10, catKey = $$props.catKey);
    		if ('selected' in $$props) $$invalidate(11, selected = $$props.selected);
    	};

    	$$self.$capture_state = () => ({
    		reglWrapper: regl,
    		reglTween,
    		getContext,
    		data,
    		xGet,
    		yGet,
    		width,
    		height,
    		padding,
    		gl,
    		diameter,
    		colors,
    		categories,
    		catKey,
    		selected,
    		catColors,
    		regl: regl$1,
    		tween,
    		positionBuffer,
    		drawParticles,
    		points,
    		pointColors,
    		initiate,
    		resize,
    		$gl,
    		$height,
    		$width,
    		$yGet,
    		$xGet,
    		$data,
    		$padding
    	});

    	$$self.$inject_state = $$props => {
    		if ('diameter' in $$props) $$invalidate(7, diameter = $$props.diameter);
    		if ('colors' in $$props) $$invalidate(8, colors = $$props.colors);
    		if ('categories' in $$props) $$invalidate(9, categories = $$props.categories);
    		if ('catKey' in $$props) $$invalidate(10, catKey = $$props.catKey);
    		if ('selected' in $$props) $$invalidate(11, selected = $$props.selected);
    		if ('catColors' in $$props) catColors = $$props.catColors;
    		if ('regl' in $$props) regl$1 = $$props.regl;
    		if ('tween' in $$props) tween = $$props.tween;
    		if ('positionBuffer' in $$props) $$invalidate(12, positionBuffer = $$props.positionBuffer);
    		if ('drawParticles' in $$props) drawParticles = $$props.drawParticles;
    		if ('points' in $$props) $$invalidate(13, points = $$props.points);
    		if ('pointColors' in $$props) pointColors = $$props.pointColors;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*points, $gl, $width, $padding, $height, $data, $xGet, $yGet, selected, positionBuffer*/ 2095104) {
    			if (!points && $gl) {
    				initiate();
    			} else if (points && $gl) {
    				// Fix for a positioning discrepancy I can't seem to resolve
    				let xfactor = $width / ($width + $padding.left + $padding.right);

    				let yfactor = $height / ($height + $padding.top + $padding.bottom);

    				// Map new points from data
    				$$invalidate(13, points = $data.map(d => {
    					let point = [
    						$xGet(d) * xfactor * 2 / $width - 1,
    						-($yGet(d) * yfactor * 2 / $height - 1)
    					];

    					let opacity = 0.8;

    					if (selected) {
    						opacity = d[selected.col] == selected.value ? 1 : 0.02;
    					}

    					return [...point, opacity];
    				}));

    				positionBuffer.update(points);
    			}
    		}

    		if ($$self.$$.dirty & /*$width, $height, $gl*/ 114688) {
    			(resize());
    		}
    	};

    	return [
    		data,
    		xGet,
    		yGet,
    		width,
    		height,
    		padding,
    		gl,
    		diameter,
    		colors,
    		categories,
    		catKey,
    		selected,
    		positionBuffer,
    		points,
    		$gl,
    		$height,
    		$width,
    		$yGet,
    		$xGet,
    		$data,
    		$padding
    	];
    }

    class Scatter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
    			diameter: 7,
    			colors: 8,
    			categories: 9,
    			catKey: 10,
    			selected: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Scatter",
    			options,
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*diameter*/ ctx[7] === undefined && !('diameter' in props)) {
    			console.warn("<Scatter> was created without expected prop 'diameter'");
    		}

    		if (/*colors*/ ctx[8] === undefined && !('colors' in props)) {
    			console.warn("<Scatter> was created without expected prop 'colors'");
    		}

    		if (/*categories*/ ctx[9] === undefined && !('categories' in props)) {
    			console.warn("<Scatter> was created without expected prop 'categories'");
    		}

    		if (/*catKey*/ ctx[10] === undefined && !('catKey' in props)) {
    			console.warn("<Scatter> was created without expected prop 'catKey'");
    		}

    		if (/*selected*/ ctx[11] === undefined && !('selected' in props)) {
    			console.warn("<Scatter> was created without expected prop 'selected'");
    		}
    	}

    	get diameter() {
    		throw new Error("<Scatter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set diameter(value) {
    		throw new Error("<Scatter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colors() {
    		throw new Error("<Scatter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colors(value) {
    		throw new Error("<Scatter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get categories() {
    		throw new Error("<Scatter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set categories(value) {
    		throw new Error("<Scatter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get catKey() {
    		throw new Error("<Scatter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set catKey(value) {
    		throw new Error("<Scatter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Scatter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Scatter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@onsvisual/svelte-charts/charts/shared/AxisX.svelte generated by Svelte v3.44.1 */
    const file$f = "node_modules/@onsvisual/svelte-charts/charts/shared/AxisX.svelte";

    function get_each_context$9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[21] = list[i];
    	child_ctx[23] = i;
    	return child_ctx;
    }

    // (39:3) {#if gridlines !== false}
    function create_if_block_1$1(ctx) {
    	let line;
    	let line_y__value;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "y1", line_y__value = /*$height*/ ctx[11] * -1);
    			attr_dev(line, "y2", "0");
    			attr_dev(line, "x1", "0");
    			attr_dev(line, "x2", "0");
    			attr_dev(line, "class", "svelte-1fsfvxi");
    			add_location(line, file$f, 39, 4, 918);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$height*/ 2048 && line_y__value !== (line_y__value = /*$height*/ ctx[11] * -1)) {
    				attr_dev(line, "y1", line_y__value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(39:3) {#if gridlines !== false}",
    		ctx
    	});

    	return block;
    }

    // (37:1) {#each tickVals as tick, i}
    function create_each_block$9(ctx) {
    	let g;
    	let text_1;
    	let t_value = /*formatTick*/ ctx[1](/*tick*/ ctx[21]) + "";
    	let t;
    	let text_1_x_value;
    	let g_class_value;
    	let g_transform_value;
    	let if_block = /*gridlines*/ ctx[0] !== false && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			if (if_block) if_block.c();
    			text_1 = svg_element("text");
    			t = text(t_value);

    			attr_dev(text_1, "x", text_1_x_value = /*xTick*/ ctx[3] || /*isBandwidth*/ ctx[7]
    			? /*$xScale*/ ctx[8].bandwidth() / 2
    			: 0);

    			attr_dev(text_1, "y", /*yTick*/ ctx[4]);
    			attr_dev(text_1, "dx", /*dxTick*/ ctx[5]);
    			attr_dev(text_1, "dy", /*dyTick*/ ctx[6]);
    			attr_dev(text_1, "text-anchor", /*textAnchor*/ ctx[17](/*i*/ ctx[23]));
    			attr_dev(text_1, "class", "svelte-1fsfvxi");
    			add_location(text_1, file$f, 41, 3, 985);
    			attr_dev(g, "class", g_class_value = "tick tick-" + /*tick*/ ctx[21] + " svelte-1fsfvxi");
    			attr_dev(g, "transform", g_transform_value = "translate(" + /*$xScale*/ ctx[8](/*tick*/ ctx[21]) + "," + /*$yRange*/ ctx[10][0] + ")");
    			add_location(g, file$f, 37, 2, 802);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			if (if_block) if_block.m(g, null);
    			append_dev(g, text_1);
    			append_dev(text_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (/*gridlines*/ ctx[0] !== false) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					if_block.m(g, text_1);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*formatTick, tickVals*/ 514 && t_value !== (t_value = /*formatTick*/ ctx[1](/*tick*/ ctx[21]) + "")) set_data_dev(t, t_value);

    			if (dirty & /*xTick, isBandwidth, $xScale*/ 392 && text_1_x_value !== (text_1_x_value = /*xTick*/ ctx[3] || /*isBandwidth*/ ctx[7]
    			? /*$xScale*/ ctx[8].bandwidth() / 2
    			: 0)) {
    				attr_dev(text_1, "x", text_1_x_value);
    			}

    			if (dirty & /*yTick*/ 16) {
    				attr_dev(text_1, "y", /*yTick*/ ctx[4]);
    			}

    			if (dirty & /*dxTick*/ 32) {
    				attr_dev(text_1, "dx", /*dxTick*/ ctx[5]);
    			}

    			if (dirty & /*dyTick*/ 64) {
    				attr_dev(text_1, "dy", /*dyTick*/ ctx[6]);
    			}

    			if (dirty & /*tickVals*/ 512 && g_class_value !== (g_class_value = "tick tick-" + /*tick*/ ctx[21] + " svelte-1fsfvxi")) {
    				attr_dev(g, "class", g_class_value);
    			}

    			if (dirty & /*$xScale, tickVals, $yRange*/ 1792 && g_transform_value !== (g_transform_value = "translate(" + /*$xScale*/ ctx[8](/*tick*/ ctx[21]) + "," + /*$yRange*/ ctx[10][0] + ")")) {
    				attr_dev(g, "transform", g_transform_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$9.name,
    		type: "each",
    		source: "(37:1) {#each tickVals as tick, i}",
    		ctx
    	});

    	return block;
    }

    // (50:1) {#if baseline === true}
    function create_if_block$d(ctx) {
    	let line;
    	let line_y__value;
    	let line_y__value_1;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "class", "baseline svelte-1fsfvxi");
    			attr_dev(line, "y1", line_y__value = /*$height*/ ctx[11] + 0.5);
    			attr_dev(line, "y2", line_y__value_1 = /*$height*/ ctx[11] + 0.5);
    			attr_dev(line, "x1", "0");
    			attr_dev(line, "x2", /*$width*/ ctx[12]);
    			add_location(line, file$f, 50, 2, 1208);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$height*/ 2048 && line_y__value !== (line_y__value = /*$height*/ ctx[11] + 0.5)) {
    				attr_dev(line, "y1", line_y__value);
    			}

    			if (dirty & /*$height*/ 2048 && line_y__value_1 !== (line_y__value_1 = /*$height*/ ctx[11] + 0.5)) {
    				attr_dev(line, "y2", line_y__value_1);
    			}

    			if (dirty & /*$width*/ 4096) {
    				attr_dev(line, "x2", /*$width*/ ctx[12]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(50:1) {#if baseline === true}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let g;
    	let each_1_anchor;
    	let each_value = /*tickVals*/ ctx[9];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
    	}

    	let if_block = /*baseline*/ ctx[2] === true && create_if_block$d(ctx);

    	const block = {
    		c: function create() {
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			if (if_block) if_block.c();
    			attr_dev(g, "class", "axis x-axis");
    			add_location(g, file$f, 35, 0, 747);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}

    			append_dev(g, each_1_anchor);
    			if (if_block) if_block.m(g, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*tickVals, $xScale, $yRange, xTick, isBandwidth, yTick, dxTick, dyTick, textAnchor, formatTick, $height, gridlines*/ 135163) {
    				each_value = /*tickVals*/ ctx[9];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$9(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$9(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*baseline*/ ctx[2] === true) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$d(ctx);
    					if_block.c();
    					if_block.m(g, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let isBandwidth;
    	let tickVals;
    	let $xScale;
    	let $yRange;
    	let $height;
    	let $width;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AxisX', slots, []);
    	const { width, height, xScale, yScale, yRange } = getContext('LayerCake');
    	validate_store(width, 'width');
    	component_subscribe($$self, width, value => $$invalidate(12, $width = value));
    	validate_store(height, 'height');
    	component_subscribe($$self, height, value => $$invalidate(11, $height = value));
    	validate_store(xScale, 'xScale');
    	component_subscribe($$self, xScale, value => $$invalidate(8, $xScale = value));
    	validate_store(yRange, 'yRange');
    	component_subscribe($$self, yRange, value => $$invalidate(10, $yRange = value));
    	let { gridlines = true } = $$props;
    	let { formatTick = d => d } = $$props;
    	let { baseline = false } = $$props;
    	let { snapTicks = false } = $$props;
    	let { ticks = undefined } = $$props;
    	let { xTick = undefined } = $$props;
    	let { yTick = 16 } = $$props;
    	let { dxTick = 0 } = $$props;
    	let { dyTick = 0 } = $$props;

    	function textAnchor(i) {
    		if (snapTicks === true) {
    			if (i === 0) {
    				return 'start';
    			}

    			if (i === tickVals.length - 1) {
    				return 'end';
    			}
    		}

    		return 'middle';
    	}

    	const writable_props = [
    		'gridlines',
    		'formatTick',
    		'baseline',
    		'snapTicks',
    		'ticks',
    		'xTick',
    		'yTick',
    		'dxTick',
    		'dyTick'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AxisX> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('gridlines' in $$props) $$invalidate(0, gridlines = $$props.gridlines);
    		if ('formatTick' in $$props) $$invalidate(1, formatTick = $$props.formatTick);
    		if ('baseline' in $$props) $$invalidate(2, baseline = $$props.baseline);
    		if ('snapTicks' in $$props) $$invalidate(18, snapTicks = $$props.snapTicks);
    		if ('ticks' in $$props) $$invalidate(19, ticks = $$props.ticks);
    		if ('xTick' in $$props) $$invalidate(3, xTick = $$props.xTick);
    		if ('yTick' in $$props) $$invalidate(4, yTick = $$props.yTick);
    		if ('dxTick' in $$props) $$invalidate(5, dxTick = $$props.dxTick);
    		if ('dyTick' in $$props) $$invalidate(6, dyTick = $$props.dyTick);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		width,
    		height,
    		xScale,
    		yScale,
    		yRange,
    		gridlines,
    		formatTick,
    		baseline,
    		snapTicks,
    		ticks,
    		xTick,
    		yTick,
    		dxTick,
    		dyTick,
    		textAnchor,
    		tickVals,
    		isBandwidth,
    		$xScale,
    		$yRange,
    		$height,
    		$width
    	});

    	$$self.$inject_state = $$props => {
    		if ('gridlines' in $$props) $$invalidate(0, gridlines = $$props.gridlines);
    		if ('formatTick' in $$props) $$invalidate(1, formatTick = $$props.formatTick);
    		if ('baseline' in $$props) $$invalidate(2, baseline = $$props.baseline);
    		if ('snapTicks' in $$props) $$invalidate(18, snapTicks = $$props.snapTicks);
    		if ('ticks' in $$props) $$invalidate(19, ticks = $$props.ticks);
    		if ('xTick' in $$props) $$invalidate(3, xTick = $$props.xTick);
    		if ('yTick' in $$props) $$invalidate(4, yTick = $$props.yTick);
    		if ('dxTick' in $$props) $$invalidate(5, dxTick = $$props.dxTick);
    		if ('dyTick' in $$props) $$invalidate(6, dyTick = $$props.dyTick);
    		if ('tickVals' in $$props) $$invalidate(9, tickVals = $$props.tickVals);
    		if ('isBandwidth' in $$props) $$invalidate(7, isBandwidth = $$props.isBandwidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$xScale*/ 256) {
    			$$invalidate(7, isBandwidth = typeof $xScale.bandwidth === 'function');
    		}

    		if ($$self.$$.dirty & /*ticks, isBandwidth, $xScale*/ 524672) {
    			$$invalidate(9, tickVals = Array.isArray(ticks)
    			? ticks
    			: isBandwidth ? $xScale.domain() : $xScale.ticks(ticks));
    		}
    	};

    	return [
    		gridlines,
    		formatTick,
    		baseline,
    		xTick,
    		yTick,
    		dxTick,
    		dyTick,
    		isBandwidth,
    		$xScale,
    		tickVals,
    		$yRange,
    		$height,
    		$width,
    		width,
    		height,
    		xScale,
    		yRange,
    		textAnchor,
    		snapTicks,
    		ticks
    	];
    }

    class AxisX extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
    			gridlines: 0,
    			formatTick: 1,
    			baseline: 2,
    			snapTicks: 18,
    			ticks: 19,
    			xTick: 3,
    			yTick: 4,
    			dxTick: 5,
    			dyTick: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AxisX",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get gridlines() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gridlines(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formatTick() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formatTick(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get baseline() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set baseline(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get snapTicks() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set snapTicks(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ticks() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ticks(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xTick() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xTick(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yTick() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yTick(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dxTick() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dxTick(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dyTick() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dyTick(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@onsvisual/svelte-charts/charts/shared/AxisY.svelte generated by Svelte v3.44.1 */
    const file$e = "node_modules/@onsvisual/svelte-charts/charts/shared/AxisY.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	child_ctx[19] = i;
    	return child_ctx;
    }

    // (26:3) {#if gridlines !== false}
    function create_if_block$c(ctx) {
    	let line;
    	let line_y__value;
    	let line_y__value_1;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "x2", "100%");

    			attr_dev(line, "y1", line_y__value = /*yTick*/ ctx[3] + (/*isBandwidth*/ ctx[7]
    			? /*$yScale*/ ctx[8].bandwidth() / 2
    			: 0));

    			attr_dev(line, "y2", line_y__value_1 = /*yTick*/ ctx[3] + (/*isBandwidth*/ ctx[7]
    			? /*$yScale*/ ctx[8].bandwidth() / 2
    			: 0));

    			attr_dev(line, "class", "svelte-tul7ef");
    			add_location(line, file$e, 26, 4, 764);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*yTick, isBandwidth, $yScale*/ 392 && line_y__value !== (line_y__value = /*yTick*/ ctx[3] + (/*isBandwidth*/ ctx[7]
    			? /*$yScale*/ ctx[8].bandwidth() / 2
    			: 0))) {
    				attr_dev(line, "y1", line_y__value);
    			}

    			if (dirty & /*yTick, isBandwidth, $yScale*/ 392 && line_y__value_1 !== (line_y__value_1 = /*yTick*/ ctx[3] + (/*isBandwidth*/ ctx[7]
    			? /*$yScale*/ ctx[8].bandwidth() / 2
    			: 0))) {
    				attr_dev(line, "y2", line_y__value_1);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(26:3) {#if gridlines !== false}",
    		ctx
    	});

    	return block;
    }

    // (24:1) {#each tickVals as tick, i}
    function create_each_block$8(ctx) {
    	let g;
    	let text_1;
    	let t_value = /*formatTick*/ ctx[1](/*tick*/ ctx[17]) + "";
    	let t;
    	let text_1_y_value;
    	let text_1_dx_value;
    	let text_1_dy_value;
    	let g_class_value;
    	let g_transform_value;
    	let if_block = /*gridlines*/ ctx[0] !== false && create_if_block$c(ctx);

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			if (if_block) if_block.c();
    			text_1 = svg_element("text");
    			t = text(t_value);
    			attr_dev(text_1, "x", /*xTick*/ ctx[2]);

    			attr_dev(text_1, "y", text_1_y_value = /*yTick*/ ctx[3] + (/*isBandwidth*/ ctx[7]
    			? /*$yScale*/ ctx[8].bandwidth() / 2
    			: 0));

    			attr_dev(text_1, "dx", text_1_dx_value = /*isBandwidth*/ ctx[7] ? -5 : /*dxTick*/ ctx[4]);
    			attr_dev(text_1, "dy", text_1_dy_value = /*isBandwidth*/ ctx[7] ? 4 : /*dyTick*/ ctx[5]);
    			set_style(text_1, "text-anchor", /*isBandwidth*/ ctx[7] ? 'end' : /*textAnchor*/ ctx[6]);
    			attr_dev(text_1, "class", "svelte-tul7ef");
    			add_location(text_1, file$e, 32, 3, 938);
    			attr_dev(g, "class", g_class_value = "tick tick-" + /*tick*/ ctx[17] + " svelte-tul7ef");
    			attr_dev(g, "transform", g_transform_value = "translate(" + (/*$xRange*/ ctx[11][0] + (/*isBandwidth*/ ctx[7] ? /*$padding*/ ctx[10].left : 0)) + ", " + /*$yScale*/ ctx[8](/*tick*/ ctx[17]) + ")");
    			add_location(g, file$e, 24, 2, 613);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			if (if_block) if_block.m(g, null);
    			append_dev(g, text_1);
    			append_dev(text_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (/*gridlines*/ ctx[0] !== false) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$c(ctx);
    					if_block.c();
    					if_block.m(g, text_1);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*formatTick, tickVals*/ 514 && t_value !== (t_value = /*formatTick*/ ctx[1](/*tick*/ ctx[17]) + "")) set_data_dev(t, t_value);

    			if (dirty & /*xTick*/ 4) {
    				attr_dev(text_1, "x", /*xTick*/ ctx[2]);
    			}

    			if (dirty & /*yTick, isBandwidth, $yScale*/ 392 && text_1_y_value !== (text_1_y_value = /*yTick*/ ctx[3] + (/*isBandwidth*/ ctx[7]
    			? /*$yScale*/ ctx[8].bandwidth() / 2
    			: 0))) {
    				attr_dev(text_1, "y", text_1_y_value);
    			}

    			if (dirty & /*isBandwidth, dxTick*/ 144 && text_1_dx_value !== (text_1_dx_value = /*isBandwidth*/ ctx[7] ? -5 : /*dxTick*/ ctx[4])) {
    				attr_dev(text_1, "dx", text_1_dx_value);
    			}

    			if (dirty & /*isBandwidth, dyTick*/ 160 && text_1_dy_value !== (text_1_dy_value = /*isBandwidth*/ ctx[7] ? 4 : /*dyTick*/ ctx[5])) {
    				attr_dev(text_1, "dy", text_1_dy_value);
    			}

    			if (dirty & /*isBandwidth, textAnchor*/ 192) {
    				set_style(text_1, "text-anchor", /*isBandwidth*/ ctx[7] ? 'end' : /*textAnchor*/ ctx[6]);
    			}

    			if (dirty & /*tickVals*/ 512 && g_class_value !== (g_class_value = "tick tick-" + /*tick*/ ctx[17] + " svelte-tul7ef")) {
    				attr_dev(g, "class", g_class_value);
    			}

    			if (dirty & /*$xRange, isBandwidth, $padding, $yScale, tickVals*/ 3968 && g_transform_value !== (g_transform_value = "translate(" + (/*$xRange*/ ctx[11][0] + (/*isBandwidth*/ ctx[7] ? /*$padding*/ ctx[10].left : 0)) + ", " + /*$yScale*/ ctx[8](/*tick*/ ctx[17]) + ")")) {
    				attr_dev(g, "transform", g_transform_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(24:1) {#each tickVals as tick, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let g;
    	let g_transform_value;
    	let each_value = /*tickVals*/ ctx[9];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(g, "class", "axis y-axis");
    			attr_dev(g, "transform", g_transform_value = "translate(" + -/*$padding*/ ctx[10].left + ", 0)");
    			add_location(g, file$e, 22, 0, 515);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*tickVals, $xRange, isBandwidth, $padding, $yScale, xTick, yTick, dxTick, dyTick, textAnchor, formatTick, gridlines*/ 4095) {
    				each_value = /*tickVals*/ ctx[9];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*$padding*/ 1024 && g_transform_value !== (g_transform_value = "translate(" + -/*$padding*/ ctx[10].left + ", 0)")) {
    				attr_dev(g, "transform", g_transform_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let isBandwidth;
    	let tickVals;
    	let $yScale;
    	let $padding;
    	let $xRange;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AxisY', slots, []);
    	const { padding, xRange, xScale, yScale } = getContext('LayerCake');
    	validate_store(padding, 'padding');
    	component_subscribe($$self, padding, value => $$invalidate(10, $padding = value));
    	validate_store(xRange, 'xRange');
    	component_subscribe($$self, xRange, value => $$invalidate(11, $xRange = value));
    	validate_store(yScale, 'yScale');
    	component_subscribe($$self, yScale, value => $$invalidate(8, $yScale = value));
    	let { ticks = 4 } = $$props;
    	let { gridlines = true } = $$props;
    	let { formatTick = d => d } = $$props;
    	let { xTick = 0 } = $$props;
    	let { yTick = 0 } = $$props;
    	let { dxTick = 0 } = $$props;
    	let { dyTick = -4 } = $$props;
    	let { textAnchor = 'start' } = $$props;

    	const writable_props = [
    		'ticks',
    		'gridlines',
    		'formatTick',
    		'xTick',
    		'yTick',
    		'dxTick',
    		'dyTick',
    		'textAnchor'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AxisY> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('ticks' in $$props) $$invalidate(15, ticks = $$props.ticks);
    		if ('gridlines' in $$props) $$invalidate(0, gridlines = $$props.gridlines);
    		if ('formatTick' in $$props) $$invalidate(1, formatTick = $$props.formatTick);
    		if ('xTick' in $$props) $$invalidate(2, xTick = $$props.xTick);
    		if ('yTick' in $$props) $$invalidate(3, yTick = $$props.yTick);
    		if ('dxTick' in $$props) $$invalidate(4, dxTick = $$props.dxTick);
    		if ('dyTick' in $$props) $$invalidate(5, dyTick = $$props.dyTick);
    		if ('textAnchor' in $$props) $$invalidate(6, textAnchor = $$props.textAnchor);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		padding,
    		xRange,
    		xScale,
    		yScale,
    		ticks,
    		gridlines,
    		formatTick,
    		xTick,
    		yTick,
    		dxTick,
    		dyTick,
    		textAnchor,
    		isBandwidth,
    		tickVals,
    		$yScale,
    		$padding,
    		$xRange
    	});

    	$$self.$inject_state = $$props => {
    		if ('ticks' in $$props) $$invalidate(15, ticks = $$props.ticks);
    		if ('gridlines' in $$props) $$invalidate(0, gridlines = $$props.gridlines);
    		if ('formatTick' in $$props) $$invalidate(1, formatTick = $$props.formatTick);
    		if ('xTick' in $$props) $$invalidate(2, xTick = $$props.xTick);
    		if ('yTick' in $$props) $$invalidate(3, yTick = $$props.yTick);
    		if ('dxTick' in $$props) $$invalidate(4, dxTick = $$props.dxTick);
    		if ('dyTick' in $$props) $$invalidate(5, dyTick = $$props.dyTick);
    		if ('textAnchor' in $$props) $$invalidate(6, textAnchor = $$props.textAnchor);
    		if ('isBandwidth' in $$props) $$invalidate(7, isBandwidth = $$props.isBandwidth);
    		if ('tickVals' in $$props) $$invalidate(9, tickVals = $$props.tickVals);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$yScale*/ 256) {
    			$$invalidate(7, isBandwidth = typeof $yScale.bandwidth === 'function');
    		}

    		if ($$self.$$.dirty & /*ticks, isBandwidth, $yScale*/ 33152) {
    			$$invalidate(9, tickVals = Array.isArray(ticks)
    			? ticks
    			: isBandwidth ? $yScale.domain() : $yScale.ticks(ticks));
    		}
    	};

    	return [
    		gridlines,
    		formatTick,
    		xTick,
    		yTick,
    		dxTick,
    		dyTick,
    		textAnchor,
    		isBandwidth,
    		$yScale,
    		tickVals,
    		$padding,
    		$xRange,
    		padding,
    		xRange,
    		yScale,
    		ticks
    	];
    }

    class AxisY extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
    			ticks: 15,
    			gridlines: 0,
    			formatTick: 1,
    			xTick: 2,
    			yTick: 3,
    			dxTick: 4,
    			dyTick: 5,
    			textAnchor: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AxisY",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get ticks() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ticks(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gridlines() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gridlines(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formatTick() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formatTick(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xTick() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xTick(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yTick() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yTick(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dxTick() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dxTick(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dyTick() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dyTick(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get textAnchor() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set textAnchor(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function tree_add(d) {
      const x = +this._x.call(null, d),
          y = +this._y.call(null, d);
      return add(this.cover(x, y), x, y, d);
    }

    function add(tree, x, y, d) {
      if (isNaN(x) || isNaN(y)) return tree; // ignore invalid points

      var parent,
          node = tree._root,
          leaf = {data: d},
          x0 = tree._x0,
          y0 = tree._y0,
          x1 = tree._x1,
          y1 = tree._y1,
          xm,
          ym,
          xp,
          yp,
          right,
          bottom,
          i,
          j;

      // If the tree is empty, initialize the root as a leaf.
      if (!node) return tree._root = leaf, tree;

      // Find the existing leaf for the new point, or add it.
      while (node.length) {
        if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
        if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
        if (parent = node, !(node = node[i = bottom << 1 | right])) return parent[i] = leaf, tree;
      }

      // Is the new point is exactly coincident with the existing point?
      xp = +tree._x.call(null, node.data);
      yp = +tree._y.call(null, node.data);
      if (x === xp && y === yp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;

      // Otherwise, split the leaf node until the old and new point are separated.
      do {
        parent = parent ? parent[i] = new Array(4) : tree._root = new Array(4);
        if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
        if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
      } while ((i = bottom << 1 | right) === (j = (yp >= ym) << 1 | (xp >= xm)));
      return parent[j] = node, parent[i] = leaf, tree;
    }

    function addAll(data) {
      var d, i, n = data.length,
          x,
          y,
          xz = new Array(n),
          yz = new Array(n),
          x0 = Infinity,
          y0 = Infinity,
          x1 = -Infinity,
          y1 = -Infinity;

      // Compute the points and their extent.
      for (i = 0; i < n; ++i) {
        if (isNaN(x = +this._x.call(null, d = data[i])) || isNaN(y = +this._y.call(null, d))) continue;
        xz[i] = x;
        yz[i] = y;
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }

      // If there were no (valid) points, abort.
      if (x0 > x1 || y0 > y1) return this;

      // Expand the tree to cover the new points.
      this.cover(x0, y0).cover(x1, y1);

      // Add the new points.
      for (i = 0; i < n; ++i) {
        add(this, xz[i], yz[i], data[i]);
      }

      return this;
    }

    function tree_cover(x, y) {
      if (isNaN(x = +x) || isNaN(y = +y)) return this; // ignore invalid points

      var x0 = this._x0,
          y0 = this._y0,
          x1 = this._x1,
          y1 = this._y1;

      // If the quadtree has no extent, initialize them.
      // Integer extent are necessary so that if we later double the extent,
      // the existing quadrant boundaries don’t change due to floating point error!
      if (isNaN(x0)) {
        x1 = (x0 = Math.floor(x)) + 1;
        y1 = (y0 = Math.floor(y)) + 1;
      }

      // Otherwise, double repeatedly to cover.
      else {
        var z = x1 - x0 || 1,
            node = this._root,
            parent,
            i;

        while (x0 > x || x >= x1 || y0 > y || y >= y1) {
          i = (y < y0) << 1 | (x < x0);
          parent = new Array(4), parent[i] = node, node = parent, z *= 2;
          switch (i) {
            case 0: x1 = x0 + z, y1 = y0 + z; break;
            case 1: x0 = x1 - z, y1 = y0 + z; break;
            case 2: x1 = x0 + z, y0 = y1 - z; break;
            case 3: x0 = x1 - z, y0 = y1 - z; break;
          }
        }

        if (this._root && this._root.length) this._root = node;
      }

      this._x0 = x0;
      this._y0 = y0;
      this._x1 = x1;
      this._y1 = y1;
      return this;
    }

    function tree_data() {
      var data = [];
      this.visit(function(node) {
        if (!node.length) do data.push(node.data); while (node = node.next)
      });
      return data;
    }

    function tree_extent(_) {
      return arguments.length
          ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1])
          : isNaN(this._x0) ? undefined : [[this._x0, this._y0], [this._x1, this._y1]];
    }

    function Quad(node, x0, y0, x1, y1) {
      this.node = node;
      this.x0 = x0;
      this.y0 = y0;
      this.x1 = x1;
      this.y1 = y1;
    }

    function tree_find(x, y, radius) {
      var data,
          x0 = this._x0,
          y0 = this._y0,
          x1,
          y1,
          x2,
          y2,
          x3 = this._x1,
          y3 = this._y1,
          quads = [],
          node = this._root,
          q,
          i;

      if (node) quads.push(new Quad(node, x0, y0, x3, y3));
      if (radius == null) radius = Infinity;
      else {
        x0 = x - radius, y0 = y - radius;
        x3 = x + radius, y3 = y + radius;
        radius *= radius;
      }

      while (q = quads.pop()) {

        // Stop searching if this quadrant can’t contain a closer node.
        if (!(node = q.node)
            || (x1 = q.x0) > x3
            || (y1 = q.y0) > y3
            || (x2 = q.x1) < x0
            || (y2 = q.y1) < y0) continue;

        // Bisect the current quadrant.
        if (node.length) {
          var xm = (x1 + x2) / 2,
              ym = (y1 + y2) / 2;

          quads.push(
            new Quad(node[3], xm, ym, x2, y2),
            new Quad(node[2], x1, ym, xm, y2),
            new Quad(node[1], xm, y1, x2, ym),
            new Quad(node[0], x1, y1, xm, ym)
          );

          // Visit the closest quadrant first.
          if (i = (y >= ym) << 1 | (x >= xm)) {
            q = quads[quads.length - 1];
            quads[quads.length - 1] = quads[quads.length - 1 - i];
            quads[quads.length - 1 - i] = q;
          }
        }

        // Visit this point. (Visiting coincident points isn’t necessary!)
        else {
          var dx = x - +this._x.call(null, node.data),
              dy = y - +this._y.call(null, node.data),
              d2 = dx * dx + dy * dy;
          if (d2 < radius) {
            var d = Math.sqrt(radius = d2);
            x0 = x - d, y0 = y - d;
            x3 = x + d, y3 = y + d;
            data = node.data;
          }
        }
      }

      return data;
    }

    function tree_remove(d) {
      if (isNaN(x = +this._x.call(null, d)) || isNaN(y = +this._y.call(null, d))) return this; // ignore invalid points

      var parent,
          node = this._root,
          retainer,
          previous,
          next,
          x0 = this._x0,
          y0 = this._y0,
          x1 = this._x1,
          y1 = this._y1,
          x,
          y,
          xm,
          ym,
          right,
          bottom,
          i,
          j;

      // If the tree is empty, initialize the root as a leaf.
      if (!node) return this;

      // Find the leaf node for the point.
      // While descending, also retain the deepest parent with a non-removed sibling.
      if (node.length) while (true) {
        if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
        if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
        if (!(parent = node, node = node[i = bottom << 1 | right])) return this;
        if (!node.length) break;
        if (parent[(i + 1) & 3] || parent[(i + 2) & 3] || parent[(i + 3) & 3]) retainer = parent, j = i;
      }

      // Find the point to remove.
      while (node.data !== d) if (!(previous = node, node = node.next)) return this;
      if (next = node.next) delete node.next;

      // If there are multiple coincident points, remove just the point.
      if (previous) return (next ? previous.next = next : delete previous.next), this;

      // If this is the root point, remove it.
      if (!parent) return this._root = next, this;

      // Remove this leaf.
      next ? parent[i] = next : delete parent[i];

      // If the parent now contains exactly one leaf, collapse superfluous parents.
      if ((node = parent[0] || parent[1] || parent[2] || parent[3])
          && node === (parent[3] || parent[2] || parent[1] || parent[0])
          && !node.length) {
        if (retainer) retainer[j] = node;
        else this._root = node;
      }

      return this;
    }

    function removeAll(data) {
      for (var i = 0, n = data.length; i < n; ++i) this.remove(data[i]);
      return this;
    }

    function tree_root() {
      return this._root;
    }

    function tree_size() {
      var size = 0;
      this.visit(function(node) {
        if (!node.length) do ++size; while (node = node.next)
      });
      return size;
    }

    function tree_visit(callback) {
      var quads = [], q, node = this._root, child, x0, y0, x1, y1;
      if (node) quads.push(new Quad(node, this._x0, this._y0, this._x1, this._y1));
      while (q = quads.pop()) {
        if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
          var xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
          if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
          if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
          if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
          if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
        }
      }
      return this;
    }

    function tree_visitAfter(callback) {
      var quads = [], next = [], q;
      if (this._root) quads.push(new Quad(this._root, this._x0, this._y0, this._x1, this._y1));
      while (q = quads.pop()) {
        var node = q.node;
        if (node.length) {
          var child, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
          if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
          if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
          if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
          if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
        }
        next.push(q);
      }
      while (q = next.pop()) {
        callback(q.node, q.x0, q.y0, q.x1, q.y1);
      }
      return this;
    }

    function defaultX(d) {
      return d[0];
    }

    function tree_x(_) {
      return arguments.length ? (this._x = _, this) : this._x;
    }

    function defaultY(d) {
      return d[1];
    }

    function tree_y(_) {
      return arguments.length ? (this._y = _, this) : this._y;
    }

    function quadtree(nodes, x, y) {
      var tree = new Quadtree(x == null ? defaultX : x, y == null ? defaultY : y, NaN, NaN, NaN, NaN);
      return nodes == null ? tree : tree.addAll(nodes);
    }

    function Quadtree(x, y, x0, y0, x1, y1) {
      this._x = x;
      this._y = y;
      this._x0 = x0;
      this._y0 = y0;
      this._x1 = x1;
      this._y1 = y1;
      this._root = undefined;
    }

    function leaf_copy(leaf) {
      var copy = {data: leaf.data}, next = copy;
      while (leaf = leaf.next) next = next.next = {data: leaf.data};
      return copy;
    }

    var treeProto = quadtree.prototype = Quadtree.prototype;

    treeProto.copy = function() {
      var copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1),
          node = this._root,
          nodes,
          child;

      if (!node) return copy;

      if (!node.length) return copy._root = leaf_copy(node), copy;

      nodes = [{source: node, target: copy._root = new Array(4)}];
      while (node = nodes.pop()) {
        for (var i = 0; i < 4; ++i) {
          if (child = node.source[i]) {
            if (child.length) nodes.push({source: child, target: node.target[i] = new Array(4)});
            else node.target[i] = leaf_copy(child);
          }
        }
      }

      return copy;
    };

    treeProto.add = tree_add;
    treeProto.addAll = addAll;
    treeProto.cover = tree_cover;
    treeProto.data = tree_data;
    treeProto.extent = tree_extent;
    treeProto.find = tree_find;
    treeProto.remove = tree_remove;
    treeProto.removeAll = removeAll;
    treeProto.root = tree_root;
    treeProto.size = tree_size;
    treeProto.visit = tree_visit;
    treeProto.visitAfter = tree_visitAfter;
    treeProto.x = tree_x;
    treeProto.y = tree_y;

    /* node_modules/@onsvisual/svelte-charts/charts/shared/QuadTree.svelte generated by Svelte v3.44.1 */

    const { Object: Object_1$8 } = globals;
    const file$d = "node_modules/@onsvisual/svelte-charts/charts/shared/QuadTree.svelte";

    const get_default_slot_changes = dirty => ({
    	x: dirty & /*xGetter, found*/ 10,
    	y: dirty & /*yGetter, found*/ 9,
    	found: dirty & /*found*/ 8,
    	visible: dirty & /*visible*/ 4,
    	e: dirty & /*e*/ 16
    });

    const get_default_slot_context = ctx => ({
    	x: /*xGetter*/ ctx[1](/*found*/ ctx[3]) || 0,
    	y: /*yGetter*/ ctx[0](/*found*/ ctx[3]) || 0,
    	found: /*found*/ ctx[3],
    	visible: /*visible*/ ctx[2],
    	e: /*e*/ ctx[4]
    });

    function create_fragment$d(ctx) {
    	let div;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[22].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[21], get_default_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "bg svelte-19xh5jy");
    			add_location(div, file$d, 49, 0, 1027);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "mousemove", /*findItem*/ ctx[10], false, false, false),
    					listen_dev(div, "mouseout", /*mouseout_handler*/ ctx[23], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, xGetter, found, yGetter, visible, e*/ 2097183)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[21],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[21])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[21], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let xGetter;
    	let yGetter;
    	let finder;
    	let $data;
    	let $height;
    	let $width;
    	let $xGet;
    	let $yGet;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('QuadTree', slots, ['default']);
    	const { data, xGet, yGet, width, height } = getContext('LayerCake');
    	validate_store(data, 'data');
    	component_subscribe($$self, data, value => $$invalidate(16, $data = value));
    	validate_store(xGet, 'xGet');
    	component_subscribe($$self, xGet, value => $$invalidate(19, $xGet = value));
    	validate_store(yGet, 'yGet');
    	component_subscribe($$self, yGet, value => $$invalidate(20, $yGet = value));
    	validate_store(width, 'width');
    	component_subscribe($$self, width, value => $$invalidate(18, $width = value));
    	validate_store(height, 'height');
    	component_subscribe($$self, height, value => $$invalidate(17, $height = value));
    	let visible = false;
    	let found = {};
    	let e = {};
    	let { dataset = undefined } = $$props;
    	let { x = 'x' } = $$props;
    	let { y = 'y' } = $$props;
    	let { searchRadius = undefined } = $$props;
    	let { selected = null } = $$props;

    	function findItem(evt) {
    		$$invalidate(4, e = evt);
    		const xLayerKey = `layer${x.toUpperCase()}`;
    		const yLayerKey = `layer${y.toUpperCase()}`;
    		$$invalidate(3, found = finder.find(evt[xLayerKey], evt[yLayerKey], searchRadius) || {});
    		$$invalidate(2, visible = Object.keys(found).length > 0);
    	}

    	const writable_props = ['dataset', 'x', 'y', 'searchRadius', 'selected'];

    	Object_1$8.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<QuadTree> was created with unknown prop '${key}'`);
    	});

    	const mouseout_handler = () => $$invalidate(2, visible = false);

    	$$self.$$set = $$props => {
    		if ('dataset' in $$props) $$invalidate(11, dataset = $$props.dataset);
    		if ('x' in $$props) $$invalidate(12, x = $$props.x);
    		if ('y' in $$props) $$invalidate(13, y = $$props.y);
    		if ('searchRadius' in $$props) $$invalidate(14, searchRadius = $$props.searchRadius);
    		if ('selected' in $$props) $$invalidate(15, selected = $$props.selected);
    		if ('$$scope' in $$props) $$invalidate(21, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		quadtree,
    		data,
    		xGet,
    		yGet,
    		width,
    		height,
    		visible,
    		found,
    		e,
    		dataset,
    		x,
    		y,
    		searchRadius,
    		selected,
    		findItem,
    		yGetter,
    		xGetter,
    		finder,
    		$data,
    		$height,
    		$width,
    		$xGet,
    		$yGet
    	});

    	$$self.$inject_state = $$props => {
    		if ('visible' in $$props) $$invalidate(2, visible = $$props.visible);
    		if ('found' in $$props) $$invalidate(3, found = $$props.found);
    		if ('e' in $$props) $$invalidate(4, e = $$props.e);
    		if ('dataset' in $$props) $$invalidate(11, dataset = $$props.dataset);
    		if ('x' in $$props) $$invalidate(12, x = $$props.x);
    		if ('y' in $$props) $$invalidate(13, y = $$props.y);
    		if ('searchRadius' in $$props) $$invalidate(14, searchRadius = $$props.searchRadius);
    		if ('selected' in $$props) $$invalidate(15, selected = $$props.selected);
    		if ('yGetter' in $$props) $$invalidate(0, yGetter = $$props.yGetter);
    		if ('xGetter' in $$props) $$invalidate(1, xGetter = $$props.xGetter);
    		if ('finder' in $$props) finder = $$props.finder;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*x, $xGet, $yGet*/ 1576960) {
    			$$invalidate(1, xGetter = x === 'x' ? $xGet : $yGet);
    		}

    		if ($$self.$$.dirty & /*y, $yGet, $xGet*/ 1581056) {
    			$$invalidate(0, yGetter = y === 'y' ? $yGet : $xGet);
    		}

    		if ($$self.$$.dirty & /*selected, $data*/ 98304) {
    			$$invalidate(11, dataset = !selected
    			? undefined
    			: $data.filter(d => d[selected.col] == selected.value));
    		}

    		if ($$self.$$.dirty & /*$width, $height, xGetter, yGetter, dataset, $data*/ 460803) {
    			finder = quadtree().extent([[-1, -1], [$width + 1, $height + 1]]).x(xGetter).y(yGetter).addAll(dataset || $data);
    		}
    	};

    	return [
    		yGetter,
    		xGetter,
    		visible,
    		found,
    		e,
    		data,
    		xGet,
    		yGet,
    		width,
    		height,
    		findItem,
    		dataset,
    		x,
    		y,
    		searchRadius,
    		selected,
    		$data,
    		$height,
    		$width,
    		$xGet,
    		$yGet,
    		$$scope,
    		slots,
    		mouseout_handler
    	];
    }

    class QuadTree extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			dataset: 11,
    			x: 12,
    			y: 13,
    			searchRadius: 14,
    			selected: 15
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "QuadTree",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get dataset() {
    		throw new Error("<QuadTree>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataset(value) {
    		throw new Error("<QuadTree>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<QuadTree>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<QuadTree>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<QuadTree>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<QuadTree>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get searchRadius() {
    		throw new Error("<QuadTree>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set searchRadius(value) {
    		throw new Error("<QuadTree>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<QuadTree>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<QuadTree>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@onsvisual/svelte-charts/charts/ScatterChart.svelte generated by Svelte v3.44.1 */
    const file$c = "node_modules/@onsvisual/svelte-charts/charts/ScatterChart.svelte";

    // (56:2) <Svg>
    function create_default_slot_4$1(ctx) {
    	let axisx;
    	let t;
    	let axisy;
    	let current;
    	axisx = new AxisX({ props: { ticks: 5 }, $$inline: true });
    	axisy = new AxisY({ props: { ticks: 5 }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(axisx.$$.fragment);
    			t = space();
    			create_component(axisy.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(axisx, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(axisy, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(axisx.$$.fragment, local);
    			transition_in(axisy.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(axisx.$$.fragment, local);
    			transition_out(axisy.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(axisx, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(axisy, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(56:2) <Svg>",
    		ctx
    	});

    	return block;
    }

    // (65:2) <WebGL>
    function create_default_slot_3$1(ctx) {
    	let plot;
    	let current;

    	plot = new Scatter({
    			props: {
    				diameter: /*diameter*/ ctx[1],
    				colors: /*colors*/ ctx[2],
    				categories: /*categories*/ ctx[3],
    				catKey: /*catKey*/ ctx[7],
    				selected: /*selected*/ ctx[4]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(plot.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(plot, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const plot_changes = {};
    			if (dirty & /*diameter*/ 2) plot_changes.diameter = /*diameter*/ ctx[1];
    			if (dirty & /*colors*/ 4) plot_changes.colors = /*colors*/ ctx[2];
    			if (dirty & /*categories*/ 8) plot_changes.categories = /*categories*/ ctx[3];
    			if (dirty & /*catKey*/ 128) plot_changes.catKey = /*catKey*/ ctx[7];
    			if (dirty & /*selected*/ 16) plot_changes.selected = /*selected*/ ctx[4];
    			plot.$set(plot_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(plot.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(plot.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(plot, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(65:2) <WebGL>",
    		ctx
    	});

    	return block;
    }

    // (90:5) {#if found.lad_name}
    function create_if_block$b(ctx) {
    	let t0_value = /*found*/ ctx[11].lad_name + "";
    	let t0;
    	let t1;
    	let t2_value = /*found*/ ctx[11].lsoa_name + "";
    	let t2;
    	let br;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(t2_value);
    			br = element("br");
    			add_location(br, file$c, 89, 59, 1703);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, br, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*found*/ 2048 && t0_value !== (t0_value = /*found*/ ctx[11].lad_name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*found*/ 2048 && t2_value !== (t2_value = /*found*/ ctx[11].lsoa_name + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(90:5) {#if found.lad_name}",
    		ctx
    	});

    	return block;
    }

    // (76:3) <QuadTree     let:x     let:y     let:visible     let:found     {selected}    >
    function create_default_slot_2$1(ctx) {
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let t2;
    	let t3_value = Number(/*found*/ ctx[11][/*xKey*/ ctx[5]]).toFixed(2) + "";
    	let t3;
    	let br0;
    	let t4;
    	let t5;
    	let t6_value = Number(/*found*/ ctx[11][/*yKey*/ ctx[6]]).toFixed(2) + "";
    	let t6;
    	let br1;
    	let if_block = /*found*/ ctx[11].lad_name && create_if_block$b(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t1 = text(/*xKey*/ ctx[5]);
    			t2 = text(": ");
    			t3 = text(t3_value);
    			br0 = element("br");
    			t4 = text(/*yKey*/ ctx[6]);
    			t5 = text(": ");
    			t6 = text(t6_value);
    			br1 = element("br");
    			attr_dev(div0, "class", "circle svelte-10r5gty");
    			set_style(div0, "top", /*y*/ ctx[9] + "px");
    			set_style(div0, "left", /*x*/ ctx[8] + "px");
    			set_style(div0, "display", /*visible*/ ctx[10] ? 'block' : 'none');
    			add_location(div0, file$c, 82, 4, 1419);
    			add_location(br0, file$c, 89, 110, 1754);
    			add_location(br1, file$c, 89, 155, 1799);
    			attr_dev(div1, "class", "tooltip svelte-10r5gty");
    			set_style(div1, "top", /*y*/ ctx[9] + 5 + "px");
    			set_style(div1, "left", /*x*/ ctx[8] + 10 + "px");
    			set_style(div1, "display", /*visible*/ ctx[10] ? 'block' : 'none');
    			add_location(div1, file$c, 86, 4, 1535);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, t2);
    			append_dev(div1, t3);
    			append_dev(div1, br0);
    			append_dev(div1, t4);
    			append_dev(div1, t5);
    			append_dev(div1, t6);
    			append_dev(div1, br1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*y*/ 512) {
    				set_style(div0, "top", /*y*/ ctx[9] + "px");
    			}

    			if (dirty & /*x*/ 256) {
    				set_style(div0, "left", /*x*/ ctx[8] + "px");
    			}

    			if (dirty & /*visible*/ 1024) {
    				set_style(div0, "display", /*visible*/ ctx[10] ? 'block' : 'none');
    			}

    			if (/*found*/ ctx[11].lad_name) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$b(ctx);
    					if_block.c();
    					if_block.m(div1, t1);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*xKey*/ 32) set_data_dev(t1, /*xKey*/ ctx[5]);
    			if (dirty & /*found, xKey*/ 2080 && t3_value !== (t3_value = Number(/*found*/ ctx[11][/*xKey*/ ctx[5]]).toFixed(2) + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*yKey*/ 64) set_data_dev(t4, /*yKey*/ ctx[6]);
    			if (dirty & /*found, yKey*/ 2112 && t6_value !== (t6_value = Number(/*found*/ ctx[11][/*yKey*/ ctx[6]]).toFixed(2) + "")) set_data_dev(t6, t6_value);

    			if (dirty & /*y*/ 512) {
    				set_style(div1, "top", /*y*/ ctx[9] + 5 + "px");
    			}

    			if (dirty & /*x*/ 256) {
    				set_style(div1, "left", /*x*/ ctx[8] + 10 + "px");
    			}

    			if (dirty & /*visible*/ 1024) {
    				set_style(div1, "display", /*visible*/ ctx[10] ? 'block' : 'none');
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(76:3) <QuadTree     let:x     let:y     let:visible     let:found     {selected}    >",
    		ctx
    	});

    	return block;
    }

    // (75:2) <Html>
    function create_default_slot_1$9(ctx) {
    	let quadtree;
    	let current;

    	quadtree = new QuadTree({
    			props: {
    				selected: /*selected*/ ctx[4],
    				$$slots: {
    					default: [
    						create_default_slot_2$1,
    						({ x, y, visible, found }) => ({ 8: x, 9: y, 10: visible, 11: found }),
    						({ x, y, visible, found }) => (x ? 256 : 0) | (y ? 512 : 0) | (visible ? 1024 : 0) | (found ? 2048 : 0)
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(quadtree.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(quadtree, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const quadtree_changes = {};
    			if (dirty & /*selected*/ 16) quadtree_changes.selected = /*selected*/ ctx[4];

    			if (dirty & /*$$scope, y, x, visible, found, yKey, xKey*/ 8032) {
    				quadtree_changes.$$scope = { dirty, ctx };
    			}

    			quadtree.$set(quadtree_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(quadtree.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(quadtree.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(quadtree, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$9.name,
    		type: "slot",
    		source: "(75:2) <Html>",
    		ctx
    	});

    	return block;
    }

    // (48:1) <LayerCake   padding={{ top: 10, right: 5, bottom: 20, left: 25 }}   x={xKey}   y={yKey}   xPadding={[padding, padding]}   yPadding={[padding, padding]}   {data}  >
    function create_default_slot$9(ctx) {
    	let svg;
    	let t0;
    	let webgl;
    	let t1;
    	let html;
    	let current;

    	svg = new Svg({
    			props: {
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	webgl = new Webgl({
    			props: {
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	html = new Html({
    			props: {
    				$$slots: { default: [create_default_slot_1$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(svg.$$.fragment);
    			t0 = space();
    			create_component(webgl.$$.fragment);
    			t1 = space();
    			create_component(html.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(svg, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(webgl, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(html, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const svg_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				svg_changes.$$scope = { dirty, ctx };
    			}

    			svg.$set(svg_changes);
    			const webgl_changes = {};

    			if (dirty & /*$$scope, diameter, colors, categories, catKey, selected*/ 4254) {
    				webgl_changes.$$scope = { dirty, ctx };
    			}

    			webgl.$set(webgl_changes);
    			const html_changes = {};

    			if (dirty & /*$$scope, selected, yKey, xKey*/ 4208) {
    				html_changes.$$scope = { dirty, ctx };
    			}

    			html.$set(html_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svg.$$.fragment, local);
    			transition_in(webgl.$$.fragment, local);
    			transition_in(html.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svg.$$.fragment, local);
    			transition_out(webgl.$$.fragment, local);
    			transition_out(html.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(svg, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(webgl, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(html, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(48:1) <LayerCake   padding={{ top: 10, right: 5, bottom: 20, left: 25 }}   x={xKey}   y={yKey}   xPadding={[padding, padding]}   yPadding={[padding, padding]}   {data}  >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div;
    	let layercake;
    	let current;

    	layercake = new LayerCake({
    			props: {
    				padding: { top: 10, right: 5, bottom: 20, left: 25 },
    				x: /*xKey*/ ctx[5],
    				y: /*yKey*/ ctx[6],
    				xPadding: [padding, padding],
    				yPadding: [padding, padding],
    				data: /*data*/ ctx[0],
    				$$slots: { default: [create_default_slot$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(layercake.$$.fragment);
    			attr_dev(div, "class", "chart-container svelte-10r5gty");
    			add_location(div, file$c, 46, 0, 937);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(layercake, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const layercake_changes = {};
    			if (dirty & /*xKey*/ 32) layercake_changes.x = /*xKey*/ ctx[5];
    			if (dirty & /*yKey*/ 64) layercake_changes.y = /*yKey*/ ctx[6];
    			if (dirty & /*data*/ 1) layercake_changes.data = /*data*/ ctx[0];

    			if (dirty & /*$$scope, selected, yKey, xKey, diameter, colors, categories, catKey*/ 4350) {
    				layercake_changes.$$scope = { dirty, ctx };
    			}

    			layercake.$set(layercake_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layercake.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layercake.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(layercake);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const padding = 20;

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ScatterChart', slots, []);
    	let { data } = $$props;
    	let { diameter = 5 } = $$props;
    	let { colors = [[128, 128, 128]] } = $$props;
    	let { categories = null } = $$props;
    	let { selected = null } = $$props;
    	let { xKey = 'x' } = $$props;
    	let { yKey = 'y' } = $$props;
    	let { catKey = 'group' } = $$props;

    	const writable_props = [
    		'data',
    		'diameter',
    		'colors',
    		'categories',
    		'selected',
    		'xKey',
    		'yKey',
    		'catKey'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ScatterChart> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('diameter' in $$props) $$invalidate(1, diameter = $$props.diameter);
    		if ('colors' in $$props) $$invalidate(2, colors = $$props.colors);
    		if ('categories' in $$props) $$invalidate(3, categories = $$props.categories);
    		if ('selected' in $$props) $$invalidate(4, selected = $$props.selected);
    		if ('xKey' in $$props) $$invalidate(5, xKey = $$props.xKey);
    		if ('yKey' in $$props) $$invalidate(6, yKey = $$props.yKey);
    		if ('catKey' in $$props) $$invalidate(7, catKey = $$props.catKey);
    	};

    	$$self.$capture_state = () => ({
    		LayerCake,
    		Svg,
    		WebGL: Webgl,
    		Html,
    		Plot: Scatter,
    		AxisX,
    		AxisY,
    		QuadTree,
    		data,
    		diameter,
    		colors,
    		categories,
    		selected,
    		xKey,
    		yKey,
    		catKey,
    		padding
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('diameter' in $$props) $$invalidate(1, diameter = $$props.diameter);
    		if ('colors' in $$props) $$invalidate(2, colors = $$props.colors);
    		if ('categories' in $$props) $$invalidate(3, categories = $$props.categories);
    		if ('selected' in $$props) $$invalidate(4, selected = $$props.selected);
    		if ('xKey' in $$props) $$invalidate(5, xKey = $$props.xKey);
    		if ('yKey' in $$props) $$invalidate(6, yKey = $$props.yKey);
    		if ('catKey' in $$props) $$invalidate(7, catKey = $$props.catKey);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data, diameter, colors, categories, selected, xKey, yKey, catKey];
    }

    class ScatterChart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			data: 0,
    			diameter: 1,
    			colors: 2,
    			categories: 3,
    			selected: 4,
    			xKey: 5,
    			yKey: 6,
    			catKey: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ScatterChart",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[0] === undefined && !('data' in props)) {
    			console.warn("<ScatterChart> was created without expected prop 'data'");
    		}
    	}

    	get data() {
    		return this.$$.ctx[0];
    	}

    	set data(data) {
    		this.$$set({ data });
    		flush();
    	}

    	get diameter() {
    		return this.$$.ctx[1];
    	}

    	set diameter(diameter) {
    		this.$$set({ diameter });
    		flush();
    	}

    	get colors() {
    		return this.$$.ctx[2];
    	}

    	set colors(colors) {
    		this.$$set({ colors });
    		flush();
    	}

    	get categories() {
    		return this.$$.ctx[3];
    	}

    	set categories(categories) {
    		this.$$set({ categories });
    		flush();
    	}

    	get selected() {
    		return this.$$.ctx[4];
    	}

    	set selected(selected) {
    		this.$$set({ selected });
    		flush();
    	}

    	get xKey() {
    		return this.$$.ctx[5];
    	}

    	set xKey(xKey) {
    		this.$$set({ xKey });
    		flush();
    	}

    	get yKey() {
    		return this.$$.ctx[6];
    	}

    	set yKey(yKey) {
    		this.$$set({ yKey });
    		flush();
    	}

    	get catKey() {
    		return this.$$.ctx[7];
    	}

    	set catKey(catKey) {
    		this.$$set({ catKey });
    		flush();
    	}
    }

    /**
     * Returns a function, that, as long as it continues to be invoked, will not
     * be triggered. The function will be called after it stops being called for
     * N milliseconds. If `immediate` is passed, trigger the function on the
     * leading edge, instead of the trailing. The function also has a property 'clear' 
     * that is a function which will clear the timer to prevent previously scheduled executions. 
     *
     * @source underscore.js
     * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
     * @param {Function} function to wrap
     * @param {Number} timeout in ms (`100`)
     * @param {Boolean} whether to execute at the beginning (`false`)
     * @api public
     */
    function debounce(func, wait, immediate){
      var timeout, args, context, timestamp, result;
      if (null == wait) wait = 100;

      function later() {
        var last = Date.now() - timestamp;

        if (last < wait && last >= 0) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) {
            result = func.apply(context, args);
            context = args = null;
          }
        }
      }
      var debounced = function(){
        context = this;
        args = arguments;
        timestamp = Date.now();
        var callNow = immediate && !timeout;
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
          result = func.apply(context, args);
          context = args = null;
        }

        return result;
      };

      debounced.clear = function() {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
      };
      
      debounced.flush = function() {
        if (timeout) {
          result = func.apply(context, args);
          context = args = null;
          
          clearTimeout(timeout);
          timeout = null;
        }
      };

      return debounced;
    }
    // Adds compatibility for ES modules
    debounce.debounce = debounce;

    var debounce_1 = debounce;

    /* src/layout/Media.svelte generated by Svelte v3.44.1 */

    const { console: console_1 } = globals;
    const file$b = "src/layout/Media.svelte";

    // (109:0) {:else}
    function create_else_block$1(ctx) {
    	let figure;
    	let div1;
    	let div0;
    	let div0_class_value;
    	let div1_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			figure = element("figure");
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", div0_class_value = "grid" + /*gridClass*/ ctx[4] + " svelte-15qq8ff");
    			set_style(div0, "grid-gap", /*gridGap*/ ctx[8]);
    			set_style(div0, "min-height", /*rowHeight*/ ctx[7]);
    			add_location(div0, file$b, 111, 2, 2660);
    			attr_dev(div1, "class", div1_class_value = "col-" + /*col*/ ctx[1] + " svelte-15qq8ff");
    			add_location(div1, file$b, 110, 1, 2634);
    			set_style(figure, "color", themes[/*theme*/ ctx[0]]['text']);
    			set_style(figure, "background-color", themes[/*theme*/ ctx[0]]['background']);
    			add_location(figure, file$b, 109, 0, 2535);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, figure, anchor);
    			append_dev(figure, div1);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*gridClass*/ 16 && div0_class_value !== (div0_class_value = "grid" + /*gridClass*/ ctx[4] + " svelte-15qq8ff")) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (!current || dirty & /*col*/ 2 && div1_class_value !== (div1_class_value = "col-" + /*col*/ ctx[1] + " svelte-15qq8ff")) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (!current || dirty & /*theme*/ 1) {
    				set_style(figure, "color", themes[/*theme*/ ctx[0]]['text']);
    			}

    			if (!current || dirty & /*theme*/ 1) {
    				set_style(figure, "background-color", themes[/*theme*/ ctx[0]]['background']);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(figure);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(109:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (101:0) {#if nogrid}
    function create_if_block_1(ctx) {
    	let figure;
    	let div1;
    	let div0;
    	let div0_resize_listener;
    	let div1_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			figure = element("figure");
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "grid-ms svelte-15qq8ff");
    			add_render_callback(() => /*div0_elementresize_handler*/ ctx[15].call(div0));
    			add_location(div0, file$b, 103, 2, 2417);
    			attr_dev(div1, "class", div1_class_value = "col-" + /*col*/ ctx[1] + " svelte-15qq8ff");
    			add_location(div1, file$b, 102, 1, 2391);
    			set_style(figure, "color", themes[/*theme*/ ctx[0]]['text']);
    			set_style(figure, "background-color", themes[/*theme*/ ctx[0]]['background']);
    			add_location(figure, file$b, 101, 0, 2292);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, figure, anchor);
    			append_dev(figure, div1);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			/*div0_binding*/ ctx[14](div0);
    			div0_resize_listener = add_resize_listener(div0, /*div0_elementresize_handler*/ ctx[15].bind(div0));
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*col*/ 2 && div1_class_value !== (div1_class_value = "col-" + /*col*/ ctx[1] + " svelte-15qq8ff")) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (!current || dirty & /*theme*/ 1) {
    				set_style(figure, "color", themes[/*theme*/ ctx[0]]['text']);
    			}

    			if (!current || dirty & /*theme*/ 1) {
    				set_style(figure, "background-color", themes[/*theme*/ ctx[0]]['background']);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(figure);
    			if (default_slot) default_slot.d(detaching);
    			/*div0_binding*/ ctx[14](null);
    			div0_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(101:0) {#if nogrid}",
    		ctx
    	});

    	return block;
    }

    // (118:0) {#if caption}
    function create_if_block$a(ctx) {
    	let caption_1;
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			caption_1 = element("caption");
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", "caption");
    			add_location(div0, file$b, 120, 3, 2938);
    			attr_dev(div1, "class", "col-medium");
    			add_location(div1, file$b, 119, 2, 2910);
    			set_style(caption_1, "color", themes[/*theme*/ ctx[0]]['text']);
    			set_style(caption_1, "background-color", themes[/*theme*/ ctx[0]]['background']);
    			add_location(caption_1, file$b, 118, 1, 2809);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, caption_1, anchor);
    			append_dev(caption_1, div1);
    			append_dev(div1, div0);
    			div0.innerHTML = /*caption*/ ctx[2];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*caption*/ 4) div0.innerHTML = /*caption*/ ctx[2];
    			if (dirty & /*theme*/ 1) {
    				set_style(caption_1, "color", themes[/*theme*/ ctx[0]]['text']);
    			}

    			if (dirty & /*theme*/ 1) {
    				set_style(caption_1, "background-color", themes[/*theme*/ ctx[0]]['background']);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(caption_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(118:0) {#if caption}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let current_block_type_index;
    	let if_block0;
    	let t;
    	let if_block1_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*nogrid*/ ctx[6]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = /*caption*/ ctx[2] && create_if_block$a(ctx);

    	const block = {
    		c: function create() {
    			if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if_block0.p(ctx, dirty);

    			if (/*caption*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$a(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function supportsGrid() {
    	let div = document.createElement("div");
    	let val = "1px";
    	div.style["grid-gap"] = val;
    	return div.style["grid-gap"] === val;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Media', slots, ['default']);
    	const colWidths = { narrow: 200, medium: 300, wide: 500 };
    	let { theme = getContext("theme") } = $$props;
    	let { col = "medium" } = $$props;
    	let { grid = null } = $$props;
    	let { caption = null } = $$props;
    	let { height = 200 } = $$props;
    	let { gap = 12 } = $$props;
    	let gridClass = '';

    	if (grid !== '') {
    		gridClass = ` grid-${grid}`;
    	}

    	console.log(supportsGrid());
    	let nogrid = !supportsGrid();
    	let rowHeight = !Number.isNaN(height) ? height + "px" : height;
    	let gridGap = !Number.isNaN(gap) ? gap + "px" : gap;

    	// The code below this point mimics CSS Grid functionality in IE 11
    	const minWidth = grid && colWidths[grid] ? colWidths[grid] : null;

    	let gridWidth;
    	let cols;
    	let el;
    	let divs;
    	let count;

    	if (nogrid) {
    		onMount(() => {
    			resize();
    		});
    	}

    	const update = debounce_1.debounce(resize, 200);

    	function resize() {
    		if (el && !divs) {
    			let arr = [];
    			let children = el.childNodes;

    			children.forEach(child => {
    				if (child.nodeName == "DIV") {
    					arr.push(child);
    				}
    			});

    			divs = arr;
    		}

    		count = divs.length;

    		cols = !minWidth || gridWidth <= minWidth
    		? 1
    		: Math.floor(gridWidth / minWidth);

    		makeCols();
    	}

    	function makeCols() {
    		let r = Math.ceil(count / cols) > 1
    		? `-ms-grid-rows: ${rowHeight} (${gap}px ${rowHeight})[${Math.ceil(count / cols) - 1}]; grid-template-rows: ${rowHeight} repeat(${Math.ceil(count / cols) - 1}, ${gap}px ${rowHeight});`
    		: `-ms-grid-rows: ${rowHeight}; grid-template-rows: ${rowHeight};`;

    		let c = cols > 1
    		? `-ms-grid-columns: 1fr (${gap}px 1fr)[${cols - 1}]; grid-template-columns: 1fr repeat(${cols - 1}, ${gap}px 1fr);`
    		: "";

    		$$invalidate(5, el.style.cssText = r + c, el);

    		divs.forEach((div, i) => {
    			let col = i % cols * 2 + 1;
    			let row = Math.floor(i / cols) * 2 + 1;
    			div.style.cssText = `-ms-grid-column: ${col}; -ms-grid-row: ${row}; grid-column: ${col}; grid-row: ${row};`;
    		});
    	}

    	const writable_props = ['theme', 'col', 'grid', 'caption', 'height', 'gap'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Media> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			el = $$value;
    			$$invalidate(5, el);
    		});
    	}

    	function div0_elementresize_handler() {
    		gridWidth = this.clientWidth;
    		$$invalidate(3, gridWidth);
    	}

    	$$self.$$set = $$props => {
    		if ('theme' in $$props) $$invalidate(0, theme = $$props.theme);
    		if ('col' in $$props) $$invalidate(1, col = $$props.col);
    		if ('grid' in $$props) $$invalidate(9, grid = $$props.grid);
    		if ('caption' in $$props) $$invalidate(2, caption = $$props.caption);
    		if ('height' in $$props) $$invalidate(10, height = $$props.height);
    		if ('gap' in $$props) $$invalidate(11, gap = $$props.gap);
    		if ('$$scope' in $$props) $$invalidate(12, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		themes,
    		onMount,
    		getContext,
    		debounce: debounce_1.debounce,
    		colWidths,
    		theme,
    		col,
    		grid,
    		caption,
    		height,
    		gap,
    		gridClass,
    		supportsGrid,
    		nogrid,
    		rowHeight,
    		gridGap,
    		minWidth,
    		gridWidth,
    		cols,
    		el,
    		divs,
    		count,
    		update,
    		resize,
    		makeCols
    	});

    	$$self.$inject_state = $$props => {
    		if ('theme' in $$props) $$invalidate(0, theme = $$props.theme);
    		if ('col' in $$props) $$invalidate(1, col = $$props.col);
    		if ('grid' in $$props) $$invalidate(9, grid = $$props.grid);
    		if ('caption' in $$props) $$invalidate(2, caption = $$props.caption);
    		if ('height' in $$props) $$invalidate(10, height = $$props.height);
    		if ('gap' in $$props) $$invalidate(11, gap = $$props.gap);
    		if ('gridClass' in $$props) $$invalidate(4, gridClass = $$props.gridClass);
    		if ('nogrid' in $$props) $$invalidate(6, nogrid = $$props.nogrid);
    		if ('rowHeight' in $$props) $$invalidate(7, rowHeight = $$props.rowHeight);
    		if ('gridGap' in $$props) $$invalidate(8, gridGap = $$props.gridGap);
    		if ('gridWidth' in $$props) $$invalidate(3, gridWidth = $$props.gridWidth);
    		if ('cols' in $$props) cols = $$props.cols;
    		if ('el' in $$props) $$invalidate(5, el = $$props.el);
    		if ('divs' in $$props) divs = $$props.divs;
    		if ('count' in $$props) count = $$props.count;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*gridWidth*/ 8) {
    			nogrid && (minWidth || gridWidth) && update();
    		}
    	};

    	return [
    		theme,
    		col,
    		caption,
    		gridWidth,
    		gridClass,
    		el,
    		nogrid,
    		rowHeight,
    		gridGap,
    		grid,
    		height,
    		gap,
    		$$scope,
    		slots,
    		div0_binding,
    		div0_elementresize_handler
    	];
    }

    class Media extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			theme: 0,
    			col: 1,
    			grid: 9,
    			caption: 2,
    			height: 10,
    			gap: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Media",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get theme() {
    		throw new Error("<Media>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set theme(value) {
    		throw new Error("<Media>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get col() {
    		throw new Error("<Media>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set col(value) {
    		throw new Error("<Media>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get grid() {
    		throw new Error("<Media>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set grid(value) {
    		throw new Error("<Media>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get caption() {
    		throw new Error("<Media>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set caption(value) {
    		throw new Error("<Media>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Media>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Media>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gap() {
    		throw new Error("<Media>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gap(value) {
    		throw new Error("<Media>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/charts/Jackson.svelte generated by Svelte v3.44.1 */

    const { Object: Object_1$7 } = globals;
    const file$a = "src/charts/Jackson.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (28:0) <Section>
    function create_default_slot_1$8(ctx) {
    	let h2;
    	let t1;
    	let p;
    	let t2;
    	let mark0;
    	let t4;
    	let mark1;
    	let t6;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Lamar Jackson: A Closer Look";
    			t1 = space();
    			p = element("p");
    			t2 = text("Use the dropdown menu to explore available player stats. For a quarterback, stats such as ");
    			mark0 = element("mark");
    			mark0.textContent = "passing/rushing\n        touchdowns";
    			t4 = text(", as well as number of ");
    			mark1 = element("mark");
    			mark1.textContent = "fumbles";
    			t6 = text(", are particularly useful.");
    			add_location(h2, file$a, 28, 4, 686);
    			add_location(mark0, file$a, 30, 98, 830);
    			add_location(mark1, file$a, 31, 48, 900);
    			add_location(p, file$a, 29, 4, 728);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t2);
    			append_dev(p, mark0);
    			append_dev(p, t4);
    			append_dev(p, mark1);
    			append_dev(p, t6);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$8.name,
    		type: "slot",
    		source: "(28:0) <Section>",
    		ctx
    	});

    	return block;
    }

    // (37:4) {#if data && xKey && yKey }
    function create_if_block$9(ctx) {
    	let div0;
    	let scatterchart;
    	let t0;
    	let p;
    	let t2;
    	let div1;
    	let h3;
    	let t4;
    	let span;
    	let t6;
    	let select;
    	let br;
    	let current;
    	let mounted;
    	let dispose;

    	scatterchart = new ScatterChart({
    			props: {
    				diameter: 15,
    				data: /*data*/ ctx[0],
    				xKey: /*xKey*/ ctx[3],
    				yKey: /*yKey*/ ctx[1],
    				colors: /*colors*/ ctx[4]
    			},
    			$$inline: true
    		});

    	let each_value = Object.keys(/*dataKeys*/ ctx[2]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(scatterchart.$$.fragment);
    			t0 = space();
    			p = element("p");
    			p.textContent = "Week";
    			t2 = space();
    			div1 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Explore the data";
    			t4 = space();
    			span = element("span");
    			span.textContent = "Y Axis";
    			t6 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			br = element("br");
    			attr_dev(p, "class", "x-label");
    			add_location(p, file$a, 39, 12, 1154);
    			attr_dev(div0, "class", "media");
    			set_style(div0, "height", "400px");
    			add_location(div0, file$a, 37, 8, 1027);
    			set_style(h3, "padding-bottom", "10px");
    			add_location(h3, file$a, 42, 12, 1262);
    			attr_dev(span, "class", "label-block");
    			add_location(span, file$a, 43, 12, 1329);
    			if (/*yKey*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[5].call(select));
    			add_location(select, file$a, 44, 12, 1381);
    			add_location(br, file$a, 48, 21, 1571);
    			attr_dev(div1, "class", "media");
    			set_style(div1, "margin-top", "80px");
    			add_location(div1, file$a, 41, 8, 1205);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(scatterchart, div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, p);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h3);
    			append_dev(div1, t4);
    			append_dev(div1, span);
    			append_dev(div1, t6);
    			append_dev(div1, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*yKey*/ ctx[1]);
    			append_dev(div1, br);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*select_change_handler*/ ctx[5]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const scatterchart_changes = {};
    			if (dirty & /*data*/ 1) scatterchart_changes.data = /*data*/ ctx[0];
    			if (dirty & /*yKey*/ 2) scatterchart_changes.yKey = /*yKey*/ ctx[1];
    			scatterchart.$set(scatterchart_changes);

    			if (dirty & /*Object, dataKeys*/ 4) {
    				each_value = Object.keys(/*dataKeys*/ ctx[2]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*yKey, Object, dataKeys*/ 6) {
    				select_option(select, /*yKey*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scatterchart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scatterchart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(scatterchart);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(37:4) {#if data && xKey && yKey }",
    		ctx
    	});

    	return block;
    }

    // (46:16) {#each Object.keys(dataKeys) as key}
    function create_each_block$7(ctx) {
    	let option;
    	let t_value = /*dataKeys*/ ctx[2][/*key*/ ctx[6]] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*key*/ ctx[6];
    			option.value = option.__value;
    			add_location(option, file$a, 46, 20, 1481);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(46:16) {#each Object.keys(dataKeys) as key}",
    		ctx
    	});

    	return block;
    }

    // (36:0) <Media col="wide">
    function create_default_slot$8(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*data*/ ctx[0] && /*xKey*/ ctx[3] && /*yKey*/ ctx[1] && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*data*/ ctx[0] && /*xKey*/ ctx[3] && /*yKey*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*data, yKey*/ 3) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$9(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(36:0) <Media col=\\\"wide\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let section;
    	let t;
    	let media;
    	let current;

    	section = new Section({
    			props: {
    				$$slots: { default: [create_default_slot_1$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	media = new Media({
    			props: {
    				col: "wide",
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(section.$$.fragment);
    			t = space();
    			create_component(media.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(section, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(media, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const section_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				section_changes.$$scope = { dirty, ctx };
    			}

    			section.$set(section_changes);
    			const media_changes = {};

    			if (dirty & /*$$scope, yKey, data*/ 515) {
    				media_changes.$$scope = { dirty, ctx };
    			}

    			media.$set(media_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(section.$$.fragment, local);
    			transition_in(media.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(section.$$.fragment, local);
    			transition_out(media.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(section, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(media, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const threshold$8 = 0.65;

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Jackson', slots, []);

    	const dataKeys = {
    		Cmp_p: "% of Passes Completed",
    		TD_P: "Passing Touchdowns",
    		TD_R: "Rushing Touchdowns",
    		Yds_P: "Yards Gained: Passing",
    		Yds_R: "Yards Gained: Rushing",
    		Fmb: "# Fumbles"
    	};

    	let data;
    	let xKey = "Week";
    	let yKey = "Cmp_p";
    	let colors = [[166, 206, 227]];
    	getData("data/jackson2021.csv").then(result => $$invalidate(0, data = result));
    	const writable_props = [];

    	Object_1$7.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Jackson> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		yKey = select_value(this);
    		$$invalidate(1, yKey);
    		$$invalidate(2, dataKeys);
    	}

    	$$self.$capture_state = () => ({
    		Section,
    		getData,
    		ScatterChart,
    		Media,
    		threshold: threshold$8,
    		dataKeys,
    		data,
    		xKey,
    		yKey,
    		colors
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('xKey' in $$props) $$invalidate(3, xKey = $$props.xKey);
    		if ('yKey' in $$props) $$invalidate(1, yKey = $$props.yKey);
    		if ('colors' in $$props) $$invalidate(4, colors = $$props.colors);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data, yKey, dataKeys, xKey, colors, select_change_handler];
    }

    class Jackson extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Jackson",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* MIT license */

    var conversions = {
      rgb2hsl: rgb2hsl,
      rgb2hsv: rgb2hsv,
      rgb2hwb: rgb2hwb,
      rgb2cmyk: rgb2cmyk,
      rgb2keyword: rgb2keyword,
      rgb2xyz: rgb2xyz,
      rgb2lab: rgb2lab,
      rgb2lch: rgb2lch,

      hsl2rgb: hsl2rgb,
      hsl2hsv: hsl2hsv,
      hsl2hwb: hsl2hwb,
      hsl2cmyk: hsl2cmyk,
      hsl2keyword: hsl2keyword,

      hsv2rgb: hsv2rgb,
      hsv2hsl: hsv2hsl,
      hsv2hwb: hsv2hwb,
      hsv2cmyk: hsv2cmyk,
      hsv2keyword: hsv2keyword,

      hwb2rgb: hwb2rgb,
      hwb2hsl: hwb2hsl,
      hwb2hsv: hwb2hsv,
      hwb2cmyk: hwb2cmyk,
      hwb2keyword: hwb2keyword,

      cmyk2rgb: cmyk2rgb,
      cmyk2hsl: cmyk2hsl,
      cmyk2hsv: cmyk2hsv,
      cmyk2hwb: cmyk2hwb,
      cmyk2keyword: cmyk2keyword,

      keyword2rgb: keyword2rgb,
      keyword2hsl: keyword2hsl,
      keyword2hsv: keyword2hsv,
      keyword2hwb: keyword2hwb,
      keyword2cmyk: keyword2cmyk,
      keyword2lab: keyword2lab,
      keyword2xyz: keyword2xyz,

      xyz2rgb: xyz2rgb,
      xyz2lab: xyz2lab,
      xyz2lch: xyz2lch,

      lab2xyz: lab2xyz,
      lab2rgb: lab2rgb,
      lab2lch: lab2lch,

      lch2lab: lch2lab,
      lch2xyz: lch2xyz,
      lch2rgb: lch2rgb
    };


    function rgb2hsl(rgb) {
      var r = rgb[0]/255,
          g = rgb[1]/255,
          b = rgb[2]/255,
          min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          delta = max - min,
          h, s, l;

      if (max == min)
        h = 0;
      else if (r == max)
        h = (g - b) / delta;
      else if (g == max)
        h = 2 + (b - r) / delta;
      else if (b == max)
        h = 4 + (r - g)/ delta;

      h = Math.min(h * 60, 360);

      if (h < 0)
        h += 360;

      l = (min + max) / 2;

      if (max == min)
        s = 0;
      else if (l <= 0.5)
        s = delta / (max + min);
      else
        s = delta / (2 - max - min);

      return [h, s * 100, l * 100];
    }

    function rgb2hsv(rgb) {
      var r = rgb[0],
          g = rgb[1],
          b = rgb[2],
          min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          delta = max - min,
          h, s, v;

      if (max == 0)
        s = 0;
      else
        s = (delta/max * 1000)/10;

      if (max == min)
        h = 0;
      else if (r == max)
        h = (g - b) / delta;
      else if (g == max)
        h = 2 + (b - r) / delta;
      else if (b == max)
        h = 4 + (r - g) / delta;

      h = Math.min(h * 60, 360);

      if (h < 0)
        h += 360;

      v = ((max / 255) * 1000) / 10;

      return [h, s, v];
    }

    function rgb2hwb(rgb) {
      var r = rgb[0],
          g = rgb[1],
          b = rgb[2],
          h = rgb2hsl(rgb)[0],
          w = 1/255 * Math.min(r, Math.min(g, b)),
          b = 1 - 1/255 * Math.max(r, Math.max(g, b));

      return [h, w * 100, b * 100];
    }

    function rgb2cmyk(rgb) {
      var r = rgb[0] / 255,
          g = rgb[1] / 255,
          b = rgb[2] / 255,
          c, m, y, k;

      k = Math.min(1 - r, 1 - g, 1 - b);
      c = (1 - r - k) / (1 - k) || 0;
      m = (1 - g - k) / (1 - k) || 0;
      y = (1 - b - k) / (1 - k) || 0;
      return [c * 100, m * 100, y * 100, k * 100];
    }

    function rgb2keyword(rgb) {
      return reverseKeywords[JSON.stringify(rgb)];
    }

    function rgb2xyz(rgb) {
      var r = rgb[0] / 255,
          g = rgb[1] / 255,
          b = rgb[2] / 255;

      // assume sRGB
      r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
      g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
      b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

      var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
      var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
      var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

      return [x * 100, y *100, z * 100];
    }

    function rgb2lab(rgb) {
      var xyz = rgb2xyz(rgb),
            x = xyz[0],
            y = xyz[1],
            z = xyz[2],
            l, a, b;

      x /= 95.047;
      y /= 100;
      z /= 108.883;

      x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
      y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
      z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

      l = (116 * y) - 16;
      a = 500 * (x - y);
      b = 200 * (y - z);

      return [l, a, b];
    }

    function rgb2lch(args) {
      return lab2lch(rgb2lab(args));
    }

    function hsl2rgb(hsl) {
      var h = hsl[0] / 360,
          s = hsl[1] / 100,
          l = hsl[2] / 100,
          t1, t2, t3, rgb, val;

      if (s == 0) {
        val = l * 255;
        return [val, val, val];
      }

      if (l < 0.5)
        t2 = l * (1 + s);
      else
        t2 = l + s - l * s;
      t1 = 2 * l - t2;

      rgb = [0, 0, 0];
      for (var i = 0; i < 3; i++) {
        t3 = h + 1 / 3 * - (i - 1);
        t3 < 0 && t3++;
        t3 > 1 && t3--;

        if (6 * t3 < 1)
          val = t1 + (t2 - t1) * 6 * t3;
        else if (2 * t3 < 1)
          val = t2;
        else if (3 * t3 < 2)
          val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
        else
          val = t1;

        rgb[i] = val * 255;
      }

      return rgb;
    }

    function hsl2hsv(hsl) {
      var h = hsl[0],
          s = hsl[1] / 100,
          l = hsl[2] / 100,
          sv, v;

      if(l === 0) {
          // no need to do calc on black
          // also avoids divide by 0 error
          return [0, 0, 0];
      }

      l *= 2;
      s *= (l <= 1) ? l : 2 - l;
      v = (l + s) / 2;
      sv = (2 * s) / (l + s);
      return [h, sv * 100, v * 100];
    }

    function hsl2hwb(args) {
      return rgb2hwb(hsl2rgb(args));
    }

    function hsl2cmyk(args) {
      return rgb2cmyk(hsl2rgb(args));
    }

    function hsl2keyword(args) {
      return rgb2keyword(hsl2rgb(args));
    }


    function hsv2rgb(hsv) {
      var h = hsv[0] / 60,
          s = hsv[1] / 100,
          v = hsv[2] / 100,
          hi = Math.floor(h) % 6;

      var f = h - Math.floor(h),
          p = 255 * v * (1 - s),
          q = 255 * v * (1 - (s * f)),
          t = 255 * v * (1 - (s * (1 - f))),
          v = 255 * v;

      switch(hi) {
        case 0:
          return [v, t, p];
        case 1:
          return [q, v, p];
        case 2:
          return [p, v, t];
        case 3:
          return [p, q, v];
        case 4:
          return [t, p, v];
        case 5:
          return [v, p, q];
      }
    }

    function hsv2hsl(hsv) {
      var h = hsv[0],
          s = hsv[1] / 100,
          v = hsv[2] / 100,
          sl, l;

      l = (2 - s) * v;
      sl = s * v;
      sl /= (l <= 1) ? l : 2 - l;
      sl = sl || 0;
      l /= 2;
      return [h, sl * 100, l * 100];
    }

    function hsv2hwb(args) {
      return rgb2hwb(hsv2rgb(args))
    }

    function hsv2cmyk(args) {
      return rgb2cmyk(hsv2rgb(args));
    }

    function hsv2keyword(args) {
      return rgb2keyword(hsv2rgb(args));
    }

    // http://dev.w3.org/csswg/css-color/#hwb-to-rgb
    function hwb2rgb(hwb) {
      var h = hwb[0] / 360,
          wh = hwb[1] / 100,
          bl = hwb[2] / 100,
          ratio = wh + bl,
          i, v, f, n;

      // wh + bl cant be > 1
      if (ratio > 1) {
        wh /= ratio;
        bl /= ratio;
      }

      i = Math.floor(6 * h);
      v = 1 - bl;
      f = 6 * h - i;
      if ((i & 0x01) != 0) {
        f = 1 - f;
      }
      n = wh + f * (v - wh);  // linear interpolation

      switch (i) {
        default:
        case 6:
        case 0: r = v; g = n; b = wh; break;
        case 1: r = n; g = v; b = wh; break;
        case 2: r = wh; g = v; b = n; break;
        case 3: r = wh; g = n; b = v; break;
        case 4: r = n; g = wh; b = v; break;
        case 5: r = v; g = wh; b = n; break;
      }

      return [r * 255, g * 255, b * 255];
    }

    function hwb2hsl(args) {
      return rgb2hsl(hwb2rgb(args));
    }

    function hwb2hsv(args) {
      return rgb2hsv(hwb2rgb(args));
    }

    function hwb2cmyk(args) {
      return rgb2cmyk(hwb2rgb(args));
    }

    function hwb2keyword(args) {
      return rgb2keyword(hwb2rgb(args));
    }

    function cmyk2rgb(cmyk) {
      var c = cmyk[0] / 100,
          m = cmyk[1] / 100,
          y = cmyk[2] / 100,
          k = cmyk[3] / 100,
          r, g, b;

      r = 1 - Math.min(1, c * (1 - k) + k);
      g = 1 - Math.min(1, m * (1 - k) + k);
      b = 1 - Math.min(1, y * (1 - k) + k);
      return [r * 255, g * 255, b * 255];
    }

    function cmyk2hsl(args) {
      return rgb2hsl(cmyk2rgb(args));
    }

    function cmyk2hsv(args) {
      return rgb2hsv(cmyk2rgb(args));
    }

    function cmyk2hwb(args) {
      return rgb2hwb(cmyk2rgb(args));
    }

    function cmyk2keyword(args) {
      return rgb2keyword(cmyk2rgb(args));
    }


    function xyz2rgb(xyz) {
      var x = xyz[0] / 100,
          y = xyz[1] / 100,
          z = xyz[2] / 100,
          r, g, b;

      r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
      g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
      b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

      // assume sRGB
      r = r > 0.0031308 ? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
        : r = (r * 12.92);

      g = g > 0.0031308 ? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
        : g = (g * 12.92);

      b = b > 0.0031308 ? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
        : b = (b * 12.92);

      r = Math.min(Math.max(0, r), 1);
      g = Math.min(Math.max(0, g), 1);
      b = Math.min(Math.max(0, b), 1);

      return [r * 255, g * 255, b * 255];
    }

    function xyz2lab(xyz) {
      var x = xyz[0],
          y = xyz[1],
          z = xyz[2],
          l, a, b;

      x /= 95.047;
      y /= 100;
      z /= 108.883;

      x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
      y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
      z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

      l = (116 * y) - 16;
      a = 500 * (x - y);
      b = 200 * (y - z);

      return [l, a, b];
    }

    function xyz2lch(args) {
      return lab2lch(xyz2lab(args));
    }

    function lab2xyz(lab) {
      var l = lab[0],
          a = lab[1],
          b = lab[2],
          x, y, z, y2;

      if (l <= 8) {
        y = (l * 100) / 903.3;
        y2 = (7.787 * (y / 100)) + (16 / 116);
      } else {
        y = 100 * Math.pow((l + 16) / 116, 3);
        y2 = Math.pow(y / 100, 1/3);
      }

      x = x / 95.047 <= 0.008856 ? x = (95.047 * ((a / 500) + y2 - (16 / 116))) / 7.787 : 95.047 * Math.pow((a / 500) + y2, 3);

      z = z / 108.883 <= 0.008859 ? z = (108.883 * (y2 - (b / 200) - (16 / 116))) / 7.787 : 108.883 * Math.pow(y2 - (b / 200), 3);

      return [x, y, z];
    }

    function lab2lch(lab) {
      var l = lab[0],
          a = lab[1],
          b = lab[2],
          hr, h, c;

      hr = Math.atan2(b, a);
      h = hr * 360 / 2 / Math.PI;
      if (h < 0) {
        h += 360;
      }
      c = Math.sqrt(a * a + b * b);
      return [l, c, h];
    }

    function lab2rgb(args) {
      return xyz2rgb(lab2xyz(args));
    }

    function lch2lab(lch) {
      var l = lch[0],
          c = lch[1],
          h = lch[2],
          a, b, hr;

      hr = h / 360 * 2 * Math.PI;
      a = c * Math.cos(hr);
      b = c * Math.sin(hr);
      return [l, a, b];
    }

    function lch2xyz(args) {
      return lab2xyz(lch2lab(args));
    }

    function lch2rgb(args) {
      return lab2rgb(lch2lab(args));
    }

    function keyword2rgb(keyword) {
      return cssKeywords[keyword];
    }

    function keyword2hsl(args) {
      return rgb2hsl(keyword2rgb(args));
    }

    function keyword2hsv(args) {
      return rgb2hsv(keyword2rgb(args));
    }

    function keyword2hwb(args) {
      return rgb2hwb(keyword2rgb(args));
    }

    function keyword2cmyk(args) {
      return rgb2cmyk(keyword2rgb(args));
    }

    function keyword2lab(args) {
      return rgb2lab(keyword2rgb(args));
    }

    function keyword2xyz(args) {
      return rgb2xyz(keyword2rgb(args));
    }

    var cssKeywords = {
      aliceblue:  [240,248,255],
      antiquewhite: [250,235,215],
      aqua: [0,255,255],
      aquamarine: [127,255,212],
      azure:  [240,255,255],
      beige:  [245,245,220],
      bisque: [255,228,196],
      black:  [0,0,0],
      blanchedalmond: [255,235,205],
      blue: [0,0,255],
      blueviolet: [138,43,226],
      brown:  [165,42,42],
      burlywood:  [222,184,135],
      cadetblue:  [95,158,160],
      chartreuse: [127,255,0],
      chocolate:  [210,105,30],
      coral:  [255,127,80],
      cornflowerblue: [100,149,237],
      cornsilk: [255,248,220],
      crimson:  [220,20,60],
      cyan: [0,255,255],
      darkblue: [0,0,139],
      darkcyan: [0,139,139],
      darkgoldenrod:  [184,134,11],
      darkgray: [169,169,169],
      darkgreen:  [0,100,0],
      darkgrey: [169,169,169],
      darkkhaki:  [189,183,107],
      darkmagenta:  [139,0,139],
      darkolivegreen: [85,107,47],
      darkorange: [255,140,0],
      darkorchid: [153,50,204],
      darkred:  [139,0,0],
      darksalmon: [233,150,122],
      darkseagreen: [143,188,143],
      darkslateblue:  [72,61,139],
      darkslategray:  [47,79,79],
      darkslategrey:  [47,79,79],
      darkturquoise:  [0,206,209],
      darkviolet: [148,0,211],
      deeppink: [255,20,147],
      deepskyblue:  [0,191,255],
      dimgray:  [105,105,105],
      dimgrey:  [105,105,105],
      dodgerblue: [30,144,255],
      firebrick:  [178,34,34],
      floralwhite:  [255,250,240],
      forestgreen:  [34,139,34],
      fuchsia:  [255,0,255],
      gainsboro:  [220,220,220],
      ghostwhite: [248,248,255],
      gold: [255,215,0],
      goldenrod:  [218,165,32],
      gray: [128,128,128],
      green:  [0,128,0],
      greenyellow:  [173,255,47],
      grey: [128,128,128],
      honeydew: [240,255,240],
      hotpink:  [255,105,180],
      indianred:  [205,92,92],
      indigo: [75,0,130],
      ivory:  [255,255,240],
      khaki:  [240,230,140],
      lavender: [230,230,250],
      lavenderblush:  [255,240,245],
      lawngreen:  [124,252,0],
      lemonchiffon: [255,250,205],
      lightblue:  [173,216,230],
      lightcoral: [240,128,128],
      lightcyan:  [224,255,255],
      lightgoldenrodyellow: [250,250,210],
      lightgray:  [211,211,211],
      lightgreen: [144,238,144],
      lightgrey:  [211,211,211],
      lightpink:  [255,182,193],
      lightsalmon:  [255,160,122],
      lightseagreen:  [32,178,170],
      lightskyblue: [135,206,250],
      lightslategray: [119,136,153],
      lightslategrey: [119,136,153],
      lightsteelblue: [176,196,222],
      lightyellow:  [255,255,224],
      lime: [0,255,0],
      limegreen:  [50,205,50],
      linen:  [250,240,230],
      magenta:  [255,0,255],
      maroon: [128,0,0],
      mediumaquamarine: [102,205,170],
      mediumblue: [0,0,205],
      mediumorchid: [186,85,211],
      mediumpurple: [147,112,219],
      mediumseagreen: [60,179,113],
      mediumslateblue:  [123,104,238],
      mediumspringgreen:  [0,250,154],
      mediumturquoise:  [72,209,204],
      mediumvioletred:  [199,21,133],
      midnightblue: [25,25,112],
      mintcream:  [245,255,250],
      mistyrose:  [255,228,225],
      moccasin: [255,228,181],
      navajowhite:  [255,222,173],
      navy: [0,0,128],
      oldlace:  [253,245,230],
      olive:  [128,128,0],
      olivedrab:  [107,142,35],
      orange: [255,165,0],
      orangered:  [255,69,0],
      orchid: [218,112,214],
      palegoldenrod:  [238,232,170],
      palegreen:  [152,251,152],
      paleturquoise:  [175,238,238],
      palevioletred:  [219,112,147],
      papayawhip: [255,239,213],
      peachpuff:  [255,218,185],
      peru: [205,133,63],
      pink: [255,192,203],
      plum: [221,160,221],
      powderblue: [176,224,230],
      purple: [128,0,128],
      rebeccapurple: [102, 51, 153],
      red:  [255,0,0],
      rosybrown:  [188,143,143],
      royalblue:  [65,105,225],
      saddlebrown:  [139,69,19],
      salmon: [250,128,114],
      sandybrown: [244,164,96],
      seagreen: [46,139,87],
      seashell: [255,245,238],
      sienna: [160,82,45],
      silver: [192,192,192],
      skyblue:  [135,206,235],
      slateblue:  [106,90,205],
      slategray:  [112,128,144],
      slategrey:  [112,128,144],
      snow: [255,250,250],
      springgreen:  [0,255,127],
      steelblue:  [70,130,180],
      tan:  [210,180,140],
      teal: [0,128,128],
      thistle:  [216,191,216],
      tomato: [255,99,71],
      turquoise:  [64,224,208],
      violet: [238,130,238],
      wheat:  [245,222,179],
      white:  [255,255,255],
      whitesmoke: [245,245,245],
      yellow: [255,255,0],
      yellowgreen:  [154,205,50]
    };

    var reverseKeywords = {};
    for (var key in cssKeywords) {
      reverseKeywords[JSON.stringify(cssKeywords[key])] = key;
    }

    var convert = function() {
       return new Converter();
    };

    for (var func in conversions) {
      // export Raw versions
      convert[func + "Raw"] =  (function(func) {
        // accept array or plain args
        return function(arg) {
          if (typeof arg == "number")
            arg = Array.prototype.slice.call(arguments);
          return conversions[func](arg);
        }
      })(func);

      var pair = /(\w+)2(\w+)/.exec(func),
          from = pair[1],
          to = pair[2];

      // export rgb2hsl and ["rgb"]["hsl"]
      convert[from] = convert[from] || {};

      convert[from][to] = convert[func] = (function(func) { 
        return function(arg) {
          if (typeof arg == "number")
            arg = Array.prototype.slice.call(arguments);
          
          var val = conversions[func](arg);
          if (typeof val == "string" || val === undefined)
            return val; // keyword

          for (var i = 0; i < val.length; i++)
            val[i] = Math.round(val[i]);
          return val;
        }
      })(func);
    }


    /* Converter does lazy conversion and caching */
    var Converter = function() {
       this.convs = {};
    };

    /* Either get the values for a space or
      set the values for a space, depending on args */
    Converter.prototype.routeSpace = function(space, args) {
       var values = args[0];
       if (values === undefined) {
          // color.rgb()
          return this.getValues(space);
       }
       // color.rgb(10, 10, 10)
       if (typeof values == "number") {
          values = Array.prototype.slice.call(args);        
       }

       return this.setValues(space, values);
    };
      
    /* Set the values for a space, invalidating cache */
    Converter.prototype.setValues = function(space, values) {
       this.space = space;
       this.convs = {};
       this.convs[space] = values;
       return this;
    };

    /* Get the values for a space. If there's already
      a conversion for the space, fetch it, otherwise
      compute it */
    Converter.prototype.getValues = function(space) {
       var vals = this.convs[space];
       if (!vals) {
          var fspace = this.space,
              from = this.convs[fspace];
          vals = convert[fspace][space](from);

          this.convs[space] = vals;
       }
      return vals;
    };

    ["rgb", "hsl", "hsv", "cmyk", "keyword"].forEach(function(space) {
       Converter.prototype[space] = function(vals) {
          return this.routeSpace(space, arguments);
       };
    });

    var colorConvert = convert;

    var parseColor = function (cstr) {
        var m, conv, parts, alpha;
        if (m = /^((?:rgb|hs[lv]|cmyk|xyz|lab)a?)\s*\(([^\)]*)\)/.exec(cstr)) {
            var name = m[1];
            var base = name.replace(/a$/, '');
            var size = base === 'cmyk' ? 4 : 3;
            conv = colorConvert[base];
            
            parts = m[2].replace(/^\s+|\s+$/g, '')
                .split(/\s*,\s*/)
                .map(function (x, i) {
                    if (/%$/.test(x) && i === size) {
                        return parseFloat(x) / 100;
                    }
                    else if (/%$/.test(x)) {
                        return parseFloat(x);
                    }
                    return parseFloat(x);
                })
            ;
            if (name === base) parts.push(1);
            alpha = parts[size] === undefined ? 1 : parts[size];
            parts = parts.slice(0, size);
            
            conv[base] = function () { return parts };
        }
        else if (/^#[A-Fa-f0-9]+$/.test(cstr)) {
            var base = cstr.replace(/^#/,'');
            var size = base.length;
            conv = colorConvert.rgb;
            parts = base.split(size === 3 ? /(.)/ : /(..)/);
            parts = parts.filter(Boolean)
                .map(function (x) {
                    if (size === 3) {
                        return parseInt(x + x, 16);
                    }
                    else {
                        return parseInt(x, 16)
                    }
                })
            ;
            alpha = 1;
            conv.rgb = function () { return parts };
            if (!parts[0]) parts[0] = 0;
            if (!parts[1]) parts[1] = 0;
            if (!parts[2]) parts[2] = 0;
        }
        else {
            conv = colorConvert.keyword;
            conv.keyword = function () { return cstr };
            parts = cstr;
            alpha = 1;
        }
        
        var res = {
            rgb: undefined,
            hsl: undefined,
            hsv: undefined,
            cmyk: undefined,
            keyword: undefined,
            hex: undefined
        };
        try { res.rgb = conv.rgb(parts); } catch (e) {}
        try { res.hsl = conv.hsl(parts); } catch (e) {}
        try { res.hsv = conv.hsv(parts); } catch (e) {}
        try { res.cmyk = conv.cmyk(parts); } catch (e) {}
        try { res.keyword = conv.keyword(parts); } catch (e) {}
        
        if (res.rgb) res.hex = '#' + res.rgb.map(function (x) {
            var s = x.toString(16);
            if (s.length === 1) return '0' + s;
            return s;
        }).join('');
        
        if (res.rgb) res.rgba = res.rgb.concat(alpha);
        if (res.hsl) res.hsla = res.hsl.concat(alpha);
        if (res.hsv) res.hsva = res.hsv.concat(alpha);
        if (res.cmyk) res.cmyka = res.cmyk.concat(alpha);
        
        return res;
    };

    /* src/ui/Em.svelte generated by Svelte v3.44.1 */
    const file$9 = "src/ui/Em.svelte";

    function create_fragment$9(ctx) {
    	let span;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			attr_dev(span, "class", "em svelte-s1t2y4");
    			set_style(span, "background-color", /*color*/ ctx[0]);
    			set_style(span, "color", /*text*/ ctx[2]);
    			attr_dev(span, "role", "presentation");
    			toggle_class(span, "nowrap", /*nowrap*/ ctx[1]);
    			add_location(span, file$9, 21, 0, 376);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*color*/ 1) {
    				set_style(span, "background-color", /*color*/ ctx[0]);
    			}

    			if (!current || dirty & /*text*/ 4) {
    				set_style(span, "color", /*text*/ ctx[2]);
    			}

    			if (dirty & /*nowrap*/ 2) {
    				toggle_class(span, "nowrap", /*nowrap*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let rgb;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Em', slots, ['default']);
    	let { color = 'lightgrey' } = $$props;
    	let { nowrap = true } = $$props;

    	function textColor(rgb) {
    		const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    		return brightness > 125 ? 'black' : 'white';
    	}

    	let text = 'black';
    	const writable_props = ['color', 'nowrap'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Em> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('nowrap' in $$props) $$invalidate(1, nowrap = $$props.nowrap);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		parse: parseColor,
    		color,
    		nowrap,
    		textColor,
    		text,
    		rgb
    	});

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('nowrap' in $$props) $$invalidate(1, nowrap = $$props.nowrap);
    		if ('text' in $$props) $$invalidate(2, text = $$props.text);
    		if ('rgb' in $$props) $$invalidate(3, rgb = $$props.rgb);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*color*/ 1) {
    			$$invalidate(3, rgb = parseColor(color).rgb);
    		}

    		if ($$self.$$.dirty & /*rgb*/ 8) {
    			if (rgb) {
    				$$invalidate(2, text = textColor(rgb));
    			}
    		}
    	};

    	return [color, nowrap, text, rgb, $$scope, slots];
    }

    class Em extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { color: 0, nowrap: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Em",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get color() {
    		throw new Error("<Em>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Em>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nowrap() {
    		throw new Error("<Em>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nowrap(value) {
    		throw new Error("<Em>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/ui/Arrow.svelte generated by Svelte v3.44.1 */

    const file$8 = "src/ui/Arrow.svelte";

    // (14:0) {:else}
    function create_else_block(ctx) {
    	let img;
    	let img_src_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (default_slot) default_slot.c();
    			if (!src_url_equal(img.src, img_src_value = "./img/scroll-down-" + /*color*/ ctx[0] + ".svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "arrow left svelte-1prdo3z");
    			attr_dev(img, "alt", "");
    			attr_dev(img, "aria-hidden", "true");
    			toggle_class(img, "bounce", /*animation*/ ctx[1]);
    			add_location(img, file$8, 14, 0, 347);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*color*/ 1 && !src_url_equal(img.src, img_src_value = "./img/scroll-down-" + /*color*/ ctx[0] + ".svg")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*animation*/ 2) {
    				toggle_class(img, "bounce", /*animation*/ ctx[1]);
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(14:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (11:0) {#if center}
    function create_if_block$8(ctx) {
    	let br;
    	let t;
    	let img;
    	let img_src_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    			br = element("br");
    			t = space();
    			img = element("img");
    			add_location(br, file$8, 11, 13, 225);
    			if (!src_url_equal(img.src, img_src_value = "./img/scroll-down-" + /*color*/ ctx[0] + ".svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "arrow svelte-1prdo3z");
    			attr_dev(img, "alt", "");
    			attr_dev(img, "aria-hidden", "true");
    			toggle_class(img, "bounce", /*animation*/ ctx[1]);
    			add_location(img, file$8, 12, 0, 231);
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			insert_dev(target, br, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, img, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*color*/ 1 && !src_url_equal(img.src, img_src_value = "./img/scroll-down-" + /*color*/ ctx[0] + ".svg")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*animation*/ 2) {
    				toggle_class(img, "bounce", /*animation*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(11:0) {#if center}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$8, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*center*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Arrow', slots, ['default']);
    	let { color = "black" } = $$props;
    	let { animation = true } = $$props;
    	let { center = true } = $$props;
    	const colors = ["black", "white"];
    	color = colors.includes(color) ? color : "black";
    	const writable_props = ['color', 'animation', 'center'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Arrow> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('animation' in $$props) $$invalidate(1, animation = $$props.animation);
    		if ('center' in $$props) $$invalidate(2, center = $$props.center);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ color, animation, center, colors });

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('animation' in $$props) $$invalidate(1, animation = $$props.animation);
    		if ('center' in $$props) $$invalidate(2, center = $$props.center);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, animation, center, $$scope, slots];
    }

    class Arrow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { color: 0, animation: 1, center: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Arrow",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get color() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get animation() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set animation(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get center() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set center(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/charts/Jefferson.svelte generated by Svelte v3.44.1 */

    const { Object: Object_1$6 } = globals;
    const file$7 = "src/charts/Jefferson.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (30:0) <Section>
    function create_default_slot_1$7(ctx) {
    	let h2;
    	let t1;
    	let p;
    	let t2;
    	let mark0;
    	let t4;
    	let mark1;
    	let t6;
    	let mark2;
    	let t8;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Justin Jefferson: A Closer Look";
    			t1 = space();
    			p = element("p");
    			t2 = text("Use the dropdown menu to explore available player stats. Some particularly interesting stats for this player\n        include the ");
    			mark0 = element("mark");
    			mark0.textContent = "catching percentage";
    			t4 = text(" (the % of catches made given the total number of targets), the number of\n        ");
    			mark1 = element("mark");
    			mark1.textContent = "fumbles";
    			t6 = text(" (when a player drops the ball after catching), and both the rushing (running the ball into the end zone)\n        and receiving (catching the ball in the end zone) ");
    			mark2 = element("mark");
    			mark2.textContent = "touchdowns";
    			t8 = text(".");
    			add_location(h2, file$7, 30, 4, 713);
    			add_location(mark0, file$7, 33, 20, 899);
    			add_location(mark1, file$7, 34, 8, 1013);
    			add_location(mark2, file$7, 35, 58, 1197);
    			add_location(p, file$7, 31, 4, 758);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t2);
    			append_dev(p, mark0);
    			append_dev(p, t4);
    			append_dev(p, mark1);
    			append_dev(p, t6);
    			append_dev(p, mark2);
    			append_dev(p, t8);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$7.name,
    		type: "slot",
    		source: "(30:0) <Section>",
    		ctx
    	});

    	return block;
    }

    // (41:4) {#if data && xKey && yKey }
    function create_if_block$7(ctx) {
    	let div0;
    	let scatterchart;
    	let t0;
    	let p;
    	let t2;
    	let div1;
    	let h3;
    	let t4;
    	let span;
    	let t6;
    	let select;
    	let br;
    	let current;
    	let mounted;
    	let dispose;

    	scatterchart = new ScatterChart({
    			props: {
    				diameter: 15,
    				data: /*data*/ ctx[0],
    				xKey: /*xKey*/ ctx[3],
    				yKey: /*yKey*/ ctx[1],
    				colors: /*colors*/ ctx[4]
    			},
    			$$inline: true
    		});

    	let each_value = Object.keys(/*dataKeys*/ ctx[2]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(scatterchart.$$.fragment);
    			t0 = space();
    			p = element("p");
    			p.textContent = "Week";
    			t2 = space();
    			div1 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Explore the data";
    			t4 = space();
    			span = element("span");
    			span.textContent = "Y Axis";
    			t6 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			br = element("br");
    			attr_dev(p, "class", "x-label");
    			add_location(p, file$7, 43, 12, 1429);
    			attr_dev(div0, "class", "media");
    			set_style(div0, "height", "400px");
    			add_location(div0, file$7, 41, 8, 1302);
    			set_style(h3, "padding-bottom", "10px");
    			add_location(h3, file$7, 46, 12, 1537);
    			attr_dev(span, "class", "label-block");
    			add_location(span, file$7, 47, 12, 1604);
    			if (/*yKey*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[5].call(select));
    			add_location(select, file$7, 48, 12, 1656);
    			add_location(br, file$7, 52, 21, 1846);
    			attr_dev(div1, "class", "media");
    			set_style(div1, "margin-top", "80px");
    			add_location(div1, file$7, 45, 8, 1480);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(scatterchart, div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, p);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h3);
    			append_dev(div1, t4);
    			append_dev(div1, span);
    			append_dev(div1, t6);
    			append_dev(div1, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*yKey*/ ctx[1]);
    			append_dev(div1, br);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*select_change_handler*/ ctx[5]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const scatterchart_changes = {};
    			if (dirty & /*data*/ 1) scatterchart_changes.data = /*data*/ ctx[0];
    			if (dirty & /*yKey*/ 2) scatterchart_changes.yKey = /*yKey*/ ctx[1];
    			scatterchart.$set(scatterchart_changes);

    			if (dirty & /*Object, dataKeys*/ 4) {
    				each_value = Object.keys(/*dataKeys*/ ctx[2]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*yKey, Object, dataKeys*/ 6) {
    				select_option(select, /*yKey*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scatterchart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scatterchart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(scatterchart);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(41:4) {#if data && xKey && yKey }",
    		ctx
    	});

    	return block;
    }

    // (50:16) {#each Object.keys(dataKeys) as key}
    function create_each_block$6(ctx) {
    	let option;
    	let t_value = /*dataKeys*/ ctx[2][/*key*/ ctx[6]] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*key*/ ctx[6];
    			option.value = option.__value;
    			add_location(option, file$7, 50, 20, 1756);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(50:16) {#each Object.keys(dataKeys) as key}",
    		ctx
    	});

    	return block;
    }

    // (40:0) <Media col="wide">
    function create_default_slot$7(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*data*/ ctx[0] && /*xKey*/ ctx[3] && /*yKey*/ ctx[1] && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*data*/ ctx[0] && /*xKey*/ ctx[3] && /*yKey*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*data, yKey*/ 3) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(40:0) <Media col=\\\"wide\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let section;
    	let t;
    	let media;
    	let current;

    	section = new Section({
    			props: {
    				$$slots: { default: [create_default_slot_1$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	media = new Media({
    			props: {
    				col: "wide",
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(section.$$.fragment);
    			t = space();
    			create_component(media.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(section, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(media, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const section_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				section_changes.$$scope = { dirty, ctx };
    			}

    			section.$set(section_changes);
    			const media_changes = {};

    			if (dirty & /*$$scope, yKey, data*/ 515) {
    				media_changes.$$scope = { dirty, ctx };
    			}

    			media.$set(media_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(section.$$.fragment, local);
    			transition_in(media.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(section.$$.fragment, local);
    			transition_out(media.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(section, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(media, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const threshold$7 = 0.65;

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Jefferson', slots, []);

    	const dataKeys = {
    		Yds_rush: "Rushing Yards Gained",
    		Yds_rec: "Receiving Yards",
    		TD_rec: "Receiving Touchdowns",
    		TD_rush: "Rushing Touchdowns",
    		Tgt: "# Targets",
    		Ctch_p: "Catching %",
    		Fmb: "# Fumbles"
    	};

    	let data;
    	let xKey = "Week";
    	let yKey = "Yds_rush";
    	let colors = [[166, 206, 227]];
    	getData("data/jefferson2021.csv").then(result => $$invalidate(0, data = result));
    	const writable_props = [];

    	Object_1$6.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Jefferson> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		yKey = select_value(this);
    		$$invalidate(1, yKey);
    		$$invalidate(2, dataKeys);
    	}

    	$$self.$capture_state = () => ({
    		Section,
    		getData,
    		ScatterChart,
    		Media,
    		threshold: threshold$7,
    		dataKeys,
    		data,
    		xKey,
    		yKey,
    		colors
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('xKey' in $$props) $$invalidate(3, xKey = $$props.xKey);
    		if ('yKey' in $$props) $$invalidate(1, yKey = $$props.yKey);
    		if ('colors' in $$props) $$invalidate(4, colors = $$props.colors);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data, yKey, dataKeys, xKey, colors, select_change_handler];
    }

    class Jefferson extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Jefferson",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/charts/Goedert.svelte generated by Svelte v3.44.1 */

    const { Object: Object_1$5 } = globals;
    const file$6 = "src/charts/Goedert.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (29:0) <Section>
    function create_default_slot_1$6(ctx) {
    	let h2;
    	let t1;
    	let p;
    	let t2;
    	let mark0;
    	let t4;
    	let mark1;
    	let t6;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Dallas Goedert: A Closer Look";
    			t1 = space();
    			p = element("p");
    			t2 = text("Use the dropdown menu to explore available player stats. As a tight end, pay attention to Goedert's number of\n        ");
    			mark0 = element("mark");
    			mark0.textContent = "targets";
    			t4 = text(", as well as the number of ");
    			mark1 = element("mark");
    			mark1.textContent = "offensive/defensive snaps";
    			t6 = text(".");
    			add_location(h2, file$6, 29, 4, 676);
    			add_location(mark0, file$6, 32, 8, 849);
    			add_location(mark1, file$6, 32, 55, 896);
    			add_location(p, file$6, 30, 4, 719);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t2);
    			append_dev(p, mark0);
    			append_dev(p, t4);
    			append_dev(p, mark1);
    			append_dev(p, t6);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$6.name,
    		type: "slot",
    		source: "(29:0) <Section>",
    		ctx
    	});

    	return block;
    }

    // (38:4) {#if data && xKey && yKey }
    function create_if_block$6(ctx) {
    	let div0;
    	let scatterchart;
    	let t0;
    	let p;
    	let t2;
    	let div1;
    	let h3;
    	let t4;
    	let span;
    	let t6;
    	let select;
    	let br;
    	let current;
    	let mounted;
    	let dispose;

    	scatterchart = new ScatterChart({
    			props: {
    				diameter: 15,
    				data: /*data*/ ctx[0],
    				xKey: /*xKey*/ ctx[3],
    				yKey: /*yKey*/ ctx[1],
    				colors: /*colors*/ ctx[4]
    			},
    			$$inline: true
    		});

    	let each_value = Object.keys(/*dataKeys*/ ctx[2]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(scatterchart.$$.fragment);
    			t0 = space();
    			p = element("p");
    			p.textContent = "Week";
    			t2 = space();
    			div1 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Explore the data";
    			t4 = space();
    			span = element("span");
    			span.textContent = "Y Axis";
    			t6 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			br = element("br");
    			attr_dev(p, "class", "x-label");
    			add_location(p, file$6, 40, 12, 1143);
    			attr_dev(div0, "class", "media");
    			set_style(div0, "height", "400px");
    			add_location(div0, file$6, 38, 8, 1016);
    			set_style(h3, "padding-bottom", "10px");
    			add_location(h3, file$6, 43, 12, 1251);
    			attr_dev(span, "class", "label-block");
    			add_location(span, file$6, 44, 12, 1318);
    			if (/*yKey*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[5].call(select));
    			add_location(select, file$6, 45, 12, 1370);
    			add_location(br, file$6, 49, 21, 1560);
    			attr_dev(div1, "class", "media");
    			set_style(div1, "margin-top", "80px");
    			add_location(div1, file$6, 42, 8, 1194);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(scatterchart, div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, p);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h3);
    			append_dev(div1, t4);
    			append_dev(div1, span);
    			append_dev(div1, t6);
    			append_dev(div1, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*yKey*/ ctx[1]);
    			append_dev(div1, br);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*select_change_handler*/ ctx[5]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const scatterchart_changes = {};
    			if (dirty & /*data*/ 1) scatterchart_changes.data = /*data*/ ctx[0];
    			if (dirty & /*yKey*/ 2) scatterchart_changes.yKey = /*yKey*/ ctx[1];
    			scatterchart.$set(scatterchart_changes);

    			if (dirty & /*Object, dataKeys*/ 4) {
    				each_value = Object.keys(/*dataKeys*/ ctx[2]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*yKey, Object, dataKeys*/ 6) {
    				select_option(select, /*yKey*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scatterchart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scatterchart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(scatterchart);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(38:4) {#if data && xKey && yKey }",
    		ctx
    	});

    	return block;
    }

    // (47:16) {#each Object.keys(dataKeys) as key}
    function create_each_block$5(ctx) {
    	let option;
    	let t_value = /*dataKeys*/ ctx[2][/*key*/ ctx[6]] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*key*/ ctx[6];
    			option.value = option.__value;
    			add_location(option, file$6, 47, 20, 1470);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(47:16) {#each Object.keys(dataKeys) as key}",
    		ctx
    	});

    	return block;
    }

    // (37:0) <Media col="wide">
    function create_default_slot$6(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*data*/ ctx[0] && /*xKey*/ ctx[3] && /*yKey*/ ctx[1] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*data*/ ctx[0] && /*xKey*/ ctx[3] && /*yKey*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*data, yKey*/ 3) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(37:0) <Media col=\\\"wide\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let section;
    	let t;
    	let media;
    	let current;

    	section = new Section({
    			props: {
    				$$slots: { default: [create_default_slot_1$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	media = new Media({
    			props: {
    				col: "wide",
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(section.$$.fragment);
    			t = space();
    			create_component(media.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(section, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(media, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const section_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				section_changes.$$scope = { dirty, ctx };
    			}

    			section.$set(section_changes);
    			const media_changes = {};

    			if (dirty & /*$$scope, yKey, data*/ 515) {
    				media_changes.$$scope = { dirty, ctx };
    			}

    			media.$set(media_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(section.$$.fragment, local);
    			transition_in(media.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(section.$$.fragment, local);
    			transition_out(media.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(section, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(media, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const threshold$6 = 0.65;

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Goedert', slots, []);

    	const dataKeys = {
    		Ctch_p: "Catching %",
    		TD_all: "All Touchdowns",
    		TD_rec: "Receiving Touchdowns",
    		Num_off: "# Offensive Snaps",
    		Num_def: "# Defensive Snaps",
    		Tgts: "Targets"
    	};

    	let data;
    	let xKey = "Week";
    	let yKey = "TD_all";
    	let colors = [[166, 206, 227]];
    	getData("data/goedert2021.csv").then(result => $$invalidate(0, data = result));
    	const writable_props = [];

    	Object_1$5.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Goedert> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		yKey = select_value(this);
    		$$invalidate(1, yKey);
    		$$invalidate(2, dataKeys);
    	}

    	$$self.$capture_state = () => ({
    		Section,
    		getData,
    		ScatterChart,
    		Media,
    		threshold: threshold$6,
    		dataKeys,
    		data,
    		xKey,
    		yKey,
    		colors
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('xKey' in $$props) $$invalidate(3, xKey = $$props.xKey);
    		if ('yKey' in $$props) $$invalidate(1, yKey = $$props.yKey);
    		if ('colors' in $$props) $$invalidate(4, colors = $$props.colors);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data, yKey, dataKeys, xKey, colors, select_change_handler];
    }

    class Goedert extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Goedert",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/charts/Chase.svelte generated by Svelte v3.44.1 */

    const { Object: Object_1$4 } = globals;
    const file$5 = "src/charts/Chase.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (30:0) <Section>
    function create_default_slot_1$5(ctx) {
    	let h2;
    	let t1;
    	let p;
    	let t2;
    	let mark0;
    	let t4;
    	let mark1;
    	let t6;
    	let mark2;
    	let t8;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Ja'Marr Chase: A Closer Look";
    			t1 = space();
    			p = element("p");
    			t2 = text("Use the dropdown menu to explore available player stats. For Chase, a wide receiver, the stats to explore\n        closely include ");
    			mark0 = element("mark");
    			mark0.textContent = "receiving touchdowns";
    			t4 = text(", ");
    			mark1 = element("mark");
    			mark1.textContent = "catching percentage";
    			t6 = text(", and number of\n        ");
    			mark2 = element("mark");
    			mark2.textContent = "fumbles";
    			t8 = text(".");
    			add_location(h2, file$5, 30, 4, 709);
    			add_location(mark0, file$5, 33, 24, 893);
    			add_location(mark1, file$5, 33, 59, 928);
    			add_location(mark2, file$5, 34, 8, 984);
    			add_location(p, file$5, 31, 4, 751);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t2);
    			append_dev(p, mark0);
    			append_dev(p, t4);
    			append_dev(p, mark1);
    			append_dev(p, t6);
    			append_dev(p, mark2);
    			append_dev(p, t8);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(30:0) <Section>",
    		ctx
    	});

    	return block;
    }

    // (40:4) {#if data && xKey && yKey }
    function create_if_block$5(ctx) {
    	let div0;
    	let scatterchart;
    	let t0;
    	let p;
    	let t2;
    	let div1;
    	let h3;
    	let t4;
    	let span;
    	let t6;
    	let select;
    	let br;
    	let current;
    	let mounted;
    	let dispose;

    	scatterchart = new ScatterChart({
    			props: {
    				diameter: 15,
    				data: /*data*/ ctx[0],
    				xKey: /*xKey*/ ctx[3],
    				yKey: /*yKey*/ ctx[1],
    				colors: /*colors*/ ctx[4]
    			},
    			$$inline: true
    		});

    	let each_value = Object.keys(/*dataKeys*/ ctx[2]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(scatterchart.$$.fragment);
    			t0 = space();
    			p = element("p");
    			p.textContent = "Week";
    			t2 = space();
    			div1 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Explore the data";
    			t4 = space();
    			span = element("span");
    			span.textContent = "Y Axis";
    			t6 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			br = element("br");
    			attr_dev(p, "class", "x-label");
    			add_location(p, file$5, 42, 12, 1212);
    			attr_dev(div0, "class", "media");
    			set_style(div0, "height", "400px");
    			add_location(div0, file$5, 40, 8, 1086);
    			set_style(h3, "padding-bottom", "10px");
    			add_location(h3, file$5, 45, 12, 1320);
    			attr_dev(span, "class", "label-block");
    			add_location(span, file$5, 46, 12, 1387);
    			if (/*yKey*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[5].call(select));
    			add_location(select, file$5, 47, 12, 1439);
    			add_location(br, file$5, 51, 21, 1629);
    			attr_dev(div1, "class", "media");
    			set_style(div1, "margin-top", "80px");
    			add_location(div1, file$5, 44, 8, 1263);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(scatterchart, div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, p);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h3);
    			append_dev(div1, t4);
    			append_dev(div1, span);
    			append_dev(div1, t6);
    			append_dev(div1, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*yKey*/ ctx[1]);
    			append_dev(div1, br);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*select_change_handler*/ ctx[5]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const scatterchart_changes = {};
    			if (dirty & /*data*/ 1) scatterchart_changes.data = /*data*/ ctx[0];
    			if (dirty & /*yKey*/ 2) scatterchart_changes.yKey = /*yKey*/ ctx[1];
    			scatterchart.$set(scatterchart_changes);

    			if (dirty & /*Object, dataKeys*/ 4) {
    				each_value = Object.keys(/*dataKeys*/ ctx[2]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*yKey, Object, dataKeys*/ 6) {
    				select_option(select, /*yKey*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scatterchart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scatterchart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(scatterchart);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(40:4) {#if data && xKey && yKey }",
    		ctx
    	});

    	return block;
    }

    // (49:16) {#each Object.keys(dataKeys) as key}
    function create_each_block$4(ctx) {
    	let option;
    	let t_value = /*dataKeys*/ ctx[2][/*key*/ ctx[6]] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*key*/ ctx[6];
    			option.value = option.__value;
    			add_location(option, file$5, 49, 20, 1539);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(49:16) {#each Object.keys(dataKeys) as key}",
    		ctx
    	});

    	return block;
    }

    // (39:0) <Media col="wide">
    function create_default_slot$5(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*data*/ ctx[0] && /*xKey*/ ctx[3] && /*yKey*/ ctx[1] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*data*/ ctx[0] && /*xKey*/ ctx[3] && /*yKey*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*data, yKey*/ 3) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(39:0) <Media col=\\\"wide\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let section;
    	let t;
    	let media;
    	let current;

    	section = new Section({
    			props: {
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	media = new Media({
    			props: {
    				col: "wide",
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(section.$$.fragment);
    			t = space();
    			create_component(media.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(section, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(media, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const section_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				section_changes.$$scope = { dirty, ctx };
    			}

    			section.$set(section_changes);
    			const media_changes = {};

    			if (dirty & /*$$scope, yKey, data*/ 515) {
    				media_changes.$$scope = { dirty, ctx };
    			}

    			media.$set(media_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(section.$$.fragment, local);
    			transition_in(media.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(section.$$.fragment, local);
    			transition_out(media.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(section, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(media, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const threshold$5 = 0.65;

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Chase', slots, []);

    	const dataKeys = {
    		Yds_rush: "Rushing Yards Gained",
    		Yds_rec: "Receiving Yards",
    		TD_rec: "Receiving Touchdowns",
    		TD_rush: "Rushing Touchdowns",
    		Tgt: "# Targets",
    		Ctch_p: "Catching %",
    		Fmb: "# Fumbles"
    	};

    	let data;
    	let xKey = "Week";
    	let yKey = "Yds_rush";
    	let colors = [[166, 206, 227]];
    	getData("data/chase2021.csv").then(result => $$invalidate(0, data = result));
    	const writable_props = [];

    	Object_1$4.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Chase> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		yKey = select_value(this);
    		$$invalidate(1, yKey);
    		$$invalidate(2, dataKeys);
    	}

    	$$self.$capture_state = () => ({
    		Section,
    		getData,
    		ScatterChart,
    		Media,
    		threshold: threshold$5,
    		dataKeys,
    		data,
    		xKey,
    		yKey,
    		colors
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('xKey' in $$props) $$invalidate(3, xKey = $$props.xKey);
    		if ('yKey' in $$props) $$invalidate(1, yKey = $$props.yKey);
    		if ('colors' in $$props) $$invalidate(4, colors = $$props.colors);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data, yKey, dataKeys, xKey, colors, select_change_handler];
    }

    class Chase extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chase",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/charts/Beckham.svelte generated by Svelte v3.44.1 */

    const { Object: Object_1$3 } = globals;
    const file$4 = "src/charts/Beckham.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (29:0) <Section>
    function create_default_slot_1$4(ctx) {
    	let h2;
    	let t1;
    	let p;
    	let t2;
    	let mark0;
    	let t4;
    	let mark1;
    	let t6;
    	let mark2;
    	let t8;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Odell Beckham Jr: A Closer Look";
    			t1 = space();
    			p = element("p");
    			t2 = text("Use the dropdown menu to explore available player stats. As a wide receiver, it is especially useful to check\n        out Beckham's ");
    			mark0 = element("mark");
    			mark0.textContent = "catching percentage";
    			t4 = text(", number of ");
    			mark1 = element("mark");
    			mark1.textContent = "targets";
    			t6 = text(", and ");
    			mark2 = element("mark");
    			mark2.textContent = "receiving yards";
    			t8 = text(".");
    			add_location(h2, file$4, 29, 4, 710);
    			add_location(mark0, file$4, 32, 22, 899);
    			add_location(mark1, file$4, 32, 66, 943);
    			add_location(mark2, file$4, 32, 92, 969);
    			add_location(p, file$4, 30, 4, 755);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t2);
    			append_dev(p, mark0);
    			append_dev(p, t4);
    			append_dev(p, mark1);
    			append_dev(p, t6);
    			append_dev(p, mark2);
    			append_dev(p, t8);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(29:0) <Section>",
    		ctx
    	});

    	return block;
    }

    // (38:4) {#if data && xKey && yKey }
    function create_if_block$4(ctx) {
    	let div0;
    	let scatterchart;
    	let t0;
    	let p;
    	let t2;
    	let div1;
    	let h3;
    	let t4;
    	let span;
    	let t6;
    	let select;
    	let br;
    	let current;
    	let mounted;
    	let dispose;

    	scatterchart = new ScatterChart({
    			props: {
    				diameter: 15,
    				data: /*data*/ ctx[0],
    				xKey: /*xKey*/ ctx[3],
    				yKey: /*yKey*/ ctx[1],
    				colors: /*colors*/ ctx[4]
    			},
    			$$inline: true
    		});

    	let each_value = Object.keys(/*dataKeys*/ ctx[2]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(scatterchart.$$.fragment);
    			t0 = space();
    			p = element("p");
    			p.textContent = "Week";
    			t2 = space();
    			div1 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Explore the data";
    			t4 = space();
    			span = element("span");
    			span.textContent = "Y Axis";
    			t6 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			br = element("br");
    			attr_dev(p, "class", "x-label");
    			add_location(p, file$4, 40, 12, 1206);
    			attr_dev(div0, "class", "media");
    			set_style(div0, "height", "400px");
    			add_location(div0, file$4, 38, 8, 1079);
    			set_style(h3, "padding-bottom", "10px");
    			add_location(h3, file$4, 43, 12, 1314);
    			attr_dev(span, "class", "label-block");
    			add_location(span, file$4, 44, 12, 1381);
    			if (/*yKey*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[5].call(select));
    			add_location(select, file$4, 45, 12, 1433);
    			add_location(br, file$4, 49, 21, 1623);
    			attr_dev(div1, "class", "media");
    			set_style(div1, "margin-top", "80px");
    			add_location(div1, file$4, 42, 8, 1257);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(scatterchart, div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, p);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h3);
    			append_dev(div1, t4);
    			append_dev(div1, span);
    			append_dev(div1, t6);
    			append_dev(div1, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*yKey*/ ctx[1]);
    			append_dev(div1, br);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*select_change_handler*/ ctx[5]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const scatterchart_changes = {};
    			if (dirty & /*data*/ 1) scatterchart_changes.data = /*data*/ ctx[0];
    			if (dirty & /*yKey*/ 2) scatterchart_changes.yKey = /*yKey*/ ctx[1];
    			scatterchart.$set(scatterchart_changes);

    			if (dirty & /*Object, dataKeys*/ 4) {
    				each_value = Object.keys(/*dataKeys*/ ctx[2]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*yKey, Object, dataKeys*/ 6) {
    				select_option(select, /*yKey*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scatterchart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scatterchart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(scatterchart);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(38:4) {#if data && xKey && yKey }",
    		ctx
    	});

    	return block;
    }

    // (47:16) {#each Object.keys(dataKeys) as key}
    function create_each_block$3(ctx) {
    	let option;
    	let t_value = /*dataKeys*/ ctx[2][/*key*/ ctx[6]] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*key*/ ctx[6];
    			option.value = option.__value;
    			add_location(option, file$4, 47, 20, 1533);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(47:16) {#each Object.keys(dataKeys) as key}",
    		ctx
    	});

    	return block;
    }

    // (37:0) <Media col="wide">
    function create_default_slot$4(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*data*/ ctx[0] && /*xKey*/ ctx[3] && /*yKey*/ ctx[1] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*data*/ ctx[0] && /*xKey*/ ctx[3] && /*yKey*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*data, yKey*/ 3) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(37:0) <Media col=\\\"wide\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let section;
    	let t;
    	let media;
    	let current;

    	section = new Section({
    			props: {
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	media = new Media({
    			props: {
    				col: "wide",
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(section.$$.fragment);
    			t = space();
    			create_component(media.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(section, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(media, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const section_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				section_changes.$$scope = { dirty, ctx };
    			}

    			section.$set(section_changes);
    			const media_changes = {};

    			if (dirty & /*$$scope, yKey, data*/ 515) {
    				media_changes.$$scope = { dirty, ctx };
    			}

    			media.$set(media_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(section.$$.fragment, local);
    			transition_in(media.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(section.$$.fragment, local);
    			transition_out(media.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(section, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(media, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const threshold$4 = 0.65;

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Beckham', slots, []);

    	const dataKeys = {
    		Yds_rush: "Rushing Yards Gained",
    		Yds_rec: "Receiving Yards",
    		TD_rec: "Receiving Touchdowns",
    		TD_rush: "Rushing Touchdowns",
    		Tgt: "# Targets",
    		Ctch_p: "Catching %",
    		Fmb: "# Fumbles"
    	};

    	let data;
    	let xKey = "Week";
    	let yKey = "Yds_rush";
    	let colors = [[166, 206, 227]];
    	getData("data/beckham2021.csv").then(result => $$invalidate(0, data = result));
    	const writable_props = [];

    	Object_1$3.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Beckham> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		yKey = select_value(this);
    		$$invalidate(1, yKey);
    		$$invalidate(2, dataKeys);
    	}

    	$$self.$capture_state = () => ({
    		Section,
    		getData,
    		ScatterChart,
    		Media,
    		threshold: threshold$4,
    		dataKeys,
    		data,
    		xKey,
    		yKey,
    		colors
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('xKey' in $$props) $$invalidate(3, xKey = $$props.xKey);
    		if ('yKey' in $$props) $$invalidate(1, yKey = $$props.yKey);
    		if ('colors' in $$props) $$invalidate(4, colors = $$props.colors);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data, yKey, dataKeys, xKey, colors, select_change_handler];
    }

    class Beckham extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Beckham",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/charts/Barkley.svelte generated by Svelte v3.44.1 */

    const { Object: Object_1$2 } = globals;
    const file$3 = "src/charts/Barkley.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (30:0) <Section>
    function create_default_slot_1$3(ctx) {
    	let h2;
    	let t1;
    	let p;
    	let t2;
    	let mark0;
    	let t4;
    	let mark1;
    	let t6;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Saquon Barkley: A Closer Look";
    			t1 = space();
    			p = element("p");
    			t2 = text("Use the dropdown menu to explore available player stats. Some particularly interesting stats for Barkley (a\n        running back) include the ");
    			mark0 = element("mark");
    			mark0.textContent = "rushing yards gained";
    			t4 = text(" (the total number of yards a player gains from\n        running with the ball post-catch/handoff per game) and the ");
    			mark1 = element("mark");
    			mark1.textContent = "rushing touchdowns";
    			t6 = text(" (running the ball\n        into the end zone for a touchdown).");
    			add_location(h2, file$3, 30, 4, 711);
    			add_location(mark0, file$3, 33, 34, 908);
    			add_location(mark1, file$3, 34, 67, 1056);
    			add_location(p, file$3, 31, 4, 754);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t2);
    			append_dev(p, mark0);
    			append_dev(p, t4);
    			append_dev(p, mark1);
    			append_dev(p, t6);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(30:0) <Section>",
    		ctx
    	});

    	return block;
    }

    // (41:4) {#if data && xKey && yKey }
    function create_if_block$3(ctx) {
    	let div0;
    	let scatterchart;
    	let t0;
    	let p;
    	let t2;
    	let div1;
    	let h3;
    	let t4;
    	let span;
    	let t6;
    	let select;
    	let br;
    	let current;
    	let mounted;
    	let dispose;

    	scatterchart = new ScatterChart({
    			props: {
    				diameter: 15,
    				data: /*data*/ ctx[0],
    				xKey: /*xKey*/ ctx[3],
    				yKey: /*yKey*/ ctx[1],
    				colors: /*colors*/ ctx[4]
    			},
    			$$inline: true
    		});

    	let each_value = Object.keys(/*dataKeys*/ ctx[2]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(scatterchart.$$.fragment);
    			t0 = space();
    			p = element("p");
    			p.textContent = "Week";
    			t2 = space();
    			div1 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Explore the data";
    			t4 = space();
    			span = element("span");
    			span.textContent = "Y Axis";
    			t6 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			br = element("br");
    			attr_dev(p, "class", "x-label");
    			add_location(p, file$3, 43, 12, 1357);
    			attr_dev(div0, "class", "media");
    			set_style(div0, "height", "400px");
    			add_location(div0, file$3, 41, 8, 1230);
    			set_style(h3, "padding-bottom", "10px");
    			add_location(h3, file$3, 46, 12, 1465);
    			attr_dev(span, "class", "label-block");
    			add_location(span, file$3, 47, 12, 1532);
    			if (/*yKey*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[5].call(select));
    			add_location(select, file$3, 48, 12, 1584);
    			add_location(br, file$3, 52, 21, 1774);
    			attr_dev(div1, "class", "media");
    			set_style(div1, "margin-top", "80px");
    			add_location(div1, file$3, 45, 8, 1408);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(scatterchart, div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, p);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h3);
    			append_dev(div1, t4);
    			append_dev(div1, span);
    			append_dev(div1, t6);
    			append_dev(div1, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*yKey*/ ctx[1]);
    			append_dev(div1, br);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*select_change_handler*/ ctx[5]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const scatterchart_changes = {};
    			if (dirty & /*data*/ 1) scatterchart_changes.data = /*data*/ ctx[0];
    			if (dirty & /*yKey*/ 2) scatterchart_changes.yKey = /*yKey*/ ctx[1];
    			scatterchart.$set(scatterchart_changes);

    			if (dirty & /*Object, dataKeys*/ 4) {
    				each_value = Object.keys(/*dataKeys*/ ctx[2]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*yKey, Object, dataKeys*/ 6) {
    				select_option(select, /*yKey*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scatterchart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scatterchart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(scatterchart);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(41:4) {#if data && xKey && yKey }",
    		ctx
    	});

    	return block;
    }

    // (50:16) {#each Object.keys(dataKeys) as key}
    function create_each_block$2(ctx) {
    	let option;
    	let t_value = /*dataKeys*/ ctx[2][/*key*/ ctx[6]] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*key*/ ctx[6];
    			option.value = option.__value;
    			add_location(option, file$3, 50, 20, 1684);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(50:16) {#each Object.keys(dataKeys) as key}",
    		ctx
    	});

    	return block;
    }

    // (40:0) <Media col="wide">
    function create_default_slot$3(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*data*/ ctx[0] && /*xKey*/ ctx[3] && /*yKey*/ ctx[1] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*data*/ ctx[0] && /*xKey*/ ctx[3] && /*yKey*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*data, yKey*/ 3) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(40:0) <Media col=\\\"wide\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let section;
    	let t;
    	let media;
    	let current;

    	section = new Section({
    			props: {
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	media = new Media({
    			props: {
    				col: "wide",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(section.$$.fragment);
    			t = space();
    			create_component(media.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(section, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(media, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const section_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				section_changes.$$scope = { dirty, ctx };
    			}

    			section.$set(section_changes);
    			const media_changes = {};

    			if (dirty & /*$$scope, yKey, data*/ 515) {
    				media_changes.$$scope = { dirty, ctx };
    			}

    			media.$set(media_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(section.$$.fragment, local);
    			transition_in(media.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(section.$$.fragment, local);
    			transition_out(media.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(section, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(media, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const threshold$3 = 0.65;

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Barkley', slots, []);

    	const dataKeys = {
    		Yds_rush: "Rushing Yards Gained",
    		Yds_rec: "Receiving Yards",
    		TD_rec: "Receiving Touchdowns",
    		TD_rush: "Rushing Touchdowns",
    		Tgt: "# Targets",
    		Ctch_p: "Catching %",
    		Fmb: "# Fumbles"
    	};

    	let data;
    	let xKey = "Week";
    	let yKey = "Yds_rush";
    	let colors = [[166, 206, 227]];
    	getData("data/barkley2021.csv").then(result => $$invalidate(0, data = result));
    	const writable_props = [];

    	Object_1$2.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Barkley> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		yKey = select_value(this);
    		$$invalidate(1, yKey);
    		$$invalidate(2, dataKeys);
    	}

    	$$self.$capture_state = () => ({
    		Section,
    		getData,
    		ScatterChart,
    		Media,
    		threshold: threshold$3,
    		dataKeys,
    		data,
    		xKey,
    		yKey,
    		colors
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('xKey' in $$props) $$invalidate(3, xKey = $$props.xKey);
    		if ('yKey' in $$props) $$invalidate(1, yKey = $$props.yKey);
    		if ('colors' in $$props) $$invalidate(4, colors = $$props.colors);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data, yKey, dataKeys, xKey, colors, select_change_handler];
    }

    class Barkley extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Barkley",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/charts/Dillon.svelte generated by Svelte v3.44.1 */

    const { Object: Object_1$1 } = globals;
    const file$2 = "src/charts/Dillon.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (29:0) <Section>
    function create_default_slot_1$2(ctx) {
    	let h2;
    	let t1;
    	let p;
    	let t2;
    	let mark0;
    	let t4;
    	let mark1;
    	let t6;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "AJ Dillon: A Closer Look";
    			t1 = space();
    			p = element("p");
    			t2 = text("Use the dropdown menu to explore available player stats. As another running back, some particularly interesting\n        stats include the ");
    			mark0 = element("mark");
    			mark0.textContent = "rushing yards gained";
    			t4 = text(" and the ");
    			mark1 = element("mark");
    			mark1.textContent = "rushing touchdowns";
    			t6 = text(".");
    			add_location(h2, file$2, 29, 4, 707);
    			add_location(mark0, file$2, 32, 26, 895);
    			add_location(mark1, file$2, 32, 68, 937);
    			add_location(p, file$2, 30, 4, 745);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t2);
    			append_dev(p, mark0);
    			append_dev(p, t4);
    			append_dev(p, mark1);
    			append_dev(p, t6);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(29:0) <Section>",
    		ctx
    	});

    	return block;
    }

    // (38:4) {#if data && xKey && yKey }
    function create_if_block$2(ctx) {
    	let div0;
    	let scatterchart;
    	let t0;
    	let p;
    	let t2;
    	let div1;
    	let h3;
    	let t4;
    	let span;
    	let t6;
    	let select;
    	let br;
    	let current;
    	let mounted;
    	let dispose;

    	scatterchart = new ScatterChart({
    			props: {
    				diameter: 15,
    				data: /*data*/ ctx[0],
    				xKey: /*xKey*/ ctx[3],
    				yKey: /*yKey*/ ctx[1],
    				colors: /*colors*/ ctx[4]
    			},
    			$$inline: true
    		});

    	let each_value = Object.keys(/*dataKeys*/ ctx[2]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(scatterchart.$$.fragment);
    			t0 = space();
    			p = element("p");
    			p.textContent = "Week";
    			t2 = space();
    			div1 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Explore the data";
    			t4 = space();
    			span = element("span");
    			span.textContent = "Y Axis";
    			t6 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			br = element("br");
    			attr_dev(p, "class", "x-label");
    			add_location(p, file$2, 40, 12, 1177);
    			attr_dev(div0, "class", "media");
    			set_style(div0, "height", "400px");
    			add_location(div0, file$2, 38, 8, 1050);
    			set_style(h3, "padding-bottom", "10px");
    			add_location(h3, file$2, 43, 12, 1285);
    			attr_dev(span, "class", "label-block");
    			add_location(span, file$2, 44, 12, 1352);
    			if (/*yKey*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[5].call(select));
    			add_location(select, file$2, 45, 12, 1404);
    			add_location(br, file$2, 49, 21, 1594);
    			attr_dev(div1, "class", "media");
    			set_style(div1, "margin-top", "80px");
    			add_location(div1, file$2, 42, 8, 1228);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(scatterchart, div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, p);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h3);
    			append_dev(div1, t4);
    			append_dev(div1, span);
    			append_dev(div1, t6);
    			append_dev(div1, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*yKey*/ ctx[1]);
    			append_dev(div1, br);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*select_change_handler*/ ctx[5]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const scatterchart_changes = {};
    			if (dirty & /*data*/ 1) scatterchart_changes.data = /*data*/ ctx[0];
    			if (dirty & /*yKey*/ 2) scatterchart_changes.yKey = /*yKey*/ ctx[1];
    			scatterchart.$set(scatterchart_changes);

    			if (dirty & /*Object, dataKeys*/ 4) {
    				each_value = Object.keys(/*dataKeys*/ ctx[2]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*yKey, Object, dataKeys*/ 6) {
    				select_option(select, /*yKey*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scatterchart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scatterchart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(scatterchart);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(38:4) {#if data && xKey && yKey }",
    		ctx
    	});

    	return block;
    }

    // (47:16) {#each Object.keys(dataKeys) as key}
    function create_each_block$1(ctx) {
    	let option;
    	let t_value = /*dataKeys*/ ctx[2][/*key*/ ctx[6]] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*key*/ ctx[6];
    			option.value = option.__value;
    			add_location(option, file$2, 47, 20, 1504);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(47:16) {#each Object.keys(dataKeys) as key}",
    		ctx
    	});

    	return block;
    }

    // (37:0) <Media col="wide">
    function create_default_slot$2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*data*/ ctx[0] && /*xKey*/ ctx[3] && /*yKey*/ ctx[1] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*data*/ ctx[0] && /*xKey*/ ctx[3] && /*yKey*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*data, yKey*/ 3) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(37:0) <Media col=\\\"wide\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let section;
    	let t;
    	let media;
    	let current;

    	section = new Section({
    			props: {
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	media = new Media({
    			props: {
    				col: "wide",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(section.$$.fragment);
    			t = space();
    			create_component(media.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(section, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(media, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const section_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				section_changes.$$scope = { dirty, ctx };
    			}

    			section.$set(section_changes);
    			const media_changes = {};

    			if (dirty & /*$$scope, yKey, data*/ 515) {
    				media_changes.$$scope = { dirty, ctx };
    			}

    			media.$set(media_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(section.$$.fragment, local);
    			transition_in(media.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(section.$$.fragment, local);
    			transition_out(media.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(section, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(media, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const threshold$2 = 0.65;

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dillon', slots, []);

    	const dataKeys = {
    		Yds_rush: "Rushing Yards Gained",
    		Yds_rec: "Receiving Yards",
    		TD_rec: "Receiving Touchdowns",
    		TD_rush: "Rushing Touchdowns",
    		Tgt: "# Targets",
    		Ctch_p: "Catching %",
    		Fmb: "# Fumbles"
    	};

    	let data;
    	let xKey = "Week";
    	let yKey = "Ctch_p";
    	let colors = [[166, 206, 227]];
    	getData("data/dillon2021.csv").then(result => $$invalidate(0, data = result));
    	const writable_props = [];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dillon> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		yKey = select_value(this);
    		$$invalidate(1, yKey);
    		$$invalidate(2, dataKeys);
    	}

    	$$self.$capture_state = () => ({
    		Section,
    		getData,
    		ScatterChart,
    		Media,
    		threshold: threshold$2,
    		dataKeys,
    		data,
    		xKey,
    		yKey,
    		colors
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('xKey' in $$props) $$invalidate(3, xKey = $$props.xKey);
    		if ('yKey' in $$props) $$invalidate(1, yKey = $$props.yKey);
    		if ('colors' in $$props) $$invalidate(4, colors = $$props.colors);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data, yKey, dataKeys, xKey, colors, select_change_handler];
    }

    class Dillon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dillon",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/charts/Folk.svelte generated by Svelte v3.44.1 */

    const { Object: Object_1 } = globals;
    const file$1 = "src/charts/Folk.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (28:0) <Section>
    function create_default_slot_1$1(ctx) {
    	let h2;
    	let t1;
    	let p;
    	let t2;
    	let mark0;
    	let t4;
    	let mark1;
    	let t6;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Nick Folk: A Closer Look";
    			t1 = space();
    			p = element("p");
    			t2 = text("Use the dropdown menu to explore available player stats. Since Folk is a kicker, the stats to pay attention to\n        are the ");
    			mark0 = element("mark");
    			mark0.textContent = "% of field goals";
    			t4 = text(" & ");
    			mark1 = element("mark");
    			mark1.textContent = "extra points";
    			t6 = text(" made.");
    			add_location(h2, file$1, 28, 4, 676);
    			add_location(mark0, file$1, 31, 16, 853);
    			add_location(mark1, file$1, 31, 48, 885);
    			add_location(p, file$1, 29, 4, 714);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t2);
    			append_dev(p, mark0);
    			append_dev(p, t4);
    			append_dev(p, mark1);
    			append_dev(p, t6);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(28:0) <Section>",
    		ctx
    	});

    	return block;
    }

    // (37:4) {#if data && xKey && yKey }
    function create_if_block$1(ctx) {
    	let div0;
    	let scatterchart;
    	let t0;
    	let p;
    	let t2;
    	let div1;
    	let h3;
    	let t4;
    	let span;
    	let t6;
    	let select;
    	let br;
    	let current;
    	let mounted;
    	let dispose;

    	scatterchart = new ScatterChart({
    			props: {
    				diameter: 15,
    				data: /*data*/ ctx[0],
    				xKey: /*xKey*/ ctx[3],
    				yKey: /*yKey*/ ctx[1],
    				colors: /*colors*/ ctx[4]
    			},
    			$$inline: true
    		});

    	let each_value = Object.keys(/*dataKeys*/ ctx[2]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(scatterchart.$$.fragment);
    			t0 = space();
    			p = element("p");
    			p.textContent = "Week";
    			t2 = space();
    			div1 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Explore the data";
    			t4 = space();
    			span = element("span");
    			span.textContent = "Y Axis";
    			t6 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			br = element("br");
    			attr_dev(p, "class", "x-label");
    			add_location(p, file$1, 39, 12, 1124);
    			attr_dev(div0, "class", "media");
    			set_style(div0, "height", "400px");
    			add_location(div0, file$1, 37, 8, 997);
    			set_style(h3, "padding-bottom", "10px");
    			add_location(h3, file$1, 42, 12, 1232);
    			attr_dev(span, "class", "label-block");
    			add_location(span, file$1, 43, 12, 1299);
    			if (/*yKey*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[5].call(select));
    			add_location(select, file$1, 44, 12, 1351);
    			add_location(br, file$1, 48, 21, 1541);
    			attr_dev(div1, "class", "media");
    			set_style(div1, "margin-top", "80px");
    			add_location(div1, file$1, 41, 8, 1175);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(scatterchart, div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, p);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h3);
    			append_dev(div1, t4);
    			append_dev(div1, span);
    			append_dev(div1, t6);
    			append_dev(div1, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*yKey*/ ctx[1]);
    			append_dev(div1, br);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*select_change_handler*/ ctx[5]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const scatterchart_changes = {};
    			if (dirty & /*data*/ 1) scatterchart_changes.data = /*data*/ ctx[0];
    			if (dirty & /*yKey*/ 2) scatterchart_changes.yKey = /*yKey*/ ctx[1];
    			scatterchart.$set(scatterchart_changes);

    			if (dirty & /*Object, dataKeys*/ 4) {
    				each_value = Object.keys(/*dataKeys*/ ctx[2]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*yKey, Object, dataKeys*/ 6) {
    				select_option(select, /*yKey*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scatterchart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scatterchart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(scatterchart);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(37:4) {#if data && xKey && yKey }",
    		ctx
    	});

    	return block;
    }

    // (46:16) {#each Object.keys(dataKeys) as key}
    function create_each_block(ctx) {
    	let option;
    	let t_value = /*dataKeys*/ ctx[2][/*key*/ ctx[6]] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*key*/ ctx[6];
    			option.value = option.__value;
    			add_location(option, file$1, 46, 20, 1451);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(46:16) {#each Object.keys(dataKeys) as key}",
    		ctx
    	});

    	return block;
    }

    // (36:0) <Media col="wide">
    function create_default_slot$1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*data*/ ctx[0] && /*xKey*/ ctx[3] && /*yKey*/ ctx[1] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*data*/ ctx[0] && /*xKey*/ ctx[3] && /*yKey*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*data, yKey*/ 3) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(36:0) <Media col=\\\"wide\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let section;
    	let t;
    	let media;
    	let current;

    	section = new Section({
    			props: {
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	media = new Media({
    			props: {
    				col: "wide",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(section.$$.fragment);
    			t = space();
    			create_component(media.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(section, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(media, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const section_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				section_changes.$$scope = { dirty, ctx };
    			}

    			section.$set(section_changes);
    			const media_changes = {};

    			if (dirty & /*$$scope, yKey, data*/ 515) {
    				media_changes.$$scope = { dirty, ctx };
    			}

    			media.$set(media_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(section.$$.fragment, local);
    			transition_in(media.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(section.$$.fragment, local);
    			transition_out(media.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(section, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(media, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const threshold$1 = 0.65;

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Folk', slots, []);

    	const dataKeys = {
    		XPM: "Extra Points Made",
    		XPA: "Extra Points Attempted",
    		XP: "% Extra Points Made",
    		FGM: "Field Goals Made",
    		FGA: "Field Goals Attempted",
    		FG: "% Field Goals Made"
    	};

    	let data;
    	let xKey = "Week";
    	let yKey = "XPM";
    	let colors = [[166, 206, 227]];
    	getData("data/folk2021.csv").then(result => $$invalidate(0, data = result));
    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Folk> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		yKey = select_value(this);
    		$$invalidate(1, yKey);
    		$$invalidate(2, dataKeys);
    	}

    	$$self.$capture_state = () => ({
    		Section,
    		getData,
    		ScatterChart,
    		Media,
    		threshold: threshold$1,
    		dataKeys,
    		data,
    		xKey,
    		yKey,
    		colors
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('xKey' in $$props) $$invalidate(3, xKey = $$props.xKey);
    		if ('yKey' in $$props) $$invalidate(1, yKey = $$props.yKey);
    		if ('colors' in $$props) $$invalidate(4, colors = $$props.colors);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data, yKey, dataKeys, xKey, colors, select_change_handler];
    }

    class Folk extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Folk",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.44.1 */
    const file = "src/App.svelte";

    // (113:2) <Arrow color="white" {animation}>
    function create_default_slot_26(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Scroll to begin");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_26.name,
    		type: "slot",
    		source: "(113:2) <Arrow color=\\\"white\\\" {animation}>",
    		ctx
    	});

    	return block;
    }

    // (109:0) <Header bgimage="./img/background-main.jpg" bgfixed={true} theme="dark">
    function create_default_slot_25(ctx) {
    	let h1;
    	let t1;
    	let p;
    	let t3;
    	let div;
    	let arrow;
    	let current;

    	arrow = new Arrow({
    			props: {
    				color: "white",
    				animation: /*animation*/ ctx[4],
    				$$slots: { default: [create_default_slot_26] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Fantasy Football: The Road to Victory";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Ariana Jorgensen";
    			t3 = space();
    			div = element("div");
    			create_component(arrow.$$.fragment);
    			attr_dev(h1, "class", "text-shadow");
    			add_location(h1, file, 109, 1, 2840);
    			attr_dev(p, "class", "inset-medium text-big text-shadow");
    			add_location(p, file, 110, 1, 2908);
    			attr_dev(div, "class", "text-shadow");
    			set_style(div, "margin-top", "48px");
    			add_location(div, file, 111, 1, 2975);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(arrow, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const arrow_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				arrow_changes.$$scope = { dirty, ctx };
    			}

    			arrow.$set(arrow_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(arrow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(arrow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div);
    			destroy_component(arrow);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_25.name,
    		type: "slot",
    		source: "(109:0) <Header bgimage=\\\"./img/background-main.jpg\\\" bgfixed={true} theme=\\\"dark\\\">",
    		ctx
    	});

    	return block;
    }

    // (117:0) <Filler theme="dark">
    function create_default_slot_24(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "I have been playing fantasy football since 2017. Despite my best efforts, I have yet to achieve\n\t\tthe highest honor: winning first place in the league. I have decided that 2021/2022 will be my year\n\t\tfor victory. To help achieve this goal, I will use this project to analyze my team and predict the\n\t\tlikelihood of finally finishing in first place. Join me in my quest to be the best.";
    			attr_dev(p, "class", "text-big");
    			add_location(p, file, 117, 1, 3128);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_24.name,
    		type: "slot",
    		source: "(117:0) <Filler theme=\\\"dark\\\">",
    		ctx
    	});

    	return block;
    }

    // (126:0) <Filler theme="light">
    function create_default_slot_23(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "For those who are unfamiliar, fantasy football is a competition in which you select NFL players from different\n\t\tteams to form your \"fantasy\" team. Each player earns points for plays made (touchdowns, yards gained, etc.) or\n\t\tloses points (throwing an interception, fumbling the ball, etc.). You go head-to-head with another person in\n\t\tyour league each week, and the player with the most points wins.";
    			attr_dev(p, "class", "text-big");
    			add_location(p, file, 126, 1, 3577);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_23.name,
    		type: "slot",
    		source: "(126:0) <Filler theme=\\\"light\\\">",
    		ctx
    	});

    	return block;
    }

    // (135:0) <Section>
    function create_default_slot_22(ctx) {
    	let h2;
    	let t1;
    	let p;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Meet the Team";
    			t1 = space();
    			p = element("p");
    			p.textContent = "First, allow me to introduce you to the team...";
    			add_location(h2, file, 135, 1, 4030);
    			add_location(p, file, 136, 1, 4054);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_22.name,
    		type: "slot",
    		source: "(135:0) <Section>",
    		ctx
    	});

    	return block;
    }

    // (150:4) {#if data && xKey && yKey && categories && colors && catKey && diameter}
    function create_if_block(ctx) {
    	let div;
    	let scatterchart;
    	let current;

    	scatterchart = new ScatterChart({
    			props: {
    				padding: 15,
    				diameter: /*diameter*/ ctx[5],
    				data: /*data*/ ctx[1],
    				xKey: /*xKey*/ ctx[6],
    				yKey: /*yKey*/ ctx[7],
    				categories: /*categories*/ ctx[3],
    				colors,
    				selected: /*selected*/ ctx[2],
    				catKey: /*catKey*/ ctx[8]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(scatterchart.$$.fragment);
    			attr_dev(div, "class", "chart svelte-1qbchbs");
    			add_location(div, file, 150, 4, 4446);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(scatterchart, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const scatterchart_changes = {};
    			if (dirty & /*data*/ 2) scatterchart_changes.data = /*data*/ ctx[1];
    			if (dirty & /*categories*/ 8) scatterchart_changes.categories = /*categories*/ ctx[3];
    			if (dirty & /*selected*/ 4) scatterchart_changes.selected = /*selected*/ ctx[2];
    			scatterchart.$set(scatterchart_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scatterchart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scatterchart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(scatterchart);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(150:4) {#if data && xKey && yKey && categories && colors && catKey && diameter}",
    		ctx
    	});

    	return block;
    }

    // (145:1) 
    function create_background_slot(ctx) {
    	let div1;
    	let figure;
    	let p0;
    	let t1;
    	let p1;
    	let t3;
    	let div0;
    	let current;
    	let if_block = /*data*/ ctx[1] && /*xKey*/ ctx[6] && /*yKey*/ ctx[7] && /*categories*/ ctx[3] && colors && /*catKey*/ ctx[8] && /*diameter*/ ctx[5] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			figure = element("figure");
    			p0 = element("p");
    			p0.textContent = "Fantasy points";
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = "Year";
    			t3 = space();
    			div0 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(p0, "class", "y-label svelte-1qbchbs");
    			add_location(p0, file, 146, 3, 4263);
    			attr_dev(p1, "class", "x-label svelte-1qbchbs");
    			add_location(p1, file, 147, 3, 4304);
    			attr_dev(div0, "class", "col-wide middle");
    			add_location(div0, file, 148, 3, 4335);
    			attr_dev(figure, "class", "main-scatter");
    			add_location(figure, file, 145, 2, 4230);
    			attr_dev(div1, "slot", "background");
    			add_location(div1, file, 144, 1, 4204);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, figure);
    			append_dev(figure, p0);
    			append_dev(figure, t1);
    			append_dev(figure, p1);
    			append_dev(figure, t3);
    			append_dev(figure, div0);
    			if (if_block) if_block.m(div0, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*data*/ ctx[1] && /*xKey*/ ctx[6] && /*yKey*/ ctx[7] && /*categories*/ ctx[3] && colors && /*catKey*/ ctx[8] && /*diameter*/ ctx[5]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*data, categories*/ 10) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_background_slot.name,
    		type: "slot",
    		source: "(145:1) ",
    		ctx
    	});

    	return block;
    }

    // (188:5) <Em>
    function create_default_slot_21(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Lamar Jackson");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_21.name,
    		type: "slot",
    		source: "(188:5) <Em>",
    		ctx
    	});

    	return block;
    }

    // (201:5) <Em>
    function create_default_slot_20(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Justin Jefferson");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_20.name,
    		type: "slot",
    		source: "(201:5) <Em>",
    		ctx
    	});

    	return block;
    }

    // (214:5) <Em>
    function create_default_slot_19(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Devin Singletary");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_19.name,
    		type: "slot",
    		source: "(214:5) <Em>",
    		ctx
    	});

    	return block;
    }

    // (227:5) <Em>
    function create_default_slot_18(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Dallas Goedert");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_18.name,
    		type: "slot",
    		source: "(227:5) <Em>",
    		ctx
    	});

    	return block;
    }

    // (240:5) <Em>
    function create_default_slot_17(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Ja’Marr Chase");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17.name,
    		type: "slot",
    		source: "(240:5) <Em>",
    		ctx
    	});

    	return block;
    }

    // (253:5) <Em>
    function create_default_slot_16(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("DeVonta Smith");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16.name,
    		type: "slot",
    		source: "(253:5) <Em>",
    		ctx
    	});

    	return block;
    }

    // (266:5) <Em>
    function create_default_slot_15(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Van Jefferson Jr");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15.name,
    		type: "slot",
    		source: "(266:5) <Em>",
    		ctx
    	});

    	return block;
    }

    // (279:5) <Em>
    function create_default_slot_14(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Odell Beckham Jr");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(279:5) <Em>",
    		ctx
    	});

    	return block;
    }

    // (292:5) <Em>
    function create_default_slot_13(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Saquon Barkley");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(292:5) <Em>",
    		ctx
    	});

    	return block;
    }

    // (305:5) <Em>
    function create_default_slot_12(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("AJ Dillon");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(305:5) <Em>",
    		ctx
    	});

    	return block;
    }

    // (318:5) <Em>
    function create_default_slot_11(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Miles Sanders");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(318:5) <Em>",
    		ctx
    	});

    	return block;
    }

    // (331:5) <Em>
    function create_default_slot_10(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Nick Folk");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(331:5) <Em>",
    		ctx
    	});

    	return block;
    }

    // (159:1) 
    function create_foreground_slot(ctx) {
    	let div25;
    	let section0;
    	let div1;
    	let p0;
    	let t0;
    	let mark;
    	let t2;
    	let h3;
    	let t4;
    	let div0;
    	let span0;
    	let t6;
    	let span1;
    	let t8;
    	let span2;
    	let t10;
    	let span3;
    	let t12;
    	let span4;
    	let t14;
    	let span5;
    	let t16;
    	let span6;
    	let t18;
    	let span7;
    	let t20;
    	let span8;
    	let t22;
    	let span9;
    	let t24;
    	let span10;
    	let t26;
    	let span11;
    	let t28;
    	let section1;
    	let div3;
    	let p1;
    	let em0;
    	let t29;
    	let br0;
    	let t30;
    	let br1;
    	let t31;
    	let br2;
    	let t32;
    	let t33;
    	let div2;
    	let img0;
    	let img0_src_value;
    	let t34;
    	let section2;
    	let div5;
    	let p2;
    	let em1;
    	let t35;
    	let br3;
    	let t36;
    	let br4;
    	let t37;
    	let br5;
    	let t38;
    	let t39;
    	let div4;
    	let img1;
    	let img1_src_value;
    	let t40;
    	let section3;
    	let div7;
    	let p3;
    	let em2;
    	let t41;
    	let br6;
    	let t42;
    	let br7;
    	let t43;
    	let br8;
    	let t44;
    	let t45;
    	let div6;
    	let img2;
    	let img2_src_value;
    	let t46;
    	let section4;
    	let div9;
    	let p4;
    	let em3;
    	let t47;
    	let br9;
    	let t48;
    	let br10;
    	let t49;
    	let br11;
    	let t50;
    	let t51;
    	let div8;
    	let img3;
    	let img3_src_value;
    	let t52;
    	let section5;
    	let div11;
    	let p5;
    	let em4;
    	let t53;
    	let br12;
    	let t54;
    	let br13;
    	let t55;
    	let br14;
    	let t56;
    	let t57;
    	let div10;
    	let img4;
    	let img4_src_value;
    	let t58;
    	let section6;
    	let div13;
    	let p6;
    	let em5;
    	let t59;
    	let br15;
    	let t60;
    	let br16;
    	let t61;
    	let br17;
    	let t62;
    	let t63;
    	let div12;
    	let img5;
    	let img5_src_value;
    	let t64;
    	let section7;
    	let div15;
    	let p7;
    	let em6;
    	let t65;
    	let br18;
    	let t66;
    	let br19;
    	let t67;
    	let br20;
    	let t68;
    	let t69;
    	let div14;
    	let img6;
    	let img6_src_value;
    	let t70;
    	let section8;
    	let div17;
    	let p8;
    	let em7;
    	let t71;
    	let br21;
    	let t72;
    	let br22;
    	let t73;
    	let br23;
    	let t74;
    	let t75;
    	let div16;
    	let img7;
    	let img7_src_value;
    	let t76;
    	let section9;
    	let div19;
    	let p9;
    	let em8;
    	let t77;
    	let br24;
    	let t78;
    	let br25;
    	let t79;
    	let br26;
    	let t80;
    	let t81;
    	let div18;
    	let img8;
    	let img8_src_value;
    	let t82;
    	let section10;
    	let div21;
    	let p10;
    	let em9;
    	let t83;
    	let br27;
    	let t84;
    	let br28;
    	let t85;
    	let br29;
    	let t86;
    	let t87;
    	let div20;
    	let img9;
    	let img9_src_value;
    	let t88;
    	let section11;
    	let div23;
    	let p11;
    	let em10;
    	let t89;
    	let br30;
    	let t90;
    	let br31;
    	let t91;
    	let br32;
    	let t92;
    	let t93;
    	let div22;
    	let img10;
    	let img10_src_value;
    	let t94;
    	let section12;
    	let div24;
    	let p12;
    	let em11;
    	let t95;
    	let br33;
    	let t96;
    	let br34;
    	let t97;
    	let br35;
    	let t98;
    	let current;

    	em0 = new Em({
    			props: {
    				$$slots: { default: [create_default_slot_21] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	em1 = new Em({
    			props: {
    				$$slots: { default: [create_default_slot_20] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	em2 = new Em({
    			props: {
    				$$slots: { default: [create_default_slot_19] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	em3 = new Em({
    			props: {
    				$$slots: { default: [create_default_slot_18] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	em4 = new Em({
    			props: {
    				$$slots: { default: [create_default_slot_17] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	em5 = new Em({
    			props: {
    				$$slots: { default: [create_default_slot_16] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	em6 = new Em({
    			props: {
    				$$slots: { default: [create_default_slot_15] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	em7 = new Em({
    			props: {
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	em8 = new Em({
    			props: {
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	em9 = new Em({
    			props: {
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	em10 = new Em({
    			props: {
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	em11 = new Em({
    			props: {
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div25 = element("div");
    			section0 = element("section");
    			div1 = element("div");
    			p0 = element("p");
    			t0 = text("This chart shows the data for the team as a whole. It visualizes the total\n\t\t\t\t\tfantasy points per career year for each player. Scroll to see score for\n\t\t\t\t\tindividual players. ");
    			mark = element("mark");
    			mark.textContent = "The value mapped to the y-axis is the total number of\n\t\t\t\t\tfantasy points for that player for a given year.";
    			t2 = space();
    			h3 = element("h3");
    			h3.textContent = "Color Legend";
    			t4 = space();
    			div0 = element("div");
    			span0 = element("span");
    			span0.textContent = "Lamar Jackson";
    			t6 = space();
    			span1 = element("span");
    			span1.textContent = "Justin Jefferson";
    			t8 = space();
    			span2 = element("span");
    			span2.textContent = "Devin Singletary";
    			t10 = space();
    			span3 = element("span");
    			span3.textContent = "Dallas Goedert";
    			t12 = space();
    			span4 = element("span");
    			span4.textContent = "Ja’Marr Chase";
    			t14 = space();
    			span5 = element("span");
    			span5.textContent = "DeVonta Smith";
    			t16 = space();
    			span6 = element("span");
    			span6.textContent = "Van Jefferson Jr";
    			t18 = space();
    			span7 = element("span");
    			span7.textContent = "Odell Beckham J";
    			t20 = space();
    			span8 = element("span");
    			span8.textContent = "Saquon Barkley";
    			t22 = space();
    			span9 = element("span");
    			span9.textContent = "AJ Dillon";
    			t24 = space();
    			span10 = element("span");
    			span10.textContent = "Miles Sanders";
    			t26 = space();
    			span11 = element("span");
    			span11.textContent = "Nick Folk";
    			t28 = space();
    			section1 = element("section");
    			div3 = element("div");
    			p1 = element("p");
    			create_component(em0.$$.fragment);
    			t29 = text(".\n\t\t\t\t\t");
    			br0 = element("br");
    			t30 = text("Age: 24\n\t\t\t\t\t");
    			br1 = element("br");
    			t31 = text("Position: Quarterback\n\t\t\t\t\t");
    			br2 = element("br");
    			t32 = text("Team: Baltimore Ravens");
    			t33 = space();
    			div2 = element("div");
    			img0 = element("img");
    			t34 = space();
    			section2 = element("section");
    			div5 = element("div");
    			p2 = element("p");
    			create_component(em1.$$.fragment);
    			t35 = text(".\n\t\t\t\t\t");
    			br3 = element("br");
    			t36 = text("Age: 22\n\t\t\t\t\t");
    			br4 = element("br");
    			t37 = text("Position: Wide Receiver\n\t\t\t\t\t");
    			br5 = element("br");
    			t38 = text("Team: Minnesota Vikings");
    			t39 = space();
    			div4 = element("div");
    			img1 = element("img");
    			t40 = space();
    			section3 = element("section");
    			div7 = element("div");
    			p3 = element("p");
    			create_component(em2.$$.fragment);
    			t41 = text(".\n\t\t\t\t\t");
    			br6 = element("br");
    			t42 = text("Age: 24\n\t\t\t\t\t");
    			br7 = element("br");
    			t43 = text("Position: Running Back\n\t\t\t\t\t");
    			br8 = element("br");
    			t44 = text("Team: Buffalo Bills");
    			t45 = space();
    			div6 = element("div");
    			img2 = element("img");
    			t46 = space();
    			section4 = element("section");
    			div9 = element("div");
    			p4 = element("p");
    			create_component(em3.$$.fragment);
    			t47 = text(".\n\t\t\t\t\t");
    			br9 = element("br");
    			t48 = text("Age: 26\n\t\t\t\t\t");
    			br10 = element("br");
    			t49 = text("Position: Tight End\n\t\t\t\t\t");
    			br11 = element("br");
    			t50 = text("Team: Philadelphia Eagles");
    			t51 = space();
    			div8 = element("div");
    			img3 = element("img");
    			t52 = space();
    			section5 = element("section");
    			div11 = element("div");
    			p5 = element("p");
    			create_component(em4.$$.fragment);
    			t53 = text(".\n\t\t\t\t\t");
    			br12 = element("br");
    			t54 = text("Age: 21\n\t\t\t\t\t");
    			br13 = element("br");
    			t55 = text("Position: Wide Receiver\n\t\t\t\t\t");
    			br14 = element("br");
    			t56 = text("Team: Cincinnati Bengals");
    			t57 = space();
    			div10 = element("div");
    			img4 = element("img");
    			t58 = space();
    			section6 = element("section");
    			div13 = element("div");
    			p6 = element("p");
    			create_component(em5.$$.fragment);
    			t59 = text(".\n\t\t\t\t\t");
    			br15 = element("br");
    			t60 = text("Age: 23\n\t\t\t\t\t");
    			br16 = element("br");
    			t61 = text("Position: Wide Receiver\n\t\t\t\t\t");
    			br17 = element("br");
    			t62 = text("Team: Philadelphia Eagles");
    			t63 = space();
    			div12 = element("div");
    			img5 = element("img");
    			t64 = space();
    			section7 = element("section");
    			div15 = element("div");
    			p7 = element("p");
    			create_component(em6.$$.fragment);
    			t65 = text(".\n\t\t\t\t\t");
    			br18 = element("br");
    			t66 = text("Age: 25\n\t\t\t\t\t");
    			br19 = element("br");
    			t67 = text("Position: Wide Receiver\n\t\t\t\t\t");
    			br20 = element("br");
    			t68 = text("Team: Los Angeles Rams");
    			t69 = space();
    			div14 = element("div");
    			img6 = element("img");
    			t70 = space();
    			section8 = element("section");
    			div17 = element("div");
    			p8 = element("p");
    			create_component(em7.$$.fragment);
    			t71 = text(".\n\t\t\t\t\t");
    			br21 = element("br");
    			t72 = text("Age: 29\n\t\t\t\t\t");
    			br22 = element("br");
    			t73 = text("Position: Wide Receiver\n\t\t\t\t\t");
    			br23 = element("br");
    			t74 = text("Team: Los Angeles Rams");
    			t75 = space();
    			div16 = element("div");
    			img7 = element("img");
    			t76 = space();
    			section9 = element("section");
    			div19 = element("div");
    			p9 = element("p");
    			create_component(em8.$$.fragment);
    			t77 = text(".\n\t\t\t\t\t");
    			br24 = element("br");
    			t78 = text("Age: 24\n\t\t\t\t\t");
    			br25 = element("br");
    			t79 = text("Position: Running Back\n\t\t\t\t\t");
    			br26 = element("br");
    			t80 = text("Team: New York Giants");
    			t81 = space();
    			div18 = element("div");
    			img8 = element("img");
    			t82 = space();
    			section10 = element("section");
    			div21 = element("div");
    			p10 = element("p");
    			create_component(em9.$$.fragment);
    			t83 = text(".\n\t\t\t\t\t");
    			br27 = element("br");
    			t84 = text("Age: 23\n\t\t\t\t\t");
    			br28 = element("br");
    			t85 = text("Position: Running Back\n\t\t\t\t\t");
    			br29 = element("br");
    			t86 = text("Team: Green Bay Packers");
    			t87 = space();
    			div20 = element("div");
    			img9 = element("img");
    			t88 = space();
    			section11 = element("section");
    			div23 = element("div");
    			p11 = element("p");
    			create_component(em10.$$.fragment);
    			t89 = text(".\n\t\t\t\t\t");
    			br30 = element("br");
    			t90 = text("Age: 24\n\t\t\t\t\t");
    			br31 = element("br");
    			t91 = text("Position: Running Back\n\t\t\t\t\t");
    			br32 = element("br");
    			t92 = text("Team: Philadelphia Eagles");
    			t93 = space();
    			div22 = element("div");
    			img10 = element("img");
    			t94 = space();
    			section12 = element("section");
    			div24 = element("div");
    			p12 = element("p");
    			create_component(em11.$$.fragment);
    			t95 = text(".\n\t\t\t\t\t");
    			br33 = element("br");
    			t96 = text("Age: 37\n\t\t\t\t\t");
    			br34 = element("br");
    			t97 = text("Position: Kicker\n\t\t\t\t\t");
    			br35 = element("br");
    			t98 = text("Team: New England Patriots");
    			add_location(mark, file, 164, 25, 4882);
    			add_location(p0, file, 161, 4, 4696);
    			attr_dev(h3, "class", "center svelte-1qbchbs");
    			add_location(h3, file, 167, 4, 5016);
    			attr_dev(span0, "class", "grid-item svelte-1qbchbs");
    			set_style(span0, "background-color", "rgb(166,206,227,0.8)");
    			add_location(span0, file, 169, 5, 5088);
    			attr_dev(span1, "class", "grid-item svelte-1qbchbs");
    			set_style(span1, "background-color", "rgb(31,120,180,0.8)");
    			add_location(span1, file, 170, 5, 5185);
    			attr_dev(span2, "class", "grid-item svelte-1qbchbs");
    			set_style(span2, "background-color", "rgb(178,223,138,0.8)");
    			add_location(span2, file, 171, 5, 5284);
    			attr_dev(span3, "class", "grid-item svelte-1qbchbs");
    			set_style(span3, "background-color", "rgb(51,160,44,0.8)");
    			add_location(span3, file, 172, 5, 5384);
    			attr_dev(span4, "class", "grid-item svelte-1qbchbs");
    			set_style(span4, "background-color", "rgb(251,154,153,0.8)");
    			add_location(span4, file, 173, 5, 5480);
    			attr_dev(span5, "class", "grid-item svelte-1qbchbs");
    			set_style(span5, "background-color", "rgb(227,26,28,0.8)");
    			add_location(span5, file, 174, 5, 5577);
    			attr_dev(span6, "class", "grid-item svelte-1qbchbs");
    			set_style(span6, "background-color", "rgb(253,191,111,0.8)");
    			add_location(span6, file, 175, 5, 5672);
    			attr_dev(span7, "class", "grid-item svelte-1qbchbs");
    			set_style(span7, "background-color", "rgb(255,127,0,0.8)");
    			add_location(span7, file, 176, 5, 5772);
    			attr_dev(span8, "class", "grid-item svelte-1qbchbs");
    			set_style(span8, "background-color", "rgb(202,178,214,0.8)");
    			add_location(span8, file, 177, 5, 5869);
    			attr_dev(span9, "class", "grid-item svelte-1qbchbs");
    			set_style(span9, "background-color", "rgb(106,61,154,0.8)");
    			add_location(span9, file, 178, 5, 5967);
    			attr_dev(span10, "class", "grid-item svelte-1qbchbs");
    			set_style(span10, "background-color", "rgb(255,255,153,0.8)");
    			add_location(span10, file, 179, 5, 6059);
    			attr_dev(span11, "class", "grid-item svelte-1qbchbs");
    			set_style(span11, "background-color", "rgb(177,89,40,0.8)");
    			add_location(span11, file, 180, 5, 6156);
    			attr_dev(div0, "class", "legend-grid svelte-1qbchbs");
    			add_location(div0, file, 168, 4, 5057);
    			attr_dev(div1, "class", "col-medium");
    			add_location(div1, file, 160, 3, 4667);
    			add_location(section0, file, 159, 2, 4654);
    			add_location(br0, file, 188, 5, 6358);
    			add_location(br1, file, 189, 5, 6375);
    			add_location(br2, file, 190, 5, 6406);
    			add_location(p1, file, 186, 4, 6320);
    			if (!src_url_equal(img0.src, img0_src_value = "./img/jackson.jpg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Lamar Jackson");
    			add_location(img0, file, 193, 5, 6471);
    			attr_dev(div2, "class", "media");
    			add_location(div2, file, 192, 4, 6446);
    			attr_dev(div3, "class", "col-medium");
    			add_location(div3, file, 185, 3, 6291);
    			add_location(section1, file, 184, 2, 6278);
    			add_location(br3, file, 201, 5, 6640);
    			add_location(br4, file, 202, 5, 6657);
    			add_location(br5, file, 203, 5, 6690);
    			add_location(p2, file, 199, 4, 6599);
    			if (!src_url_equal(img1.src, img1_src_value = "./img/jefferson.jpg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Justin Jefferson");
    			add_location(img1, file, 206, 5, 6756);
    			attr_dev(div4, "class", "media");
    			add_location(div4, file, 205, 4, 6731);
    			attr_dev(div5, "class", "col-medium");
    			add_location(div5, file, 198, 3, 6570);
    			add_location(section2, file, 197, 2, 6557);
    			add_location(br6, file, 214, 5, 6930);
    			add_location(br7, file, 215, 5, 6947);
    			add_location(br8, file, 216, 5, 6979);
    			add_location(p3, file, 212, 4, 6889);
    			if (!src_url_equal(img2.src, img2_src_value = "./img/singletary.jpg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Devin Singletary");
    			add_location(img2, file, 219, 5, 7041);
    			attr_dev(div6, "class", "media");
    			add_location(div6, file, 218, 4, 7016);
    			attr_dev(div7, "class", "col-medium");
    			add_location(div7, file, 211, 3, 6860);
    			add_location(section3, file, 210, 2, 6847);
    			add_location(br9, file, 227, 5, 7214);
    			add_location(br10, file, 228, 5, 7231);
    			add_location(br11, file, 229, 5, 7260);
    			add_location(p4, file, 225, 4, 7175);
    			if (!src_url_equal(img3.src, img3_src_value = "./img/goedert.jpg")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "Dallas Goedert");
    			add_location(img3, file, 232, 5, 7328);
    			attr_dev(div8, "class", "media");
    			add_location(div8, file, 231, 4, 7303);
    			attr_dev(div9, "class", "col-medium");
    			add_location(div9, file, 224, 3, 7146);
    			add_location(section4, file, 223, 2, 7133);
    			add_location(br12, file, 240, 5, 7495);
    			add_location(br13, file, 241, 5, 7512);
    			add_location(br14, file, 242, 5, 7545);
    			add_location(p5, file, 238, 4, 7457);
    			if (!src_url_equal(img4.src, img4_src_value = "./img/chase.jpg")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "Ja'Marr Chase");
    			add_location(img4, file, 245, 5, 7612);
    			attr_dev(div10, "class", "media");
    			add_location(div10, file, 244, 4, 7587);
    			attr_dev(div11, "class", "col-medium");
    			add_location(div11, file, 237, 3, 7428);
    			add_location(section5, file, 236, 2, 7415);
    			add_location(br15, file, 253, 5, 7776);
    			add_location(br16, file, 254, 5, 7793);
    			add_location(br17, file, 255, 5, 7826);
    			add_location(p6, file, 251, 4, 7738);
    			if (!src_url_equal(img5.src, img5_src_value = "./img/smith.jpg")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "DeVonta Smith");
    			add_location(img5, file, 258, 5, 7894);
    			attr_dev(div12, "class", "media");
    			add_location(div12, file, 257, 4, 7869);
    			attr_dev(div13, "class", "col-medium");
    			add_location(div13, file, 250, 3, 7709);
    			add_location(section6, file, 249, 2, 7696);
    			add_location(br18, file, 266, 5, 8061);
    			add_location(br19, file, 267, 5, 8078);
    			add_location(br20, file, 268, 5, 8111);
    			add_location(p7, file, 264, 4, 8020);
    			if (!src_url_equal(img6.src, img6_src_value = "./img/van_jefferson.jpg")) attr_dev(img6, "src", img6_src_value);
    			attr_dev(img6, "alt", "Van Jefferson Jr");
    			add_location(img6, file, 271, 5, 8176);
    			attr_dev(div14, "class", "media");
    			add_location(div14, file, 270, 4, 8151);
    			attr_dev(div15, "class", "col-medium");
    			add_location(div15, file, 263, 3, 7991);
    			add_location(section7, file, 262, 2, 7978);
    			add_location(br21, file, 279, 5, 8354);
    			add_location(br22, file, 280, 5, 8371);
    			add_location(br23, file, 281, 5, 8404);
    			add_location(p8, file, 277, 4, 8313);
    			if (!src_url_equal(img7.src, img7_src_value = "./img/beckham.jpg")) attr_dev(img7, "src", img7_src_value);
    			attr_dev(img7, "alt", "Odell Beckham Jr");
    			add_location(img7, file, 284, 5, 8469);
    			attr_dev(div16, "class", "media");
    			add_location(div16, file, 283, 4, 8444);
    			attr_dev(div17, "class", "col-medium");
    			add_location(div17, file, 276, 3, 8284);
    			add_location(section8, file, 275, 2, 8271);
    			add_location(br24, file, 292, 5, 8639);
    			add_location(br25, file, 293, 5, 8656);
    			add_location(br26, file, 294, 5, 8688);
    			add_location(p9, file, 290, 4, 8600);
    			if (!src_url_equal(img8.src, img8_src_value = "./img/barkley.jpg")) attr_dev(img8, "src", img8_src_value);
    			attr_dev(img8, "alt", "Saquon Barkley");
    			add_location(img8, file, 297, 5, 8752);
    			attr_dev(div18, "class", "media");
    			add_location(div18, file, 296, 4, 8727);
    			attr_dev(div19, "class", "col-medium");
    			add_location(div19, file, 289, 3, 8571);
    			add_location(section9, file, 288, 2, 8558);
    			add_location(br27, file, 305, 5, 8915);
    			add_location(br28, file, 306, 5, 8932);
    			add_location(br29, file, 307, 5, 8964);
    			add_location(p10, file, 303, 4, 8881);
    			if (!src_url_equal(img9.src, img9_src_value = "./img/dillon.jpg")) attr_dev(img9, "src", img9_src_value);
    			attr_dev(img9, "alt", "AJ Dillon");
    			add_location(img9, file, 310, 5, 9030);
    			attr_dev(div20, "class", "media");
    			add_location(div20, file, 309, 4, 9005);
    			attr_dev(div21, "class", "col-medium");
    			add_location(div21, file, 302, 3, 8852);
    			add_location(section10, file, 301, 2, 8839);
    			add_location(br30, file, 318, 5, 9191);
    			add_location(br31, file, 319, 5, 9208);
    			add_location(br32, file, 320, 5, 9240);
    			add_location(p11, file, 316, 4, 9153);
    			if (!src_url_equal(img10.src, img10_src_value = "./img/sanders.jpg")) attr_dev(img10, "src", img10_src_value);
    			attr_dev(img10, "alt", "Miles Sanders");
    			add_location(img10, file, 323, 5, 9308);
    			attr_dev(div22, "class", "media");
    			add_location(div22, file, 322, 4, 9283);
    			attr_dev(div23, "class", "col-medium");
    			add_location(div23, file, 315, 3, 9124);
    			add_location(section11, file, 314, 2, 9111);
    			add_location(br33, file, 331, 5, 9470);
    			add_location(br34, file, 332, 5, 9487);
    			add_location(br35, file, 333, 5, 9513);
    			add_location(p12, file, 329, 4, 9436);
    			attr_dev(div24, "class", "col-medium");
    			add_location(div24, file, 328, 3, 9407);
    			add_location(section12, file, 327, 2, 9394);
    			attr_dev(div25, "slot", "foreground");
    			add_location(div25, file, 158, 1, 4628);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div25, anchor);
    			append_dev(div25, section0);
    			append_dev(section0, div1);
    			append_dev(div1, p0);
    			append_dev(p0, t0);
    			append_dev(p0, mark);
    			append_dev(div1, t2);
    			append_dev(div1, h3);
    			append_dev(div1, t4);
    			append_dev(div1, div0);
    			append_dev(div0, span0);
    			append_dev(div0, t6);
    			append_dev(div0, span1);
    			append_dev(div0, t8);
    			append_dev(div0, span2);
    			append_dev(div0, t10);
    			append_dev(div0, span3);
    			append_dev(div0, t12);
    			append_dev(div0, span4);
    			append_dev(div0, t14);
    			append_dev(div0, span5);
    			append_dev(div0, t16);
    			append_dev(div0, span6);
    			append_dev(div0, t18);
    			append_dev(div0, span7);
    			append_dev(div0, t20);
    			append_dev(div0, span8);
    			append_dev(div0, t22);
    			append_dev(div0, span9);
    			append_dev(div0, t24);
    			append_dev(div0, span10);
    			append_dev(div0, t26);
    			append_dev(div0, span11);
    			append_dev(div25, t28);
    			append_dev(div25, section1);
    			append_dev(section1, div3);
    			append_dev(div3, p1);
    			mount_component(em0, p1, null);
    			append_dev(p1, t29);
    			append_dev(p1, br0);
    			append_dev(p1, t30);
    			append_dev(p1, br1);
    			append_dev(p1, t31);
    			append_dev(p1, br2);
    			append_dev(p1, t32);
    			append_dev(div3, t33);
    			append_dev(div3, div2);
    			append_dev(div2, img0);
    			append_dev(div25, t34);
    			append_dev(div25, section2);
    			append_dev(section2, div5);
    			append_dev(div5, p2);
    			mount_component(em1, p2, null);
    			append_dev(p2, t35);
    			append_dev(p2, br3);
    			append_dev(p2, t36);
    			append_dev(p2, br4);
    			append_dev(p2, t37);
    			append_dev(p2, br5);
    			append_dev(p2, t38);
    			append_dev(div5, t39);
    			append_dev(div5, div4);
    			append_dev(div4, img1);
    			append_dev(div25, t40);
    			append_dev(div25, section3);
    			append_dev(section3, div7);
    			append_dev(div7, p3);
    			mount_component(em2, p3, null);
    			append_dev(p3, t41);
    			append_dev(p3, br6);
    			append_dev(p3, t42);
    			append_dev(p3, br7);
    			append_dev(p3, t43);
    			append_dev(p3, br8);
    			append_dev(p3, t44);
    			append_dev(div7, t45);
    			append_dev(div7, div6);
    			append_dev(div6, img2);
    			append_dev(div25, t46);
    			append_dev(div25, section4);
    			append_dev(section4, div9);
    			append_dev(div9, p4);
    			mount_component(em3, p4, null);
    			append_dev(p4, t47);
    			append_dev(p4, br9);
    			append_dev(p4, t48);
    			append_dev(p4, br10);
    			append_dev(p4, t49);
    			append_dev(p4, br11);
    			append_dev(p4, t50);
    			append_dev(div9, t51);
    			append_dev(div9, div8);
    			append_dev(div8, img3);
    			append_dev(div25, t52);
    			append_dev(div25, section5);
    			append_dev(section5, div11);
    			append_dev(div11, p5);
    			mount_component(em4, p5, null);
    			append_dev(p5, t53);
    			append_dev(p5, br12);
    			append_dev(p5, t54);
    			append_dev(p5, br13);
    			append_dev(p5, t55);
    			append_dev(p5, br14);
    			append_dev(p5, t56);
    			append_dev(div11, t57);
    			append_dev(div11, div10);
    			append_dev(div10, img4);
    			append_dev(div25, t58);
    			append_dev(div25, section6);
    			append_dev(section6, div13);
    			append_dev(div13, p6);
    			mount_component(em5, p6, null);
    			append_dev(p6, t59);
    			append_dev(p6, br15);
    			append_dev(p6, t60);
    			append_dev(p6, br16);
    			append_dev(p6, t61);
    			append_dev(p6, br17);
    			append_dev(p6, t62);
    			append_dev(div13, t63);
    			append_dev(div13, div12);
    			append_dev(div12, img5);
    			append_dev(div25, t64);
    			append_dev(div25, section7);
    			append_dev(section7, div15);
    			append_dev(div15, p7);
    			mount_component(em6, p7, null);
    			append_dev(p7, t65);
    			append_dev(p7, br18);
    			append_dev(p7, t66);
    			append_dev(p7, br19);
    			append_dev(p7, t67);
    			append_dev(p7, br20);
    			append_dev(p7, t68);
    			append_dev(div15, t69);
    			append_dev(div15, div14);
    			append_dev(div14, img6);
    			append_dev(div25, t70);
    			append_dev(div25, section8);
    			append_dev(section8, div17);
    			append_dev(div17, p8);
    			mount_component(em7, p8, null);
    			append_dev(p8, t71);
    			append_dev(p8, br21);
    			append_dev(p8, t72);
    			append_dev(p8, br22);
    			append_dev(p8, t73);
    			append_dev(p8, br23);
    			append_dev(p8, t74);
    			append_dev(div17, t75);
    			append_dev(div17, div16);
    			append_dev(div16, img7);
    			append_dev(div25, t76);
    			append_dev(div25, section9);
    			append_dev(section9, div19);
    			append_dev(div19, p9);
    			mount_component(em8, p9, null);
    			append_dev(p9, t77);
    			append_dev(p9, br24);
    			append_dev(p9, t78);
    			append_dev(p9, br25);
    			append_dev(p9, t79);
    			append_dev(p9, br26);
    			append_dev(p9, t80);
    			append_dev(div19, t81);
    			append_dev(div19, div18);
    			append_dev(div18, img8);
    			append_dev(div25, t82);
    			append_dev(div25, section10);
    			append_dev(section10, div21);
    			append_dev(div21, p10);
    			mount_component(em9, p10, null);
    			append_dev(p10, t83);
    			append_dev(p10, br27);
    			append_dev(p10, t84);
    			append_dev(p10, br28);
    			append_dev(p10, t85);
    			append_dev(p10, br29);
    			append_dev(p10, t86);
    			append_dev(div21, t87);
    			append_dev(div21, div20);
    			append_dev(div20, img9);
    			append_dev(div25, t88);
    			append_dev(div25, section11);
    			append_dev(section11, div23);
    			append_dev(div23, p11);
    			mount_component(em10, p11, null);
    			append_dev(p11, t89);
    			append_dev(p11, br30);
    			append_dev(p11, t90);
    			append_dev(p11, br31);
    			append_dev(p11, t91);
    			append_dev(p11, br32);
    			append_dev(p11, t92);
    			append_dev(div23, t93);
    			append_dev(div23, div22);
    			append_dev(div22, img10);
    			append_dev(div25, t94);
    			append_dev(div25, section12);
    			append_dev(section12, div24);
    			append_dev(div24, p12);
    			mount_component(em11, p12, null);
    			append_dev(p12, t95);
    			append_dev(p12, br33);
    			append_dev(p12, t96);
    			append_dev(p12, br34);
    			append_dev(p12, t97);
    			append_dev(p12, br35);
    			append_dev(p12, t98);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const em0_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				em0_changes.$$scope = { dirty, ctx };
    			}

    			em0.$set(em0_changes);
    			const em1_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				em1_changes.$$scope = { dirty, ctx };
    			}

    			em1.$set(em1_changes);
    			const em2_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				em2_changes.$$scope = { dirty, ctx };
    			}

    			em2.$set(em2_changes);
    			const em3_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				em3_changes.$$scope = { dirty, ctx };
    			}

    			em3.$set(em3_changes);
    			const em4_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				em4_changes.$$scope = { dirty, ctx };
    			}

    			em4.$set(em4_changes);
    			const em5_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				em5_changes.$$scope = { dirty, ctx };
    			}

    			em5.$set(em5_changes);
    			const em6_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				em6_changes.$$scope = { dirty, ctx };
    			}

    			em6.$set(em6_changes);
    			const em7_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				em7_changes.$$scope = { dirty, ctx };
    			}

    			em7.$set(em7_changes);
    			const em8_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				em8_changes.$$scope = { dirty, ctx };
    			}

    			em8.$set(em8_changes);
    			const em9_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				em9_changes.$$scope = { dirty, ctx };
    			}

    			em9.$set(em9_changes);
    			const em10_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				em10_changes.$$scope = { dirty, ctx };
    			}

    			em10.$set(em10_changes);
    			const em11_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				em11_changes.$$scope = { dirty, ctx };
    			}

    			em11.$set(em11_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(em0.$$.fragment, local);
    			transition_in(em1.$$.fragment, local);
    			transition_in(em2.$$.fragment, local);
    			transition_in(em3.$$.fragment, local);
    			transition_in(em4.$$.fragment, local);
    			transition_in(em5.$$.fragment, local);
    			transition_in(em6.$$.fragment, local);
    			transition_in(em7.$$.fragment, local);
    			transition_in(em8.$$.fragment, local);
    			transition_in(em9.$$.fragment, local);
    			transition_in(em10.$$.fragment, local);
    			transition_in(em11.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(em0.$$.fragment, local);
    			transition_out(em1.$$.fragment, local);
    			transition_out(em2.$$.fragment, local);
    			transition_out(em3.$$.fragment, local);
    			transition_out(em4.$$.fragment, local);
    			transition_out(em5.$$.fragment, local);
    			transition_out(em6.$$.fragment, local);
    			transition_out(em7.$$.fragment, local);
    			transition_out(em8.$$.fragment, local);
    			transition_out(em9.$$.fragment, local);
    			transition_out(em10.$$.fragment, local);
    			transition_out(em11.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div25);
    			destroy_component(em0);
    			destroy_component(em1);
    			destroy_component(em2);
    			destroy_component(em3);
    			destroy_component(em4);
    			destroy_component(em5);
    			destroy_component(em6);
    			destroy_component(em7);
    			destroy_component(em8);
    			destroy_component(em9);
    			destroy_component(em10);
    			destroy_component(em11);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_foreground_slot.name,
    		type: "slot",
    		source: "(159:1) ",
    		ctx
    	});

    	return block;
    }

    // (343:0) <Section>
    function create_default_slot_9(ctx) {
    	let h2;
    	let t1;
    	let p;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Let's dive deeper...";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Now that we have a better sense of the team as a whole, let's take a closer look at each player as an\n\t\tindividual. Below, you will find an interactive scatterplot for each player on my team's starting roster. The\n\t\tdata shown here is from the 2021-2022 NFL season. The x-axis refers to the week (1 game per week). Use the\n\t\tdropdown menu to toggle the y-axis values. The values will vary slightly depending on the position of the\n\t\tplayer.";
    			add_location(h2, file, 343, 1, 9621);
    			add_location(p, file, 344, 1, 9652);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(343:0) <Section>",
    		ctx
    	});

    	return block;
    }

    // (356:0) <Section>
    function create_default_slot_8(ctx) {
    	let jackson;
    	let current;
    	jackson = new Jackson({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(jackson.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(jackson, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(jackson.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(jackson.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(jackson, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(356:0) <Section>",
    		ctx
    	});

    	return block;
    }

    // (362:0) <Section>
    function create_default_slot_7(ctx) {
    	let jefferson;
    	let current;
    	jefferson = new Jefferson({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(jefferson.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(jefferson, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(jefferson.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(jefferson.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(jefferson, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(362:0) <Section>",
    		ctx
    	});

    	return block;
    }

    // (368:0) <Section>
    function create_default_slot_6(ctx) {
    	let chase;
    	let current;
    	chase = new Chase({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(chase.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(chase, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(chase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(368:0) <Section>",
    		ctx
    	});

    	return block;
    }

    // (374:0) <Section>
    function create_default_slot_5(ctx) {
    	let goedert;
    	let current;
    	goedert = new Goedert({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(goedert.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(goedert, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(goedert.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(goedert.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(goedert, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(374:0) <Section>",
    		ctx
    	});

    	return block;
    }

    // (380:0) <Section>
    function create_default_slot_4(ctx) {
    	let barkley;
    	let current;
    	barkley = new Barkley({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(barkley.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(barkley, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(barkley.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(barkley.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(barkley, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(380:0) <Section>",
    		ctx
    	});

    	return block;
    }

    // (386:0) <Section>
    function create_default_slot_3(ctx) {
    	let beckham;
    	let current;
    	beckham = new Beckham({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(beckham.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(beckham, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(beckham.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(beckham.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(beckham, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(386:0) <Section>",
    		ctx
    	});

    	return block;
    }

    // (392:0) <Section>
    function create_default_slot_2(ctx) {
    	let dillon;
    	let current;
    	dillon = new Dillon({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(dillon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dillon, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dillon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dillon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dillon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(392:0) <Section>",
    		ctx
    	});

    	return block;
    }

    // (398:0) <Section>
    function create_default_slot_1(ctx) {
    	let folk;
    	let current;
    	folk = new Folk({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(folk.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(folk, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(folk.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(folk.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(folk, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(398:0) <Section>",
    		ctx
    	});

    	return block;
    }

    // (404:0) <Section>
    function create_default_slot(ctx) {
    	let h2;
    	let t1;
    	let p;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Comparisons";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Let's now take a look outside of the team. Scroll down to explore comparisons by player. Use the dropdown menu\n\t\tto select a position, then explore the parallel coordinates chart using the brushing and filtering interaction\n\t\ttools.";
    			add_location(h2, file, 404, 1, 10521);
    			add_location(p, file, 405, 1, 10543);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(404:0) <Section>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let header;
    	let t0;
    	let filler0;
    	let t1;
    	let filler1;
    	let t2;
    	let section0;
    	let t3;
    	let divider0;
    	let t4;
    	let scroller;
    	let updating_index;
    	let t5;
    	let divider1;
    	let t6;
    	let section1;
    	let t7;
    	let divider2;
    	let t8;
    	let section2;
    	let t9;
    	let divider3;
    	let t10;
    	let section3;
    	let t11;
    	let divider4;
    	let t12;
    	let section4;
    	let t13;
    	let divider5;
    	let t14;
    	let section5;
    	let t15;
    	let divider6;
    	let t16;
    	let section6;
    	let t17;
    	let divider7;
    	let t18;
    	let section7;
    	let t19;
    	let divider8;
    	let t20;
    	let section8;
    	let t21;
    	let divider9;
    	let t22;
    	let section9;
    	let t23;
    	let divider10;
    	let t24;
    	let section10;
    	let t25;
    	let divider11;
    	let t26;
    	let iframe;
    	let iframe_src_value;
    	let t27;
    	let divider12;
    	let current;

    	header = new Header({
    			props: {
    				bgimage: "./img/background-main.jpg",
    				bgfixed: true,
    				theme: "dark",
    				$$slots: { default: [create_default_slot_25] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	filler0 = new Filler({
    			props: {
    				theme: "dark",
    				$$slots: { default: [create_default_slot_24] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	filler1 = new Filler({
    			props: {
    				theme: "light",
    				$$slots: { default: [create_default_slot_23] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	section0 = new Section({
    			props: {
    				$$slots: { default: [create_default_slot_22] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	divider0 = new Divider({ $$inline: true });

    	function scroller_index_binding(value) {
    		/*scroller_index_binding*/ ctx[10](value);
    	}

    	let scroller_props = {
    		threshold,
    		splitscreen: true,
    		$$slots: {
    			foreground: [create_foreground_slot],
    			background: [create_background_slot]
    		},
    		$$scope: { ctx }
    	};

    	if (/*index*/ ctx[0][0] !== void 0) {
    		scroller_props.index = /*index*/ ctx[0][0];
    	}

    	scroller = new Scroller({ props: scroller_props, $$inline: true });
    	binding_callbacks.push(() => bind(scroller, 'index', scroller_index_binding));
    	divider1 = new Divider({ $$inline: true });

    	section1 = new Section({
    			props: {
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	divider2 = new Divider({ $$inline: true });

    	section2 = new Section({
    			props: {
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	divider3 = new Divider({ $$inline: true });

    	section3 = new Section({
    			props: {
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	divider4 = new Divider({ $$inline: true });

    	section4 = new Section({
    			props: {
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	divider5 = new Divider({ $$inline: true });

    	section5 = new Section({
    			props: {
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	divider6 = new Divider({ $$inline: true });

    	section6 = new Section({
    			props: {
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	divider7 = new Divider({ $$inline: true });

    	section7 = new Section({
    			props: {
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	divider8 = new Divider({ $$inline: true });

    	section8 = new Section({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	divider9 = new Divider({ $$inline: true });

    	section9 = new Section({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	divider10 = new Divider({ $$inline: true });

    	section10 = new Section({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	divider11 = new Divider({ $$inline: true });
    	divider12 = new Divider({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			create_component(filler0.$$.fragment);
    			t1 = space();
    			create_component(filler1.$$.fragment);
    			t2 = space();
    			create_component(section0.$$.fragment);
    			t3 = space();
    			create_component(divider0.$$.fragment);
    			t4 = space();
    			create_component(scroller.$$.fragment);
    			t5 = space();
    			create_component(divider1.$$.fragment);
    			t6 = space();
    			create_component(section1.$$.fragment);
    			t7 = space();
    			create_component(divider2.$$.fragment);
    			t8 = space();
    			create_component(section2.$$.fragment);
    			t9 = space();
    			create_component(divider3.$$.fragment);
    			t10 = space();
    			create_component(section3.$$.fragment);
    			t11 = space();
    			create_component(divider4.$$.fragment);
    			t12 = space();
    			create_component(section4.$$.fragment);
    			t13 = space();
    			create_component(divider5.$$.fragment);
    			t14 = space();
    			create_component(section5.$$.fragment);
    			t15 = space();
    			create_component(divider6.$$.fragment);
    			t16 = space();
    			create_component(section6.$$.fragment);
    			t17 = space();
    			create_component(divider7.$$.fragment);
    			t18 = space();
    			create_component(section7.$$.fragment);
    			t19 = space();
    			create_component(divider8.$$.fragment);
    			t20 = space();
    			create_component(section8.$$.fragment);
    			t21 = space();
    			create_component(divider9.$$.fragment);
    			t22 = space();
    			create_component(section9.$$.fragment);
    			t23 = space();
    			create_component(divider10.$$.fragment);
    			t24 = space();
    			create_component(section10.$$.fragment);
    			t25 = space();
    			create_component(divider11.$$.fragment);
    			t26 = space();
    			iframe = element("iframe");
    			t27 = space();
    			create_component(divider12.$$.fragment);
    			attr_dev(iframe, "width", "100%");
    			attr_dev(iframe, "height", "1050");
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://observablehq.com/embed/@ariana/parallel-coordinates-for-data-viz-final?cells=viewof+position%2CchartLegend%2Cviewof+selection")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "class", "svelte-1qbchbs");
    			add_location(iframe, file, 414, 0, 10813);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(filler0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(filler1, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(section0, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(divider0, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(scroller, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(divider1, target, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(section1, target, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(divider2, target, anchor);
    			insert_dev(target, t8, anchor);
    			mount_component(section2, target, anchor);
    			insert_dev(target, t9, anchor);
    			mount_component(divider3, target, anchor);
    			insert_dev(target, t10, anchor);
    			mount_component(section3, target, anchor);
    			insert_dev(target, t11, anchor);
    			mount_component(divider4, target, anchor);
    			insert_dev(target, t12, anchor);
    			mount_component(section4, target, anchor);
    			insert_dev(target, t13, anchor);
    			mount_component(divider5, target, anchor);
    			insert_dev(target, t14, anchor);
    			mount_component(section5, target, anchor);
    			insert_dev(target, t15, anchor);
    			mount_component(divider6, target, anchor);
    			insert_dev(target, t16, anchor);
    			mount_component(section6, target, anchor);
    			insert_dev(target, t17, anchor);
    			mount_component(divider7, target, anchor);
    			insert_dev(target, t18, anchor);
    			mount_component(section7, target, anchor);
    			insert_dev(target, t19, anchor);
    			mount_component(divider8, target, anchor);
    			insert_dev(target, t20, anchor);
    			mount_component(section8, target, anchor);
    			insert_dev(target, t21, anchor);
    			mount_component(divider9, target, anchor);
    			insert_dev(target, t22, anchor);
    			mount_component(section9, target, anchor);
    			insert_dev(target, t23, anchor);
    			mount_component(divider10, target, anchor);
    			insert_dev(target, t24, anchor);
    			mount_component(section10, target, anchor);
    			insert_dev(target, t25, anchor);
    			mount_component(divider11, target, anchor);
    			insert_dev(target, t26, anchor);
    			insert_dev(target, iframe, anchor);
    			insert_dev(target, t27, anchor);
    			mount_component(divider12, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const header_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				header_changes.$$scope = { dirty, ctx };
    			}

    			header.$set(header_changes);
    			const filler0_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				filler0_changes.$$scope = { dirty, ctx };
    			}

    			filler0.$set(filler0_changes);
    			const filler1_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				filler1_changes.$$scope = { dirty, ctx };
    			}

    			filler1.$set(filler1_changes);
    			const section0_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				section0_changes.$$scope = { dirty, ctx };
    			}

    			section0.$set(section0_changes);
    			const scroller_changes = {};

    			if (dirty & /*$$scope, data, categories, selected*/ 16398) {
    				scroller_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_index && dirty & /*index*/ 1) {
    				updating_index = true;
    				scroller_changes.index = /*index*/ ctx[0][0];
    				add_flush_callback(() => updating_index = false);
    			}

    			scroller.$set(scroller_changes);
    			const section1_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				section1_changes.$$scope = { dirty, ctx };
    			}

    			section1.$set(section1_changes);
    			const section2_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				section2_changes.$$scope = { dirty, ctx };
    			}

    			section2.$set(section2_changes);
    			const section3_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				section3_changes.$$scope = { dirty, ctx };
    			}

    			section3.$set(section3_changes);
    			const section4_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				section4_changes.$$scope = { dirty, ctx };
    			}

    			section4.$set(section4_changes);
    			const section5_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				section5_changes.$$scope = { dirty, ctx };
    			}

    			section5.$set(section5_changes);
    			const section6_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				section6_changes.$$scope = { dirty, ctx };
    			}

    			section6.$set(section6_changes);
    			const section7_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				section7_changes.$$scope = { dirty, ctx };
    			}

    			section7.$set(section7_changes);
    			const section8_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				section8_changes.$$scope = { dirty, ctx };
    			}

    			section8.$set(section8_changes);
    			const section9_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				section9_changes.$$scope = { dirty, ctx };
    			}

    			section9.$set(section9_changes);
    			const section10_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				section10_changes.$$scope = { dirty, ctx };
    			}

    			section10.$set(section10_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(filler0.$$.fragment, local);
    			transition_in(filler1.$$.fragment, local);
    			transition_in(section0.$$.fragment, local);
    			transition_in(divider0.$$.fragment, local);
    			transition_in(scroller.$$.fragment, local);
    			transition_in(divider1.$$.fragment, local);
    			transition_in(section1.$$.fragment, local);
    			transition_in(divider2.$$.fragment, local);
    			transition_in(section2.$$.fragment, local);
    			transition_in(divider3.$$.fragment, local);
    			transition_in(section3.$$.fragment, local);
    			transition_in(divider4.$$.fragment, local);
    			transition_in(section4.$$.fragment, local);
    			transition_in(divider5.$$.fragment, local);
    			transition_in(section5.$$.fragment, local);
    			transition_in(divider6.$$.fragment, local);
    			transition_in(section6.$$.fragment, local);
    			transition_in(divider7.$$.fragment, local);
    			transition_in(section7.$$.fragment, local);
    			transition_in(divider8.$$.fragment, local);
    			transition_in(section8.$$.fragment, local);
    			transition_in(divider9.$$.fragment, local);
    			transition_in(section9.$$.fragment, local);
    			transition_in(divider10.$$.fragment, local);
    			transition_in(section10.$$.fragment, local);
    			transition_in(divider11.$$.fragment, local);
    			transition_in(divider12.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(filler0.$$.fragment, local);
    			transition_out(filler1.$$.fragment, local);
    			transition_out(section0.$$.fragment, local);
    			transition_out(divider0.$$.fragment, local);
    			transition_out(scroller.$$.fragment, local);
    			transition_out(divider1.$$.fragment, local);
    			transition_out(section1.$$.fragment, local);
    			transition_out(divider2.$$.fragment, local);
    			transition_out(section2.$$.fragment, local);
    			transition_out(divider3.$$.fragment, local);
    			transition_out(section3.$$.fragment, local);
    			transition_out(divider4.$$.fragment, local);
    			transition_out(section4.$$.fragment, local);
    			transition_out(divider5.$$.fragment, local);
    			transition_out(section5.$$.fragment, local);
    			transition_out(divider6.$$.fragment, local);
    			transition_out(section6.$$.fragment, local);
    			transition_out(divider7.$$.fragment, local);
    			transition_out(section7.$$.fragment, local);
    			transition_out(divider8.$$.fragment, local);
    			transition_out(section8.$$.fragment, local);
    			transition_out(divider9.$$.fragment, local);
    			transition_out(section9.$$.fragment, local);
    			transition_out(divider10.$$.fragment, local);
    			transition_out(section10.$$.fragment, local);
    			transition_out(divider11.$$.fragment, local);
    			transition_out(divider12.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(filler0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(filler1, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(section0, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(divider0, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(scroller, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(divider1, detaching);
    			if (detaching) detach_dev(t6);
    			destroy_component(section1, detaching);
    			if (detaching) detach_dev(t7);
    			destroy_component(divider2, detaching);
    			if (detaching) detach_dev(t8);
    			destroy_component(section2, detaching);
    			if (detaching) detach_dev(t9);
    			destroy_component(divider3, detaching);
    			if (detaching) detach_dev(t10);
    			destroy_component(section3, detaching);
    			if (detaching) detach_dev(t11);
    			destroy_component(divider4, detaching);
    			if (detaching) detach_dev(t12);
    			destroy_component(section4, detaching);
    			if (detaching) detach_dev(t13);
    			destroy_component(divider5, detaching);
    			if (detaching) detach_dev(t14);
    			destroy_component(section5, detaching);
    			if (detaching) detach_dev(t15);
    			destroy_component(divider6, detaching);
    			if (detaching) detach_dev(t16);
    			destroy_component(section6, detaching);
    			if (detaching) detach_dev(t17);
    			destroy_component(divider7, detaching);
    			if (detaching) detach_dev(t18);
    			destroy_component(section7, detaching);
    			if (detaching) detach_dev(t19);
    			destroy_component(divider8, detaching);
    			if (detaching) detach_dev(t20);
    			destroy_component(section8, detaching);
    			if (detaching) detach_dev(t21);
    			destroy_component(divider9, detaching);
    			if (detaching) detach_dev(t22);
    			destroy_component(section9, detaching);
    			if (detaching) detach_dev(t23);
    			destroy_component(divider10, detaching);
    			if (detaching) detach_dev(t24);
    			destroy_component(section10, detaching);
    			if (detaching) detach_dev(t25);
    			destroy_component(divider11, detaching);
    			if (detaching) detach_dev(t26);
    			if (detaching) detach_dev(iframe);
    			if (detaching) detach_dev(t27);
    			destroy_component(divider12, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const threshold = 0.65;

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let theme = "dark";
    	setContext("theme", theme);
    	setColors(themes, theme);

    	// State
    	let index = [];

    	let indexPrev = [];

    	onMount(() => {
    		$$invalidate(9, indexPrev = [...index]);
    	});

    	let animation = getMotion();
    	let data;
    	let diameter = 20;
    	let xKey = "Year";
    	let yKey = "FantPt";
    	let selected;
    	let categories;
    	let catKey = "Player";

    	getData("data/fantasy_stats.csv").then(result => $$invalidate(1, data = result)).then(data => {
    		$$invalidate(3, categories = Array.from(new Set(data.map(d => d.Player))));
    	});

    	// Actions for CHART scroller
    	const chartActions = [
    		() => {
    			$$invalidate(2, selected = null);
    		},
    		() => {
    			$$invalidate(2, selected = { value: "Lamar Jackson", col: "Player" });
    		},
    		() => {
    			$$invalidate(2, selected = { value: "Justin Jefferson", col: "Player" });
    		},
    		() => {
    			$$invalidate(2, selected = { value: "Devin Singletary", col: "Player" });
    		},
    		() => {
    			$$invalidate(2, selected = { value: "Dallas Goedert", col: "Player" });
    		},
    		() => {
    			$$invalidate(2, selected = { value: "JaMarr Chase", col: "Player" });
    		},
    		() => {
    			$$invalidate(2, selected = { value: "DeVonta Smith", col: "Player" });
    		},
    		() => {
    			$$invalidate(2, selected = { value: "Van Jefferson Jr", col: "Player" });
    		},
    		() => {
    			$$invalidate(2, selected = { value: "Odell Beckham Jr", col: "Player" });
    		},
    		() => {
    			$$invalidate(2, selected = { value: "Saquon Barkley", col: "Player" });
    		},
    		() => {
    			$$invalidate(2, selected = { value: "AJ Dillon", col: "Player" });
    		},
    		() => {
    			$$invalidate(2, selected = { value: "Miles Sanders", col: "Player" });
    		},
    		() => {
    			$$invalidate(2, selected = { value: "Nick Folk", col: "Player" });
    		}
    	];

    	let playerName = players[0];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function scroller_index_binding(value) {
    		if ($$self.$$.not_equal(index[0], value)) {
    			index[0] = value;
    			$$invalidate(0, index);
    		}
    	}

    	$$self.$capture_state = () => ({
    		setContext,
    		onMount,
    		getData,
    		setColors,
    		getMotion,
    		themes,
    		players,
    		colors,
    		Header,
    		Section,
    		Scroller,
    		Filler,
    		Divider,
    		Jackson,
    		Em,
    		Arrow,
    		ScatterChart,
    		Jefferson,
    		Goedert,
    		Chase,
    		Beckham,
    		Barkley,
    		Dillon,
    		Folk,
    		theme,
    		threshold,
    		index,
    		indexPrev,
    		animation,
    		data,
    		diameter,
    		xKey,
    		yKey,
    		selected,
    		categories,
    		catKey,
    		chartActions,
    		playerName
    	});

    	$$self.$inject_state = $$props => {
    		if ('theme' in $$props) theme = $$props.theme;
    		if ('index' in $$props) $$invalidate(0, index = $$props.index);
    		if ('indexPrev' in $$props) $$invalidate(9, indexPrev = $$props.indexPrev);
    		if ('animation' in $$props) $$invalidate(4, animation = $$props.animation);
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    		if ('diameter' in $$props) $$invalidate(5, diameter = $$props.diameter);
    		if ('xKey' in $$props) $$invalidate(6, xKey = $$props.xKey);
    		if ('yKey' in $$props) $$invalidate(7, yKey = $$props.yKey);
    		if ('selected' in $$props) $$invalidate(2, selected = $$props.selected);
    		if ('categories' in $$props) $$invalidate(3, categories = $$props.categories);
    		if ('catKey' in $$props) $$invalidate(8, catKey = $$props.catKey);
    		if ('playerName' in $$props) playerName = $$props.playerName;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*index, indexPrev*/ 513) {
    			// Reactive code to trigger CHART actions
    			if (index[0] != indexPrev[0]) {
    				if (chartActions[+index[0]]) {
    					chartActions[+index[0]]();
    				}

    				$$invalidate(9, indexPrev[0] = index[0], indexPrev);
    			}
    		}
    	};

    	return [
    		index,
    		data,
    		selected,
    		categories,
    		animation,
    		diameter,
    		xKey,
    		yKey,
    		catKey,
    		indexPrev,
    		scroller_index_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    // const App = require('./App.svelte');

    var app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
