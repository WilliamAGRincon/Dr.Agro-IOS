
n >= m
n & m > 0
mejor 0(1)
peor 0(n)


BuscarNoPagos(pilaCuentas[n], pilaPagos[m])
{
	pilaResultados[n]

	mientras tama�o pilaCuentas > 0 
		A = pop(pilaCuentas)
		
		si tama�o pilaPagos > 0 
			B = pop(pilapagos)
			
			si A != B // se comparan los n�meros de cuenta
				push(pilaResultados, A)
				push(pilaPagos, B)
			fin si
		fin mientras
	fin mientras
}