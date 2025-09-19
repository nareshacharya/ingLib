import type { Ingredient } from '../model/types';

export const INGREDIENTS_SEED: Ingredient[] = [
    // ===============================
    // CITRUS FAMILY - Essential Oils
    // ===============================
    {
        id: 'INGR-001',
        name: 'Bergamot Essential Oil (Calabrian)',
        category: 'Essential Oils',
        family: 'Citrus',
        status: 'Active',
        type: 'Natural',
        supplier: 'Givaudan',
        costPerKg: 125.50,
        stock: 150,
        favorite: true,
        casNumber: '8007-75-8',
        ifraLimitPct: 0.4,
        allergens: ['Limonene', 'Linalool', 'Bergapten'],
        updatedAt: '2024-03-15T10:30:00Z'
    },
    // Sub-components of Bergamot
    {
        id: 'INGR-001-A',
        name: 'Bergamot FCF (Furanocoumarin Free)',
        category: 'Essential Oils',
        family: 'Citrus',
        status: 'Active',
        type: 'Natural',
        supplier: 'Givaudan',
        costPerKg: 145.75,
        stock: 75,
        favorite: false,
        casNumber: '8007-75-8',
        ifraLimitPct: 2.0,
        allergens: ['Limonene', 'Linalool'],
        updatedAt: '2024-03-15T10:30:00Z',
        parentId: 'INGR-001'
    },
    {
        id: 'INGR-001-B',
        name: 'Bergamot Expressed (Cold Press)',
        category: 'Essential Oils',
        family: 'Citrus',
        status: 'Active',
        type: 'Natural',
        supplier: 'Givaudan',
        costPerKg: 118.25,
        stock: 95,
        favorite: false,
        casNumber: '8007-75-8',
        ifraLimitPct: 0.4,
        allergens: ['Limonene', 'Linalool', 'Bergapten'],
        updatedAt: '2024-03-15T10:30:00Z',
        parentId: 'INGR-001'
    },

    {
        id: 'INGR-002',
        name: 'Lemon Essential Oil (Sicilian)',
        category: 'Essential Oils',
        family: 'Citrus',
        status: 'Active',
        type: 'Natural',
        supplier: 'Firmenich',
        costPerKg: 89.75,
        stock: 200,
        favorite: true,
        casNumber: '8008-56-8',
        ifraLimitPct: 2.0,
        allergens: ['Limonene', 'Citral'],
        updatedAt: '2024-03-14T14:20:00Z'
    },
    // Sub-components of Lemon
    {
        id: 'INGR-002-A',
        name: 'Lemon Terpenes',
        category: 'Terpenes',
        family: 'Citrus',
        status: 'Active',
        type: 'Natural',
        supplier: 'Firmenich',
        costPerKg: 45.50,
        stock: 300,
        favorite: false,
        casNumber: '68606-81-5',
        ifraLimitPct: 5.0,
        allergens: ['Limonene'],
        updatedAt: '2024-03-14T14:20:00Z',
        parentId: 'INGR-002'
    },
    {
        id: 'INGR-002-B',
        name: 'Lemon Aldehyde (Citral)',
        category: 'Isolates',
        family: 'Citrus',
        status: 'Active',
        type: 'Natural',
        supplier: 'Firmenich',
        costPerKg: 165.30,
        stock: 85,
        favorite: false,
        casNumber: '5392-40-5',
        ifraLimitPct: 0.6,
        allergens: ['Citral'],
        updatedAt: '2024-03-14T14:20:00Z',
        parentId: 'INGR-002'
    },

    {
        id: 'INGR-003',
        name: 'Sweet Orange Essential Oil (Brazilian)',
        category: 'Essential Oils',
        family: 'Citrus',
        status: 'Active',
        type: 'Natural',
        supplier: 'Symrise',
        costPerKg: 75.25,
        stock: 180,
        favorite: true,
        casNumber: '8008-57-9',
        ifraLimitPct: 1.25,
        allergens: ['Limonene'],
        updatedAt: '2024-03-13T16:45:00Z'
    },

    {
        id: 'INGR-004',
        name: 'Grapefruit Essential Oil (Pink)',
        category: 'Essential Oils',
        family: 'Citrus',
        status: 'Active',
        type: 'Natural',
        supplier: 'IFF',
        costPerKg: 95.80,
        stock: 120,
        favorite: false,
        casNumber: '8016-20-4',
        ifraLimitPct: 4.0,
        allergens: ['Limonene'],
        updatedAt: '2024-03-12T09:15:00Z'
    },

    // ===============================
    // FLORAL FAMILY - Precious Flowers
    // ===============================
    {
        id: 'INGR-005',
        name: 'Rose Otto (Bulgarian Rosa Damascena)',
        category: 'Essential Oils',
        family: 'Floral',
        status: 'Active',
        type: 'Natural',
        supplier: 'Givaudan',
        costPerKg: 2850.00,
        stock: 15,
        favorite: true,
        casNumber: '8007-01-0',
        ifraLimitPct: 0.8,
        allergens: ['Citronellol', 'Geraniol', 'Eugenol'],
        updatedAt: '2024-03-11T11:20:00Z'
    },
    // Sub-components of Rose
    {
        id: 'INGR-005-A',
        name: 'Rose Concrete (Bulgarian)',
        category: 'Concretes',
        family: 'Floral',
        status: 'Active',
        type: 'Natural',
        supplier: 'Givaudan',
        costPerKg: 450.00,
        stock: 35,
        favorite: false,
        casNumber: '8007-01-0',
        ifraLimitPct: 2.0,
        allergens: ['Citronellol', 'Geraniol', 'Eugenol'],
        updatedAt: '2024-03-11T11:20:00Z',
        parentId: 'INGR-005'
    },
    {
        id: 'INGR-005-B',
        name: 'Rose Absolute (Bulgarian)',
        category: 'Absolutes',
        family: 'Floral',
        status: 'Active',
        type: 'Natural',
        supplier: 'Givaudan',
        costPerKg: 1250.00,
        stock: 25,
        favorite: true,
        casNumber: '8007-01-0',
        ifraLimitPct: 1.2,
        allergens: ['Citronellol', 'Geraniol', 'Eugenol'],
        updatedAt: '2024-03-11T11:20:00Z',
        parentId: 'INGR-005'
    },
    {
        id: 'INGR-005-C',
        name: 'Phenylethyl Alcohol (Rose Alcohol)',
        category: 'Isolates',
        family: 'Floral',
        status: 'Active',
        type: 'Synthetic',
        supplier: 'Givaudan',
        costPerKg: 85.60,
        stock: 120,
        favorite: false,
        casNumber: '60-12-8',
        ifraLimitPct: 7.0,
        allergens: [],
        updatedAt: '2024-03-11T11:20:00Z',
        parentId: 'INGR-005'
    },

    {
        id: 'INGR-006',
        name: 'Jasmine Sambac Absolute (Indian)',
        category: 'Absolutes',
        family: 'Floral',
        status: 'Limited',
        type: 'Natural',
        supplier: 'Firmenich',
        costPerKg: 3200.00,
        stock: 8,
        favorite: true,
        casNumber: '8022-96-6',
        ifraLimitPct: 0.7,
        allergens: ['Benzyl Acetate', 'Linalool', 'Benzyl Salicylate'],
        updatedAt: '2024-03-10T13:30:00Z'
    },

    {
        id: 'INGR-007',
        name: 'Lavender Essential Oil (French Fine)',
        category: 'Essential Oils',
        family: 'Floral',
        status: 'Active',
        type: 'Natural',
        supplier: 'Symrise',
        costPerKg: 185.60,
        stock: 85,
        favorite: true,
        casNumber: '8000-28-0',
        ifraLimitPct: 0.5,
        allergens: ['Linalool', 'Limonene'],
        updatedAt: '2024-03-09T15:45:00Z'
    },

    {
        id: 'INGR-008',
        name: 'Ylang Ylang Essential Oil (Comoros Extra)',
        category: 'Essential Oils',
        family: 'Floral',
        status: 'Active',
        type: 'Natural',
        supplier: 'IFF',
        costPerKg: 320.75,
        stock: 45,
        favorite: true,
        casNumber: '8006-81-3',
        ifraLimitPct: 0.8,
        allergens: ['Benzyl Acetate', 'Benzyl Salicylate', 'Farnesol'],
        updatedAt: '2024-03-08T14:25:00Z'
    },

    // ===============================
    // WOODY FAMILY - Precious Woods
    // ===============================
    {
        id: 'INGR-009',
        name: 'Sandalwood Essential Oil (Australian)',
        category: 'Essential Oils',
        family: 'Woody',
        status: 'Active',
        type: 'Natural',
        supplier: 'IFF',
        costPerKg: 1450.00,
        stock: 25,
        favorite: true,
        casNumber: '8006-87-9',
        ifraLimitPct: 3.0,
        allergens: [],
        updatedAt: '2024-03-08T10:15:00Z'
    },
    // Sub-components of Sandalwood
    {
        id: 'INGR-009-A',
        name: 'Santalol (Alpha)',
        category: 'Isolates',
        family: 'Woody',
        status: 'Active',
        type: 'Natural',
        supplier: 'IFF',
        costPerKg: 875.00,
        stock: 45,
        favorite: false,
        casNumber: '115-71-9',
        ifraLimitPct: 5.0,
        allergens: [],
        updatedAt: '2024-03-08T10:15:00Z',
        parentId: 'INGR-009'
    },
    {
        id: 'INGR-009-B',
        name: 'Santalol (Beta)',
        category: 'Isolates',
        family: 'Woody',
        status: 'Active',
        type: 'Natural',
        supplier: 'IFF',
        costPerKg: 625.50,
        stock: 35,
        favorite: false,
        casNumber: '77-42-9',
        ifraLimitPct: 5.0,
        allergens: [],
        updatedAt: '2024-03-08T10:15:00Z',
        parentId: 'INGR-009'
    },

    {
        id: 'INGR-010',
        name: 'Cedarwood Essential Oil (Virginia)',
        category: 'Essential Oils',
        family: 'Woody',
        status: 'Active',
        type: 'Natural',
        supplier: 'Givaudan',
        costPerKg: 45.30,
        stock: 350,
        favorite: false,
        casNumber: '8000-27-9',
        ifraLimitPct: 4.0,
        allergens: [],
        updatedAt: '2024-03-07T12:00:00Z'
    },

    {
        id: 'INGR-011',
        name: 'Vetiver Essential Oil (Haitian)',
        category: 'Essential Oils',
        family: 'Woody',
        status: 'Active',
        type: 'Natural',
        supplier: 'Firmenich',
        costPerKg: 285.90,
        stock: 65,
        favorite: true,
        casNumber: '8016-96-4',
        ifraLimitPct: 5.0,
        allergens: [],
        updatedAt: '2024-03-06T16:30:00Z'
    },

    // ===============================
    // ORIENTAL/AMBERY FAMILY
    // ===============================
    {
        id: 'INGR-012',
        name: 'Ambergris Tincture (Genuine)',
        category: 'Tinctures',
        family: 'Ambery',
        status: 'Limited',
        type: 'Natural',
        supplier: 'Exclusive Sources',
        costPerKg: 15000.00,
        stock: 2,
        favorite: true,
        casNumber: '8038-65-1',
        ifraLimitPct: 10.0,
        allergens: [],
        updatedAt: '2024-03-05T09:45:00Z'
    },

    {
        id: 'INGR-013',
        name: 'Benzoin Resinoid (Sumatra)',
        category: 'Resinoids',
        family: 'Balsamic',
        status: 'Active',
        type: 'Natural',
        supplier: 'IFF',
        costPerKg: 195.30,
        stock: 40,
        favorite: false,
        casNumber: '9000-72-0',
        ifraLimitPct: 6.0,
        allergens: ['Benzyl Cinnamate', 'Cinnamic Acid'],
        updatedAt: '2024-03-13T11:30:00Z'
    },

    {
        id: 'INGR-014',
        name: 'Labdanum Absolute (Cistus)',
        category: 'Absolutes',
        family: 'Ambery',
        status: 'Active',
        type: 'Natural',
        supplier: 'Symrise',
        costPerKg: 420.85,
        stock: 28,
        favorite: true,
        casNumber: '8016-26-0',
        ifraLimitPct: 1.0,
        allergens: [],
        updatedAt: '2024-03-04T13:15:00Z'
    },

    // ===============================
    // SYNTHETIC AROMATICS - Modern Molecules
    // ===============================
    {
        id: 'INGR-015',
        name: 'Iso E Super',
        category: 'Aromatic Compounds',
        family: 'Woody',
        status: 'Active',
        type: 'Synthetic',
        supplier: 'IFF',
        costPerKg: 24.50,
        stock: 500,
        favorite: true,
        casNumber: '54464-57-2',
        ifraLimitPct: 21.4,
        allergens: [],
        updatedAt: '2024-03-02T13:15:00Z'
    },
    // Sub-grades of Iso E Super
    {
        id: 'INGR-015-A',
        name: 'Iso E Super (Tech Grade)',
        category: 'Aromatic Compounds',
        family: 'Woody',
        status: 'Active',
        type: 'Synthetic',
        supplier: 'IFF',
        costPerKg: 18.75,
        stock: 750,
        favorite: false,
        casNumber: '54464-57-2',
        ifraLimitPct: 21.4,
        allergens: [],
        updatedAt: '2024-03-02T13:15:00Z',
        parentId: 'INGR-015'
    },
    {
        id: 'INGR-015-B',
        name: 'Iso E Super (Extra Pure)',
        category: 'Aromatic Compounds',
        family: 'Woody',
        status: 'Active',
        type: 'Synthetic',
        supplier: 'IFF',
        costPerKg: 32.80,
        stock: 250,
        favorite: false,
        casNumber: '54464-57-2',
        ifraLimitPct: 21.4,
        allergens: [],
        updatedAt: '2024-03-02T13:15:00Z',
        parentId: 'INGR-015'
    },

    {
        id: 'INGR-016',
        name: 'Hedione (Methyl Dihydrojasmonate)',
        category: 'Aromatic Compounds',
        family: 'Floral',
        status: 'Active',
        type: 'Synthetic',
        supplier: 'Firmenich',
        costPerKg: 89.60,
        stock: 320,
        favorite: true,
        casNumber: '24851-98-7',
        ifraLimitPct: 10.0,
        allergens: [],
        updatedAt: '2024-03-01T15:00:00Z'
    },

    {
        id: 'INGR-017',
        name: 'Ambroxan',
        category: 'Aromatic Compounds',
        family: 'Ambery',
        status: 'Active',
        type: 'Synthetic',
        supplier: 'Givaudan',
        costPerKg: 125.80,
        stock: 180,
        favorite: true,
        casNumber: '6790-58-5',
        ifraLimitPct: 10.0,
        allergens: [],
        updatedAt: '2024-02-29T10:30:00Z'
    },

    {
        id: 'INGR-018',
        name: 'Galaxolide (HHCB)',
        category: 'Musk Compounds',
        family: 'Musky',
        status: 'Active',
        type: 'Synthetic',
        supplier: 'IFF',
        costPerKg: 45.25,
        stock: 420,
        favorite: false,
        casNumber: '1222-05-5',
        ifraLimitPct: 1.8,
        allergens: [],
        updatedAt: '2024-02-28T14:45:00Z'
    },

    {
        id: 'INGR-019',
        name: 'Cashmeran',
        category: 'Aromatic Compounds',
        family: 'Woody',
        status: 'Active',
        type: 'Synthetic',
        supplier: 'IFF',
        costPerKg: 78.40,
        stock: 250,
        favorite: true,
        casNumber: '33704-61-9',
        ifraLimitPct: 1.8,
        allergens: [],
        updatedAt: '2024-03-16T09:00:00Z'
    },

    // ===============================
    // SPICY FAMILY
    // ===============================
    {
        id: 'INGR-020',
        name: 'Black Pepper Essential Oil (Madagascar)',
        category: 'Essential Oils',
        family: 'Spicy',
        status: 'Active',
        type: 'Natural',
        supplier: 'Symrise',
        costPerKg: 125.75,
        stock: 95,
        favorite: false,
        casNumber: '8006-82-4',
        ifraLimitPct: 1.0,
        allergens: ['Limonene'],
        updatedAt: '2024-03-06T14:30:00Z'
    },

    {
        id: 'INGR-021',
        name: 'Cinnamon Essential Oil (Ceylon)',
        category: 'Essential Oils',
        family: 'Spicy',
        status: 'Limited',
        type: 'Natural',
        supplier: 'Firmenich',
        costPerKg: 165.40,
        stock: 45,
        favorite: false,
        casNumber: '8015-91-6',
        ifraLimitPct: 0.01,
        allergens: ['Cinnamaldehyde', 'Eugenol'],
        updatedAt: '2024-03-05T16:20:00Z'
    },

    {
        id: 'INGR-022',
        name: 'Clove Bud Essential Oil',
        category: 'Essential Oils',
        family: 'Spicy',
        status: 'Active',
        type: 'Natural',
        supplier: 'Givaudan',
        costPerKg: 95.30,
        stock: 75,
        favorite: false,
        casNumber: '8000-34-8',
        ifraLimitPct: 0.5,
        allergens: ['Eugenol'],
        updatedAt: '2024-03-04T12:15:00Z'
    },

    // ===============================
    // FRESH/GREEN FAMILY
    // ===============================
    {
        id: 'INGR-023',
        name: 'Eucalyptus Essential Oil (Globulus)',
        category: 'Essential Oils',
        family: 'Fresh',
        status: 'Active',
        type: 'Natural',
        supplier: 'IFF',
        costPerKg: 38.95,
        stock: 280,
        favorite: false,
        casNumber: '8000-48-4',
        ifraLimitPct: 5.4,
        allergens: [],
        updatedAt: '2024-03-04T11:45:00Z'
    },

    {
        id: 'INGR-024',
        name: 'Peppermint Essential Oil (American)',
        category: 'Essential Oils',
        family: 'Fresh',
        status: 'Active',
        type: 'Natural',
        supplier: 'Symrise',
        costPerKg: 85.20,
        stock: 150,
        favorite: true,
        casNumber: '8006-90-4',
        ifraLimitPct: 1.0,
        allergens: ['Limonene', 'Linalool'],
        updatedAt: '2024-03-03T09:30:00Z'
    },

    {
        id: 'INGR-025',
        name: 'Violet Leaf Absolute',
        category: 'Absolutes',
        family: 'Green',
        status: 'Active',
        type: 'Natural',
        supplier: 'Firmenich',
        costPerKg: 1850.00,
        stock: 18,
        favorite: false,
        casNumber: '8024-08-8',
        ifraLimitPct: 0.2,
        allergens: [],
        updatedAt: '2024-03-15T17:30:00Z'
    },

    // ===============================
    // GOURMAND FAMILY
    // ===============================
    {
        id: 'INGR-026',
        name: 'Vanilla Extract (Madagascar Bourbon)',
        category: 'Extracts',
        family: 'Gourmand',
        status: 'Active',
        type: 'Natural',
        supplier: 'Givaudan',
        costPerKg: 320.75,
        stock: 65,
        favorite: true,
        casNumber: '8024-06-4',
        ifraLimitPct: 5.0,
        allergens: [],
        updatedAt: '2024-03-14T08:45:00Z'
    },
    // Sub-components of Vanilla
    {
        id: 'INGR-026-A',
        name: 'Vanillin (Natural ex-Vanilla)',
        category: 'Isolates',
        family: 'Gourmand',
        status: 'Active',
        type: 'Natural',
        supplier: 'Givaudan',
        costPerKg: 485.20,
        stock: 85,
        favorite: false,
        casNumber: '121-33-5',
        ifraLimitPct: 8.0,
        allergens: [],
        updatedAt: '2024-03-14T08:45:00Z',
        parentId: 'INGR-026'
    },
    {
        id: 'INGR-026-B',
        name: 'Ethyl Vanillin',
        category: 'Aromatic Compounds',
        family: 'Gourmand',
        status: 'Active',
        type: 'Synthetic',
        supplier: 'Symrise',
        costPerKg: 125.60,
        stock: 150,
        favorite: false,
        casNumber: '121-32-4',
        ifraLimitPct: 8.0,
        allergens: [],
        updatedAt: '2024-03-14T08:45:00Z',
        parentId: 'INGR-026'
    },

    {
        id: 'INGR-027',
        name: 'Tonka Bean Absolute',
        category: 'Absolutes',
        family: 'Gourmand',
        status: 'Limited',
        type: 'Natural',
        supplier: 'Firmenich',
        costPerKg: 680.45,
        stock: 22,
        favorite: true,
        casNumber: '8046-22-8',
        ifraLimitPct: 0.1,
        allergens: ['Coumarin'],
        updatedAt: '2024-03-12T14:15:00Z'
    },

    // ===============================
    // RESINOUS/BALSAMIC FAMILY
    // ===============================
    {
        id: 'INGR-028',
        name: 'Frankincense Essential Oil (Boswellia Carterii)',
        category: 'Essential Oils',
        family: 'Resinous',
        status: 'Active',
        type: 'Natural',
        supplier: 'Symrise',
        costPerKg: 285.50,
        stock: 45,
        favorite: true,
        casNumber: '8016-36-2',
        ifraLimitPct: 0.8,
        allergens: ['Limonene', 'Alpha-Pinene'],
        updatedAt: '2024-02-25T12:15:00Z'
    },

    {
        id: 'INGR-029',
        name: 'Myrrh Essential Oil (Commiphora Myrrha)',
        category: 'Essential Oils',
        family: 'Resinous',
        status: 'Active',
        type: 'Natural',
        supplier: 'IFF',
        costPerKg: 198.75,
        stock: 35,
        favorite: false,
        casNumber: '8016-37-3',
        ifraLimitPct: 1.2,
        allergens: [],
        updatedAt: '2024-02-24T15:30:00Z'
    },

    // ===============================
    // RESTRICTED/LEGACY MATERIALS
    // ===============================
    {
        id: 'INGR-030',
        name: 'Oakmoss Absolute (Evernia Prunastri)',
        category: 'Absolutes',
        family: 'Woody',
        status: 'Limited',
        type: 'Natural',
        supplier: 'Givaudan',
        costPerKg: 450.00,
        stock: 12,
        favorite: false,
        casNumber: '9000-50-4',
        ifraLimitPct: 0.1,
        allergens: ['Atranol', 'Chloratranol'],
        updatedAt: '2024-02-27T11:20:00Z'
    },

    {
        id: 'INGR-031',
        name: 'Nitro Musk (Legacy Stock)',
        category: 'Musk Compounds',
        family: 'Musky',
        status: 'Inactive',
        type: 'Synthetic',
        supplier: 'Legacy Stock',
        costPerKg: 0.00,
        stock: 0,
        favorite: false,
        casNumber: '81-15-2',
        ifraLimitPct: 0.0,
        allergens: [],
        updatedAt: '2024-02-26T16:00:00Z'
    },

    // ===============================
    // AQUATIC/MARINE FAMILY
    // ===============================
    {
        id: 'INGR-032',
        name: 'Calone (Watermelon Ketone)',
        category: 'Aromatic Compounds',
        family: 'Aquatic',
        status: 'Active',
        type: 'Synthetic',
        supplier: 'Firmenich',
        costPerKg: 165.80,
        stock: 95,
        favorite: true,
        casNumber: '28940-11-6',
        ifraLimitPct: 1.0,
        allergens: [],
        updatedAt: '2024-03-18T10:45:00Z'
    },

    {
        id: 'INGR-033',
        name: 'Floralozone',
        category: 'Aromatic Compounds',
        family: 'Aquatic',
        status: 'Active',
        type: 'Synthetic',
        supplier: 'IFF',
        costPerKg: 285.60,
        stock: 75,
        favorite: false,
        casNumber: '67801-20-1',
        ifraLimitPct: 0.1,
        allergens: [],
        updatedAt: '2024-03-17T14:20:00Z'
    }
];

// Extract unique categories, families, and suppliers from the ingredients data
export const CATEGORIES = Array.from(new Set(INGREDIENTS_SEED.map(ingredient => ingredient.category))).sort();

export const FAMILIES = Array.from(new Set(INGREDIENTS_SEED.map(ingredient => ingredient.family))).sort();

export const SUPPLIERS = Array.from(new Set(INGREDIENTS_SEED.map(ingredient => ingredient.supplier))).sort();
