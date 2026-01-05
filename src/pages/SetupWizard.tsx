import React, { useState, useEffect } from 'react';
import { Package, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';
import { collection, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ConfigService } from '../services/configService';

const SetupWizard: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [dtfCost, setDtfCost] = useState(0);
  const [savingDtfCost, setSavingDtfCost] = useState(false);
  
  // Estados para agregar costos a productos
  const [runningCostMigration, setRunningCostMigration] = useState(false);
  const [costMigrationStatus, setCostMigrationStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [costMigrationMessage, setCostMigrationMessage] = useState('');
  const [costMigrationLogs, setCostMigrationLogs] = useState<string[]>([]);

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

  const addCostLog = (log: string) => {
    setCostMigrationLogs(prev => [...prev, log]);
    console.log(log);
  };

  const addProductCosts = async () => {
    setRunningCostMigration(true);
    setCostMigrationStatus('running');
    setCostMigrationLogs([]);
    setCostMigrationMessage('Iniciando proceso...');

    try {
      addCostLog('💰 Agregando campo "cost" a productos...');

      // Obtener todos los productos
      const productsRef = collection(db, 'products');
      const querySnapshot = await getDocs(productsRef);

      addCostLog(`📦 Encontrados ${querySnapshot.docs.length} productos`);

      let updated = 0;
      let skipped = 0;

      // Actualizar cada producto
      for (const productDoc of querySnapshot.docs) {
        const productData = productDoc.data();
        
        if (productData.cost === undefined || productData.cost === null) {
          // Usar 50% del precio como estimación inicial
          const estimatedCost = Math.round((productData.price || 0) * 0.5);
          
          await updateDoc(doc(db, 'products', productDoc.id), {
            cost: estimatedCost,
            updatedAt: new Date()
          });
          
          addCostLog(`✅ "${productData.name}" - Precio: $${productData.price?.toLocaleString()}, Costo estimado: $${estimatedCost.toLocaleString()}`);
          updated++;
        } else {
          addCostLog(`⏭️  "${productData.name}" ya tiene costo: $${productData.cost.toLocaleString()}`);
          skipped++;
        }
      }

      setCostMigrationStatus('success');
      setCostMigrationMessage(`✅ Completado: ${updated} productos actualizados, ${skipped} ya tenían costo. IMPORTANTE: Los costos se calcularon como 50% del precio. Ajústalos manualmente.`);
      
    } catch (error: any) {
      console.error('Error:', error);
      setCostMigrationStatus('error');
      setCostMigrationMessage(`Error: ${error.message}`);
      addCostLog(`❌ Error: ${error.message}`);
    } finally {
      setRunningCostMigration(false);
    }
  };

  const addLog = (log: string) => {
    setLogs(prev => [...prev, log]);
    console.log(log);
  };

  const addProductNumbers = async () => {
    setRunning(true);
    setStatus('running');
    setLogs([]);
    setMessage('Iniciando proceso...');

    try {
      addLog('📦 Agregando números identificadores a productos...');

      // Obtener todos los productos
      const productsRef = collection(db, 'products');
      const querySnapshot = await getDocs(productsRef);

      addLog(`📊 Encontrados ${querySnapshot.docs.length} productos`);

      let productNumber = 1001;
      let updated = 0;
      let skipped = 0;

      // Actualizar cada producto
      for (const productDoc of querySnapshot.docs) {
        const productData = productDoc.data();
        
        if (!productData.productNumber) {
          await updateDoc(doc(db, 'products', productDoc.id), {
            productNumber: productNumber,
            updatedAt: new Date()
          });
          
          addLog(`✅ Producto "${productData.name}" actualizado con número: ${productNumber}`);
          productNumber++;
          updated++;
        } else {
          addLog(`⏭️  Producto "${productData.name}" ya tiene número: ${productData.productNumber}`);
          skipped++;
          if (productData.productNumber >= productNumber) {
            productNumber = productData.productNumber + 1;
          }
        }
      }

      // Crear o actualizar el contador de productos
      const counterRef = doc(db, 'counters', 'productCounter');
      await setDoc(counterRef, { count: productNumber }, { merge: true });
      
      addLog(`📈 Contador de productos actualizado a: ${productNumber}`);
      
      // Inicializar contador de pedidos si no existe
      const orderCounterRef = doc(db, 'counters', 'orderCounter');
      await setDoc(orderCounterRef, { count: 0 }, { merge: true });
      
      addLog('📊 Contador de pedidos inicializado');

      setStatus('success');
      setMessage(`¡Proceso completado! ${updated} productos actualizados, ${skipped} ya tenían números.`);
      
    } catch (error: any) {
      console.error('Error:', error);
      setStatus('error');
      setMessage(`Error: ${error.message}`);
      addLog(`❌ Error: ${error.message}`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Configuración Inicial</h1>
        <p className="text-gray-400 mt-1">
          Ejecuta las tareas de configuración necesarias para el sistema de pedidos
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-500 p-3 rounded-lg text-white">
            <Package className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white mb-2">
              Agregar Números a Productos
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Esta tarea agrega números identificadores únicos a todos los productos existentes.
              Solo necesitas ejecutarla una vez.
            </p>

            <button
              onClick={addProductNumbers}
              disabled={running}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                running
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : status === 'success'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {running ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              ) : status === 'success' ? (
                '✅ Completado'
              ) : (
                'Ejecutar Configuración'
              )}
            </button>

            {message && (
              <div className={`mt-4 p-4 rounded-lg flex items-start space-x-3 ${
                status === 'success'
                  ? 'bg-green-900/50 border border-green-700'
                  : status === 'error'
                  ? 'bg-red-900/50 border border-red-700'
                  : 'bg-blue-900/50 border border-blue-700'
              }`}>
                {status === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                ) : status === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <svg className="animate-spin h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                <p className={`text-sm ${
                  status === 'success'
                    ? 'text-green-200'
                    : status === 'error'
                    ? 'text-red-200'
                    : 'text-blue-200'
                }`}>
                  {message}
                </p>
              </div>
            )}

            {logs.length > 0 && (
              <div className="mt-4 bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Registro de actividad:</h3>
                <div className="space-y-1 font-mono text-xs">
                  {logs.map((log, index) => (
                    <div key={index} className="text-gray-400">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Agregar Costos a Productos */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="bg-purple-500 p-3 rounded-lg text-white">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white mb-2">
              Agregar Campo de Costo a Productos
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Agrega el campo "cost" (costo de producción) a todos los productos existentes.
              Los costos se calcularán automáticamente como 50% del precio de venta, pero deberás ajustarlos manualmente.
            </p>

            <button
              onClick={addProductCosts}
              disabled={runningCostMigration}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                runningCostMigration
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : costMigrationStatus === 'success'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {runningCostMigration ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              ) : costMigrationStatus === 'success' ? (
                '✅ Completado'
              ) : (
                'Agregar Costos a Productos'
              )}
            </button>

            {costMigrationMessage && (
              <div className={`mt-4 p-4 rounded-lg flex items-start space-x-3 ${
                costMigrationStatus === 'success'
                  ? 'bg-green-900/50 border border-green-700'
                  : costMigrationStatus === 'error'
                  ? 'bg-red-900/50 border border-red-700'
                  : 'bg-blue-900/50 border border-blue-700'
              }`}>
                {costMigrationStatus === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                ) : costMigrationStatus === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <svg className="animate-spin h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                <p className={`text-sm ${
                  costMigrationStatus === 'success'
                    ? 'text-green-200'
                    : costMigrationStatus === 'error'
                    ? 'text-red-200'
                    : 'text-blue-200'
                }`}>
                  {costMigrationMessage}
                </p>
              </div>
            )}

            {costMigrationLogs.length > 0 && (
              <div className="mt-4 bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Registro de actividad:</h3>
                <div className="space-y-1 font-mono text-xs">
                  {costMigrationLogs.map((log, index) => (
                    <div key={index} className="text-gray-400">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
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

            <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3">
              <p className="text-xs text-yellow-300">
                <strong>💡 Tip:</strong> Los costos de Mano de Obra y Envío se configuran individualmente para cada pedido desde la gestión de pedidos.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-200 mb-2">ℹ️ Información</h3>
        <ul className="text-sm text-blue-300 space-y-1 list-disc list-inside">
          <li>La configuración de números de producto solo debe ejecutarse una vez</li>
          <li>Asigna números únicos a cada producto (1001, 1002, etc.)</li>
          <li>Inicializa los contadores para productos y pedidos</li>
          <li>El costo de DTF se puede modificar en cualquier momento</li>
          <li>Puedes ejecutar la configuración de números múltiples veces de forma segura</li>
        </ul>
      </div>
    </div>
  );
};

export default SetupWizard;

