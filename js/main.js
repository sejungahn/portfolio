class MainCommon {
    constructor() {
        this.html = document.documentElement;
        this.body = document.body;
        this.header = document.querySelector('.header');
        this.mainVisual = document.querySelector('.main-visual');
        this.scrollButton = document.querySelector('.btn-scroll');
        this.workImg = document.querySelector(".work-img--box");
        this.workLastImg = document.querySelector(".work-list5");
        this.workImgTrigger;
        this.workImgContents = [".work-list2",".work-list3",".work-list4",".work-list5"];
        this.workImgList = document.querySelectorAll('.work-text--img li');
        this.isActive = true;
        
    }
    init = () => {
        this.initScreen();
        this.bindEvents();
    }
    initScreen = () => {
        this.setMainVisualHeight();
        this.gsapRegister();
        window.innerWidth > 480 ? this.workFixScroll() : this.killWorkImg();
    }

    bindEvents = () => {
        window.addEventListener('resize', this.setMainVisualHeight);
        document.addEventListener('DOMContentLoaded', () => {
            document.addEventListener('scroll', this.headerOn);
        });
        this.html.addEventListener('mousewheel', this.visualScroll);
        this.scrollButton.addEventListener('click', this.btnScrollEvent);
        window.addEventListener('resize', this.resizeWorkFixScroll);
        this.workImgList.forEach((item) => {
            item.addEventListener('click',this.workSwapImgClickHandler);
        });
        
    }
    
    setMainVisualHeight = () => {
        if (!this.mainVisual) return;
        const vh = document.documentElement.clientHeight * 0.01;
        this.mainVisual.style.setProperty('--vh', `${vh}px`);
    }

    headerOn = () => {
        const isPastMainVisual = window.scrollY >= this.mainVisual.offsetTop + this.mainVisual.offsetHeight;
        if (isPastMainVisual) {
            this.header.classList.add('on');
        } else {
            this.header.classList.remove('on');
        }
    }

    visualScroll = (e) => {
        if(this.isActive){
            let currentScrollTop = this.html.scrollTop || this.body.scrollTop;
            let scrollAmount = 0;

            if(currentScrollTop >= 0 && currentScrollTop < this.mainVisual.offsetHeight){
                this.isActive = false;
                let scrollAmount = e.deltaY > 0 ? this.mainVisual.offsetHeight : 0;
                window.addEventListener('wheel',this.preventEventDefault,{ passive : false });
                this.scrollWindow(scrollAmount);
            } else if(currentScrollTop === Math.ceil(this.mainVisual.offsetHeight) && e.deltaY < 0) {
                this.isActive = false;
                window.addEventListener('wheel',this.preventEventDefault,{ passive : false });
                this.scrollWindow(0);
            } else {
                this.isActive = true;
                window.removeEventListener('wheel',this.preventEventDefault);
            }
        }
    }

    scrollWindow = (num) => {
        if (!this.isActive) {
            let self = this;
            $('html, body').stop(true).animate({
                scrollTop: num,
            }, {
                start: function () {
                     window.addEventListener('wheel',self.preventEventDefault,{ passive : false});
                },
                duration: 700,
                complete: function () {
                    self.isActive = true;
                }
            });
        }
    }

    btnScrollEvent = () => {
        if (this.isActive) {
            this.isActive = false;
            this.scrollWindow(this.mainVisual.offsetHeight);
            this.header.classList.add('on');
        } 
    }

    preventEventDefault = (e) => {
        e.preventDefault();
    }
    gsapRegister = () => {
		gsap.registerPlugin(ScrollTrigger);
    }
    workFixScroll = () => {

        this.killWorkImg();

        this.workImgTrigger = ScrollTrigger.create({
            trigger: this.workImg,
            pin: true,
            pinSpacing: false,
            start: "center center",
            end: () => "+=" + (this.workLastImg.getBoundingClientRect().bottom - this.workImg.getBoundingClientRect().bottom - 80)
        }); 

        // changeImg
        if (window.innerWidth > 480) {
            this.workImgContents.forEach(s => {
                let list = document.querySelector(s),
                    image = document.querySelector(s + "--img");
                gsap.set(image, { y: 0, yPercent: 100});
                gsap.to(image, {
                    yPercent: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: list,
                        start: () => "top 50%+=" + (this.workImg.offsetHeight / 2) + "px",
                        end: () => "+=" + this.workImg.offsetWidth,
                        scrub: true
                    }
                });
            });
        }
    }
    resizeWorkFixScroll = () => {
        if (window.innerWidth > 480) {
            this.workFixScroll();
            
        } else {
            if (this.workImgTrigger) {
                this.workImgTrigger.kill();
            }
        }
        
        ScrollTrigger.refresh();
    }
    killWorkImg = () => {
        if (this.workImgTrigger) {
            this.workImgTrigger.kill(); 
        }
    }
    workSwapImgClickHandler = (event) => {
        const clickedItem = event.currentTarget;
        const parentLiClass = clickedItem.parentNode.closest('li').classList[0];
        const targetImg = document.querySelector(`.work-img--list .${parentLiClass}--img`);
        const mobileTargetImg = document.querySelector(`.${parentLiClass} .work-img--list img`);
        console.log(mobileTargetImg);
        
        window.innerWidth > 480 ? this.workSwapImg(clickedItem, targetImg) : this.workSwapImg(clickedItem, mobileTargetImg);
    }
    workSwapImg = (clickedItem, targetImg) => {
        const imgSrc = clickedItem.querySelector('img').getAttribute('src');
        const imgAlt = clickedItem.querySelector('img').getAttribute('alt');
        
        const targetImgSrc = targetImg.getAttribute('src');
        const targetImgAlt = targetImg.getAttribute('alt');

        clickedItem.querySelector('img').setAttribute('src', targetImgSrc);
        clickedItem.querySelector('img').setAttribute('alt', targetImgAlt);

        targetImg.setAttribute('src', imgSrc);
        targetImg.setAttribute('alt', imgAlt);
    }
}

if (document.querySelectorAll('.main').length > 0) {
    const mainCommon = new MainCommon();
    mainCommon.init();
}
