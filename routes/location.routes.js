const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Get all states and cities
router.get('/states', (req, res) => {
  try {
    const stateData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../utils/state.json'), 'utf8')
    );
    
    res.json({ success: true, data: stateData });
  } catch (error) {
    console.error('Error fetching state data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch state data' });
  }
});

// Get cities for a specific state
router.get('/cities/:state', (req, res) => {
  try {
    const { state } = req.params;
    const stateData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../utils/state.json'), 'utf8')
    );
    
    if (!stateData[state]) {
      return res.status(404).json({ 
        success: false, 
        message: `State '${state}' not found` 
      });
    }
    
    res.json({ 
      success: true, 
      data: stateData[state],
      state: state
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch cities' });
  }
});

module.exports = router;
