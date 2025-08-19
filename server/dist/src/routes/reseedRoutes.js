"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reseedRoutes = void 0;
const express_1 = require("express");
const reseed_1 = require("../admin/reseed");
exports.reseedRoutes = (0, express_1.Router)();
exports.reseedRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { deltaDays, anchorDaysAgo } = (_a = req.body) !== null && _a !== void 0 ? _a : {};
        const result = yield (0, reseed_1.reseedFromJson)({ deltaDays, anchorDaysAgo });
        res.json(Object.assign({ ok: true }, result));
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ ok: false, error: (_b = e === null || e === void 0 ? void 0 : e.message) !== null && _b !== void 0 ? _b : "reseed failed" });
    }
}));
