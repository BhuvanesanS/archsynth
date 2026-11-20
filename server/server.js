import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateArchitecturalPlan } from './engine/planGenerator.js';
import { generateBlenderScript } from './engine/blenderGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, '../client/dist');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Serve compiled client static assets
app.use(express.static(clientDistPath));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'ArchSynth 3D Architecture & Walkthrough Engine',
    timestamp: new Date().toISOString()
  });
});

// Presets for instant testing
app.get('/api/samples', (req, res) => {
  res.json([
    {
      id: 'sample_modern_40x60',
      title: 'Modern International Villa (40ft × 60ft)',
      subtitle: 'North Facing • Passive Solar • Open-Concept Living • Infinity Pool',
      plotWidth: 40,
      plotDepth: 60,
      facing: 'NORTH',
      floors: 2,
      bhk: 4,
      vastuEnabled: false,
      style: 'contemporary',
      outdoor: { gardenLawn: true, carPorch: true, pool: true, patio: true },
      setbacks: { front: 10, rear: 6, left: 4, right: 4 }
    },
    {
      id: 'sample_vastu_30x40',
      title: 'Indian Vastu Sanctuary (30ft × 40ft)',
      subtitle: 'East Facing • 100% Vastu Compliant • Agni Kitchen • Ishanya Pooja',
      plotWidth: 30,
      plotDepth: 40,
      facing: 'EAST',
      floors: 1,
      bhk: 3,
      vastuEnabled: true,
      style: 'indian_contemporary',
      outdoor: { gardenLawn: true, carPorch: true, pool: false, patio: true },
      setbacks: { front: 8, rear: 4, left: 3, right: 3 }
    },
    {
      id: 'sample_compact_25x50',
      title: 'Scandinavian Townhouse (25ft × 50ft)',
      subtitle: 'West Facing • Minimalist Biophilic • Zen Rock Garden • Courtyard',
      plotWidth: 25,
      plotDepth: 50,
      facing: 'WEST',
      floors: 2,
      bhk: 3,
      vastuEnabled: false,
      style: 'scandinavian',
      outdoor: { gardenLawn: true, carPorch: true, pool: false, patio: true },
      setbacks: { front: 8, rear: 4, left: 2.5, right: 2.5 }
    }
  ]);
});

// Generate 2D Blueprint, 3D Mesh Data, and Walkthrough Waypoints
app.post('/api/generate-plan', (req, res) => {
  try {
    const plan = generateArchitecturalPlan(req.body);
    res.json(plan);
  } catch (err) {
    console.error('Error generating plan:', err);
    res.status(500).json({ error: 'Failed to generate architectural plan', message: err.message });
  }
});

// Export Blender Python bpy script
app.post('/api/export/blender-script', (req, res) => {
  try {
    const { plan, customization } = req.body;
    if (!plan) {
      return res.status(400).json({ error: 'Plan data is required' });
    }
    const script = generateBlenderScript(plan, customization);
    res.setHeader('Content-Type', 'text/x-python');
    res.setHeader('Content-Disposition', `attachment; filename=archsynth_${plan.meta.planId}_blender.py`);
    res.send(script);
  } catch (err) {
    console.error('Error exporting Blender script:', err);
    res.status(500).json({ error: 'Failed to export Blender script', message: err.message });
  }
});

// Checkout Session & Construction Handoff Package Unlock
app.post('/api/checkout/create-session', (req, res) => {
  try {
    const { planId, tier = 'standard', currency = 'USD', customer = {} } = req.body;

    const pricing = {
      standard: { USD: 49, INR: 2499, title: 'Standard Construction Blueprint Package' },
      pro: { USD: 79, INR: 3999, title: 'Pro Studio 4K Walkthrough & BIM CAD Package' }
    };

    const selected = pricing[tier] || pricing.standard;
    const amount = selected[currency] || selected.USD;

    // Simulate instant verified session & pass
    const transactionId = `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const downloadToken = `DL-TOKEN-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    res.json({
      success: true,
      transactionId,
      tier,
      tierTitle: selected.title,
      currency,
      amount,
      downloadToken,
      paidAt: new Date().toISOString(),
      customerEmail: customer.email || 'customer@example.com',
      deliverables: [
        'Municipal-Ready 2D CAD Blueprint PDF with Dimensions & Schedules',
        'High-Resolution 4K Exterior & Interior 3D Renders',
        '1080p 60FPS Cinematic Walkthrough Video File (MP4)',
        'Full Blender Procedural Python Scene Script (bpy)',
        'Material Estimation & Bill of Quantities (BoQ) for Builders'
      ],
      message: 'Payment verified successfully! Your construction package is ready for download.'
    });
  } catch (err) {
    console.error('Error in checkout session:', err);
    res.status(500).json({ error: 'Checkout session creation failed', message: err.message });
  }
});

// SPA Fallback: serve index.html for all non-API routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Vercel imports this module as a serverless function. Keep the local
// development server behaviour, but never bind a port inside that runtime.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[ArchSynth Engine] Full-Stack App running on http://localhost:${PORT}`);
  });
}

export default app;
