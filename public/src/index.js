"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const busRoutes_1 = __importDefault(require("./routes/busRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
require("./schedulers/busScheduler");
const app = (0, express_1.default)();
app.use(body_parser_1.default.json({ limit: "50mb" }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.urlencoded({ limit: "50mb", extended: true }));
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true,
}));
app.use("/auth", authRoutes_1.default);
app.use("/bus", busRoutes_1.default);
app.use("/user", userRoutes_1.default);
mongoose_1.default
    .connect("mongodb+srv://pranavg21:W083lMyBkVjrV6Iw@cluster0.qjoxsuo.mongodb.net/")
    .then(() => {
    app.listen(5000, () => {
        console.log("App Running on Port 5000");
    });
})
    .catch((error) => {
    console.log("Error in Connecting Database");
    console.log(error);
});
