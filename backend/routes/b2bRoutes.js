// ============================================================
// ===== مسارات B2B =====
// ============================================================

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const {
    createListing,
    getAllListings,
    getProviderListings,
    getListingById,
    updateListing,
    deleteListing
} = require('../controllers/b2bController');

// ===== مسارات عامة =====
router.get('/', getAllListings);
router.get('/:id', getListingById);

// ===== مسارات المزودين =====
router.post('/', auth, roleCheck(['clinic', 'lab', 'radiology']), createListing);
router.get('/provider/my', auth, roleCheck(['clinic', 'lab', 'radiology']), getProviderListings);
router.put('/:id', auth, roleCheck(['clinic', 'lab', 'radiology']), updateListing);
router.delete('/:id', auth, roleCheck(['clinic', 'lab', 'radiology', 'admin']), deleteListing);

module.exports = router;