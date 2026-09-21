import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import {
    PRODUCT_EXPORT_COLUMN_LABELS,
    ProductExportSource,
    buildProductExportValues,
    formatProductUnits,
    formatStockWithUnit,
} from '../utils/product-export';

const COLORS = {
    forest: '#1B4332',
    forestDeep: '#081C15',
    gold: '#C4A35A',
    goldSoft: '#E8D5A3',
    cream: '#FBF7F0',
    rowAlt: '#F3EEE3',
    white: '#FFFFFF',
    text: '#1A1A1A',
    muted: '#5C5346',
    line: '#D9D0C1',
    active: '#2D6A4F',
    inactive: '#9B2226',
};

const PAGE = { width: 841.89, height: 595.28 };
const MARGIN = { left: 28, right: 28, top: 18, bottom: 28 };

type PdfColumn = {
    key: string;
    label: string;
    width: number;
    align?: 'left' | 'right' | 'center';
};

const CATALOG_COLUMNS: PdfColumn[] = [
    { key: '_index', label: '#', width: 26, align: 'center' },
    { key: 'product_code', label: 'Code', width: 68, align: 'left' },
    { key: 'product_name', label: 'Product Name', width: 168, align: 'left' },
    { key: 'sku', label: 'SKU', width: 80, align: 'left' },
    { key: 'category_name', label: 'Category', width: 90, align: 'left' },
    { key: 'units', label: 'Units', width: 74, align: 'center' },
    { key: 'current_stock', label: 'Stock', width: 74, align: 'right' },
    { key: 'purchase_rate', label: 'Purchase', width: 68, align: 'right' },
    { key: 'sales_rate_exc', label: 'Sale Rate', width: 68, align: 'right' },
    { key: 'is_active', label: 'Status', width: 50, align: 'center' },
];

const ID_LIKE_KEYS = new Set(
    Object.keys(PRODUCT_EXPORT_COLUMN_LABELS).filter(
        (key) =>
            key.endsWith('_id') ||
            key === 'created_at' ||
            key === 'updated_at' ||
            key === 'first_image_url' ||
            key === 'description' ||
            key === 'has_images'
    )
);

function fitColumns(columns: PdfColumn[]): PdfColumn[] {
    const tableWidth = PAGE.width - MARGIN.left - MARGIN.right;
    const total = columns.reduce((sum, column) => sum + column.width, 0) || 1;
    const scale = tableWidth / total;
    return columns.map((column) => ({ ...column, width: column.width * scale }));
}

function resolveLogoPath(): string | null {
    const candidates = [
        path.join(__dirname, '../../src/assets/logo.png'),
        path.join(__dirname, '../assets/logo.png'),
        path.join(__dirname, '../../assets/logo.png'),
        path.resolve(process.cwd(), 'src/assets/logo.png'),
        path.resolve(process.cwd(), 'assets/logo.png'),
    ];
    return candidates.find((candidate) => fs.existsSync(candidate)) || null;
}

