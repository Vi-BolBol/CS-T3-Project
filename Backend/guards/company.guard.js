// guards/company.guard.js
module.exports = (req, res, next) => {
    if (req.user.role !== "COMPANY") {
        return res.status(403).json({
            message: "Company only"
        });
    }

    next();
};