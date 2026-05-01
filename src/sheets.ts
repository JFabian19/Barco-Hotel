/**
 * Google Sheets Integration Module
 * 
 * Reads data from a published Google Spreadsheet.
 * 
 * Sheet structure:
 *   - "categorias": columna "categoria" 
 *   - "servicios": columnas "categoria", "nombre", "descripcion", "precio", "imagen", "pricePrefix"
 * 
 * The spreadsheet must be shared as "Anyone with the link can view".
 */

const SHEET_ID = '1d0pIW-IrtUOSTbmJYhzg6RsEDY_KY5_nFYOyXecl54E';

function getSheetCSVUrl(sheetName: string): string {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
}

/**
 * Parse CSV text into rows. Handles quoted fields with commas inside.
 */
function parseCSV(csvText: string): string[][] {
  const rows: string[][] = [];
  // Split by newline and remove carriage returns (\r)
  const lines = csvText.replace(/\r/g, '').split('\n');

  for (const line of lines) {
    if (line.trim() === '') continue;

    const row: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
          // Escaped quote
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    row.push(current.trim().replace(/^"|"$/g, ''));
    rows.push(row);
  }

  return rows;
}

export interface SheetCategory {
  name: string;
}

export interface SheetMenuItem {
  id: string;
  category: string;
  name: string;
  desc: string;
  price: number;
  image: string;
  pricePrefix: string;
}

export interface SheetRoom {
  id: string;
  name: string;
  image: string;
  amenities: string; // comma-separated amenities text
  price: string;
}

/**
 * Fetch categories from the "categorias" sheet.
 * Expected columns: categoria
 */
export async function fetchCategories(): Promise<SheetCategory[]> {
  try {
    const url = getSheetCSVUrl('categorias');
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    const rows = parseCSV(text);

    if (rows.length < 2) return [];

    // First row is headers
    const headers = rows[0].map(h => h.toLowerCase().replace(/['"]/g, '').trim());
    const catIndex = headers.findIndex(h => h.includes('categoria') || h.includes('categoría') || h.includes('category'));

    if (catIndex === -1) {
      console.warn('No "categoria" column found in categorias sheet. Headers:', headers);
      return [];
    }

    return rows.slice(1)
      .filter(row => row[catIndex] && row[catIndex].replace(/['"]/g, '').trim() !== '')
      .map(row => ({
        name: row[catIndex].replace(/['"]/g, '').trim()
      }));
  } catch (error) {
    console.error('Error fetching categories from Google Sheets:', error);
    return [];
  }
}

/**
 * Fetch menu items from the "platos" sheet.
 * Expected columns: categoria, nombre, descripcion, precio, imagen, pricePrefix (optional)
 */
export async function fetchMenuItems(): Promise<SheetMenuItem[]> {
  try {
    const url = getSheetCSVUrl('platos');
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    const rows = parseCSV(text);

    if (rows.length < 2) return [];

    // First row is headers - normalize them
    const headers = rows[0].map(h => h.toLowerCase().replace(/['"]/g, '').trim());

    const catIdx = headers.findIndex(h => h.includes('categoria') || h.includes('categoría') || h.includes('category'));
    const nameIdx = headers.findIndex(h => h.includes('nombre') || h.includes('name'));
    const descIdx = headers.findIndex(h => h.includes('descripcion') || h.includes('descripción') || h.includes('description'));
    const priceIdx = headers.findIndex(h => h.includes('precio') || h.includes('price'));
    const imageIdx = headers.findIndex(h => h.includes('imagen') || h.includes('image') || h.includes('url'));
    const prefixIdx = headers.findIndex(h => h.includes('prefix') || h.includes('prefijo') || h.includes('priceprefix'));

    if (catIdx === -1 || nameIdx === -1) {
      console.warn('Required columns not found in servicios sheet. Headers:', headers);
      return [];
    }

    return rows.slice(1)
      .filter(row => {
        const name = row[nameIdx]?.replace(/['"]/g, '').trim();
        return name && name !== '';
      })
      .map((row, index) => {
        const clean = (idx: number) => idx >= 0 && row[idx] ? row[idx].replace(/['"]/g, '').trim() : '';
        const priceStr = clean(priceIdx);
        const price = parseFloat(priceStr) || 0;

        return {
          id: `sheet_${index}`,
          category: clean(catIdx),
          name: clean(nameIdx),
          desc: clean(descIdx),
          price,
          image: clean(imageIdx),
          pricePrefix: clean(prefixIdx),
        };
      });
  } catch (error) {
    console.error('Error fetching menu items from Google Sheets:', error);
    return [];
  }
}

/**
 * Fetch additional rooms from the "habitaciones" sheet (optional).
 * Expected columns: nombre, imagen, amenities
 * This sheet allows ADDING new rooms only - existing hardcoded rooms are kept.
 */
export async function fetchExtraRooms(): Promise<SheetRoom[]> {
  try {
    const url = getSheetCSVUrl('habitaciones');
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    const rows = parseCSV(text);

    if (rows.length < 2) return [];

    const headers = rows[0].map(h => h.toLowerCase().replace(/['"]/g, '').trim());

    const nameIdx = headers.findIndex(h => h.includes('nombre') || h.includes('name'));
    const imageIdx = headers.findIndex(h => h.includes('imagen') || h.includes('image'));
    const amenitiesIdx = headers.findIndex(h => h.includes('amenities') || h.includes('servicios') || h.includes('caracteristicas'));
    const priceIdx = headers.findIndex(h => h.includes('precio') || h.includes('price'));

    if (nameIdx === -1) {
      console.warn('No "nombre" column found in habitaciones sheet. Headers:', headers);
      return [];
    }

    return rows.slice(1)
      .filter(row => {
        const name = row[nameIdx]?.replace(/['"]/g, '').trim();
        return name && name !== '';
      })
      .map((row, index) => {
        const clean = (idx: number) => idx >= 0 && row[idx] ? row[idx].replace(/['"]/g, '').trim() : '';
        return {
          id: `sheet_room_${index}`,
          name: clean(nameIdx),
          image: clean(imageIdx),
          amenities: clean(amenitiesIdx),
          price: clean(priceIdx),
        };
      });
  } catch (error) {
    // This sheet is optional - if it doesn't exist, just return empty
    console.log('No habitaciones sheet found (this is optional)');
    return [];
  }
}

/**
 * Main function to load all data from Google Sheets.
 * Returns null if the sheet is not accessible (not public or doesn't exist).
 */
export async function loadSheetData(): Promise<{
  categories: SheetCategory[];
  menuItems: SheetMenuItem[];
  extraRooms: SheetRoom[];
} | null> {
  try {
    const [categories, menuItems, extraRooms] = await Promise.all([
      fetchCategories(),
      fetchMenuItems(),
      fetchExtraRooms(),
    ]);

    // If we got at least some categories or items, consider it a success
    if (categories.length > 0 || menuItems.length > 0) {
      return { categories, menuItems, extraRooms };
    }

    return null;
  } catch (error) {
    console.error('Failed to load sheet data:', error);
    return null;
  }
}
