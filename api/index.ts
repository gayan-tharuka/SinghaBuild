import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import PDFDocument from 'pdfkit';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Middleware to authenticate JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // No token

  jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey', (err: any, user: any) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = user;
    next();
  });
};

// Middleware to authorize user roles
const authorizeRoles = (...roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send('Forbidden');
    }
    next();
  };
};

const upload = multer({ dest: 'public/uploads/' });

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

async function run() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }
    const client = new MongoClient(uri);

    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('rentflow'); // Database name
    const equipmentCollection = db.collection('equipment'); // Collection name
    const customersCollection = db.collection('customers'); // Collection name
    const quotationsCollection = db.collection('quotations'); // Collection name
    const bookingsCollection = db.collection('bookings'); // Collection name
    const settingsCollection = db.collection('settings'); // Collection name
    const usersCollection = db.collection('users'); // Collection name

    // Get all equipment
    app.get('/api/equipment', async (req, res) => {
      const equipment = await equipmentCollection.find({}).toArray();
      res.json(equipment);
    });

    // Add new equipment
    app.post('/api/equipment', async (req, res) => {
      const newEquipment = req.body;
      const result = await equipmentCollection.insertOne(newEquipment);
      res.json(result);
    });

    // Update equipment
    app.put('/api/equipment/:id', async (req, res) => {
      const { id } = req.params;
      const updatedEquipment = req.body;
      delete updatedEquipment._id; // Remove _id from the update payload
      const result = await equipmentCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedEquipment }
      );
      res.json(result);
    });

    // Delete equipment
    app.delete('/api/equipment/:id', async (req, res) => {
      const { id } = req.params;
      const result = await equipmentCollection.deleteOne({ _id: new ObjectId(id) });
      res.json(result);
    });

    // Get all customers
    app.get('/api/customers', async (req, res) => {
      const customers = await customersCollection.find({}).toArray();
      res.json(customers);
    });

    // Add new customer
    app.post('/api/customers', async (req, res) => {
      const newCustomer = req.body;
      const result = await customersCollection.insertOne(newCustomer);
      res.json(result);
    });

    // Update customer
    app.put('/api/customers/:id', async (req, res) => {
      const { id } = req.params;
      const updatedCustomer = req.body;
      delete updatedCustomer._id;
      const result = await customersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedCustomer }
      );
      res.json(result);
    });

    // Delete customer
    app.delete('/api/customers/:id', async (req, res) => {
      const { id } = req.params;
      const result = await customersCollection.deleteOne({ _id: new ObjectId(id) });
      res.json(result);
    });

    // Get all quotations
    app.get('/api/quotations', async (req, res) => {
      const quotations = await quotationsCollection.find({}).toArray();
      res.json(quotations);
    });

    // Add new quotation
    app.post('/api/quotations', async (req, res) => {
      const newQuotation = req.body;
      const count = await quotationsCollection.countDocuments();
      const year = new Date().getFullYear();
      const quotationId = `QT-${year}-${(count + 1).toString().padStart(3, '0')}`;
      newQuotation.quotationId = quotationId;
      const result = await quotationsCollection.insertOne(newQuotation);
      res.json(newQuotation);
    });

    // Get all bookings
    app.get('/api/bookings', async (req, res) => {
      const bookings = await bookingsCollection.find({}).toArray();
      res.json(bookings);
    });

    // Add new booking
    app.post('/api/bookings', async (req, res) => {
      const newBooking = req.body;
      const count = await bookingsCollection.countDocuments();
      const year = new Date().getFullYear();
      const bookingId = `BK-${year}-${(count + 1).toString().padStart(3, '0')}`;
      newBooking.bookingId = bookingId;
      await bookingsCollection.insertOne(newBooking);
      res.json(newBooking);
    });

    // Mark a booking as complete
    app.put('/api/bookings/:id/complete', async (req, res) => {
      const { id } = req.params;
      const result = await bookingsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: 'Completed' } }
      );
      res.json(result);
    });

    // Update booking status
    app.put('/api/bookings/:id/status', async (req, res) => {
      const { id } = req.params;
      const { status } = req.body;
      const result = await bookingsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: status } }
      );
      res.json(result);
    });

    // Get settings
    app.get('/api/settings', async (req, res) => {
      let settings = await settingsCollection.findOne({});
      if (!settings) {
        settings = {};
        await settingsCollection.insertOne(settings);
      }
      res.json(settings);
    });

    // Update settings
    app.put('/api/settings', async (req, res) => {
      const updatedSettings = req.body;
      delete updatedSettings._id;
      const result = await settingsCollection.updateOne(
        {},
        { $set: updatedSettings },
        { upsert: true }
      );
      res.json(result);
    });

    // Register new user
    app.post('/api/auth/register', authenticateToken, authorizeRoles('admin'), async (req, res) => {
      const { username, password, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await usersCollection.insertOne({ username, password: hashedPassword, role: role || 'user' });
      res.json(result);
    });

    // Login user
    app.post('/api/auth/login', async (req, res) => {
      const { username, password } = req.body;
      const user = await usersCollection.findOne({ username });
      if (!user) {
        return res.status(400).send('Invalid credentials');
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send('Invalid credentials');
      }
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'supersecretjwtkey', { expiresIn: '1h' });
      res.json({ token });
    });

    // Get current user info
    app.get('/api/auth/me', authenticateToken, async (req: any, res) => {
      const user = await usersCollection.findOne({ _id: new ObjectId(req.user.id) });
      if (!user) {
        return res.status(404).send('User not found');
      }
      res.json({ username: user.username, role: user.role });
    });

    // Change password
    app.put('/api/auth/change-password', authenticateToken, async (req: any, res) => {
      const { currentPassword, newPassword } = req.body;
      const user = await usersCollection.findOne({ _id: new ObjectId(req.user.id) });

      if (!user) {
        return res.status(400).send('User not found');
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).send('Invalid current password');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await usersCollection.updateOne({ username }, { $set: { password: hashedPassword } });
      res.send('Password updated successfully');
    });

    // Upload logo
    app.post('/api/upload-logo', upload.single('logo'), async (req, res) => {
      if (req.file) {
        const logoPath = `/uploads/${req.file.filename}`;
        await settingsCollection.updateOne({}, { $set: { logo: logoPath } }, { upsert: true });
        res.json({ logoPath });
      } else {
        res.status(400).send('No file uploaded');
      }
    });

    // Generate PDF for a quotation
    app.get('/api/quotations/:id/pdf', async (req, res) => {
      try {
        const { id } = req.params;
        const quotation = await quotationsCollection.findOne({ _id: new ObjectId(id) });

        if (!quotation) {
          return res.status(404).send('Quotation not found');
        }

        const doc = new PDFDocument({ margin: 50 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${quotation.quotationId}.pdf`);

        doc.pipe(res);

        // Header
        doc.fontSize(20).text('Quotation', { align: 'center' });
        doc.moveDown();

        // Details
        doc.fontSize(12).text(`Quotation ID: ${quotation.quotationId}`);
        doc.text(`Customer: ${quotation.customerName}`);
        doc.text(`Date: ${new Date().toLocaleDateString()}`);
        doc.moveDown();

        // Items Table
        const tableTop = doc.y;
        doc.fontSize(14).text('Items');
        const itemX = 50;
        const qtyX = 300;
        const rateX = 370;
        const subtotalX = 450;

        doc.fontSize(10).text('Item', itemX, tableTop + 20);
        doc.text('Quantity', qtyX, tableTop + 20);
        doc.text('Rate', rateX, tableTop + 20);
        doc.text('Subtotal', subtotalX, tableTop + 20);
        doc.moveTo(itemX, tableTop + 35).lineTo(550, tableTop + 35).stroke();

        let y = tableTop + 45;
        quotation.items.forEach((item: any) => {
          doc.fontSize(10).text(item.name, itemX, y);
          doc.text(item.quantity.toString(), qtyX, y);
          doc.text(item.rate.toLocaleString(), rateX, y);
          doc.text(item.subtotal.toLocaleString(), subtotalX, y);
          y += 20;
        });

        // Total
        doc.fontSize(12).text(`Total: LKR ${quotation.totalAmount.toLocaleString()}`, 350, y + 20);

        doc.end();

      } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
      }
    });

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
}

run();
