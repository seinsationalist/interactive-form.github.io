const root = document.querySelector(':root'),
    form = {
        container: document.querySelector('.form-container'),
        dots: document.querySelectorAll('.form-dots div'),
        grow: document.querySelector('.grow'),
        input: document.querySelector('.form-input'),
        back: document.querySelector('.form-back'),
        next: document.querySelector('.form-next')
    },
    outputTemplate = {
        name: '',
        email: '',
        phone: '',
        message: ''
    };
let clone = document.createElement('div'),
    prevIndex,
    bounce = 8,
    inputIndex = 0,
    valid,
    restart = false,
    output = {...outputTemplate};

function handleInput(e) {
    isInputValid()
    growText(e.target.value)
}

function textTransition(element, content) {
    if (element.textContent === content) return;
    root.style.setProperty(`--calculated-x`, `${50}px`);
    element.parentNode.classList.add('transition')
    let transition = document.querySelector('.transition');

    setTimeout(() => {
        root.style.setProperty(`--calculated-x`, `-${bounce}px`);
        transition.querySelector('p').textContent = content;
        setTimeout(() => {
            transition.classList.remove('transition');
        }, 200);
        
    }, 100);
}

function isInputValid() {
    if (restart) return;
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
                textTransition(form.next.querySelector('p'), 'Next')
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
    if (!e.target.classList.contains('active') && !restart) return;
    if (next && inputIndex === 3 && !restart) { sendForm(); return; };
    growText('')
    if (!restart) {
        prevIndex = inputIndex;
        next ? inputIndex++ : inputIndex--;
        next ? form.dots[inputIndex-1].classList.add('active') : form.dots[inputIndex+1].classList.remove('active'); 
    }
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


growText(form.input.value)
function growText(value) {
    let prevHeight = clone.offsetHeight;
    clone.dataset.replicatedValue = value;
    clone.classList.add('clone');
    form.grow.appendChild(clone);
    root.style.setProperty(`--grow-after-max-height`, `${clone.offsetHeight>prevHeight ? clone.offsetHeight+(bounce/2) : clone.offsetHeight}px`);
    setTimeout(() => {
        root.style.setProperty(`--grow-after-max-height`, `${clone.offsetHeight}px`);
    }, 100);
}

function sendForm() {
    form.next.querySelector('p').textContent = 'Restart'
    let center = form.container.clientWidth/2 - (form.next.querySelector('span').clientWidth+12+form.next.querySelector('p').clientWidth/2)
    root.style.setProperty(`--calculated-x`, `-${center+bounce}px`);
    root.style.setProperty(`--calculated-y`, `-${form.input.clientHeight>70 ? bounce : 0}px`);
    form.next.classList.remove('active')
    form.back.classList.remove('active')
    form.next.classList.add('transition')

    form.dots[0].parentNode.style.transform = 'translateY(50px)'
    form.dots[0].parentNode.style.opacity = 0;
    form.dots.forEach(dot => dot.classList.remove('active'))
    setTimeout(() => {
        root.style.setProperty(`--calculated-x`, `-${center}px`);
        root.style.setProperty(`--calculated-y`, `-${0}px`);
    }, 200);

    growText('');
    form.input.value = 'Sent! We’ll contact you shortly.';
    form.input.classList.add('active');

    form.input.disabled = true;
    output = {...outputTemplate};
    prevIndex = inputIndex;
    inputIndex = 0;
    restart = true;
}

function restartForm(e) {
    
    
    changePage(e, true)
    form.input.classList.remove('active');
    form.dots[0].parentNode.style.transform = 'unset';
    form.dots[0].parentNode.style.opacity = 1;
    form.next.querySelector('p').textContent = 'Next';
    form.next.classList.remove('transition');

    restart = false;
    form.input.disabled = false;
    
    
}


form.input.addEventListener('input', handleInput)
form.back.addEventListener('click', (e) => changePage(e, false))
form.next.addEventListener('click', (e) => restart ? restartForm(e) : changePage(e, true))