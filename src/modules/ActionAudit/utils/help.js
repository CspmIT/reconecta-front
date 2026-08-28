// Textos de ayuda de cada KPI y cada gráfico. Le hablan al administrador de la
// cooperativa, no a un desarrollador: explican cómo leer el gráfico y qué es
// normal ver ahí.
export const HELP = {
	sessions:
		'Cuántas veces se inició sesión en Reconecta. Si una persona entra desde la PC y desde el celular, cuentan dos.',
	requests:
		'Todos los pedidos que Reconecta le hace al servidor. La mayoría son automáticos: las pantallas de monitoreo piden datos frescos cada pocos segundos, así que el número crece aunque nadie esté tocando nada.',
	avg: 'Cuánto tarda el servidor en contestar, en promedio. Por debajo de 300 ms se siente instantáneo; si sube y se queda arriba, algo está lento.',
	errors:
		'Pedidos que terminaron mal en el período. Que haya algunos es normal (una sesión vencida, una pantalla que se cerró a mitad de camino); lo que hay que mirar es un salto repentino.',
	traffic:
		'Uso del sistema a lo largo del tiempo. Arrastrá o usá la rueda del mouse para hacer zoom en un tramo y ver el detalle.',
	composition:
		'De dónde vienen los pedidos. Las pantallas que refrescan solas generan la mayor parte del tráfico; las acciones de personas son la porción chica.',
	responseDay:
		'Tiempo de respuesta promedio por día. Sirve para ver si el sistema se fue poniendo lento con el correr de los días, más allá de un pico puntual.',
	hourly:
		'A qué hora del día se usa Reconecta. El pico suele coincidir con el horario de la guardia; las horas planas son buenas candidatas para tareas de mantenimiento.',
	heatmap:
		'Cruce de día de la semana y hora. Se lee de un vistazo cuándo pega el pico (celdas oscuras) y cuándo el sistema está tranquilo, útil para elegir la ventana de mantenimiento.',
	latency:
		'Cómo se reparten los pedidos según lo que tardaron. Lo sano es que la mayoría esté en las barras verdes de la izquierda.',
	modulesUsed: 'Qué partes de Reconecta se usan más. Mide cantidad de pedidos, no tiempo.',
	modulesDemanding:
		'Qué partes le dan más trabajo al servidor, sumando el tiempo de todos sus pedidos. Un módulo puede usarse poco y aun así encabezar acá si cada consulta es pesada.',
	endpoints: 'Las consultas más frecuentes. Son direcciones internas del sistema, útiles para el equipo técnico.',
	slowest:
		'Las consultas que más tardan en promedio. Se consideran sólo las que se llamaron al menos 20 veces, para que un pico aislado no encabece la lista.',
	logins: 'Inicios de sesión por día. Un día en cero fuera de un fin de semana largo merece una mirada.',
	activeUsers:
		'Quiénes generan más pedidos. Ojo al leerlo: alguien que deja abierta una pantalla de monitoreo todo el día va a figurar altísimo aunque no haya tocado nada.',
	mqtt: 'Acciones enviadas a los reconectadores por MQTT: aperturas, cierres y envíos de configuración.',
	status:
		'Cómo terminó cada pedido. 2xx es todo bien; 3xx es una redirección; 4xx es un problema del lado de quien pide (permisos, sesión vencida, datos mal cargados); 5xx es una falla del servidor y es lo único que debería preocupar.',
	errorsByDay: 'Errores por día. Lo importante no es el valor absoluto sino el escalón: un día que se dispara.',
	errorsByModule: 'En qué parte del sistema se concentran los errores del período.',
	errorsDetail:
		'El detalle de lo que falló. "Agrupados" junta los errores repetidos y muestra cuántas veces pasó cada uno; "Últimos" muestra los más recientes en orden.',
	movements:
		'Registro de acciones de las personas: inicios de sesión y órdenes enviadas a los equipos. Queda asentado quién hizo qué y cuándo.',
}
