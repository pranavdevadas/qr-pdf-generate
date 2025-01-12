import QRCode from "qrcode";
import sql from "mssql";
import { config } from "../config/db.js";


const dashBoardController = {
  generateQr: async (req, res, next) => {
    try {
      const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
      const generatedDate = new Date();
      const expiryDate = new Date();
      expiryDate.setDate(generatedDate.getDate() + 7);

      const qrCode = await QRCode.toDataURL(randomNumber.toString());

      const pool = await sql.connect(config);

      const query = `
            IF NOT EXISTS (
                SELECT * 
                FROM sysobjects 
                WHERE name = 'Vouchers' AND xtype = 'U'
            )
            BEGIN
                CREATE TABLE Vouchers (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    number BIGINT NOT NULL,
                    gendate DATETIME NOT NULL,
                    expdate DATETIME NOT NULL,
                    qr NVARCHAR(MAX) NOT NULL
                );
            END;

            INSERT INTO Vouchers (number, gendate, expdate, qr)
            VALUES (@number, @gendate, @expdate, @qr);
        `;

      await pool
        .request()
        .input("number", sql.BigInt, randomNumber)
        .input("gendate", sql.DateTime, generatedDate)
        .input("expdate", sql.DateTime, expiryDate)
        .input("qr", sql.NVarChar, qrCode)
        .query(query);

      res.status(200).json({
        randomNumber,
        qrCode,
      });
    } catch (error) {
      next(error)
    }
  },

};

export default dashBoardController;
