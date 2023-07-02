const express = require("express");
const { verifyToken } = require("./Helpers");
const {
    login,
    register,
    getAccount,
    getUsers,
    deleteOwnAccount,
    deleteOtherAccount,
    forgotPassword,
    resetPassword,
    verifyResetCode,
} = require("./Account");
const {
    createGraduate,
    getAllGraduates,
    getGraduateById,
    updateGraduateById,
    deleteGraduateById,
} = require("./graduate");

const routes = express.Router();

//Аккаунт
routes.post("/login", login);
routes.post("/register", register);
routes.get("/users", verifyToken, getUsers);
routes.delete("/account", verifyToken, deleteOwnAccount);
routes.delete("/account/:id", verifyToken, deleteOtherAccount);
routes.get("/account", verifyToken, getAccount);
routes.post("/forgot-password", forgotPassword);
routes.post("/reset-password", resetPassword);
routes.post("/verify-reset-code", verifyResetCode);

//Выпустники
routes.post("/graduate", verifyToken, createGraduate);
routes.get("/graduate", verifyToken, getAllGraduates);
routes.get("/graduate/:id", verifyToken, getGraduateById);
routes.post("/graduate/:id", verifyToken, updateGraduateById);
routes.delete("/graduate/:id", verifyToken, deleteGraduateById);

//


module.exports = routes;
