// guards/company.guard.js

const companyGuard = (req, res, next) => {
    if (!req.user || req.user.role !== "company") {
        return res.status(403).json({
            message: "Company only"
        });
    }

    next();
};

export default companyGuard;
