export const resizeImageFile = (
  file,
  { maxSize = 900, quality = 0.72, mimeType = "image/jpeg" } = {},
) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const width = Math.round(image.width * scale);
        const height = Math.round(image.height * scale);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);

        resolve(canvas.toDataURL(mimeType, quality));
      };

      image.onerror = () => reject(new Error("Unable to read this image."));
      image.src = reader.result;
    };

    reader.onerror = () => reject(new Error("Unable to load this image."));
    reader.readAsDataURL(file);
  });
