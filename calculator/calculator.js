/* Updated Professional Calculator with actual Delete button functionality */

/* script.js */
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
let currentInput = '';
let resultCalculated = false;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        if(button.classList.contains('clear')) {
            currentInput = '';
            display.textContent = '0';
            resultCalculated = false;
            return;
        }

        if(button.classList.contains('delete')) {
            currentInput = currentInput.slice(0, -1);
            display.textContent = currentInput || '0';
            return;
        }

        if(button.classList.contains('equal')) {
            try {
                let expression = currentInput.replace(/×/g, '*').replace(/÷/g, '/');
                let evalResult = eval(expression);
                display.textContent = evalResult;
                currentInput = evalResult;
                resultCalculated = true;
            } catch {
                display.textContent = 'Error';
                currentInput = '';
            }
            return;
        }

        if(resultCalculated && /[0-9.]/.test(value)) {
            currentInput = value;
            resultCalculated = false;
        }

        currentInput += value;
        display.textContent = currentInput;
    });
});

// Keyboard Support
document.addEventListener('keydown', (e) => {
    const key = e.key;
    if((/[0-9]/.test(key)) || key === '.' || key === '+' || key === '-' || key === '*' || key === '/') {
        currentInput += key;
        display.textContent = currentInput;
    } else if(key === 'Enter') {
        try {
            let evalResult = eval(currentInput);
            display.textContent = evalResult;
            currentInput = evalResult;
            resultCalculated = true;
        } catch {
            display.textContent = 'Error';
            currentInput = '';
        }
    } else if(key === 'Backspace') {
        currentInput = currentInput.slice(0, -1);
        display.textContent = currentInput || '0';
    } else if(key.toLowerCase() === 'c') {
        currentInput = '';
        display.textContent = '0';
    }
});