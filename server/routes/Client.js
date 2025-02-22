const express = require("express");
const router = express.Router();


const {
    createClient,
    createClientOrder,
    createQuotation,
    convertToOrder,
    getAllClients,
    getQuotation,
    getOrder,
    fetchAllOrder,
    deleteOrderById,
    fetchAllQuotation,
    deleteClients
}  = require("../controllers/Client")


// import middlewares
const { auth , isAdmin } = require("../middlewares/auth");
// create request
router.post('/create',auth,createClient);

router.post("/create-client-order",auth,createClientOrder);

router.post("/create-quotation",auth,createQuotation);

router.put("/convert-to-order",auth,convertToOrder);

router.get('/get-all-clients',auth,getAllClients);

router.get('/get-client-order/:id',auth,getQuotation);

router.get('/get-client-invoice/:id',auth,getOrder);

router.get('/get-all-orders',auth,fetchAllOrder);

router.get('/get-all-quotation',auth,fetchAllQuotation);

router.delete('/delete-order',auth,deleteOrderById);

router.delete('/delete-client',auth,deleteClients);
module.exports = router;
