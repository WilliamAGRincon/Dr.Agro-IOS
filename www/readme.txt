
n >= m
n & m > 0
mejor 0(1)
peor 0(n)


BuscarNoPagos(pilaCuentas[n], pilaPagos[m])
{
	pilaResultados[n]

	mientras tamaño pilaCuentas > 0 
		A = pop(pilaCuentas)
		
		si tamaño pilaPagos > 0 
			B = pop(pilapagos)
			
			si A != B // se comparan los números de cuenta
				push(pilaResultados, A)
				push(pilaPagos, B)
			fin si
		fin mientras
	fin mientras
}