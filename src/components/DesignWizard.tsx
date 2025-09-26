import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { garmentTypes, designs, designSizes, predesignedItems } from '../data/designData';
import { GarmentType, Design, DesignSize, PredesignedItem, CustomDesign } from '../types/Design';
import DesignPreview from './DesignPreview';
import GarmentCanvasPreview from './GarmentCanvasPreview';
import CanvasCheckout from './CanvasCheckout';

// Sin props, usa useNavigate
const DesignWizard: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedGarment, setSelectedGarment] = useState<GarmentType | null>(null);
    const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
    const [selectedColor, setSelectedColor] = useState<string>('');
    // Cuando se selecciona prenda, setear color blanco si es el único disponible
    const handleGarmentSelect = (garment: GarmentType) => {
        setSelectedGarment(garment);
        if (garment.colors.length === 1) {
            setSelectedColor(garment.colors[0]);
        } else if (garment.colors.includes('#FFFFFF')) {
            setSelectedColor('#FFFFFF');
        } else {
            setSelectedColor(garment.colors[0] || '');
        }
    };
    const [selectedSize, setSelectedSize] = useState<DesignSize>(designSizes[1]); // Medium por defecto
    const [designPosition, setDesignPosition] = useState({ x: 50, y: 50 });
    const [designRotation, setDesignRotation] = useState(0);

    const totalSteps = 3;

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handlePredesignedSelect = (item: PredesignedItem) => {
        setSelectedGarment(garmentTypes.find(g => g.id === item.garmentType) || null);
        setSelectedDesign(item.design);
        setSelectedColor(item.garmentColor);
        setSelectedSize(designSizes.find(s => s.id === item.designSize) || designSizes[1]);
        setDesignPosition(item.designPosition);
        setDesignRotation(0);
    };

    const getCurrentDesign = (): CustomDesign => ({
        garmentType: selectedGarment?.id || '',
        garmentColor: selectedColor,
        selectedDesign,
        designSize: selectedSize.id,
        designPosition,
        designRotation,
        price: selectedGarment ? (selectedGarment.id === 'remera' ? 15900 : 22900) : 0,
        createdAt: new Date()
    });

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-light text-black mb-4">Elige tu prenda</h2>
                            <p className="text-gray-600 font-light">Selecciona el tipo de prenda que quieres personalizar</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {garmentTypes.filter(g => g.baseImage).map((garment) => (
                                <button
                                    key={garment.id}
                                    onClick={() => handleGarmentSelect(garment)}
                                    className={`p-8 border-2 transition-all duration-300 ${selectedGarment?.id === garment.id
                                        ? 'border-black bg-gray-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="aspect-[3/4] bg-gray-100 mb-4 overflow-hidden">
                                        <img
                                            src={garment.baseImage}
                                            alt={garment.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="text-xl font-light text-black mb-2">{garment.name}</h3>
                                    <p className="text-gray-600 font-light">
                                        Desde ${garment.id === 'remera' ? '15.900' : '22.900'}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-light text-black mb-4">Personaliza tu diseño</h2>
                            <p className="text-gray-600 font-light">Ajusta el tamaño, posición y color de tu prenda</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                            {/* Diseños - 60% */}
                            <div className="lg:col-span-3 space-y-6">
                                <div>
                                    <h3 className="text-lg font-light text-black mb-4">Selecciona un diseño</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        {designs.map((design) => (
                                            <button
                                                key={design.id}
                                                onClick={() => setSelectedDesign(design)}
                                                className={`p-3 border-2 transition-all duration-300 ${selectedDesign?.id === design.id
                                                    ? 'border-black bg-gray-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="aspect-square bg-gray-100 mb-2 overflow-hidden">
                                                    <img
                                                        src={design.image}
                                                        alt={design.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <h4 className="text-xs font-light text-black text-center">{design.name}</h4>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Colores - Solo blanco, negro, gris */}
                                <div>
                                    <h3 className="text-lg font-light text-black mb-4">Color de la prenda</h3>
                                    <div className="flex gap-4">
                                        <button
                                            key="#FFFFFF"
                                            onClick={() => setSelectedColor('#FFFFFF')}
                                            className={`w-16 h-16 border-2 transition-all duration-300 ${selectedColor === '#FFFFFF' ? 'border-black scale-110' : 'border-gray-300'}`}
                                            style={{ backgroundColor: '#FFFFFF' }}
                                        />
                                    </div>
                                </div>

                                {/* Tamaño del diseño */}
                                <div>
                                    <h3 className="text-lg font-light text-black mb-4">Tamaño del diseño</h3>
                                    <div className="flex gap-3">
                                        {designSizes.map((size) => (
                                            <button
                                                key={size.id}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-4 py-2 border font-light transition-colors text-sm ${selectedSize.id === size.id
                                                    ? 'border-black bg-black text-white'
                                                    : 'border-gray-300 text-gray-600 hover:border-black'
                                                    }`}
                                            >
                                                {size.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Prediseñadas en horizontal */}
                                <div>
                                    <h3 className="text-lg font-light text-black mb-4">Inspiración</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <button
                                            key={predesignedItems[0].id}
                                            onClick={() => handlePredesignedSelect(predesignedItems[0])}
                                            className="p-3 border border-gray-200 hover:border-gray-300 transition-colors text-center"
                                        >
                                            <div className="aspect-square bg-gray-100 mb-2 overflow-hidden relative">
                                                {/* Mockup blanco si corresponde */}
                                                {predesignedItems[0].garmentColor === '#FFFFFF' ? (
                                                    <img
                                                        src={garmentTypes.find(g => g.id === predesignedItems[0].garmentType)?.baseImage}
                                                        alt={predesignedItems[0].name}
                                                        className="w-full h-full object-cover absolute top-0 left-0"
                                                    />
                                                ) : (
                                                    <img
                                                        src={predesignedItems[0].image}
                                                        alt={predesignedItems[0].name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                                {/* Diseño SVG encima si es blanco */}
                                                {predesignedItems[0].garmentColor === '#FFFFFF' && (
                                                    <img
                                                        src={predesignedItems[0].design.image}
                                                        alt={predesignedItems[0].design.name}
                                                        className="w-full h-full object-contain absolute top-0 left-0"
                                                    />
                                                )}
                                            </div>
                                            <h4 className="text-xs font-light text-black">{predesignedItems[0].name}</h4>
                                            <p className="text-xs text-gray-600">${predesignedItems[0].price.toLocaleString()}</p>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Preview - 40% */}
                            <div className="lg:col-span-2">
                                {/* Usar DesignPreview para consistencia visual y mockup correcto */}
                                <GarmentCanvasPreview
                                    garmentType={selectedGarment}
                                    garmentColor={selectedColor}
                                    selectedDesign={selectedDesign}
                                    designSize={selectedSize}
                                    designPosition={designPosition}
                                    designRotation={designRotation}
                                    editable={true}
                                    onPositionChange={setDesignPosition}
                                    onRotationChange={setDesignRotation}
                                    showBack={false}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <CanvasCheckout
                        design={getCurrentDesign()}
                        onBack={() => setCurrentStep(2)}
                        onComplete={() => {
                            // Guardar en localStorage
                            const savedDesigns = JSON.parse(localStorage.getItem('customDesigns') || '[]');
                            savedDesigns.push({ ...getCurrentDesign(), id: Date.now().toString() });
                            localStorage.setItem('customDesigns', JSON.stringify(savedDesigns));

                            // Volver al inicio
                            setCurrentStep(1);
                            setSelectedGarment(null);
                            setSelectedDesign(null);
                            setSelectedColor('#000000');
                            setSelectedSize(designSizes[1]);
                            setDesignPosition({ x: 50, y: 50 });
                            setDesignRotation(0);
                        }}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <section className="py-24 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-light tracking-[0.2em] text-gray-500">DISEÑA TU PRENDA</span>
                        <span className="text-sm font-light text-gray-500">
                            Paso {currentStep} de {totalSteps}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 h-px">
                        <div
                            className="bg-black h-px transition-all duration-500"
                            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Step Content */}
                <div className="mb-12">
                    {renderStepContent()}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                        className={`flex items-center space-x-2 px-6 py-3 font-light transition-colors ${currentStep === 1
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-600 hover:text-black'
                            }`}
                    >
                        <ChevronLeft className="h-5 w-5" />
                        <span>ANTERIOR</span>
                    </button>

                    {currentStep < totalSteps ? (
                        <button
                            onClick={handleNext}
                            disabled={
                                (currentStep === 1 && !selectedGarment) ||
                                (currentStep === 2 && !selectedDesign)
                            }
                            className={`flex items-center space-x-2 px-8 py-3 font-light transition-colors ${(currentStep === 1 && !selectedGarment) ||
                                (currentStep === 2 && !selectedDesign)
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-black text-white hover:bg-gray-800'
                                }`}
                        >
                            <span>SIGUIENTE</span>
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentStep(3)}
                            className="flex items-center space-x-2 px-8 py-3 bg-black text-white font-light hover:bg-gray-800 transition-colors"
                        >
                            <Check className="h-5 w-5" />
                            <span>FINALIZAR</span>
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default DesignWizard;
