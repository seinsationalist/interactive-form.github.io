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
    valid,
    output = {
        name: '',
        email: '',
        phone: '',
        message: ''
    }

function handleInput(e) {
    isInputValid()
    growText(e.target.value)
}

function textTransition(element, content) {
    if (element.textContent === content) return;
    element.parentNode.classList.add('transition')
    let transition = document.querySelector('.transition');
    
    setTimeout(() => {
        transition.classList.remove('transition');
        transition.querySelector('p').textContent = content;
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
            output.name = form.input.value;
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
            output.email = form.input.value;
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
            output.phone = form.input.value;
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
            output.message = form.input.value;
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
    
    growText('')
    prevIndex = inputIndex;
    next ? inputIndex++ : inputIndex--;
    next ? form.dots[inputIndex-1].classList.add('active') : form.dots[inputIndex+1].classList.remove('active'); 
    switch (inputIndex) {
        case 0: 
            form.input.name = "name"
            form.input.placeholder = "Your Name"
            form.input.value = output.name
            break;
        case 1: 
            form.input.name = "email"
            form.input.placeholder = "Email"
            form.input.value = output.email
            break;
        case 2: 
            form.input.name = "phone"
            form.input.placeholder = "Phone Number"
            form.input.value = output.phone
            break;
        case 3: 
            form.input.name = "message"
            form.input.placeholder = "Message (optional)"
            form.input.value = output.message
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