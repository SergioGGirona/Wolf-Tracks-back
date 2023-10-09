# Project Wolf Tracks

Trabajo final del bootcamp de programación de ISDI Coders.
Autor: Sergio G. Girona
Objetivo: Realiza una web fullstack MERN para demostrar en la práctica los conocimientos aprendidos a lo largo del bootcamp.

### La idea:

Una web para una ONG de ayuda de conservación del lobo que se especializa en hacer un seguimiento manual de diferentes manadas para tener un mayor control sobre la población lobuna, a menudo sobreestimada.

En la landing se encontrarán datos de la propia ONG con enlace a más info, así como los que se siguen por la ONG.

El proyecto se centra en crear un CRUD con dos entities, Users y Wolfs, donde el primero podrá añadir, editar, crear y borrar lobos. Los users tendán que estar registrados y logueados para acceder a toda la información así como a los métodos de crear, editar y eliminar.

## Requisitos Backend:

-TypeScript
-Node + Express
-auth con JWT
-tests unitarios
-tests de endpoints (supertest)
-guardado de archivos binarios en disco duro (temp) y Cloudinary (o similar)
-validación de requests con Joi
-README con información de uso y con endpoints (de cada endpoint método, url, body y response)
-100% coverage
-0 deuda técnica
-Colección de endpoints de Postman exportada como JSON (en el root del proyecto)
-Proceso de login de usuario testado con Cypress

## Endpoints

Teniendo dos entities, User para los empleados y Wolf para los lobos que se están "siguiendo", los endpoints serían:
[PATCH]/user/login
[POST]/user/register
[GET]/user/
[GET]/wolves
[GET]/wolves/:id
[GET]/wolves/territory/:zona
[POST]/wolves/
[PATCH]/wolves/:id
[DELETE]/wolves/:id
