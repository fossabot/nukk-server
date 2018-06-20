import { Express, Router, Request, Response, NextFunction, Errback } from 'express';

import SRV_CONFIG from '../../config/server.config.json';
import Logger from '../tools/logger.tool';

/**
 * 
 * Clase experta en informaciòn, cada api creada deberá heredar de esta
 * @singleton Api
 */
class Api {
  private log: Logger = null;
  protected router: Router = null;
  
	/**
	 * Creates an instance of Api.
	 * @param {any} Entity 
	 * @param {any} pathApi 
	 * @memberof Api
	 */
  constructor(Entity, private apiUri: string) {
    this.apiUri = apiUri;
    //Instancia logger
    this.log = new Logger(this.constructor.name);
    //Instancia a la base de datos para la entidad jugador, solo se hace una vez	
    //this.dbEntity = Entity;
    //Instancia de ruteador(Creador de apis)
    this.router = Router();
    //Path de consumo

    //Primer middleware, evalua si la trama que se envia es correcta
    this.router.use(this.apiUri, this.schemaValidator);
    //Mapa de ruteo
    this.router.get(this.apiUri, this.get);
    this.router.post(this.apiUri, this.post);
    this.router.get(`${this.apiUri}/:id`, this.getById);
    this.router.post(`${this.apiUri}/search`, this.search);
    this.router.put(`${this.apiUri}/:id`, this.put);
    this.router.delete(`${this.apiUri}/:id`, this.delete);

  }

  /**
   * Retorna 500 si un error ha ocurrido
   * @private
   * @param {Response} res
   * @param {Errback} error
   * @memberof Api
   */
  private handle500(res: Response, error: Errback) {
    this.log.error(error);
    res.status(500).send(error);
  }

	/**
	 * 
	 * Valida el esquema 
	 * @param {any} req => trama recibida 
	 * @param {any} res => respuesta a enviar 
	 * @param {any} next 
	 * @memberof Api
	 */
  protected schemaValidator(req, res, next) {
    let body = req.body;
    //Si tiene cuerpo quiere decir que no es GET
    if (body) {
      //Valida si la trama enviada es correcta
      let valid = new this.dbEntity().police(body)
      valid ?
        next() :
        res.send(SRV_CONFIG.ALERTAS.TRAMA_CORRUPTA);
    } else if (req.method === 'GET') {
      //Continue con la ejecuciòn segùn el metodo de consumo
      next();
    } else {
      //Si no es get y no tiene cuerpo devuelve trama corrupta
      res.send(SRV_CONFIG.ALERTAS.TRAMA_CORRUPTA)
    }
  }
	/**
	 * 
	 * Obtiene la entidad segùn el ID del mismo
	 * @param {any} req => trama recibida
	 * @param {any} res => respuesta a enviar 
	 * @param {any} next => ejecuta el siguiente middleware
	 * @memberof Api
	 */
  private getById(req, res, next) {
    this.dbEntity.findById(req.params.id)
      .then((data) => res.send(data))
      .catch(error => this.handle500(res, error));
  }
	/**
	 * 
	 * Obtiene todos los registros de la entidad maximo: 500
	 * @param {any} req => trama recibida
	 * @param {any} res => respuesta a enviar 
	 * @param {any} next => ejecuta el siguiente middleware
	 * @memberof Api
	 */
  private get(req, res, next) {
    this.dbEntity.find()
      .then(data => res.send(data))
      .catch(error => this.handle500(res, error));
  }
	/**
	 * 
	 * Obtiene los registros que coincidan con los parametros de busqueda
	 * @param {any} req => trama recibida
	 * @param {any} res => respuesta a enviar 
	 * @param {any} next => ejecuta el siguiente middleware
	 * @memberof Api
	 */
  private search(req, res, next) {
    this.dbEntity.find(req.body)
      .then(data => res.send(data))
      .catch(error => this.handle500(res, error));
  }
	/**
	 * Inserta un registro segùn la entidad instanciada
	 * @param {any} req => trama recibida
	 * @param {any} res => respuesta a enviar 
	 * @param {any} next => ejecuta el siguiente middleware
	 * @memberof Api
	 */
  private post(req, res, next) {
    new this.dbEntity(req.body).save()
      .then(data => {
        let z = 1;
        z[m] = 54;
        res.send(data)
      })
      .catch(error => this.handle500(res, error));
  }
	/**
	 * 
	 * Actualiza los campos enviados en la trama segùn el id de la entidad enviada en la url
	 * @param {any} req => trama recibida
	 * @param {any} res => respuesta a enviar 
	 * @param {any} next => ejecuta el siguiente middleware
	 * @memberof Api
	 */
  private put(req, res, next) {
    this.dbEntity.findByIdAndUpdate(req.params.id, req.body)
      .then(updatedEntity => res.send(updatedEntity))
      .catch(error => this.handle500(res, error));
  }
	/**
	 * 
	 * 
	 * @param {any} req 
	 * @param {any} res 
	 * @param {any} next 
	 * @memberof Api
	 */
  private delete(req, res, next) {
    this.dbEntity.findByIdAndRemove(req.params.id)
      .then(deletedEntity => res.send(deletedEntity))
      .catch(error => this.handle500(res, error));
  }
}

module.exports = Api;