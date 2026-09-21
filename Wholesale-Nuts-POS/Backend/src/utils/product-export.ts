import { abbreviateUnit, formatQtyWithUnit } from './units';

export const PRODUCT_EXPORT_COLUMN_LABELS: Record<string, string> = {
    product_id: 'Product ID',
    product_code: 'Product Code',
    product_name: 'Product Name',
    units: 'Units',
    unit_name: 'Unit Name',
    unit_code: 'Unit Code',
    sku: 'SKU',
    barcode: 'Barcode',
    description: 'Description',
    hs_code: 'PCT / HS Code',
    purchase_rate: 'Purchase Rate',
    sales_rate_exc: 'Sales Rate (Exc Tax/Discount)',
    sales_rate_inc: 'Sales Rate (Inc Tax/Discount)',
    discount_amount: 'Discount Amount',
    category_id: 'Category ID',
    category_name: 'Category',
    category_code: 'Category Code',
    subcategory_id: 'Subcategory ID',
    subcategory_name: 'Subcategory',
    subcategory_code: 'Subcategory Code',
    unit_id: 'Unit ID',
    tax_id: 'Tax ID',
    tax_name: 'Tax',
    tax_code: 'Tax Code',
    tax_percentage: 'Tax Percentage',
    supplier_id: 'Supplier ID',
    supplier_name: 'Supplier',
    supplier_code: 'Supplier Code',
    brand_id: 'Brand ID',
    brand_name: 'Brand',
    brand_code: 'Brand Code',
    color_id: 'Color ID',
    color_name: 'Color',
    color_code: 'Color Code',
    size_id: 'Size ID',
    size_name: 'Size',
    size_code: 'Size Code',
    min_qty: 'Min Quantity',
    max_qty: 'Max Quantity',
    current_stock: 'Current Stock',
    reserved_stock: 'Reserved Stock',
    available_stock: 'Available Stock',
    minimum_stock: 'Minimum Stock',
    maximum_stock: 'Maximum Stock',
    is_active: 'Active?',
    display_on_pos: 'Display On POS?',
    is_batch: 'Batch Item?',
    auto_fill_on_demand_sheet: 'Auto Fill On Demand Sheet?',
    non_inventory_item: 'Non Inventory Item?',
    is_deal: 'Deal Item?',
    is_featured: 'Featured?',
    has_images: 'Has Images?',
    first_image_url: 'First Image URL',
    created_at: 'Created At',
    updated_at: 'Updated At',
};

export const PRODUCT_EXPORT_COLUMN_KEYS = Object.keys(PRODUCT_EXPORT_COLUMN_LABELS);

const UNIT_COLUMN_KEYS = ['units', 'unit_name', 'unit_code'] as const;

type NamedRef = { id?: string; name?: string | null; code?: string | null; percentage?: unknown } | null | undefined;

export type ProductExportSource = {
    id: string;
    code: string;
    name: string;
    sku?: string | null;
    description?: string | null;
    pct_or_hs_code?: string | null;
    purchase_rate?: unknown;
    sales_rate_exc_dis_and_tax?: unknown;
    sales_rate_inc_dis_and_tax?: unknown;
    discount_amount?: unknown;
    category_id: string;
    subcategory_id?: string | null;
    unit_id: string;
    tax_id?: string | null;
    supplier_id?: string | null;
    brand_id?: string | null;
    color_id?: string | null;
    size_id?: string | null;
    min_qty?: number | null;
    max_qty?: number | null;
    is_active: boolean;
    display_on_pos: boolean;
    is_batch: boolean;
    auto_fill_on_demand_sheet: boolean;
    non_inventory_item: boolean;
    is_deal: boolean;
    is_featured: boolean;
    has_images: boolean;
    created_at: Date;
    updated_at: Date;
    category?: NamedRef;
    subcategory?: NamedRef;
    unit?: NamedRef;
    tax?: NamedRef;
    supplier?: NamedRef;
    brand?: NamedRef;
    color?: NamedRef;
    size?: NamedRef;
    ProductImage?: Array<{ image?: string | null }>;
    stock?: Array<{
        current_quantity?: unknown;
        reserved_quantity?: unknown;
        minimum_quantity?: unknown;
        maximum_quantity?: unknown;
    }>;
};

export function formatProductUnits(
    product: Pick<ProductExportSource, 'unit'> & { unitFallback?: NamedRef }
): string {
    const unit = product.unit || product.unitFallback;
    const name = (unit?.name || '').trim();
    const code = (unit?.code || '').trim();
    const short = abbreviateUnit(name || code);
    if (name && short && short.toLowerCase() !== name.toLowerCase()) {
        return `${name} (${short})`;
    }
    return name || short || code || '';
}

