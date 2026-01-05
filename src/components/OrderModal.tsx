import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CustomerInfo } from '../types/order';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customerInfo: CustomerInfo) => void;
  productName: string;
  selectedSize: string;
  selectedColor: string;
  price: number;
}

const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  productName,
  selectedSize,
  selectedColor,
  price
}) => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });

  const [step, setStep] = useState<'initial' | 'form'>('initial');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(customerInfo);
  };

  const handleInitialSubmit = () => {
    // Enviar pedido sin datos del cliente (solo para notificar al admin)
    onSubmit({});
  };

  const handleContinueToForm = () => {
    setStep('form');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {step === 'initial' ? 'Confirmar Pedido' : 'Datos de Envío'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'initial' ? (
            <div className="space-y-6">
              {/* Resumen del producto */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Resumen del Pedido</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Producto:</span> {productName}</p>
                  <p><span className="font-medium">Talle:</span> {selectedSize}</p>
                  <p><span className="font-medium">Color:</span> {selectedColor}</p>
                  <p className="text-lg font-semibold text-gray-900 mt-3">
                    ${price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Mensaje informativo */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Tu pedido será registrado y te contactaremos para coordinar el envío y pago.
                </p>
              </div>

              {/* Opciones */}
              <div className="space-y-3">
                <button
                  onClick={handleInitialSubmit}
                  className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Confirmar Pedido
                </button>
                <button
                  onClick={handleContinueToForm}
                  className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Agregar Datos de Envío Ahora
                </button>
                <button
                  onClick={onClose}
                  className="w-full text-gray-600 py-2 hover:text-gray-900 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Resumen del producto - compacto */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{productName}</span> - {selectedSize} - {selectedColor}
                </p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  ${price.toLocaleString()}
                </p>
              </div>

              {/* Campos del formulario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+54 9 11 1234-5678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Calle 123, Piso 4, Dpto B"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={customerInfo.city}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Buenos Aires"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    value={customerInfo.postalCode}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, postalCode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1234"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas Adicionales
                </label>
                <textarea
                  value={customerInfo.notes}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Horarios de entrega, referencias, etc."
                />
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep('initial')}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Confirmar Pedido
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderModal;

