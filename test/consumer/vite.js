import format from 'subslate';

document.querySelector('#result').textContent = format('hello ${x}', { x: 'world' });
