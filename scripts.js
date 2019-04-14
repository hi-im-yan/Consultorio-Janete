// cliente Class: Represents a cliente
var valorTotal = 0;
class Cliente {
	constructor(name, pagamento, isbn) {
		this.name = name;
		this.pagamento = pagamento;
		this.isbn = isbn;
	}
}

// UI Class: Handle UI Tasks
class UI {
	static displayclientes() {
		const clientes = Store.getclientes();

		clientes.forEach((cliente) => UI.addClienteToList(cliente));
	}

	static addClienteToList(cliente) {
		const list = document.querySelector('#cliente-list');
		valorTotal = valorTotal + new Number(cliente.isbn);
		const row = document.createElement('tr');
		row.innerHTML = `
        <td>${cliente.name}</td>
        <td>${cliente.pagamento}</td>
        <td>${cliente.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
      `;
		document.getElementById('valor-total').innerHTML = `<h1> Valor Total: ${valorTotal}</h1>`;

		list.appendChild(row);
	}

	static deletecliente(el) {
		if (el.classList.contains('delete')) {
			el.parentElement.parentElement.remove();
		}
	}

	static showAlert(message, className) {
		const div = document.createElement('div');
		div.className = `alert alert-${className}`;
		div.appendChild(document.createTextNode(message));
		const container = document.querySelector('.container');
		const form = document.querySelector('#cliente-form');
		container.insertBefore(div, form);

		// Vanish in 3 seconds
		setTimeout(() => document.querySelector('.alert').remove(), 1000);
	}

	static clearFields() {
		document.querySelector('#name').value = '';
		document.querySelector('#pagamento').value = '';
		document.querySelector('#isbn').value = '';
	}
}

// Store Class: Handles Storage
class Store {
	static getclientes() {
		let clientes;
		if (localStorage.getItem('clientes') === null) {
			clientes = [];
		} else {
			clientes = JSON.parse(localStorage.getItem('clientes'));
		}
		console.log(clientes);
		return clientes;
	}

	static addCliente(cliente) {
		const clientes = Store.getclientes();
		clientes.push(cliente);
		localStorage.setItem('clientes', JSON.stringify(clientes));
	}

	static removecliente(isbn) {
		const clientes = Store.getclientes();

		clientes.forEach((cliente, index) => {
			if (cliente.isbn === isbn) {
				clientes.splice(index, 1);
			}
		});

		localStorage.setItem('clientes', JSON.stringify(clientes));
	}
}

// Event: Display clientes
document.addEventListener('DOMContentLoaded', UI.displayclientes);

function download(nome_txt, type) {
	var a = document.getElementById('a');
	var pessoa = JSON.parse(localStorage.getItem('clientes'));

	for (var i = 0; i < pessoa.length; i++) {
		let cliente = pessoa[i];
		console.log(cliente);
		let cliente_name = new Blob([ cliente.name ], { type: 'text/plain' });
		let cliente_pagamento = new Blob([ cliente ], { type: 'text/plain' });
		a.href = URL.createObjectURL(cliente_name);
		a.href = URL.createObjectURL(cliente_pagamento);
	}
	a.download = nome_txt;
}

function forloop() {
	var pessoa = JSON.parse(localStorage.getItem('clientes'));
	var arrClientes = [];
	for (var i = 0; i < pessoa.length; i++) {
		let cliente = pessoa[i];
		console.log(cliente);
		let cliente_name = new Blob([ cliente.name ], { type: 'text/plain' });
		let cliente_pagamento = new Blob([ cliente ], { type: 'text/plain' });
		a.href = URL.createObjectURL(cliente_name);
		a.href = URL.createObjectURL(cliente_pagamento);
	}
}

// Event: addCliente a cliente
document.querySelector('#cliente-form').addEventListener('submit', (e) => {
	// Prevent actual submit
	e.preventDefault();

	// Get form values
	const name = document.querySelector('#name').value;
	const pagamento = document.querySelector('#pagamento').value;
	const isbn = document.querySelector('#isbn').value;

	// Validate
	if (name === '' || pagamento === '' || isbn === '') {
		UI.showAlert('Preencha todos os campos', 'danger');
	} else {
		// Instatiate cliente
		const cliente = new Cliente(name, pagamento, isbn);

		// addCliente cliente to UI
		UI.addClienteToList(cliente);

		// addCliente cliente to store
		Store.addCliente(cliente);

		// Show success message
		UI.showAlert('Adicionado', 'success');

		// Clear fields
		UI.clearFields();
	}
});

// Event: Remove a cliente
document.querySelector('#cliente-list').addEventListener('click', (e) => {
	// Remove cliente from UI
	UI.deletecliente(e.target);

	// Remove cliente from store
	Store.removecliente(e.target.parentElement.previousElementSibling.textContent);

	// Show success message
	UI.showAlert('Removido', 'warning');
});
