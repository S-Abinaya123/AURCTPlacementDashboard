import express from 'express';
const router = express.Router();

router.get('/api', (req, res) => {
    res.send("Welcome to the AURCT Placement Dashboard API");   
});

router.post("/api/getotp", (req, res) => {
    res.json({message: "OTP sent successfully"});
});

router.post("/api/verifyotp", (req, res) => {
    res.json({message: "OTP verified successfully"});
});

router.post("/api/tokenverification", (req, res) => {
    res.json({message: "Token verified successfully"});
    res.json({valid: true});
})

router.get("/api/resetpassword", (req, res) => {
    res.json({message: "Password reset successfully"});

}
);

export default router;





