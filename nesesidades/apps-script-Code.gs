/**
 * espacioSM · Motor de Diagnóstico
 * Backend de la hoja. Recibe el diagnóstico y lo escribe
 * por nombre de columna, no por posición.
 */

const HOJA = "Hoja 1";
const TOKEN = "aura-sm-2026";
const LARGO_MAX = 5000;
const ZONA = "America/Mexico_City";

function doGet() {
  return texto("El motor Aura SM está activo. Esperando datos vía POST...");
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    if (!e || !e.parameter) return texto("ERROR: sin datos");

    const p = e.parameter;

    if (String(p.Token || "") !== TOKEN) {
      return texto("ERROR: token inválido");
    }

    const email = String(p.Email || "").trim();
    if (!email) return texto("ERROR: falta el correo");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(HOJA) || ss.getSheets()[0];
    const ancho = sheet.getLastColumn();

    if (ancho < 1) return texto("ERROR: la hoja no tiene encabezados");

    const headers = sheet.getRange(1, 1, 1, ancho).getValues()[0].map(function (h) {
      return String(h).trim();
    });

    const fila = headers.map(function (h) {
      if (!h) return "";
      if (h === "Fecha") {
        return p.Fecha || Utilities.formatDate(new Date(), ZONA, "dd/MM/yyyy HH:mm");
      }
      let v = p[h];
      if (v === undefined || v === null) return "";
      v = String(v);
      return v.length > LARGO_MAX ? v.substring(0, LARGO_MAX) : v;
    });

    lock.waitLock(15000);
    sheet.appendRow(fila);

    return texto("OK");
  } catch (err) {
    return texto("ERROR: " + err);
  } finally {
    try { lock.releaseLock(); } catch (e2) { }
  }
}

function texto(t) {
  return ContentService.createTextOutput(t).setMimeType(ContentService.MimeType.TEXT);
}
