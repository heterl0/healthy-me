export type JsPdfInstance = {
  internal: { pageSize: { getWidth: () => number; getHeight: () => number } };
  addPage: () => void;
  addImage: (
    imageData: string,
    format: "JPEG",
    x: number,
    y: number,
    width: number,
    height: number,
  ) => void;
  save: (filename: string) => void;
};

export type JsPdfConstructor = new (options: {
  orientation: "p";
  unit: "mm";
  format: "a4";
  compress: true;
}) => JsPdfInstance;
