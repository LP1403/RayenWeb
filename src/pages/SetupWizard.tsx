import React, { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import { ConfigService } from '../services/configService';

const SetupWizard: React.FC = () => {
  const [dtfCost, setDtfCost] = useState(0);
  const [savingDtfCost, setSavingDtfCost] = useState(false);

  // Cargar el costo de DTF al iniciar
  useEffect(() => {
    loadDtfCost();
  }, []);

  const loadDtfCost = async () => {
    try {
      const config = await ConfigService.getGlobalConfig();
      setDtfCost(config.dtfCost);
    } catch (error) {
      console.error('Error loading DTF cost:', error);
    }
  };

  const handleSaveDtfCost = async () => {
    setSavingDtfCost(true);
    try {
      await ConfigService.updateDtfCost(dtfCost);
      alert('Costo de DTF actualizado correctamente');
    } catch (error) {
      console.error('Error saving DTF cost:', error);
      alert('Error al guardar el costo de DTF');
    } finally {
      setSavingDtfCost(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Configuración</h1>
        <p className="text-gray-400 mt-1">
          Administra los costos globales del sistema
        </p>
      </div>

      {/* Configuración de Costos */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="bg-green-500 p-3 rounded-lg text-white">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white mb-2">
              Configuración de Costos
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Configura los costos globales que se aplicarán a todos los pedidos.
            </p>

            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Costo de DTF (por unidad)
              </label>
              <div className="flex items-center space-x-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={dtfCost}
                    onChange={(e) => setDtfCost(Number(e.target.value))}
                    className="w-full pl-8 px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="0.00"
                  />
                </div>
                <button
                  onClick={handleSaveDtfCost}
                  disabled={savingDtfCost}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed font-medium"
                >
                  {savingDtfCost ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Este costo se aplicará automáticamente a todos los pedidos nuevos. El DTF (Direct to Film) es el proceso de impresión en la prenda.
              </p>
            </div>

            <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3 mb-3">
              <p className="text-xs text-yellow-300">
                <strong>💡 Tip:</strong> Los costos de Mano de Obra y Envío se configuran individualmente para cada pedido desde la gestión de pedidos.
              </p>
            </div>

            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3">
              <p className="text-xs text-blue-300">
                <strong>📝 Nota:</strong> El costo de cada producto se configura individualmente desde el menú de Productos.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-200 mb-2">ℹ️ Información</h3>
        <ul className="text-sm text-blue-300 space-y-1 list-disc list-inside">
          <li>El costo de DTF se aplica globalmente a todos los pedidos</li>
          <li>Los costos de Mano de Obra y Envío se configuran por pedido</li>
          <li>El costo de producción de cada producto se configura en el menú de Productos</li>
          <li>Puedes modificar el costo de DTF en cualquier momento</li>
        </ul>
      </div>
    </div>
  );
};

export default SetupWizard;

