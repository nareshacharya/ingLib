// Filter option constants for the ingredient library
export interface FilterOption {
    value: string;
    label: string;
    count?: number;
}

export const categoryOptions: FilterOption[] = [
    { value: "Essential Oils", label: "Essential Oils", count: 8 },
    { value: "Fragrance", label: "Fragrance", count: 6 },
    { value: "Carrier Oils", label: "Carrier Oils", count: 4 },
    { value: "Botanical Extracts", label: "Botanical Extracts", count: 3 },
    { value: "Synthetic Compounds", label: "Synthetic Compounds", count: 4 },
];

export const statusOptions: FilterOption[] = [
    { value: "Active", label: "Active", count: 20 },
    { value: "Inactive", label: "Inactive", count: 5 },
];

export const typeOptions: FilterOption[] = [
    { value: "Natural", label: "Natural", count: 15 },
    { value: "Synthetic", label: "Synthetic", count: 10 },
];

export const supplierOptions: FilterOption[] = [
    { value: "Firmenich", label: "Firmenich", count: 8 },
    { value: "Givaudan", label: "Givaudan", count: 7 },
    { value: "IFF", label: "IFF", count: 5 },
    { value: "Symrise", label: "Symrise", count: 5 },
];

export const stockLevelOptions: FilterOption[] = [
    { value: "High", label: "High Stock (>150kg)", count: 12 },
    { value: "Medium", label: "Medium Stock (50-150kg)", count: 8 },
    { value: "Low", label: "Low Stock (<50kg)", count: 4 },
    { value: "OutOfStock", label: "Out of Stock", count: 1 },
];