function money(value: number): string {
    return Number(value || 0).toLocaleString('en-PK', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function ellipsize(doc: PDFKit.PDFDocument, text: string, maxWidth: number): string {
    const value = String(text || '');
    if (!value) return '—';
    if (doc.widthOfString(value) <= maxWidth) return value;
    let clipped = value;
    while (clipped.length > 1 && doc.widthOfString(`${clipped}…`) > maxWidth) {
        clipped = clipped.slice(0, -1);
    }
    return `${clipped}…`;
}

function cellText(
    key: string,
    values: Record<string, string | number | boolean>,
    product: ProductExportSource,
    index: number
): string {
    if (key === '_index') return String(index);
    if (key === 'units') return formatProductUnits(product) || '—';
    if (key === 'current_stock' || key === 'available_stock' || key === 'reserved_stock') {
        return formatStockWithUnit(Number(values[key] ?? 0), product.unit?.name || product.unit?.code);
    }
    if (key === 'is_active') return values.is_active ? 'Active' : 'Inactive';
    if (key === 'display_on_pos') return values.display_on_pos ? 'Yes' : 'No';
    if (
        key === 'purchase_rate' ||
        key === 'sales_rate_exc' ||
        key === 'sales_rate_inc' ||
        key === 'discount_amount'
    ) {
        return money(Number(values[key] ?? 0));
    }
    const raw = values[key];
    if (typeof raw === 'boolean') return raw ? 'Yes' : 'No';
    if (raw === '' || raw === null || raw === undefined) return '—';
    return String(raw);
}

function resolvePdfColumns(selectedColumns: string[]): PdfColumn[] {
    const usable = selectedColumns.filter((key) => !ID_LIKE_KEYS.has(key) && key !== 'unit_name' && key !== 'unit_code');
    if (usable.length === 0 || usable.length > 11) {
        return fitColumns(CATALOG_COLUMNS);
    }

    const keys = usable.includes('product_name') ? usable : ['product_name', ...usable];
    if (!keys.includes('units')) {
        const nameIdx = keys.indexOf('product_name');
        keys.splice(nameIdx >= 0 ? nameIdx + 1 : 0, 0, 'units');
    }

    const tableWidth = PAGE.width - MARGIN.left - MARGIN.right;
    const indexWidth = 28;
    const remaining = tableWidth - indexWidth;
    const flexKeys = keys.slice(0, 9);
    const base = remaining / flexKeys.length;

    return fitColumns([
        { key: '_index', label: '#', width: indexWidth, align: 'center' },
        ...flexKeys.map((key): PdfColumn => {
            const align: PdfColumn['align'] =
                key.includes('rate') || key.includes('stock') || key.includes('qty') || key.includes('amount')
                    ? 'right'
                    : key === 'units' || key === 'is_active'
                      ? 'center'
                      : 'left';
            return {
                key,
                label: key === 'units' ? 'Units' : PRODUCT_EXPORT_COLUMN_LABELS[key] || key,
                width: base,
                align,
            };
        }),
    ]);
}

function drawBanner(
    doc: PDFKit.PDFDocument,
    opts: { compact: boolean; productCount: number; generatedAt: string; subtitle: string }
): number {
    const height = opts.compact ? 46 : 78;
    doc.rect(0, 0, PAGE.width, height).fill(COLORS.forest);
    doc.rect(0, height - 4, PAGE.width, 4).fill(COLORS.gold);

    const logoPath = resolveLogoPath();
    let textX = MARGIN.left;
    if (logoPath) {
        const logoSize = opts.compact ? 28 : 48;
        try {
            doc.image(logoPath, MARGIN.left, opts.compact ? 9 : 14, {
                fit: [logoSize, logoSize],
            });
            textX = MARGIN.left + logoSize + 12;
        } catch {
            textX = MARGIN.left;
        }
    }

    doc.fillColor(COLORS.white)
        .font('Helvetica-Bold')
        .fontSize(opts.compact ? 13 : 18)
        .text('WHOLESALE NUT SUPPLY', textX, opts.compact ? 10 : 16, {
            width: 420,
            lineBreak: false,
        });

    doc.fillColor(COLORS.goldSoft)
        .font('Helvetica')
        .fontSize(opts.compact ? 8 : 10)
        .text(opts.compact ? 'Product Catalog' : 'Product Catalog Export', textX, opts.compact ? 26 : 40, {
            width: 420,
            lineBreak: false,
        });

    if (!opts.compact) {
        doc.fillColor('#D8E3DC')
            .fontSize(8)
            .text(opts.subtitle, textX, 56, { width: 460, lineBreak: false });
    }

    const metaX = PAGE.width - MARGIN.right - 210;
    doc.fillColor(COLORS.white)
        .font('Helvetica-Bold')
        .fontSize(opts.compact ? 9 : 11)
        .text(`${opts.productCount} product${opts.productCount === 1 ? '' : 's'}`, metaX, opts.compact ? 12 : 22, {
            width: 210,
            align: 'right',
            lineBreak: false,
        });
    doc.fillColor(COLORS.goldSoft)
        .font('Helvetica')
        .fontSize(8)
        .text(opts.generatedAt, metaX, opts.compact ? 26 : 40, {
            width: 210,
            align: 'right',
            lineBreak: false,
        });

    return height + 10;
}

function drawTableHeader(doc: PDFKit.PDFDocument, columns: PdfColumn[], y: number): number {
    const rowH = 22;
    doc.roundedRect(MARGIN.left, y, PAGE.width - MARGIN.left - MARGIN.right, rowH, 3).fill(COLORS.forestDeep);

    let x = MARGIN.left;
    doc.font('Helvetica-Bold').fontSize(8).fillColor(COLORS.goldSoft);
    columns.forEach((column) => {
        doc.text(column.label.toUpperCase(), x + 6, y + 7, {
            width: column.width - 12,
            align: column.align || 'left',
            lineBreak: false,
        });
        x += column.width;
    });
    return y + rowH;
}

function drawFooter(doc: PDFKit.PDFDocument, page: number, total: number) {
    const y = PAGE.height - 22;
    doc.rect(0, y - 2, PAGE.width, 24).fill(COLORS.forest);
    doc.rect(0, y - 4, PAGE.width, 2).fill(COLORS.gold);
    doc.fillColor(COLORS.goldSoft)
        .font('Helvetica')
        .fontSize(8)
        .text('Wholesale Nut Supply  •  Internal product catalog', MARGIN.left, y + 4, {
            width: 420,
            lineBreak: false,
        });
    doc.text(`Page ${page} of ${total}`, PAGE.width - MARGIN.right - 140, y + 4, {
        width: 140,
        align: 'right',
        lineBreak: false,
    });
}

function pdfToBuffer(doc: PDFKit.PDFDocument): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        doc.on('data', (chunk) => chunks.push(chunk as Buffer));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);
    });
}

