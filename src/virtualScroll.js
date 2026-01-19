// Virtual Scroll Component
// Renders only visible items for performance optimization with large lists

export class VirtualScroll {
    constructor(options) {
        this.container = options.container;
        this.items = options.items || [];
        this.renderItem = options.renderItem;
        this.itemHeight = options.itemHeight || 80;
        this.bufferSize = options.bufferSize || 5;

        this.scrollTop = 0;
        this.containerHeight = 0;
        this.visibleCount = 0;

        this.wrapper = null;
        this.content = null;

        this.init();
    }

    init() {
        // Create wrapper structure
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'virtual-scroll-wrapper';
        this.wrapper.style.cssText = `
            position: relative;
            overflow-y: auto;
            height: 100%;
        `;

        this.content = document.createElement('div');
        this.content.className = 'virtual-scroll-content';
        this.content.style.cssText = `
            position: relative;
        `;

        this.wrapper.appendChild(this.content);
        this.container.appendChild(this.wrapper);

        // Calculate visible count
        this.containerHeight = this.wrapper.clientHeight || 600;
        this.visibleCount = Math.ceil(this.containerHeight / this.itemHeight) + this.bufferSize * 2;

        // Bind scroll event
        this.handleScroll = this.throttle(this.onScroll.bind(this), 16);
        this.wrapper.addEventListener('scroll', this.handleScroll);

        // Handle resize
        this.handleResize = this.debounce(this.onResize.bind(this), 100);
        window.addEventListener('resize', this.handleResize);

        // Initial render
        this.render();
    }

    setItems(items) {
        this.items = items;
        this.render();
    }

    onScroll() {
        this.scrollTop = this.wrapper.scrollTop;
        this.render();
    }

    onResize() {
        this.containerHeight = this.wrapper.clientHeight;
        this.visibleCount = Math.ceil(this.containerHeight / this.itemHeight) + this.bufferSize * 2;
        this.render();
    }

    render() {
        const totalHeight = this.items.length * this.itemHeight;
        this.content.style.height = `${totalHeight}px`;

        // Calculate visible range
        const startIndex = Math.max(0, Math.floor(this.scrollTop / this.itemHeight) - this.bufferSize);
        const endIndex = Math.min(this.items.length, startIndex + this.visibleCount);

        // Clear existing items
        const existingItems = this.content.querySelectorAll('.virtual-scroll-item');
        existingItems.forEach(item => item.remove());

        // Render visible items
        const fragment = document.createDocumentFragment();

        for (let i = startIndex; i < endIndex; i++) {
            const itemWrapper = document.createElement('div');
            itemWrapper.className = 'virtual-scroll-item';
            itemWrapper.style.cssText = `
                position: absolute;
                top: ${i * this.itemHeight}px;
                left: 0;
                right: 0;
                height: ${this.itemHeight}px;
            `;
            itemWrapper.dataset.index = i;

            // Render item content
            const itemContent = this.renderItem(this.items[i], i);
            if (typeof itemContent === 'string') {
                itemWrapper.innerHTML = itemContent;
            } else if (itemContent instanceof HTMLElement) {
                itemWrapper.appendChild(itemContent);
            }

            fragment.appendChild(itemWrapper);
        }

        this.content.appendChild(fragment);
    }

    scrollToIndex(index) {
        const top = index * this.itemHeight;
        this.wrapper.scrollTop = top;
    }

    scrollToTop() {
        this.wrapper.scrollTop = 0;
    }

    destroy() {
        this.wrapper.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        this.container.innerHTML = '';
    }

    // Utility: Throttle function
    throttle(fn, wait) {
        let lastTime = 0;
        return function (...args) {
            const now = Date.now();
            if (now - lastTime >= wait) {
                lastTime = now;
                fn.apply(this, args);
            }
        };
    }

    // Utility: Debounce function
    debounce(fn, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), wait);
        };
    }
}

/**
 * Simple Virtual List for basic use cases
 * Renders items in a simpler way without absolute positioning
 */
export class SimpleVirtualList {
    constructor(container, items, renderItem, options = {}) {
        this.container = container;
        this.items = items;
        this.renderItem = renderItem;
        this.batchSize = options.batchSize || 20;
        this.loadMoreThreshold = options.loadMoreThreshold || 200;

        this.renderedCount = 0;
        this.isLoading = false;

        this.init();
    }

    init() {
        this.container.innerHTML = '';
        this.renderedCount = 0;

        // Render initial batch
        this.loadMore();

        // Setup infinite scroll
        this.scrollHandler = this.throttle(this.onScroll.bind(this), 100);

        // Find scrollable parent
        this.scrollParent = this.findScrollParent(this.container);
        this.scrollParent.addEventListener('scroll', this.scrollHandler);
    }

    setItems(items) {
        this.items = items;
        this.renderedCount = 0;
        this.container.innerHTML = '';
        this.loadMore();
    }

    findScrollParent(element) {
        let parent = element.parentElement;
        while (parent) {
            const style = getComputedStyle(parent);
            if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
                return parent;
            }
            parent = parent.parentElement;
        }
        return window;
    }

    onScroll() {
        const scrollParent = this.scrollParent;

        let scrollTop, scrollHeight, clientHeight;

        if (scrollParent === window) {
            scrollTop = window.scrollY;
            scrollHeight = document.documentElement.scrollHeight;
            clientHeight = window.innerHeight;
        } else {
            scrollTop = scrollParent.scrollTop;
            scrollHeight = scrollParent.scrollHeight;
            clientHeight = scrollParent.clientHeight;
        }

        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

        if (distanceFromBottom < this.loadMoreThreshold && !this.isLoading) {
            this.loadMore();
        }
    }

    loadMore() {
        if (this.renderedCount >= this.items.length) return;

        this.isLoading = true;

        const fragment = document.createDocumentFragment();
        const endIndex = Math.min(this.renderedCount + this.batchSize, this.items.length);

        for (let i = this.renderedCount; i < endIndex; i++) {
            const item = this.items[i];
            const element = this.renderItem(item, i);

            if (typeof element === 'string') {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = element;
                fragment.appendChild(wrapper.firstElementChild || wrapper);
            } else if (element instanceof HTMLElement) {
                fragment.appendChild(element);
            }
        }

        this.container.appendChild(fragment);
        this.renderedCount = endIndex;
        this.isLoading = false;
    }

    destroy() {
        this.scrollParent.removeEventListener('scroll', this.scrollHandler);
    }

    throttle(fn, wait) {
        let lastTime = 0;
        return function (...args) {
            const now = Date.now();
            if (now - lastTime >= wait) {
                lastTime = now;
                fn.apply(this, args);
            }
        };
    }
}

export default { VirtualScroll, SimpleVirtualList };
