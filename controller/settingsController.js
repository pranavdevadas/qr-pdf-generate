import sql from "mssql";
import { config } from "../config/db.js";

const settingsController = {
  getSettings: async (req, res, next) => {
    try {
      const { voucherId } = req.query;

      const pool = await sql.connect(config);

      const result = await pool
        .request()
        .input("voucherId", sql.Int, voucherId)
        .query("SELECT * FROM Vouchers WHERE id = @voucherId");

      if (result.recordset.length === 0) {
        return res.status(404).send("Voucher not found");
      }

      const voucher = result.recordset[0];

      res.render("settings", {
        voucherId: voucher.id,
        voucherNumber: voucher.number,
        voucherGenDate: voucher.gendate,
        voucherExpDate: voucher.expdate,
        voucherQr: voucher.qr,
      });

      sql.close();
    } catch (error) {
      next(error);
    }
  },

  updateExpiryDate: async (req, res, next) => {
    try {
      const { voucherId, expiryDate } = req.body;

      if (!voucherId || !expiryDate) {
        return res.status(400).json({ error: "Invalid input data." });
      }

      // Parse and validate expiry date
      const parsedExpiryDate = new Date(expiryDate);
      if (isNaN(parsedExpiryDate)) {
        return res.status(400).json({ error: "Invalid expiry date format." });
      }

      const pool = await sql.connect(config);

      const result = await pool
        .request()
        .input("voucherId", sql.Int, voucherId)
        .input("expiryDate", sql.DateTime, parsedExpiryDate)
        .query(
          `UPDATE Vouchers SET expdate = @expiryDate WHERE id = @voucherId`
        );

      if (result.rowsAffected[0] > 0) {
        res.status(200).json({ message: "Expiry date updated successfully." });
      } else {
        res.status(404).json({ error: "Voucher not found." });
      }
      sql.close();
    } catch (error) {
      next(error);
      res.status(500).json({ error: "Internal server error." });
    }
  },
};

export default settingsController;
