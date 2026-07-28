const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { db, getQuery, allQuery, runQuery } = require('../db');
const { authenticateToken } = require('../middleware/auth');
const { logActivity } = require('../utils/activity');
const { broadcastNotification } = require('../utils/websocket');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

function normalizeStateName(stateStr) {
  if (!stateStr) return '';
  const clean = stateStr.trim().replace(/\s+/g, ' ').toLowerCase();

  const variations = {
    'jammu & kashmir': 'Jammu and Kashmir',
    'jammu and kashmir': 'Jammu and Kashmir',
    'j&k': 'Jammu and Kashmir',
    'j and k': 'Jammu and Kashmir',
    'jk': 'Jammu and Kashmir',
    
    'andaman & nicobar': 'Andaman and Nicobar',
    'andaman and nicobar': 'Andaman and Nicobar',
    'andaman & nicobar islands': 'Andaman and Nicobar',
    'andaman and nicobar islands': 'Andaman and Nicobar',
    'andaman nicobar': 'Andaman and Nicobar',
    
    'dadra & nagar haveli': 'Dadra and Nagar Haveli and Daman and Diu',
    'dadra and nagar haveli': 'Dadra and Nagar Haveli and Daman and Diu',
    'daman & diu': 'Dadra and Nagar Haveli and Daman and Diu',
    'daman and diu': 'Dadra and Nagar Haveli and Daman and Diu',
    'dadra and nagar haveli and daman and diu': 'Dadra and Nagar Haveli and Daman and Diu',
    'dadra & nagar haveli and daman & diu': 'Dadra and Nagar Haveli and Daman and Diu',

    'delhi ncr': 'Delhi',
    'ncr': 'Delhi',
    'odisha': 'Odisha',
    'orissa': 'Odisha',
    'pondicherry': 'Puducherry',
    'puducherry': 'Puducherry'
  };

  if (variations[clean]) {
    return variations[clean];
  }

  const validStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar',
    'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
    'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  const matched = validStates.find(s => s.toLowerCase() === clean);
  if (matched) return matched;

  if (clean.includes('kashmir') || clean.includes('jammu')) return 'Jammu and Kashmir';
  if (clean.includes('bengal')) return 'West Bengal';
  if (clean.includes('tamilnadu') || clean.includes('tamil nadu')) return 'Tamil Nadu';
  if (clean.includes('andhra')) return 'Andhra Pradesh';
  if (clean.includes('arunachal')) return 'Arunachal Pradesh';
  if (clean.includes('himachal')) return 'Himachal Pradesh';
  if (clean.includes('madhya')) return 'Madhya Pradesh';
  if (clean.includes('chhattisgarh') || clean.includes('chatisgarh')) return 'Chhattisgarh';

  return null;
}

