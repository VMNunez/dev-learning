# Repaso espaciado — preguntas esenciales de entrevista

Plan y estado del bloque de interview-prep (16:00–16:50). Este archivo guarda, pregunta a pregunta,
cuándo la aprendiste, cómo te fue en cada repaso y cuándo toca el siguiente. Lo escribe `spaced.py`;
no se edita a mano salvo la sección de ajustes.

## Cómo se usa

1. Al empezar el bloque: `python notes/interview-prep/spaced/spaced.py hoy`, o pregúntale a Claude
   «¿qué toca hoy?». Primero salen los repasos y después las preguntas nuevas.
2. Tras cada pregunta se registra el resultado:
   `python notes/interview-prep/spaced/spaced.py registrar ID resultado`.
3. `calendario` enseña los próximos días y `estado` el progreso por tema.

## Reglas

- **Pregunta nueva:** intentas responder sin mirar, lees la respuesta del banco (`es/`), la explicas
  con tus palabras y con un ejemplo. Se registra como `aprendida`.
- **Repaso:** sin mirar la respuesta ni recibir pistas. Es `pass` si la respuesta es correcta, das un
  ejemplo válido (del proyecto cuando corresponda) y aguantas una repregunta sobre el mismo concepto;
  `borderline` si la idea central está bien pero falta algo importante; `fail` si hay un error de
  concepto o no sabes responder.
- **Intervalos:** aprendida → 1 día; primer `pass` → 6 días; segundo → 14; tercero → 30; cuarto → 60;
  después, cada 90. Si todo sale bien, los repasos caen a +1, +7 y +21 días de aprenderla, y luego
  pasan a mantenimiento.
- **`borderline`** se repite al día siguiente y conserva la racha. **`fail`** devuelve la racha a 0 y
  se repite al día siguiente.
- **Domingo libre:** lo que cae en domingo pasa al lunes. Un repaso atrasado sigue apareciendo hasta
  que se hace.
- **Verificada:** racha de 2 (dos `pass` seguidos, separados al menos 6 días), que es el criterio E de
  `HORARIO.md`. **Consolidada:** racha de 3 o más.
- **Preguntas nuevas al día:** hasta `Nuevas por día`, y menos cuando los repasos ya llenan el bloque.
- **Preguntas nuevas en el repositorio:** cada `hoy` añade al final las ⭐⭐⭐ de las fuentes que aún no
  estén aquí, con `Origen: añadida AAAA-MM-DD`. El criterio E sigue contando solo las del anexo.

## Ajustes

- Inicio: 2026-10-26
- Nuevas por día: 4
- Minutos del bloque: 50
- Minutos por pregunta nueva: 6
- Minutos por repaso: 3
- Intervalos (días): 1, 6, 14, 30, 60, 90

Fuentes (todas sus preguntas ⭐⭐⭐; el orden decide el desempate al repartirlas):

- Fuente: junior/es/angular.md | Angular
- Fuente: projects/es/07-timetrack.md | Proyecto 7
- Fuente: junior/es/spring-boot.md | Spring Boot
- Fuente: junior/es/java.md | Java
- Fuente: junior/es/sql.md | SQL
- Fuente: junior/es/javascript.md | JavaScript
- Fuente: junior/es/typescript.md | TypeScript

## Preguntas

