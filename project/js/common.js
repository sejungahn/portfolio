class Common {
    constructor() {
        this.scrollTarget = document.querySelectorAll('.motion');
        this.observer;
    }

    init = () => {
        this.bindEvents();
    }

    bindEvents = () => {
        this.observeIntersection(this.scrollTarget, this.addActiveClass, this.removeActiveClass);
    }

    observeIntersection = (elements, enterCallback, exitCallback) => {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const targetElement = entry.target;
                if (entry.isIntersecting) {
                    enterCallback(targetElement);
                } else {
                    exitCallback(targetElement);
                }
            });
        });

        elements.forEach(element => {
            this.observer.observe(element);
        });
    }

    addActiveClass = (targetElement) => {
        targetElement.classList.add('is-active');
    }

    removeActiveClass = (targetElement) => {
        targetElement.classList.remove('is-active');
    }
}

if (document.querySelectorAll('.wrap').length > 0) {
    const common = new Common();
    common.init();
}

