interface t_ExtraProperties {
    title: string;
    price: number;
    thumbnail: string;
};
// Se tiene q pasar como un objeto y crear dinamicamente el typado
const ExtraProperties = [
    "title",
    "price",
    "thumbnail",
];

export type { t_ExtraProperties };
export default ExtraProperties;