| # | ID | Tema | Título | Origen | Aprendida | Racha | Próximo repaso | Estado | Historial |
|---|---|---|---|---|---|---|---|---|---|
| 1 | ANG-J-001 | Angular | Qué es Angular | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 2 | 07-timetrack-001 | Proyecto 7 | API JSON y separación de Angular | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 3 | SB-J-001 | Spring Boot | Qué es Spring Boot y por qué se usa | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 4 | JAVA-J-001 | Java | Primitivos frente a objetos | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 5 | SQL-J-001 | SQL | PRIMARY KEY combinada con SERIAL | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 6 | ANG-J-003 | Angular | Qué es un componente | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 7 | 07-timetrack-005 | Proyecto 7 | Filtrar entradas según el usuario | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 8 | JS-J-001 | JavaScript | Var, let y const | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 9 | SB-J-002 | Spring Boot | Qué es la auto-configuración | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 10 | ANG-J-005 | Angular | Inyección de dependencias en Angular | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 11 | 07-timetrack-007 | Proyecto 7 | DTOs en lugar de entidades JPA | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 12 | JAVA-J-002 | Java | BigDecimal frente a double para dinero | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 13 | ANG-J-007 | Angular | Componentes standalone y el array imports | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 14 | SB-J-003 | Spring Boot | Inyección por constructor frente a @Autowired en campo | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 15 | SQL-J-002 | SQL | Definir una clave foránea | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 16 | 07-timetrack-009 | Proyecto 7 | Operaciones explícitas para cambiar de estado | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 17 | ANG-J-011 | Angular | Tipos de data binding | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 18 | JAVA-J-007 | Java | Por qué == falla con Strings | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 19 | 07-timetrack-059 | Proyecto 7 | Shell, rutas hijas y carga diferida | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 20 | SB-J-004 | Spring Boot | @Transactional y dónde se pone | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 21 | ANG-J-013 | Angular | Qué es un signal | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 22 | JS-J-002 | JavaScript | Qué es un closure | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 23 | TS-J-001 | TypeScript | Qué aporta TypeScript | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 24 | ANG-J-015 | Angular | signal() frente a computed() | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 25 | 07-timetrack-061 | Proyecto 7 | Página coordinadora y lista presentacional | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 26 | SQL-J-010 | SQL | NUMERIC frente a FLOAT para dinero | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 27 | SB-J-005 | Spring Boot | @Data de Lombok y la anotación del servicio | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 28 | JAVA-J-012 | Java | == frente a .equals() | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 29 | ANG-J-016 | Angular | effect() y cuándo usarlo | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 30 | 07-timetrack-062 | Proyecto 7 | Estado compartido de aprobaciones pendientes | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 31 | SB-J-014 | Spring Boot | @Controller frente a @RestController | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 32 | ANG-J-020 | Angular | signal.set() frente a signal.update() | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 33 | 07-timetrack-105 | Proyecto 7 | Contrato JSON y tipos de TypeScript | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 34 | JAVA-J-018 | Java | Los cuatro modificadores de acceso | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 35 | SQL-J-015 | SQL | Qué es una clave foránea | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 36 | JS-J-005 | JavaScript | Igualdad débil frente a estricta | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 37 | ANG-J-022 | Angular | El bloque @if | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 38 | SB-J-015 | Spring Boot | @PathVariable frente a @RequestParam | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 39 | 07-timetrack-019 | Proyecto 7 | JWT stateless y CSRF | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 40 | ANG-J-023 | Angular | @for y track | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 41 | JAVA-J-020 | Java | Qué es la encapsulación | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 42 | 07-timetrack-020 | Proyecto 7 | ID inmutable como identidad del JWT | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 43 | ANG-J-038 | Angular | Qué es HttpClient | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 44 | SB-J-016 | Spring Boot | Arquitectura en capas de Spring Boot | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 45 | SQL-J-016 | SQL | Los tres tipos de relaciones entre tablas | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 46 | ANG-J-039 | Angular | Observable frente a Promise | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 47 | 07-timetrack-021 | Proyecto 7 | Del filtro JWT a la autorización | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 48 | JS-J-006 | JavaScript | Coerción de tipos implícita | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 49 | SB-J-017 | Spring Boot | DTOs frente a devolver entidades JPA | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 50 | JAVA-J-025 | Java | Interfaz frente a clase abstracta | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 51 | ANG-J-040 | Angular | subscribe() y cuándo desuscribirse | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 52 | 07-timetrack-022 | Proyecto 7 | Consultar la cuenta en cada petición | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 53 | ANG-J-048 | Angular | Subject frente a BehaviorSubject | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 54 | SQL-J-028 | SQL | Por qué falla WHERE price = NULL | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 55 | SB-J-018 | Spring Boot | CORS y el error CORS desde Angular | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 56 | 07-timetrack-023 | Proyecto 7 | Filter chain y seguridad por método | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 57 | JAVA-J-029 | Java | Qué es el polimorfismo | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 58 | ANG-J-050 | Angular | Cómo funciona el routing en Angular | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 59 | 07-timetrack-025 | Proyecto 7 | Contraseñas con BCrypt | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 60 | SB-J-027 | Spring Boot | JPA frente a Hibernate | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 61 | ANG-J-051 | Angular | Qué es un route guard | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 62 | JS-J-012 | JavaScript | Funciones normales frente a arrow functions | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 63 | SQL-J-037 | SQL | Qué es un JOIN | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 64 | 07-timetrack-029 | Proyecto 7 | Secreto JWT fuera del repositorio | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 65 | JAVA-J-033 | Java | List, Set y Map | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 66 | ANG-J-056 | Angular | Route params frente a query params | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 67 | SB-J-028 | Spring Boot | Qué te da JpaRepository | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 68 | ANG-J-061 | Angular | Qué es el lazy loading | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 69 | 07-timetrack-075 | Proyecto 7 | Sesión en localStorage y seguridad | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 70 | TS-J-002 | TypeScript | Interface frente a type | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 71 | SB-J-029 | Spring Boot | FetchType.LAZY frente a FetchType.EAGER | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 72 | ANG-J-065 | Angular | Qué es un HTTP interceptor | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 73 | JAVA-J-034 | Java | Sobreescribir equals() y hashCode() juntos | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 74 | 07-timetrack-078 | Proyecto 7 | Interceptor y bearer token | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 75 | SQL-J-038 | SQL | INNER JOIN frente a LEFT JOIN | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 76 | JS-J-013 | JavaScript | La palabra clave this | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 77 | ANG-J-070 | Angular | Formularios reactivos frente a template-driven | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 78 | SB-J-030 | Spring Boot | El problema N+1 | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 79 | 07-timetrack-079 | Proyecto 7 | Caducar la sesión ante un 401 | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 80 | ANG-J-080 | Angular | ngOnInit y cuándo usarlo | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 81 | JAVA-J-041 | Java | Excepciones checked frente a unchecked | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 82 | 07-timetrack-106 | Proyecto 7 | Recorrido completo del login y la sesión | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 83 | SB-J-031 | Spring Boot | Mapear un enum con @Enumerated(EnumType.STRING) | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 84 | SQL-J-043 | SQL | Qué hace GROUP BY | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 85 | ANG-J-081 | Angular | Llamadas a la API en ngOnInit frente al constructor | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 86 | 07-timetrack-031 | Proyecto 7 | Ocultar entradas ajenas con 404 | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 87 | ANG-J-086 | Angular | Qué es un pipe | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 88 | JAVA-J-047 | Java | Qué es una lambda | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 89 | SB-J-042 | Spring Boot | Cómo funciona la autenticación JWT | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 90 | JS-J-017 | JavaScript | For...of frente a for...in | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 91 | 07-timetrack-032 | Proyecto 7 | Proyectos inactivos: 404 frente a 400 | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 92 | ANG-J-089 | Angular | El pipe async | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 93 | SQL-J-044 | SQL | WHERE frente a HAVING | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 94 | SB-J-043 | Spring Boot | SecurityFilterChain y qué se configura en él | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 95 | ANG-J-092 | Angular | Qué es Angular Material | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 96 | 07-timetrack-034 | Proyecto 7 | Evitar el autobloqueo del manager | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 97 | JAVA-J-048 | Java | Qué es el Stream API | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 98 | ANG-J-097 | Angular | MatTableDataSource frente a un array | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 99 | 07-timetrack-038 | Proyecto 7 | Generación y reset de contraseñas | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 100 | SB-J-044 | Spring Boot | Autenticación frente a autorización | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 101 | ANG-J-110 | Angular | Qué es la encapsulación de vistas | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 102 | JAVA-J-057 | Java | Qué son los genéricos | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 103 | SQL-J-045 | SQL | Contar solo las entradas aprobadas por proyecto | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 104 | JS-J-019 | JavaScript | Map, filter y reduce | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 105 | 07-timetrack-041 | Proyecto 7 | Condiciones para aprobar o rechazar | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 106 | ANG-J-115 | Angular | Tu experiencia con tests unitarios en Angular | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 107 | SB-J-045 | Spring Boot | BCryptPasswordEncoder y las contraseñas en texto plano | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 108 | 07-timetrack-084 | Proyecto 7 | Acciones de Entries según rol y estado | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 109 | ANG-J-116 | Angular | Qué es TestBed | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 110 | JAVA-J-058 | Java | Optional frente a devolver null | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 111 | SB-J-046 | Spring Boot | JWT frente a sesiones del lado del servidor | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 112 | SQL-J-058 | SQL | Qué es un índice | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 113 | 07-timetrack-085 | Proyecto 7 | Prohibir la revisión de entradas propias | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 114 | ANG-J-123 | Angular | Qué es la detección de cambios | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 115 | TS-J-024 | TypeScript | Utilidad de los genéricos | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 116 | JS-J-029 | JavaScript | El event loop | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 117 | ANG-J-124 | Angular | Default frente a OnPush | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 118 | SB-J-056 | Spring Boot | @ControllerAdvice y cuándo usarlo | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 119 | 07-timetrack-091 | Proyecto 7 | Autogestión del manager en Team | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 120 | JAVA-J-061 | Java | Enum frente a constante String | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 121 | ANG-J-128 | Angular | Arquitectura Core/Feature/Shared | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 122 | 07-timetrack-128 | Proyecto 7 | Acceso ajeno: controles de Angular y Spring | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 123 | SQL-J-061 | SQL | Qué es una transacción | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 124 | SB-J-063 | Spring Boot | @SpringBootTest y cuándo usarlo | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 125 | ANG-J-129 | Angular | El patrón coordinator | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 126 | JAVA-J-068 | Java | Qué es una anotación | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 127 | 07-timetrack-129 | Proyecto 7 | Reabrir una entrada rechazada | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 128 | ANG-J-131 | Angular | Estado en un servicio frente al componente | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 129 | SB-J-064 | Spring Boot | Mockito y @MockBean | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 130 | JS-J-030 | JavaScript | Promises frente a async/await | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 131 | 07-timetrack-110 | Proyecto 7 | Stack local con Docker Compose | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 132 | ANG-J-136 | Angular | Recorrido por el HR portal | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 133 | SQL-J-062 | SQL | Las propiedades ACID | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 134 | JAVA-J-071 | Java | Qué es Maven | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 135 | SB-J-069 | Spring Boot | Containerizar una aplicación Spring Boot | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 136 | 07-timetrack-112 | Proyecto 7 | Despliegue público antes de terminar los tests | anexo 20/10/2026 |  | 0 |  | pendiente |  |
| 137 | ANG-J-144 | Angular | JWT en una app Angular + Spring Boot | anexo 20/10/2026 |  | 0 |  | pendiente |  |
