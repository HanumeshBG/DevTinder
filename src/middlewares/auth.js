const adminAuth = (req, res, next) => {
    const token = "xyz";
    const isAdminUser = token === "xyz";
    if (!isAdminUser) {
        res.status(403).send("Access denied. Admins only.");
    } else {
        next();
    }
}

const userAuth = (req, res, next) => {
    const token = "xyz";
    const isAdminUser = token === "xyz";
    if (!isAdminUser) {
        res.status(403).send("Access denied. Admins only.");
    } else {
        next();
    }
}

module.exports = {
    adminAuth,
    userAuth
}