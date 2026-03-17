import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Upload } from 'lucide-react';
import { garmentTypes, designs, designSizes } from '../data/designData';
import { GarmentType, Design, DesignSize, CustomDesign } from '../types/Design';
import DesignPreview from './DesignPreview';
import DesignCheckout from './DesignCheckout';
import CustomDesignUpload from './CustomDesignUpload';

const DesignWizard: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedGarment, setSelectedGarment] = useState<GarmentType | null>(null);
    const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
    const [selectedColor, setSelectedColor] = useState<string>('#FFFFFF');
    const [customDesignUrl, setCustomDesignUrl] = useState<string | null>(null);
    const [showCustomUpload, setShowCustomUpload] = useState(false);
    const [selectedSize, setSelectedSize] = useState<DesignSize>(designSizes[1]);

    // Design transform state (lifted from DesignPreview for checkout access)
    const [designPosition, setDesignPosition] = useState({ x: 50, y: 34 });
    const [designRotation, setDesignRotation] = useState(0);
    const [designScale, setDesignScale] = useState(1);
    const [designFlipped, setDesignFlipped] = useState(false);

    const availableColors = ['#FFFFFF', '#000000'];

    const handleGarmentSelect = (garment: GarmentType) => {
        setSelectedGarment(garment);
        setSelectedColor(availableColors.includes('#FFFFFF') ? '#FFFFFF' : availableColors[0] || '');
        setCurrentStep(2);
    };

    const handleCustomDesignUpload = (file: File, previewUrl: string) => {
        setCustomDesignUrl(previewUrl);
        const customDesign: Design = {
            id: Date.now(),
            name: file.name,
            image: previewUrl,
            category: 'graphic',
            customScale: 1.0,
            isCustom: true,
            originalFile: file,
        };
        setSelectedDesign(customDesign);
        setShowCustomUpload(false);
    };

    const handleCustomDesignRemove = () => {
        if (customDesignUrl) URL.revokeObjectURL(customDesignUrl);
        setCustomDesignUrl(null);
        setSelectedDesign(null);
        setShowCustomUpload(false);
    };

    const getCurrentDesign = (): CustomDesign => ({
        id: `design-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        garmentType: selectedGarment?.id || '',
        garmentColor: selectedColor,
        selectedDesign,
        designSize: selectedSize.id,
        designPosition,
        designRotation,
        designScale,
        designFlipped,
        price: 0,
        createdAt: new Date(),
    });

    const totalSteps = 3;

    const handleNext = () => {
        if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
    };

    const handlePrevious = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-light text-black mb-4">Elige tu prenda</h2>
                            <p className="text-gray-600 font-light">
                                Selecciona el tipo de prenda que quieres personalizar
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {garmentTypes.filter((g) => g.baseImage).map((garment) => (
                                <button
                                    key={garment.id}
                                    onClick={() => handleGarmentSelect(garment)}
                                    className={`p-8 border-2 transition-all duration-300 ${
                                        selectedGarment?.id === garment.id
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
                            <p className="text-gray-600 font-light">
                                Ajusta el tamaño, posición y color de tu prenda
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                            {/* Left panel: design picker + options */}
                            <div className="lg:col-span-3 space-y-6">
                                <div>
                                    <h3 className="text-lg font-light text-black mb-4">Selecciona un diseño</h3>

                                    {/* Custom upload toggle */}
                                    <div className="mb-4">
                                        <button
                                            onClick={() => setShowCustomUpload(!showCustomUpload)}
                                            className={`w-full p-4 border-2 border-dashed transition-all duration-300 ${
                                                showCustomUpload
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex items-center justify-center space-x-2">
                                                <Upload className="h-5 w-5 text-gray-400" />
                                                <span className="text-sm font-medium text-gray-700">
                                                    {showCustomUpload
                                                        ? 'Ocultar subida personalizada'
                                                        : 'Subir tu propio diseño'}
                                                </span>
                                            </div>
                                        </button>
                                    </div>

                                    {showCustomUpload && (
                                        <div className="mb-6">
                                            <CustomDesignUpload
                                                onDesignUpload={handleCustomDesignUpload}
                                                onRemove={handleCustomDesignRemove}
                                                className="mb-4"
                                            />
                                        </div>
                                    )}

                                    {/* Predefined designs */}
                                    <div className="grid grid-cols-3 gap-4">
                                        {designs.map((design) => (
                                            <button
                                                key={design.id}
                                                onClick={() => {
                                                    setSelectedDesign(design);
                                                    setShowCustomUpload(false);
                                                }}
                                                className={`p-3 border-2 transition-all duration-300 ${
                                                    selectedDesign?.id === design.id
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
                                                <h4 className="text-xs font-light text-black text-center">
                                                    {design.name}
                                                </h4>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Color picker */}
                                <div>
                                    <h3 className="text-lg font-light text-black mb-4">Color de la prenda</h3>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setSelectedColor('#FFFFFF')}
                                            className={`w-16 h-16 border-2 transition-all duration-300 ${
                                                selectedColor === '#FFFFFF'
                                                    ? 'border-black scale-110'
                                                    : 'border-gray-300'
                                            }`}
                                            style={{ backgroundColor: '#FFFFFF' }}
                                            title="Blanco"
                                        />
                                        <button
                                            onClick={() => setSelectedColor('#000000')}
                                            className={`w-16 h-16 border-2 transition-all duration-300 ${
                                                selectedColor === '#000000'
                                                    ? 'border-black scale-110'
                                                    : 'border-gray-300'
                                            }`}
                                            style={{ backgroundColor: '#000000' }}
                                            title="Negro"
                                        />
                                    </div>
                                </div>

                                {/* Design size */}
                                <div>
                                    <h3 className="text-lg font-light text-black mb-4">Tamaño base del diseño</h3>
                                    <div className="flex gap-3">
                                        {designSizes.map((size) => (
                                            <button
                                                key={size.id}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-4 py-2 border font-light transition-colors text-sm ${
                                                    selectedSize.id === size.id
                                                        ? 'border-black bg-black text-white'
                                                        : 'border-gray-300 text-gray-600 hover:border-black'
                                                }`}
                                            >
                                                {size.name}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-3 text-xs text-gray-500">
                                        <p>• Chico: ~10×10 cm · Mediano: ~20×20 cm · Grande: ~40×40 cm</p>
                                        <p className="mt-1 text-gray-400">
                                            Usa el control de escala en la previsualización para ajuste fino.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right panel: live preview */}
                            <div className="lg:col-span-2">
                                <DesignPreview
                                    garmentType={selectedGarment}
                                    garmentColor={selectedColor}
                                    selectedDesign={selectedDesign}
                                    designSize={selectedSize}
                                    designPosition={designPosition}
                                    designRotation={designRotation}
                                    designScale={designScale}
                                    designFlipped={designFlipped}
                                    onPositionChange={setDesignPosition}
                                    onRotationChange={setDesignRotation}
                                    onScaleChange={setDesignScale}
                                    onFlipChange={setDesignFlipped}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <DesignCheckout
                        design={getCurrentDesign()}
                        onBack={() => setCurrentStep(2)}
                        onComplete={() => {
                            const savedDesigns = JSON.parse(
                                localStorage.getItem('customDesigns') || '[]',
                            );
                            savedDesigns.push({ ...getCurrentDesign(), id: Date.now().toString() });
                            localStorage.setItem('customDesigns', JSON.stringify(savedDesigns));

                            setCurrentStep(1);
                            setSelectedGarment(null);
                            setSelectedDesign(null);
                            setSelectedColor('#FFFFFF');
                            setSelectedSize(designSizes[1]);
                            setDesignPosition({ x: 50, y: 34 });
                            setDesignRotation(0);
                            setDesignScale(1);
                            setDesignFlipped(false);
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
                {/* Progress bar */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-light tracking-[0.2em] text-gray-500">
                            DISEÑA TU PRENDA
                        </span>
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

                {/* Step content */}
                <div className="mb-12">{renderStepContent()}</div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                        className={`flex items-center space-x-2 px-6 py-3 font-light transition-colors ${
                            currentStep === 1
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
                            className={`flex items-center space-x-2 px-8 py-3 font-light transition-colors ${
                                (currentStep === 1 && !selectedGarment) ||
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
