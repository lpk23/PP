const express = require("express");
const { exportPdf, importFile } = require("./export_import");
const fileUpload = require("express-fileupload");
const { verifyToken, checkPermission, permission } = require("./Helpers");
const {search}=require('./kladr')
const {getStat}=require('./Statistica')
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
    updateUserRole,
} = require("./Account");
const {
    createGraduate,
    getAllGraduates,
    getGraduateById,
    updateGraduateById,
    deleteGraduateById,
    searchGraduates,
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
    deleteJobHistory,
} = require("./JobHistory");
const {
    createEmployer,
    searchEmployers,
    getEmployer,
    getEmployers,
    updateEmployer,
    deleteEmployer,
} = require("./employer");

const routes = express.Router();

// Аккаунт
routes.post("/login", login);
routes.post("/register", register);
routes.get("/users", verifyToken, checkPermission([permission.ManageOtherAccounts]), getUsers);
routes.delete("/account", verifyToken, checkPermission([permission.DeleteOwnAccount]), deleteOwnAccount);
routes.delete("/account/:id", verifyToken, checkPermission([permission.ManageOtherAccounts]), deleteOtherAccount);
routes.get("/account", verifyToken, getAccount);
routes.post("/forgot-password", forgotPassword);
routes.post("/reset-password", resetPassword);
routes.post("/verify-reset-code", verifyResetCode);
routes.post("/Role", verifyToken, checkPermission([permission.ManageOtherAccounts]), updateUserRole);

// Выпускники
routes.post("/graduate", verifyToken, checkPermission([permission.ManageGraduates]), createGraduate);
routes.get("/graduate", verifyToken, checkPermission([permission.ManageGraduates, permission.ViewGraduates]), getAllGraduates);
routes.get("/search/graduate", verifyToken, checkPermission([permission.ManageGraduates, permission.ViewGraduates]), searchGraduates);
routes.get("/graduate/:id", verifyToken, checkPermission([permission.ManageGraduates, permission.ViewGraduates]), getGraduateById);
routes.put("/graduate/:id", verifyToken, checkPermission([permission.ManageGraduates]), updateGraduateById);
routes.delete("/graduate/:id", verifyToken, checkPermission([permission.ManageGraduates]), deleteGraduateById);

// Направления подготовки
routes.post("/training", verifyToken, checkPermission([permission.ManageTrainingDirection]), createTrainingDirection);
routes.get("/training", verifyToken, checkPermission([permission.ManageTrainingDirection, permission.ManageGraduates]), getAllTrainingDirections);
routes.get("/training/:id", verifyToken, checkPermission([permission.ManageTrainingDirection, permission.ManageGraduates]), getTrainingDirectionById);
routes.put("/training/:id", verifyToken, checkPermission([permission.ManageTrainingDirection]), updateTrainingDirection);
routes.delete("/training/:id", verifyToken, checkPermission([permission.ManageTrainingDirection]), deleteTrainingDirection);

// История работы
routes.post("/job", verifyToken, checkPermission([permission.ManageJobHistory]), createJobHistory);
routes.get("/job", verifyToken, checkPermission([permission.ManageJobHistory, permission.ManageGraduates]), getAllJobHistory);
routes.get("/job/:id", verifyToken, checkPermission([permission.ManageJobHistory, permission.ManageGraduates]), getJobHistoryById);
routes.put("/job/:id", verifyToken, checkPermission([permission.ManageJobHistory]), updateJobHistory);
routes.delete("/job/:id", verifyToken, checkPermission([permission.ManageJobHistory]), deleteJobHistory);

// Работодатели
routes.post("/employer", verifyToken, checkPermission([permission.ManageEmployers]), createEmployer);
routes.get("/search/employer", verifyToken, checkPermission([permission.ManageEmployers]), searchEmployers);
routes.get("/employer/:id", verifyToken, checkPermission([permission.ManageEmployers, permission.ManageGraduates]), getEmployer);
routes.get("/employer", verifyToken, checkPermission([permission.ManageEmployers, permission.ManageGraduates]), getEmployers);
routes.put("/employer/:id", verifyToken, checkPermission([permission.ManageEmployers]), updateEmployer);
routes.delete("/employer/:id", verifyToken, checkPermission([permission.ManageEmployers]), deleteEmployer);

// export and import
routes.post("/export", verifyToken, checkPermission([permission.ExportToPDF]), exportPdf);
routes.post("/import", verifyToken, checkPermission([permission.ImportData]), fileUpload(), importFile);

routes.get("/kladr",verifyToken,search);
module.exports = routes;

// stats
routes.get("/stat",verifyToken,getStat);

// TODO: Упразнить права
