import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { GlobalConfig, UpdateConfigData } from '../types/config';

const CONFIG_COLLECTION = 'config';
const CONFIG_DOC_ID = 'global';

export class ConfigService {
  // Obtener configuración global
  static async getGlobalConfig(): Promise<GlobalConfig> {
    try {
      const configRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
      const configSnap = await getDoc(configRef);

      if (configSnap.exists()) {
        const data = configSnap.data();
        return {
          dtfCost: data.dtfCost || 0,
          shippingCost: data.shippingCost || 0,
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      }

      // Si no existe, crear con valores por defecto
      const defaultConfig: GlobalConfig = {
        dtfCost: 0,
        shippingCost: 0,
        updatedAt: new Date(),
      };

      await setDoc(configRef, {
        dtfCost: defaultConfig.dtfCost,
        shippingCost: defaultConfig.shippingCost,
        updatedAt: defaultConfig.updatedAt,
      });

      return defaultConfig;
    } catch (error) {
      console.error('Error getting global config:', error);
      // Retornar config por defecto en caso de error
      return {
        dtfCost: 0,
        shippingCost: 0,
        updatedAt: new Date(),
      };
    }
  }

  // Actualizar configuración global
  static async updateGlobalConfig(configData: UpdateConfigData): Promise<void> {
    try {
      const configRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
      await setDoc(configRef, {
        ...configData,
        updatedAt: new Date(),
      }, { merge: true });
    } catch (error) {
      console.error('Error updating global config:', error);
      throw error;
    }
  }

  // Obtener solo el costo de DTF
  static async getDtfCost(): Promise<number> {
    const config = await this.getGlobalConfig();
    return config.dtfCost;
  }

  // Actualizar solo el costo de DTF
  static async updateDtfCost(dtfCost: number): Promise<void> {
    await this.updateGlobalConfig({ dtfCost });
  }

  // Obtener solo el costo de envío
  static async getShippingCost(): Promise<number> {
    const config = await this.getGlobalConfig();
    return config.shippingCost;
  }

  // Actualizar solo el costo de envío
  static async updateShippingCost(shippingCost: number): Promise<void> {
    await this.updateGlobalConfig({ shippingCost });
  }
}

