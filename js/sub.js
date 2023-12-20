class SubCommon {
    constructor() {
        this.header = document.querySelector('.header');
        this.subContent = document.querySelector('.sub-content');
        this.imgLists = document.querySelectorAll('.sub-detail--img-list');
        this.imgArray = Array.from(this.imgLists);
        this.btnPrev = document.querySelector('.btn-prev');
        this.btnNext = document.querySelector('.btn-next');
        this.activeImg = 0;
        this.imgCurrentNum = document.querySelector('.current');
        this.imgTotalNum = document.querySelector('.total');    
    }
    init = () => {
        this.bindEvents();
        this.initScreen();
    }
    initScreen = () => {
        this.setHeaderHeight();
        this.changeCurrent(this.activeImg + 1, this.imgLists.length);
        this.setBtnDisabled();
    }

    bindEvents = () => {
        this.btnPrev.addEventListener('click', this.prevImgSlide);
        this.btnNext.addEventListener('click', this.nextImgSlide);
        this.imgLists.forEach(imgList => {
            imgList.addEventListener('touchstart', this.touchImgSlide);
            imgList.addEventListener('touchend', this.touchImgSlide);
        });

        window.addEventListener('resize', this.setHeaderHeight);
    }

    setHeaderHeight = () => {
        const hh = this.header.clientHeight + 5;
        this.subContent.style.setProperty('--hh', `${hh}px`);
    }

    prevImgSlide = () => {
        if (this.activeImg > 0) {
            this.activeImg--;
        } else {
            return false;
        }
        this.changeCurrent(this.activeImg + 1, this.imgLists.length);
        this.imgSlide(this.activeImg);
    }

    nextImgSlide = () => {
        if (this.activeImg < this.imgLists.length - 1) {
            this.activeImg++;
        } else {
            return false;
        }
        this.changeCurrent(this.activeImg + 1, this.imgLists.length);
        this.imgSlide(this.activeImg);
    }

    touchImgSlide = (event) => {
        if (event.type === 'touchstart') {
            this.touchstartX = event.changedTouches[0].screenX;
            this.touchstartY = event.changedTouches[0].screenY;
        } else if (event.type === 'touchend') {
            this.touchendX = event.changedTouches[0].screenX;
            this.touchendY = event.changedTouches[0].screenY;

            const deltaX = this.touchstartX - this.touchendX;
            const deltaY = this.touchstartY - this.touchendY;

            if (Math.abs(deltaX) > Math.abs(deltaY) + 50) {
                (deltaX > 0) ? this.nextImgSlide() : this.prevImgSlide();
            }
        }
    }

    imgSlide = (index) => {
        this.imgLists.forEach((element, i) => {
            element.classList.remove('active');
            setTimeout(function () {  
                if (i === index) {
                    element.classList.add('active');
                }
            }, 200);

            this.btnPrev.disabled = (index === 0);
            this.btnNext.disabled = (index === this.imgLists.length - 1);
        });
    }

    setBtnDisabled = () => {
        if(this.imgLists.length <= 1) {
            this.btnPrev.disabled = true;
            this.btnNext.disabled = true;
        }
    }
    changeCurrent = (current, total) => {
        this.imgCurrentNum.textContent = current;
        this.imgTotalNum.textContent = total;
    }
}

if (document.querySelectorAll('.sub-content').length > 0) {
    const subCommon = new SubCommon();
    subCommon.init();
}

