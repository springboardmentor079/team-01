const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const reportService = require("../services/report.service");

const reportFetchers = {
  progress: reportService.getProgressReport,
  resource: reportService.getResourceReport,
  workforce: reportService.getWorkforceReport,
  procurement: reportService.getProcurementReport,
};

const reportTitles = {
  progress: "Site Progress Report",
  resource: "Resource Utilization Report",
  workforce: "Workforce Report",
  procurement: "Procurement Report",
};

const flattenReport = (data) => {
  // Turns the nested summary object into flat { label, value } rows,
  // shared by both PDF and Excel so the two exports always match.
  const rows = [];

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      rows.push({ label: key, value: `${value.length} entries` });
    } else if (typeof value === "object" && value !== null) {
      Object.entries(value).forEach(([subKey, subValue]) => {
        rows.push({ label: `${key} — ${subKey}`, value: String(subValue) });
      });
    } else {
      rows.push({ label: key, value: String(value) });
    }
  });

  return rows;
};

exports.exportReport = async (req, res, next) => {
  try {
    const { type } = req.params;
    const { format, projectId } = req.query;

    const fetcher = reportFetchers[type];
    if (!fetcher) {
      return res.status(400).json({ message: `Unknown report type '${type}'` });
    }

    const data = await fetcher(projectId);
    const title = reportTitles[type];
    const rows = flattenReport(data);

    if (format === "pdf") {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${type}-report.pdf`,
      );

      const doc = new PDFDocument({ margin: 50 });
      doc.pipe(res);

      doc.fontSize(18).text(title, { align: "center" });
      doc.moveDown();
      doc
        .fontSize(10)
        .text(`Generated: ${new Date().toLocaleString()}`, { align: "center" });
      doc.moveDown(2);

      rows.forEach((row) => {
        doc
          .fontSize(11)
          .text(`${row.label}: `, { continued: true })
          .font("Helvetica-Bold")
          .text(row.value);
        doc.font("Helvetica");
        doc.moveDown(0.3);
      });

      doc.end();
    } else if (format === "excel") {
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${type}-report.xlsx`,
      );

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet(title.slice(0, 31)); // Excel sheet name limit

      sheet.columns = [
        { header: "Metric", key: "label", width: 35 },
        { header: "Value", key: "value", width: 30 },
      ];
      sheet.getRow(1).font = { bold: true };

      rows.forEach((row) => sheet.addRow(row));

      await workbook.xlsx.write(res);
    } else {
      return res
        .status(400)
        .json({ message: "format must be 'pdf' or 'excel'" });
    }
  } catch (err) {
    next(err);
  }
};