router.post('/', authenticateToken, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  let uploadId;
  try {
    const result = await runQuery(
      'INSERT INTO uploads (filename, status, record_count, uploaded_by) VALUES (?, ?, ?, ?)',
      [req.file.originalname, 'Processing', 0, req.user.name]
    );
    uploadId = result.lastID;
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  const filePath = req.file.path;
  fs.readFile(filePath, 'utf8', async (err, data) => {
    if (err) {
      await runQuery('UPDATE uploads SET status = ?, error_message = ? WHERE id = ?', ['Failed', 'File reading failed', uploadId]);
      return;
    }

    try {
      const lines = data.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      if (lines.length <= 1) {
        throw new Error('CSV is empty or missing headers');
      }

      const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
      const requiredHeaders = ['date', 'state', 'category', 'product_name', 'revenue', 'orders', 'quantity'];
      
      const missing = requiredHeaders.filter(h => !headers.includes(h));
      if (missing.length > 0) {
        throw new Error(`Missing required CSV headers: ${missing.join(', ')}`);
      }

      const headerIndexes = {};
      headers.forEach((h, i) => {
        headerIndexes[h] = i;
      });

      let successCount = 0;
      let lineIndex = 1;

      await runQuery('BEGIN TRANSACTION');

      const stmt = db.prepare(`
        INSERT INTO sales_data (date, state, category, product_name, revenue, orders, quantity)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      try {
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(',').map(cell => cell.trim().replace(/^["']|["']$/g, ''));
          
          if (row.length < requiredHeaders.length) {
            continue;
          }

          const date = row[headerIndexes['date']];
          const rawState = row[headerIndexes['state']];
          const state = normalizeStateName(rawState);
          const category = row[headerIndexes['category']];
          const product_name = row[headerIndexes['product_name']];
          const revenue = parseFloat(row[headerIndexes['revenue']]);
          const orders = parseInt(row[headerIndexes['orders']]);
          const quantity = parseInt(row[headerIndexes['quantity']]);

          if (!date || !/^\\d{4}-\\d{2}-\\d{2}$/.test(date)) {
            throw new Error(`Row ${lineIndex + 1}: Invalid date format. Must be YYYY-MM-DD.`);
          }
          if (!state) {
            throw new Error(`Row ${lineIndex + 1}: State "${rawState}" is not recognized as a valid Indian State or UT.`);
          }
          if (!category || category.trim().length === 0) {
            throw new Error(`Row ${lineIndex + 1}: Category string is empty or invalid.`);
          }
          if (isNaN(revenue) || revenue <= 0) {
            throw new Error(`Row ${lineIndex + 1}: Revenue must be a positive number.`);
          }
          if (isNaN(orders) || orders <= 0) {
            throw new Error(`Row ${lineIndex + 1}: Orders must be a positive integer.`);
          }
          if (isNaN(quantity) || quantity <= 0) {
            throw new Error(`Row ${lineIndex + 1}: Quantity must be a positive integer.`);
          }

          await new Promise((resolve, reject) => {
            stmt.run([date, state, category, product_name, revenue, orders, quantity], function(runErr) {
              if (runErr) reject(runErr);
              else resolve();
            });
          });

          successCount++;
          lineIndex++;
        }

        await runQuery('COMMIT');
      } catch (loopErr) {
        await runQuery('ROLLBACK');
        throw loopErr;
      } finally {
        stmt.finalize();
      }

      await runQuery(
        'UPDATE uploads SET status = ?, record_count = ? WHERE id = ?',
        ['Completed', successCount, uploadId]
      );

      const notifTitle = 'Bulk Sales Upload Completed';
      const notifMsg = `File "${req.file.originalname}" was imported successfully. Imported ${successCount} new transaction rows.`;
      await runQuery('INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)', [notifTitle, notifMsg, 'milestone']);
      
      const newNotif = await getQuery('SELECT * FROM notifications ORDER BY id DESC LIMIT 1');
      broadcastNotification(newNotif);

      await logActivity(req.user.id, 'Bulk Data Upload', `Uploaded file: ${req.file.originalname}. Imported ${successCount} records.`);

    } catch (parseErr) {
      console.error('Upload Parsing Error:', parseErr);
      await runQuery(
        'UPDATE uploads SET status = ?, error_message = ? WHERE id = ?',
        ['Failed', parseErr.message, uploadId]
      );

      const notifTitle = 'Bulk Sales Upload Failed';
      const notifMsg = `File "${req.file.originalname}" failed to import. Error: { ${parseErr.message} }`;
      await runQuery('INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)', [notifTitle, notifMsg, 'alert']);

      const newNotif = await getQuery('SELECT * FROM notifications ORDER BY id DESC LIMIT 1');
      broadcastNotification(newNotif);
    } finally {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  });

  res.json({
    id: uploadId,
    message: 'File uploaded and is being processed in the background.',
    status: 'Processing'
  });
});

router.get('/history', authenticateToken, async (req, res) => {
  try {
    const rows = await allQuery('SELECT * FROM uploads ORDER BY uploaded_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/status', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const row = await getQuery('SELECT * FROM uploads WHERE id = ?', [id]);
    if (!row) {
      return res.status(404).json({ error: 'Upload job not found' });
    }
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
