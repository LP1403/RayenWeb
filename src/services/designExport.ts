import { CustomDesign } from '../types/Design';
import { getGarmentTemplate } from '../data/garmentImages';

const CANVAS_WIDTH = 600;
const PRINTABLE_INSET = { top: 0.15, bottom: 0.20, left: 0.16, right: 0.16 };

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
    });
}

/**
 * Renders garment + design onto an offscreen canvas and returns a PNG data URL.
 * Mirrors the CSS transform logic used in DesignPreview so the result matches
 * what the user sees in the editor.
 */
export async function composeDesignPreview(design: CustomDesign): Promise<string> {
    try {
        const canvasW = CANVAS_WIDTH;
        const canvasH = Math.round(CANVAS_WIDTH * (4 / 3));

        const canvas = document.createElement('canvas');
        canvas.width = canvasW;
        canvas.height = canvasH;
        const ctx = canvas.getContext('2d');
        if (!ctx) return '';

        // ── Garment ──────────────────────────────────────────────────────────
        const colorName =
            design.garmentColor === '#FFFFFF' ? 'blanco' :
            design.garmentColor === '#000000' ? 'negro' :
            design.garmentColor === '#6B7280' ? 'gris' : 'blanco';

        const garmentUrl = getGarmentTemplate(design.garmentType, colorName, 'front');
        const garmentImg = await loadImage(garmentUrl);
        ctx.drawImage(garmentImg, 0, 0, canvasW, canvasH);

        // ── Design ────────────────────────────────────────────────────────────
        if (!design.selectedDesign) return canvas.toDataURL('image/png', 0.9);

        const designImg = await loadImage(design.selectedDesign.image);

        // Replicate DesignLayer sizing: width = 28% * sizeScale * userScale
        const sizeScale =
            design.designSize === 'small' ? 0.8 :
            design.designSize === 'large' ? 2.0 : 1.5;

        const printableWidth = (1 - PRINTABLE_INSET.left - PRINTABLE_INSET.right) * canvasW;
        const printableHeight = (1 - PRINTABLE_INSET.top - PRINTABLE_INSET.bottom) * canvasH;

        // DesignLayer's CSS width = 28% * sizeScale of container, then scaled by user scale
        const baseWidthPx = canvasW * 0.28 * sizeScale;
        const scaledWidth = baseWidthPx * design.designScale;
        const aspectRatio = designImg.naturalWidth / designImg.naturalHeight;
        const scaledHeight = scaledWidth / aspectRatio;

        // Position: designPosition is 0–100% of container
        const cx = (design.designPosition.x / 100) * canvasW;
        const cy = (design.designPosition.y / 100) * canvasH;

        // Clamp to printable zone so the canvas output is consistent with editor
        const minX = PRINTABLE_INSET.left * canvasW;
        const maxX = (1 - PRINTABLE_INSET.right) * canvasW;
        const minY = PRINTABLE_INSET.top * canvasH;
        const maxY = (1 - PRINTABLE_INSET.bottom) * canvasH;
        const clampedX = Math.max(minX, Math.min(maxX, cx));
        const clampedY = Math.max(minY, Math.min(maxY, cy));

        // Suppress unused variable linting warnings
        void printableWidth;
        void printableHeight;

        ctx.save();
        ctx.translate(clampedX, clampedY);
        ctx.rotate((design.designRotation * Math.PI) / 180);
        if (design.designFlipped) ctx.scale(-1, 1);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(designImg, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
        ctx.restore();

        return canvas.toDataURL('image/png', 0.9);
    } catch (err) {
        console.error('[designExport] composeDesignPreview failed:', err);
        return '';
    }
}
