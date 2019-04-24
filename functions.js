/*
    TODO
    - Fazer download automatico a cada intervalo de tempo [ ]
    - Implementar função que apaga todos os clientes a cada novo dia [feito]
	- Implementar função selfInvoke para pegar o dia atual [feito]
	- Implementar um banco para fazer armazenar dados apagados []
*/

var d = new Date();
var dia;

//Essa função selfinvoke vai apagar os dados dos clientes a cada novo dia
(function() {
	let dia_anterior = JSON.parse(localStorage.getItem('dias'));
	dia = d.getDate();
	console.log(dia, dia_anterior);
	if (dia != dia_anterior) {
		clearAllClientes();
		dia_anterior = dia;
		localStorage.setItem('dias', JSON.stringify(dia));
	}
})();

//Essa função aqui faz a pessoa conseguir fazer o download em txt com todos os clientes armazenados
function download() {
	let a = document.getElementById('a');
	let pessoa = JSON.parse(localStorage.getItem('clientes'));
	let arquivo_saida = d.getDate() + '/' + new Number(d.getMonth() + 1) + '/' + d.getFullYear();
	let cliente = [];

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
				type: 'text/plain'
			}
		)
	);
	a.download = arquivo_saida;
}

//Essa função vai apagar todos os clientes
//Tem que automatizar o processo [feito]
function clearAllClientes() {
	//backUp();
	let clientes = Store.getclientes();

	clientes = [];

	valorTotal = 0;

	localStorage.setItem('clientes', JSON.stringify(clientes));

	UI.displayclientes();
}

/*
var clientesDeBackup = [];
function backUp() {
	if (localStorage.getItem('clientesDeBackup') === null) {
		clientesDeBackup = [];
	} else {
		let clientes = Store.getclientes();

		for (let i = 0; i < clientes.length; i++) {
			clientesDeBackup.push(clientes[i]);
		}
		//console.log(clientes, 'entrou no backup');
	}
	localStorage.setItem('clientesDeBackup', JSON.stringify(clientesDeBackup));
}
*/
