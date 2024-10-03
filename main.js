const root = document.querySelector(':root'),
    form = {
        container: document.querySelector('.form-container'),
        dots: document.querySelectorAll('.form-dots div'),
        grow: document.querySelector('.grow'),
        input: document.querySelector('.form-input'),
        back: document.querySelector('.form-back'),
        next: document.querySelector('.form-next')
    };
let clone = document.createElement('div'),
    prevIndex,
    inputIndex = 0,
    valid

function handleInput(e) {
    isInputValid()
    growText(e.target.value)
}

function textTransition(element, content) {
    if (element.textContent === content) return;
    let prevPos = getComputedStyle(element.parentNode).transform;
    console.log(prevPos)
    element.parentNode.style.transform = `translateX(${content.length*10}px)`;
    element.style.opacity = 0;
    setTimeout(() => {
        element.textContent = content;
        
        element.parentNode.style.transform = prevPos;
        element.style.opacity = 1;
    }, 100);
}

function isInputValid() {
    valid = {
        name: form.input.value.length>1,

        email: form.input.value.includes('@') &&
            form.input.value.includes('.') &&
            form.input.value.length>4,

        phone: form.input.value.length>0,

        message: form.input.value.length>0
    }

    switch (form.input.name) {
        case 'name':
            form.back.classList.remove('active');
            if (valid.name) {
                form.dots[0].classList.add('active');
                form.next.classList.add('active');
            } else {
                form.dots[0].classList.remove('active');
                form.next.classList.remove('active');
            }
            break;
        case 'email':
            form.back.classList.add('active');          
            if (valid.email) {
                form.dots[1].classList.add('active');
                form.next.classList.add('active');
            } else {
                form.dots[1].classList.remove('active');
                form.next.classList.remove('active');
                textTransition(form.next.querySelector('p'), 'Next')
            }
            break;
        case 'phone':

            form.next.classList.add('active');
            if (valid.phone) {
                form.dots[2].classList.add('active');
                textTransition(form.next.querySelector('p'), 'Next')
            } else {
                form.dots[2].classList.remove('active');
                textTransition(form.next.querySelector('p'), 'Continue without phone')
            }
            break;
        case 'message':
            form.next.classList.add('active');
            if (valid.message) {
                form.dots[3].classList.add('active');
                textTransition(form.next.querySelector('p'), 'Send')
            } else {
                form.dots[3].classList.remove('active');
                textTransition(form.next.querySelector('p'), 'Send without a message')
            }
            break;
    }
}

function changePage(e, next) {
    
    if (!e.target.classList.contains('active') || (next && inputIndex === 3)) return;
    form.input.value = '';
    growText('')
    prevIndex = inputIndex;
    next ? inputIndex++ : inputIndex--;
    next ? form.dots[inputIndex-1].classList.add('active') : form.dots[inputIndex+1].classList.remove('active'); 
    switch (inputIndex) {
        case 0: 
            form.input.name = "name"
            form.input.placeholder = "Your Name"
            break;
        case 1: 
            form.input.name = "email"
            form.input.placeholder = "Email"
            break;
        case 2: 
            form.input.name = "phone"
            form.input.placeholder = "Phone Number"
            break;
        case 3: 
            form.input.name = "message"
            form.input.placeholder = "Message (optional)"
            break;

    }
    isInputValid();
    form.dots[prevIndex].classList.remove('current')
    form.dots[inputIndex].classList.add('current')
}

function growText(value) {
    clone.dataset.replicatedValue = value;
    clone.classList.add('clone');
    form.grow.appendChild(clone);
    root.style.setProperty(`--grow-after-maxHeight`, `${clone.offsetHeight}px`);
}

form.input.addEventListener('input', handleInput)
form.back.addEventListener('click', (e) => changePage(e, false))
form.next.addEventListener('click', (e) => changePage(e, true))