export function parseRequestedColumns(raw: unknown): string[] {
    const requestedColumnsRaw = typeof raw === 'string' ? raw : '';
    const requestedColumns = requestedColumnsRaw
        .split(',')
        .map((key) => key.trim())
        .filter(Boolean);

    const selectedColumns = requestedColumns.length
        ? requestedColumns.filter((key) => PRODUCT_EXPORT_COLUMN_KEYS.includes(key))
        : [...PRODUCT_EXPORT_COLUMN_KEYS];

    return ensureUnitColumns(selectedColumns);
}

export function ensureUnitColumns(selectedColumns: string[]): string[] {
    const withoutUnitKeys = selectedColumns.filter(
        (key) => !UNIT_COLUMN_KEYS.includes(key as (typeof UNIT_COLUMN_KEYS)[number])
    );
    const insertAt = Math.max(withoutUnitKeys.indexOf('product_name') + 1, 0);
    withoutUnitKeys.splice(insertAt, 0, ...UNIT_COLUMN_KEYS);
    return withoutUnitKeys;
}

export function buildProductExportValues(
    product: ProductExportSource,
    unitFallback?: NamedRef
): Record<string, string | number | boolean> {
    const unit = product.unit || unitFallback;
    const stock = product.stock || [];
    const totalCurrentStock = stock.reduce(
        (sum, item) => sum + Number(item.current_quantity ?? 0),
        0
    );
    const totalReservedStock = stock.reduce(
        (sum, item) => sum + Number(item.reserved_quantity ?? 0),
        0
    );
    const totalMinimumStock = stock.reduce(
        (sum, item) => sum + Number(item.minimum_quantity ?? 0),
        0
    );
    const totalMaximumStock = stock.reduce(
        (sum, item) => sum + Number(item.maximum_quantity ?? 0),
        0
    );

    return {
        product_id: product.id,
        product_code: product.code,
        product_name: product.name,
        units: formatProductUnits({ unit, unitFallback }),
        unit_name: (unit?.name || '').trim(),
        unit_code: (unit?.code || '').trim() || abbreviateUnit(unit?.name),
        sku: product.sku || '',
        barcode: product.sku || '',
        description: product.description || '',
        hs_code: product.pct_or_hs_code || '',
        purchase_rate: Number(product.purchase_rate ?? 0),
        sales_rate_exc: Number(product.sales_rate_exc_dis_and_tax ?? 0),
        sales_rate_inc: Number(product.sales_rate_inc_dis_and_tax ?? 0),
        discount_amount: Number(product.discount_amount ?? 0),
        category_id: product.category_id,
        category_name: product.category?.name || '',
        category_code: product.category?.code || '',
        subcategory_id: product.subcategory_id || '',
        subcategory_name: product.subcategory?.name || '',
        subcategory_code: product.subcategory?.code || '',
        unit_id: product.unit_id,
        tax_id: product.tax_id || '',
        tax_name: product.tax?.name || '',
        tax_code: product.tax?.code || '',
        tax_percentage: Number(product.tax?.percentage ?? 0),
        supplier_id: product.supplier_id || '',
        supplier_name: product.supplier?.name || '',
        supplier_code: product.supplier?.code || '',
        brand_id: product.brand_id || '',
        brand_name: product.brand?.name || '',
        brand_code: product.brand?.code || '',
        color_id: product.color_id || '',
        color_name: product.color?.name || '',
        color_code: product.color?.code || '',
        size_id: product.size_id || '',
        size_name: product.size?.name || '',
        size_code: product.size?.code || '',
        min_qty: product.min_qty ?? 0,
        max_qty: product.max_qty ?? 0,
        current_stock: totalCurrentStock,
        reserved_stock: totalReservedStock,
        available_stock: totalCurrentStock - totalReservedStock,
        minimum_stock: totalMinimumStock,
        maximum_stock: totalMaximumStock,
        is_active: product.is_active,
        display_on_pos: product.display_on_pos,
        is_batch: product.is_batch,
        auto_fill_on_demand_sheet: product.auto_fill_on_demand_sheet,
        non_inventory_item: product.non_inventory_item,
        is_deal: product.is_deal,
        is_featured: product.is_featured,
        has_images: product.has_images,
        first_image_url: product.ProductImage?.[0]?.image || '',
        created_at: product.created_at.toISOString(),
        updated_at: product.updated_at.toISOString(),
    };
}

export function formatStockWithUnit(qty: number, unitName?: string | null): string {
    return formatQtyWithUnit(qty, unitName);
}
