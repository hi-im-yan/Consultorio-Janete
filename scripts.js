//Essa variavel é pra ser usada em outros arquivos
//Guarda o total recebido no dia
var valorTotal = 0;

// cliente Class: Representa um cliente
class Cliente {
	constructor(name, pagamento, valor, valor_descontado) {
		this.name = name;
		this.pagamento = pagamento;
		this.valor = valor;
		this.valor_descontado = valor_descontado;
	}
}

// UI Class: Tarefas da UI
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

		// Some o alerta em 1 segundo
		setTimeout(() => document.querySelector('.alert').remove(), 1000);
	}

	static clearFields() {
		document.querySelector('#name').value = '';
		document.querySelector('#pagamento').value = '';
		document.querySelector('#valor').value = '';
	}
}

// Store Class: Banco (LocalStorage)
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

// Event: addCliente a clientes
document.querySelector('#cliente-form').addEventListener('submit', (e) => {
	// Previne um submit de ser nulo
	e.preventDefault();

	// Pegar valores do form
	const name = document.querySelector('#name').value;
	const pagamento = document.querySelector('#pagamento').value;
	const valor = document.querySelector('#valor').value;
	let valor_descontado = 0;

	if (pagamento === 'débito') {
		valor_descontado = Math.round(new Number(valor * 1.49 / 100) * 100) / 100;
	} else if (pagamento === 'crédito') {
		valor_descontado = Math.round(new Number(valor * 2.39 / 100) * 100) / 100;
	}

	// Validação
	if (name === '' || pagamento === '' || valor === '') {
		UI.showAlert('Preencha todos os campos', 'danger');
	} else {
		// Instanciar cliente
		const cliente = new Cliente(name, pagamento, valor, valor_descontado);

		// Adiciona o cliente na UI
		UI.addClienteToList(cliente);

		// Adiciona o cliente no banco (LocalStorage)
		Store.addCliente(cliente);

		// Mostrar mensagem de sucesso
		UI.showAlert('Adicionado', 'success');

		// Apagar textos do input
		UI.clearFields();
	}
});

// Event: Remove cliente
document.querySelector('#cliente-list').addEventListener('click', (e) => {
	// Remove cliente da UI
	UI.deletecliente(e.target);

	// Remove cliente do banco
	Store.removecliente(
		e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling
			.previousElementSibling.textContent
	);

	// mostra mensagem de sucesso
	UI.showAlert('Removido', 'warning');
});
