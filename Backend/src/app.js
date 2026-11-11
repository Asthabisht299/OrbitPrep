const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
const allowedOrigins = new Set([
    "http://localhost:5173",
    "http://localhost:5174"
])

app.use(cors({
    origin: (origin, callback) => {
        // Allow non-browser clients such as Postman and same-origin requests.
        if (!origin || allowedOrigins.has(origin)) {
            return callback(null, true)
        }

        return callback(new Error("Origin not allowed by CORS"))
    },
    credentials: true
}))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

/* Keep upload and route errors in a predictable JSON format. */
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }

    const isUploadError =
        err.name === "MulterError" ||
        err.message === "Only PDF resumes are supported."

    const statusCode = isUploadError ? 400 : 500
    const message = isUploadError
        ? err.message
        : "Something went wrong while processing your request."

    if (statusCode === 500) {
        console.error("API error:", err)
    }

    return res.status(statusCode).json({ message })
})

module.exports = app
