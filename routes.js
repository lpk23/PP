const express = require("express");
const { verifyToken, checkPermission } = require("./Helpers");
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
} = require("./Graduate");
const {
    createTrainingDirection,
    getAllTrainingDirections,
    getTrainingDirectionById,
    updateTrainingDirection,
    deleteTrainingDirection,
} = require("./TrainingDirection");

const {
    createJobHistory,
    getAllJobHistory,
    getJobHistoryById,
    updateJobHistory,
    deleteJobHistory
}=require("./JobHistory")

const routes = express.Router();
const permission = {
    ViewGraduates: 'ViewGraduates',
    ViewGraduateDetails: 'ViewGraduateDetails',
    ManageGraduates: 'ManageGraduates',
    ManageEmploymentInfo: 'ManageEmploymentInfo',
    ExportToPDF: 'ExportToPDF',
    ImportData: 'ImportData',
    ViewEmployers: 'ViewEmployers',
    ViewEmployerDetails: 'ViewEmployerDetails',
    DeleteOwnAccount: 'DeleteOwnAccount',
    ManageOtherAccounts: 'ManageOtherAccounts',
    ManageTrainingDirection: 'ManageTrainingDirection',
    ManageJobHistory: 'ManageJobHistory'
};

// Аккаунт
routes.post("/login", login);
routes.post("/register", register);
routes.get("/users", verifyToken, checkPermission([permission.ManageOtherAccounts]), getUsers);
routes.delete("/account", verifyToken, checkPermission([permission.DeleteOwnAccount]), deleteOwnAccount);
routes.delete("/account/:id", verifyToken,checkPermission([permission.ManageOtherAccounts]), deleteOtherAccount);
routes.get("/account", verifyToken, getAccount);
routes.post("/forgot-password", forgotPassword);
routes.post("/reset-password", resetPassword);
routes.post("/verify-reset-code", verifyResetCode);

// Выпускники
routes.post("/graduate", verifyToken, checkPermission([permission.ManageGraduates]), createGraduate);
routes.get("/graduate", verifyToken, checkPermission([permission.ManageGraduates, permission.ViewGraduateDetails, permission.ViewGraduates]), getAllGraduates);
routes.get("/graduate/:id", verifyToken, checkPermission([permission.ManageGraduates, permission.ViewGraduateDetails, permission.ViewGraduates]), getGraduateById);
routes.put("/graduate/:id", verifyToken, checkPermission([permission.ManageGraduates]), updateGraduateById);
routes.delete("/graduate/:id", verifyToken, checkPermission([permission.ManageGraduates]), deleteGraduateById);

// Направления подготовки
routes.post("/training", verifyToken, checkPermission([permission.ManageTrainingDirection]), createTrainingDirection);
routes.get("/training", verifyToken, checkPermission([permission.ManageTrainingDirection,permission.ManageGraduates,permission.ViewGraduateDetails]), getAllTrainingDirections);
routes.get("/training/:id", verifyToken, checkPermission([permission.ManageTrainingDirection]), getTrainingDirectionById);
routes.put("/training/:id", verifyToken, checkPermission([permission.ManageTrainingDirection]), updateTrainingDirection);
routes.delete("/training/:id", verifyToken, checkPermission([permission.ManageTrainingDirection]), deleteTrainingDirection);

// История работы
routes.post("/job", verifyToken, checkPermission([permission.ManageJobHistory]), createJobHistory);
routes.get("/job", verifyToken, checkPermission([permission.ManageJobHistory]), getAllJobHistory);
routes.get("/job/:id", verifyToken, checkPermission([permission.ManageJobHistory]), getJobHistoryById);
routes.put("/job/:id", verifyToken, checkPermission([permission.ManageJobHistory]), updateJobHistory);
routes.delete("/job/:id", verifyToken, checkPermission([permission.ManageJobHistory]), deleteJobHistory);

module.exports = routes;

