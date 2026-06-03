"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// import passport from 'passport';
// import session from 'express-session';
const ai_1 = __importDefault(require("./routes/ai"));
const rules_1 = __importDefault(require("./routes/rules"));
const auth_1 = __importDefault(require("./routes/auth"));
const campaign_1 = __importDefault(require("./routes/campaign"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'dnd-campaign-secret',
//   resave: false,
//   saveUninitialized: false,
// }));
// app.use(passport.initialize());
// app.use(passport.session());
app.use('/api/ai', ai_1.default);
app.use('/api/rules', rules_1.default);
app.use('/api/auth', auth_1.default);
app.use('/api/campaign', campaign_1.default);
app.get('/', (req, res) => {
    res.json({ message: 'D&D Campaign API Server' });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map