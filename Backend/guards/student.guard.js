// guards/student.guard.js
module.exports = (req, res, next) => {
    if (req.user.role !== "STUDENT") {
        return res.status(403).json({
            message: "Student only"
        });
    }

    next();
};