export const laplacianFilter = (pixels, width, height) => {
    const kernel = [
        [-1, -1, -1],
        [-1, 8, -1],
        [-1, -1, -1],
    ];
    const side = Math.floor(kernel.length / 2.0);

    const output = new Uint8ClampedArray(pixels.length);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r = 0,
                g = 0,
                b = 0;
            for (let ky = -side; ky <= side; ky++) {
                for (let kx = -side; kx <= side; kx++) {
                    const yy = Math.min(height - 1, Math.max(0, y + ky));
                    const xx = Math.min(width - 1, Math.max(0, x + kx));
                    const weight = kernel[ky + side][kx + side];
                    const index = (yy * width + xx) * 4;
                    r += pixels[index] * weight;
                    g += pixels[index + 1] * weight;
                    b += pixels[index + 2] * weight;
                }
            }
            const idx = (y * width + x) * 4;
            output[idx] = r;
            output[idx + 1] = g;
            output[idx + 2] = b;
            output[idx + 3] = pixels[idx + 3];
        }
    }
    return output;
};
