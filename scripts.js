// cliente Class: Represents a client
var valorTotal = 0;
class Cliente {
	constructor(name, pagamento, valor, valor_descontado) {
		this.name = name;
		this.pagamento = pagamento;
		this.valor = valor;
		this.valor_descontado = valor_descontado;
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
		valorTotal = new Number(valorTotal) + new Number(cliente.valor) - new Number(cliente.valor_descontado);
		valorTotal = new Number(valorTotal).toFixed(2);
		const row = document.createElement('tr');
		row.innerHTML = `
        <td>${cliente.name}</td>
        <td>${cliente.pagamento}</td>
        <td>${cliente.valor}</td>
        <td>${cliente.valor_descontado}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
      `;
		document.getElementById('valor-total').innerHTML = `<h1> valor Total: ${valorTotal}</h1>`;

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
		document.querySelector('#valor').value = '';
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

	static removecliente(name) {
		const clientes = Store.getclientes();
		clientes.forEach((cliente, index) => {
			if (cliente.name === name) {
				clientes.splice(index, 1);
			}
		});

		localStorage.setItem('clientes', JSON.stringify(clientes));
	}
}

// Event: Display clientes
document.addEventListener('DOMContentLoaded', UI.displayclientes);

function download(nome_arquivo_saida, type) {
	var a = document.getElementById('a');
	let pessoa = JSON.parse(localStorage.getItem('clientes'));
	let pessoas = pessoa.toString();

	let date = new Date();

	let arquivo_saida = date.getDate() + '/' + new Number(date.getMonth() + 1) + '/' + date.getFullYear();
	console.log(pessoas);
	var cliente = [];
	for (var i = 0; i < pessoa.length; i++) {
		cliente[i] =
			'\r\n' +
			pessoa[i].name.toString() +
			' - ' +
			pessoa[i].pagamento.toString() +
			' - ' +
			pessoa[i].valor.toString() +
			' -  ' +
			pessoa[i].valor_descontado.toString() +
			'\r\n';

		//console.log(cliente[i]);
	}
	a.href = URL.createObjectURL(
		new Blob(
			[
				'Nome - Forma de Pagamento - Valor - Valor Descontado' + '\r\n' + '\r\n',
				cliente,
				'\r\n' + 'VALOR TOTAL -> ',
				valorTotal
			],
			{
				type: type
			}
		)
	);
	a.download = arquivo_saida;
}

// Event: addCliente a clientes
document.querySelector('#cliente-form').addEventListener('submit', (e) => {
	// Prevent actual submit
	e.preventDefault();

	// Get form values
	const name = document.querySelector('#name').value;
	const pagamento = document.querySelector('#pagamento').value;
	const valor = document.querySelector('#valor').value;
	let valor_descontado = 0;

	if (pagamento === 'débito') {
		valor_descontado = Math.round(new Number(valor * 1.49 / 100) * 100) / 100;
	} else if (pagamento === 'crédito') {
		valor_descontado = Math.round(new Number(valor * 2.39 / 100) * 100) / 100;
	}

	// Validate
	if (name === '' || pagamento === '' || valor === '') {
		UI.showAlert('Preencha todos os campos', 'danger');
	} else {
		// Instatiate cliente
		const cliente = new Cliente(name, pagamento, valor, valor_descontado);

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
	Store.removecliente(
		e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling
			.previousElementSibling.textContent
	);

	// Show success message
	UI.showAlert('Removido', 'warning');
});
