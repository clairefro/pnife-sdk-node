import { Model } from "../types";

export class PnifeModelManager {
  private _models: Map<string, Model> = new Map();
  private _activeModel?: Model;

  private _getModelKey = (platform: string, modelName: string) => {
    return `${platform}__${modelName}`;
  };

  /** Returns model with raw API key */
  private _getModelWithApiKey = (platform: string, name: string): Model => {
    const key = this._getModelKey(platform, name);
    const model = this._models.get(key);
    if (!model) {
      throw new Error(
        `Model with platform ${platform} and name ${name} does not exist.`
      );
    }
    return model;
  };

  private _maskApiKey = (model: Model): Model => {
    if (model.apiKey) {
      const maskedApiKey = "****..." + model.apiKey.slice(-4);
      return { ...model, apiKey: maskedApiKey };
    }
    return model;
  };

  private _safeModel = (model: Model): Model => {
    return this._maskApiKey(model);
  };

  // ===========================================================================

  addModel = (model: Model): void => {
    // TODO: If no other models present, set added model as active model

    const key = this._getModelKey(model.platform, model.name);
    if (this._models.has(key)) {
      throw new Error(
        `Model with platform ${model.platform} and name ${model.name} is already registered. Try updating instead`
      );
    }
    // TODO: VALIDATE MODEL

    // make added model the default active model, if no other models registered
    if (![...this._models.values()].length) {
      this._activeModel = model;
    }
    this._models.set(key, model);
  };

  removeModel = (platform: string, modelName: string): void => {
    const key = this._getModelKey(platform, modelName);
    if (!this._models.has(modelName)) {
      throw new Error(
        `Model with platform ${platform} and name ${modelName} does not exist.`
      );
    }
    this._models.delete(key);
  };

  getModel = (platform: string, modelName: string) => {
    const model = this._getModelWithApiKey(platform, modelName);
    return this._safeModel(model);
  };

  updateModel = (platform: string, modelName: string, updated = {}): void => {
    const key = this._getModelKey(platform, modelName);
    const _model = this._getModelWithApiKey(platform, modelName);
    if (!_model) {
      throw new Error(
        `Model with platform ${platform} name ${modelName} does not exist.`
      );
    }
    // TODO VALIDATE UPDATED
    this._models.set(key, { ..._model, ...updated });
  };

  listModels = (): Model[] => {
    const models = Array.from(this._models.values());
    return models.map(this._safeModel);
  };

  setActiveModel = (platform: string, modelName: string): void => {
    const key = this._getModelKey(platform, modelName);
    const model = this._models.get(key);

    if (!model) {
      throw new Error(
        `Model with platform ${platform} and name ${modelName} does not exist.`
      );
    }
    this._activeModel = model;
  };

  // public
  getActiveModel = (): Model | undefined => {
    return this._activeModel ? this._safeModel(this._activeModel) : undefined;
  };

  // returns raw API key - not to be used to return public facing data
  _getActiveModelUnsafe = (): Model | undefined => {
    return this._activeModel;
  };
}
