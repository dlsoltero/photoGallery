let totalSlides = 13; // Adjust to total number of images on gallery

let currentSlideIndex = totalSlides;
let slidesArray = {};

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

const gallery = document.querySelector('.gallery-wrapper');

const thumbnails = document.createElement('div');
thumbnails.setAttribute('class','thumbnails-wrapper');

const slideshow = document.createElement('div');
slideshow.setAttribute('class','slideshow-container');
slideshow.style.display = "none";

const slideImageContainer = document.createElement('div');
slideImageContainer.setAttribute('class', 'slideContainer');

const slideImage = document.createElement('img');

const slideHeader = document.createElement('div');
slideHeader.setAttribute('class', 'slideHeader');

const slideNumber = document.createElement('span');
slideNumber.setAttribute('class', 'slideNumber');

const closeButton = document.createElement('span');
closeButton.setAttribute('class', 'closeButton');
closeButton.textContent = decodeHtml('&times;');

const prevSlide = document.createElement('a');
prevSlide.setAttribute('class', 'prevSlide');
prevSlide.textContent = decodeHtml('&#10094;');

const nextSlide = document.createElement('a');
nextSlide.setAttribute('class', 'nextSlide');
nextSlide.textContent = decodeHtml('&#10095;');

slideImageContainer.appendChild(slideImage);
slideshow.appendChild(slideImageContainer);

slideHeader.appendChild(slideNumber);
slideHeader.appendChild(closeButton);

slideshow.appendChild(slideHeader);

slideshow.appendChild(prevSlide);
slideshow.appendChild(nextSlide);

gallery.appendChild(thumbnails);
gallery.appendChild(slideshow);

for (let i = 1; i <= totalSlides; i++) {
    const newImage = document.createElement('img');

    newImage.onload = function() {
        thumbnails.appendChild(newImage);
    }

    newImage.src = 'images/' + i + '.jpg';

    newImage.onclick = function(e) {
        slideshow.style.display = "block";
        let clickedSlideIndex = Number(Object.keys(slidesArray).find(key => slidesArray[key] === e.target.src));
        currentSlide(clickedSlideIndex);
    }

    slidesArray[i] = newImage.src;
}

function showSlides() {
    let slideArrayLength = Object.keys(slidesArray).length;

    if (currentSlideIndex > slideArrayLength) {currentSlideIndex = 1}
    if (currentSlideIndex < 1) {currentSlideIndex = slideArrayLength}

    slideNumber.textContent = currentSlideIndex + '/' + slideArrayLength;

    slideImage.src = 'images/' + currentSlideIndex + '.jpg';

    document.body.style.overflow = 'hidden';

    //setTimeout(function() {plusSlides(1)}, 5000); // Change image every 2 seconds /// jumps at irregular times
}

function plusSlides(n) {
    imageToDefault();
    currentSlideIndex += n;
    showSlides();
}

function currentSlide(n) {
    currentSlideIndex = n;
    showSlides();
}

prevSlide.onclick = function() {
    plusSlides(-1);
}

nextSlide.onclick = function() {
    plusSlides(1);
}

function exitSlideShow() {
    document.body.style.overflow = 'visible';
    slideshow.style.display = "none";
}

closeButton.onclick = function() {
    exitSlideShow();
}

function imageToDefault() {
    slideImage.style.cursor = '-moz-zoom-in';

    slideImageContainer.style.position = 'static';
    slideImageContainer.style.top = 'auto';
    slideImageContainer.style.left = 'auto';
    slideImageContainer.style.transform = 'none';

    slideImageContainer.style.maxWidth = 'none';
    slideImageContainer.style.maxHeight = 'none';
    slideImageContainer.style.overflow = 'visible';


    slideImage.style.position = 'absolute';
    slideImage.style.top = '50%';
    slideImage.style.left = '50%';
    slideImage.style.transform = 'translate(-50%, -50%)';

    slideImage.style.maxWidth = '100%';
    slideImage.style.maxHeight = '100%';
}

document.addEventListener('keydown', (event) => {
    let isFocused = (document.activeElement === slideshow);
    const keyName = event.key;

    if (slideshow.style.display != "none") {
        if (keyName === 'ArrowRight') {
            plusSlides(1);
        }else if (keyName === 'ArrowLeft') {
            plusSlides(-1);
        }else if (keyName === 'Escape') {
            exitSlideShow();
        }
    }
});

let isFullSize = false;
let isDragScroll = false;

slideImage.onclick = function() {
    console.log(isDragScroll);
    if (isDragScroll) {
        isDragScroll = false;
        return;
    }

    if (isFullSize === false) {
        slideImage.style.cursor = 'all-scroll'; // '-moz-zoom-out';

        slideImageContainer.style.position = 'absolute';
        slideImageContainer.style.top = '50%';
        slideImageContainer.style.left = '50%';
        slideImageContainer.style.transform = 'translate(-50%, -50%)';

        slideImageContainer.style.maxWidth = '100%';
        slideImageContainer.style.maxHeight = '100%';
        slideImageContainer.style.overflow = 'auto';

        slideImage.style.position = 'static';
        slideImage.style.top = 'auto';
        slideImage.style.left = 'auto';
        slideImage.style.transform = 'none';

        slideImage.style.maxWidth = 'none';
        slideImage.style.maxHeight = 'none';

        isFullSize = true;
    } else {
        imageToDefault();
        isFullSize = false;
    }
}

// Drag scroll
let isDown = false;
let startY;
let startX;
let scrollTop;
let scrollLeft;

slideImage.addEventListener('mousedown', (e) => {
    isDown = true;
    //slideImage.classList.add('active');
    startY = e.pageY - slideImage.offsetTop;
    startX = e.pageX - slideImage.offsetLeft;
    scrollTop = slideImageContainer.scrollTop;
    scrollLeft = slideImageContainer.scrollLeft;
    //console.log(startY + ' ' + startX +  ' ' + scrollTop + ' ' + scrollLeft);
});

slideImage.addEventListener('mouseleave', () => {
    isDown = false;
    //slideImage.classList.remove('active');
});

slideImage.addEventListener('mouseup', () => {
    isDown = false;
    //slideImage.classList.remove('active');
});

slideImage.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    isDragScroll = true;
    const y = e.pageY - slideImage.offsetTop;
    const x = e.pageX - slideImage.offsetLeft;
    const walkY = (y - startY) * 3;
    const walkX = (x - startX) * 3;
    slideImageContainer.scrollTop = scrollTop - walkY;
    slideImageContainer.scrollLeft = scrollLeft - walkX;
});
