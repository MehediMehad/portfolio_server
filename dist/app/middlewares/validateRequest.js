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
const validateRequest = (schema, fileFields) => (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let data = (_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : req.body;
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        // ──────────────────────────────────────────────
        // Single file (req.file) – rare in your case, but kept for completeness
        // ──────────────────────────────────────────────
        if (fileFields && req.file) {
            const fileFieldNames = Object.keys(fileFields);
            const file = req.file; // or better: import { CloudinaryFile } or use Express.Multer.File
            if (fileFieldNames.includes(file.fieldname) && fileFields[file.fieldname] === 'single') {
                data[file.fieldname] = file.path; // ← changed from .location to .path
            }
        }
        // ──────────────────────────────────────────────
        // Multiple files (req.files)
        // ──────────────────────────────────────────────
        if (fileFields && req.files) {
            const files = req.files;
            for (const fieldName in fileFields) {
                const config = fileFields[fieldName];
                const uploadedFiles = files[fieldName];
                if (!uploadedFiles || uploadedFiles.length === 0)
                    continue;
                if (config === 'single') {
                    data[fieldName] = uploadedFiles[0].path; // ← .path
                }
                else if (config === 'array') {
                    data[fieldName] = uploadedFiles.map((f) => f.path); // ← .path
                }
                // Nested/dynamic mapping (if you use it later)
                else if (typeof config === 'object' && config.target) {
                    console.log('files🛑🛑🛑', files);
                    const { target, mode, filedName, type } = config;
                    if (data[target] && Array.isArray(data[target])) {
                        const urls = mode === 'array'
                            ? uploadedFiles.map((f) => f.path) // ← .path
                            : [uploadedFiles[0].path]; // ← .path
                        data[target] = data[target].map((item) => {
                            if (type === 'multiple') {
                                return Object.assign(Object.assign({}, item), { [filedName]: urls });
                            }
                            return Object.assign(Object.assign({}, item), { [filedName]: urls[0] });
                        });
                    }
                }
            }
        }
        console.log('🎯 Validated Request:', data);
        yield schema.parseAsync(data);
        req.body = data;
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.default = validateRequest;
