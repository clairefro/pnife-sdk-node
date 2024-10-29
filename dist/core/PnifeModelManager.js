"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PnifeModelManager = void 0;
class PnifeModelManager {
    constructor() {
        this._models = new Map();
        this._getModelKey = (platform, modelName) => {
            return `${platform}__${modelName}`;
        };
        /** Returns model with raw API key */
        this._getModelWithApiKey = (platform, name) => {
            const key = this._getModelKey(platform, name);
            const model = this._models.get(key);
            if (!model) {
                throw new Error(`Model with platform ${platform} and name ${name} does not exist.`);
            }
            return model;
        };
        this._maskApiKey = (model) => {
            if (model.apiKey) {
                const maskedApiKey = "****..." + model.apiKey.slice(-4);
                return Object.assign(Object.assign({}, model), { apiKey: maskedApiKey });
            }
            return model;
        };
        this._safeModel = (model) => {
            return this._maskApiKey(model);
        };
        // ===========================================================================
        this.addModel = (model) => {
            // TODO: If no other models present, set added model as active model
            const key = this._getModelKey(model.platform, model.name);
            if (this._models.has(key)) {
                throw new Error(`Model with platform ${model.platform} and name ${model.name} is already registered. Try updating instead`);
            }
            // TODO: VALIDATE MODEL
            // make added model the default active model, if no other models registered
            if (![...this._models.values()].length) {
                this._activeModel = model;
            }
            this._models.set(key, model);
        };
        this.removeModel = (platform, modelName) => {
            const key = this._getModelKey(platform, modelName);
            if (!this._models.has(modelName)) {
                throw new Error(`Model with platform ${platform} and name ${modelName} does not exist.`);
            }
            this._models.delete(key);
        };
        this.getModel = (platform, modelName) => {
            const model = this._getModelWithApiKey(platform, modelName);
            return this._safeModel(model);
        };
        this.updateModel = (platform, modelName, updated = {}) => {
            const key = this._getModelKey(platform, modelName);
            const _model = this._getModelWithApiKey(platform, modelName);
            if (!_model) {
                throw new Error(`Model with platform ${platform} name ${modelName} does not exist.`);
            }
            // TODO VALIDATE UPDATED
            this._models.set(key, Object.assign(Object.assign({}, _model), updated));
        };
        this.listModels = () => {
            const models = Array.from(this._models.values());
            return models.map(this._safeModel);
        };
        this.setActiveModel = (platform, modelName) => {
            const key = this._getModelKey(platform, modelName);
            const model = this._models.get(key);
            if (!model) {
                throw new Error(`Model with platform ${platform} and name ${modelName} does not exist.`);
            }
            this._activeModel = model;
        };
        // public
        this.getActiveModel = () => {
            return this._activeModel ? this._safeModel(this._activeModel) : undefined;
        };
        // returns raw API key - not to be used to return public facing data
        this._getActiveModelUnsafe = () => {
            return this._activeModel;
        };
    }
}
exports.PnifeModelManager = PnifeModelManager;