export async function buildProductCatalogPdf(opts: {
    products: ProductExportSource[];
    selectedColumns: string[];
    subtitle?: string;
}): Promise<Buffer> {
    const columns = resolvePdfColumns(opts.selectedColumns);
    const generatedAt = new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
    const subtitle = opts.subtitle || 'Category details, live stock and product units';

    const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        bufferPages: true,
        margins: { top: 0, left: 0, right: 0, bottom: 0 },
        info: {
            Title: 'Wholesale Nut Supply — Product Catalog',
            Author: 'Wholesale Nut Supply',
        },
    });
    const done = pdfToBuffer(doc);

    let y = drawBanner(doc, {
        compact: false,
        productCount: opts.products.length,
        generatedAt,
        subtitle,
    });
    y = drawTableHeader(doc, columns, y);

    const rowH = 18;
    const footerGap = 32;

    opts.products.forEach((product, index) => {
        if (y + rowH > PAGE.height - footerGap) {
            doc.addPage();
            y = drawBanner(doc, {
                compact: true,
                productCount: opts.products.length,
                generatedAt,
                subtitle,
            });
            y = drawTableHeader(doc, columns, y);
        }

        const values = buildProductExportValues(product);
        const isAlt = index % 2 === 1;
        doc.rect(MARGIN.left, y, PAGE.width - MARGIN.left - MARGIN.right, rowH).fill(
            isAlt ? COLORS.rowAlt : COLORS.cream
        );

        let x = MARGIN.left;
        columns.forEach((column) => {
            const raw = cellText(column.key, values, product, index + 1);
            const isUnit = column.key === 'units';
            const isStatus = column.key === 'is_active';

            if (isUnit) {
                doc.rect(x, y, column.width, rowH).fill('#EFE4C8');
            }

            doc.font(isUnit || isStatus ? 'Helvetica-Bold' : 'Helvetica').fontSize(8);

            if (isStatus) {
                doc.fillColor(values.is_active ? COLORS.active : COLORS.inactive);
            } else if (isUnit) {
                doc.fillColor(COLORS.forest);
            } else {
                doc.fillColor(COLORS.text);
            }

            const display = ellipsize(doc, raw, column.width - 12);
            doc.text(display, x + 6, y + 5, {
                width: column.width - 12,
                align: column.align || 'left',
                lineBreak: false,
            });
            x += column.width;
        });

        y += rowH;
    });

    if (opts.products.length === 0) {
        doc.font('Helvetica').fontSize(11).fillColor(COLORS.muted).text(
            'No products matched the selected filters.',
            MARGIN.left,
            y + 24,
            { width: PAGE.width - MARGIN.left - MARGIN.right, align: 'center' }
        );
    }

    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i += 1) {
        doc.switchToPage(range.start + i);
        drawFooter(doc, i + 1, range.count);
    }

    doc.end();
    return done;
}
